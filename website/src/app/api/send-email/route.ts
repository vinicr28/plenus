import { NextRequest, NextResponse } from "next/server";
import { Resend } from "resend";
import { saveLead } from "@/lib/leads";
import { sendPushNotification } from "@/lib/notify";
import { LeadInsert } from "@/types/database";

const resend = new Resend(process.env.RESEND_API_KEY);

interface EmailPayload {
  formType: "contact" | "pos-venda" | "trabalhe-conosco";
  data: Record<string, string>;
}

function formatEmailHtml(formType: string, data: Record<string, string>): string {
  const timestamp = new Date().toLocaleString("pt-BR", {
    timeZone: "America/Sao_Paulo",
  });

  const formTypeLabels: Record<string, string> = {
    contact: "Contato - Solicitação de Orçamento",
    "pos-venda": "Pós-venda",
    "trabalhe-conosco": "Trabalhe Conosco",
  };

  const fieldLabels: Record<string, string> = {
    nome: "Nome",
    email: "E-mail",
    telefone: "Telefone",
    tipoProjeto: "Tipo de Projeto",
    mensagem: "Mensagem",
    endereco: "Endereço da Obra",
    assunto: "Assunto",
    descricao: "Descrição",
    areaInteresse: "Área de Interesse",
    sobreVoce: "Sobre o Candidato",
  };

  const rows = Object.entries(data)
    .map(([key, value]) => {
      const label = fieldLabels[key] || key;
      return `
        <tr>
          <td style="padding: 12px 16px; border-bottom: 1px solid #e5e7eb; font-weight: 600; color: #374151; width: 150px; vertical-align: top;">
            ${label}
          </td>
          <td style="padding: 12px 16px; border-bottom: 1px solid #e5e7eb; color: #1f2937;">
            ${value.replace(/\n/g, "<br>")}
          </td>
        </tr>
      `;
    })
    .join("");

  return `
    <!DOCTYPE html>
    <html>
      <head>
        <meta charset="utf-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
      </head>
      <body style="margin: 0; padding: 0; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif; background-color: #f3f4f6;">
        <div style="max-width: 600px; margin: 0 auto; padding: 40px 20px;">
          <div style="background-color: #ffffff; border-radius: 16px; overflow: hidden; box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1);">
            <!-- Header -->
            <div style="background-color: #c41e3a; padding: 24px 32px;">
              <h1 style="margin: 0; color: #ffffff; font-size: 24px; font-weight: 700;">
                Plenus Obras
              </h1>
              <p style="margin: 8px 0 0; color: rgba(255,255,255,0.9); font-size: 14px;">
                ${formTypeLabels[formType] || formType}
              </p>
            </div>

            <!-- Content -->
            <div style="padding: 32px;">
              <table style="width: 100%; border-collapse: collapse;">
                ${rows}
              </table>

              <div style="margin-top: 24px; padding-top: 24px; border-top: 1px solid #e5e7eb;">
                <p style="margin: 0; font-size: 12px; color: #6b7280;">
                  Enviado em: ${timestamp}
                </p>
              </div>
            </div>
          </div>

          <p style="text-align: center; margin-top: 24px; font-size: 12px; color: #6b7280;">
            Este e-mail foi enviado através do site da Plenus Obras.
          </p>
        </div>
      </body>
    </html>
  `;
}

function getEmailSubject(formType: string, data: Record<string, string>): string {
  switch (formType) {
    case "contact":
      return `[Plenus] Contato - ${data.nome || "Nova solicitação"}`;
    case "pos-venda":
      return `[Plenus] Pós-venda - ${data.assunto || "Nova solicitação"}`;
    case "trabalhe-conosco":
      return `[Plenus] Trabalhe Conosco - ${data.nome || "Nova candidatura"}`;
    default:
      return `[Plenus] Nova mensagem do site`;
  }
}

export async function POST(request: NextRequest) {
  try {
    const body: EmailPayload = await request.json();
    const { formType, data } = body;

    if (!formType || !data) {
      return NextResponse.json(
        { error: "Dados inválidos" },
        { status: 400 }
      );
    }

    const recipientsByType: Record<EmailPayload["formType"], string | undefined> = {
      contact: process.env.EMAIL_TO_COMERCIAL,
      "pos-venda": process.env.EMAIL_TO_POSVENDA,
      "trabalhe-conosco": process.env.EMAIL_TO_POSVENDA,
    };

    const alwaysCc = (process.env.EMAIL_ALWAYS_CC || "")
      .split(",")
      .map((e) => e.trim())
      .filter(Boolean);

    const primary = recipientsByType[formType];
    const emailTo = Array.from(
      new Set([...(primary ? [primary] : []), ...alwaysCc])
    );

    if (emailTo.length === 0) {
      console.error("Nenhum destinatário configurado para formType:", formType);
      return NextResponse.json(
        { error: "Configuração de email ausente" },
        { status: 500 }
      );
    }

    const { error } = await resend.emails.send({
      from: "Plenus Obras <onboarding@resend.dev>",
      to: emailTo,
      subject: getEmailSubject(formType, data),
      html: formatEmailHtml(formType, data),
    });

    if (error) {
      console.error("Resend error:", error);
      return NextResponse.json(
        { error: "Erro ao enviar e-mail" },
        { status: 500 }
      );
    }

    // Save lead and send push notification (non-blocking)
    try {
      const lead = mapFormDataToLead(formType, data);
      await saveLead(lead);
    } catch (leadError) {
      console.error("Error saving lead to DB:", leadError);
    }

    await sendPushNotification(formType, data);

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("API error:", error);
    return NextResponse.json(
      { error: "Erro interno do servidor" },
      { status: 500 }
    );
  }
}

function mapFormDataToLead(formType: string, data: Record<string, string>): LeadInsert {
  const base: LeadInsert = {
    form_type: formType,
    nome: data.nome || 'Não informado',
    email: data.email || null,
    telefone: data.telefone || null,
  };

  switch (formType) {
    case 'contact':
      return { ...base, tipo_projeto: data.tipoProjeto || null, mensagem: data.mensagem || null };
    case 'pos-venda':
      return { ...base, endereco: data.endereco || null, mensagem: data.mensagem || null };
    case 'trabalhe-conosco':
      return { ...base, area_interesse: data.areaInteresse || null, sobre_voce: data.sobreVoce || null };
    default:
      return base;
  }
}
