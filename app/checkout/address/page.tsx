"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { ArrowLeft, Check, Plus, Trash2, Mail, MapPin, Home, Briefcase, CreditCard, Truck, ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useCart } from "@/lib/cart-context";
import { toast } from "sonner";
import emailjs from '@emailjs/browser';

// Initialize EmailJS with the correct format from your script.js
emailjs.init({
    publicKey: 'DxD6T3QY1SG1zV2yV'
});

interface Address {
  id: string;
  name: string;
  phone: string;
  addressLine1: string;
  addressLine2: string;
  city: string;
  state: string;
  pincode: string;
  addressType: "Home" | "Work" | "Other";
}

// City database by state
const cityDatabase: Record<string, string[]> = {
  'Maharashtra': ['Mumbai', 'Pune', 'Nagpur', 'Nashik', 'Aurangabad', 'Solapur'],
  'Delhi': ['New Delhi', 'Delhi', 'North Delhi', 'South Delhi'],
  'Karnataka': ['Bengaluru', 'Mysore', 'Hubli', 'Mangalore'],
  'Tamil Nadu': ['Chennai', 'Coimbatore', 'Madurai', 'Salem'],
  'West Bengal': ['Kolkata', 'Howrah', 'Durgapur', 'Siliguri'],
  'Telangana': ['Hyderabad', 'Warangal', 'Nizamabad', 'Karimnagar'],
  'Gujarat': ['Ahmedabad', 'Surat', 'Vadodara', 'Rajkot'],
  'Rajasthan': ['Jaipur', 'Jodhpur', 'Kota', 'Bikaner'],
  'Uttar Pradesh': ['Lucknow', 'Kanpur', 'Agra', 'Varanasi'],
  'Madhya Pradesh': ['Indore', 'Bhopal', 'Jabalpur', 'Gwalior'],
  'Bihar': ['Patna', 'Gaya', 'Bhagalpur', 'Muzaffarpur'],
  'Punjab': ['Ludhiana', 'Amritsar', 'Jalandhar', 'Patiala'],
  'Haryana': ['Faridabad', 'Gurugram', 'Panipat', 'Ambala'],
  'Kerala': ['Thiruvananthapuram', 'Kochi', 'Kozhikode', 'Thrissur'],
  'Odisha': ['Bhubaneswar', 'Cuttack', 'Rourkela', 'Berhampur'],
  'Assam': ['Guwahati', 'Silchar', 'Dibrugarh', 'Jorhat'],
  'Jharkhand': ['Ranchi', 'Jamshedpur', 'Dhanbad', 'Bokaro'],
  'Chhattisgarh': ['Raipur', 'Bhilai', 'Bilaspur', 'Korba'],
  'Uttarakhand': ['Dehradun', 'Haridwar', 'Roorkee', 'Haldwani'],
  'Himachal Pradesh': ['Shimla', 'Dharamshala', 'Mandi', 'Solan'],
  'Goa': ['Panaji', 'Margao', 'Vasco da Gama', 'Mapusa']
};

const states = Object.keys(cityDatabase).sort();

