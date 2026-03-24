import { HeroSection } from "@/components/home/hero-section";
import { CategoryGrid } from "@/components/home/category-grid";
import { FeaturedProducts } from "@/components/home/featured-products";
import { MarqueeStrip } from "@/components/home/marquee-strip";
import { NewsletterSection } from "@/components/home/newsletter-section";

export default function Home() {
  return (
    <main>
      <MarqueeStrip />
      <HeroSection />
      <CategoryGrid />
      <FeaturedProducts />
      <NewsletterSection />
    </main>
  );
}