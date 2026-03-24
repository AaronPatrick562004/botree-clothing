"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { ArrowLeft, Check, Plus, Trash2, Mail, MapPin, Home, Briefcase, CreditCard } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useCart } from "@/lib/cart-context";
import { toast } from "sonner";

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
  isDefault?: boolean;
}

// City database by state
const cityDatabase: Record<string, string[]> = {
  'Maharashtra': ['Mumbai', 'Pune', 'Nagpur', 'Nashik', 'Aurangabad', 'Solapur', 'Amravati', 'Kolhapur'],
  'Delhi': ['New Delhi', 'Delhi', 'North Delhi', 'South Delhi', 'East Delhi', 'West Delhi'],
  'Karnataka': ['Bengaluru', 'Mysore', 'Hubli', 'Mangalore', 'Belgaum', 'Gulbarga'],
  'Tamil Nadu': ['Chennai', 'Coimbatore', 'Madurai', 'Tiruchirappalli', 'Salem', 'Tirunelveli'],
  'West Bengal': ['Kolkata', 'Howrah', 'Durgapur', 'Asansol', 'Siliguri', 'Darjeeling'],
  'Telangana': ['Hyderabad', 'Warangal', 'Nizamabad', 'Karimnagar', 'Khammam'],
  'Gujarat': ['Ahmedabad', 'Surat', 'Vadodara', 'Rajkot', 'Bhavnagar', 'Jamnagar'],
  'Rajasthan': ['Jaipur', 'Jodhpur', 'Kota', 'Bikaner', 'Ajmer', 'Udaipur'],
  'Uttar Pradesh': ['Lucknow', 'Kanpur', 'Agra', 'Varanasi', 'Meerut', 'Allahabad'],
  'Madhya Pradesh': ['Indore', 'Bhopal', 'Jabalpur', 'Gwalior', 'Ujjain', 'Sagar'],
  'Bihar': ['Patna', 'Gaya', 'Bhagalpur', 'Muzaffarpur', 'Darbhanga', 'Arrah'],
  'Punjab': ['Ludhiana', 'Amritsar', 'Jalandhar', 'Patiala', 'Bathinda', 'Mohali'],
  'Haryana': ['Faridabad', 'Gurugram', 'Panipat', 'Ambala', 'Yamunanagar', 'Rohtak'],
  'Kerala': ['Thiruvananthapuram', 'Kochi', 'Kozhikode', 'Thrissur', 'Kollam', 'Palakkad'],
  'Odisha': ['Bhubaneswar', 'Cuttack', 'Rourkela', 'Berhampur', 'Sambalpur', 'Puri'],
  'Assam': ['Guwahati', 'Silchar', 'Dibrugarh', 'Jorhat', 'Nagaon', 'Tinsukia'],
  'Jharkhand': ['Ranchi', 'Jamshedpur', 'Dhanbad', 'Bokaro', 'Hazaribagh', 'Deoghar'],
  'Chhattisgarh': ['Raipur', 'Bhilai', 'Bilaspur', 'Korba', 'Durg', 'Rajnandgaon'],
  'Uttarakhand': ['Dehradun', 'Haridwar', 'Roorkee', 'Haldwani', 'Rudrapur', 'Kashipur'],
  'Himachal Pradesh': ['Shimla', 'Dharamshala', 'Mandi', 'Solan', 'Kullu', 'Palampur'],
  'Goa': ['Panaji', 'Margao', 'Vasco da Gama', 'Mapusa', 'Ponda']
};

const states = Object.keys(cityDatabase).sort();

