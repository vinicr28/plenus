import { NextRequest, NextResponse } from 'next/server';
import { saveLead } from '@/lib/leads';
import { LeadInsert } from '@/types/database';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { formType, data } = body;

    if (!formType || !data || !data.nome) {
      return NextResponse.json(
        { error: 'Dados inválidos' },
        { status: 400 }
      );
    }

    const lead: LeadInsert = {
      form_type: formType,
      nome: data.nome,
      email: data.email || null,
      telefone: data.telefone || null,
      mensagem: data.mensagem || null,
    };

    await saveLead(lead);

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Error saving lead:', error);
    return NextResponse.json(
      { error: 'Erro ao salvar lead' },
      { status: 500 }
    );
  }
}
