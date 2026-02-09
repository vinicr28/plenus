import { createClient } from "@/lib/supabase/server";
import LeadsTable from "@/components/admin/LeadsTable";

export default async function LeadsPage() {
  const supabase = await createClient();

  const { data: leads } = await supabase
    .from("leads")
    .select("*")
    .order("created_at", { ascending: false });

  const allLeads = (leads ?? []) as {
    id: string;
    form_type: string;
    status: string;
    nome: string;
    email: string | null;
    telefone: string | null;
    tipo_projeto: string | null;
    mensagem: string | null;
    assunto: string | null;
    descricao: string | null;
    area_interesse: string | null;
    sobre_voce: string | null;
    cpf: string | null;
    endereco: string | null;
    data_nascimento: string | null;
    observacao: string | null;
    notes: string | null;
    created_at: string;
  }[];

  return (
    <div className="p-8">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-[#1a1a1a]">Leads</h1>
        <p className="text-gray-500 mt-1">Gerencie os leads capturados pelos formulários</p>
      </div>

      {/* Leads Table */}
      <LeadsTable leads={allLeads} />
    </div>
  );
}
