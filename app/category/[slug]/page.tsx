import { getProductsByCategory } from "@/lib/products";
import { ProductCard } from "@/components/product-card";
import { notFound } from "next/navigation";

interface CategoryPageProps {
  params: Promise<{
    slug: string;
  }>;
}

export default async function CategoryPage({ params }: CategoryPageProps) {
  // Await the params (Next.js 15+ requirement)
  const { slug } = await params;
  
  console.log("Category page slug:", slug);
  
  // Get products for this category
  const products = getProductsByCategory(slug);
  
  console.log("Products found in page:", products.length);
  
  // If no products found, show 404
  if (!products || products.length === 0) {
    notFound();
  }

  // Format category name for display
  let categoryName = "";
  if (slug === "men") categoryName = "Men's";
  else if (slug === "women") categoryName = "Women's";
  else if (slug === "kids") categoryName = "Kids'";
  else if (slug === "new-arrivals") categoryName = "New Arrivals";
  else categoryName = slug.charAt(0).toUpperCase() + slug.slice(1);

  return (
    <div className="mx-auto max-w-7xl px-4 py-12 lg:px-8">
      {/* Header */}
      <div className="text-center mb-12">
        <h1 className="font-serif text-4xl md:text-5xl font-bold text-foreground mb-4">
          {categoryName} Collection
        </h1>
        <p className="text-muted-foreground text-lg">
          {products.length} products found
        </p>
      </div>

      {/* Products Grid */}
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 lg:gap-6">
        {products.map((product) => (
          <ProductCard key={product.id} product={product} />
        ))}
      </div>
    </div>
  );
}