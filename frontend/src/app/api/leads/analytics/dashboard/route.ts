// SOLUÇÃO NUCLEAR: COMPLETAMENTE ESTÁTICA
export const dynamic = 'force-static';
export const revalidate = false;

export async function GET() {
  // SEMPRE retorna dados vazios - NUNCA tenta conectar a banco
  return Response.json({
    totalLeads: 0,
    leadsPorDia: [],
    statusCount: {},
    vendedoresCount: {}
  });
}