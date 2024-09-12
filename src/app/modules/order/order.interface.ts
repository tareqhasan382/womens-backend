import { Types } from "mongoose";

interface Customer {
  name: string;
  email: string;
  phone: string;
  address: string;
}
interface ProductItem {
  product: Types.ObjectId;
  quantity: number;
}
export type IOrderData = {
  user: Types.ObjectId;
  customer: Customer;
  products: ProductItem[];
  totalPrice: number;
  status: string;
  paymentStatus: string;
  transactionId: string;
  bank_tran_id: string;
};
