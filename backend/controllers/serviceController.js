import Service from "../models/serviceModel.js";

/**
 * ✅ Create service (provider)
 */
export const createService = async (req, res) => {
  try {
    // 🔒 Block banned providers
    if (req.provider.isBanned) {
      return res.status(403).json({
        message: "Your account has been banned by admin",
      });
    }
   


    const {
      title,
      category,
      price,
      description = "",
      keywords = [],
    } = req.body;

    if (!title || !category || !price) {
      return res.status(400).json({ message: "Missing fields" });
    }

    const service = await Service.create({
      title,
      category,
      price,
      description,
      keywords,

      // 🔒 trusted data
      pincode: req.provider.pincode,
      provider: req.provider._id,

      // 🔒 admin-controlled
      isApproved: false,
      isActive: true,
    });

    return res.status(201).json(service);
  } catch (err) {
    console.error("CREATE SERVICE ERROR:", err);
    return res.status(500).json({ message: "Service create failed" });
  }
};

/**
 * ✅ ONE API FOR USER:
 * - all services
 * - nearby
 * - category
 * - search
 */
export const getServices = async (req, res) => {
  try {
    const { category, pincode, query } = req.query;

    let filter = {};

    if (category) filter.category = category;
    if (pincode) filter.pincode = pincode;

    if (query) {
      filter.$or = [
        { title: { $regex: query, $options: "i" } },
        { keywords: { $regex: query, $options: "i" } },
        { category: { $regex: query, $options: "i" } },
      ];
    }

    const services = await Service.find({
      isApproved: true,
      isActive: true,
      ...filter,
    })
      .populate("provider", "name")
      .sort({ createdAt: -1 });

    return res.status(200).json(services);
  } catch (err) {
    console.error("GET SERVICES ERROR:", err);
    return res.status(500).json({ message: "Failed to fetch services" });
  }
};

/**
 * ✅ Service detail page
 */
export const getServiceById = async (req, res) => {
  try {
    const service = await Service.findById(req.params.id).populate(
      "provider",
      "name mobile"
    );

    if (!service) {
      return res.status(404).json({ message: "Service not found" });
    }

    return res.status(200).json(service);
  } catch (err) {
    return res.status(400).json({ message: "Invalid service id" });
  }
};
