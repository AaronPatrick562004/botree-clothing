"use client";

import Image from "next/image";
import Link from "next/link";
import { 
  ArrowRight, Sparkles, ChevronRight, Mail, Heart, 
  Star, ShoppingBag, Truck, Shield, RefreshCw, Award,
  TrendingUp, Clock, Zap, Gem, Leaf, Sun, Moon,
  Facebook, Instagram, Twitter, Youtube, Search
} from "lucide-react";
import { useState, useEffect } from "react";
import { toast } from "sonner";
import { motion, AnimatePresence, Variants } from "framer-motion";

// ==================== MOCK DATA ====================
const products = [
  {
    id: 1,
    name: "White Formal Shirt",
    price: 799,
    originalPrice: 1299,
    image: "/images/product-1.jpg",
    category: "Men",
    rating: 4.5,
    reviewCount: 42,
    isNew: true,
    isSale: true,
    tag: "Best Seller"
  },
  {
    id: 2,
    name: "Navy Blue Cotton Shirt",
    price: 999,
    originalPrice: 1499,
    image: "/images/product-2.jpg",
    category: "Men",
    rating: 4.8,
    reviewCount: 56,
    isNew: false,
    isSale: true,
    tag: "Trending"
  },
  {
    id: 3,
    name: "Golden Zari Silk Saree",
    price: 1299,
    originalPrice: 1799,
    image: "/images/product-3.jpg",
    category: "Women",
    rating: 4.9,
    reviewCount: 38,
    isNew: true,
    isSale: true,
    tag: "Premium"
  },
  {
    id: 4,
    name: "Designer Lehenga",
    price: 5999,
    originalPrice: 7999,
    image: "/images/product-4.jpg",
    category: "Women",
    rating: 4.6,
    reviewCount: 23,
    isNew: false,
    isSale: true,
    tag: "Exclusive"
  },
  {
    id: 5,
    name: "Classic Denim Dungarees",
    price: 1299,
    originalPrice: 1899,
    image: "/images/product-5.jpg",
    category: "Kids",
    rating: 4.9,
    reviewCount: 64,
    isNew: true,
    isSale: true,
    tag: "New"
  },
  {
    id: 6,
    name: "Urban Explorer Cargo Pants",
    price: 3499,
    originalPrice: 4999,
    image: "/images/product-6.jpg",
    category: "Men",
    rating: 4.7,
    reviewCount: 89,
    isNew: true,
    isSale: true,
    tag: "Limited"
  },
  {
    id: 7,
    name: "Titan Cargo Joggers",
    price: 1299,
    originalPrice: 2499,
    image: "/images/product-7.jpg",
    category: "Men",
    rating: 4.8,
    reviewCount: 42,
    isNew: true,
    isSale: true,
    tag: "Trending"
  },
  {
    id: 8,
    name: "Printed Maxi Dress",
    price: 2499,
    originalPrice: 3499,
    image: "/images/product-8.jpg",
    category: "Women",
    rating: 4.6,
    reviewCount: 37,
    isNew: false,
    isSale: true,
    tag: "Sale"
  },
];

interface Product {
  id: number;
  name: string;
  price: number;
  originalPrice?: number;
  image: string;
  category: string;
  rating: number;
  reviewCount: number;
  isNew: boolean;
  isSale: boolean;
  tag: string;
}

function getFeaturedProducts(): Product[] {
  return products;
}

// ==================== ANIMATION VARIANTS ====================
const fadeInUpVariants: Variants = {
  hidden: { opacity: 0, y: 40 },
  visible: { 
    opacity: 1, 
    y: 0,
    transition: { duration: 0.6, ease: "easeOut" }
  }
};

const fadeInVariants: Variants = {
  hidden: { opacity: 0 },
  visible: { 
    opacity: 1,
    transition: { duration: 0.8 }
  }
};

const scaleInVariants: Variants = {
  hidden: { scale: 0.8, opacity: 0 },
  visible: { 
    scale: 1, 
    opacity: 1,
    transition: { duration: 0.5 }
  }
};

const staggerContainerVariants: Variants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1,
      delayChildren: 0.2
    }
  }
};

const slideInLeftVariants: Variants = {
  hidden: { x: -60, opacity: 0 },
  visible: { 
    x: 0, 
    opacity: 1,
    transition: { duration: 0.5, ease: "easeOut" }
  }
};

