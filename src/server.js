import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import authRoutes from "./routes/auth.routes.js";
import shippingRoutes from "./routes/shipping.routes.js";
import orderRoutes from "./routes/order.routes.js";   
import paymentRoutes from "./routes/payment.routes.js";
import newsletterRoutes from "./routes/newsletter.routes.js";
import inventoryRoutes from "./routes/inventory.routes.js";


dotenv.config();


const app = express();

app.use(cors());
app.use(express.json());

app.use("/api/auth", authRoutes);
app.use("/api/shipping", shippingRoutes);
app.use("/api/orders", orderRoutes);
app.use("/api/payment", paymentRoutes);
app.use("/api/newsletter", newsletterRoutes);
app.use("/api/inventory", inventoryRoutes);

app.get("/", (req, res) => {
  res.send("Backend running...");
});

const PORT = 5000;

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});