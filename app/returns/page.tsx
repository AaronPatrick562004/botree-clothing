import { RefreshCw, Shield, Clock, CheckCircle, XCircle, AlertCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import Link from "next/link";

export default function ReturnsPage() {
  return (
    <div className="mx-auto max-w-4xl px-4 py-12 lg:px-8">
      {/* Header */}
      <div className="text-center mb-12">
        <h1 className="font-serif text-4xl md:text-5xl font-bold text-foreground mb-4">
          Returns & Exchanges
        </h1>
        <p className="text-lg text-muted-foreground">
          Easy returns within 30 days. We want you to love your purchase.
        </p>
      </div>

      {/* Return Policy Highlights */}
      <div className="grid md:grid-cols-3 gap-6 mb-12">
        <div className="bg-secondary/30 rounded-lg p-6 text-center">
          <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4">
            <Clock className="h-6 w-6 text-primary" />
          </div>
          <h3 className="font-semibold text-lg mb-2">30-Day Returns</h3>
          <p className="text-sm text-muted-foreground">
            Request a return within 30 days of delivery
          </p>
        </div>

        <div className="bg-secondary/30 rounded-lg p-6 text-center">
          <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4">
            <RefreshCw className="h-6 w-6 text-primary" />
          </div>
          <h3 className="font-semibold text-lg mb-2">Free Exchanges</h3>
          <p className="text-sm text-muted-foreground">
            Exchange for a different size at no cost
          </p>
        </div>

        <div className="bg-secondary/30 rounded-lg p-6 text-center">
          <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4">
            <Shield className="h-6 w-6 text-primary" />
          </div>
          <h3 className="font-semibold text-lg mb-2">Full Refund</h3>
          <p className="text-sm text-muted-foreground">
            Money back guaranteed on eligible items
          </p>
        </div>
      </div>

      {/* Return Policy Details */}
      <div className="space-y-8 mb-12">
        <div className="bg-secondary/30 rounded-lg p-6">
          <h2 className="font-serif text-2xl font-bold mb-4">How to Return an Item</h2>
          <ol className="space-y-4 list-decimal list-inside">
            <li className="text-muted-foreground">
              <span className="font-medium text-foreground">Log into your account</span> and go to "My Orders"
            </li>
            <li className="text-muted-foreground">
              <span className="font-medium text-foreground">Select the item</span> you wish to return and click "Return Item"
            </li>
            <li className="text-muted-foreground">
              <span className="font-medium text-foreground">Choose your reason</span> for return and select return method
            </li>
            <li className="text-muted-foreground">
              <span className="font-medium text-foreground">Print the return label</span> and pack your item securely
            </li>
            <li className="text-muted-foreground">
              <span className="font-medium text-foreground">Drop off the package</span> at any nearby courier location
            </li>
          </ol>
        </div>

        <div className="grid md:grid-cols-2 gap-6">
          <div className="bg-green-50 dark:bg-green-950/20 rounded-lg p-6">
            <h3 className="font-semibold text-lg mb-3 flex items-center gap-2">
              <CheckCircle className="h-5 w-5 text-green-600" />
              Eligible for Return
            </h3>
            <ul className="space-y-2 text-sm text-muted-foreground">
              <li>• Unworn clothing with tags attached</li>
              <li>• Items in original packaging</li>
              <li>• Returns within 30 days of delivery</li>
              <li>• Final sale items marked as returnable</li>
              <li>• Size exchanges (free shipping)</li>
            </ul>
          </div>

          <div className="bg-red-50 dark:bg-red-950/20 rounded-lg p-6">
            <h3 className="font-semibold text-lg mb-3 flex items-center gap-2">
              <XCircle className="h-5 w-5 text-red-600" />
              Not Eligible for Return
            </h3>
            <ul className="space-y-2 text-sm text-muted-foreground">
              <li>• Worn, washed, or altered items</li>
              <li>• Items without original tags</li>
              <li>• Intimate apparel and swimwear</li>
              <li>• Final sale or clearance items</li>
              <li>• Gift cards</li>
            </ul>
          </div>
        </div>

        <div className="bg-secondary/30 rounded-lg p-6">
          <h2 className="font-serif text-xl font-bold mb-4">Refund Processing</h2>
          <div className="space-y-3 text-sm text-muted-foreground">
            <p>• Refunds are processed within 5-7 business days after we receive your return.</p>
            <p>• The amount will be credited to your original payment method.</p>
            <p>• Original shipping charges are non-refundable unless the return is due to our error.</p>
            <p>• You'll receive email confirmation at each stage of the process.</p>
          </div>
        </div>

        <div className="bg-primary/5 rounded-lg p-6">
          <div className="flex items-start gap-3">
            <AlertCircle className="h-5 w-5 text-primary shrink-0 mt-0.5" />
            <div>
              <h3 className="font-medium mb-1">Damaged or Defective Items</h3>
              <p className="text-sm text-muted-foreground">
                If you receive a damaged or defective item, please contact us within 48 hours of delivery at returns@botree.com with your order number and photos. We'll arrange a replacement or full refund including shipping costs.
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* CTA */}
      <div className="text-center p-8 bg-secondary/30 rounded-lg">
        <h2 className="font-serif text-2xl font-bold mb-4">Ready to Start a Return?</h2>
        <p className="text-muted-foreground mb-6">
          Log into your account to initiate a return or exchange.
        </p>
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Button asChild size="lg" className="rounded-full px-8">
            <Link href="/account/orders">Start a Return</Link>
          </Button>
          <Button asChild size="lg" variant="outline" className="rounded-full px-8">
            <Link href="/contact">Return Questions</Link>
          </Button>
        </div>
      </div>
    </div>
  );
}