"use client";

import { useState, useEffect, useRef } from "react";
import { Search, X } from "lucide-react";
import Link from "next/link";
import Image from "next/image";
import { allProducts } from "@/lib/products-data";
import { formatPrice } from "@/lib/products";
import { useRouter } from "next/navigation";

interface SearchResult {
  id: string;
  name: string;
  price: number;
  image: string;
  category: string;
  badge?: string;
}

export function SearchBar() {
  const [isOpen, setIsOpen] = useState(false);
  const [query, setQuery] = useState("");
  const [results, setResults] = useState<SearchResult[]>([]);
  const [recentSearches, setRecentSearches] = useState<string[]>([]);
  const searchRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const router = useRouter();

  // Load recent searches from localStorage
  useEffect(() => {
    const saved = localStorage.getItem("recentSearches");
    if (saved) {
      setRecentSearches(JSON.parse(saved));
    }
  }, []);

  // Handle click outside to close search
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (searchRef.current && !searchRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // Search function
  const handleSearch = (searchQuery: string) => {
    setQuery(searchQuery);

    if (searchQuery.trim().length < 2) {
      setResults([]);
      return;
    }

    const searchResults = allProducts
      .filter(product =>
        product.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        product.category.toLowerCase().includes(searchQuery.toLowerCase()) ||
        product.type?.toLowerCase().includes(searchQuery.toLowerCase())
      )
      .map(product => ({
        id: product.id,
        name: product.name,
        price: product.price,
        image: product.images[0] || product.image,
        category: product.category,
        badge: product.badge
      }))
      .slice(0, 8); // Limit to 8 results

    setResults(searchResults);
  };

  // Save search to recent
  const saveRecentSearch = (searchQuery: string) => {
    if (!searchQuery.trim()) return;

    const updated = [searchQuery, ...recentSearches.filter(s => s !== searchQuery)].slice(0, 5);
    setRecentSearches(updated);
    localStorage.setItem("recentSearches", JSON.stringify(updated));
  };

  // Handle search submission
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (query.trim()) {
      saveRecentSearch(query);
      router.push(`/search?q=${encodeURIComponent(query)}`);
      setIsOpen(false);
      setQuery("");
    }
  };

  // Handle product click
  const handleProductClick = (productId: string) => {
    setIsOpen(false);
    setQuery("");
    router.push(`/product/${productId}`);
  };

  // Clear search
  const clearSearch = () => {
    setQuery("");
    setResults([]);
    inputRef.current?.focus();
  };

  return (
    <div ref={searchRef} className="relative">
      {/* Search Icon Button */}
      <button
        onClick={() => {
          setIsOpen(!isOpen);
          setTimeout(() => inputRef.current?.focus(), 100);
        }}
        className="p-2 hover:bg-secondary rounded-full transition-colors"
        aria-label="Search"
      >
        <Search className="h-5 w-5" />
      </button>

      {/* Search Modal */}
      {isOpen && (
        <div className="absolute right-0 top-12 w-screen max-w-md bg-background border rounded-lg shadow-lg z-50">
          <div className="p-4">
            {/* Search Form */}
            <form onSubmit={handleSubmit} className="relative">
              <input
                ref={inputRef}
                type="text"
                value={query}
                onChange={(e) => handleSearch(e.target.value)}
                placeholder="Search products..."
                className="w-full p-3 pr-20 border rounded-lg bg-background focus:outline-none focus:ring-2 focus:ring-primary"
              />
              <div className="absolute right-2 top-1/2 -translate-y-1/2 flex gap-1">
                {query && (
                  <button
                    type="button"
                    onClick={clearSearch}
                    className="p-1.5 hover:bg-secondary rounded-full"
                  >
                    <X className="h-4 w-4" />
                  </button>
                )}
                <button
                  type="submit"
                  className="p-1.5 bg-primary text-primary-foreground rounded-full hover:bg-primary/90"
                >
                  <Search className="h-4 w-4" />
                </button>
              </div>
            </form>

            {/* Search Results */}
            {query.length >= 2 && (
              <div className="mt-4">
                {results.length > 0 ? (
                  <div className="space-y-2 max-h-96 overflow-y-auto">
                    {results.map((product) => (
                      <button
                        key={product.id}
                        onClick={() => handleProductClick(product.id)}
                        className="w-full flex items-center gap-3 p-2 hover:bg-secondary rounded-lg transition-colors text-left"
                      >
                        {/* Product Image */}
                        <div className="relative w-12 h-12 rounded-md overflow-hidden bg-secondary shrink-0">                          <Image
                          src={product.image}
                          alt={product.name}
                          fill
                          className="object-cover"
                          sizes="48px"
                        />
                          {product.badge && (
                            <span className="absolute top-0 left-0 text-[8px] bg-primary text-primary-foreground px-1 rounded-br">
                              {product.badge}
                            </span>
                          )}
                        </div>

                        {/* Product Info */}
                        <div className="flex-1 min-w-0">
                          <p className="text-sm font-medium truncate">{product.name}</p>
                          <div className="flex items-center gap-2 text-xs">
                            <span className="text-muted-foreground">{product.category}</span>
                            <span className="text-primary font-semibold">{formatPrice(product.price)}</span>
                          </div>
                        </div>
                      </button>
                    ))}

                    {/* View All Results Link */}
                    {results.length >= 8 && (
                      <button
                        onClick={handleSubmit}
                        className="w-full text-center text-sm text-primary hover:underline py-2"
                      >
                        View all {allProducts.filter(p =>
                          p.name.toLowerCase().includes(query.toLowerCase())
                        ).length} results
                      </button>
                    )}
                  </div>
                ) : (
                  <div className="text-center py-8 text-muted-foreground">
                    <Search className="h-8 w-8 mx-auto mb-2 opacity-50" />
                    <p className="text-sm">No products found</p>
                    <p className="text-xs">Try searching with different keywords</p>
                  </div>
                )}
              </div>
            )}

            {/* Recent Searches */}
            {!query && recentSearches.length > 0 && (
              <div className="mt-4">
                <p className="text-xs font-medium text-muted-foreground mb-2">Recent Searches</p>
                <div className="flex flex-wrap gap-2">
                  {recentSearches.map((search, index) => (
                    <button
                      key={index}
                      onClick={() => {
                        setQuery(search);
                        handleSearch(search);
                      }}
                      className="px-3 py-1 text-sm bg-secondary hover:bg-secondary/80 rounded-full transition-colors"
                    >
                      {search}
                    </button>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}