const slideInRightVariants: Variants = {
  hidden: { x: 60, opacity: 0 },
  visible: { 
    x: 0, 
    opacity: 1,
    transition: { duration: 0.5, ease: "easeOut" }
  }
};

// ==================== COMPONENTS ====================

// Enhanced Star Rating
function StarRating({ rating, reviewCount }: { rating: number; reviewCount: number }) {
  return (
    <motion.div 
      className="flex items-center gap-2"
      whileHover={{ scale: 1.05 }}
    >
      <div className="flex gap-0.5">
        {[1, 2, 3, 4, 5].map((star) => (
          <motion.div
            key={star}
            whileHover={{ scale: 1.2, rotate: 5 }}
            className="relative"
          >
            <Star
              className={`h-4 w-4 ${
                star <= rating 
                  ? "fill-primary text-primary" 
                  : "fill-muted text-muted"
              }`}
            />
            {star <= rating && (
              <motion.div
                className="absolute inset-0"
                animate={{ scale: [1, 1.5, 1], opacity: [0.5, 0, 0] }}
                transition={{ repeat: Infinity, duration: 2, delay: star * 0.2 }}
              >
                <Star className="h-4 w-4 fill-primary text-primary" />
              </motion.div>
            )}
          </motion.div>
        ))}
      </div>
      <span className="text-sm text-muted-foreground font-medium">({reviewCount})</span>
    </motion.div>
  );
}

// Enhanced Product Card
function ProductCard({ product, index }: { product: Product; index: number }) {
  const [isHovered, setIsHovered] = useState(false);
  const [isLiked, setIsLiked] = useState(false);
  
  return (
    <motion.div
      variants={{
        hidden: { opacity: 0, y: 50 },
        visible: { 
          opacity: 1, 
          y: 0,
          transition: { duration: 0.5, delay: index * 0.1 }
        }
      }}
      whileHover={{ 
        y: -8,
        transition: { duration: 0.2 }
      }}
      onHoverStart={() => setIsHovered(true)}
      onHoverEnd={() => setIsHovered(false)}
      className="group relative"
    >
      <Link href={`/product/${product.id}`} className="block">
        <div className="relative aspect-3/4 overflow-hidden rounded-2xl bg-linear-to-br from-secondary/20 to-secondary/10">
          {/* Image with zoom */}
          <motion.div
            animate={{ scale: isHovered ? 1.1 : 1 }}
            transition={{ duration: 0.6 }}
            className="relative h-full w-full"
          >
            <Image
              src={product.image}
              alt={product.name}
              fill
              className="object-cover"
              sizes="(max-width: 768px) 50vw, 25vw"
            />
          </motion.div>

          {/* Gradient overlay on hover */}
          <AnimatePresence>
            {isHovered && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="absolute inset-0 bg-linear-to-t from-background/80 via-transparent to-transparent"
              />
            )}
          </AnimatePresence>

          {/* Badges */}
          <div className="absolute top-3 left-3 flex flex-col gap-2">
            {product.isNew && (
              <motion.span
                initial={{ x: -30, opacity: 0 }}
                animate={{ x: 0, opacity: 1 }}
                className="px-3 py-1 bg-primary text-primary-foreground text-xs font-bold rounded-full shadow-lg"
              >
                NEW
              </motion.span>
            )}
            {product.isSale && (
              <motion.span
                initial={{ x: -30, opacity: 0 }}
                animate={{ x: 0, opacity: 1 }}
                transition={{ delay: 0.1 }}
                className="px-3 py-1 bg-destructive text-destructive-foreground text-xs font-bold rounded-full shadow-lg"
              >
                SALE
              </motion.span>
            )}
          </div>

          {/* Like button */}
          <motion.button
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
            onClick={(e) => {
              e.preventDefault();
              setIsLiked(!isLiked);
              toast.success(isLiked ? "Removed from wishlist" : "Added to wishlist!");
            }}
            className="absolute top-3 right-3 p-2 bg-card/90 backdrop-blur-sm rounded-full shadow-lg"
          >
            <Heart
              className={`h-4 w-4 transition-colors ${
                isLiked ? "fill-primary text-primary" : "text-muted-foreground"
              }`}
            />
          </motion.button>

          {/* Quick add button on hover */}
          <AnimatePresence>
            {isHovered && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: 20 }}
                className="absolute bottom-4 left-4 right-4"
              >
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  className="w-full bg-primary text-primary-foreground rounded-full py-3 font-semibold shadow-lg flex items-center justify-center gap-2 hover:bg-primary/90 transition-colors"
                  onClick={(e) => {
                    e.preventDefault();
                    toast.success(`${product.name} added to cart!`);
                  }}
                >
                  <ShoppingBag className="h-4 w-4" />
                  Quick Add
                </motion.button>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* Product Info */}
        <motion.div 
          className="mt-4 space-y-2"
          animate={{ y: isHovered ? -4 : 0 }}
        >
          <div className="flex items-center justify-between">
            <p className="text-sm font-medium text-primary">{product.category}</p>
            <span className="text-xs px-2 py-1 rounded-full bg-muted text-muted-foreground">
              {product.tag}
            </span>
          </div>
          
          <h3 className="font-semibold text-foreground group-hover:text-primary transition-colors">
            {product.name}
          </h3>
          
          <div className="flex items-center gap-2">
            <span className="text-xl font-bold text-foreground">₹{product.price}</span>
            {product.originalPrice && (
              <>
                <span className="text-sm text-muted-foreground line-through">
                  ₹{product.originalPrice}
                </span>
                <span className="text-xs bg-secondary text-secondary-foreground px-2 py-0.5 rounded-full">
                  {Math.round(((product.originalPrice - product.price) / product.originalPrice) * 100)}% OFF
                </span>
              </>
            )}
          </div>
          
          <StarRating rating={product.rating} reviewCount={product.reviewCount} />
        </motion.div>
      </Link>
    </motion.div>
  );
}

