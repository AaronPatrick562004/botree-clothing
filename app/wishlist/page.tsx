"use client";

import { useState, useEffect } from "react";
import { allProducts } from "@/lib/products-data";
import { ProductCard } from "@/components/product-card";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { Heart } from "lucide-react";
import { Toaster, toast } from "sonner";

export default function WishlistPage() {
  const [wishlistIds, setWishlistIds] = useState<string[]>([]);
  const [wishlistProducts, setWishlistProducts] = useState<any[]>([]);

  useEffect(() => {
    const saved = JSON.parse(localStorage.getItem("wishlist") || "[]");
    setWishlistIds(saved);
    
    const products = allProducts.filter(p => saved.includes(p.id));
    setWishlistProducts(products);
  }, []);

  const clearWishlist = () => {
    if (window.confirm("Clear your wishlist?")) {
      localStorage.setItem("wishlist", "[]");
      setWishlistIds([]);
      setWishlistProducts([]);
      toast.success("Wishlist cleared");
    }
  };

  if (wishlistProducts.length === 0) {
    return (
      <div className="mx-auto max-w-7xl px-4 py-16 lg:px-8">
        <Toaster position="top-right" richColors />
        <div className="text-center">
          <Heart className="h-24 w-24 mx-auto mb-6 text-muted-foreground" />
          <h1 className="font-serif text-3xl md:text-4xl font-bold mb-4">Your Wishlist is Empty</h1>
          <p className="text-muted-foreground mb-8">Save items you love to your wishlist!</p>
          <Button asChild size="lg" className="rounded-full px-8">
            <Link href="/category/new-arrivals">Explore Products</Link>
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-7xl px-4 py-8 lg:px-8">
      <Toaster position="top-right" richColors />
      
      <div className="flex justify-between items-center mb-8">
        <h1 className="font-serif text-3xl md:text-4xl font-bold">My Wishlist ({wishlistProducts.length})</h1>
        <Button variant="outline" onClick={clearWishlist}>Clear Wishlist</Button>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 lg:gap-6">
        {wishlistProducts.map((product) => (
          <ProductCard key={product.id} product={product} />
        ))}
      </div>
    </div>
  );
}