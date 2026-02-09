"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

interface Review {
  id: string;
  name: string;
  email: string;
  rating: number;
  comment: string;
  location: string | null;
  approved: boolean;
  created_at: string;
}

interface ReviewsTableProps {
  reviews: Review[];
}

function StarDisplay({ rating }: { rating: number }) {
  return (
    <div className="flex gap-0.5">
      {[1, 2, 3, 4, 5].map((star) => (
        <svg
          key={star}
          className={`w-4 h-4 ${star <= rating ? "text-yellow-400" : "text-gray-300"}`}
          fill="currentColor"
          viewBox="0 0 20 20"
        >
          <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
        </svg>
      ))}
    </div>
  );
}

export default function ReviewsTable({ reviews }: ReviewsTableProps) {
  const router = useRouter();
  const [filter, setFilter] = useState<"all" | "pending" | "approved">("all");
  const [deletingId, setDeletingId] = useState<string | null>(null);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [reviewToDelete, setReviewToDelete] = useState<Review | null>(null);
  const [editingLocation, setEditingLocation] = useState<string | null>(null);
  const [locationValue, setLocationValue] = useState("");

  const filteredReviews = reviews.filter((review) => {
    if (filter === "pending") return !review.approved;
    if (filter === "approved") return review.approved;
    return true;
  });

  const handleApprove = async (review: Review) => {
    try {
      const response = await fetch(`/api/admin/reviews/${review.id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ approved: true }),
      });

      if (!response.ok) throw new Error("Failed to approve review");
      router.refresh();
    } catch (error) {
      console.error("Error approving review:", error);
      alert("Erro ao aprovar avaliação");
    }
  };

  const handleReject = async (review: Review) => {
    try {
      const response = await fetch(`/api/admin/reviews/${review.id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ approved: false }),
      });

      if (!response.ok) throw new Error("Failed to reject review");
      router.refresh();
    } catch (error) {
      console.error("Error rejecting review:", error);
      alert("Erro ao rejeitar avaliação");
    }
  };

  const handleDeleteClick = (review: Review) => {
    setReviewToDelete(review);
    setShowDeleteModal(true);
  };

  const handleConfirmDelete = async () => {
    if (!reviewToDelete) return;

    setDeletingId(reviewToDelete.id);
    try {
      const response = await fetch(`/api/admin/reviews/${reviewToDelete.id}`, {
        method: "DELETE",
      });

      if (!response.ok) throw new Error("Failed to delete review");
      router.refresh();
    } catch (error) {
      console.error("Error deleting review:", error);
      alert("Erro ao excluir avaliação");
    } finally {
      setDeletingId(null);
      setShowDeleteModal(false);
      setReviewToDelete(null);
    }
  };

  const handleSaveLocation = async (review: Review) => {
    try {
      const response = await fetch(`/api/admin/reviews/${review.id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ location: locationValue }),
      });

      if (!response.ok) throw new Error("Failed to update location");
      setEditingLocation(null);
      router.refresh();
    } catch (error) {
      console.error("Error updating location:", error);
      alert("Erro ao atualizar localização");
    }
  };

  return (
    <>
      {/* Filter Tabs */}
      <div className="flex gap-2 mb-6">
        {[
          { key: "all", label: "Todas" },
          { key: "pending", label: "Pendentes" },
          { key: "approved", label: "Aprovadas" },
        ].map((tab) => (
          <button
            key={tab.key}
            onClick={() => setFilter(tab.key as typeof filter)}
            className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
              filter === tab.key
                ? "bg-[#1a1a1a] text-white"
                : "bg-gray-100 text-gray-600 hover:bg-gray-200"
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* Reviews List */}
      <div className="space-y-4">
        {filteredReviews.map((review) => (
          <div
            key={review.id}
            className={`bg-white rounded-xl shadow-sm border p-6 ${
              review.approved ? "border-green-200" : "border-yellow-200"
            }`}
          >
            <div className="flex items-start justify-between gap-4">
              <div className="flex-1">
                {/* Header */}
                <div className="flex items-center gap-3 mb-3">
                  <div className="w-10 h-10 bg-[#c41e3a]/10 rounded-full flex items-center justify-center">
                    <span className="text-[#c41e3a] font-bold">
                      {review.name.split(" ").map(n => n[0]).join("").slice(0, 2)}
                    </span>
                  </div>
                  <div>
                    <p className="font-semibold text-[#1a1a1a]">{review.name}</p>
                    <p className="text-sm text-gray-500">{review.email}</p>
                  </div>
                  <StarDisplay rating={review.rating} />
                  <span
                    className={`px-2 py-1 text-xs rounded-full ${
                      review.approved
                        ? "bg-green-100 text-green-700"
                        : "bg-yellow-100 text-yellow-700"
                    }`}
                  >
                    {review.approved ? "Aprovada" : "Pendente"}
                  </span>
                </div>

                {/* Comment */}
                <p className="text-gray-700 mb-3">&ldquo;{review.comment}&rdquo;</p>

                {/* Location */}
                <div className="flex items-center gap-2 text-sm text-gray-500">
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                  </svg>
                  {editingLocation === review.id ? (
                    <div className="flex items-center gap-2">
                      <input
                        type="text"
                        value={locationValue}
                        onChange={(e) => setLocationValue(e.target.value)}
                        className="px-2 py-1 border rounded text-sm"
                        placeholder="Ex: Indaiatuba, SP"
                      />
                      <button
                        onClick={() => handleSaveLocation(review)}
                        className="text-green-600 hover:text-green-700"
                      >
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                        </svg>
                      </button>
                      <button
                        onClick={() => setEditingLocation(null)}
                        className="text-gray-500 hover:text-gray-700"
                      >
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                        </svg>
                      </button>
                    </div>
                  ) : (
                    <>
                      <span>{review.location || "Não informado"}</span>
                      <button
                        onClick={() => {
                          setEditingLocation(review.id);
                          setLocationValue(review.location || "");
                        }}
                        className="text-[#c41e3a] hover:underline text-xs"
                      >
                        Editar
                      </button>
                    </>
                  )}
                </div>

                {/* Date */}
                <p className="text-xs text-gray-400 mt-2">
                  {new Date(review.created_at).toLocaleDateString("pt-BR", {
                    day: "2-digit",
                    month: "long",
                    year: "numeric",
                    hour: "2-digit",
                    minute: "2-digit"
                  })}
                </p>
              </div>

              {/* Actions */}
              <div className="flex flex-col gap-2">
                {!review.approved && (
                  <button
                    onClick={() => handleApprove(review)}
                    className="px-3 py-1.5 bg-green-600 text-white text-sm rounded-lg hover:bg-green-700 transition-colors"
                  >
                    Aprovar
                  </button>
                )}
                {review.approved && (
                  <button
                    onClick={() => handleReject(review)}
                    className="px-3 py-1.5 bg-yellow-500 text-white text-sm rounded-lg hover:bg-yellow-600 transition-colors"
                  >
                    Ocultar
                  </button>
                )}
                <button
                  onClick={() => handleDeleteClick(review)}
                  disabled={deletingId === review.id}
                  className="px-3 py-1.5 border border-red-300 text-red-600 text-sm rounded-lg hover:bg-red-50 transition-colors disabled:opacity-50"
                >
                  Excluir
                </button>
              </div>
            </div>
          </div>
        ))}

        {filteredReviews.length === 0 && (
          <div className="text-center py-12 bg-white rounded-xl border border-gray-100">
            <svg className="w-12 h-12 text-gray-300 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
            </svg>
            <p className="text-gray-500">Nenhuma avaliação encontrada</p>
          </div>
        )}
      </div>

      {/* Delete Confirmation Modal */}
      {showDeleteModal && reviewToDelete && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-white rounded-xl p-6 max-w-md w-full mx-4 shadow-2xl">
            <h3 className="text-lg font-semibold text-[#1a1a1a] mb-2">
              Confirmar Exclusão
            </h3>
            <p className="text-gray-600 mb-6">
              Tem certeza que deseja excluir a avaliação de{" "}
              <strong>{reviewToDelete.name}</strong>? Esta ação não pode ser
              desfeita.
            </p>
            <div className="flex gap-3 justify-end">
              <button
                onClick={() => {
                  setShowDeleteModal(false);
                  setReviewToDelete(null);
                }}
                className="px-4 py-2 text-gray-600 hover:bg-gray-100 rounded-lg transition-colors"
              >
                Cancelar
              </button>
              <button
                onClick={handleConfirmDelete}
                disabled={deletingId !== null}
                className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors disabled:opacity-50"
              >
                {deletingId ? "Excluindo..." : "Excluir"}
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
