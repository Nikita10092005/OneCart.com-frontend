import { useState, useEffect, useRef, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Star, ThumbsUp, MessageSquare, Edit, Trash2, Camera, Check, X, Upload } from "lucide-react";
import API from "../services/api";
import { useAuth } from "../context/AuthContext";
import { imgUrl } from "../utils/imageUrl";

const ReviewSystem = ({ productId }) => {
  const { user } = useAuth();
  const [reviews, setReviews] = useState([]);
  const [ratingStats, setRatingStats] = useState([]);
  const [, setPagination] = useState({});
  const [loading, setLoading] = useState(true);
  const [showReviewForm, setShowReviewForm] = useState(false);
  const [newReview, setNewReview] = useState({
    rating: 5,
    title: "",
    comment: "",
    images: []
  });
  const [submitting, setSubmitting] = useState(false);
  const [sortBy, setSortBy] = useState("createdAt");
  const [sortOrder, setSortOrder] = useState("desc");
  const [uploadedImages, setUploadedImages] = useState([]);
  const [uploadingImages, setUploadingImages] = useState(false);
  const fileInputRef = useRef(null);


  const fetchReviews = useCallback(async () => {
    try {
      const res = await API.get(`/reviews/product/${productId}?sortBy=${sortBy}&sortOrder=${sortOrder}`);
      setReviews(res.data.reviews);
      setRatingStats(res.data.ratingStats || []);
      setPagination(res.data.pagination);
    } catch (error) {
      console.error("Error fetching reviews:", error);
    } finally {
      setLoading(false);
    }
  }, [productId, sortBy, sortOrder]);
  useEffect(() => {fetchReviews();}, [fetchReviews]);

  const handleSubmitReview = async (e) => {
    e.preventDefault();
    if (!newReview.title.trim() || !newReview.comment.trim()) {
      alert("Please fill in all required fields");
      return;
    }

    setSubmitting(true);
    try {
      await API.post("/reviews", {
        productId,
        ...newReview,
        images: uploadedImages
      });

      setNewReview({ rating: 5, title: "", comment: "", images: [] });
      setUploadedImages([]);
      setShowReviewForm(false);
      fetchReviews();
      alert("Review submitted successfully!");
    } catch (error) {
      console.error("Error submitting review:", error);
      alert(error.response?.data?.message || "Failed to submit review");
    } finally {
      setSubmitting(false);
    }
  };

  const handleImageUpload = async (e) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;

    if (uploadedImages.length + files.length > 5) {
      alert("Maximum 5 images allowed per review");
      return;
    }

    setUploadingImages(true);
    const uploaded = [];

    for (const file of files) {
      if (!file.type.startsWith("image/")) {
        alert(`Skipping ${file.name} - not an image`);
        continue;
      }
      if (file.size > 5 * 1024 * 1024) {
        alert(`Skipping ${file.name} - file too large (max 5MB)`);
        continue;
      }

      const formData = new FormData();
      formData.append("image", file);

      try {
        const res = await API.post("/products/upload", formData, {
          headers: { "Content-Type": "multipart/form-data" }
        });
        uploaded.push(res.data.imageUrl || res.data.filename);
      } catch (error) {
        console.error("Failed to upload image:", error);
        alert(`Failed to upload ${file.name}`);
      }
    }

    setUploadedImages(prev => [...prev, ...uploaded]);
    setUploadingImages(false);
  };

  const removeImage = (index) => {
    setUploadedImages(prev => prev.filter((_, i) => i !== index));
  };

  const handleMarkHelpful = async (reviewId) => {
    try {
      await API.patch(`/reviews/${reviewId}/helpful`);
      setReviews(reviews.map(review => 
        review._id === reviewId 
          ? { ...review, helpful: review.helpful + 1 }
          : review
      ));
    } catch (error) {
      console.error("Error marking review helpful:", error);
    }
  };

  const handleDeleteReview = async (reviewId) => {
    if (confirm("Are you sure you want to delete this review?")) {
      try {
        await API.delete(`/reviews/${reviewId}`);
        setReviews(reviews.filter(review => review._id !== reviewId));
        alert("Review deleted successfully");
      } catch (error) {
        console.error("Error deleting review:", error);
        alert("Failed to delete review");
      }
    }
  };

  const renderStars = (rating, interactive = false, onChange) => {
    return (
      <div className="flex gap-1">
        {[1, 2, 3, 4, 5].map((star) => (
          <Star
            key={star}
            size={interactive ? 24 : 16}
            className={`cursor-pointer transition-colors ${
              star <= rating
                ? "fill-amazon-accent text-amazon-accent"
                : "text-gray-300 hover:text-amazon-accent/50"
            }`}
            onClick={interactive ? () => onChange(star) : undefined}
          />
        ))}
      </div>
    );
  };

  const calculateAverageRating = () => {
    if (reviews.length === 0) return 0;
    const sum = reviews.reduce((acc, review) => acc + review.rating, 0);
    return (sum / reviews.length).toFixed(1);
  };

  if (loading) {
    return (
      <div className="flex justify-center py-8">
        <div className="w-8 h-8 border-4 border-amazon-accent border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Review Summary */}
      <div className="bg-white rounded-xl p-6 border border-amazon-border">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-xl font-bold text-amazon-text">Customer Reviews</h3>
          <button
            onClick={() => setShowReviewForm(!showReviewForm)}
            className="px-4 py-2 bg-amazon-accent hover:bg-amazon-accent-hover text-amazon-text rounded-lg font-medium transition-colors"
          >
            Write a Review
          </button>
        </div>

        <div className="flex items-center gap-6">
          <div className="text-center">
            <div className="text-3xl font-bold text-amazon-text">{calculateAverageRating()}</div>
            {renderStars(Math.round(calculateAverageRating()))}
            <div className="text-sm text-gray-600 mt-1">{reviews.length} reviews</div>
          </div>

          <div className="flex-1">
            {[5, 4, 3, 2, 1].map((rating) => {
              const stat = ratingStats.find(s => s._id === rating);
              const count = stat?.count || 0;
              const percentage = reviews.length > 0 ? (count / reviews.length) * 100 : 0;

              return (
                <div key={rating} className="flex items-center gap-2 mb-1">
                  <span className="text-sm text-gray-600 w-8">{rating}★</span>
                  <div className="flex-1 bg-gray-200 rounded-full h-2">
                    <div
                      className="bg-amazon-accent h-2 rounded-full"
                      style={{ width: `${percentage}%` }}
                    />
                  </div>
                  <span className="text-sm text-gray-600 w-8 text-right">{count}</span>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* Review Form */}
      <AnimatePresence>
        {showReviewForm && user && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            className="bg-white rounded-xl p-6 border border-amazon-border"
          >
            <h4 className="text-lg font-semibold text-amazon-text mb-4">Write Your Review</h4>
            <form onSubmit={handleSubmitReview} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Rating
                </label>
                {renderStars(newReview.rating, true, (rating) =>
                  setNewReview({ ...newReview, rating })
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Review Title
                </label>
                <input
                  type="text"
                  value={newReview.title}
                  onChange={(e) => setNewReview({ ...newReview, title: e.target.value })}
                  placeholder="Summarize your experience"
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-amazon-accent focus:border-amazon-accent focus:ring-amazon-accent/30"
                  maxLength={100}
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Your Review
                </label>
                <textarea
                  value={newReview.comment}
                  onChange={(e) => setNewReview({ ...newReview, comment: e.target.value })}
                  placeholder="Share your thoughts about this product"
                  rows={4}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-amazon-accent focus:border-amazon-accent focus:ring-amazon-accent/30"
                  maxLength={1000}
                />
              </div>

              {/* Image Upload Section */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Photos (optional, max 5)
                </label>
                <input
                  type="file"
                  ref={fileInputRef}
                  onChange={handleImageUpload}
                  accept="image/*"
                  multiple
                  className="hidden"
                />
                <div className="flex flex-wrap gap-3">
                  {uploadedImages.map((img, index) => (
                    <div key={index} className="relative">
                      <img
                        src={imgUrl(img)}
                        alt={`Upload ${index + 1}`}
                        className="w-20 h-20 object-cover rounded-lg border border-gray-300"
                      />
                      <button
                        type="button"
                        onClick={() => removeImage(index)}
                        className="absolute -top-2 -right-2 w-6 h-6 bg-red-500 text-white rounded-full flex items-center justify-center text-xs hover:bg-red-600"
                      >
                        <X size={12} />
                      </button>
                    </div>
                  ))}
                  {uploadedImages.length < 5 && (
                    <button
                      type="button"
                      onClick={() => fileInputRef.current?.click()}
                      disabled={uploadingImages}
                      className="w-20 h-20 border-2 border-dashed border-gray-300 rounded-lg flex flex-col items-center justify-center text-gray-500 hover:border-amazon-accent hover:text-amazon-accent transition-colors"
                    >
                      {uploadingImages ? (
                        <div className="w-5 h-5 border-2 border-gray-300 border-t-amazon-accent rounded-full animate-spin" />
                      ) : (
                        <>
                          <Upload size={20} />
                          <span className="text-xs mt-1">Add Photo</span>
                        </>
                      )}
                    </button>
                  )}
                </div>
              </div>

              <div className="flex gap-3">
                <button
                  type="button"
                  onClick={() => setShowReviewForm(false)}
                  className="px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={submitting}
                  className="px-4 py-2 bg-amazon-accent hover:bg-amazon-accent-hover text-amazon-text rounded-lg disabled:opacity-50 transition-colors"
                >
                  {submitting ? "Submitting..." : "Submit Review"}
                </button>
              </div>
            </form>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Sort Options */}
      <div className="flex items-center justify-between">
        <h4 className="font-semibold text-amazon-text">Reviews ({reviews.length})</h4>
        <select
          value={`${sortBy}-${sortOrder}`}
          onChange={(e) => {
            const [sort, order] = e.target.value.split("-");
            setSortBy(sort);
            setSortOrder(order);
          }}
          className="px-3 py-2 border border-gray-300 rounded-lg text-sm"
        >
          <option value="createdAt-desc">Most Recent</option>
          <option value="createdAt-asc">Oldest First</option>
          <option value="rating-desc">Highest Rating</option>
          <option value="rating-asc">Lowest Rating</option>
          <option value="helpful-desc">Most Helpful</option>
        </select>
      </div>

      {/* Reviews List */}
      <div className="space-y-4">
        {reviews.map((review) => (
          <motion.div
            key={review._id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-white rounded-xl p-6 border border-amazon-border"
          >
            <div className="flex items-start justify-between mb-3">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-amazon-section rounded-full flex items-center justify-center">
                  <span className="text-sm font-semibold text-amazon-accent">
                    {review.userId?.name?.charAt(0) || "U"}
                  </span>
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <span className="font-medium text-amazon-text">
                      {review.userId?.name || "Anonymous"}
                    </span>
                    {review.verified && (
                      <span className="flex items-center gap-1 px-2 py-1 bg-green-100 text-green-700 text-xs rounded-full">
                        <Check size={10} />
                        Verified Purchase
                      </span>
                    )}
                  </div>
                  <div className="flex items-center gap-2 text-sm text-gray-600">
                    {renderStars(review.rating)}
                    <span>•</span>
                    <span>{new Date(review.createdAt).toLocaleDateString()}</span>
                  </div>
                </div>
              </div>

              {user && user._id === review.userId && (
                <div className="flex gap-2">
                  <button
                    className="p-1 text-gray-400 hover:text-blue-600 transition-colors"
                    title="Edit review"
                  >
                    <Edit size={16} />
                  </button>
                  <button
                    onClick={() => handleDeleteReview(review._id)}
                    className="p-1 text-gray-400 hover:text-red-600 transition-colors"
                    title="Delete review"
                  >
                    <Trash2 size={16} />
                  </button>
                </div>
              )}
            </div>

            <h5 className="font-semibold text-amazon-text mb-2">{review.title}</h5>
            <p className="text-gray-700 mb-3">{review.comment}</p>

            {review.images && review.images.length > 0 && (
              <div className="flex gap-2 mb-3">
                {review.images.map((image, index) => (
                  <img
                    key={index}
                    src={image.startsWith("http") ? image : imgUrl(image)}
                    alt={`Review image ${index + 1}`}
                    className="w-20 h-20 object-cover rounded-lg cursor-pointer hover:opacity-75 transition-opacity"
                  />
                ))}
              </div>
            )}

            <div className="flex items-center gap-4 text-sm">
              <button
                onClick={() => handleMarkHelpful(review._id)}
                className="flex items-center gap-1 text-gray-600 hover:text-amazon-accent transition-colors"
              >
                <ThumbsUp size={14} />
                Helpful ({review.helpful})
              </button>
            </div>
          </motion.div>
        ))}

        {reviews.length === 0 && (
          <div className="text-center py-8 bg-white rounded-xl border border-amazon-border">
            <MessageSquare className="mx-auto text-gray-400 mb-3" size={32} />
            <p className="text-gray-600">No reviews yet. Be the first to review this product!</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default ReviewSystem;
