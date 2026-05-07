import Image from "next/image";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Users, Award, Heart, Shield, Truck, Leaf } from "lucide-react";

export default function AboutPage() {
  return (
    <div className="mx-auto max-w-7xl px-4 py-12 lg:px-8">
      {/* Hero Section */}
      <div className="text-center mb-16">
        <h1 className="font-serif text-4xl md:text-5xl lg:text-6xl font-bold text-foreground mb-6">
          About Botree Clothing
        </h1>
        <p className="text-lg text-muted-foreground max-w-3xl mx-auto">
          Curating timeless fashion for the modern wardrobe since 2020. Quality craftsmanship meets contemporary design.
        </p>
      </div>

      {/* Story Section */}
      <div className="grid md:grid-cols-2 gap-12 items-center mb-20">
        <div className="space-y-6">
          <h2 className="font-serif text-3xl font-bold text-foreground">Our Story</h2>
          <p className="text-muted-foreground leading-relaxed">
            Botree Clothing was born from a simple idea: create premium fashion that doesn't compromise on comfort or style. What started as a small collection of essential pieces has grown into a complete lifestyle brand serving customers across India.
          </p>
          <p className="text-muted-foreground leading-relaxed">
            We believe that what you wear should make you feel confident, comfortable, and authentic. Every piece in our collection is carefully designed and crafted to meet the highest standards of quality.
          </p>
          <div className="flex items-center gap-4 pt-4">
            <div className="flex -space-x-2">
              {[1, 2, 3, 4].map((i) => (
                <div key={i} className="w-10 h-10 rounded-full bg-primary/20 border-2 border-background" />
              ))}
            </div>
            <p className="text-sm text-muted-foreground">
              <span className="font-semibold text-foreground">10,000+</span> happy customers
            </p>
          </div>
        </div>
        <div className="relative h-100 rounded-lg overflow-hidden">          <Image
          src="/images/about/Botree.jpg"
          alt="Botree Studio"
          fill
          className="object-cover"
        />
        </div>
      </div>

      {/* Values Section */}
      <div className="mb-20">
        <h2 className="font-serif text-3xl font-bold text-center text-foreground mb-12">
          What We Stand For
        </h2>
        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
          <div className="text-center p-6">
            <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4">
              <Leaf className="h-8 w-8 text-primary" />
            </div>
            <h3 className="font-semibold text-lg mb-2">Sustainable</h3>
            <p className="text-sm text-muted-foreground">Eco-friendly materials and ethical production</p>
          </div>
          <div className="text-center p-6">
            <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4">
              <Award className="h-8 w-8 text-primary" />
            </div>
            <h3 className="font-semibold text-lg mb-2">Quality First</h3>
            <p className="text-sm text-muted-foreground">Premium materials and expert craftsmanship</p>
          </div>
          <div className="text-center p-6">
            <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4">
              <Heart className="h-8 w-8 text-primary" />
            </div>
            <h3 className="font-semibold text-lg mb-2">Customer Love</h3>
            <p className="text-sm text-muted-foreground">Designed with you in mind, always</p>
          </div>
          <div className="text-center p-6">
            <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4">
              <Truck className="h-8 w-8 text-primary" />
            </div>
            <h3 className="font-semibold text-lg mb-2">Fast Delivery</h3>
            <p className="text-sm text-muted-foreground">Ships within 24 hours across India</p>
          </div>
        </div>
      </div>

      {/* Team Section */}
      <div className="mb-20">
        <h2 className="font-serif text-3xl font-bold text-center text-foreground mb-4">
          Meet Our Founders
        </h2>
        <p className="text-center text-muted-foreground mb-12 max-w-2xl mx-auto">
          Passionate individuals dedicated to bringing you the best in fashion
        </p>
        <div className="grid md:grid-cols-3 gap-8">
          {[
            { name: "Priya Sharma", role: "Creative Director", bio: "10+ years in fashion design" },
            { name: "Rahul Mehta", role: "CEO & Founder", bio: "Former luxury retail executive" },
            { name: "Anjali Kapoor", role: "Head of Operations", bio: "Supply chain expert" },
          ].map((person, i) => (
            <div key={i} className="text-center">
              <div className="w-32 h-32 bg-primary/20 rounded-full mx-auto mb-4" />
              <h3 className="font-semibold text-lg">{person.name}</h3>
              <p className="text-primary text-sm mb-2">{person.role}</p>
              <p className="text-sm text-muted-foreground">{person.bio}</p>
            </div>
          ))}
        </div>
      </div>

      {/* CTA Section */}
      <div className="bg-primary/5 rounded-2xl p-12 text-center">
        <h2 className="font-serif text-3xl font-bold text-foreground mb-4">
          Ready to Upgrade Your Wardrobe?
        </h2>
        <p className="text-muted-foreground mb-8 max-w-2xl mx-auto">
          Explore our latest collections and find pieces that speak to your style.
        </p>
        <div className="flex gap-4 justify-center">
          <Button asChild size="lg" className="rounded-full px-8">
            <Link href="/category/new-arrivals">Shop New Arrivals</Link>
          </Button>
          <Button asChild size="lg" variant="outline" className="rounded-full px-8">
            <Link href="/contact">Contact Us</Link>
          </Button>
        </div>
      </div>
    </div>
  );
}