// Enhanced Button
interface ButtonProps {
  children: React.ReactNode;
  variant?: "default" | "outline" | "ghost";
  size?: "sm" | "md" | "lg";
  className?: string;
  href?: string;
  [key: string]: any;
}

function Button({ children, variant = "default", size = "md", className = "", href, ...props }: ButtonProps) {
  const baseClasses = "inline-flex items-center justify-center font-semibold transition-all duration-300 focus-visible:outline-none disabled:pointer-events-none disabled:opacity-50 relative overflow-hidden group";
  
  const variants = {
    default: "bg-primary text-primary-foreground hover:bg-primary/90 hover:shadow-lg hover:shadow-primary/30",
    outline: "border-2 border-primary text-primary hover:bg-primary hover:text-primary-foreground",
    ghost: "text-foreground hover:bg-secondary",
  };
  
  const sizes = {
    sm: "h-9 px-4 text-sm rounded-full",
    md: "h-11 px-6 rounded-full",
    lg: "h-14 px-8 text-lg rounded-full",
  };
  
  // Only use Link if href is provided
  if (href) {
    return (
      <Link
        href={href}
        className={`${baseClasses} ${variants[variant]} ${sizes[size]} ${className}`}
        {...props}
      >
        <span className="relative z-10 flex items-center gap-2">{children}</span>
        <motion.span
          className="absolute inset-0 bg-linear-to-r from-white/20 to-transparent"
          initial={{ x: "-100%" }}
          whileHover={{ x: "100%" }}
          transition={{ duration: 0.5 }}
        />
      </Link>
    );
  }
  
  return (
    <button
      className={`${baseClasses} ${variants[variant]} ${sizes[size]} ${className}`}
      {...props}
    >
      <span className="relative z-10 flex items-center gap-2">{children}</span>
      <motion.span
        className="absolute inset-0 bg-gradient-to-r from-white/20 to-transparent"
        initial={{ x: "-100%" }}
        whileHover={{ x: "100%" }}
        transition={{ duration: 0.5 }}
      />
    </button>
  );
}

// Enhanced Input
interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  icon?: React.ReactNode;
}

function Input({ className = "", icon, ...props }: InputProps) {
  return (
    <div className="relative">
      {icon && (
        <div className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground">
          {icon}
        </div>
      )}
      <input
        className={`w-full h-11 bg-secondary border border-border rounded-full px-4 ${
          icon ? 'pl-10' : ''
        } text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring ${className}`}
        {...props}
      />
    </div>
  );
}

