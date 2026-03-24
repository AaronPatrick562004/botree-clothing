import { allProducts, menProducts, womenProducts, kidsProducts, newArrivalsProducts } from './products-data';

export interface Product {
  id: string;
  name: string;
  price: number;
  originalPrice?: number;
  image: string;
  images: string[];
  category: string;
  type: string;
  description: string;
  features: string[];
  rating: number;
  reviews: any[];
  badge?: string;
  sizes: string[];
  // Add this missing property
  colors: string[];
}

export function formatPrice(price: number): string {
  return new Intl.NumberFormat('en-IN', {
    style: 'currency',
    currency: 'INR',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(price);
}

export const products = allProducts;

export function getFeaturedProducts() {
  // Get 2 from each category
  const men = menProducts.slice(0, 2);
  const women = womenProducts.slice(0, 2);
  const kids = kidsProducts.slice(0, 2);
  const newArrivals = newArrivalsProducts.slice(0, 2);
  
  // Return all 8 products
  return [...men, ...women, ...kids, ...newArrivals];
}

export function getProductsByCategory(category: string) {
  console.log("Getting products for category:", category); // Debug log
  
  const categoryMap: { [key: string]: string } = {
    'men': 'Men',
    'women': 'Women',
    'kids': 'Kids',
    'new-arrivals': 'New Arrivals'
  };
  
  const mappedCategory = categoryMap[category.toLowerCase()] || category;
  console.log("Mapped category:", mappedCategory); // Debug log
  
  const filtered = allProducts.filter(product => product.category === mappedCategory);
  console.log("Found products:", filtered.length); // Debug log
  
  return filtered;
}

export function getProductById(id: string) {
  return allProducts.find(product => product.id === id);
}

export { menProducts, womenProducts, kidsProducts, newArrivalsProducts };