"use client";

import Image from "next/image";
import Link from "next/link";
import { ArrowRight, ChevronLeft, ChevronRight, Sparkles } from "lucide-react";
import { useState, useEffect } from "react";
import { motion, AnimatePresence, Variants } from "framer-motion";

// Enhanced Button component with animations
const Button = ({ children, variant = "default", size = "default", className = "", href, ...props }: any) => {
  const baseClasses = "inline-flex items-center justify-center font-medium transition-all duration-300 focus-visible:outline-none disabled:pointer-events-none disabled:opacity-50 relative overflow-hidden group";
  
  const variants = {
    default: "bg-white text-black hover:bg-gray-100 shadow-lg hover:shadow-xl",
    outline: "border-2 border-white text-white hover:bg-white/20 backdrop-blur-sm",
  };
  
  const sizes = {
    default: "h-10 px-4 py-2",
    lg: "h-12 px-8",
  };
  
  const Component = href ? Link : 'button';
  
  return (
    <Component
      href={href}
      className={`${baseClasses} ${variants[variant as keyof typeof variants]} ${sizes[size as keyof typeof sizes]} ${className}`}
      {...props}
    >
      <span className="relative z-10">{children}</span>
      {variant === "default" && (
        <motion.span
          className="absolute inset-0 bg-linear-to-r from-black/5 to-black/10"
          initial={{ x: "-100%" }}
          whileHover={{ x: "100%" }}
          transition={{ duration: 0.5 }}
        />
      )}
    </Component>
  );
};

const heroSlides = [
  {
    id: 1,
    src: "/images/hero/hero-1.jpg",
    alt: "Botree Clothing Collection 1",
    title: "Redefine Your Style",
    subtitle: "Spring / Summer 2026",
    description: "Curated collections designed for the modern wardrobe. Where quality craftsmanship meets contemporary elegance.",
    cta1: "Shop New Arrivals",
    cta2: "Explore Collections",
    link1: "/category/new-arrivals",
    link2: "/category/women",
  },
  {
    id: 2,
    src: "/images/hero/hero-2.jpg",
    alt: "Botree Clothing Collection 2",
    title: "Ethnic Elegance",
    subtitle: "Traditional Collection",
    description: "Discover our exquisite range of traditional wear with a contemporary twist, perfect for every occasion.",
    cta1: "Shop Ethnic Wear",
    cta2: "View Collection",
    link1: "/category/ethnic",
    link2: "/category/festive",
  },
  {
    id: 3,
    src: "/images/hero/hero-3.jpg",
    alt: "Botree Clothing Collection 3",
    title: "Urban Chic",
    subtitle: "Street Style Essentials",
    description: "Embrace the urban vibe with our latest streetwear collection, designed for the trendsetters.",
    cta1: "Shop Streetwear",
    cta2: "Explore Now",
    link1: "/category/streetwear",
    link2: "/category/new-arrivals",
  },
  {
    id: 4,
    src: "/images/hero/hero-4.jpg",
    alt: "Botree Clothing Collection 4",
    title: "Luxury Comfort",
    subtitle: "Premium Collection",
    description: "Experience unparalleled comfort with our premium fabric collection, where luxury meets everyday wear.",
    cta1: "Shop Premium",
    cta2: "View Details",
    link1: "/category/premium",
    link2: "/category/men",
  }
];

// Define variants properly
const slideVariants: Variants = {
  enter: (direction: number) => ({
    x: direction > 0 ? 1000 : -1000,
    opacity: 0,
    scale: 0.8,
  }),
  center: {
    zIndex: 1,
    x: 0,
    opacity: 1,
    scale: 1,
  },
  exit: (direction: number) => ({
    zIndex: 0,
    x: direction < 0 ? 1000 : -1000,
    opacity: 0,
    scale: 0.8,
  }),
};

const textVariants: Variants = {
  hidden: { opacity: 0, y: 20 },
  visible: (delay: number) => ({
    opacity: 1,
    y: 0,
    transition: {
      delay,
      duration: 0.6,
      ease: "easeOut",
    },
  }),
};