// ==================== HEADER SECTION ====================
export function Header() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  return (
    <header className="bg-background border-b border-border sticky top-0 z-50">
      <div className="mx-auto max-w-7xl px-4 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-2">
            <span className="text-2xl font-serif font-bold text-primary">BOTREE</span>
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center gap-6">
            <Link href="/men" className="text-foreground hover:text-primary transition-colors font-medium">
              MEN
            </Link>
            <Link href="/women" className="text-foreground hover:text-primary transition-colors font-medium">
              WOMEN
            </Link>
            <Link href="/about" className="text-foreground hover:text-primary transition-colors font-medium">
              ABOUT
            </Link>
            <Link href="/contact" className="text-foreground hover:text-primary transition-colors font-medium">
              CONTACT
            </Link>
          </nav>

          {/* Search Bar */}
          <div className="hidden md:block relative">
            <input
              type="text"
              placeholder="Search products..."
              className="w-64 px-4 py-2 pl-10 rounded-full border border-border focus:outline-none focus:ring-2 focus:ring-ring text-foreground bg-secondary placeholder:text-muted-foreground"
            />
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          </div>

          {/* Mobile menu button */}
          <button
            onClick={() => setIsMenuOpen(!isMenuOpen)}
            className="md:hidden text-primary"
          >
            <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              {isMenuOpen ? (
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              ) : (
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
              )}
            </svg>
          </button>
        </div>

        {/* Mobile menu */}
        <AnimatePresence>
          {isMenuOpen && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: "auto" }}
              exit={{ opacity: 0, height: 0 }}
              className="md:hidden overflow-hidden"
            >
              <div className="py-4 space-y-4">
                <nav className="flex flex-col gap-3">
                  <Link href="/men" className="text-foreground hover:text-primary transition-colors font-medium py-2">
                    MEN
                  </Link>
                  <Link href="/women" className="text-foreground hover:text-primary transition-colors font-medium py-2">
                    WOMEN
                  </Link>
                  <Link href="/about" className="text-foreground hover:text-primary transition-colors font-medium py-2">
                    ABOUT
                  </Link>
                  <Link href="/contact" className="text-foreground hover:text-primary transition-colors font-medium py-2">
                    CONTACT
                  </Link>
                </nav>
                <div className="relative">
                  <input
                    type="text"
                    placeholder="Search products..."
                    className="w-full px-4 py-2 pl-10 rounded-full border border-border focus:outline-none focus:ring-2 focus:ring-ring text-foreground bg-secondary placeholder:text-muted-foreground"
                  />
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </header>
  );
}

// ==================== MAIN SECTIONS ====================

// Marquee Strip with gradient - UPDATED TO GOLDEN
export function MarqueeStrip() {
  const items = [
    { text: "FREE SHIPPING ON ORDERS ABOVE ₹2,000", icon: <Truck className="h-4 w-4" /> },
    { text: "NEW ARRIVALS EVERY WEEK", icon: <Sparkles className="h-4 w-4" /> },
    { text: "SUSTAINABLE FASHION", icon: <Leaf className="h-4 w-4" /> },
    { text: "100% QUALITY GUARANTEED", icon: <Award className="h-4 w-4" /> },
    { text: "EASY RETURNS WITHIN 30 DAYS", icon: <RefreshCw className="h-4 w-4" /> },
    { text: "PREMIUM COLLECTION", icon: <Gem className="h-4 w-4" /> },
  ];

  return (
    <div className="bg-gradient-to-r from-primary via-[#E5C100] to-[#FFD700] text-primary-foreground py-3 overflow-hidden">
      <motion.div
        animate={{ x: [0, -1920] }}
        transition={{ repeat: Infinity, duration: 40, ease: "linear" }}
        className="flex whitespace-nowrap"
      >
        {[...items, ...items].map((item, i) => (
          <motion.span
            key={i}
            className="mx-8 text-sm font-medium flex items-center gap-2"
            whileHover={{ scale: 1.1 }}
          >
            {item.icon}
            {item.text}
          </motion.span>
        ))}
      </motion.div>
    </div>
  );
}

