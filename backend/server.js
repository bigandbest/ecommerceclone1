import express from 'express';
import cors from 'cors';
import cookieParser from 'cookie-parser';
import dotenv from 'dotenv';

dotenv.config();

import authRoutes from './routes/authRoute.js';
import geoAddressRoute from './routes/geoAddressRoute.js';
import warehouseRoute from './routes/warehouseRoute.js';
import productWarehouseRoute from './routes/productWarehouseRoutes.js';
import productsRoute from './routes/productRoutes.js';
import locationRoute from './routes/locationRoutes.js';
import cartRoutes from "./routes/cartRoutes.js";
import orderRoutes from "./routes/orderRoutes.js";
import orderItemsRoutes from "./routes/orderItemsRoutes.js";
import checkCartAvailabilityRoute from './routes/checkCartAvailabilityRoute.js';
import paymentRoutes from "./routes/paymentRoutes.js";
import notificationRoutes from "./routes/notificationRoutes.js";
import locationRoutes from './routes/locationRoute.js';
import storeRoutes from './routes/storeRoute.js';
import recommendedStoreRoutes from './routes/recommendedStoreRoutes.js';
import productRecommendedStoreRoutes from './routes/productRecommendedStoreRoutes.js';
import quickPickRoutes from './routes/quickPickRoutes.js';
import quickPickGroupRoutes from './routes/quickPickGroupRoutes.js';
import quickPickGroupProductRoutes from './routes/quickPickGroupProductRoutes.js';
import brandRoutes from './routes/brandRoutes.js';
import productBrandRoutes from './routes/productBrandRoutes.js';
import bnbRoutes from './routes/b&bRoutes.js';
import bnbGroupRoutes from './routes/b&bGroupRoutes.js';
import bnbGroupProductRoutes from './routes/b&bGroupProductRoutes.js'
import savingZoneRoutes from './routes/savingZoneRoutes.js';
import savingZoneGroupRoutes from './routes/savingZoneGroupRoutes.js';
import savingZoneGroupProductRoutes from './routes/savingZoneGroupProductRoutes.js'
import YouMayLikeProductRoutes from './routes/youMayLikeRoutes.js';

const app = express();
const PORT = process.env.PORT || 8000;
const allowedOrigins = [
  'http://localhost:5173',
  'http://localhost:5174',
  'https://ecommerce-umber-five-95.vercel.app',
  'https://admin-eight-flax.vercel.app',
  'https://ecommerce-six-brown-12.vercel.app',
  'https://www.bigbestmart.com',
  'https://admin-eight-ruddy.vercel.app',
  'https://ecommerceclone1-ba3y.vercel.app',
  'https://ecommerceclone1.vercel.app'
];

const corsOptions = {
  origin: function (origin, callback) {
    if (allowedOrigins.indexOf(origin) !== -1 || !origin) {
      callback(null, true);
    } else {
      callback(new Error('Not allowed by CORS'));
    }
  },
  credentials: true,
};

app.use(cors(corsOptions));
app.use(express.json());
app.use(cookieParser());

app.use('/api/business', authRoutes);
app.use('/api/geo-address', geoAddressRoute);
app.use('/api/warehouse', warehouseRoute);
app.use('/api/productwarehouse', productWarehouseRoute);
app.use('/api/productsroute', productsRoute);
app.use('/api/locationsroute', locationRoute);
app.use("/api/cart", cartRoutes);
app.use("/api/order", orderRoutes);
app.use("/api/orderItems", orderItemsRoutes);
app.use("/api/check", checkCartAvailabilityRoute);
app.use("/api/payment", paymentRoutes);
app.use("/api/notifications", notificationRoutes);
app.use('/api/location', locationRoutes);
app.use("/api/stores", storeRoutes);
app.use("/api/recommended-stores", recommendedStoreRoutes);
app.use("/api/product-recommended-stores", productRecommendedStoreRoutes);
app.use("/api/quick-pick", quickPickRoutes);
app.use("/api/quick-pick-group", quickPickGroupRoutes);
app.use("/api/quick-pick-group-product", quickPickGroupProductRoutes);
app.use("/api/brand", brandRoutes);
app.use("/api/product-brand", productBrandRoutes);
app.use("/api/bnb", bnbRoutes);
app.use("/api/b&b-group", bnbGroupRoutes);
app.use("/api/b&b-group-product", bnbGroupProductRoutes);
app.use("/api/saving-zone", savingZoneRoutes);
app.use("/api/saving-zone-group", savingZoneGroupRoutes);
app.use("/api/saving-zone-group-product", savingZoneGroupProductRoutes);
app.use("/api/you-may-like-products", YouMayLikeProductRoutes);


app.listen(PORT, () => console.log(`Server running on port ${PORT}`));