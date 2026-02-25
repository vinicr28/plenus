const formTypeLabels: Record<string, string> = {
  contact: "Contato",
  "pos-venda": "Pós-venda",
  "trabalhe-conosco": "Trabalhe Conosco",
  financiamento: "Financiamento",
};

export async function sendPushNotification(
  formType: string,
  data: Record<string, string>
): Promise<void> {
  const topic = process.env.NTFY_TOPIC;
  if (!topic) {
    console.warn("NTFY_TOPIC not set, skipping push notification");
    return;
  }

  const label = formTypeLabels[formType] || formType;
  const nome = data.nome || "Não informado";
  const telefone = data.telefone || "Não informado";
  const horario = new Date().toLocaleString("pt-BR", {
    timeZone: "America/Sao_Paulo",
  });

  try {
    await fetch(`https://ntfy.sh/${topic}`, {
      method: "POST",
      headers: {
        Title: `Novo Lead - ${label}`,
        Priority: "high",
        Tags: "incoming_envelope",
      },
      body: `👤 ${nome}\n📱 ${telefone}\n🕐 ${horario}`,
    });
  } catch (error) {
    console.error("ntfy push error:", error);
  }
}