export function HeroSection() {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [direction, setDirection] = useState(0);
  const [isAutoPlaying, setIsAutoPlaying] = useState(true);

  const nextSlide = () => {
    setDirection(1);
    setCurrentIndex((prev) => (prev + 1) % heroSlides.length);
  };

  const prevSlide = () => {
    setDirection(-1);
    setCurrentIndex((prev) => (prev - 1 + heroSlides.length) % heroSlides.length);
  };

  const goToSlide = (index: number) => {
    setDirection(index > currentIndex ? 1 : -1);
    setCurrentIndex(index);
  };

  // Auto-play carousel
  useEffect(() => {
    if (!isAutoPlaying) return;
    
    const timer = setInterval(nextSlide, 6000);
    return () => clearInterval(timer);
  }, [isAutoPlaying, currentIndex]);

  // Pause auto-play when user interacts
  const handleUserInteraction = () => {
    setIsAutoPlaying(false);
    // Resume auto-play after 10 seconds of inactivity
    setTimeout(() => setIsAutoPlaying(true), 10000);
  };

  return (
    <section 
      className="relative min-h-[90vh] flex items-center overflow-hidden bg-black"
      onMouseEnter={() => setIsAutoPlaying(false)}
      onMouseLeave={() => setIsAutoPlaying(true)}
    >
      {/* Animated Background Slides */}
      <AnimatePresence initial={false} custom={direction} mode="wait">
        <motion.div
          key={currentIndex}
          custom={direction}
          variants={slideVariants}
          initial="enter"
          animate="center"
          exit="exit"
          transition={{
            x: { type: "spring", stiffness: 300, damping: 30 },
            opacity: { duration: 0.4 },
            scale: { duration: 0.4 },
          }}
          className="absolute inset-0"
        >
          <div className="relative h-full w-full">
            <Image
              src={heroSlides[currentIndex].src}
              alt={heroSlides[currentIndex].alt}
              fill
              className="object-cover"
              priority={currentIndex === 0}
              quality={95}
            />
            {/* Subtle dark overlay for text readability */}
            <div className="absolute inset-0 bg-linear-to-r from-black/40 to-black/20" />
          </div>
        </motion.div>
      </AnimatePresence>
      
      {/* Navigation Arrows with animations */}
      <motion.button
        onClick={() => {
          handleUserInteraction();
          prevSlide();
        }}
        className="absolute left-4 z-20 p-3 rounded-full bg-white/20 text-white hover:bg-white/40 backdrop-blur-md transition-all hover:scale-110"
        whileHover={{ scale: 1.1, backgroundColor: "rgba(255,255,255,0.4)" }}
        whileTap={{ scale: 0.9 }}
        aria-label="Previous slide"
      >
        <ChevronLeft className="h-6 w-6" />
      </motion.button>
      
      <motion.button
        onClick={() => {
          handleUserInteraction();
          nextSlide();
        }}
        className="absolute right-4 z-20 p-3 rounded-full bg-white/20 text-white hover:bg-white/40 backdrop-blur-md transition-all hover:scale-110"
        whileHover={{ scale: 1.1, backgroundColor: "rgba(255,255,255,0.4)" }}
        whileTap={{ scale: 0.9 }}
        aria-label="Next slide"
      >
        <ChevronRight className="h-6 w-6" />
      </motion.button>

      {/* Content with staggered animations */}
      <div className="relative z-10 mx-auto max-w-7xl px-4 lg:px-8 w-full">
        <div className="max-w-2xl">
          <motion.div
            custom={0.2}
            variants={textVariants}
            initial="hidden"
            animate="visible"
            className="mb-4 flex items-center gap-2"
          >
            <Sparkles className="h-5 w-5 text-white" />
            <p className="text-sm uppercase tracking-[0.3em] text-white/90 font-medium">
              {heroSlides[currentIndex].subtitle}
            </p>
          </motion.div>

          <motion.h1
            custom={0.4}
            variants={textVariants}
            initial="hidden"
            animate="visible"
            className="font-serif text-5xl md:text-7xl lg:text-8xl font-bold text-white leading-[0.95] mb-6 text-balance"
          >
            {heroSlides[currentIndex].title}
          </motion.h1>

          <motion.p
            custom={0.6}
            variants={textVariants}
            initial="hidden"
            animate="visible"
            className="text-lg md:text-xl text-white/90 leading-relaxed mb-8 max-w-lg"
          >
            {heroSlides[currentIndex].description}
          </motion.p>

          <motion.div
            custom={0.8}
            variants={textVariants}
            initial="hidden"
            animate="visible"
            className="flex flex-wrap gap-4"
          >
            <Link href={heroSlides[currentIndex].link1}>
              <Button
                size="lg"
                className="bg-white text-black hover:bg-gray-100 rounded-full px-8 text-sm uppercase tracking-wider font-semibold shadow-lg hover:shadow-xl"
              >
                {heroSlides[currentIndex].cta1}
                <motion.span
                  animate={{ x: [0, 5, 0] }}
                  transition={{ repeat: Infinity, duration: 1.5, ease: "easeInOut" }}
                >
                  <ArrowRight className="ml-2 h-4 w-4" />
                </motion.span>
              </Button>
            </Link>
            <Link href={heroSlides[currentIndex].link2}>
              <Button
                size="lg"
                variant="outline"
                className="border-2 border-white text-white hover:bg-white/20 rounded-full px-8 text-sm uppercase tracking-wider font-semibold shadow-lg backdrop-blur-sm"
              >
                {heroSlides[currentIndex].cta2}
              </Button>
            </Link>
          </motion.div>
        </div>
      </div>

      {/* Slide Indicators with animations */}
      <div className="absolute bottom-6 left-1/2 -translate-x-1/2 z-20 flex gap-3">
        {heroSlides.map((_, index) => (
          <motion.button
            key={index}
            onClick={() => {
              handleUserInteraction();
              goToSlide(index);
            }}
            className="relative group"
            whileHover={{ scale: 1.2 }}
            whileTap={{ scale: 0.9 }}
            aria-label={`Go to slide ${index + 1}`}
          >
            <div
              className={`transition-all duration-300 ${
                index === currentIndex 
                  ? "w-10 h-2.5 bg-white shadow-lg" 
                  : "w-2.5 h-2.5 bg-white/40 group-hover:bg-white/70"
              } rounded-full`}
            />
            {index === currentIndex && (
              <motion.div
                className="absolute inset-0 rounded-full bg-white"
                initial={{ scale: 1 }}
                animate={{ scale: [1, 1.5, 1] }}
                transition={{ repeat: Infinity, duration: 2, ease: "easeInOut" }}
                style={{ opacity: 0.3 }}
              />
            )}
          </motion.button>
        ))}
      </div>

      {/* Progress Bar */}
      <motion.div
        className="absolute bottom-0 left-0 h-1 bg-linear-to-r from-[#5F8B4B] via-[#A7C4A0] to-[#C44536]"
        initial={{ width: "0%" }}
        animate={{ width: "100%" }}
        transition={{
          duration: 6,
          ease: "linear",
          repeat: isAutoPlaying ? Infinity : 0,
        }}
        key={currentIndex}
      />
    </section>
  );
}