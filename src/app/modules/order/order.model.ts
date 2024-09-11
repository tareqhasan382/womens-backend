import mongoose, { Schema } from "mongoose";
import { IOrderData } from "./order.interface";

// interface IOrder extends Document {
//   user: {
//     name: string;
//     email: string;
//     phone: string;
//     address: string;
//   };
//   products: Array<{
//     product: mongoose.Schema.Types.ObjectId;
//     quantity: number;
//   }>;
//   totalPrice: number;
//   status: string;
//   paymentStatus: string;
//   transactionId: string;
// }
const ProductItemSchema: Schema = new Schema({
  product: { type: Schema.Types.ObjectId, ref: "Products" },
  quantity: { type: Number, required: true },
});
const OrderSchema: Schema = new Schema(
  {
    user: { type: Schema.Types.ObjectId, ref: "Users" },
    customer: {
      name: { type: String, required: true },
      email: { type: String, required: true },
      phone: { type: String, required: true },
      address: { type: String, required: true },
    },
    products: { type: [ProductItemSchema], required: true },

    totalPrice: {
      type: Number,
      required: true,
    },
    status: {
      type: String,
      enum: ["Pending", "Paid", "Shipped", "Completed", "Cancelled"],
      default: "Pending",
    },
    paymentStatus: {
      type: String,
      enum: ["Pending", "Paid", "Failed"],
      default: "Pending",
    },
    transactionId: {
      type: String,
    },
  },
  {
    timestamps: true,
  }
);

export default mongoose.model<IOrderData>("Order", OrderSchema);
