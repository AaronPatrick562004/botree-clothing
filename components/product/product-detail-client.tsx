"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { motion } from "framer-motion";
import { type Product, formatPrice } from "@/lib/products";
import { useCart } from "@/lib/cart-context";
import { StarRating } from "@/components/star-rating";
import { ReviewSection } from "@/components/product/review-section";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Minus, Plus, ShoppingBag, Heart, ChevronRight } from "lucide-react";
import { toast } from "sonner";
import { cn } from "@/lib/utils";

export function ProductDetailClient({ product }: { product: Product }) {
  const { addItem } = useCart();
  const [selectedSize, setSelectedSize] = useState<string>("");
  const [selectedColor, setSelectedColor] = useState(product.colors[0]);
  const [quantity, setQuantity] = useState(1);

  function handleAddToCart() {
    if (!selectedSize) {
      toast.error("Please select a size");
      return;
    }
    
    const cartItem = {
      id: product.id,
      name: product.name,
      price: product.price,
      originalPrice: product.originalPrice,
      image: product.image,
      category: product.category,
      size: selectedSize,
      quantity: quantity,
      badge: product.badge
    };
    
    addItem(cartItem);
    
    setTimeout(() => {
      toast.success(`${product.name} added to your cart!`, {
        duration: 3000,
      });
    }, 0);
  }

  // Animation variants
  const fadeInUp = {
    initial: { opacity: 0, y: 20 },
    animate: { opacity: 1, y: 0 },
    transition: { duration: 0.5 }
  };

  const staggerContainer = {
    animate: {
      transition: {
        staggerChildren: 0.1
      }
    }
  };

  return (
    <motion.div 
      className="mx-auto max-w-7xl px-4 py-8 lg:px-8"
      initial="initial"
      animate="animate"
      variants={staggerContainer}
    >
      {/* Breadcrumb with animation */}
      <motion.nav 
        variants={fadeInUp}
        className="flex items-center gap-2 text-sm text-muted-foreground mb-8"
      >
        <Link href="/" className="hover:text-foreground transition-colors">
          Home
        </Link>
        <ChevronRight className="h-3 w-3" />
        <Link
          href={`/category/${product.category}`}
          className="hover:text-foreground transition-colors capitalize"
        >
          {product.category.replace("-", " ")}
        </Link>
        <ChevronRight className="h-3 w-3" />
        <span className="text-foreground">{product.name}</span>
      </motion.nav>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-16">
        {/* Image with hover zoom effect */}
        <motion.div 
          variants={fadeInUp}
          className="relative aspect-3/4 rounded-xl overflow-hidden bg-secondary group"
          whileHover={{ scale: 1.02 }}
          transition={{ duration: 0.3 }}
        >
          <Image
            src={product.image}
            alt={product.name}
            fill
            className="object-cover transition-transform duration-700 group-hover:scale-110"
            priority
            sizes="(max-width: 1024px) 100vw, 50vw"
          />
          {product.badge && (
            <motion.div
              initial={{ x: -20, opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              transition={{ delay: 0.2 }}
            >
              <Badge
                className={`absolute top-4 left-4 ${
                  product.badge === "Sale"
                    ? "bg-destructive text-primary-foreground"
                    : product.badge === "New" || product.badge === "Limited"
                    ? "bg-primary text-primary-foreground"
                    : "bg-foreground text-primary-foreground"
                }`}
              >
                {product.badge}
              </Badge>
            </motion.div>
          )}
        </motion.div>

        {/* Details */}
        <motion.div 
          variants={fadeInUp}
          className="flex flex-col"
        >
          {/* Rating */}
          <motion.div 
            variants={fadeInUp}
            className="flex items-center gap-3 mb-2"
          >
            <StarRating rating={product.rating} size={18} />
            <span className="text-sm text-muted-foreground">
              {product.rating} ({product.reviews.length} reviews)
            </span>
          </motion.div>

          {/* Title */}
          <motion.h1 
            variants={fadeInUp}
            className="font-serif text-3xl md:text-4xl font-bold text-foreground mb-4"
          >
            {product.name}
          </motion.h1>

          {/* Price */}
          <motion.div 
            variants={fadeInUp}
            className="flex items-baseline gap-3 mb-6"
          >
            <span className="text-2xl font-bold text-foreground">
              {formatPrice(product.price)}
            </span>
            {product.originalPrice && (
              <>
                <span className="text-lg text-muted-foreground line-through">
                  {formatPrice(product.originalPrice)}
                </span>
                <Badge variant="secondary" className="text-xs">
                  {Math.round(
                    ((product.originalPrice - product.price) / product.originalPrice) * 100
                  )}
                  % OFF
                </Badge>
              </>
            )}
          </motion.div>

          {/* Description */}
          <motion.p 
            variants={fadeInUp}
            className="text-muted-foreground leading-relaxed mb-8"
          >
            {product.description}
          </motion.p>

          {/* Color Selection */}
          <motion.div variants={fadeInUp} className="mb-6">
            <p className="text-sm font-semibold text-foreground mb-3">
              Color: <span className="font-normal text-muted-foreground">{selectedColor}</span>
            </p>
            <div className="flex flex-wrap gap-2">
              {product.colors.map((color, index) => (
                <motion.button
                  key={color}
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  transition={{ delay: index * 0.05 }}
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.9 }}
                  onClick={() => setSelectedColor(color)}
                  className={cn(
                    "px-4 py-2 rounded-full text-sm border transition-all",
                    selectedColor === color
                      ? "border-primary bg-primary text-primary-foreground"
                      : "border-border text-foreground hover:border-foreground"
                  )}
                >
                  {color}
                </motion.button>
              ))}
            </div>
          </motion.div>

          {/* Size Selection */}
          <motion.div variants={fadeInUp} className="mb-6">
            <p className="text-sm font-semibold text-foreground mb-3">
              Size:{" "}
              {selectedSize && (
                <span className="font-normal text-muted-foreground">{selectedSize}</span>
              )}
            </p>
            <div className="flex flex-wrap gap-2">
              {product.sizes.map((size, index) => (
                <motion.button
                  key={size}
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  transition={{ delay: index * 0.05 }}
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.9 }}
                  onClick={() => setSelectedSize(size)}
                  className={cn(
                    "min-w-12 px-3 py-2 rounded-lg text-sm border transition-all font-medium",
                    selectedSize === size
                      ? "border-primary bg-primary text-primary-foreground"
                      : "border-border text-foreground hover:border-foreground"
                  )}
                >
                  {size}
                </motion.button>
              ))}
            </div>
          </motion.div>

          {/* Quantity */}
          <motion.div variants={fadeInUp} className="mb-8">
            <p className="text-sm font-semibold text-foreground mb-3">Quantity</p>
            <div className="flex items-center border border-border rounded-lg w-fit">
              <motion.button
                whileTap={{ scale: 0.9 }}
                onClick={() => setQuantity(Math.max(1, quantity - 1))}
                className="p-3 hover:bg-secondary transition-colors"
                aria-label="Decrease quantity"
              >
                <Minus className="h-4 w-4" />
              </motion.button>
              <motion.span 
                key={quantity}
                initial={{ scale: 1.2 }}
                animate={{ scale: 1 }}
                className="px-5 text-sm font-semibold min-w-12 text-center"
              >
                {quantity}
              </motion.span>
              <motion.button
                whileTap={{ scale: 0.9 }}
                onClick={() => setQuantity(Math.min(10, quantity + 1))}
                className="p-3 hover:bg-secondary transition-colors"
                aria-label="Increase quantity"
              >
                <Plus className="h-4 w-4" />
              </motion.button>
            </div>
          </motion.div>

          {/* Actions */}
          <motion.div 
            variants={fadeInUp}
            className="flex gap-3"
          >
            <motion.div
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              className="flex-1"
            >
              <Button
                size="lg"
                onClick={handleAddToCart}
                className="w-full rounded-full text-sm uppercase tracking-wider font-semibold relative overflow-hidden group"
              >
                <motion.span
                  className="absolute inset-0 bg-linear-to-r from-primary/20 to-secondary/20"
                  initial={{ x: "-100%" }}
                  whileHover={{ x: "100%" }}
                  transition={{ duration: 0.5 }}
                />
                <span className="relative z-10 flex items-center justify-center">
                  <ShoppingBag className="mr-2 h-4 w-4" />
                  Add to Cart
                </span>
              </Button>
            </motion.div>
            <motion.div
              whileHover={{ scale: 1.1, rotate: 5 }}
              whileTap={{ scale: 0.9 }}
            >
              <Button
                size="lg"
                variant="outline"
                className="rounded-full px-4"
                aria-label="Add to wishlist"
              >
                <Heart className="h-5 w-5" />
              </Button>
            </motion.div>
          </motion.div>

          {/* Features */}
          <motion.div 
            variants={fadeInUp}
            className="grid grid-cols-2 gap-4 mt-8 pt-8 border-t border-border"
          >
            {[
              { label: "Free Shipping", desc: "On orders above ₹2,000", icon: "🚚" },
              { label: "Easy Returns", desc: "30-day return policy", icon: "🔄" },
              { label: "Secure Payment", desc: "100% secure checkout", icon: "🔒" },
              { label: "Quality Assured", desc: "Premium fabrics used", icon: "✨" },
            ].map((feature, index) => (
              <motion.div
                key={feature.label}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 + index * 0.1 }}
                whileHover={{ y: -5 }}
                className="p-3 rounded-lg hover:bg-secondary/10 transition-colors"
              >
                <p className="text-lg mb-1">{feature.icon}</p>
                <p className="text-sm font-semibold text-foreground">{feature.label}</p>
                <p className="text-xs text-muted-foreground">{feature.desc}</p>
              </motion.div>
            ))}
          </motion.div>
        </motion.div>
      </div>

      {/* Reviews */}
      <motion.div
        initial={{ opacity: 0, y: 40 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.5, duration: 0.6 }}
      >
        <ReviewSection product={product} />
      </motion.div>
    </motion.div>
  );
}