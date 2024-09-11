import { Types } from "mongoose";

export type IReview = {
  product: Types.ObjectId;
  user: Types.ObjectId;
  rating: number;
  comment: string;
};
