"use client";

import Image from "next/image";
import Link from "next/link";
import {
  ArrowRight, Sparkles, ChevronRight, Mail, Heart,
  Star, ShoppingBag, Truck, Shield, RefreshCw, Award,
  TrendingUp, Gem, Leaf, Facebook, Instagram, Twitter, Youtube, Search
} from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";
import { motion, AnimatePresence, Variants, useReducedMotion } from "framer-motion";

// ==================== MOCK DATA ====================
const products = [
  { id: 1, name: "White Formal Shirt", price: 799, originalPrice: 1299, image: "/images/product-1.webp", category: "Men", rating: 4.5, reviewCount: 42, isNew: true, isSale: true, tag: "Best Seller" },
  { id: 2, name: "Navy Blue Cotton Shirt", price: 999, originalPrice: 1499, image: "/images/product-2.webp", category: "Men", rating: 4.8, reviewCount: 56, isNew: false, isSale: true, tag: "Trending" },
  { id: 3, name: "Golden Zari Silk Saree", price: 1299, originalPrice: 1799, image: "/images/product-3.webp", category: "Women", rating: 4.9, reviewCount: 38, isNew: true, isSale: true, tag: "Premium" },
  { id: 4, name: "Designer Lehenga", price: 5999, originalPrice: 7999, image: "/images/product-4.webp", category: "Women", rating: 4.6, reviewCount: 23, isNew: false, isSale: true, tag: "Exclusive" },
  { id: 5, name: "Classic Denim Dungarees", price: 1299, originalPrice: 1899, image: "/images/product-5.webp", category: "Kids", rating: 4.9, reviewCount: 64, isNew: true, isSale: true, tag: "New" },
  { id: 6, name: "Urban Explorer Cargo Pants", price: 3499, originalPrice: 4999, image: "/images/product-6.webp", category: "Men", rating: 4.7, reviewCount: 89, isNew: true, isSale: true, tag: "Limited" },
  { id: 7, name: "Titan Cargo Joggers", price: 1299, originalPrice: 2499, image: "/images/product-7.webp", category: "Men", rating: 4.8, reviewCount: 42, isNew: true, isSale: true, tag: "Trending" },
  { id: 8, name: "Printed Maxi Dress", price: 2499, originalPrice: 3499, image: "/images/product-8.webp", category: "Women", rating: 4.6, reviewCount: 37, isNew: false, isSale: true, tag: "Sale" },
];

interface Product {
  id: number; name: string; price: number; originalPrice?: number; image: string;
  category: string; rating: number; reviewCount: number; isNew: boolean; isSale: boolean; tag: string;
}

function getFeaturedProducts(): Product[] {
  return products;
}

// ==================== ANIMATION VARIANTS - FIXED ====================
const getVariants = (reduceMotion: boolean): { fadeInUp: Variants; stagger: Variants } => ({
  fadeInUp: {
    hidden: reduceMotion? { opacity: 1, y: 0 } : { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: reduceMotion? { duration: 0 } : { duration: 0.4, ease: "easeOut" }
    }
  },
  stagger: {
    hidden: { opacity: reduceMotion? 1 : 0 },
    visible: {
      opacity: 1,
      transition: reduceMotion? { duration: 0 } : { staggerChildren: 0.05, delayChildren: 0.1 }
    }
  }
});

// ==================== COMPONENTS ====================

function StarRating({ rating, reviewCount }: { rating: number; reviewCount: number }) {
  return (
    <div className="flex items-center gap-1 sm:gap-1.5" aria-label={`Rating ${rating} out of 5`}>
      <div className="flex gap-0.5">
        {[1, 2, 3, 4, 5].map((star) => (
          <Star
            key={star}
            className={`h-3 w-3 sm:h-3.5 sm:w-3.5 ${
              star <= rating? "fill-primary text-primary" : "fill-muted text-muted"
            }`}
          />
        ))}
      </div>
      <span className="text-xs sm:text-sm text-muted-foreground font-medium">({reviewCount})</span>
    </div>
  );
}

