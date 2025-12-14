import React, { useState, useEffect } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { base44 } from "@/api/base44Client";
import { Star, Camera, Loader2, Check } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { motion, AnimatePresence } from "framer-motion";
import { toast } from "sonner";

export default function ReviewSection({ productId, productName }) {
  const [user, setUser] = useState(null);
  const [showForm, setShowForm] = useState(false);
  const [rating, setRating] = useState(0);
  const [hoverRating, setHoverRating] = useState(0);
  const [comment, setComment] = useState("");
  const queryClient = useQueryClient();

  useEffect(() => {
    base44.auth
      .me()
      .then(setUser)
      .catch(() => {});
  }, []);

  const { data: reviews = [], isLoading } = useQuery({
    queryKey: ["reviews", productId],
    queryFn: async () => {
      const data = await base44.entities.Review.filter(
        { product_id: productId },
        "-created_date"
      );
      return data;
    },
    enabled: !!productId,
  });

  const addReviewMutation = useMutation({
    mutationFn: async (reviewData) => {
      await base44.entities.Review.create(reviewData);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["reviews", productId] });
      setShowForm(false);
      setRating(0);
      setComment("");
      toast.success("Review berhasil ditambahkan");
    },
  });

  const handleSubmit = () => {
    if (!user) {
      base44.auth.redirectToLogin();
      return;
    }
    if (!rating) {
      toast.error("Pilih rating terlebih dahulu");
      return;
    }

    addReviewMutation.mutate({
      product_id: productId,
      product_name: productName,
      user_email: user.email,
      user_name: user.full_name || user.email.split("@")[0],
      rating,
      comment,
      verified_purchase: false,
    });
  };

  const avgRating =
    reviews.length > 0
      ? (
          reviews.reduce((sum, r) => sum + r.rating, 0) / reviews.length
        ).toFixed(1)
      : 0;

  const ratingCounts = [5, 4, 3, 2, 1].map(
    (star) => reviews.filter((r) => r.rating === star).length
  );

  return (
    <div className="px-4 py-6 border-t">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h3 className="font-bold text-lg mb-1">Rating & Review</h3>
          <div className="flex items-center gap-2">
            <div className="flex items-center gap-1">
              <Star className="w-5 h-5 fill-yellow-400 text-yellow-400" />
              <span className="text-xl font-bold">{avgRating}</span>
            </div>
            <span className="text-gray-500 text-sm">
              ({reviews.length} review)
            </span>
          </div>
        </div>
        <Button
          onClick={() => setShowForm(!showForm)}
          size="sm"
          variant="outline"
          className="rounded-full"
        >
          Tulis Review
        </Button>
      </div>

      {/* Rating Distribution */}
      <div className="mb-6 space-y-2">
        {[5, 4, 3, 2, 1].map((star, idx) => (
          <div key={star} className="flex items-center gap-3">
            <div className="flex items-center gap-1 w-12">
              <Star className="w-3 h-3 fill-gray-300 text-gray-300" />
              <span className="text-xs">{star}</span>
            </div>
            <div className="flex-1 h-2 bg-gray-100 rounded-full overflow-hidden">
              <div
                className="h-full bg-yellow-400 transition-all"
                style={{
                  width: `${
                    reviews.length > 0
                      ? (ratingCounts[idx] / reviews.length) * 100
                      : 0
                  }%`,
                }}
              />
            </div>
            <span className="text-xs text-gray-500 w-8 text-right">
              {ratingCounts[idx]}
            </span>
          </div>
        ))}
      </div>

      {/* Review Form */}
      <AnimatePresence>
        {showForm && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            className="bg-gray-50 rounded-xl p-4 mb-6"
          >
            <div className="mb-4">
              <p className="text-sm font-medium mb-2">Rating Kamu</p>
              <div className="flex gap-2">
                {[1, 2, 3, 4, 5].map((star) => (
                  <button
                    key={star}
                    onClick={() => setRating(star)}
                    onMouseEnter={() => setHoverRating(star)}
                    onMouseLeave={() => setHoverRating(0)}
                  >
                    <Star
                      className={`w-8 h-8 transition-all ${
                        star <= (hoverRating || rating)
                          ? "fill-yellow-400 text-yellow-400"
                          : "text-gray-300"
                      }`}
                    />
                  </button>
                ))}
              </div>
            </div>

            <Textarea
              placeholder="Ceritakan pengalaman kamu dengan produk ini..."
              value={comment}
              onChange={(e) => setComment(e.target.value)}
              className="mb-4"
              rows={4}
            />

            <div className="flex gap-2 justify-end">
              <Button variant="outline" onClick={() => setShowForm(false)}>
                Batal
              </Button>
              <Button
                onClick={handleSubmit}
                disabled={addReviewMutation.isPending || !rating}
                className="bg-black hover:bg-gray-800"
              >
                {addReviewMutation.isPending ? (
                  <Loader2 className="w-4 h-4 animate-spin" />
                ) : (
                  "Kirim Review"
                )}
              </Button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Reviews List */}
      <div className="space-y-4">
        {isLoading ? (
          <div className="flex justify-center py-8">
            <Loader2 className="w-5 h-5 animate-spin" />
          </div>
        ) : reviews.length === 0 ? (
          <div className="text-center py-8 text-gray-500">Belum ada review</div>
        ) : (
          reviews.map((review) => (
            <div key={review.id} className="border-b pb-4 last:border-0">
              <div className="flex items-start justify-between mb-2">
                <div>
                  <div className="flex items-center gap-2 mb-1">
                    <span className="font-medium text-sm">
                      {review.user_name}
                    </span>
                    {review.verified_purchase && (
                      <span className="text-xs bg-green-100 text-green-700 px-2 py-0.5 rounded-full flex items-center gap-1">
                        <Check className="w-3 h-3" />
                        Verified
                      </span>
                    )}
                  </div>
                  <div className="flex items-center gap-1">
                    {[1, 2, 3, 4, 5].map((star) => (
                      <Star
                        key={star}
                        className={`w-4 h-4 ${
                          star <= review.rating
                            ? "fill-yellow-400 text-yellow-400"
                            : "text-gray-300"
                        }`}
                      />
                    ))}
                  </div>
                </div>
                <span className="text-xs text-gray-500">
                  {new Date(review.created_date).toLocaleDateString("id-ID", {
                    day: "numeric",
                    month: "short",
                    year: "numeric",
                  })}
                </span>
              </div>
              {review.comment && (
                <p className="text-sm text-gray-700 leading-relaxed">
                  {review.comment}
                </p>
              )}
            </div>
          ))
        )}
      </div>
    </div>
  );
}
