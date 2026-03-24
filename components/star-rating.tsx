import { Star } from "lucide-react";
import { cn } from "@/lib/utils";

export function StarRating({ rating, size = 16 }: { rating: number; size?: number }) {
  return (
    <div className="flex items-center gap-0.5" aria-label={`Rating: ${rating} out of 5`}>
      {[1, 2, 3, 4, 5].map((star) => (
        <Star
          key={star}
          className={cn(
            star <= Math.floor(rating) ? "fill-accent text-accent" : "text-border",
            star === Math.ceil(rating) && rating % 1 !== 0 && "fill-accent/50 text-accent"
          )}
          style={{ width: size, height: size }}
        />
      ))}
    </div>
  );
}
