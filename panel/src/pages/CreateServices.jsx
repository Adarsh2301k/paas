import { useState } from "react";
import { createService } from "../api/providerApi";
import toast from "react-hot-toast";

const categories = [
  "Electrician",
  "Plumber",
  "AC Repair",
  "Cleaning",
  "Carpenter",
  "Electronics Repair",
];

const CreateService = () => {
  const [form, setForm] = useState({
    title: "",
    description: "",
    category: "",
    price: "",
  });

  const [imageFile, setImageFile] = useState(null);
  const [imagePreview, setImagePreview] = useState(null);
  const [loading, setLoading] = useState(false);


  const changeHandler = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const imageHandler = (e) => {
    const file = e.target.files[0];
    if (file) {
      setImageFile(file);
      setImagePreview(URL.createObjectURL(file));
    }
  };

  const submitHandler = async () => {
    if (!form.title || !form.category || !form.price) {
      toast.error("Please fill required fields");
      return;
    }

    try {
      setLoading(true);

      const formData = new FormData();
      formData.append("title", form.title);
      formData.append("description", form.description);
      formData.append("category", form.category);
      formData.append("price", form.price);

      if (imageFile) {
        formData.append("image", imageFile); // 🔒 MUST MATCH BACKEND
      }

      await createService(formData);

      toast.success("Service created successfully");

      setForm({
        title: "",
        description: "",
        category: "",
        price: "",
      });
      setImageFile(null);
      setImagePreview(null);
    } catch (err) {
      toast.error("Failed to create service");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-3xl mx-auto bg-white rounded-xl shadow p-4 md:p-6">
      <h1 className="text-xl font-semibold mb-4">
        ➕ Create New Service
      </h1>

      {/* Title */}
      <input
        name="title"
        value={form.title}
        onChange={changeHandler}
        placeholder="Service title"
        className="w-full border rounded-lg p-2 mb-3"
      />

      {/* Description */}
      <textarea
        name="description"
        value={form.description}
        onChange={changeHandler}
        rows="3"
        placeholder="Service description"
        className="w-full border rounded-lg p-2 mb-3"
      />

      {/* Category */}
      <select
        name="category"
        value={form.category}
        onChange={changeHandler}
        className="w-full border rounded-lg p-2 mb-3"
      >
        <option value="">Select category</option>
        {categories.map((c) => (
          <option key={c} value={c}>
            {c}
          </option>
        ))}
      </select>

      {/* Price */}
      <input
        name="price"
        type="number"
        value={form.price}
        onChange={changeHandler}
        placeholder="Price (₹)"
        className="w-full border rounded-lg p-2 mb-3"
      />

      {/* Image */}
      <div className="border-2 border-dashed rounded-lg p-3 text-center mb-4">
        <input
          type="file"
          accept="image/*"
          onChange={imageHandler}
          id="imageUpload"
          className="hidden"
        />
        <label htmlFor="imageUpload" className="cursor-pointer">
          {imagePreview ? (
            <img
              src={imagePreview}
              alt="Preview"
              className="mx-auto h-28 rounded-md object-cover"
            />
          ) : (
            <p className="text-sm text-gray-500">
              Click to upload image (optional)
            </p>
          )}
        </label>
      </div>

      {/* Submit */}
      <button
        onClick={submitHandler}
        disabled={loading}
        className="w-full bg-blue-600 text-white py-2 rounded-lg disabled:opacity-50"
      >
        {loading ? "Creating..." : "Create Service"}
      </button>
    </div>
  );
};

export default CreateService;
