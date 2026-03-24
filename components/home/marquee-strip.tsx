"use client";

export function MarqueeStrip() {
  const items = [
    "FREE SHIPPING ON ORDERS ABOVE ₹2,000",
    "NEW ARRIVALS EVERY WEEK",
    "SUSTAINABLE FASHION",
    "100% QUALITY GUARANTEED",
    "EASY RETURNS WITHIN 30 DAYS",
    "HANDCRAFTED WITH LOVE",
  ];

  return (
    <div className="bg-primary text-primary-foreground py-3 overflow-hidden">
      <div className="animate-marquee flex whitespace-nowrap">
        {[...items, ...items].map((item, i) => (
          <span key={i} className="mx-8 text-xs uppercase tracking-[0.2em] font-medium">
            {item}
          </span>
        ))}
      </div>
      <style jsx>{`
        @keyframes marquee {
          0% {
            transform: translateX(0);
          }
          100% {
            transform: translateX(-50%);
          }
        }
        .animate-marquee {
          animation: marquee 30s linear infinite;
        }
      `}</style>
    </div>
  );
}