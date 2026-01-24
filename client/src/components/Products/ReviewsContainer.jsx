import React, { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { deleteReview, postReview } from "../../store/slices/productSlice";

const ReviewsContainer = ({ product, productReviews }) => {
  const { authUser } = useSelector((state) => state.auth);

  const { isReviewDeleting, isPostingReview } = useSelector(
    (state) => state.product
  );

  const dispatch = useDispatch();

  const [rating, setRating] = useState(1);
  const [comment, setComment] = useState("");

  const handleReviewSubmit = (e) => {
    e.preventDefault();

    const data = new FormData();
    data.append("rating", rating);
    data.append("comment", comment);

    dispatch(
      postReview({
        productId: product.id,
        review: data,
      })
    );
  };

  return <>
      {
        authUser && (
          <form onSubmit={handleReviewSubmit} className="mb-8 space-y-4">
            <h4 className="text-lg font-semibold">Leave a Review</h4>
            <div className="flex items-center space-x-2">
              {
                [...Array(5)].map((_, i) => {
                  return (
                    <button key={i} type="button" onClick={() => setRating(i + 1)} className={`text-2xl ${i < rating ? 'text-yellow-400' : 'text-gray-300'}`}>
                      {i < rating ? "★" : "☆"}
                    </button>
                  );
                })
              }
            </div>
            <textarea 
              value={comment} 
              onChange={(e) => setComment(e.target.value)}
              rows={4}
              placeholder="Write your review..."
              className="w-full p-3 border-border bg-background text-foreground rounded-md"
            />  
          <button className="px-6 py-2 rounded-lg bg-primary text-white font-semibold hover:glow-on-hover animate-smooth disabled:opacity-50" type="submit" disabled={isPostingReview}>
            {isPostingReview ? "Submitting..." : "Submit Review"}
          </button>
          </form>
        )
      }

      <h3 className="text-xl font-semibold text-foreground mb-6">Customer Review</h3>
      {productReviews && productReviews.length > 0 ? (
      <div className="space-y-6">
        {productReviews.map((review) => {
            return (
              <div
                key={review.review_id}
                className="glass-card p-6"
              >
                <div className="flex items-center space-x-4">
                  <img
                    src={review.reviewer?.avatar?.url || "/avatar-holder.avif"}
                    alt={review?.reviewer?.name}
                    className="w-12 h-12 rounded-full text-foreground"
                  />
                  <div className="flex-1">
                    <div className="flex items-center space-x-4">
                      <h4 className="font-semibold text-foreground">{review.reviewer?.name}</h4>
                      <div className="flex">
                        {
    
                        [...Array(5)].map((_, i) => {
                          return <Star key={i} className={`w-4 h-4 ${i < Math.floor(review.rating) ? 'text-yellow-400 fill-current' : 'text-gray-300'}`}/>
                        })
                      }
                      </div>
                    </div>

                    <p className="text-muted-foreground mb-2">{review.comment}</p>
                    {
                      authUser?.id === review.reviewer?.id && (
                        <button onClick={()=>dispatch(deleteReview(product.id,review.review_id))} className="my-6 w-fit flex items-center space-x-3 p-3 rounded-lg glass-card hover:glow-on-hover hover:text-destructive-foreground text-destructive group">
                        {isReviewDeleting ? (
                            <>
                              <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                              <span>Deleting Review...</span>
                            </>
                          ) : (
                            <span>Delete Review</span>
                          )}

                        </button>
                      )
                     }
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      ) : (
        <p className="text-muted-foreground">No review yet... Be the first one to review this product</p>
      )}

  </>;

};

export default ReviewsContainer;