function ProductCard({ product, index, reduceMotion }: { product: Product; index: number; reduceMotion: boolean }) {
  const [isLiked, setIsLiked] = useState(false);
  const variants = getVariants(reduceMotion);

  return (
    <motion.div
      variants={variants.fadeInUp}
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, margin: "-50px" }}
      className="group relative"
    >
      <Link href={`/product/${product.id}`} className="block">
        <div className="relative aspect-3/4 overflow-hidden rounded-xl sm:rounded-2xl bg-secondary/20">
          <Image
            src={product.image}
            alt={product.name}
            fill
            className="object-cover transition-transform duration-500 md:group-hover:scale-105"
            sizes="(max-width: 320px) 140px, (max-width: 640px) 45vw, (max-width: 1024px) 30vw, 25vw"
            loading={index > 3? "lazy" : "eager"}
            quality={70}
          />

          <div className="absolute top-1.5 left-1.5 sm:top-2 sm:left-2 flex flex-col gap-1 sm:gap-1.5">
            {product.isNew && (
              <span className="px-2 py-0.5 sm:px-2.5 sm:py-1 bg-primary text-primary-foreground text- sm:text-xs font-bold rounded-full">
                NEW
              </span>
            )}
            {product.isSale && (
              <span className="px-2 py-0.5 sm:px-2.5 sm:py-1 bg-destructive text-destructive-foreground text- sm:text-xs font-bold rounded-full">
                SALE
              </span>
            )}
          </div>

          <button
            aria-label={isLiked? "Remove from wishlist" : "Add to wishlist"}
            onClick={(e) => {
              e.preventDefault();
              setIsLiked(!isLiked);
              toast.success(isLiked? "Removed from wishlist" : "Added to wishlist!");
            }}
            className="absolute top-1.5 right-1.5 sm:top-2 sm:right-2 min-h- min-w- p-2.5 bg-card/90 backdrop-blur-sm rounded-full shadow-lg flex items-center justify-center"
          >
            <Heart className={`h-4 w-4 sm:h-5 sm:w-5 ${isLiked? "fill-primary text-primary" : "text-muted-foreground"}`} />
          </button>
        </div>

        <div className="mt-2 sm:mt-3 space-y-1 sm:space-y-1.5">
          <div className="flex items-center justify-between gap-2">
            <p className="text-xs sm:text-sm font-medium text-primary truncate">{product.category}</p>
            <span className="text- sm:text-xs px-1.5 sm:px-2 py-0.5 rounded-full bg-muted text-muted-foreground whitespace-nowrap">
              {product.tag}
            </span>
          </div>

          <h3 className="font-semibold text-sm sm:text-base text-foreground group-hover:text-primary transition-colors line-clamp-2 min-h-10">
            {product.name}
          </h3>

          <div className="flex items-baseline gap-1.5 sm:gap-2 flex-wrap">
            <span className="text-base sm:text-lg lg:text-xl font-bold text-foreground">₹{product.price}</span>
            {product.originalPrice && (
              <>
                <span className="text-xs sm:text-sm text-muted-foreground line-through">₹{product.originalPrice}</span>
                <span className="text- sm:text-xs bg-secondary text-secondary-foreground px-1.5 sm:px-2 py-0.5 rounded-full">
                  {Math.round(((product.originalPrice - product.price) / product.originalPrice) * 100)}% OFF
                </span>
              </>
            )}
          </div>

          <StarRating rating={product.rating} reviewCount={product.reviewCount} />
        </div>
      </Link>
    </motion.div>
  );
}

interface ButtonProps {
  children: React.ReactNode;
  variant?: "default" | "outline" | "ghost";
  size?: "sm" | "md" | "lg";
  className?: string;
  href?: string;
  [key: string]: any;
}

function Button({ children, variant = "default", size = "md", className = "", href,...props }: ButtonProps) {
  const baseClasses = "inline-flex items-center justify-center font-semibold transition-all duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring disabled:pointer-events-none disabled:opacity-50 min-h-";

  const variants = {
    default: "bg-primary text-primary-foreground hover:bg-primary/90",
    outline: "border-2 border-primary text-primary hover:bg-primary hover:text-primary-foreground",
    ghost: "text-foreground hover:bg-secondary",
  };

  const sizes = {
    sm: "px-3 py-2 text-sm rounded-full",
    md: "px-4 py-2.5 sm:px-5 sm:py-3 text-sm sm:text-base rounded-full",
    lg: "px-5 py-3 sm:px-6 sm:py-3.5 lg:px-8 lg:py-4 text-base sm:text-lg rounded-full",
  };

  if (href) {
    return <Link href={href} className={`${baseClasses} ${variants[variant]} ${sizes[size]} ${className}`} {...props}>{children}</Link>;
  }
  return <button className={`${baseClasses} ${variants[variant]} ${sizes[size]} ${className}`} {...props}>{children}</button>;
}

