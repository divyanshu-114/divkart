import React, { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { deleteReview, postReview } from "../../store/slices/productSlice";
import { Star, Trash2 } from "lucide-react";

const ReviewsContainer = ({ product, productReviews }) => {
  const { authUser } = useSelector((state) => state.auth);
  const { isReviewDeleting, isPostingReview } = useSelector((state) => state.product);
  const dispatch = useDispatch();

  const [rating, setRating] = useState(4);
  const [comment, setComment] = useState("");
  const [hovered, setHovered] = useState(0);

  const handleReviewSubmit = (e) => {
    e.preventDefault();
    dispatch(postReview({ productId: product.id, review: { rating, comment } }));
    setComment("");
  };

  return (
    <>
      {/* Review form */}
      {authUser && (
        <form onSubmit={handleReviewSubmit} className="mb-8 bg-secondary/50 rounded-2xl p-5 border border-border animate-fade-in-up">
          <h4 className="text-base font-bold text-foreground mb-4">Leave a Review</h4>

          {/* star rating */}
          <div className="flex items-center gap-1 mb-4">
            {[...Array(5)].map((_, i) => (
              <button
                key={i}
                type="button"
                onClick={() => setRating(i + 1)}
                onMouseEnter={() => setHovered(i + 1)}
                onMouseLeave={() => setHovered(0)}
                className="text-2xl transition-transform hover:scale-110"
              >
                <Star
                  className={`w-6 h-6 transition-colors ${
                    i < (hovered || rating) ? "text-amber-400 fill-amber-400" : "text-muted-foreground/30"
                  }`}
                />
              </button>
            ))}
          </div>

          <textarea
            value={comment}
            onChange={(e) => setComment(e.target.value)}
            rows={3}
            placeholder="Share your thoughts about this product…"
            className="w-full px-4 py-3 bg-card border border-border rounded-xl focus:outline-none focus:border-primary focus:ring-2 focus:ring-primary/15 text-sm text-foreground placeholder-muted-foreground resize-none transition-all"
          />
          <button
            type="submit"
            disabled={isPostingReview}
            className="mt-3 px-6 py-2.5 bg-primary text-primary-foreground rounded-full font-bold text-sm hover:bg-primary/90 transition-colors disabled:opacity-50"
          >
            {isPostingReview ? "Submitting…" : "Submit Review"}
          </button>
        </form>
      )}

      {/* Reviews list */}
      <h3 className="text-base font-bold text-foreground mb-4">
        Customer Reviews
        {productReviews?.length > 0 && (
          <span className="ml-2 text-sm font-semibold text-muted-foreground">({productReviews.length})</span>
        )}
      </h3>

      {productReviews && productReviews.length > 0 ? (
        <div className="space-y-4">
          {productReviews.map((review) => (
            <div
              key={review.review_id}
              className="bg-card rounded-2xl border border-border p-5 shadow-card animate-fade-in-up"
            >
              <div className="flex items-start gap-3">
                <img
                  src={review.reviewer?.avatar?.url || "/avatar-holder.avif"}
                  alt={review?.reviewer?.name}
                  className="w-10 h-10 rounded-full object-cover border-2 border-accent shrink-0"
                />
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-3 mb-1.5">
                    <h4 className="font-bold text-sm text-foreground">{review?.reviewer?.name}</h4>
                    <div className="flex items-center gap-0.5">
                      {[...Array(5)].map((_, i) => (
                        <Star
                          key={i}
                          className={`w-3.5 h-3.5 ${
                            i < Math.floor(review.rating)
                              ? "text-amber-400 fill-amber-400"
                              : "text-muted-foreground/20"
                          }`}
                        />
                      ))}
                    </div>
                  </div>
                  <p className="text-sm text-muted-foreground leading-relaxed">{review.comment}</p>

                  {authUser?.id === review.reviewer?.id && (
                    <button
                      onClick={() => dispatch(deleteReview({ productId: product.id, reviewId: review.review_id }))}
                      className="mt-3 flex items-center gap-1.5 text-xs font-semibold text-red-500 hover:text-red-700 transition-colors"
                    >
                      <Trash2 className="w-3.5 h-3.5" strokeWidth={2} />
                      {isReviewDeleting ? "Deleting…" : "Delete Review"}
                    </button>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="text-center py-10 bg-secondary/50 rounded-2xl border border-border border-dashed">
          <p className="text-sm text-muted-foreground font-medium">
            No reviews yet. Be the first to review this product!
          </p>
        </div>
      )}
    </>
  );
};

export default ReviewsContainer;