// Hero Section
export function HeroSection() {
  const slides = [
    {
      title: "Urban Chic",
      subtitle: "Street Style Essentials",
      description: "Embrace the urban vibe with our latest streetwear collection, designed for the trendsetters.",
      cta: "Shop Streetwear",
      cta2: "Explore Now",
      image: "/images/hero-2.jpg",
    }
  ];

  return (
    <section className="relative h-[90vh] min-h-[600px] overflow-hidden">
      <div className="absolute inset-0">
        <Image
          src={slides[0].image}
          alt={slides[0].title}
          fill
          className="object-cover"
          priority
        />
        <div className="absolute inset-0 bg-gradient-to-r from-background/80 to-background/40" />
      </div>

      {/* Content */}
      <div className="relative z-10 h-full flex items-center">
        <div className="mx-auto max-w-7xl px-4 lg:px-8 w-full">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="max-w-2xl"
          >
            <motion.div
              animate={{ y: [0, -10, 0] }}
              transition={{ repeat: Infinity, duration: 3, ease: "easeInOut" }}
              className="flex items-center gap-2 mb-4"
            >
              <Sparkles className="h-5 w-5 text-primary" />
              <span className="text-sm uppercase tracking-[0.3em] text-foreground/90 font-medium">
                {slides[0].subtitle}
              </span>
            </motion.div>

            <motion.h1
              animate={{ scale: [1, 1.02, 1] }}
              transition={{ repeat: Infinity, duration: 2, ease: "easeInOut" }}
              className="font-serif text-5xl md:text-7xl lg:text-8xl font-bold text-foreground leading-[0.95] mb-6"
            >
              {slides[0].title}
            </motion.h1>

            <motion.p
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.5 }}
              className="text-lg md:text-xl text-foreground/80 leading-relaxed mb-8 max-w-lg"
            >
              {slides[0].description}
            </motion.p>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.7 }}
              className="flex gap-4"
            >
              <Button size="lg" variant="default">
                {slides[0].cta}
                <ArrowRight className="ml-2 h-5 w-5" />
              </Button>
              <Button size="lg" variant="outline">
                {slides[0].cta2}
              </Button>
            </motion.div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}

// Category Grid
const categories = [
  {
    name: "Men",
    href: "/category/men",
    image: "/images/category-men.jpg",
    count: "124 Products",
  },
  {
    name: "Women",
    href: "/category/women",
    image: "/images/category-women.jpg",
    count: "156 Products",
  },
  {
    name: "Kids",
    href: "/category/kids",
    image: "/images/category-kids.jpg",
    count: "89 Products",
  },
  {
    name: "New Arrivals",
    href: "/category/new-arrivals",
    image: "/images/hero.jpg",
    count: "48 Products",
  },
];

export function CategoryGrid() {
  return (
    <section className="mx-auto max-w-7xl px-4 py-20 lg:px-8">
      <div className="text-center mb-12">
        <p className="text-xs uppercase tracking-[0.3em] text-muted-foreground mb-3 font-medium">
          Our Categories
        </p>
        <h2 className="font-serif text-4xl md:text-5xl font-bold text-foreground">
          Shop by Collection
        </h2>
        <p className="text-muted-foreground mt-4 max-w-2xl mx-auto">
          Explore our curated collection across different categories
        </p>
      </div>
      
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {categories.map((cat) => (
          <Link
            key={cat.name}
            href={cat.href}
            className="group relative overflow-hidden rounded-2xl aspect-3/4 shadow-lg hover:shadow-xl transition-shadow"
          >
            <Image
              src={cat.image}
              alt={cat.name}
              fill
              className="object-cover transition-transform duration-700 group-hover:scale-110"
              sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-background/80 to-transparent" />
            <div className="absolute bottom-0 left-0 right-0 p-6">
              <p className="text-xs uppercase tracking-wider text-muted-foreground mb-1">
                {cat.count}
              </p>
              <div className="flex items-center justify-between">
                <h3 className="font-serif text-2xl font-bold text-foreground">
                  {cat.name}
                </h3>
                <ArrowRight className="h-5 w-5 text-foreground transition-transform group-hover:translate-x-1" />
              </div>
            </div>
          </Link>
        ))}
      </div>
    </section>
  );
}

