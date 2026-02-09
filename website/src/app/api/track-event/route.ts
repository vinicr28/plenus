import { NextRequest, NextResponse } from 'next/server';
import { createServiceClient } from '@/lib/supabase/server';

const VALID_EVENT_TYPES = ['modal_open', 'cta_click'];

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { projectId, eventType } = body;

    if (!projectId || !eventType || !VALID_EVENT_TYPES.includes(eventType)) {
      return NextResponse.json(
        { error: 'Dados inválidos' },
        { status: 400 }
      );
    }

    const supabase = await createServiceClient();

    const { error } = await supabase
      .from('project_events')
      .insert({ project_id: projectId, event_type: eventType } as never);

    if (error) {
      console.error('Error tracking event:', error);
      return NextResponse.json(
        { error: 'Erro ao registrar evento' },
        { status: 500 }
      );
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Error tracking event:', error);
    return NextResponse.json(
      { error: 'Erro ao registrar evento' },
      { status: 500 }
    );
  }
}
