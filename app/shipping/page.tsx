import { Truck, Package, Clock, MapPin, CheckCircle, AlertCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import Link from "next/link";

export default function ShippingPage() {
  return (
    <div className="mx-auto max-w-4xl px-4 py-12 lg:px-8">
      {/* Header */}
      <div className="text-center mb-12">
        <h1 className="font-serif text-4xl md:text-5xl font-bold text-foreground mb-4">
          Shipping Information
        </h1>
        <p className="text-lg text-muted-foreground">
          Fast, reliable delivery to your doorstep. Learn about our shipping options and policies.
        </p>
      </div>

      {/* Shipping Options */}
      <div className="grid md:grid-cols-3 gap-6 mb-12">
        <div className="bg-secondary/30 rounded-lg p-6 text-center">
          <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4">
            <Truck className="h-6 w-6 text-primary" />
          </div>
          <h3 className="font-semibold text-lg mb-2">Standard Shipping</h3>
          <p className="text-2xl font-bold text-primary mb-2">₹99</p>
          <p className="text-sm text-muted-foreground">FREE on orders above ₹2,000</p>
          <p className="text-xs text-muted-foreground mt-2">Delivery in 3-5 business days</p>
        </div>

        <div className="bg-secondary/30 rounded-lg p-6 text-center border-2 border-primary">
          <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4">
            <Clock className="h-6 w-6 text-primary" />
          </div>
          <h3 className="font-semibold text-lg mb-2">Express Shipping</h3>
          <p className="text-2xl font-bold text-primary mb-2">₹299</p>
          <p className="text-sm text-muted-foreground">Priority processing</p>
          <p className="text-xs text-muted-foreground mt-2">Delivery in 1-2 business days</p>
        </div>

        <div className="bg-secondary/30 rounded-lg p-6 text-center">
          <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4">
            <Package className="h-6 w-6 text-primary" />
          </div>
          <h3 className="font-semibold text-lg mb-2">International</h3>
          <p className="text-2xl font-bold text-primary mb-2">Varies</p>
          <p className="text-sm text-muted-foreground">Calculated at checkout</p>
          <p className="text-xs text-muted-foreground mt-2">Delivery in 7-14 business days</p>
        </div>
      </div>

      {/* Shipping Details */}
      <div className="space-y-8 mb-12">
        <div className="bg-secondary/30 rounded-lg p-6">
          <h2 className="font-serif text-2xl font-bold mb-4">Domestic Shipping (India)</h2>
          <div className="space-y-4">
            <div className="flex items-start gap-3">
              <CheckCircle className="h-5 w-5 text-green-500 shrink-0 mt-0.5" />
              <div>
                <p className="font-medium">Free Shipping</p>
                <p className="text-sm text-muted-foreground">
                  All orders above ₹2,000 qualify for free standard shipping within India.
                </p>
              </div>
            </div>
            <div className="flex items-start gap-3">
              <CheckCircle className="h-5 w-5 text-green-500 shrink-0 mt-0.5" />
              <div>
                <p className="font-medium">Processing Time</p>
                <p className="text-sm text-muted-foreground">
                  Orders are processed within 24 hours of placement (Monday-Friday).
                </p>
              </div>
            </div>
            <div className="flex items-start gap-3">
              <CheckCircle className="h-5 w-5 text-green-500 shrink-0 mt-0.5" />
              <div>
                <p className="font-medium">Tracking</p>
                <p className="text-sm text-muted-foreground">
                  All orders include tracking information sent via email and SMS.
                </p>
              </div>
            </div>
          </div>
        </div>

        <div className="bg-secondary/30 rounded-lg p-6">
          <h2 className="font-serif text-2xl font-bold mb-4">International Shipping</h2>
          <div className="space-y-4">
            <div className="flex items-start gap-3">
              <MapPin className="h-5 w-5 text-primary shrink-0 mt-0.5" />
              <div>
                <p className="font-medium">Countries We Ship To</p>
                <p className="text-sm text-muted-foreground">
                  USA, Canada, UK, Australia, UAE, Singapore, and select EU countries.
                </p>
              </div>
            </div>
            <div className="flex items-start gap-3">
              <AlertCircle className="h-5 w-5 text-yellow-500 shrink-0 mt-0.5" />
              <div>
                <p className="font-medium">Customs & Duties</p>
                <p className="text-sm text-muted-foreground">
                  International orders may be subject to customs fees, taxes, and duties upon arrival. These are the responsibility of the customer.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Shipping Policy */}
      <div className="bg-primary/5 rounded-lg p-6 mb-12">
        <h2 className="font-serif text-xl font-bold mb-4">Shipping Policy</h2>
        <div className="space-y-3 text-sm text-muted-foreground">
          <p>• Orders placed before 2 PM IST on business days are processed the same day.</p>
          <p>• We ship via trusted carriers including Delhivery, Blue Dart, and India Post.</p>
          <p>• Delivery times are estimates and may vary due to factors beyond our control.</p>
          <p>• You'll receive a shipping confirmation with tracking once your order ships.</p>
          <p>• For address changes, contact us within 1 hour of placing your order.</p>
          <p>• Undeliverable packages due to incorrect addresses will be subject to additional shipping charges.</p>
        </div>
      </div>

      {/* Track Order CTA */}
      <div className="text-center p-8 bg-secondary/30 rounded-lg">
        <h2 className="font-serif text-2xl font-bold mb-4">Track Your Order</h2>
        <p className="text-muted-foreground mb-6">
          Already have an order? Check its status anytime.
        </p>
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Button asChild size="lg" className="rounded-full px-8">
            <Link href="/account/orders">Track My Order</Link>
          </Button>
          <Button asChild size="lg" variant="outline" className="rounded-full px-8">
            <Link href="/contact">Shipping Questions</Link>
          </Button>
        </div>
      </div>
    </div>
  );
}