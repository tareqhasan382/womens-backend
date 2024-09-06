import { Schema, model } from "mongoose";
import { IReview } from "./review.interface";

const reviewSchema = new Schema<IReview>(
  {
    product: {
      type: Schema.Types.ObjectId,
      ref: "Products",
      required: true,
    },
    user: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    rating: {
      type: Number,
      required: true,
      min: [1, "Rating must be at least 1.0"],
      max: [5, "Rating must be at most 5.0"],
    },
    comment: {
      type: String,
      trim: true,
    },
  },
  { timestamps: true }
);

export const ReviewModel = model<IReview>("Reviews", reviewSchema);
