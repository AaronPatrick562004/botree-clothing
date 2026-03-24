import { type Product } from "@/lib/products";
import { ProductCard } from "@/components/product-card";

export function RelatedProducts({ products }: { products: Product[] }) {
  if (products.length === 0) return null;

  return (
    <section className="bg-secondary">
      <div className="mx-auto max-w-7xl px-4 py-16 lg:px-8">
        <h2 className="font-serif text-2xl md:text-3xl font-bold text-foreground mb-8">
          You May Also Like
        </h2>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 lg:gap-6">
          {products.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      </div>
    </section>
  );
}
