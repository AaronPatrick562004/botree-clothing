"use client";

import { useState } from "react";
import { Ruler, HelpCircle } from "lucide-react";

export default function SizeGuidePage() {
  const [activeTab, setActiveTab] = useState<"men" | "women" | "kids">("men");

  const menSizes = [
    { size: "S", chest: "36-38", waist: "30-32", length: "28", shoulder: "16" },
    { size: "M", chest: "38-40", waist: "32-34", length: "29", shoulder: "17" },
    { size: "L", chest: "40-42", waist: "34-36", length: "30", shoulder: "18" },
    { size: "XL", chest: "42-44", waist: "36-38", length: "31", shoulder: "19" },
    { size: "XXL", chest: "44-46", waist: "38-40", length: "32", shoulder: "20" },
  ];

  const womenSizes = [
    { size: "XS", bust: "32-33", waist: "24-25", hips: "34-35", length: "26" },
    { size: "S", bust: "34-35", waist: "26-27", hips: "36-37", length: "27" },
    { size: "M", bust: "36-37", waist: "28-29", hips: "38-39", length: "28" },
    { size: "L", bust: "38-40", waist: "30-32", hips: "40-42", length: "29" },
    { size: "XL", bust: "41-43", waist: "33-35", hips: "43-45", length: "30" },
  ];

  const kidsSizes = [
    { size: "2-3Y", age: "2-3 years", height: "85-95", chest: "52-54", waist: "50-52" },
    { size: "3-4Y", age: "3-4 years", height: "95-105", chest: "54-56", waist: "52-54" },
    { size: "4-5Y", age: "4-5 years", height: "105-115", chest: "56-58", waist: "54-56" },
    { size: "5-6Y", age: "5-6 years", height: "115-120", chest: "58-60", waist: "56-58" },
    { size: "6-7Y", age: "6-7 years", height: "120-125", chest: "60-62", waist: "58-60" },
    { size: "7-8Y", age: "7-8 years", height: "125-135", chest: "62-65", waist: "60-63" },
  ];

  return (
    <div className="mx-auto max-w-4xl px-4 py-12 lg:px-8">
      {/* Header */}
      <div className="text-center mb-12">
        <h1 className="font-serif text-4xl md:text-5xl font-bold text-foreground mb-4">
          Size Guide
        </h1>
        <p className="text-lg text-muted-foreground">
          Find your perfect fit with our detailed size charts and measuring tips.
        </p>
      </div>

      {/* How to Measure */}
      <div className="bg-secondary/30 rounded-lg p-6 mb-12">
        <h2 className="font-serif text-2xl font-bold mb-6 flex items-center gap-2">
          <Ruler className="h-6 w-6" />
          How to Measure
        </h2>
        <div className="grid md:grid-cols-3 gap-6">
          <div>
            <h3 className="font-medium mb-2">Chest</h3>
            <p className="text-sm text-muted-foreground">
              Measure around the fullest part of your chest, keeping the tape horizontal.
            </p>
          </div>
          <div>
            <h3 className="font-medium mb-2">Waist</h3>
            <p className="text-sm text-muted-foreground">
              Measure around your natural waistline, just above your belly button.
            </p>
          </div>
          <div>
            <h3 className="font-medium mb-2">Hips</h3>
            <p className="text-sm text-muted-foreground">
              Measure around the fullest part of your hips, keeping the tape horizontal.
            </p>
          </div>
        </div>
      </div>

      {/* Category Tabs */}
      <div className="flex gap-2 mb-8">
        {[
          { id: "men", label: "Men" },
          { id: "women", label: "Women" },
          { id: "kids", label: "Kids" },
        ].map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id as "men" | "women" | "kids")}
            className={`flex-1 py-3 font-medium rounded-lg transition-colors ${
              activeTab === tab.id
                ? "bg-primary text-primary-foreground"
                : "bg-secondary hover:bg-secondary/80"
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* Size Charts */}
      <div className="bg-secondary/30 rounded-lg p-6 mb-8">
        {activeTab === "men" && (
          <>
            <h2 className="font-serif text-2xl font-bold mb-6">Men's Size Chart</h2>
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b">
                    <th className="py-3 text-left">Size</th>
                    <th className="py-3 text-left">Chest (in)</th>
                    <th className="py-3 text-left">Waist (in)</th>
                    <th className="py-3 text-left">Length (in)</th>
                    <th className="py-3 text-left">Shoulder (in)</th>
                  </tr>
                </thead>
                <tbody>
                  {menSizes.map((size) => (
                    <tr key={size.size} className="border-b last:border-0">
                      <td className="py-3 font-medium">{size.size}</td>
                      <td className="py-3">{size.chest}</td>
                      <td className="py-3">{size.waist}</td>
                      <td className="py-3">{size.length}</td>
                      <td className="py-3">{size.shoulder}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </>
        )}

        {activeTab === "women" && (
          <>
            <h2 className="font-serif text-2xl font-bold mb-6">Women's Size Chart</h2>
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b">
                    <th className="py-3 text-left">Size</th>
                    <th className="py-3 text-left">Bust (in)</th>
                    <th className="py-3 text-left">Waist (in)</th>
                    <th className="py-3 text-left">Hips (in)</th>
                    <th className="py-3 text-left">Length (in)</th>
                  </tr>
                </thead>
                <tbody>
                  {womenSizes.map((size) => (
                    <tr key={size.size} className="border-b last:border-0">
                      <td className="py-3 font-medium">{size.size}</td>
                      <td className="py-3">{size.bust}</td>
                      <td className="py-3">{size.waist}</td>
                      <td className="py-3">{size.hips}</td>
                      <td className="py-3">{size.length}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </>
        )}

        {activeTab === "kids" && (
          <>
            <h2 className="font-serif text-2xl font-bold mb-6">Kids' Size Chart</h2>
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b">
                    <th className="py-3 text-left">Size</th>
                    <th className="py-3 text-left">Age</th>
                    <th className="py-3 text-left">Height (cm)</th>
                    <th className="py-3 text-left">Chest (cm)</th>
                    <th className="py-3 text-left">Waist (cm)</th>
                  </tr>
                </thead>
                <tbody>
                  {kidsSizes.map((size) => (
                    <tr key={size.size} className="border-b last:border-0">
                      <td className="py-3 font-medium">{size.size}</td>
                      <td className="py-3">{size.age}</td>
                      <td className="py-3">{size.height}</td>
                      <td className="py-3">{size.chest}</td>
                      <td className="py-3">{size.waist}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </>
        )}
      </div>

      {/* Fit Tips */}
      <div className="bg-primary/5 rounded-lg p-6 mb-12">
        <h2 className="font-serif text-xl font-bold mb-4 flex items-center gap-2">
          <HelpCircle className="h-5 w-5" />
          Fit Tips
        </h2>
        <ul className="space-y-2 text-sm text-muted-foreground">
          <li>• Our clothes are designed to fit true to size based on standard measurements.</li>
          <li>• For a relaxed fit, consider sizing up. For a slim fit, consider sizing down.</li>
          <li>• Different styles (regular, slim, oversized) may fit differently - check product descriptions.</li>
          <li>• When between sizes, we recommend sizing up for comfort.</li>
          <li>• Refer to individual product pages for specific measurements.</li>
        </ul>
      </div>

      {/* International Conversions */}
      <div className="bg-secondary/30 rounded-lg p-6">
        <h2 className="font-serif text-xl font-bold mb-4">International Size Conversions</h2>
        <div className="grid md:grid-cols-2 gap-8">
          <div>
            <h3 className="font-medium mb-3">Men</h3>
            <div className="space-y-2 text-sm">
              <p><span className="font-medium">S:</span> 36 (US), 46 (EU)</p>
              <p><span className="font-medium">M:</span> 38 (US), 48 (EU)</p>
              <p><span className="font-medium">L:</span> 40 (US), 50 (EU)</p>
              <p><span className="font-medium">XL:</span> 42 (US), 52 (EU)</p>
              <p><span className="font-medium">XXL:</span> 44 (US), 54 (EU)</p>
            </div>
          </div>
          <div>
            <h3 className="font-medium mb-3">Women</h3>
            <div className="space-y-2 text-sm">
              <p><span className="font-medium">XS:</span> 0-2 (US), 32-34 (EU)</p>
              <p><span className="font-medium">S:</span> 4-6 (US), 36-38 (EU)</p>
              <p><span className="font-medium">M:</span> 8-10 (US), 40-42 (EU)</p>
              <p><span className="font-medium">L:</span> 12-14 (US), 44-46 (EU)</p>
              <p><span className="font-medium">XL:</span> 16-18 (US), 48-50 (EU)</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}