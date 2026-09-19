import { useState } from "react";
import API from "../api/api";

function LostItem() {
  const [formData, setFormData] = useState({
    type: "lost",
    title: "",
    description: "",
    category: "",
    color: "",
    location: "",
    latitude: "",
    longitude: "",
    date: "",
  });

  const [image, setImage] = useState(null);
  const [imagePreview, setImagePreview] = useState("");

  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);

  // ======================================
  // HANDLE TEXT INPUT
  // ======================================
  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  // ======================================
  // HANDLE IMAGE
  // ======================================
  const handleImageChange = (e) => {
    const file = e.target.files[0];

    if (!file) {
      return;
    }

    const allowedTypes = [
      "image/jpeg",
      "image/jpg",
      "image/png",
      "image/webp",
    ];

    // Check file type
    if (!allowedTypes.includes(file.type)) {
      setMessage(
        "Only JPG, JPEG, PNG and WEBP images are allowed."
      );

      e.target.value = "";
      return;
    }

    // Check file size - 5 MB
    if (file.size > 5 * 1024 * 1024) {
      setMessage("Image size must be less than 5 MB.");

      e.target.value = "";
      return;
    }

    setImage(file);
    setImagePreview(URL.createObjectURL(file));
    setMessage("");
  };

  // ======================================
  // SUBMIT FORM
  // ======================================
  const handleSubmit = async (e) => {
    e.preventDefault();

    setLoading(true);
    setMessage("");

    try {
      // Create FormData
      const data = new FormData();

      data.append("type", "lost");
      data.append("title", formData.title);
      data.append("description", formData.description);
      data.append("category", formData.category);
      data.append("color", formData.color);
      data.append("location", formData.location);

      if (formData.latitude) {
        data.append(
          "latitude",
          Number(formData.latitude)
        );
      }

      if (formData.longitude) {
        data.append(
          "longitude",
          Number(formData.longitude)
        );
      }

      data.append("date", formData.date);

      // Add image
      if (image) {
        data.append("image", image);
      }

      const response = await API.post(
        "/items",
        data
      );

      console.log(
        "Lost Item Response:",
        response.data
      );

      setMessage(
        response.data.message ||
          "Lost item created successfully"
      );

      // Reset form
      setFormData({
        type: "lost",
        title: "",
        description: "",
        category: "",
        color: "",
        location: "",
        latitude: "",
        longitude: "",
        date: "",
      });

      setImage(null);
      setImagePreview("");
    } catch (error) {
      console.error(
        "Lost Item Error:",
        error.response?.data || error.message
      );

      setMessage(
        error.response?.data?.message ||
          "Failed to create lost item"
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 py-10 px-4">
      <div className="max-w-2xl mx-auto bg-white rounded-xl shadow-md p-8">

        <h1 className="text-3xl font-bold text-gray-800 mb-8">
          Report Lost Item
        </h1>

        <form onSubmit={handleSubmit}>

          {/* TITLE */}
          <div className="mb-5">
            <label className="block font-semibold text-gray-700 mb-2">
              Title
            </label>

            <input
              type="text"
              name="title"
              value={formData.title}
              onChange={handleChange}
              placeholder="Example: Black Wallet"
              className="w-full border border-gray-300 rounded-lg px-4 py-3"
              required
            />
          </div>

          {/* DESCRIPTION */}
          <div className="mb-5">
            <label className="block font-semibold text-gray-700 mb-2">
              Description
            </label>

            <textarea
              name="description"
              value={formData.description}
              onChange={handleChange}
              placeholder="Describe the lost item"
              className="w-full border border-gray-300 rounded-lg px-4 py-3"
              rows="4"
              required
            />
          </div>

          {/* CATEGORY */}
          <div className="mb-5">
            <label className="block font-semibold text-gray-700 mb-2">
              Category
            </label>

            <input
              type="text"
              name="category"
              value={formData.category}
              onChange={handleChange}
              placeholder="Example: Wallet"
              className="w-full border border-gray-300 rounded-lg px-4 py-3"
              required
            />
          </div>

          {/* COLOR */}
          <div className="mb-5">
            <label className="block font-semibold text-gray-700 mb-2">
              Color
            </label>

            <input
              type="text"
              name="color"
              value={formData.color}
              onChange={handleChange}
              placeholder="Example: Black"
              className="w-full border border-gray-300 rounded-lg px-4 py-3"
            />
          </div>

          {/* LOCATION */}
          <div className="mb-5">
            <label className="block font-semibold text-gray-700 mb-2">
              Location
            </label>

            <input
              type="text"
              name="location"
              value={formData.location}
              onChange={handleChange}
              placeholder="Example: College Main Gate"
              className="w-full border border-gray-300 rounded-lg px-4 py-3"
              required
            />
          </div>

          {/* LATITUDE */}
          <div className="mb-5">
            <label className="block font-semibold text-gray-700 mb-2">
              Latitude
            </label>

            <input
              type="number"
              step="any"
              name="latitude"
              value={formData.latitude}
              onChange={handleChange}
              placeholder="Example: 28.6139"
              className="w-full border border-gray-300 rounded-lg px-4 py-3"
            />
          </div>

          {/* LONGITUDE */}
          <div className="mb-5">
            <label className="block font-semibold text-gray-700 mb-2">
              Longitude
            </label>

            <input
              type="number"
              step="any"
              name="longitude"
              value={formData.longitude}
              onChange={handleChange}
              placeholder="Example: 77.2090"
              className="w-full border border-gray-300 rounded-lg px-4 py-3"
            />
          </div>

          {/* DATE */}
          <div className="mb-5">
            <label className="block font-semibold text-gray-700 mb-2">
              Date
            </label>

            <input
              type="datetime-local"
              name="date"
              value={formData.date}
              onChange={handleChange}
              className="w-full border border-gray-300 rounded-lg px-4 py-3"
              required
            />
          </div>

          {/* IMAGE UPLOAD */}
          <div className="mb-6">
            <label className="block font-semibold text-gray-700 mb-2">
              Item Image
            </label>

            <input
              type="file"
              accept="image/jpeg,image/jpg,image/png,image/webp"
              onChange={handleImageChange}
              className="w-full border border-gray-300 rounded-lg px-4 py-3"
            />

            <p className="text-sm text-gray-500 mt-2">
              JPG, JPEG, PNG or WEBP. Maximum 5 MB.
            </p>
          </div>

          {/* IMAGE PREVIEW */}
          {imagePreview && (
            <div className="mb-6">
              <p className="font-semibold text-gray-700 mb-2">
                Image Preview
              </p>

              <img
                src={imagePreview}
                alt="Lost item preview"
                className="w-full max-h-80 object-contain rounded-lg border border-gray-300"
              />
            </div>
          )}

          {/* SUBMIT */}
          <button
            type="submit"
            disabled={loading}
            className="w-full bg-blue-600 text-white py-3 rounded-lg font-semibold hover:bg-blue-700 transition disabled:bg-gray-400"
          >
            {loading
              ? "Submitting..."
              : "Report Lost Item"}
          </button>

        </form>

        {/* MESSAGE */}
        {message && (
          <p className="mt-5 text-center text-gray-700">
            {message}
          </p>
        )}

      </div>
    </div>
  );
}

export default LostItem;