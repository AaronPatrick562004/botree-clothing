import { allProducts } from "@/lib/products-data";
import { ProductCard } from "@/components/product-card";
import { notFound } from "next/navigation";
import { Metadata } from "next";

interface SearchPageProps {
  searchParams: Promise<{
    q?: string;
  }>;
}

export async function generateMetadata({ searchParams }: SearchPageProps): Promise<Metadata> {
  const { q } = await searchParams;
  return {
    title: q ? `Search results for "${q}"` : "Search Products",
    description: `Search results for ${q || "all products"} at Botree Clothing`,
  };
}

export default async function SearchPage({ searchParams }: SearchPageProps) {
  const { q } = await searchParams;
  
  if (!q) {
    return (
      <div className="mx-auto max-w-7xl px-4 py-12 lg:px-8 text-center">
        <h1 className="font-serif text-3xl md:text-4xl font-bold mb-4">Search Products</h1>
        <p className="text-muted-foreground">Enter a search term to find products</p>
      </div>
    );
  }

  const searchQuery = q.toLowerCase();
  
  const results = allProducts.filter(product => 
    product.name.toLowerCase().includes(searchQuery) ||
    product.category.toLowerCase().includes(searchQuery) ||
    product.type?.toLowerCase().includes(searchQuery) ||
    product.description.toLowerCase().includes(searchQuery)
  );

  return (
    <div className="mx-auto max-w-7xl px-4 py-12 lg:px-8">
      {/* Header */}
      <div className="text-center mb-12">
        <h1 className="font-serif text-3xl md:text-4xl font-bold text-foreground mb-2">
          Search Results
        </h1>
        <p className="text-muted-foreground">
          {results.length} {results.length === 1 ? 'product' : 'products'} found for "{q}"
        </p>
      </div>

      {/* Results Grid */}
      {results.length > 0 ? (
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 lg:gap-6">
          {results.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      ) : (
        <div className="text-center py-12">
          <div className="text-6xl mb-4">🔍</div>
          <h2 className="text-xl font-semibold mb-2">No products found</h2>
          <p className="text-muted-foreground mb-6">
            We couldn't find any products matching "{q}"
          </p>
          <div className="text-sm text-muted-foreground">
            Try searching with different keywords or browse our categories
          </div>
        </div>
      )}
    </div>
  );
}