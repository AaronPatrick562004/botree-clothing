import Image from "next/image";
import Link from "next/link";
import { ArrowRight } from "lucide-react";

const categories = [
  {
    name: "Men",
    href: "/category/men",
    image: "/images/category-men.jpg",
    count: "24 Products",
  },
  {
    name: "Women",
    href: "/category/women",
    image: "/images/category-women.jpg",
    count: "24 Products",
  },
  {
    name: "Kids",
    href: "/category/kids",
    image: "/images/category-kids.jpg",
    count: "24 Products",
  },
  {
    name: "New Arrivals",
    href: "/category/new-arrivals",
    image: "/images/new-arrivals.jpg",
    count: "24 Products",
  },
];

export function CategoryGrid() {
  return (
    <section className="mx-auto max-w-7xl px-4 py-20 lg:px-8">
      <div className="text-center mb-12">
        <p className="text-xs uppercase tracking-[0.3em] text-muted-foreground mb-3 font-medium">
          Browse by
        </p>
        <h2 className="font-serif text-4xl md:text-5xl font-bold text-foreground text-balance">
          Our Categories
        </h2>
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {categories.map((cat) => (
          <Link
            key={cat.name}
            href={cat.href}
            className="group relative overflow-hidden rounded-xl aspect-3/4"
          >
            <Image
              src={cat.image}
              alt={cat.name}
              fill
              className="object-cover transition-transform duration-700 group-hover:scale-110"
              sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw"
            />
            <div className="absolute inset-0 bg-linear-to-t from-foreground/70 via-foreground/20 to-transparent" />
            <div className="absolute bottom-0 left-0 right-0 p-6">
              <p className="text-xs uppercase tracking-wider text-primary-foreground/70 mb-1">
                {cat.count}
              </p>
              <div className="flex items-center justify-between">
                <h3 className="font-serif text-2xl font-bold text-primary-foreground">
                  {cat.name}
                </h3>
                <ArrowRight className="h-5 w-5 text-primary-foreground transition-transform group-hover:translate-x-1" />
              </div>
            </div>
          </Link>
        ))}
      </div>
    </section>
  );
}