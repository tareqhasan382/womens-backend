import { Types } from "mongoose";

export type IProduct = {
  user: Types.ObjectId;
  review: Types.ObjectId[];
  name: string;
  description: string;
  price: number;
  discountedPrice?: number;
  images: string[];
  colors: string[];
  sizes: string[];
  category: string;
  brand: string;
  stock: number;
  sold?: number;
  producttype?: string;
};
