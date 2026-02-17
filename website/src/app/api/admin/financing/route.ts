import { NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';
import { InterestRateValue, Json } from '@/types/database';

export async function GET() {
  const supabase = await createClient();

  const { data: { user }, error: authError } = await supabase.auth.getUser();
  if (authError || !user) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const { data, error } = await supabase
    .from('financing_settings')
    .select('*')
    .eq('key', 'interest_rate')
    .single();

  if (error) {
    return NextResponse.json({ annual_rate: 10.49, description: 'Taxa de juros anual padrão', updated_at: null });
  }

  const value = data.value as unknown as InterestRateValue;
  return NextResponse.json({
    annual_rate: value.annual_rate,
    description: value.description,
    updated_at: data.updated_at,
  });
}

export async function PUT(request: Request) {
  const supabase = await createClient();

  const { data: { user }, error: authError } = await supabase.auth.getUser();
  if (authError || !user) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const body = await request.json();
  const { annual_rate, description } = body;

  if (typeof annual_rate !== 'number' || annual_rate < 0 || annual_rate > 100) {
    return NextResponse.json({ error: 'annual_rate deve ser um número entre 0 e 100' }, { status: 400 });
  }

  const value: InterestRateValue = {
    annual_rate,
    description: description || undefined,
  };

  const { data, error } = await supabase
    .from('financing_settings')
    .upsert(
      { key: 'interest_rate', value: value as unknown as Json },
      { onConflict: 'key' }
    )
    .select()
    .single();

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  const savedValue = data.value as unknown as InterestRateValue;
  return NextResponse.json({
    annual_rate: savedValue.annual_rate,
    description: savedValue.description,
    updated_at: data.updated_at,
  });
}