// ==================== HEADER ====================
export function Header() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  return (
    <header className="bg-background border-b border-border sticky top-0 z-50">
      <div className="mx-auto max-w-7xl px-3 sm:px-4 lg:px-8">
        <div className="flex items-center justify-between h-14 sm:h-16">
          <Link href="/" className="flex items-center gap-2">
            <span className="text-xl sm:text-2xl font-serif font-bold text-primary">BOTREE</span>
          </Link>

          <nav className="hidden md:flex items-center gap-4 lg:gap-6">
            {["MEN", "WOMEN", "ABOUT", "CONTACT"].map((item) => (
              <Link key={item} href={`/${item.toLowerCase()}`} className="text-sm lg:text-base text-foreground hover:text-primary transition-colors font-medium min-h- flex items-center">
                {item}
              </Link>
            ))}
          </nav>

          <div className="hidden md:block relative">
            <input
              type="text"
              placeholder="Search products..."
              className="w-48 lg:w-64 h- px-4 pl-10 rounded-full border border-border focus:outline-none focus:ring-2 focus:ring-ring text-sm lg:text-base text-foreground bg-secondary placeholder:text-muted-foreground"
            />
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          </div>

          <button
            onClick={() => setIsMenuOpen(!isMenuOpen)}
            className="md:hidden min-h- min-w- flex items-center justify-center text-primary"
            aria-label="Toggle menu"
          >
            <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              {isMenuOpen? (
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              ) : (
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
              )}
            </svg>
          </button>
        </div>

        <AnimatePresence>
          {isMenuOpen && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: "auto" }}
              exit={{ opacity: 0, height: 0 }}
              className="md:hidden overflow-hidden"
            >
              <div className="py-2 space-y-1">
                {["MEN", "WOMEN", "ABOUT", "CONTACT"].map((item) => (
                  <Link key={item} href={`/${item.toLowerCase()}`} className="block text-foreground hover:text-primary transition-colors font-medium py-3 px-2 min-h- flex items-center">
                    {item}
                  </Link>
                ))}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </header>
  );
}

// ==================== MARQUEE ====================
export function MarqueeStrip({ reduceMotion }: { reduceMotion: boolean }) {
  if (reduceMotion) {
    return (
      <div className="bg-linear-to-r from-primary via-[#E5C100] to-[#FFD700] text-primary-foreground py-2 sm:py-3 text-center px-4">
        <span className="text-xs sm:text-sm font-medium">FREE SHIPPING ON ORDERS ABOVE ₹2,000 • NEW ARRIVALS EVERY WEEK</span>
      </div>
    );
  }

  const items = ["FREE SHIPPING ON ORDERS ABOVE ₹2,000", "NEW ARRIVALS EVERY WEEK", "SUSTAINABLE FASHION", "100% QUALITY GUARANTEED"];

  return (
    <div className="bg-linear-to-r from-primary via-[#E5C100] to-[#FFD700] text-primary-foreground py-2 sm:py-3 overflow-hidden">
      <motion.div animate={{ x: [0, -1920] }} transition={{ repeat: Infinity, duration: 40, ease: "linear" }} className="flex whitespace-nowrap">
        {[...items,...items].map((text, i) => (
          <span key={i} className="mx-4 sm:mx-6 lg:mx-8 text-xs sm:text-sm font-medium">{text}</span>
        ))}
      </motion.div>
    </div>
  );
}

