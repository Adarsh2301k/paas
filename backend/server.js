import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import connectDB from "./config/db.js";
import userRoutes from "./routes/userRoutes.js";
import providerRoutes from "./routes/providerRoutes.js";
import bookingRoutes from "./routes/bookingRoutes.js";

dotenv.config();
connectDB();

const app = express();
app.use(cors());
app.use(express.json());


// Routes
import providerPanelRoutes from "./routes/providerPanelRoutes.js";
app.use("/api/provider", providerPanelRoutes);

app.use("/api/providers",providerRoutes);
app.use("/api/users", userRoutes);
app.use("/api/bookings", bookingRoutes);


const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`🚀 Server running on port ${PORT}`));
