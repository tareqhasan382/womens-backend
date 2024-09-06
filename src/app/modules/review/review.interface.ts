import { Types } from "mongoose";
import { IProduct } from "../products/product.interface";

export type IReview = {
  product: Types.ObjectId;
  user: Types.ObjectId;
  rating: number;
  comment: string;
};
