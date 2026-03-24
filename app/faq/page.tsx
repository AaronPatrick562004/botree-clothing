"use client";

import { useState } from "react";
import { ChevronDown, ChevronUp, Search } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

interface FAQItem {
  question: string;
  answer: string;
  category: string;
}

const faqData: FAQItem[] = [
  {
    category: "Orders",
    question: "How do I place an order?",
    answer: "Placing an order is easy! Simply browse our collections, select the items you like, choose your size and quantity, and click 'Add to Cart'. When you're ready to complete your purchase, go to your cart and follow the checkout process. You'll need to provide your shipping details and payment information."
  },
  {
    category: "Orders",
    question: "Can I modify or cancel my order after placing it?",
    answer: "Orders can be modified or canceled within 1 hour of placement. Please contact our customer support immediately at support@botree.com with your order number. After 1 hour, orders enter processing and cannot be changed."
  },
  {
    category: "Orders",
    question: "How will I know if my order is confirmed?",
    answer: "After successfully placing your order, you'll receive a confirmation email with your order number and details. You can also check your order status in your account under 'My Orders'."
  },
  {
    category: "Orders",
    question: "Do I need to create an account to place an order?",
    answer: "While you can checkout as a guest, creating an account offers benefits like faster checkout, order tracking, and saving your preferences. It's free and takes less than a minute!"
  },
  {
    category: "Payment",
    question: "What payment methods do you accept?",
    answer: "We accept all major credit/debit cards (Visa, MasterCard, American Express), UPI, Net Banking, PayPal, and Cash on Delivery (COD) for eligible orders."
  },
  {
    category: "Payment",
    question: "Is it safe to use my credit card on your website?",
    answer: "Absolutely! We use industry-standard SSL encryption to protect your payment information. We never store your full card details on our servers."
  },
  {
    category: "Payment",
    question: "When will my card be charged?",
    answer: "Your card will be charged immediately upon order confirmation. For Cash on Delivery orders, payment is collected when your order is delivered."
  },
  {
    category: "Shipping",
    question: "How long does shipping take?",
    answer: "Standard shipping takes 3-5 business days within India. Express shipping takes 1-2 business days. International shipping may take 7-14 business days depending on the destination."
  },
  {
    category: "Shipping",
    question: "Do you ship internationally?",
    answer: "Yes, we ship to select countries. Shipping costs and delivery times vary by location. You can check shipping options at checkout."
  },
  {
    category: "Shipping",
    question: "How can I track my order?",
    answer: "Once your order ships, you'll receive a tracking number via email. You can also track your order in your account dashboard under 'My Orders'."
  },
  {
    category: "Returns",
    question: "What is your return policy?",
    answer: "We offer 30-day returns on all unused items in original condition with tags attached. Some items like innerwear and accessories are non-returnable for hygiene reasons."
  },
  {
    category: "Returns",
    question: "How do I initiate a return?",
    answer: "Log into your account, go to 'My Orders', select the item you want to return, and click 'Return Item'. Follow the instructions to print your return label and pack the item securely."
  },
  {
    category: "Returns",
    question: "How long do refunds take?",
    answer: "Refunds are processed within 5-7 business days after we receive and inspect your return. The amount will be credited to your original payment method."
  },
  {
    category: "Products",
    question: "How do I find my correct size?",
    answer: "Check our detailed Size Guide page for measurements and fitting tips. Each product page also has size-specific measurements. When in doubt, order your usual size - we offer free exchanges!"
  },
  {
    category: "Products",
    question: "Are your clothes true to size?",
    answer: "Most of our clothes run true to size. However, we recommend checking the size chart and product measurements as some styles may have different fits (slim, regular, oversized)."
  },
  {
    category: "Products",
    question: "How should I care for my Botree clothing?",
    answer: "Care instructions are listed on each product page. Generally, we recommend machine wash cold, gentle cycle, and tumble dry low. Always check the care label inside the garment."
  },
  {
    category: "Account",
    question: "How do I reset my password?",
    answer: "Click on 'Login', then 'Forgot Password'. Enter your email address and we'll send you a link to reset your password."
  },
  {
    category: "Account",
    question: "How do I update my account information?",
    answer: "Log into your account and go to 'Account Settings'. You can update your personal information, shipping addresses, and payment methods there."
  }
];

