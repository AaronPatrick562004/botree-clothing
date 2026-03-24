"use client";

import Image from "next/image";
import Link from "next/link";
import { type Product, formatPrice } from "@/lib/products";
import { StarRating } from "@/components/star-rating";
import { Badge } from "@/components/ui/badge";

export function ProductCard({ product }: { product: Product }) {
  return (
    <Link
      href={`/product/${product.id}`}
      className="group block"
    >
      <div className="relative overflow-hidden rounded-lg bg-secondary aspect-3/4">        <Image
        src={product.image}
        alt={product.name}
        fill
        className="object-cover transition-transform duration-500 group-hover:scale-105"
        sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw"
      />
        {product.badge && (
          <Badge
            className={`absolute top-3 left-3 text-xs font-semibold ${product.badge === "Sale" || product.badge?.includes("OFF")
                ? "bg-destructive text-primary-foreground"
                : product.badge === "New" || product.badge === "Premium" || product.badge === "Best Seller"
                  ? "bg-primary text-primary-foreground"
                  : "bg-foreground text-primary-foreground"
              }`}
          >
            {product.badge}
          </Badge>
        )}
        <div className="absolute inset-0 bg-foreground/0 group-hover:bg-foreground/5 transition-colors" />
      </div>
      <div className="mt-3 flex flex-col gap-1">
        <h3 className="text-sm font-medium text-foreground group-hover:text-primary transition-colors line-clamp-1">
          {product.name}
        </h3>
        <div className="flex items-center gap-2">
          <StarRating rating={product.rating} size={12} />
          <span className="text-xs text-muted-foreground">({product.reviews.length})</span>
        </div>
        <div className="flex items-center gap-2">
          <span className="text-sm font-semibold text-foreground">{formatPrice(product.price)}</span>
          {product.originalPrice && (
            <span className="text-xs text-muted-foreground line-through">
              {formatPrice(product.originalPrice)}
            </span>
          )}
        </div>
      </div>
    </Link>
  );
}