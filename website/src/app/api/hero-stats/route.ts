import { NextResponse } from 'next/server';
import { createServiceClient } from '@/lib/supabase/server';

const DEFAULT_STATS = [
  { position: 1, value: '150+', label: 'Obras Entregues', prefix: null },
  { position: 2, value: '40%', label: 'de Economia Garantida', prefix: 'Até ' },
  { position: 3, value: '9', label: 'Anos de Mercado', prefix: null },
  { position: 4, value: '150+', label: 'Famílias Satisfeitas', prefix: null },
];

export async function GET() {
  try {
    const supabase = await createServiceClient();

    const { data, error } = await supabase
      .from('hero_stats')
      .select('position, value, label, prefix')
      .order('position');

    if (error || !data || data.length === 0) {
      return NextResponse.json(DEFAULT_STATS);
    }

    return NextResponse.json(data);
  } catch {
    return NextResponse.json(DEFAULT_STATS);
  }
}
