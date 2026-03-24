import { getProductsByCategory } from "@/lib/products";
import { ProductCard } from "@/components/product-card";

export default function MenCategoryPage() {
  const products = getProductsByCategory("men");

  return (
    <div className="mx-auto max-w-7xl px-4 py-12 lg:px-8">
      {/* Header */}
      <div className="text-center mb-12">
        <h1 className="font-serif text-4xl md:text-5xl font-bold text-foreground mb-4">
          Men's Collection
        </h1>
        <p className="text-muted-foreground text-lg">
          {products.length} products found
        </p>
      </div>

      {/* Products Grid - All 24 products */}
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 lg:gap-6">
        {products.map((product) => (
          <ProductCard key={product.id} product={product} />
        ))}
      </div>
    </div>
  );
}