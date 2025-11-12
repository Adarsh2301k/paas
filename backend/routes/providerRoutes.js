import express from "express";
import {
  getProviders,
  getProviderDetails,
  
} from "../controllers/providerController.js";

const router = express.Router();

// User-side routes
router.get("/", getProviders);
router.get("/:id", getProviderDetails);

export default router;