// Featured Products
export function FeaturedProducts() {
  const featuredProducts = getFeaturedProducts();

  return (
    <section className="py-20 bg-secondary">
      <div className="mx-auto max-w-7xl px-4 lg:px-8">
        <motion.div
          variants={fadeInUpVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          className="flex flex-col md:flex-row md:items-end md:justify-between mb-12 gap-4"
        >
          <div>
            <motion.span
              animate={{ scale: [1, 1.1, 1] }}
              transition={{ repeat: Infinity, duration: 2, ease: "easeInOut" }}
              className="inline-block mb-3"
            >
              <TrendingUp className="h-6 w-6 text-primary" />
            </motion.span>
            <p className="text-sm uppercase tracking-[0.3em] text-primary mb-3 font-medium">
              Our Premium Picks
            </p>
            <h2 className="font-serif text-4xl md:text-5xl font-bold text-foreground">
              Featured Collection
            </h2>
            <p className="text-muted-foreground mt-2">
              Discover our most loved products
            </p>
          </div>
          <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
            <Link href="/category/new-arrivals">
              <Button variant="outline" size="md">
                View All <ChevronRight className="ml-1 h-4 w-4" />
              </Button>
            </Link>
          </motion.div>
        </motion.div>

        <motion.div
          variants={staggerContainerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6"
        >
          {featuredProducts.slice(0, 4).map((product, index) => (
            <ProductCard key={product.id} product={product} index={index} />
          ))}
        </motion.div>
      </div>
    </section>
  );
}

// Newsletter Section - UPDATED WITH STAY IN THE LOOP
export function NewsletterSection() {
  const [email, setEmail] = useState("");
  const [isSubmitted, setIsSubmitted] = useState(false);

  function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    if (email) {
      setIsSubmitted(true);
      toast.success("Welcome to Botree family! 🎉");
      setEmail("");
      setTimeout(() => setIsSubmitted(false), 3000);
    }
  }

  return (
    <section className="py-20">
      <div className="mx-auto max-w-7xl px-4 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 50, scale: 0.95 }}
          whileInView={{ opacity: 1, y: 0, scale: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="relative overflow-hidden rounded-3xl bg-linear-to-r from-primary via-secondary to-accent p-8 md:p-16"
        >
          {/* Animated background patterns */}
          <motion.div
            animate={{ rotate: 360 }}
            transition={{ repeat: Infinity, duration: 30, ease: "linear" }}
            className="absolute top-0 right-0 w-64 h-64 bg-white/5 rounded-full -mt-20 -mr-20"
          />
          <motion.div
            animate={{ rotate: -360 }}
            transition={{ repeat: Infinity, duration: 25, ease: "linear" }}
            className="absolute bottom-0 left-0 w-96 h-96 bg-white/5 rounded-full -mb-40 -ml-40"
          />

          <div className="relative z-10 text-center max-w-2xl mx-auto">
            <motion.div
              animate={{ y: [0, -10, 0] }}
              transition={{ repeat: Infinity, duration: 3, ease: "easeInOut" }}
              className="inline-block mb-4"
            >
              <Mail className="h-8 w-8 text-primary-foreground" />
            </motion.div>

            {/* Stay in the loop */}
            <motion.p
              variants={fadeInUpVariants}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true }}
              className="text-sm uppercase tracking-[0.3em] text-primary-foreground/80 mb-3 font-medium"
            >
              Stay in the loop
            </motion.p>

            <motion.h2
              variants={fadeInUpVariants}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true }}
              className="font-serif text-3xl md:text-5xl font-bold text-primary-foreground mb-4"
            >
              Join the Botree Family
            </motion.h2>

            <motion.p
              variants={fadeInUpVariants}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true }}
              transition={{ delay: 0.1 }}
              className="text-primary-foreground/90 mb-8 text-lg"
            >
              Subscribe to get early access to new collections, exclusive offers, and styling inspiration.
            </motion.p>

            <motion.form
              variants={fadeInUpVariants}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true }}
              transition={{ delay: 0.2 }}
              onSubmit={handleSubmit}
              className="flex flex-col sm:flex-row gap-3 max-w-md mx-auto"
            >
              <Input
                type="email"
                placeholder="Enter your email"
                value={email}
                onChange={(e: React.ChangeEvent<HTMLInputElement>) => setEmail(e.target.value)}
                icon={<Mail className="h-4 w-4" />}
                required
              />
              <motion.div
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                <Button
                  type="submit"
                  variant="default"
                  size="md"
                  className="bg-primary-foreground text-primary hover:bg-primary-foreground/90 whitespace-nowrap"
                >
                  {isSubmitted ? "Subscribed! 🎉" : "Subscribe"}
                </Button>
              </motion.div>
            </motion.form>

            <motion.p
              variants={fadeInUpVariants}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true }}
              transition={{ delay: 0.3 }}
              className="text-primary-foreground/60 text-sm mt-4"
            >
              No spam, unsubscribe anytime
            </motion.p>
          </div>
        </motion.div>
      </div>
    </section>
  );
}

