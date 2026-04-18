"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { ArrowLeft, Check, Plus, Trash2, Mail, MapPin, Home, Briefcase, CreditCard } from "lucide-react";
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
}

const cityDatabase: Record<string, string[]> = {
  'Maharashtra': ['Mumbai', 'Pune', 'Nagpur', 'Nashik', 'Aurangabad'],
  'Delhi': ['New Delhi', 'Delhi', 'North Delhi', 'South Delhi'],
  'Karnataka': ['Bengaluru', 'Mysore', 'Hubli', 'Mangalore'],
  'Tamil Nadu': ['Chennai', 'Coimbatore', 'Madurai', 'Salem'],
  'Gujarat': ['Ahmedabad', 'Surat', 'Vadodara', 'Rajkot'],
};

const states = Object.keys(cityDatabase).sort();

export default function CheckoutAddressPage() {
  const [addresses, setAddresses] = useState<Address[]>([]);
  const [selectedAddressId, setSelectedAddressId] = useState<string>("");
  const [showAddressForm, setShowAddressForm] = useState(false);
  const [citySuggestions, setCitySuggestions] = useState<string[]>([]);
  const [showCitySuggestions, setShowCitySuggestions] = useState(false);
  const [isClient, setIsClient] = useState(false);

  const [formData, setFormData] = useState({
    name: "", phone: "", addressLine1: "", addressLine2: "",
    city: "", state: "", pincode: "", addressType: "Home" as const
  });

  const [errors, setErrors] = useState<Record<string, string>>({});
  const router = useRouter();
  const { items } = useCart();

  useEffect(() => {
    setIsClient(true);
    const saved = localStorage.getItem("checkout-addresses");
    if (saved) {
      try { setAddresses(JSON.parse(saved)); } catch { setAddresses([]); }
    }
  }, []);

  useEffect(() => {
    if (isClient) localStorage.setItem("checkout-addresses", JSON.stringify(addresses));
  }, [addresses, isClient]);

  useEffect(() => {
    if (formData.state && cityDatabase[formData.state]) {
      setCitySuggestions(
        cityDatabase[formData.state].filter(c =>
          c.toLowerCase().includes(formData.city.toLowerCase())
        )
      );
    } else {
      setCitySuggestions([]);
    }
  }, [formData.state, formData.city]);

  const validateField = (field: string, value: string): string => {
    switch (field) {
      case "name": return value.trim()? "" : "Full name is required";
      case "phone": return /^[0-9]{10}$/.test(value)? "" : "Valid 10-digit phone number is required";
      case "addressLine1": return value.trim()? "" : "Address is required";
      case "city": return value.trim()? "" : "City is required";
      case "state": return value? "" : "State is required";
      case "pincode": return /^[0-9]{6}$/.test(value)? "" : "Valid 6-digit pincode is required";
      default: return "";
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({...prev, [name]: value }));
    if (errors[name]) setErrors(prev => ({...prev, [name]: "" }));
  };

  const handleCitySelect = (city: string) => {
    setFormData(prev => ({...prev, city }));
    setShowCitySuggestions(false);
    setErrors(prev => ({...prev, city: "" }));
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
    if (!validateForm()) return toast.error("Please fill in all required fields correctly");

    const newAddress: Address = {
      id: Date.now().toString(),
    ...formData,
      phone: formData.phone.replace(/^0+/, ""),
    };

    setAddresses(prev => [...prev, newAddress]);
    setSelectedAddressId(newAddress.id);
    setShowAddressForm(false);
    setFormData({ name: "", phone: "", addressLine1: "", addressLine2: "", city: "", state: "", pincode: "", addressType: "Home" });
    toast.success("Address saved successfully!");
  };

  const handleDeleteAddress = (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    if (confirm("Are you sure you want to delete this address?")) {
      setAddresses(prev => prev.filter(addr => addr.id!== id));
      if (selectedAddressId === id) setSelectedAddressId("");
      toast.success("Address deleted");
    }
  };

  const handleProceedToPayment = () => {
    if (!selectedAddressId) return toast.error("Please select a shipping address");
    const selectedAddress = addresses.find(addr => addr.id === selectedAddressId);
    if (isClient) localStorage.setItem("selectedShippingAddress", JSON.stringify(selectedAddress));
    router.push("/checkout/payment");
  };

  if (!isClient) return <div className="min-h-screen bg-black" />;
  if (items.length === 0) {
    router.push("/cart");
    return null;
  }

  return (
    <div className="min-h-screen bg-black text-white">
      <div className="border-b border-gray-800 bg-black sticky top-0 z-10">
        <div className="mx-auto max-w-7xl px-3 sm:px-4 py-3 flex items-center justify-between">
          <Link href="/cart" className="text-[#d4af37] hover:text-white transition-colors flex items-center gap-2 text-sm font-semibold min-h-">
            <ArrowLeft className="h-4 w-4" />
            <span className="hidden xs:inline">Back to Cart</span>
          </Link>
          <Link href="/"><span className="font-serif text-lg sm:text-xl font-bold text-white">BOTREE</span></Link>
          <Link href="/login" className="text-[#d4af37] hover:text-white transition-colors text-sm font-semibold min-h- flex items-center">
            Account
          </Link>
        </div>
      </div>

      <div className="border-b border-gray-800 py-6 sm:py-8">
        <div className="mx-auto max-w-4xl px-3 sm:px-4">
          <h1 className="text-2xl sm:text-3xl md:text-4xl font-serif font-bold mb-2">
            SHIPPING <span className="text-[#d4af37]">ADDRESS</span>
          </h1>
          <p className="text-gray-500 text-sm">Select a saved address or add a new one</p>
        </div>
      </div>

      <div className="mx-auto max-w-4xl px-3 sm:px-4 py-5 sm:py-6">
        <div className="flex justify-center gap-4 md:gap-8">
          {[
            { step: 1, label: "CART", done: true },
            { step: 2, label: "ADDRESS", active: true },
            { step: 3, label: "PAYMENT", done: false }
          ].map(({ step, label, done, active }) => (
            <div key={step} className="flex flex-col items-center">
              <div className={`w-9 h-9 sm:w-10 sm:h-10 rounded-full border-2 flex items-center justify-center font-bold mb-2 ${
                done? "bg-green-600 border-green-600 text-black"
                : active? "bg-[#d4af37] border-[#d4af37] text-black"
                : "bg-gray-900 border-gray-700 text-gray-500"
              }`}>
                {done? <Check className="h-4 w-4 sm:h-5 sm:w-5" /> : step}
              </div>
              <span className="text- sm:text-xs text-gray-500 uppercase tracking-wider">{label}</span>
            </div>
          ))}
        </div>
      </div>

      <div className="mx-auto max-w-4xl px-3 sm:px-4 pb-12 sm:pb-16">
        <div className="bg-[#0d0d] border border-gray-800 rounded-xl sm:rounded-2xl p-4 sm:p-6 md:p-8">
          <div className="mb-6 sm:mb-8">
            <div className="flex items-center justify-between mb-3 sm:mb-4">
              <h2 className="text-xs sm:text-sm font-bold text-[#d4af37] uppercase tracking-wider">SAVED ADDRESSES</h2>
              <span className="text-xs text-gray-500 bg-gray-900 px-2 py-1 rounded-full">{addresses.length}</span>
            </div>

            {addresses.length === 0? (
              <div className="text-center py-6 sm:py-8 border-dashed border-gray-800 rounded-lg bg-gray-900/50">
                <MapPin className="h-7 w-7 sm:h-8 sm:w-8 mx-auto mb-2 text-gray-600" />
                <p className="text-gray-500 text-sm">No saved addresses yet. Add one below.</p>
              </div>
            ) : (
              <div className="space-y-3">
                {addresses.map((address) => (
                  <div
                    key={address.id}
                    onClick={() => setSelectedAddressId(address.id)}
                    className={`relative p-3 sm:p-4 rounded-lg border-2 cursor-pointer transition-all ${
                      selectedAddressId === address.id
                      ? "border-[#d4af37] bg-[#1a1a1a]"
                        : "border-gray-800 bg-gray-900/50 hover:border-gray-600"
                    }`}
                  >
                    <div className="flex items-start justify-between mb-2 gap-2">
                      <div className="flex items-center gap-2 flex-wrap">
                        <span className="inline-flex items-center gap-1 px-2 py-1 bg-gray-800 rounded text-xs font-semibold text-gray-300">
                          {address.addressType === "Home"? <Home className="h-3 w-3" /> : address.addressType === "Work"? <Briefcase className="h-3 w-3" /> : <MapPin className="h-3 w-3" />}
                          {address.addressType}
                        </span>
                        <span className={`px-2 py-1 rounded text-xs font-semibold ${
                          address.city.toLowerCase().includes("pune")
                          ? "bg-green-600 text-black" : "bg-blue-600 text-white"
                        }`}>
                          {address.city.toLowerCase().includes("pune")? "📍 Pune Radius" : "📍 Outside Pune"}
                        </span>
                      </div>
                      {selectedAddressId === address.id && <Check className="h-5 w-5 text-[#d4af37] shrink-0" />}
                    </div>
                    <p className="font-semibold mb-1 text-sm sm:text-base">{address.name}</p>
                    <p className="text-xs sm:text-sm text-gray-400 mb-1">{address.addressLine1}{address.addressLine2 && `, ${address.addressLine2}`}</p>
                    <p className="text-xs sm:text-sm text-gray-400 mb-2">{address.city}, {address.state} - {address.pincode}</p>
                    <p className="text-xs sm:text-sm text-[#d4af37] font-semibold">{address.phone}</p>
                    <button
                      onClick={(e) => handleDeleteAddress(address.id, e)}
                      className="absolute bottom-3 right-3 sm:bottom-4 sm:right-4 min-w- min-h- bg-red-600/10 hover:bg-red-600 rounded-full flex items-center justify-center text-red-500 hover:text-white transition-all"
                      aria-label="Delete address"
                    >
                      <Trash2 className="h-4 w-4" />
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>

          {!showAddressForm && (
            <button
              onClick={() => setShowAddressForm(true)}
              className="w-full py-3 border-2 border-dashed border-[#d4af37] rounded-lg text-[#d4af37] font-semibold hover:bg-[#d4af37] hover:text-black transition-colors flex items-center justify-center gap-2 mb-6 min-h-"
            >
              <Plus className="h-5 w-5" />
              ADD NEW ADDRESS
            </button>
          )}

          {showAddressForm && (
            <div className="bg-gray-900/50 border border-gray-800 rounded-lg p-4 sm:p-6 mb-6">
              <h3 className="text-base sm:text-lg font-bold text-[#d4af37] mb-4 sm:mb-6 border-b border-[#d4af37] pb-2">SHIPPING DETAILS</h3>
              <div className="space-y-4">
                <div>
                  <label className="block text-xs font-semibold text-[#d4af37] uppercase mb-2">FULL NAME <span className="text-red-500">*</span></label>
                  <input name="name" value={formData.name} onChange={handleInputChange} placeholder="Enter your full name" className={`w-full h- bg-gray-800 border border-gray-700 rounded-md px-3 text-white placeholder:text-gray-500 focus:outline-none focus:border-[#d4af37] ${errors.name? "border-red-500" : ""}`} />
                  {errors.name && <p className="text-red-500 text-xs mt-1">{errors.name}</p>}
                </div>

                <div>
                  <label className="block text-xs font-semibold text-[#d4af37] uppercase mb-2">PHONE NUMBER <span className="text-red-500">*</span></label>
                  <input name="phone" value={formData.phone} onChange={handleInputChange} placeholder="10-digit mobile number" maxLength={10} className={`w-full h- bg-gray-800 border-gray-700 rounded-md px-3 text-white placeholder:text-gray-500 focus:outline-none focus:border-[#d4af37] ${errors.phone? "border-red-500" : ""}`} />
                  {errors.phone && <p className="text-red-500 text-xs mt-1">{errors.phone}</p>}
                </div>

                <div>
                  <label className="block text-xs font-semibold text-[#d4af37] uppercase mb-2">ADDRESS LINE 1 <span className="text-red-500">*</span></label>
                  <input name="addressLine1" value={formData.addressLine1} onChange={handleInputChange} placeholder="House/Flat No., Building Name" className={`w-full h- bg-gray-800 border-gray-700 rounded-md px-3 text-white placeholder:text-gray-500 focus:outline-none focus:border-[#d4af37] ${errors.addressLine1? "border-red-500" : ""}`} />
                  {errors.addressLine1 && <p className="text-red-500 text-xs mt-1">{errors.addressLine1}</p>}
                </div>

                <div>
                  <label className="block text-xs font-semibold text-[#d4af37] uppercase mb-2">ADDRESS LINE 2 (OPTIONAL)</label>
                  <input name="addressLine2" value={formData.addressLine2} onChange={handleInputChange} placeholder="Area, Colony, Street" className="w-full h- bg-gray-800 border border-gray-700 rounded-md px-3 text-white placeholder:text-gray-500 focus:outline-none focus:border-[#d4af37]" />
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="relative">
                    <label className="block text-xs font-semibold text-[#d4af37] uppercase mb-2">CITY <span className="text-red-500">*</span></label>
                    <input name="city" value={formData.city} onChange={handleInputChange} onFocus={() => setShowCitySuggestions(true)} onBlur={() => setTimeout(() => setShowCitySuggestions(false), 200)} placeholder="Enter city" className={`w-full h- bg-gray-800 border border-gray-700 rounded-md px-3 text-white placeholder:text-gray-500 focus:outline-none focus:border-[#d4af37] ${errors.city? "border-red-500" : ""}`} />
                    {showCitySuggestions && citySuggestions.length > 0 && (
                      <div className="absolute z-10 top-full left-0 right-0 mt-1 bg-gray-800 border border-[#d4af37] rounded-lg max-h-48 overflow-y-auto">
                        {citySuggestions.map((city) => (
                          <button key={city} type="button" onClick={() => handleCitySelect(city)} className="w-full text-left px-4 py-2 hover:bg-[#d4af37] hover:text-black transition-colors text-sm">
                            {city}
                          </button>
                        ))}
                      </div>
                    )}
                    {errors.city && <p className="text-red-500 text-xs mt-1">{errors.city}</p>}
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-[#d4af37] uppercase mb-2">STATE <span className="text-red-500">*</span></label>
                    <select name="state" value={formData.state} onChange={handleInputChange} className={`w-full h- bg-gray-800 border border-gray-700 rounded-md px-3 text-white focus:outline-none focus:border-[#d4af37] ${errors.state? "border-red-500" : ""}`}>
                      <option value="">Select State</option>
                      {states.map((state) => <option key={state} value={state}>{state}</option>)}
                    </select>
                    {errors.state && <p className="text-red-500 text-xs mt-1">{errors.state}</p>}
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-semibold text-[#d4af37] uppercase mb-2">PINCODE <span className="text-red-500">*</span></label>
                    <input name="pincode" value={formData.pincode} onChange={handleInputChange} placeholder="6-digit pincode" maxLength={6} className={`w-full h- bg-gray-800 border border-gray-700 rounded-md px-3 text-white placeholder:text-gray-500 focus:outline-none focus:border-[#d4af37] ${errors.pincode? "border-red-500" : ""}`} />
                    {errors.pincode && <p className="text-red-500 text-xs mt-1">{errors.pincode}</p>}
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-[#d4af37] uppercase mb-2">ADDRESS TYPE <span className="text-red-500">*</span></label>
                    <select name="addressType" value={formData.addressType} onChange={handleInputChange} className="w-full h- bg-gray-800 border border-gray-700 rounded-md px-3 text-white focus:outline-none focus:border-[#d4af37]">
                      <option value="Home">Home</option>
                      <option value="Work">Work</option>
                      <option value="Other">Other</option>
                    </select>
                  </div>
                </div>

                <div className="flex gap-3 pt-4">
                  <button onClick={handleAddAddress} className="flex-1 bg-[#d4af37] text-black hover:bg-[#c9a22f] font-semibold min-h- rounded-md flex items-center justify-center gap-2">
                    <Plus className="h-4 w-4" /> SAVE THIS ADDRESS
                  </button>
                  <button onClick={() => setShowAddressForm(false)} className="flex-1 border-2 border-gray-700 text-gray-300 hover:bg-gray-800 min-h- rounded-md">
                    Cancel
                  </button>
                </div>
              </div>
            </div>
          )}

          <button
            onClick={handleProceedToPayment}
            disabled={!selectedAddressId}
            className="w-full bg-[#d4af37] text-black hover:bg-[#c9a22f] font-bold py-6 text-base sm:text-lg disabled:opacity-50 disabled:cursor-not-allowed rounded-md flex items-center justify-center gap-2 min-h-"
          >
            <CreditCard className="h-5 w-5" />
            PROCEED TO PAYMENT
          </button>

          <Link href="/cart" className="block text-center text-gray-500 hover:text-[#d4af37] text-sm mt-4 transition-colors min-h- flex items-center justify-center">
            ← Back to Cart
          </Link>
        </div>
      </div>
    </div>
  );
}