const categories = ["All", "Orders", "Payment", "Shipping", "Returns", "Products", "Account"];

export default function FAQPage() {
  const [activeCategory, setActiveCategory] = useState("All");
  const [searchQuery, setSearchQuery] = useState("");
  const [openItems, setOpenItems] = useState<number[]>([]);

  const toggleItem = (index: number) => {
    setOpenItems(prev =>
      prev.includes(index)
        ? prev.filter(i => i !== index)
        : [...prev, index]
    );
  };

  const filteredFAQs = faqData.filter(item => {
    const matchesCategory = activeCategory === "All" || item.category === activeCategory;
    const matchesSearch = searchQuery === "" || 
      item.question.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.answer.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  return (
    <div className="mx-auto max-w-4xl px-4 py-12 lg:px-8">
      {/* Header */}
      <div className="text-center mb-12">
        <h1 className="font-serif text-4xl md:text-5xl font-bold text-foreground mb-4">
          Frequently Asked Questions
        </h1>
        <p className="text-lg text-muted-foreground">
          Find answers to common questions about ordering, shipping, returns, and more.
        </p>
      </div>

      {/* Search */}
      <div className="relative mb-8">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
        <Input
          type="text"
          placeholder="Search FAQs..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="pl-10 py-6 text-lg"
        />
      </div>

      {/* Category Filters */}
      <div className="flex flex-wrap gap-2 mb-8">
        {categories.map((category) => (
          <button
            key={category}
            onClick={() => setActiveCategory(category)}
            className={`px-4 py-2 rounded-full text-sm font-medium transition-colors ${
              activeCategory === category
                ? "bg-primary text-primary-foreground"
                : "bg-secondary hover:bg-secondary/80"
            }`}
          >
            {category}
          </button>
        ))}
      </div>

      {/* FAQ Items */}
      <div className="space-y-4">
        {filteredFAQs.length > 0 ? (
          filteredFAQs.map((item, index) => (
            <div
              key={index}
              className="border rounded-lg overflow-hidden bg-card"
            >
              <button
                onClick={() => toggleItem(index)}
                className="w-full flex items-center justify-between p-6 text-left hover:bg-secondary/50 transition-colors"
              >
                <div>
                  <span className="text-xs text-primary font-medium mb-1 block">
                    {item.category}
                  </span>
                  <h3 className="font-semibold text-lg">{item.question}</h3>
                </div>
                {openItems.includes(index) ? (
                  <ChevronUp className="h-5 w-5 text-muted-foreground shrink-0" />
                ) : (
                  <ChevronDown className="h-5 w-5 text-muted-foreground shrink-0" />
                )}
              </button>
              
              {openItems.includes(index) && (
                <div className="px-6 pb-6 pt-2 border-t">
                  <p className="text-muted-foreground leading-relaxed">
                    {item.answer}
                  </p>
                </div>
              )}
            </div>
          ))
        ) : (
          <div className="text-center py-12">
            <p className="text-muted-foreground">No FAQs match your search.</p>
            <Button
              variant="link"
              onClick={() => {
                setSearchQuery("");
                setActiveCategory("All");
              }}
              className="mt-2"
            >
              Clear filters
            </Button>
          </div>
        )}
      </div>

      {/* Still Have Questions */}
      <div className="mt-12 text-center p-8 bg-secondary/30 rounded-lg">
        <h2 className="font-serif text-2xl font-bold mb-4">Still Have Questions?</h2>
        <p className="text-muted-foreground mb-6">
          Can't find what you're looking for? Our support team is here to help.
        </p>
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Button asChild size="lg" className="rounded-full px-8">
            <a href="/contact">Contact Us</a>
          </Button>
          <Button asChild size="lg" variant="outline" className="rounded-full px-8">
            <a href="mailto:support@botree.com">Email Support</a>
          </Button>
        </div>
      </div>
    </div>
  );
}