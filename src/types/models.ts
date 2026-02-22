export interface Variant {
  id: string;
  size: string;
  color: string;
  sku: string;
  stock: number;
}

export interface Product {
  id: string;
  name: string;
  category: string;
  basePrice: number;
  imageUrl?: string;
  variants: Variant[];
}
