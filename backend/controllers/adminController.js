import Service from "../models/serviceModel.js";
import Provider from "../models/providerModel.js";


export const getAllProviders = async (req, res) => {
  const providers = await Provider.find().select("-__v");
  res.json(providers);
};

export const getAllServices = async (req, res) => {
  try {
    const services = await Service.find()
      .populate("provider", "name mobile");

    res.json(services);
  } catch (err) {
    console.error("ADMIN getAllServices ERROR 👉", err);
    res.status(500).json({ message: "Admin service fetch failed" });
  }
};

export const approveService = async (req, res) => {
  const service = await Service.findById(req.params.id);

  if (!service) {
    return res.status(404).json({ message: "Service not found" });
  }

  service.isApproved = !service.isApproved;
  await service.save();

  res.json(service);
};

export const adminToggleService = async (req, res) => {
  const service = await Service.findById(req.params.id);

  if (!service) {
    return res.status(404).json({ message: "Service not found" });
  }

  service.isActive = !service.isActive;
  await service.save();

  res.json(service);
};

/* ================= TOGGLE PROVIDER BAN ================= */
export const toggleProviderBan = async (req, res) => {
  try {
    const { id } = req.params;

    const provider = await Provider.findById(id);
    if (!provider) {
      return res.status(404).json({ message: "Provider not found" });
    }

    // toggle ban
    provider.isBanned = !provider.isBanned;
    await provider.save();

    // if banning → deactivate all services
    if (provider.isBanned) {
      await Service.updateMany(
        { provider: provider._id },
        { isActive: false }
      );
    }

    return res.status(200).json({
      message: provider.isBanned
        ? "Provider banned successfully"
        : "Provider unbanned successfully",
      provider,
    });
  } catch (err) {
    console.error("TOGGLE PROVIDER BAN ERROR:", err);
    return res.status(500).json({ message: "Failed to update provider status" });
  }
};


