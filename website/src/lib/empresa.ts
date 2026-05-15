export const FUNDACAO_ANO = 2016;

export function getAnosDeMercado(): number {
  return new Date().getFullYear() - FUNDACAO_ANO;
}
