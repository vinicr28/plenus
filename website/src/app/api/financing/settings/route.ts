import { NextResponse } from 'next/server';
import { createServiceClient } from '@/lib/supabase/server';
import { InterestRateValue } from '@/types/database';

const DEFAULT_RATE: InterestRateValue = {
  annual_rate: 10.49,
  description: 'Taxa de juros anual padrão',
};

export async function GET() {
  try {
    const supabase = await createServiceClient();

    const { data, error } = await supabase
      .from('financing_settings')
      .select('value')
      .eq('key', 'interest_rate')
      .single();

    if (error || !data) {
      return NextResponse.json(DEFAULT_RATE);
    }

    const value = data.value as unknown as InterestRateValue;
    return NextResponse.json({
      annual_rate: value.annual_rate ?? DEFAULT_RATE.annual_rate,
      description: value.description ?? DEFAULT_RATE.description,
    });
  } catch {
    return NextResponse.json(DEFAULT_RATE);
  }
}
