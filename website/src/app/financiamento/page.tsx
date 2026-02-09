import { Metadata } from "next";
import FinanciamentoClient from "./FinanciamentoClient";

export const metadata: Metadata = {
  title: "Financiamento",
  description:
    "Assessoria completa para seu financiamento imobiliário. Análise de crédito personalizada, parceria com os principais bancos e taxas competitivas.",
  openGraph: {
    title: "Financiamento | Plenus Obras",
    description:
      "Assessoria completa para seu financiamento imobiliário. Análise de crédito personalizada e parceria com os principais bancos.",
    type: "website",
  },
};

export default function FinanciamentoPage() {
  return <FinanciamentoClient />;
}
