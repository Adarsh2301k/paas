import express from "express";
import { protectProvider } from "../middleware/protectProvider.js";
import adminOnly from "../middleware/adminOnly.js";
import {
  getAllProviders,
  getAllServices,
  approveService,
  adminToggleService,toggleProviderBan
} from "../controllers/adminController.js";

const router = express.Router();

router.use(protectProvider);
router.use(adminOnly);

router.get("/allproviders", getAllProviders);
router.get("/allservices", getAllServices);
router.patch("/service/approve/:id", approveService);
router.patch("/service/toggle/:id", adminToggleService);
router.patch(
  "/provider/ban/:id",
  toggleProviderBan
);
export default router;
