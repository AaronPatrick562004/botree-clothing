"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { 
  ArrowLeft, 
  Check, 
  CreditCard, 
  Wallet, 
  Landmark, 
  QrCode, 
  Copy, 
  Clock, 
  AlertCircle, 
  ChevronRight 
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useCart } from "@/lib/cart-context";
import { toast } from "sonner";
import Image from "next/image";

interface Address {
  id: string;
  name: string;
  phone: string;
  addressLine1: string;
  addressLine2: string;
  city: string;
  state: string;
  pincode: string;
  addressType: string;
}

export default function PaymentPage() {
  const [selectedMethod, setSelectedMethod] = useState<string>("");
  const [paymentStep, setPaymentStep] = useState<"method" | "details" | "processing" | "success">("method");
  const [shippingAddress, setShippingAddress] = useState<Address | null>(null);
  const [upiId, setUpiId] = useState("");
  const [cardDetails, setCardDetails] = useState({
    number: "",
    name: "",
    expiry: "",
    cvv: ""
  });
  const [timer, setTimer] = useState(300); // 5 minutes timer for UPI

  const router = useRouter();
  const { items, subtotal, totalSavings, clearCart } = useCart();

  const deliveryCharge = subtotal > 2000 ? 0 : 99;
  const total = subtotal + deliveryCharge;

  // Load shipping address
  useEffect(() => {
    const savedAddress = localStorage.getItem("selectedShippingAddress");
    if (savedAddress) {
      setShippingAddress(JSON.parse(savedAddress));
    } else {
      toast.error("Please select a shipping address first");
      router.push("/checkout/address");
    }
  }, [router]);

  // Timer for UPI
  useEffect(() => {
    let interval: NodeJS.Timeout;
    if (selectedMethod === "upi" && paymentStep === "details") {
      interval = setInterval(() => {
        setTimer((prev) => {
          if (prev <= 1) {
            clearInterval(interval);
            toast.error("QR code expired. Please refresh.");
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [selectedMethod, paymentStep]);

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  const handleMethodSelect = (method: string) => {
    setSelectedMethod(method);
    setPaymentStep("details");
  };

  const handleCopyUpiId = () => {
    navigator.clipboard.writeText("botree@okhdfcbank");
    toast.success("UPI ID copied to clipboard");
  };

  const handleSimulatePayment = () => {
    setPaymentStep("processing");
    
    // Simulate payment processing
    setTimeout(() => {
      setPaymentStep("success");
      
      // Clear cart after successful payment
      setTimeout(() => {
        clearCart();
        localStorage.removeItem("selectedShippingAddress");
      }, 1000);
    }, 2000);
  };

  const handleCardPayment = () => {
    // Basic validation
    if (!cardDetails.number || !cardDetails.name || !cardDetails.expiry || !cardDetails.cvv) {
      toast.error("Please fill in all card details");
      return;
    }
    if (cardDetails.number.replace(/\s/g, '').length !== 16) {
      toast.error("Please enter a valid 16-digit card number");
      return;
    }
    if (cardDetails.cvv.length !== 3) {
      toast.error("Please enter a valid 3-digit CVV");
      return;
    }
    handleSimulatePayment();
  };

  const handleUpiPayment = () => {
    if (!upiId) {
      toast.error("Please enter your UPI ID");
      return;
    }
    if (!upiId.includes("@")) {
      toast.error("Please enter a valid UPI ID");
      return;
    }
    handleSimulatePayment();
  };

  const formatCardNumber = (value: string) => {
    const v = value.replace(/\s+/g, '').replace(/[^0-9]/gi, '');
    const matches = v.match(/\d{4,16}/g);
    const match = (matches && matches[0]) || '';
    const parts = [];
    for (let i = 0; i < match.length; i += 4) {
      parts.push(match.substring(i, i + 4));
    }
    if (parts.length) {
      return parts.join(' ');
    } else {
      return value;
    }
  };

  const formatExpiry = (value: string) => {
    const v = value.replace(/\s+/g, '').replace(/[^0-9]/gi, '');
    if (v.length >= 2) {
      return v.substring(0, 2) + (v.length > 2 ? '/' + v.substring(2, 4) : '');
    }
    return v;
  };

  if (items.length === 0) {
    return (
      <div className="mx-auto max-w-7xl px-4 py-16 text-center">
        <h1 className="font-serif text-3xl font-bold mb-4">No items to checkout</h1>
        <Button asChild>
          <Link href="/cart">Back to Cart</Link>
        </Button>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-7xl px-4 py-8 lg:px-8">
      {/* Breadcrumb */}
      <div className="text-sm breadcrumbs mb-6">
        <ul className="flex items-center gap-2 text-muted-foreground">
          <li><Link href="/cart" className="hover:text-primary">Cart</Link></li>
          <li>/</li>
          <li><Link href="/checkout/address" className="hover:text-primary">Address</Link></li>
          <li>/</li>
          <li className="text-foreground font-medium">Payment</li>
        </ul>
      </div>

      <h1 className="font-serif text-3xl md:text-4xl font-bold mb-8">Payment</h1>

      {paymentStep === "success" ? (
        // Success State
        <div className="max-w-2xl mx-auto text-center py-12">
          <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
            <Check className="h-10 w-10 text-green-600" />
          </div>
          <h2 className="font-serif text-3xl font-bold mb-4">Payment Successful!</h2>
          <p className="text-muted-foreground mb-8">
            Thank you for your order. We'll send you a confirmation email shortly.
          </p>
          <div className="bg-secondary/30 p-6 rounded-lg mb-8 text-left">
            <h3 className="font-semibold mb-2">Order Summary</h3>
            <p className="text-sm text-muted-foreground mb-1">Order #: BOT{Date.now().toString().slice(-8)}</p>
            <p className="text-sm text-muted-foreground mb-1">Total Paid: ₹{total}</p>
            <p className="text-sm text-muted-foreground">Payment Method: {
              selectedMethod === "card" ? "Credit/Debit Card" :
              selectedMethod === "upi" ? "UPI" :
              selectedMethod === "netbanking" ? "Net Banking" :
              selectedMethod === "cod" ? "Cash on Delivery" : ""
            }</p>
          </div>
          <div className="flex gap-4 justify-center">
            <Button asChild>
              <Link href="/">Continue Shopping</Link>
            </Button>
            <Button asChild variant="outline">
              <Link href="/orders">View Orders</Link>
            </Button>
          </div>
        </div>
      ) : paymentStep === "processing" ? (
        // Processing State
        <div className="max-w-2xl mx-auto text-center py-12">
          <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-primary mx-auto mb-6"></div>
          <h2 className="font-serif text-2xl font-bold mb-4">Processing Payment</h2>
          <p className="text-muted-foreground">Please wait while we confirm your payment...</p>
        </div>
      ) : (
        <div className="grid lg:grid-cols-3 gap-8">
          {/* Left Column - Payment Methods */}
          <div className="lg:col-span-2 space-y-6">
            {/* Shipping Address Summary */}
            {shippingAddress && (
              <div className="border rounded-lg p-4 bg-secondary/20">
                <h3 className="font-semibold mb-2 flex items-center gap-2">
                  <span>Shipping To</span>
                  <Link href="/checkout/address" className="text-xs text-primary hover:underline ml-auto">
                    Change
                  </Link>
                </h3>
                <p className="font-medium">{shippingAddress.name}</p>
                <p className="text-sm text-muted-foreground">
                  {shippingAddress.addressLine1}
                  {shippingAddress.addressLine2 && `, ${shippingAddress.addressLine2}`}
                </p>
                <p className="text-sm text-muted-foreground">
                  {shippingAddress.city}, {shippingAddress.state} - {shippingAddress.pincode}
                </p>
                <p className="text-sm text-primary mt-1">{shippingAddress.phone}</p>
              </div>
            )}

            {/* Payment Method Selection */}
            {paymentStep === "method" && (
              <div className="border rounded-lg p-6">
                <h2 className="font-semibold text-lg mb-4">Select Payment Method</h2>
                <div className="space-y-3">
                  <button
                    onClick={() => handleMethodSelect("card")}
                    className="w-full p-4 border rounded-lg flex items-center gap-4 hover:border-primary transition-colors text-left"
                  >
                    <CreditCard className="h-6 w-6 text-muted-foreground" />
                    <div>
                      <p className="font-medium">Credit/Debit Card</p>
                      <p className="text-sm text-muted-foreground">Pay via Visa, Mastercard, RuPay</p>
                    </div>
                    <ChevronRight className="h-5 w-5 ml-auto text-muted-foreground" />
                  </button>

                  <button
                    onClick={() => handleMethodSelect("upi")}
                    className="w-full p-4 border rounded-lg flex items-center gap-4 hover:border-primary transition-colors text-left"
                  >
                    <Wallet className="h-6 w-6 text-muted-foreground" />
                    <div>
                      <p className="font-medium">UPI</p>
                      <p className="text-sm text-muted-foreground">Google Pay, PhonePe, Paytm, BHIM</p>
                    </div>
                    <ChevronRight className="h-5 w-5 ml-auto text-muted-foreground" />
                  </button>

                  <button
                    onClick={() => handleMethodSelect("netbanking")}
                    className="w-full p-4 border rounded-lg flex items-center gap-4 hover:border-primary transition-colors text-left"
                  >
                    <Landmark className="h-6 w-6 text-muted-foreground" />
                    <div>
                      <p className="font-medium">Net Banking</p>
                      <p className="text-sm text-muted-foreground">All major banks supported</p>
                    </div>
                    <ChevronRight className="h-5 w-5 ml-auto text-muted-foreground" />
                  </button>

                  <button
                    onClick={() => handleMethodSelect("cod")}
                    className="w-full p-4 border rounded-lg flex items-center gap-4 hover:border-primary transition-colors text-left"
                  >
                    <QrCode className="h-6 w-6 text-muted-foreground" />
                    <div>
                      <p className="font-medium">Cash on Delivery</p>
                      <p className="text-sm text-muted-foreground">Pay when you receive the order</p>
                    </div>
                    <ChevronRight className="h-5 w-5 ml-auto text-muted-foreground" />
                  </button>
                </div>
              </div>
            )}

            {/* Payment Details Forms */}
            {paymentStep === "details" && selectedMethod === "card" && (
              <div className="border rounded-lg p-6">
                <h2 className="font-semibold text-lg mb-4">Card Details</h2>
                <div className="space-y-4">
                  <div>
                    <label className="text-sm font-medium mb-1 block">Card Number</label>
                    <Input
                      placeholder="1234 5678 9012 3456"
                      value={cardDetails.number}
                      onChange={(e) => setCardDetails({
                        ...cardDetails,
                        number: formatCardNumber(e.target.value)
                      })}
                      maxLength={19}
                    />
                  </div>
                  <div>
                    <label className="text-sm font-medium mb-1 block">Cardholder Name</label>
                    <Input
                      placeholder="John Doe"
                      value={cardDetails.name}
                      onChange={(e) => setCardDetails({ ...cardDetails, name: e.target.value })}
                    />
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="text-sm font-medium mb-1 block">Expiry (MM/YY)</label>
                      <Input
                        placeholder="MM/YY"
                        value={cardDetails.expiry}
                        onChange={(e) => setCardDetails({
                          ...cardDetails,
                          expiry: formatExpiry(e.target.value)
                        })}
                        maxLength={5}
                      />
                    </div>
                    <div>
                      <label className="text-sm font-medium mb-1 block">CVV</label>
                      <Input
                        type="password"
                        placeholder="123"
                        maxLength={3}
                        value={cardDetails.cvv}
                        onChange={(e) => setCardDetails({
                          ...cardDetails,
                          cvv: e.target.value.replace(/\D/g, '')
                        })}
                      />
                    </div>
                  </div>
                  <Button onClick={handleCardPayment} className="w-full mt-4">
                    Pay ₹{total}
                  </Button>
                </div>
              </div>
            )}

            {paymentStep === "details" && selectedMethod === "upi" && (
              <div className="border rounded-lg p-6">
                <h2 className="font-semibold text-lg mb-4">UPI Payment</h2>
                
                {/* QR Code Section - Using your actual QR code image */}
                <div className="mb-6">
                  <div className="flex items-center justify-between mb-3">
                    <h3 className="font-medium">Scan QR Code</h3>
                    <div className="flex items-center gap-1 text-sm text-muted-foreground">
                      <Clock className="h-4 w-4" />
                      <span>Expires in {formatTime(timer)}</span>
                    </div>
                  </div>
                  
                  <div className="bg-white p-4 rounded-lg inline-block mx-auto">
                    {/* Your actual QR code image - make sure the file exists at this path */}
                    <Image
                      src="/images/payment-qr.jpeg"
                      alt="Payment QR Code"
                      width={192}
                      height={192}
                      className="w-48 h-48"
                      priority
                    />
                  </div>
                  
                  <p className="text-xs text-center text-muted-foreground mt-2">
                    Scan with any UPI app (Google Pay, PhonePe, Paytm)
                  </p>
                </div>

                <div className="relative my-6">
                  <div className="absolute inset-0 flex items-center">
                    <div className="w-full border-t"></div>
                  </div>
                  <div className="relative flex justify-center text-xs uppercase">
                    <span className="bg-background px-2 text-muted-foreground">OR</span>
                  </div>
                </div>

                {/* UPI ID Input */}
                <div className="mb-4">
                  <label className="text-sm font-medium mb-1 block">Enter UPI ID</label>
                  <div className="flex gap-2">
                    <Input
                      placeholder="username@okhdfcbank"
                      value={upiId}
                      onChange={(e) => setUpiId(e.target.value)}
                    />
                    <Button variant="outline" onClick={handleCopyUpiId} className="shrink-0">
                      <Copy className="h-4 w-4" />
                    </Button>
                  </div>
                  <p className="text-xs text-muted-foreground mt-1">
                    Or pay directly to: <span className="font-medium">botree@okhdfcbank</span>
                  </p>
                </div>

                <Button onClick={handleUpiPayment} className="w-full">
                  Pay ₹{total} via UPI
                </Button>
              </div>
            )}

            {paymentStep === "details" && selectedMethod === "netbanking" && (
              <div className="border rounded-lg p-6">
                <h2 className="font-semibold text-lg mb-4">Net Banking</h2>
                <div className="space-y-3">
                  <select className="w-full h-10 border rounded-md px-3 bg-background">
                    <option value="">Select your bank</option>
                    <option value="sbi">State Bank of India</option>
                    <option value="hdfc">HDFC Bank</option>
                    <option value="icici">ICICI Bank</option>
                    <option value="axis">Axis Bank</option>
                    <option value="kotak">Kotak Mahindra Bank</option>
                    <option value="yes">Yes Bank</option>
                  </select>
                  <Button onClick={handleSimulatePayment} className="w-full">
                    Pay ₹{total}
                  </Button>
                </div>
              </div>
            )}

            {paymentStep === "details" && selectedMethod === "cod" && (
              <div className="border rounded-lg p-6">
                <h2 className="font-semibold text-lg mb-4">Cash on Delivery</h2>
                <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4 mb-4">
                  <div className="flex gap-2">
                    <AlertCircle className="h-5 w-5 text-yellow-600 shrink-0" />
                    <p className="text-sm text-yellow-800">
                      Pay exactly ₹{total} in cash when your order is delivered. Please keep the exact amount ready.
                    </p>
                  </div>
                </div>
                <Button onClick={handleSimulatePayment} className="w-full">
                  Place Order (COD)
                </Button>
              </div>
            )}

            {/* Back Button */}
            {paymentStep !== "method" && (
              <Button
                variant="ghost"
                onClick={() => setPaymentStep("method")}
                className="gap-2"
              >
                <ArrowLeft className="h-4 w-4" />
                Back to Payment Methods
              </Button>
            )}
          </div>

          {/* Right Column - Order Summary */}
          <div className="lg:col-span-1">
            <div className="border rounded-lg p-6 sticky top-24">
              <h2 className="font-serif text-xl font-bold mb-4">Order Summary</h2>

              {/* Order Items */}
              <div className="space-y-3 mb-4 max-h-60 overflow-y-auto">
                {items.map((item) => (
                  <div key={`${item.id}-${item.size}`} className="flex gap-2 text-sm">
                    <div className="relative w-12 h-12 bg-secondary rounded shrink-0">
                      {item.image && (
                        <Image
                          src={item.image}
                          alt={item.name}
                          fill
                          className="object-cover rounded"
                        />
                      )}
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="font-medium truncate">{item.name}</p>
                      <p className="text-xs text-muted-foreground">
                        Size: {item.size} | Qty: {item.quantity}
                      </p>
                      <p className="text-xs font-medium">₹{item.price}</p>
                    </div>
                  </div>
                ))}
              </div>

              <div className="space-y-3 text-sm pt-4 border-t">
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Subtotal</span>
                  <span className="font-medium">₹{subtotal}</span>
                </div>

                {totalSavings > 0 && (
                  <div className="flex justify-between text-green-600">
                    <span>Savings</span>
                    <span className="font-medium">-₹{totalSavings}</span>
                  </div>
                )}

                <div className="flex justify-between">
                  <span className="text-muted-foreground">Delivery</span>
                  <span className="font-medium">
                    {deliveryCharge === 0 ? (
                      <span className="text-green-600">FREE</span>
                    ) : (
                      `₹${deliveryCharge}`
                    )}
                  </span>
                </div>

                <div className="border-t pt-3 mt-3">
                  <div className="flex justify-between text-base font-bold">
                    <span>Total</span>
                    <span>₹{total}</span>
                  </div>
                  <p className="text-xs text-muted-foreground mt-1">
                    Inclusive of all taxes
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}