export default function CheckoutAddressPage() {
  const [addresses, setAddresses] = useState<Address[]>([]);
  const [selectedAddressId, setSelectedAddressId] = useState<string>("");
  const [showAddressForm, setShowAddressForm] = useState(false);
  const [citySuggestions, setCitySuggestions] = useState<string[]>([]);
  const [showCitySuggestions, setShowCitySuggestions] = useState(false);
  
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
  const { items } = useCart();

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
    
    // Clear error for this field
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
      phone: formData.phone.replace(/^0+/, ""), // Remove leading zeros
    };

    setAddresses(prev => [...prev, newAddress]);
    setSelectedAddressId(newAddress.id);
    setShowAddressForm(false);
    
    // Reset form
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
      }
      toast.success("Address deleted");
    }
  };

  const handleSelectAddress = (id: string) => {
    setSelectedAddressId(id);
  };

  const handleProceedToPayment = () => {
    if (!selectedAddressId) {
      toast.error("Please select a shipping address");
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

  const isPuneAddress = (address: Address) => {
    return address.city.toLowerCase().includes("pune");
  };

  if (items.length === 0) {
    router.push("/cart");
    return null;
  }

  return (
    <div className="min-h-screen bg-black text-white">
      {/* Top Bar */}
      <div className="border-b border-gray-800 bg-black sticky top-0 z-10">
        <div className="mx-auto max-w-7xl px-4 py-3 flex items-center justify-between">
          <Link href="/cart" className="text-[#d4af37] hover:text-white transition-colors flex items-center gap-2 text-sm font-semibold">
            <ArrowLeft className="h-4 w-4" />
            Back to Cart
          </Link>
          <Link href="/">
            <span className="font-serif text-xl font-bold text-white">BOTREE</span>
          </Link>
          <Link href="/login" className="text-[#d4af37] hover:text-white transition-colors text-sm font-semibold">
            Account
          </Link>
        </div>
      </div>

      {/* Header */}
      <div className="border-b border-gray-800 py-8">
        <div className="mx-auto max-w-4xl px-4">
          <h1 className="text-3xl md:text-4xl font-serif font-bold mb-2">
            SHIPPING <span className="text-[#d4af37]">ADDRESS</span>
          </h1>
          <p className="text-gray-500 text-sm">Select a saved address or add a new one</p>
        </div>
      </div>

      {/* Progress Steps */}
      <div className="mx-auto max-w-4xl px-4 py-6">
        <div className="flex justify-center gap-4 md:gap-8">
          <div className="flex flex-col items-center">
            <div className="w-10 h-10 rounded-full bg-green-600 border-2 border-green-600 flex items-center justify-center font-bold text-black mb-2">
              <Check className="h-5 w-5" />
            </div>
            <span className="text-xs text-gray-500 uppercase tracking-wider">CART</span>
          </div>
          <div className="flex flex-col items-center">
            <div className="w-10 h-10 rounded-full bg-[#d4af37] border-2 border-[#d4af37] flex items-center justify-center font-bold text-black mb-2">
              2
            </div>
            <span className="text-xs text-gray-500 uppercase tracking-wider">ADDRESS</span>
          </div>
          <div className="flex flex-col items-center">
            <div className="w-10 h-10 rounded-full bg-gray-900 border-2 border-gray-700 flex items-center justify-center font-bold text-gray-500 mb-2">
              3
            </div>
            <span className="text-xs text-gray-500 uppercase tracking-wider">PAYMENT</span>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="mx-auto max-w-4xl px-4 pb-16">
        <div className="bg-[#0d0d0d] border border-gray-800 rounded-2xl p-6 md:p-8">
          
          {/* Saved Addresses */}
          <div className="mb-8">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-sm font-bold text-[#d4af37] uppercase tracking-wider">SAVED ADDRESSES</h2>
              <span className="text-xs text-gray-500 bg-gray-900 px-2 py-1 rounded-full">
                {addresses.length}
              </span>
            </div>

            {addresses.length === 0 ? (
              <div className="text-center py-8 border border-dashed border-gray-800 rounded-lg bg-gray-900/50">
                <MapPin className="h-8 w-8 mx-auto mb-2 text-gray-600" />
                <p className="text-gray-500 text-sm">No saved addresses yet. Add one below.</p>
              </div>
            ) : (
              <div className="space-y-3">
                {addresses.map((address) => (
                  <div
                    key={address.id}
                    onClick={() => handleSelectAddress(address.id)}
                    className={`relative p-4 rounded-lg border-2 cursor-pointer transition-all ${
                      selectedAddressId === address.id
                        ? "border-[#d4af37] bg-[#1a1a1a]"
                        : "border-gray-800 bg-gray-900/50 hover:border-gray-600"
                    }`}
                  >
                    <div className="flex items-start justify-between mb-2">
                      <div className="flex items-center gap-2">
                        <span className="inline-flex items-center gap-1 px-2 py-1 bg-gray-800 rounded text-xs font-semibold text-gray-300">
                          {getAddressTypeIcon(address.addressType)}
                          {address.addressType}
                        </span>
                        <span className={`px-2 py-1 rounded text-xs font-semibold ${
                          isPuneAddress(address)
                            ? "bg-green-600 text-black"
                            : "bg-blue-600 text-white"
                        }`}>
                          {isPuneAddress(address) ? "📍 Pune Radius" : "📍 Outside Pune"}
                        </span>
                      </div>
                      {selectedAddressId === address.id && (
                        <Check className="h-5 w-5 text-[#d4af37]" />
                      )}
                    </div>

                    <p className="font-semibold mb-1">{address.name}</p>
                    <p className="text-sm text-gray-400 mb-1">
                      {address.addressLine1}
                      {address.addressLine2 && `, ${address.addressLine2}`}
                    </p>
                    <p className="text-sm text-gray-400 mb-2">
                      {address.city}, {address.state} - {address.pincode}
                    </p>
                    <p className="text-sm text-[#d4af37] font-semibold">{address.phone}</p>

                    <button
                      onClick={(e) => handleDeleteAddress(address.id, e)}
                      className="absolute bottom-4 right-4 w-8 h-8 bg-red-600/10 hover:bg-red-600 rounded-full flex items-center justify-center text-red-500 hover:text-white transition-all"
                      aria-label="Delete address"
                    >
                      <Trash2 className="h-4 w-4" />
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Add New Address Button */}
          {!showAddressForm && (
            <button
              onClick={() => setShowAddressForm(true)}
              className="w-full py-3 border-2 border-dashed border-[#d4af37] rounded-lg text-[#d4af37] font-semibold hover:bg-[#d4af37] hover:text-black transition-colors flex items-center justify-center gap-2 mb-6"
            >
              <Plus className="h-5 w-5" />
              ADD NEW ADDRESS
            </button>
          )}

          {/* Address Form */}
          {showAddressForm && (
            <div className="bg-gray-900/50 border border-gray-800 rounded-lg p-6 mb-6">
              <h3 className="text-lg font-bold text-[#d4af37] mb-6 border-b border-[#d4af37] pb-2">
                SHIPPING DETAILS
              </h3>

              <div className="space-y-4">
                {/* Full Name */}
                <div>
                  <label className="block text-xs font-semibold text-[#d4af37] uppercase mb-2">
                    FULL NAME <span className="text-red-500">*</span>
                  </label>
                  <Input
                    name="name"
                    value={formData.name}
                    onChange={handleInputChange}
                    placeholder="Enter your full name"
                    className={`bg-gray-800 border-gray-700 text-white placeholder:text-gray-500 ${
                      errors.name ? "border-red-500" : ""
                    }`}
                  />
                  {errors.name && (
                    <p className="text-red-500 text-xs mt-1">{errors.name}</p>
                  )}
                </div>

                {/* Phone Number */}
                <div>
                  <label className="block text-xs font-semibold text-[#d4af37] uppercase mb-2">
                    PHONE NUMBER <span className="text-red-500">*</span>
                  </label>
                  <Input
                    name="phone"
                    value={formData.phone}
                    onChange={handleInputChange}
                    placeholder="10-digit mobile number"
                    maxLength={10}
                    className={`bg-gray-800 border-gray-700 text-white placeholder:text-gray-500 ${
                      errors.phone ? "border-red-500" : ""
                    }`}
                  />
                  {errors.phone && (
                    <p className="text-red-500 text-xs mt-1">{errors.phone}</p>
                  )}
                </div>

                {/* Address Line 1 */}
                <div>
                  <label className="block text-xs font-semibold text-[#d4af37] uppercase mb-2">
                    ADDRESS LINE 1 <span className="text-red-500">*</span>
                  </label>
                  <Input
                    name="addressLine1"
                    value={formData.addressLine1}
                    onChange={handleInputChange}
                    placeholder="House/Flat No., Building Name"
                    className={`bg-gray-800 border-gray-700 text-white placeholder:text-gray-500 ${
                      errors.addressLine1 ? "border-red-500" : ""
                    }`}
                  />
                  {errors.addressLine1 && (
                    <p className="text-red-500 text-xs mt-1">{errors.addressLine1}</p>
                  )}
                </div>

                {/* Address Line 2 (Optional) */}
                <div>
                  <label className="block text-xs font-semibold text-[#d4af37] uppercase mb-2">
                    ADDRESS LINE 2 (OPTIONAL)
                  </label>
                  <Input
                    name="addressLine2"
                    value={formData.addressLine2}
                    onChange={handleInputChange}
                    placeholder="Area, Colony, Street"
                    className="bg-gray-800 border-gray-700 text-white placeholder:text-gray-500"
                  />
                </div>

                {/* City and State */}
                <div className="grid grid-cols-2 gap-4">
                  <div className="relative">
                    <label className="block text-xs font-semibold text-[#d4af37] uppercase mb-2">
                      CITY <span className="text-red-500">*</span>
                    </label>
                    <Input
                      name="city"
                      value={formData.city}
                      onChange={handleInputChange}
                      onFocus={() => setShowCitySuggestions(true)}
                      placeholder="Enter city"
                      className={`bg-gray-800 border-gray-700 text-white placeholder:text-gray-500 ${
                        errors.city ? "border-red-500" : ""
                      }`}
                    />
                    {showCitySuggestions && citySuggestions.length > 0 && (
                      <div className="absolute z-10 top-full left-0 right-0 mt-1 bg-gray-800 border border-[#d4af37] rounded-lg max-h-48 overflow-y-auto">
                        {citySuggestions.map((city) => (
                          <button
                            key={city}
                            onClick={() => handleCitySelect(city)}
                            className="w-full text-left px-4 py-2 hover:bg-[#d4af37] hover:text-black transition-colors text-sm"
                          >
                            {city}
                          </button>
                        ))}
                      </div>
                    )}
                    {errors.city && (
                      <p className="text-red-500 text-xs mt-1">{errors.city}</p>
                    )}
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-[#d4af37] uppercase mb-2">
                      STATE <span className="text-red-500">*</span>
                    </label>
                    <select
                      name="state"
                      value={formData.state}
                      onChange={handleInputChange}
                      className={`w-full h-10 bg-gray-800 border border-gray-700 rounded-md px-3 text-white focus:outline-none focus:border-[#d4af37] ${
                        errors.state ? "border-red-500" : ""
                      }`}
                    >
                      <option value="">Select State</option>
                      {states.map((state) => (
                        <option key={state} value={state}>{state}</option>
                      ))}
                    </select>
                    {errors.state && (
                      <p className="text-red-500 text-xs mt-1">{errors.state}</p>
                    )}
                  </div>
                </div>

                {/* Pincode and Address Type */}
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-semibold text-[#d4af37] uppercase mb-2">
                      PINCODE <span className="text-red-500">*</span>
                    </label>
                    <Input
                      name="pincode"
                      value={formData.pincode}
                      onChange={handleInputChange}
                      placeholder="6-digit pincode"
                      maxLength={6}
                      className={`bg-gray-800 border-gray-700 text-white placeholder:text-gray-500 ${
                        errors.pincode ? "border-red-500" : ""
                      }`}
                    />
                    {errors.pincode && (
                      <p className="text-red-500 text-xs mt-1">{errors.pincode}</p>
                    )}
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-[#d4af37] uppercase mb-2">
                      ADDRESS TYPE <span className="text-red-500">*</span>
                    </label>
                    <select
                      name="addressType"
                      value={formData.addressType}
                      onChange={handleInputChange}
                      className="w-full h-10 bg-gray-800 border border-gray-700 rounded-md px-3 text-white focus:outline-none focus:border-[#d4af37]"
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
                    className="flex-1 bg-[#d4af37] text-black hover:bg-[#c9a22f] font-semibold"
                  >
                    <Plus className="h-4 w-4 mr-2" />
                    SAVE THIS ADDRESS
                  </Button>
                  <Button
                    onClick={() => setShowAddressForm(false)}
                    variant="outline"
                    className="flex-1 border-gray-700 text-gray-300 hover:bg-gray-800"
                  >
                    Cancel
                  </Button>
                </div>
              </div>
            </div>
          )}

          {/* Selected Address Info & OTP Section */}
          {selectedAddressId && (
            <div className="mb-6">
              <div className="bg-[#1a1a1a] border border-[#d4af37] rounded-lg p-4">
                <h4 className="text-[#d4af37] font-semibold flex items-center gap-2 mb-3">
                  <MapPin className="h-4 w-4" />
                  SELECTED ADDRESS
                </h4>
                {(() => {
                  const address = addresses.find(a => a.id === selectedAddressId);
                  if (!address) return null;
                  return (
                    <div className="text-sm">
                      <p className="font-semibold">{address.name} ({address.addressType})</p>
                      <p className="text-gray-400">{address.addressLine1}{address.addressLine2 && `, ${address.addressLine2}`}</p>
                      <p className="text-gray-400">{address.city}, {address.state} - {address.pincode}</p>
                      <p className="text-[#d4af37] mt-2">📞 {address.phone}</p>
                    </div>
                  );
                })()}
              </div>

              {/* Email Verification Section */}
              <div className="mt-4 p-4 bg-[#1a1a1a] border border-gray-800 rounded-lg">
                <div className="flex items-center gap-2 text-[#d4af37] mb-3">
                  <Mail className="h-4 w-4" />
                  <span className="text-sm font-semibold">Email Verification</span>
                </div>
                <p className="text-xs text-gray-400 mb-3">
                  Enter your email to receive OTP and verify your order
                </p>
                <Input
                  type="email"
                  placeholder="your@email.com"
                  className="bg-gray-800 border-gray-700 text-white placeholder:text-gray-500 mb-3"
                />
                <Button className="w-full bg-[#d4af37] text-black hover:bg-[#c9a22f]">
                  SEND OTP
                </Button>
              </div>
            </div>
          )}

          {/* Confirm Order Button */}
          <Button
            onClick={handleProceedToPayment}
            disabled={!selectedAddressId}
            className="w-full bg-[#d4af37] text-black hover:bg-[#c9a22f] font-bold py-6 text-lg disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <CreditCard className="h-5 w-5 mr-2" />
            PROCEED TO PAYMENT
          </Button>

          {/* Back to Cart Link */}
          <Link
            href="/cart"
            className="block text-center text-gray-500 hover:text-[#d4af37] text-sm mt-4 transition-colors"
          >
            ← Back to Cart
          </Link>
        </div>
      </div>
    </div>
  );
}