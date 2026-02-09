import { createClient } from '@/lib/supabase/server';
import ReviewsTable from '@/components/admin/ReviewsTable';

export default async function ReviewsPage() {
  const supabase = await createClient();

  const { data: reviews, error } = await supabase
    .from('reviews')
    .select('*')
    .order('created_at', { ascending: false }) as {
      data: {
        id: string;
        name: string;
        email: string;
        rating: number;
        comment: string;
        location: string | null;
        approved: boolean;
        created_at: string;
      }[] | null;
      error: unknown
    };

  if (error) {
    console.error('Error fetching reviews:', error);
  }

  const pendingCount = reviews?.filter(r => !r.approved).length ?? 0;
  const approvedCount = reviews?.filter(r => r.approved).length ?? 0;

  return (
    <div className="p-8">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-[#1a1a1a]">Avaliações</h1>
        <p className="text-gray-500 mt-1">Gerencie as avaliações dos clientes</p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-8">
        <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
          <div className="flex items-center gap-4">
            <div className="p-3 bg-yellow-100 rounded-lg text-yellow-600">
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
            <div>
              <p className="text-sm text-gray-500">Pendentes</p>
              <p className="text-2xl font-bold text-[#1a1a1a]">{pendingCount}</p>
            </div>
          </div>
        </div>
        <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
          <div className="flex items-center gap-4">
            <div className="p-3 bg-green-100 rounded-lg text-green-600">
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
              </svg>
            </div>
            <div>
              <p className="text-sm text-gray-500">Aprovadas</p>
              <p className="text-2xl font-bold text-[#1a1a1a]">{approvedCount}</p>
            </div>
          </div>
        </div>
      </div>

      {/* Reviews Table */}
      <ReviewsTable reviews={reviews ?? []} />
    </div>
  );
}
