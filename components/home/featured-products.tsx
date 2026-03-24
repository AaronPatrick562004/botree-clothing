import { getFeaturedProducts, Product } from "@/lib/products";
import { ProductCard } from "@/components/product-card";
import Link from "next/link";
import { Button } from "@/components/ui/button";

export function FeaturedProducts() {
  const products = getFeaturedProducts();

  return (
    <section className="bg-secondary">
      <div className="mx-auto max-w-7xl px-4 py-20 lg:px-8">
        <div className="flex flex-col md:flex-row md:items-end md:justify-between mb-12 gap-4">
          <div>
            <p className="text-xs uppercase tracking-[0.3em] text-muted-foreground mb-3 font-medium">
              Featured Collection
            </p>
            <h2 className="font-serif text-4xl md:text-5xl font-bold text-foreground text-balance">
              Our Premium Picks
            </h2>
          </div>
          <Link href="/category/new-arrivals">
            <Button variant="outline" className="rounded-full px-6">
              View All
            </Button>
          </Link>
        </div>
        
        {/* Category Labels Row */}
        <div className="grid grid-cols-4 gap-4 lg:gap-6 mb-2 px-1">
          <div className="text-center text-sm font-medium text-muted-foreground">MEN</div>
          <div className="text-center text-sm font-medium text-muted-foreground">WOMEN</div>
          <div className="text-center text-sm font-medium text-muted-foreground">KIDS</div>
          <div className="text-center text-sm font-medium text-muted-foreground">NEW</div>
        </div>
        
        {/* Products Grid - 2 from each category (total 8) */}
        <div className="grid grid-cols-4 gap-4 lg:gap-6">
          {products.map((product: Product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      </div>
    </section>
  );
}