"use client";

import Image from "next/image";
import Link from "next/link";
import { useCart } from "@/lib/cart-context";
import { formatPrice } from "@/lib/products";
import { Button } from "@/components/ui/button";
import { Minus, Plus, Trash2, ShoppingBag, ArrowRight } from "lucide-react";
import { toast } from "sonner";

export function CartClient() {
  const { items, updateQuantity, removeItem, clearCart, totalPrice } = useCart();

  if (items.length === 0) {
    return (
      <div className="mx-auto max-w-7xl px-4 py-20 lg:px-8 text-center">
        <div className="max-w-md mx-auto">
          <div className="h-24 w-24 rounded-full bg-secondary flex items-center justify-center mx-auto mb-6">
            <ShoppingBag className="h-10 w-10 text-muted-foreground" />
          </div>
          <h1 className="font-serif text-3xl font-bold text-foreground mb-4">
            Your cart is empty
          </h1>
          <p className="text-muted-foreground mb-8 leading-relaxed">
            Looks like you haven&apos;t added anything to your cart yet. Explore our collections and
            find something you love.
          </p>
          <Link href="/category/new-arrivals">
            <Button className="rounded-full px-8">
              Start Shopping
              <ArrowRight className="ml-2 h-4 w-4" />
            </Button>
          </Link>
        </div>
      </div>
    );
  }

  const shipping = totalPrice >= 2000 ? 0 : 199;
  const grandTotal = totalPrice + shipping;

  return (
    <div className="mx-auto max-w-7xl px-4 py-12 lg:px-8">
      <div className="flex items-center justify-between mb-10">
        <h1 className="font-serif text-3xl md:text-4xl font-bold text-foreground">
          Shopping Cart
        </h1>
        <Button
          variant="ghost"
          size="sm"
          onClick={() => {
            clearCart();
            toast.success("Cart cleared");
          }}
          className="text-destructive hover:text-destructive"
        >
          Clear All
        </Button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Cart Items */}
        <div className="lg:col-span-2 flex flex-col gap-4">
          {items.map((item) => (
            <div
              key={`${item.product.id}-${item.size}-${item.color}`}
              className="flex gap-4 bg-card rounded-xl p-4 border border-border"
            >
              <Link
                href={`/product/${item.product.id}`}
                className="relative h-28 w-24 flex-shrink-0 rounded-lg overflow-hidden bg-secondary"
              >
                <Image
                  src={item.product.image}
                  alt={item.product.name}
                  fill
                  className="object-cover"
                  sizes="96px"
                />
              </Link>
              <div className="flex-1 flex flex-col justify-between min-w-0">
                <div>
                  <Link href={`/product/${item.product.id}`}>
                    <h3 className="text-sm font-semibold text-foreground hover:text-primary transition-colors truncate">
                      {item.product.name}
                    </h3>
                  </Link>
                  <p className="text-xs text-muted-foreground mt-0.5">
                    {item.color} / {item.size}
                  </p>
                </div>
                <div className="flex items-center justify-between">
                  <div className="flex items-center border border-border rounded-lg">
                    <button
                      onClick={() =>
                        updateQuantity(
                          item.product.id,
                          item.size,
                          item.color,
                          item.quantity - 1
                        )
                      }
                      className="p-2 hover:bg-secondary transition-colors"
                      aria-label="Decrease quantity"
                    >
                      <Minus className="h-3 w-3" />
                    </button>
                    <span className="px-3 text-xs font-semibold">{item.quantity}</span>
                    <button
                      onClick={() =>
                        updateQuantity(
                          item.product.id,
                          item.size,
                          item.color,
                          item.quantity + 1
                        )
                      }
                      className="p-2 hover:bg-secondary transition-colors"
                      aria-label="Increase quantity"
                    >
                      <Plus className="h-3 w-3" />
                    </button>
                  </div>
                  <div className="flex items-center gap-3">
                    <span className="text-sm font-semibold text-foreground">
                      {formatPrice(item.product.price * item.quantity)}
                    </span>
                    <button
                      onClick={() => {
                        removeItem(item.product.id, item.size, item.color);
                        toast.success("Item removed from cart");
                      }}
                      className="p-1.5 text-muted-foreground hover:text-destructive transition-colors"
                      aria-label="Remove item"
                    >
                      <Trash2 className="h-4 w-4" />
                    </button>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Order Summary */}
        <div className="lg:col-span-1">
          <div className="bg-card rounded-xl p-6 border border-border sticky top-24">
            <h2 className="text-lg font-semibold text-foreground mb-6">Order Summary</h2>
            <div className="flex flex-col gap-3 text-sm">
              <div className="flex justify-between">
                <span className="text-muted-foreground">Subtotal</span>
                <span className="font-medium text-foreground">{formatPrice(totalPrice)}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Shipping</span>
                <span className="font-medium text-foreground">
                  {shipping === 0 ? "Free" : formatPrice(shipping)}
                </span>
              </div>
              {shipping > 0 && (
                <p className="text-xs text-primary">
                  Add {formatPrice(2000 - totalPrice)} more for free shipping
                </p>
              )}
              <div className="border-t border-border pt-3 mt-1">
                <div className="flex justify-between">
                  <span className="font-semibold text-foreground">Total</span>
                  <span className="font-bold text-lg text-foreground">
                    {formatPrice(grandTotal)}
                  </span>
                </div>
              </div>
            </div>
            <Button
              className="w-full rounded-full mt-6 text-sm uppercase tracking-wider font-semibold"
              size="lg"
              onClick={() => toast.success("Checkout functionality coming soon!")}
            >
              Proceed to Checkout
            </Button>
            <Link href="/category/new-arrivals" className="block mt-3">
              <Button variant="ghost" className="w-full text-sm" size="sm">
                Continue Shopping
              </Button>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
