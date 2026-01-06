import Service from "../models/serviceModel.js";

/**
 * ✅ Create service (provider / admin)
 */
export const createService = async (req, res) => {
  try {
    const { title, category, price, pincode, keywords, provider } = req.body;

    if (!title || !category || !price || !pincode) {
      return res.status(400).json({ message: "Missing fields" });
    }

    const service = await Service.create({
      title,
      category,
      price,
      pincode,
      keywords: keywords || [],
      provider: provider || null,
    });

    res.status(201).json(service);
  } catch (err) {
    res.status(500).json({ message: "Service create failed" });
  }
};

/**
 * ✅ ONE API FOR:
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

    const services = await Service.find(filter)
      .populate("provider", "name")
      .sort({ createdAt: -1 });

    res.json(services);
  } catch (err) {
    res.status(500).json({ message: "Failed to fetch services" });
  }
};

/**
 * ✅ Service detail page
 */
export const getServiceById = async (req, res) => {
  const service = await Service.findById(req.params.id)
    .populate("provider", "name phone");

  if (!service) {
    return res.status(404).json({ message: "Service not found" });
  }

  res.json(service);
};
