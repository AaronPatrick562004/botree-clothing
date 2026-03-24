"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { toast } from "sonner";

export function NewsletterSection() {
  const [email, setEmail] = useState("");

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (email) {
      toast.success("Welcome to the Botree family! Check your inbox for a special offer.");
      setEmail("");
    }
  };

  return (
    <section className="mx-auto max-w-7xl px-4 py-20 lg:px-8">
      <div className="bg-primary rounded-2xl p-8 md:p-16 text-center">
        <p className="text-xs uppercase tracking-[0.3em] text-primary-foreground/70 mb-3 font-medium">
          Stay in the loop
        </p>
        <h2 className="font-serif text-3xl md:text-5xl font-bold text-primary-foreground mb-4 text-balance">
          Join the Botree Family
        </h2>
        <p className="text-primary-foreground/70 mb-8 max-w-md mx-auto leading-relaxed">
          Subscribe to get early access to new collections, exclusive offers, and styling
          inspiration.
        </p>
        <form
          onSubmit={handleSubmit}
          className="flex flex-col sm:flex-row gap-3 max-w-md mx-auto"
        >
          <Input
            type="email"
            placeholder="Enter your email"
            value={email}
            onChange={(e: React.ChangeEvent<HTMLInputElement>) => setEmail(e.target.value)}
            className="bg-primary-foreground/10 border-primary-foreground/20 text-primary-foreground placeholder:text-primary-foreground/40 rounded-full px-6"
            required
          />
          <Button
            type="submit"
            className="bg-primary-foreground text-foreground hover:bg-primary-foreground/90 rounded-full px-8 font-semibold whitespace-nowrap"
          >
            Subscribe
          </Button>
        </form>
      </div>
    </section>
  );
}