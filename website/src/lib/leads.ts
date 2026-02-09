import { createServiceClient } from '@/lib/supabase/server';
import { LeadInsert } from '@/types/database';

export async function saveLead(lead: LeadInsert) {
  const supabase = await createServiceClient();

  const { data, error } = await supabase
    .from('leads')
    .insert(lead as never)
    .select()
    .single();

  if (error) {
    console.error('Error saving lead:', error);
    throw error;
  }

  return data;
}