export default function CheckoutAddressPage() {
  const [addresses, setAddresses] = useState<Address[]>([]);
  const [selectedAddressId, setSelectedAddressId] = useState<string>("");
  const [showAddressForm, setShowAddressForm] = useState(false);
  const [citySuggestions, setCitySuggestions] = useState<string[]>([]);
  const [showCitySuggestions, setShowCitySuggestions] = useState(false);
  const [email, setEmail] = useState("");
  const [otpSent, setOtpSent] = useState(false);
  const [otp, setOtp] = useState(["", "", "", "", "", ""]);
  const [isEmailVerified, setIsEmailVerified] = useState(false);
  const [generatedOTP, setGeneratedOTP] = useState("");
  const [isSendingOtp, setIsSendingOtp] = useState(false);
  const [isVerifyingOtp, setIsVerifyingOtp] = useState(false);
  
  // EmailJS Configuration - using same values as your script.js
  const EMAILJS_SERVICE_ID = "service_bvjo74q";
  const EMAILJS_TEMPLATE_ID = "template_ldvv9bo"; // This matches your script.js

  // Form state
  const [formData, setFormData] = useState({
    name: "",
    phone: "",
    addressLine1: "",
    addressLine2: "",
    city: "",
    state: "",
    pincode: "",
    addressType: "Home" as "Home" | "Work" | "Other"
  });

  // Validation errors
  const [errors, setErrors] = useState<Record<string, string>>({});

  const router = useRouter();
  const { items, subtotal, totalSavings } = useCart();

  // Redirect if cart is empty
  useEffect(() => {
    if (items.length === 0) {
      router.push("/cart");
    }
  }, [items, router]);

  // Load saved addresses from localStorage
  useEffect(() => {
    const savedAddresses = localStorage.getItem("checkout-addresses");
    if (savedAddresses) {
      setAddresses(JSON.parse(savedAddresses));
    }
  }, []);

  // Save addresses to localStorage
  useEffect(() => {
    localStorage.setItem("checkout-addresses", JSON.stringify(addresses));
  }, [addresses]);

  // Update city suggestions when state changes
  useEffect(() => {
    if (formData.state && cityDatabase[formData.state]) {
      const filtered = cityDatabase[formData.state].filter(city =>
        city.toLowerCase().includes(formData.city.toLowerCase())
      );
      setCitySuggestions(filtered);
    } else {
      setCitySuggestions([]);
    }
  }, [formData.state, formData.city]);

  const deliveryCharge = subtotal > 2000 ? 0 : 99;
  const total = subtotal + deliveryCharge;

  const validateField = (field: string, value: string): string => {
    switch (field) {
      case "name":
        return value.trim() ? "" : "Full name is required";
      case "phone":
        return /^[0-9]{10}$/.test(value) ? "" : "Valid 10-digit phone number is required";
      case "addressLine1":
        return value.trim() ? "" : "Address is required";
      case "city":
        return value.trim() ? "" : "City is required";
      case "state":
        return value ? "" : "State is required";
      case "pincode":
        return /^[0-9]{6}$/.test(value) ? "" : "Valid 6-digit pincode is required";
      default:
        return "";
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    
    if (errors[name]) {
      setErrors(prev => {
        const newErrors = { ...prev };
        delete newErrors[name];
        return newErrors;
      });
    }
  };

  const handleCitySelect = (city: string) => {
    setFormData(prev => ({ ...prev, city }));
    setShowCitySuggestions(false);
    setErrors(prev => {
      const newErrors = { ...prev };
      delete newErrors.city;
      return newErrors;
    });
  };

  const validateForm = (): boolean => {
    const newErrors: Record<string, string> = {};
    
    Object.keys(formData).forEach(key => {
      const error = validateField(key, formData[key as keyof typeof formData] as string);
      if (error) newErrors[key] = error;
    });

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleAddAddress = () => {
    if (!validateForm()) {
      toast.error("Please fill in all required fields correctly");
      return;
    }

    const newAddress: Address = {
      id: Date.now().toString(),
      ...formData,
      phone: formData.phone.replace(/^0+/, ""),
    };

    setAddresses(prev => [...prev, newAddress]);
    setSelectedAddressId(newAddress.id);
    setShowAddressForm(false);
    
    setFormData({
      name: "",
      phone: "",
      addressLine1: "",
      addressLine2: "",
      city: "",
      state: "",
      pincode: "",
      addressType: "Home"
    });
    
    toast.success("Address saved successfully!");
  };

  const handleDeleteAddress = (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    
    if (confirm("Are you sure you want to delete this address?")) {
      setAddresses(prev => prev.filter(addr => addr.id !== id));
      if (selectedAddressId === id) {
        setSelectedAddressId("");
        setIsEmailVerified(false);
        setOtpSent(false);
      }
      toast.success("Address deleted");
    }
  };

  const handleSelectAddress = (id: string) => {
    setSelectedAddressId(id);
    setIsEmailVerified(false);
    setOtpSent(false);
    setEmail("");
    setOtp(["", "", "", "", "", ""]);
  };

  const handleSendOtp = async () => {
    if (!email || !email.includes("@") || !email.includes(".")) {
      toast.error("Please enter a valid email address");
      return;
    }

    setIsSendingOtp(true);

    // Generate 6-digit OTP
    const otpCode = Math.floor(100000 + Math.random() * 900000).toString();
    setGeneratedOTP(otpCode);
    
    console.log("Sending OTP to:", email);
    console.log("OTP Code:", otpCode);

    try {
      // Match the exact format from your working script.js
      const response = await emailjs.send(
        EMAILJS_SERVICE_ID,
        EMAILJS_TEMPLATE_ID,
        {
          email: email,        // Using 'email' as parameter name (matches your template)
          otp: otpCode          // Using 'otp' as parameter name (matches your template)
        }
      );
      
      console.log("✅ EmailJS Success:", response);
      setOtpSent(true);
      toast.success(`OTP sent to ${email}`);
    } catch (error: any) {
      console.error("❌ EmailJS Error:", {
        message: error?.message || "Unknown error",
        status: error?.status,
        text: error?.text
      });
      
      // Show user-friendly error
      if (error?.status === 401) {
        toast.error("Email service authentication failed");
      } else if (error?.status === 404) {
        toast.error("Email template not found");
      } else {
        toast.error("Failed to send OTP. Please try again.");
      }
    } finally {
      setIsSendingOtp(false);
    }
  };

  const handleOtpChange = (index: number, value: string) => {
    if (value && !/^\d+$/.test(value)) return;
    
    const newOtp = [...otp];
    newOtp[index] = value;
    setOtp(newOtp);

    if (value && index < 5) {
      const nextInput = document.getElementById(`otp-${index + 1}`);
      nextInput?.focus();
    }
  };

  const handleOtpKeyDown = (index: number, e: React.KeyboardEvent) => {
    if (e.key === "Backspace" && !otp[index] && index > 0) {
      const prevInput = document.getElementById(`otp-${index - 1}`);
      prevInput?.focus();
    }
  };

  const handleVerifyOtp = () => {
    const enteredOtp = otp.join("");
    
    if (enteredOtp.length !== 6) {
      toast.error("Please enter complete 6-digit OTP");
      return;
    }

    setIsVerifyingOtp(true);

    if (enteredOtp === generatedOTP) {
      setIsEmailVerified(true);
      toast.success("Email verified successfully!");
    } else {
      toast.error("Invalid OTP. Please try again.");
      setOtp(["", "", "", "", "", ""]);
      document.getElementById("otp-0")?.focus();
    }

    setIsVerifyingOtp(false);
  };

  const handleProceedToPayment = () => {
    if (!selectedAddressId) {
      toast.error("Please select a shipping address");
      return;
    }

    if (!isEmailVerified) {
      toast.error("Please verify your email with OTP");
      return;
    }

    const selectedAddress = addresses.find(addr => addr.id === selectedAddressId);
    localStorage.setItem("selectedShippingAddress", JSON.stringify(selectedAddress));
    router.push("/checkout/payment");
  };

  const getAddressTypeIcon = (type: string) => {
    switch (type) {
      case "Home":
        return <Home className="h-4 w-4" />;
      case "Work":
        return <Briefcase className="h-4 w-4" />;
      default:
        return <MapPin className="h-4 w-4" />;
    }
  };

  if (items.length === 0) {
    return null;
  }

  return (
    <div className="mx-auto max-w-7xl px-4 py-8 lg:px-8">
      {/* Breadcrumb */}
      <div className="text-sm breadcrumbs mb-6">
        <ul className="flex items-center gap-2 text-muted-foreground">
          <li><Link href="/cart" className="hover:text-primary">Cart</Link></li>
          <li>/</li>
          <li className="text-foreground font-medium">Shipping Address</li>
        </ul>
      </div>

      <h1 className="font-serif text-3xl md:text-4xl font-bold mb-8">Shipping Address</h1>

      <div className="grid lg:grid-cols-3 gap-8">
        {/* Left Column - Address Form */}
        <div className="lg:col-span-2 space-y-6">
          {/* Saved Addresses */}
          <div className="border rounded-lg p-6">
            <div className="flex items-center justify-between mb-4">
              <h2 className="font-semibold text-lg">Saved Addresses</h2>
              <span className="text-sm text-muted-foreground bg-secondary px-2 py-1 rounded-full">
                {addresses.length}
              </span>
            </div>

            {addresses.length === 0 ? (
              <div className="text-center py-8 border border-dashed rounded-lg">
                <MapPin className="h-8 w-8 mx-auto mb-2 text-muted-foreground" />
                <p className="text-muted-foreground text-sm">No saved addresses yet. Add one below.</p>
              </div>
            ) : (
              <div className="space-y-3">
                {addresses.map((address) => (
                  <div
                    key={address.id}
                    onClick={() => handleSelectAddress(address.id)}
                    className={`relative p-4 rounded-lg border-2 cursor-pointer transition-all ${
                      selectedAddressId === address.id
                        ? "border-primary bg-primary/5"
                        : "border-border hover:border-muted-foreground/50"
                    }`}
                  >
                    <div className="flex items-start justify-between mb-2">
                      <div className="flex items-center gap-2">
                        <span className="inline-flex items-center gap-1 px-2 py-1 bg-secondary rounded text-xs font-medium">
                          {getAddressTypeIcon(address.addressType)}
                          {address.addressType}
                        </span>
                      </div>
                      {selectedAddressId === address.id && (
                        <Check className="h-5 w-5 text-primary" />
                      )}
                    </div>

                    <p className="font-medium mb-1">{address.name}</p>
                    <p className="text-sm text-muted-foreground mb-1">
                      {address.addressLine1}
                      {address.addressLine2 && `, ${address.addressLine2}`}
                    </p>
                    <p className="text-sm text-muted-foreground mb-2">
                      {address.city}, {address.state} - {address.pincode}
                    </p>
                    <p className="text-sm text-primary font-medium">{address.phone}</p>

                    <button
                      onClick={(e) => handleDeleteAddress(address.id, e)}
                      className="absolute bottom-4 right-4 text-muted-foreground hover:text-destructive transition-colors"
                      aria-label="Delete address"
                    >
                      <Trash2 className="h-4 w-4" />
                    </button>
                  </div>
                ))}
              </div>
            )}

            {/* Add New Address Button */}
            {!showAddressForm && (
              <button
                onClick={() => setShowAddressForm(true)}
                className="w-full mt-4 py-3 border-2 border-dashed border-border rounded-lg text-primary font-medium hover:bg-secondary transition-colors flex items-center justify-center gap-2"
              >
                <Plus className="h-5 w-5" />
                ADD NEW ADDRESS
              </button>
            )}
          </div>

          {/* Address Form */}
          {showAddressForm && (
            <div className="border rounded-lg p-6">
              <h3 className="font-semibold text-lg mb-4">Add New Address</h3>

              <div className="space-y-4">
                {/* Full Name */}
                <div>
                  <label className="text-sm font-medium mb-1 block">
                    Full Name <span className="text-destructive">*</span>
                  </label>
                  <Input
                    name="name"
                    value={formData.name}
                    onChange={handleInputChange}
                    placeholder="Enter your full name"
                    className={errors.name ? "border-destructive" : ""}
                  />
                  {errors.name && (
                    <p className="text-destructive text-xs mt-1">{errors.name}</p>
                  )}
                </div>

                {/* Phone Number */}
                <div>
                  <label className="text-sm font-medium mb-1 block">
                    Phone Number <span className="text-destructive">*</span>
                  </label>
                  <Input
                    name="phone"
                    value={formData.phone}
                    onChange={handleInputChange}
                    placeholder="10-digit mobile number"
                    maxLength={10}
                    className={errors.phone ? "border-destructive" : ""}
                  />
                  {errors.phone && (
                    <p className="text-destructive text-xs mt-1">{errors.phone}</p>
                  )}
                </div>

                {/* Address Line 1 */}
                <div>
                  <label className="text-sm font-medium mb-1 block">
                    Address Line 1 <span className="text-destructive">*</span>
                  </label>
                  <Input
                    name="addressLine1"
                    value={formData.addressLine1}
                    onChange={handleInputChange}
                    placeholder="House/Flat No., Building Name"
                    className={errors.addressLine1 ? "border-destructive" : ""}
                  />
                  {errors.addressLine1 && (
                    <p className="text-destructive text-xs mt-1">{errors.addressLine1}</p>
                  )}
                </div>

                {/* Address Line 2 (Optional) */}
                <div>
                  <label className="text-sm font-medium mb-1 block">
                    Address Line 2 (Optional)
                  </label>
                  <Input
                    name="addressLine2"
                    value={formData.addressLine2}
                    onChange={handleInputChange}
                    placeholder="Area, Colony, Street"
                  />
                </div>

                {/* City and State */}
                <div className="grid grid-cols-2 gap-4">
                  <div className="relative">
                    <label className="text-sm font-medium mb-1 block">
                      City <span className="text-destructive">*</span>
                    </label>
                    <Input
                      name="city"
                      value={formData.city}
                      onChange={handleInputChange}
                      onFocus={() => setShowCitySuggestions(true)}
                      placeholder="Enter city"
                      className={errors.city ? "border-destructive" : ""}
                    />
                    {showCitySuggestions && citySuggestions.length > 0 && (
                      <div className="absolute z-10 top-full left-0 right-0 mt-1 bg-background border rounded-lg shadow-lg max-h-48 overflow-y-auto">
                        {citySuggestions.map((city) => (
                          <button
                            key={city}
                            onClick={() => handleCitySelect(city)}
                            className="w-full text-left px-4 py-2 hover:bg-secondary transition-colors text-sm"
                          >
                            {city}
                          </button>
                        ))}
                      </div>
                    )}
                    {errors.city && (
                      <p className="text-destructive text-xs mt-1">{errors.city}</p>
                    )}
                  </div>

                  <div>
                    <label className="text-sm font-medium mb-1 block">
                      State <span className="text-destructive">*</span>
                    </label>
                    <select
                      name="state"
                      value={formData.state}
                      onChange={handleInputChange}
                      className={`w-full h-10 border rounded-md px-3 bg-background ${
                        errors.state ? "border-destructive" : "border-input"
                      }`}
                    >
                      <option value="">Select State</option>
                      {states.map((state) => (
                        <option key={state} value={state}>{state}</option>
                      ))}
                    </select>
                    {errors.state && (
                      <p className="text-destructive text-xs mt-1">{errors.state}</p>
                    )}
                  </div>
                </div>

                {/* Pincode and Address Type */}
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="text-sm font-medium mb-1 block">
                      Pincode <span className="text-destructive">*</span>
                    </label>
                    <Input
                      name="pincode"
                      value={formData.pincode}
                      onChange={handleInputChange}
                      placeholder="6-digit pincode"
                      maxLength={6}
                      className={errors.pincode ? "border-destructive" : ""}
                    />
                    {errors.pincode && (
                      <p className="text-destructive text-xs mt-1">{errors.pincode}</p>
                    )}
                  </div>

                  <div>
                    <label className="text-sm font-medium mb-1 block">
                      Address Type <span className="text-destructive">*</span>
                    </label>
                    <select
                      name="addressType"
                      value={formData.addressType}
                      onChange={handleInputChange}
                      className="w-full h-10 border border-input rounded-md px-3 bg-background"
                    >
                      <option value="Home">Home</option>
                      <option value="Work">Work</option>
                      <option value="Other">Other</option>
                    </select>
                  </div>
                </div>

                {/* Form Actions */}
                <div className="flex gap-3 pt-4">
                  <Button
                    onClick={handleAddAddress}
                    className="flex-1"
                  >
                    <Plus className="h-4 w-4 mr-2" />
                    Save Address
                  </Button>
                  <Button
                    onClick={() => setShowAddressForm(false)}
                    variant="outline"
                    className="flex-1"
                  >
                    Cancel
                  </Button>
                </div>
              </div>
            </div>
          )}

          {/* Selected Address Info & OTP Section */}
          {selectedAddressId && (
            <div className="border rounded-lg p-6">
              <div className="mb-4">
                <h3 className="font-semibold mb-2 flex items-center gap-2">
                  <Truck className="h-5 w-5" />
                  Selected Shipping Address
                </h3>
                {(() => {
                  const address = addresses.find(a => a.id === selectedAddressId);
                  if (!address) return null;
                  return (
                    <div className="bg-secondary/30 p-4 rounded-lg">
                      <p className="font-medium">{address.name}</p>
                      <p className="text-sm text-muted-foreground">
                        {address.addressLine1}{address.addressLine2 && `, ${address.addressLine2}`}
                      </p>
                      <p className="text-sm text-muted-foreground">
                        {address.city}, {address.state} - {address.pincode}
                      </p>
                      <p className="text-sm text-primary mt-2">{address.phone}</p>
                    </div>
                  );
                })()}
              </div>

              {/* Email Verification */}
              <div>
                <h3 className="font-semibold mb-2 flex items-center gap-2">
                  <Mail className="h-5 w-5" />
                  Email Verification
                </h3>

                {!otpSent ? (
                  <>
                    <p className="text-sm text-muted-foreground mb-3">
                      Enter your email to receive OTP
                    </p>
                    <Input
                      type="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder="your@email.com"
                      className="mb-3"
                      disabled={isSendingOtp}
                    />
                    <Button
                      onClick={handleSendOtp}
                      className="w-full"
                      disabled={isSendingOtp}
                    >
                      {isSendingOtp ? "Sending..." : "Send OTP"}
                    </Button>
                  </>
                ) : !isEmailVerified ? (
                  <>
                    <p className="text-sm text-muted-foreground mb-3">
                      Enter the 6-digit OTP sent to {email}
                    </p>
                    <div className="flex gap-2 justify-center mb-3">
                      {otp.map((digit, index) => (
                        <input
                          key={index}
                          id={`otp-${index}`}
                          type="text"
                          maxLength={1}
                          value={digit}
                          onChange={(e) => handleOtpChange(index, e.target.value)}
                          onKeyDown={(e) => handleOtpKeyDown(index, e)}
                          className="w-10 h-12 text-center border rounded-md text-lg font-semibold focus:border-primary focus:outline-none"
                          disabled={isEmailVerified || isVerifyingOtp}
                        />
                      ))}
                    </div>
                    <Button
                      onClick={handleVerifyOtp}
                      className="w-full"
                      disabled={isVerifyingOtp}
                    >
                      {isVerifyingOtp ? "Verifying..." : "Verify OTP"}
                    </Button>
                  </>
                ) : (
                  <div className="text-center py-2 bg-green-50 rounded-lg">
                    <Check className="h-6 w-6 text-green-600 mx-auto mb-1" />
                    <p className="text-green-600 font-medium">Email Verified</p>
                  </div>
                )}
              </div>
            </div>
          )}
        </div>

        {/* Right Column - Order Summary */}
        <div className="lg:col-span-1">
          <div className="border rounded-lg p-6 sticky top-24">
            <h2 className="font-serif text-xl font-bold mb-4">Order Summary</h2>

            <div className="space-y-3 text-sm">
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

              {deliveryCharge > 0 && (
                <p className="text-xs text-muted-foreground">
                  Add ₹{2000 - subtotal} more for free delivery
                </p>
              )}

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

            <Button
              onClick={handleProceedToPayment}
              disabled={!selectedAddressId || !isEmailVerified}
              className="w-full mt-6 gap-2"
              size="lg"
            >
              Proceed to Payment
              <ArrowRight className="h-4 w-4" />
            </Button>

            <div className="mt-4 text-center text-xs text-muted-foreground">
              <p>We accept:</p>
              <div className="flex justify-center gap-2 mt-2">
                <span className="px-2 py-1 bg-secondary rounded">Visa</span>
                <span className="px-2 py-1 bg-secondary rounded">Mastercard</span>
                <span className="px-2 py-1 bg-secondary rounded">UPI</span>
                <span className="px-2 py-1 bg-secondary rounded">COD</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}