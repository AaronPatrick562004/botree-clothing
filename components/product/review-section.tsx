"use client";

import { useState } from "react";
import { type Product, type Review } from "@/lib/products";
import { StarRating } from "@/components/star-rating";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Star } from "lucide-react";
import { toast } from "sonner";
import { cn } from "@/lib/utils";

export function ReviewSection({ product }: { product: Product }) {
  const [reviews, setReviews] = useState<Review[]>(product.reviews);
  const [showForm, setShowForm] = useState(false);
  const [name, setName] = useState("");
  const [rating, setRating] = useState(0);
  const [comment, setComment] = useState("");
  const [hoveredStar, setHoveredStar] = useState(0);

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!name || !rating || !comment) {
      toast.error("Please fill in all fields");
      return;
    }
    const newReview: Review = {
      id: Date.now(),
      name,
      rating,
      comment,
      date: new Date().toISOString().split("T")[0],
    };
    setReviews((prev) => [newReview, ...prev]);
    setName("");
    setRating(0);
    setComment("");
    setShowForm(false);
    toast.success("Thank you for your review!");
  }

  const avgRating = reviews.reduce((sum, r) => sum + r.rating, 0) / reviews.length;

  return (
    <section className="mt-16 pt-12 border-t border-border">
      <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-8 gap-4">
        <div>
          <h2 className="font-serif text-2xl md:text-3xl font-bold text-foreground mb-2">
            Customer Reviews
          </h2>
          <div className="flex items-center gap-3">
            <StarRating rating={avgRating} size={20} />
            <span className="text-sm text-muted-foreground">
              {avgRating.toFixed(1)} out of 5 ({reviews.length} reviews)
            </span>
          </div>
        </div>
        <Button
          variant="outline"
          onClick={() => setShowForm(!showForm)}
          className="rounded-full"
        >
          {showForm ? "Cancel" : "Write a Review"}
        </Button>
      </div>

      {/* Review Form */}
      {showForm && (
        <form
          onSubmit={handleSubmit}
          className="bg-secondary rounded-xl p-6 mb-8"
        >
          <h3 className="text-lg font-semibold text-foreground mb-4">Share your experience</h3>
          <div className="flex flex-col gap-4">
            <div>
              <label className="text-sm font-medium text-foreground mb-1 block">Your Name</label>
              <Input
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Enter your name"
                className="rounded-lg"
                required
              />
            </div>
            <div>
              <label className="text-sm font-medium text-foreground mb-2 block">Rating</label>
              <div className="flex gap-1">
                {[1, 2, 3, 4, 5].map((star) => (
                  <button
                    key={star}
                    type="button"
                    onClick={() => setRating(star)}
                    onMouseEnter={() => setHoveredStar(star)}
                    onMouseLeave={() => setHoveredStar(0)}
                    className="p-0.5"
                  >
                    <Star
                      className={cn(
                        "h-6 w-6 transition-colors",
                        star <= (hoveredStar || rating)
                          ? "fill-accent text-accent"
                          : "text-border"
                      )}
                    />
                  </button>
                ))}
              </div>
            </div>
            <div>
              <label className="text-sm font-medium text-foreground mb-1 block">Your Review</label>
              <Textarea
                value={comment}
                onChange={(e) => setComment(e.target.value)}
                placeholder="Tell us what you think about this product..."
                rows={4}
                className="rounded-lg"
                required
              />
            </div>
            <Button type="submit" className="rounded-full w-fit px-8">
              Submit Review
            </Button>
          </div>
        </form>
      )}

      {/* Reviews List */}
      <div className="flex flex-col gap-6">
        {reviews.map((review) => (
          <div
            key={review.id}
            className="border-b border-border pb-6 last:border-0"
          >
            <div className="flex items-center justify-between mb-2">
              <div className="flex items-center gap-3">
                <div className="h-9 w-9 rounded-full bg-primary flex items-center justify-center">
                  <span className="text-sm font-semibold text-primary-foreground">
                    {review.name.charAt(0)}
                  </span>
                </div>
                <div>
                  <p className="text-sm font-semibold text-foreground">{review.name}</p>
                  <p className="text-xs text-muted-foreground">{review.date}</p>
                </div>
              </div>
              <StarRating rating={review.rating} size={14} />
            </div>
            <p className="text-sm text-muted-foreground leading-relaxed ml-12">
              {review.comment}
            </p>
          </div>
        ))}
      </div>
    </section>
  );
}
