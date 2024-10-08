import express, { Application } from "express";
const app: Application = express();
import cors from "cors";
import cookieParser from "cookie-parser";
import globalErrorHandler from "./app/middlewares/globalErrorHandler";
import notFound from "./app/middlewares/notFound";
import { UserRoute } from "./app/modules/auth/user.route";
import { ProductRoute } from "./app/modules/products/product.route";
import { reviewRoute } from "./app/modules/review/review.route";
import { paymentRoute } from "./app/modules/payment/payment.route";
import { orderRoute } from "./app/modules/order/order.route";

const corsOptions = {
  origin: [
    "http://localhost:5173/",
    "http://localhost:5173",
    "http://localhost:3000",
    "https://womens-fashion-client.vercel.app",
    "https://womens-fashion-admin-panel.vercel.app",
  ],
  credentials: true,
  optionSuccessStatus: 200,
};
app.use(cors(corsOptions));
app.use((req, res, next) => {
  res.setHeader("Cross-Origin-Opener-Policy", "same-origin");
  res.setHeader("Cross-Origin-Embedder-Policy", "require-corp");
  next();
});

app.use(cookieParser());
//parser
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
// Applications route
app.get("/", (req, res) => {
  res.status(200).json({ status: 200, message: " Our server is Running 🚀" });
});
app.use("/api/auth", UserRoute);
app.use("/api", ProductRoute);
app.use("/api", reviewRoute);
app.use("/api", paymentRoute);
app.use("/api", orderRoute);

app.use(globalErrorHandler);
// route not found
app.use(notFound);

export default app;