// ==================== HERO ====================
export function HeroSection({ reduceMotion }: { reduceMotion: boolean }) {
  return (
    <section className="relative min-h- h-[max(600px,90vh)] overflow-hidden">
      <div className="absolute inset-0">
        <Image
          src="/images/hero-2.webp"
          alt="Urban Chic Collection"
          fill
          className="object-cover"
          priority
          sizes="100vw"
          quality={75}
        />
        <div className="absolute inset-0 bg-linear-to-r from-background/95 via-background/70 to-background/40" />
      </div>

      <div className="relative z-10 h-full flex items-center">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 w-full">
          <motion.div
            initial={reduceMotion? {} : { opacity: 0, y: 30 }}
            animate={reduceMotion? {} : { opacity: 1, y: 0 }}
            className="max-w-[min(90%,42rem)]"
          >
            <div className="flex items-center gap-2 mb-3 sm:mb-4">
              <Sparkles className="h-4 w-4 sm:h-5 sm:w-5 text-primary" />
              <span className="text-xs sm:text-sm uppercase tracking-[0.2em] sm:tracking-[0.3em] text-foreground/90 font-medium">
                Street Style Essentials
              </span>
            </div>

            <h1 className="font-serif font-bold text-foreground leading-[0.95] mb-3 sm:mb-4 lg:mb-6 text-[clamp(2.25rem,8vw,6rem)]">
              Urban Chic
            </h1>

            <p className="text-sm sm:text-base md:text-lg lg:text-xl text-foreground/80 leading-relaxed mb-5 sm:mb-6 lg:mb-8 max-w-">
              Embrace the urban vibe with our latest streetwear collection, designed for the trendsetters.
            </p>

            <div className="flex flex-col xs:flex-row gap-3 sm:gap-4">
              <Button size="lg">
                Shop Streetwear <ArrowRight className="ml-2 h-4 w-4 sm:h-5 sm:w-5" />
              </Button>
              <Button size="lg" variant="outline">
                Explore Now
              </Button>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}

// ==================== MAIN PAGE ====================
export default function HomePage() {
  const reduceMotion = useReducedMotion()?? false;
  const variants = getVariants(reduceMotion);

  return (
    <main className="bg-background min-h-screen overflow-x-hidden">
      <Header />
      <MarqueeStrip reduceMotion={reduceMotion} />
      <HeroSection reduceMotion={reduceMotion} />

      <section className="mx-auto max-w-7xl px-3 sm:px-4 lg:px-8 py-10 sm:py-16 lg:py-20">
        <div className="text-center mb-8 sm:mb-12">
          <p className="text-xs uppercase tracking-[0.3em] text-muted-foreground mb-2 sm:mb-3 font-medium">
            Our Categories
          </p>
          <h2 className="font-serif text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold text-foreground">
            Shop by Collection
          </h2>
        </div>

        <div className="grid grid-cols-1 xs:grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4 lg:gap-6">
          {[
            { name: "Men", href: "/category/men", image: "/images/category-men.webp", count: "124 Products" },
            { name: "Women", href: "/category/women", image: "/images/category-women.webp", count: "156 Products" },
            { name: "Kids", href: "/category/kids", image: "/images/category-kids.webp", count: "89 Products" },
            { name: "New Arrivals", href: "/category/new-arrivals", image: "/images/hero.webp", count: "48 Products" },
          ].map((cat) => (
            <Link key={cat.name} href={cat.href} className="group relative overflow-hidden rounded-xl sm:rounded-2xl aspect-3/4">
              <Image src={cat.image} alt={cat.name} fill className="object-cover transition-transform duration-500 md:group-hover:scale-110" sizes="(max-width: 400px) 100vw, (max-width: 1024px) 50vw, 25vw" loading="lazy" />
              <div className="absolute inset-0 bg-linear-to-t from-background/80 to-transparent" />
              <div className="absolute bottom-0 left-0 right-0 p-3 sm:p-4 lg:p-6">
                <p className="text-xs uppercase tracking-wider text-muted-foreground mb-1">{cat.count}</p>
                <div className="flex items-center justify-between">
                  <h3 className="font-serif text-lg sm:text-xl lg:text-2xl font-bold text-foreground">{cat.name}</h3>
                  <ArrowRight className="h-4 w-4 sm:h-5 sm:w-5 text-foreground transition-transform group-hover:translate-x-1" />
                </div>
              </div>
            </Link>
          ))}
        </div>
      </section>

      <section className="py-10 sm:py-16 lg:py-20 bg-secondary">
        <div className="mx-auto max-w-7xl px-3 sm:px-4 lg:px-8">
          <div className="flex flex-col md:flex-row md:items-end md:justify-between mb-6 sm:mb-8 lg:mb-12 gap-4">
            <div>
              <p className="text-xs sm:text-sm uppercase tracking-[0.3em] text-primary mb-2 sm:mb-3 font-medium">
                Our Premium Picks
              </p>
              <h2 className="font-serif text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold text-foreground">
                Featured Collection
              </h2>
            </div>
            <Button variant="outline" size="md" href="/category/new-arrivals">
              View All <ChevronRight className="ml-1 h-4 w-4" />
            </Button>
          </div>

          <motion.div
            variants={variants.stagger}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-100px" }}
            className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3 sm:gap-4 lg:gap-6"
          >
            {products.slice(0, 4).map((product, index) => (
              <ProductCard key={product.id} product={product} index={index} reduceMotion={reduceMotion} />
            ))}
          </motion.div>
        </div>
      </section>

      <NewsletterSection />
      <Footer />
    </main>
  );
}

export function NewsletterSection() {
  const [email, setEmail] = useState("");
  const [isSubmitted, setIsSubmitted] = useState(false);

  return (
    <section className="py-10 sm:py-16 lg:py-20">
      <div className="mx-auto max-w-7xl px-3 sm:px-4 lg:px-8">
        <div className="relative overflow-hidden rounded-2xl sm:rounded-3xl bg-linear-to-r from-primary via-secondary to-accent p-6 sm:p-8 md:p-12 lg:p-16">
          <div className="relative z-10 text-center max-w-2xl mx-auto">
            <p className="text-xs sm:text-sm uppercase tracking-[0.3em] text-primary-foreground/80 mb-2 sm:mb-3 font-medium">
              Stay in the loop
            </p>
            <h2 className="font-serif text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold text-primary-foreground mb-3 sm:mb-4">
              Join the Botree Family
            </h2>
            <p className="text-primary-foreground/90 mb-6 sm:mb-8 text-sm sm:text-base lg:text-lg">
              Subscribe to get early access to new collections, exclusive offers, and styling inspiration.
            </p>

            <form onSubmit={(e) => { e.preventDefault(); if (email) { setIsSubmitted(true); toast.success("Welcome to Botree family! 🎉"); setEmail(""); setTimeout(() => setIsSubmitted(false), 3000); } }} className="flex flex-col sm:flex-row gap-3 max-w-md mx-auto">
              <input
                type="email"
                placeholder="Enter your email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                className="w-full h- bg-secondary border border-border rounded-full px-4 pl-10 text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring text-sm sm:text-base"
              />
              <Button type="submit" className="bg-primary-foreground text-primary hover:bg-primary-foreground/90 whitespace-nowrap">
                {isSubmitted? "Subscribed! 🎉" : "Subscribe"}
              </Button>
            </form>
          </div>
        </div>
      </div>
    </section>
  );
}

export function Footer() {
  return (
    <footer className="bg-background border-t border-border">
      <div className="mx-auto max-w-7xl px-3 sm:px-4 lg:px-8 py-10 sm:py-12 lg:py-16">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 sm:gap-8">
          <div>
            <h3 className="font-serif text-xl sm:text-2xl font-bold mb-3 sm:mb-4 text-primary">BOTREE</h3>
            <p className="text-sm sm:text-base text-muted-foreground mb-4">Curating timeless fashion for the modern contemporary design.</p>
            <div className="flex gap-2 sm:gap-3">
              {[Facebook, Instagram, Twitter, Youtube].map((Icon, i) => (
                <a key={i} href="#" className="min-h- min-w- bg-secondary rounded-full flex items-center justify-center hover:bg-primary transition-colors" aria-label="Social link">
                  <Icon className="h-4 w-4 sm:h-5 sm:w-5 text-foreground hover:text-primary-foreground" />
                </a>
              ))}
            </div>
          </div>

          {[
            { title: "COMPANY", links: ["About Us", "Careers", "Press", "Blog", "Sustainability"] },
            { title: "SUPPORT", links: ["FAQs", "Shipping Policy", "Returns", "Size Guide", "Contact Us"] },
            { title: "SHOP", links: ["Men", "Women", "Kids", "New Arrivals"] }
          ].map((col) => (
            <div key={col.title}>
              <h4 className="font-semibold text-base sm:text-lg mb-3 sm:mb-4 text-foreground">{col.title}</h4>
              <ul className="space-y-1 sm:space-y-2">
                {col.links.map((item) => (
                  <li key={item}>
                    <Link href="#" className="text-sm sm:text-base text-muted-foreground hover:text-primary transition-colors min-h- flex items-center">
                      {item}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        <div className="border-t border-border mt-8 sm:mt-12 pt-6 sm:pt-8 text-center text-xs sm:text-sm text-muted-foreground">
          <p>© 2026 Botree Clothing. All rights reserved. Made with ❤️ in India</p>
        </div>
      </div>
    </footer>
  );
}
