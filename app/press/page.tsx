import Image from "next/image";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Calendar, Newspaper, FileText, Download, ExternalLink } from "lucide-react";

const pressReleases = [
  {
    title: "Botree Clothing Launches Sustainable Collection",
    date: "March 15, 2026",
    summary: "New eco-friendly line made from organic cotton and recycled materials sets a new standard for sustainable fashion.",
    link: "#"
  },
  {
    title: "Botree Named 'Best Emerging Brand' at Fashion Awards 2026",
    date: "February 28, 2026",
    summary: "Recognition for innovative designs and commitment to quality in the Indian fashion industry.",
    link: "#"
  },
  {
    title: "Expansion Announcement: New Store in Mumbai",
    date: "January 10, 2026",
    summary: "Botree Clothing opens its first flagship store in Mumbai, bringing premium fashion to fashion-forward customers.",
    link: "#"
  }
];

const mediaMentions = [
  {
    publication: "Vogue India",
    title: "5 Indian Brands Redefining Sustainable Fashion",
    date: "February 2026",
    image: "/images/press/vogue.jpg"
  },
  {
    publication: "GQ India",
    title: "The Best Men's Fashion Picks This Season",
    date: "January 2026",
    image: "/images/press/gq.jpg"
  },
  {
    publication: "Femina",
    title: "Style Guide: How to Wear Indian Wear",
    date: "December 2025",
    image: "/images/press/femina.jpg"
  },
  {
    publication: "Economic Times",
    title: "How Botree Clothing is Disrupting Fast Fashion",
    date: "November 2025",
    image: "/images/press/economic-times.jpg"
  }
];

const pressKits = [
  {
    name: "Brand Kit",
    description: "Logos, color palette, and brand guidelines",
    icon: FileText,
    size: "2.5 MB"
  },
  {
    name: "Media Kit",
    description: "High-resolution images and product shots",
    icon: Newspaper,
    size: "15 MB"
  }
];

export default function PressPage() {
  return (
    <div className="mx-auto max-w-7xl px-4 py-12 lg:px-8">
      {/* Header */}
      <div className="text-center mb-12">
        <h1 className="font-serif text-4xl md:text-5xl font-bold text-foreground mb-4">
          Press & Media
        </h1>
        <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
          Latest news, press releases, and media resources from Botree Clothing.
        </p>
      </div>

      {/* Press Releases */}
      <div className="mb-16">
        <h2 className="font-serif text-2xl font-bold mb-8">Press Releases</h2>
        <div className="space-y-4">
          {pressReleases.map((release, index) => (
            <div key={index} className="bg-secondary/30 rounded-lg p-6">
              <div className="flex items-start justify-between gap-4 mb-2">
                <h3 className="text-lg font-semibold">{release.title}</h3>
                <div className="flex items-center gap-1 text-sm text-muted-foreground">
                  <Calendar className="h-4 w-4" />
                  <span>{release.date}</span>
                </div>
              </div>
              <p className="text-muted-foreground mb-4">{release.summary}</p>
              <Link href={release.link} className="text-sm text-primary hover:underline inline-flex items-center gap-1">
                Read Full Release <ExternalLink className="h-3 w-3" />
              </Link>
            </div>
          ))}
        </div>
      </div>

      {/* Media Mentions */}
      <div className="mb-16">
        <h2 className="font-serif text-2xl font-bold mb-8">Media Mentions</h2>
        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {mediaMentions.map((mention, index) => (
            <div key={index} className="bg-secondary/30 rounded-lg p-4">
              <div className="h-16 bg-secondary rounded mb-3 flex items-center justify-center">
                <span className="text-xs text-muted-foreground">{mention.publication}</span>
              </div>
              <h3 className="font-medium text-sm mb-2 line-clamp-2">{mention.title}</h3>
              <p className="text-xs text-muted-foreground mb-3">{mention.date}</p>
              <Link href="#" className="text-xs text-primary hover:underline">
                Read Article
              </Link>
            </div>
          ))}
        </div>
      </div>

      {/* Press Kit */}
      <div className="mb-16">
        <h2 className="font-serif text-2xl font-bold mb-8">Press Kit</h2>
        <div className="grid md:grid-cols-2 gap-6">
          {pressKits.map((kit, index) => (
            <div key={index} className="bg-secondary/30 rounded-lg p-6 flex items-start gap-4">
              <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center shrink-0">
                <kit.icon className="h-6 w-6 text-primary" />
              </div>
              <div className="flex-1">
                <h3 className="font-semibold mb-1">{kit.name}</h3>
                <p className="text-sm text-muted-foreground mb-2">{kit.description}</p>
                <div className="flex items-center gap-2">
                  <Button size="sm" variant="outline" className="gap-1">
                    <Download className="h-3 w-3" />
                    Download ({kit.size})
                  </Button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Contact */}
      <div className="bg-primary/5 rounded-2xl p-8 text-center">
        <h2 className="font-serif text-2xl font-bold text-foreground mb-4">
          Media Inquiries
        </h2>
        <p className="text-muted-foreground mb-6 max-w-2xl mx-auto">
          For press-related questions, interview requests, or additional information, please contact our media relations team.
        </p>
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Button asChild size="lg" className="rounded-full px-8">
            <Link href="/contact">Contact Press Team</Link>
          </Button>
          <Button asChild size="lg" variant="outline" className="rounded-full px-8">
            <a href="mailto:press@botree.com">press@botree.com</a>
          </Button>
        </div>
      </div>
    </div>
  );
}