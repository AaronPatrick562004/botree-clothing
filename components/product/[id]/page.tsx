import { products } from "@/lib/products";
import Image from "next/image";
import { notFound } from "next/navigation";
import { StarRating } from "@/components/star-rating";
import { formatPrice } from "@/lib/products";
import { Button } from "@/components/ui/button";

interface ProductPageProps {
  params: {
    id: string;
  };
}

export default function ProductPage({ params }: ProductPageProps) {
  const product = products.find(p => p.id === parseInt(params.id));

  if (!product) {
    notFound();
  }

  return (
    <div className="mx-auto max-w-7xl px-4 py-12 lg:px-8">
      <div className="grid md:grid-cols-2 gap-12">
        {/* Product Image */}
        <div className="relative aspect-3/4 rounded-lg overflow-hidden bg-secondary">          <Image
          src={product.image}
          alt={product.name}
          fill
          className="object-cover"
          priority
        />
        </div>

        {/* Product Details */}
        <div className="space-y-6">
          {product.badge && (
            <span className="inline-block bg-primary text-primary-foreground px-3 py-1 text-sm font-semibold rounded">
              {product.badge}
            </span>
          )}

          <h1 className="font-serif text-4xl font-bold text-foreground">
            {product.name}
          </h1>

          <div className="flex items-center gap-2">
            <StarRating rating={product.rating} size={20} />
            <span className="text-sm text-muted-foreground">
              ({product.reviews.length} reviews)
            </span>
          </div>

          <div className="flex items-center gap-4">
            <span className="text-3xl font-bold text-foreground">
              {formatPrice(product.price)}
            </span>
            {product.originalPrice && (
              <span className="text-lg text-muted-foreground line-through">
                {formatPrice(product.originalPrice)}
              </span>
            )}
          </div>

          <p className="text-muted-foreground">
            Category: {product.category}
          </p>

          <div className="pt-6 space-y-4">
            <Button size="lg" className="w-full md:w-auto px-12">
              Add to Cart
            </Button>
            <Button size="lg" variant="outline" className="w-full md:w-auto px-12">
              Buy Now
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}