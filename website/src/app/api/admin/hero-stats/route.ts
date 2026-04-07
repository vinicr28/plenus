import { NextResponse } from 'next/server';
import { revalidatePath } from 'next/cache';
import { createClient } from '@/lib/supabase/server';

export async function GET() {
  const supabase = await createClient();

  const { data: { user }, error: authError } = await supabase.auth.getUser();
  if (authError || !user) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const { data, error } = await supabase
    .from('hero_stats')
    .select('*')
    .order('position');

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  return NextResponse.json(data);
}

export async function PUT(request: Request) {
  const supabase = await createClient();

  const { data: { user }, error: authError } = await supabase.auth.getUser();
  if (authError || !user) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const body = await request.json();

  if (!Array.isArray(body) || body.length !== 3) {
    return NextResponse.json({ error: 'Deve enviar exatamente 3 stats' }, { status: 400 });
  }

  for (const stat of body) {
    if (!stat.value || !stat.label || typeof stat.position !== 'number' || stat.position < 1 || stat.position > 3) {
      return NextResponse.json({ error: 'Cada stat deve ter position (1-3), value e label' }, { status: 400 });
    }
  }

  const upsertData = body.map((stat: { position: number; value: string; label: string; prefix?: string }) => ({
    position: stat.position,
    value: stat.value,
    label: stat.label,
    prefix: stat.prefix || null,
    updated_at: new Date().toISOString(),
  }));

  const { data, error } = await supabase
    .from('hero_stats')
    .upsert(upsertData, { onConflict: 'position' })
    .select()
    .order('position');

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  revalidatePath('/');
  revalidatePath('/construtora-em-indaiatuba');
  revalidatePath('/construtora-em-jundiai');

  return NextResponse.json(data);
}
