"use client";

import { useCart } from "@/lib/cart-context";
import { formatPrice } from "@/lib/products";
import Image from "next/image";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Minus, Plus, Trash2, ShoppingBag, ArrowRight, Tag, Heart } from "lucide-react";
import { useRouter } from "next/navigation";
import { Toaster, toast } from "sonner";
import { useState } from "react";

export default function CartPage() {
  const { items, removeItem, updateQuantity, clearCart, subtotal, totalSavings } = useCart();
  const router = useRouter();
  const [isClearing, setIsClearing] = useState(false);

  const deliveryCharge = subtotal > 2000 ? 0 : 99;
  const total = subtotal + deliveryCharge;

  const handleClearCart = () => {
    setIsClearing(true);
    clearCart();
    setIsClearing(false);
    toast.success("Cart cleared");
  };

  const handleCheckout = () => {
    if (items.length === 0) {
      toast.error("Your cart is empty");
      return;
    }
    router.push("/checkout/address");
  };
  const moveToWishlist = (item: any) => {
    const wishlist = JSON.parse(localStorage.getItem("wishlist") || "[]");
    if (!wishlist.includes(item.id)) {
      wishlist.push(item.id);
      localStorage.setItem("wishlist", JSON.stringify(wishlist));
      toast.success("Moved to wishlist");
    }
    removeItem(item.id, item.size);
  };

  if (items.length === 0) {
    return (
      <div className="mx-auto max-w-7xl px-4 py-16 lg:px-8">
        <Toaster position="top-right" richColors />
        <div className="text-center">
          <div className="flex justify-center mb-6">
            <ShoppingBag className="h-24 w-24 text-muted-foreground" />
          </div>
          <h1 className="font-serif text-3xl md:text-4xl font-bold mb-4">Your Cart is Empty</h1>
          <p className="text-muted-foreground mb-8 max-w-md mx-auto">
            Looks like you haven't added anything yet. Browse our collections and find something special!
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button asChild size="lg" className="rounded-full px-8">
              <Link href="/category/men">Shop Men</Link>
            </Button>
            <Button asChild size="lg" variant="outline" className="rounded-full px-8">
              <Link href="/category/women">Shop Women</Link>
            </Button>
            <Button asChild size="lg" variant="outline" className="rounded-full px-8">
              <Link href="/category/kids">Shop Kids</Link>
            </Button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-7xl px-4 py-8 lg:px-8">
      <Toaster position="top-right" richColors />

      <h1 className="font-serif text-3xl md:text-4xl font-bold mb-8">Shopping Cart ({items.length})</h1>

      <div className="grid lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 space-y-4">
          {items.map((item) => (
            <div key={`${item.id}-${item.size}`} className="flex gap-4 p-4 border rounded-lg hover:shadow-md">
              <Link href={`/product/${item.id}`} className="shrink-0">
                <div className="relative w-24 h-24 rounded-md overflow-hidden bg-secondary">
                  <Image src={item.image} alt={item.name} fill className="object-cover" sizes="96px" />
                  {item.badge && (
                    <span className="absolute top-0 left-0 text-[8px] bg-primary text-primary-foreground px-1 rounded-br">
                      {item.badge}
                    </span>
                  )}
                </div>
              </Link>

              <div className="flex-1 min-w-0">
                <div className="flex items-start justify-between mb-1">
                  <Link href={`/product/${item.id}`} className="hover:text-primary">
                    <h3 className="font-medium text-base truncate">{item.name}</h3>
                  </Link>
                  <button onClick={() => removeItem(item.id, item.size)} className="p-1 hover:bg-red-100 rounded-full">
                    <Trash2 className="h-4 w-4 text-red-500" />
                  </button>
                </div>

                <div className="flex items-center gap-2 text-sm text-muted-foreground mb-2">
                  <span>{item.category}</span>
                  <span>•</span>
                  <span>Size: <span className="font-medium text-foreground">{item.size}</span></span>
                </div>

                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <span className="font-semibold">{formatPrice(item.price)}</span>
                    {item.originalPrice && item.originalPrice > item.price && (
                      <span className="text-xs text-muted-foreground line-through">
                        {formatPrice(item.originalPrice)}
                      </span>
                    )}
                  </div>

                  <div className="flex items-center gap-1 border rounded-md">
                    <button onClick={() => updateQuantity(item.id, item.size, item.quantity - 1)}
                      className="p-1.5 hover:bg-secondary rounded-l-md" disabled={item.quantity <= 1}>
                      <Minus className="h-3.5 w-3.5" />
                    </button>
                    <span className="w-8 text-center text-sm font-medium">{item.quantity}</span>
                    <button onClick={() => updateQuantity(item.id, item.size, item.quantity + 1)}
                      className="p-1.5 hover:bg-secondary rounded-r-md">
                      <Plus className="h-3.5 w-3.5" />
                    </button>
                  </div>
                </div>

                <div className="flex gap-2 mt-2">
                  <button onClick={() => moveToWishlist(item)} className="text-xs text-primary hover:underline flex items-center gap-1">
                    <Heart className="h-3 w-3" /> Move to Wishlist
                  </button>
                </div>
              </div>
            </div>
          ))}

          <div className="flex justify-between items-center pt-4">
            <Button variant="outline" onClick={handleClearCart} disabled={isClearing} className="gap-2">
              <Trash2 className="h-4 w-4" /> Clear Cart
            </Button>
            <Link href="/category/new-arrivals" className="text-sm text-primary hover:underline flex items-center gap-1">
              Continue Shopping <ArrowRight className="h-4 w-4" />
            </Link>
          </div>
        </div>

        <div className="lg:col-span-1">
          <div className="border rounded-lg p-6 sticky top-24">
            <h2 className="font-serif text-xl font-bold mb-4">Order Summary</h2>

            <div className="space-y-3 text-sm">
              <div className="flex justify-between">
                <span className="text-muted-foreground">Subtotal</span>
                <span className="font-medium">{formatPrice(subtotal)}</span>
              </div>

              {totalSavings > 0 && (
                <div className="flex justify-between text-green-600">
                  <span className="flex items-center gap-1"><Tag className="h-3.5 w-3.5" /> Savings</span>
                  <span className="font-medium">-{formatPrice(totalSavings)}</span>
                </div>
              )}

              <div className="flex justify-between">
                <span className="text-muted-foreground">Delivery</span>
                <span className="font-medium">
                  {deliveryCharge === 0 ? <span className="text-green-600">FREE</span> : formatPrice(deliveryCharge)}
                </span>
              </div>

              {deliveryCharge > 0 && (
                <p className="text-xs text-muted-foreground">
                  Add {formatPrice(2000 - subtotal)} more for free delivery
                </p>
              )}

              <div className="border-t pt-3 mt-3">
                <div className="flex justify-between text-base font-bold">
                  <span>Total</span>
                  <span>{formatPrice(total)}</span>
                </div>
                <p className="text-xs text-muted-foreground mt-1">Inclusive of all taxes</p>
              </div>
            </div>

            <Button size="lg" className="w-full mt-6 gap-2" onClick={handleCheckout}>
              Proceed to Checkout <ArrowRight className="h-4 w-4" />
            </Button>

            <div className="mt-4 text-center text-xs text-muted-foreground">
              <p>We accept:</p>
              <div className="flex justify-center gap-2 mt-2">
                <span className="px-2 py-1 bg-secondary rounded">Visa</span>
                <span className="px-2 py-1 bg-secondary rounded">Mastercard</span>
                <span className="px-2 py-1 bg-secondary rounded">UPI</span>
                <span className="px-2 py-1 bg-secondary rounded">COD</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}