// Footer Section
export function Footer() {
  return (
    <footer className="bg-background border-t border-border">
      <div className="mx-auto max-w-7xl px-4 lg:px-8 py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {/* Brand */}
          <motion.div
            variants={slideInLeftVariants}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
          >
            <h3 className="font-serif text-2xl font-bold mb-4 text-primary">
              BOTREE
            </h3>
            <p className="text-muted-foreground mb-4">
              Curating timeless fashion for the modern contemporary design.
            </p>
            <div className="flex gap-3">
              {[Facebook, Instagram, Twitter, Youtube].map((Icon, i) => (
                <motion.a
                  key={i}
                  whileHover={{ y: -3, scale: 1.1 }}
                  href="#"
                  className="w-10 h-10 bg-secondary rounded-full flex items-center justify-center hover:bg-primary transition-colors"
                >
                  <Icon className="h-5 w-5 text-foreground hover:text-primary-foreground" />
                </motion.a>
              ))}
            </div>
            <p className="text-muted-foreground text-sm mt-4">Made with ❤️ in India</p>
          </motion.div>

          {/* Company */}
          <motion.div
            variants={fadeInUpVariants}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
          >
            <h4 className="font-semibold text-lg mb-4 text-foreground">COMPANY</h4>
            <ul className="space-y-2">
              {["About Us", "Careers", "Press", "Blog", "Sustainability"].map((item, i) => (
                <motion.li
                  key={i}
                  whileHover={{ x: 5 }}
                >
                  <Link href="#" className="text-muted-foreground hover:text-primary transition-colors">
                    {item}
                  </Link>
                </motion.li>
              ))}
            </ul>
          </motion.div>

          {/* Support */}
          <motion.div
            variants={fadeInUpVariants}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            transition={{ delay: 0.1 }}
          >
            <h4 className="font-semibold text-lg mb-4 text-foreground">SUPPORT</h4>
            <ul className="space-y-2">
              {["FAQs", "Shipping Policy", "Returns", "Size Guide", "Contact Us"].map((item, i) => (
                <motion.li
                  key={i}
                  whileHover={{ x: 5 }}
                >
                  <Link href="#" className="text-muted-foreground hover:text-primary transition-colors">
                    {item}
                  </Link>
                </motion.li>
              ))}
            </ul>
          </motion.div>

          {/* Shop */}
          <motion.div
            variants={slideInRightVariants}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
          >
            <h4 className="font-semibold text-lg mb-4 text-foreground">SHOP</h4>
            <ul className="space-y-2 text-muted-foreground">
              <li><Link href="/men" className="hover:text-primary transition-colors">Men</Link></li>
              <li><Link href="/women" className="hover:text-primary transition-colors">Women</Link></li>
              <li><Link href="/kids" className="hover:text-primary transition-colors">Kids</Link></li>
              <li><Link href="/new-arrivals" className="hover:text-primary transition-colors">New Arrivals</Link></li>
            </ul>
          </motion.div>
        </div>

        {/* Bottom Bar */}
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ delay: 0.5 }}
          className="border-t border-border mt-12 pt-8 text-center text-muted-foreground"
        >
          <p>© 2026 Botree Clothing. All rights reserved. Made with ❤️ in India</p>
        </motion.div>
      </div>
    </footer>
  );
}

// Main Homepage Component
export default function HomePage() {
  return (
    <main className="bg-background min-h-screen">
      <Header />
      <MarqueeStrip />
      <HeroSection />
      <CategoryGrid />
      <FeaturedProducts />
      <NewsletterSection />
      <Footer />
    </main>
  );
}