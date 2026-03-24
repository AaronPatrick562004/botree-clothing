"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import { notFound, useRouter } from "next/navigation";
import { getProductById, formatPrice } from "@/lib/products";
import { StarRating } from "@/components/star-rating";
import { Button } from "@/components/ui/button";
import { Minus, Plus, ShoppingCart, Heart, ChevronLeft, ChevronRight, Star, Trash2 } from "lucide-react";
import { useCart } from "@/lib/cart-context";
import { Toaster, toast } from "sonner";
import * as React from "react";

interface Review {
  id: string;
  name: string;
  rating: number;
  title: string;
  comment: string;
  date: string;
}

interface ProductPageProps {
  params: Promise<{
    id: string;
  }>;
}

export default function ProductPage({ params }: ProductPageProps) {
  const { id } = React.use(params);
  
  const [selectedSize, setSelectedSize] = useState<string>("");
  const [quantity, setQuantity] = useState(1);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [showSizeChart, setShowSizeChart] = useState(false);
  const [isAdding, setIsAdding] = useState(false);
  const [isWishlist, setIsWishlist] = useState(false);
  
  const [reviews, setReviews] = useState<Review[]>([]);
  const [showReviewForm, setShowReviewForm] = useState(false);
  const [newReview, setNewReview] = useState({
    name: "",
    rating: 5,
    title: "",
    comment: ""
  });
  const [hoverRating, setHoverRating] = useState(0);

  const product = getProductById(id);
  const { addItem } = useCart();
  const router = useRouter();

  useEffect(() => {
    const savedReviews = localStorage.getItem(`reviews-${id}`);
    if (savedReviews) {
      setReviews(JSON.parse(savedReviews));
    }
    
    const wishlist = JSON.parse(localStorage.getItem("wishlist") || "[]");
    setIsWishlist(wishlist.includes(id));
  }, [id]);

  if (!product) {
    notFound();
  }

  const saveReviews = (newReviews: Review[]) => {
    setReviews(newReviews);
    localStorage.setItem(`reviews-${id}`, JSON.stringify(newReviews));
  };

  const handleAddToCart = () => {
    if (product.sizes && product.sizes[0] !== "FREE" && !selectedSize) {
      toast.error("Please select a size");
      return;
    }

    setIsAdding(true);
    
    const cartItem = {
      id: product.id,
      name: product.name,
      price: product.price,
      originalPrice: product.originalPrice,
      image: product.images[0] || product.image,
      category: product.category,
      size: selectedSize || "FREE",
      quantity: quantity,
      badge: product.badge
    };

    addItem(cartItem);
    
    toast.success("Added to cart!", {
      description: `${product.name} (Size: ${selectedSize || "FREE"}) has been added.`,
      action: {
        label: "View Cart",
        onClick: () => router.push("/cart")
      }
    });
    
    setIsAdding(false);
  };

  const toggleWishlist = () => {
    const wishlist = JSON.parse(localStorage.getItem("wishlist") || "[]");
    if (isWishlist) {
      const updated = wishlist.filter((itemId: string) => itemId !== id);
      localStorage.setItem("wishlist", JSON.stringify(updated));
      setIsWishlist(false);
      toast.success("Removed from wishlist");
    } else {
      wishlist.push(id);
      localStorage.setItem("wishlist", JSON.stringify(wishlist));
      setIsWishlist(true);
      toast.success("Added to wishlist");
    }
  };

  const handleSubmitReview = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!newReview.name || !newReview.title || !newReview.comment) {
      toast.error("Please fill in all fields");
      return;
    }

    const review: Review = {
      id: Date.now().toString(),
      name: newReview.name,
      rating: newReview.rating,
      title: newReview.title,
      comment: newReview.comment,
      date: new Date().toLocaleDateString('en-US', { 
        year: 'numeric', 
        month: 'long', 
        day: 'numeric' 
      })
    };

    saveReviews([review, ...reviews]);
    
    setNewReview({ name: "", rating: 5, title: "", comment: "" });
    setShowReviewForm(false);
    toast.success("Thank you for your review!");
  };

  const handleDeleteReview = (reviewId: string) => {
    if (window.confirm("Delete this review?")) {
      saveReviews(reviews.filter(r => r.id !== reviewId));
      toast.success("Review deleted");
    }
  };

  const productImages = product.images || [product.image];

  const nextImage = () => {
    setCurrentImageIndex((prev) => (prev + 1) % productImages.length);
  };

  const prevImage = () => {
    setCurrentImageIndex((prev) => (prev - 1 + productImages.length) % productImages.length);
  };

  const increaseQuantity = () => setQuantity(prev => prev + 1);
  const decreaseQuantity = () => setQuantity(prev => prev > 1 ? prev - 1 : 1);

  const averageRating = reviews.length > 0
    ? (reviews.reduce((sum, review) => sum + review.rating, 0) / reviews.length).toFixed(1)
    : "0.0";

  const sizeChartData = {
    S: { chest: "36-38", waist: "30-32", length: "28" },
    M: { chest: "38-40", waist: "32-34", length: "29" },
    L: { chest: "40-42", waist: "34-36", length: "30" },
    XL: { chest: "42-44", waist: "36-38", length: "31" },
    XXL: { chest: "44-46", waist: "38-40", length: "32" }
  };

  return (
    <div className="mx-auto max-w-7xl px-4 py-8 lg:px-8">
      <Toaster position="top-right" richColors />
      
      {/* Breadcrumb */}
      <div className="text-sm breadcrumbs mb-6">
        <ul className="flex items-center gap-2 text-muted-foreground">
          <li><Link href="/" className="hover:text-primary">Home</Link></li>
          <li>/</li>
          <li><Link href={`/category/${product.category.toLowerCase()}`} className="hover:text-primary">{product.category}</Link></li>
          <li>/</li>
          <li className="text-foreground line-clamp-1">{product.name}</li>
        </ul>
      </div>

      <div className="grid md:grid-cols-2 gap-8 lg:gap-12">
        {/* Product Images */}
        <div className="space-y-3">
          <div className="relative aspect-4/5 rounded-lg overflow-hidden bg-secondary group max-w-md mx-auto md:mx-0">
            <Image
              src={productImages[currentImageIndex]}
              alt={product.name}
              fill
              className="object-cover"
              priority
              sizes="(max-width: 768px) 100vw, 400px"
            />

            {productImages.length > 1 && (
              <>
                <button onClick={prevImage} className="absolute left-2 top-1/2 -translate-y-1/2 bg-black/50 text-white p-1.5 rounded-full opacity-0 group-hover:opacity-100">
                  <ChevronLeft className="h-5 w-5" />
                </button>
                <button onClick={nextImage} className="absolute right-2 top-1/2 -translate-y-1/2 bg-black/50 text-white p-1.5 rounded-full opacity-0 group-hover:opacity-100">
                  <ChevronRight className="h-5 w-5" />
                </button>
              </>
            )}

            {productImages.length > 1 && (
              <div className="absolute bottom-3 left-1/2 -translate-x-1/2 flex gap-1.5">
                {productImages.map((_, index) => (
                  <button
                    key={index}
                    onClick={() => setCurrentImageIndex(index)}
                    className={`w-1.5 h-1.5 rounded-full transition-all ${
                      index === currentImageIndex ? "w-4 bg-white" : "bg-white/50"
                    }`}
                  />
                ))}
              </div>
            )}

            {product.badge && (
              <span className={`absolute top-3 left-3 px-2 py-0.5 text-xs font-semibold rounded-full z-10 ${
                product.badge === "Premium" ? "bg-purple-600 text-white" :
                product.badge === "Best Seller" ? "bg-green-600 text-white" :
                product.badge === "New" ? "bg-blue-600 text-white" :
                "bg-red-600 text-white"
              }`}>
                {product.badge}
              </span>
            )}
          </div>

          {productImages.length > 1 && (
            <div className="flex gap-2 justify-center md:justify-start">
              {productImages.map((image, index) => (
                <button
                  key={index}
                  onClick={() => setCurrentImageIndex(index)}
                  className={`relative w-16 h-16 rounded-md overflow-hidden border-2 ${
                    index === currentImageIndex ? "border-primary" : "border-transparent"
                  }`}
                >
                  <Image src={image} alt={`Thumbnail ${index + 1}`} fill className="object-cover" />
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Product Details */}
        <div className="space-y-4">
          <div>
            <div className="flex items-center justify-between mb-2">
              <span className="text-xs font-medium text-muted-foreground uppercase tracking-wider">
                {product.type || product.category}
              </span>
              <button onClick={toggleWishlist} className="p-2 hover:bg-secondary rounded-full">
                <Heart className={`h-5 w-5 ${isWishlist ? "fill-red-500 text-red-500" : ""}`} />
              </button>
            </div>
            <h1 className="font-serif text-2xl md:text-3xl font-bold mb-2">{product.name}</h1>

            <div className="flex items-center gap-3">
              <div className="flex items-center gap-1">
                <span className="text-lg font-bold">{averageRating}</span>
                <div className="flex">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <Star key={star} className={`h-4 w-4 ${
                      star <= Math.round(parseFloat(averageRating))
                        ? "fill-yellow-400 text-yellow-400"
                        : "text-gray-300"
                    }`} />
                  ))}
                </div>
              </div>
              <span className="text-xs text-muted-foreground">
                ({reviews.length} {reviews.length === 1 ? 'review' : 'reviews'})
              </span>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <span className="text-2xl font-bold">{formatPrice(product.price)}</span>
            {product.originalPrice && (
              <>
                <span className="text-base text-muted-foreground line-through">
                  {formatPrice(product.originalPrice)}
                </span>
                <span className="text-xs bg-green-100 text-green-800 px-2 py-0.5 rounded">
                  {Math.round(((product.originalPrice - product.price) / product.originalPrice) * 100)}% OFF
                </span>
              </>
            )}
          </div>

          <p className="text-sm text-muted-foreground leading-relaxed line-clamp-3">
            {product.description}
          </p>

          {product.sizes && product.sizes[0] !== "FREE" && (
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <h3 className="text-sm font-semibold">Select Size</h3>
                <button onClick={() => setShowSizeChart(!showSizeChart)} className="text-xs text-primary hover:underline">
                  Size Chart
                </button>
              </div>

              {showSizeChart && (
                <div className="bg-secondary p-3 rounded-lg mb-3 text-sm">
                  <div className="flex justify-between items-center mb-2">
                    <h4 className="font-semibold text-xs">Size Chart (inches)</h4>
                    <button onClick={() => setShowSizeChart(false)} className="text-muted-foreground hover:text-foreground">✕</button>
                  </div>
                  <table className="w-full text-xs">
                    <thead><tr className="border-b"><th className="py-1 text-left">Size</th><th className="py-1 text-left">Chest</th><th className="py-1 text-left">Waist</th><th className="py-1 text-left">Length</th></tr></thead>
                    <tbody>
                      {product.sizes.map((size) => sizeChartData[size as keyof typeof sizeChartData] && (
                        <tr key={size} className="border-b last:border-0">
                          <td className="py-1 font-medium">{size}</td>
                          <td className="py-1">{sizeChartData[size as keyof typeof sizeChartData].chest}</td>
                          <td className="py-1">{sizeChartData[size as keyof typeof sizeChartData].waist}</td>
                          <td className="py-1">{sizeChartData[size as keyof typeof sizeChartData].length}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}

              <div className="flex flex-wrap gap-1.5">
                {product.sizes.map((size) => (
                  <button
                    key={size}
                    onClick={() => setSelectedSize(size)}
                    className={`px-3 py-1.5 text-sm border rounded-md min-w-12 ${
                      selectedSize === size ? "bg-primary text-primary-foreground border-primary" : "hover:border-primary"
                    }`}
                  >
                    {size}
                  </button>
                ))}
              </div>
            </div>
          )}

          <div className="space-y-2">
            <h3 className="text-sm font-semibold">Quantity</h3>
            <div className="flex items-center gap-2">
              <div className="flex items-center border rounded-md">
                <button onClick={decreaseQuantity} className="p-1.5 hover:bg-secondary" disabled={quantity <= 1}>
                  <Minus className="h-3.5 w-3.5" />
                </button>
                <span className="w-10 text-center text-sm font-medium">{quantity}</span>
                <button onClick={increaseQuantity} className="p-1.5 hover:bg-secondary">
                  <Plus className="h-3.5 w-3.5" />
                </button>
              </div>
              <span className="text-xs text-muted-foreground">
                {quantity} item{quantity > 1 ? 's' : ''}
              </span>
            </div>
          </div>

          <div className="flex flex-col sm:flex-row gap-2 pt-4">
            <Button size="default" className="flex-1 gap-1.5" onClick={handleAddToCart} disabled={isAdding || (product.sizes && product.sizes[0] !== "FREE" ? !selectedSize : false)}>
              <ShoppingCart className="h-4 w-4" />
              {isAdding ? "Adding..." : "Add to Cart"}
            </Button>
            <Button size="default" variant="outline" className="flex-1 gap-1.5" onClick={toggleWishlist}>
              <Heart className={`h-4 w-4 ${isWishlist ? "fill-red-500" : ""}`} />
              {isWishlist ? "In Wishlist" : "Wishlist"}
            </Button>
          </div>

          <Button size="default" className="w-full bg-green-600 hover:bg-green-700 text-white" disabled={product.sizes && product.sizes[0] !== "FREE" ? !selectedSize : false}>
            Buy Now
          </Button>
        </div>
      </div>

      {/* Reviews Section */}
      <div className="mt-12 border-t pt-8">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-xl font-serif font-bold">Customer Reviews</h2>
          <Button onClick={() => setShowReviewForm(!showReviewForm)} variant="outline" size="sm" className="gap-2">
            Write a Review
          </Button>
        </div>

        {showReviewForm && (
          <div className="bg-secondary/30 rounded-lg p-4 mb-8">
            <h3 className="font-semibold mb-4">Write Your Review</h3>
            <form onSubmit={handleSubmitReview} className="space-y-4">
              <div>
                <label className="text-sm font-medium mb-1 block">Your Name *</label>
                <input type="text" value={newReview.name} onChange={(e) => setNewReview({...newReview, name: e.target.value})}
                  className="w-full p-2 border rounded-md bg-background" placeholder="John Doe" required />
              </div>

              <div>
                <label className="text-sm font-medium mb-1 block">Rating *</label>
                <div className="flex gap-1">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <button key={star} type="button" onClick={() => setNewReview({...newReview, rating: star})}
                      onMouseEnter={() => setHoverRating(star)} onMouseLeave={() => setHoverRating(0)}>
                      <Star className={`h-6 w-6 ${star <= (hoverRating || newReview.rating) ? "fill-yellow-400 text-yellow-400" : "text-gray-300"}`} />
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <label className="text-sm font-medium mb-1 block">Review Title *</label>
                <input type="text" value={newReview.title} onChange={(e) => setNewReview({...newReview, title: e.target.value})}
                  className="w-full p-2 border rounded-md bg-background" placeholder="Great product!" required />
              </div>

              <div>
                <label className="text-sm font-medium mb-1 block">Your Review *</label>
                <textarea value={newReview.comment} onChange={(e) => setNewReview({...newReview, comment: e.target.value})}
                  className="w-full p-2 border rounded-md bg-background min-h-25" placeholder="Share your experience..." required />
              </div>

              <div className="flex gap-2">
                <Button type="submit" size="sm">Submit Review</Button>
                <Button type="button" variant="outline" size="sm" onClick={() => setShowReviewForm(false)}>Cancel</Button>
              </div>
            </form>
          </div>
        )}

        {reviews.length === 0 ? (
          <div className="text-center py-12 text-muted-foreground">
            <Star className="h-12 w-12 mx-auto mb-4 text-gray-300" />
            <p className="text-lg font-medium mb-2">No reviews yet</p>
            <p className="text-sm">Be the first to share your thoughts!</p>
          </div>
        ) : (
          <div className="space-y-4">
            {reviews.map((review) => (
              <div key={review.id} className="border rounded-lg p-4 relative group">
                <div className="flex items-start justify-between mb-2">
                  <div>
                    <h4 className="font-semibold">{review.name}</h4>
                    <div className="flex items-center gap-2 text-sm text-muted-foreground">
                      <div className="flex">
                        {[1, 2, 3, 4, 5].map((star) => (
                          <Star key={star} className={`h-4 w-4 ${star <= review.rating ? "fill-yellow-400 text-yellow-400" : "text-gray-300"}`} />
                        ))}
                      </div>
                      <span>•</span>
                      <span>{review.date}</span>
                    </div>
                  </div>
                  <button onClick={() => handleDeleteReview(review.id)} className="opacity-0 group-hover:opacity-100 text-red-500 hover:text-red-700">
                    <Trash2 className="h-4 w-4" />
                  </button>
                </div>
                <h5 className="font-medium mb-2">{review.title}</h5>
                <p className="text-sm text-muted-foreground">{review.comment}</p>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}