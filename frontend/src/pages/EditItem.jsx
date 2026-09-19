
import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import API from "../api/api";

function EditItem() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    title: "",
    description: "",
    category: "",
    color: "",
    location: "",
    latitude: "",
    longitude: "",
    date: "",
  });

  const [currentImage, setCurrentImage] = useState("");
  const [newImage, setNewImage] = useState(null);

  const [loading, setLoading] = useState(true);
  const [updating, setUpdating] = useState(false);
  const [error, setError] = useState("");

  // ======================================
  // GET ITEM DETAILS
  // ======================================
  useEffect(() => {
    const fetchItem = async () => {
      try {
        setLoading(true);
        setError("");

        const response = await API.get(`/items/${id}`);

        const item = response.data.item;

        setFormData({
          title: item.title || "",
          description: item.description || "",
          category: item.category || "",
          color: item.color || "",
          location: item.location || "",
          latitude:
            item.latitude !== null &&
            item.latitude !== undefined
              ? item.latitude
              : "",
          longitude:
            item.longitude !== null &&
            item.longitude !== undefined
              ? item.longitude
              : "",
          date: item.date
            ? new Date(item.date).toISOString().split("T")[0]
            : "",
        });

        setCurrentImage(item.image || "");
      } catch (error) {
        console.error(
          "Fetch item error:",
          error.response?.data || error.message
        );

        setError(
          error.response?.data?.message ||
            "Failed to load item"
        );
      } finally {
        setLoading(false);
      }
    };

    fetchItem();
  }, [id]);

  // ======================================
  // HANDLE INPUT CHANGE
  // ======================================
  const handleChange = (e) => {
    const { name, value } = e.target;

    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  // ======================================
  // HANDLE IMAGE CHANGE
  // ======================================
  const handleImageChange = (e) => {
    const file = e.target.files?.[0];

    if (!file) {
      return;
    }

    // Allow only image files
    if (!file.type.startsWith("image/")) {
      setError("Please select a valid image file.");
      setNewImage(null);
      return;
    }

    // Maximum 5 MB
    if (file.size > 5 * 1024 * 1024) {
      setError("Image size must be less than 5 MB.");
      setNewImage(null);
      return;
    }

    setError("");
    setNewImage(file);
  };

  // ======================================
  // UPDATE ITEM
  // ======================================
  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      setUpdating(true);
      setError("");

      // FormData is required because image can be uploaded
      const data = new FormData();

      data.append("title", formData.title);
      data.append("description", formData.description);
      data.append("category", formData.category);
      data.append("color", formData.color);
      data.append("location", formData.location);

      data.append(
        "latitude",
        formData.latitude === ""
          ? ""
          : Number(formData.latitude)
      );

      data.append(
        "longitude",
        formData.longitude === ""
          ? ""
          : Number(formData.longitude)
      );

      data.append("date", formData.date);

      // Add new image only if selected
      if (newImage) {
        data.append("image", newImage);
      }

      const response = await API.put(
        `/items/${id}`,
        data
      );

      console.log("Update response:", response.data);

      alert("Item updated successfully!");

      navigate(`/item/${id}`);
    } catch (error) {
      console.error(
        "Update item error:",
        error.response?.data || error.message
      );

      setError(
        error.response?.data?.message ||
          "Failed to update item"
      );
    } finally {
      setUpdating(false);
    }
  };

  // ======================================
  // LOADING
  // ======================================
  if (loading) {
    return (
      <div className="min-h-screen bg-gray-100 flex items-center justify-center">
        <p className="text-gray-600 text-lg">
          Loading item...
        </p>
      </div>
    );
  }

  // ======================================
  // ERROR
  // ======================================
  if (error && !formData.title) {
    return (
      <div className="min-h-screen bg-gray-100 flex items-center justify-center px-4">
        <div className="bg-white p-8 rounded-xl shadow-md text-center">
          <h2 className="text-xl font-bold text-red-600 mb-3">
            Error
          </h2>

          <p className="text-gray-600 mb-5">
            {error}
          </p>

          <button
            onClick={() => navigate("/dashboard")}
            className="bg-blue-600 text-white px-5 py-2 rounded-lg hover:bg-blue-700"
          >
            Back to Dashboard
          </button>
        </div>
      </div>
    );
  }

  // ======================================
  // IMAGE URL
  // ======================================
  const getImageUrl = (image) => {
    if (!image) return "";

    if (
      image.startsWith("http://") ||
      image.startsWith("https://")
    ) {
      return image;
    }

    return "http://localhost:5000" + image;
  };

  return (
    <div className="min-h-screen bg-gray-100 py-10 px-4">
      <div className="max-w-2xl mx-auto">

        {/* Back Button */}
        <button
          onClick={() => navigate(`/item/${id}`)}
          className="mb-6 text-blue-600 hover:text-blue-800 font-medium"
        >
          ← Back to Item
        </button>

        {/* Form Card */}
        <div className="bg-white rounded-xl shadow-md p-8">

          <h1 className="text-3xl font-bold text-gray-800 mb-2">
            Edit Item
          </h1>

          <p className="text-gray-500 mb-8">
            Update your lost or found item details.
          </p>

          {/* Error */}
          {error && (
            <div className="bg-red-100 text-red-700 p-3 rounded-lg mb-6">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-5">

            {/* Current Image */}
            <div>
              <label className="block font-semibold text-gray-700 mb-2">
                Current Image
              </label>

              {currentImage ? (
                <img
                  src={getImageUrl(currentImage)}
                  alt={formData.title || "Current item"}
                  className="w-full h-64 object-contain rounded-lg bg-gray-100 border border-gray-200"
                  onError={(e) => {
                    e.currentTarget.style.display = "none";
                  }}
                />
              ) : (
                <div className="w-full h-64 bg-gray-200 rounded-lg flex items-center justify-center">
                  <span className="text-gray-500">
                    No Image Available
                  </span>
                </div>
              )}
            </div>

            {/* New Image */}
            <div>
              <label className="block font-semibold text-gray-700 mb-2">
                Change Image
              </label>

              <input
                type="file"
                accept="image/jpeg,image/jpg,image/png,image/webp"
                onChange={handleImageChange}
                className="w-full border border-gray-300 rounded-lg px-4 py-3"
              />

              <p className="text-sm text-gray-500 mt-2">
                JPG, JPEG, PNG or WEBP. Maximum size: 5 MB.
              </p>

              {/* New Image Preview */}
              {newImage && (
                <div className="mt-4">
                  <p className="text-sm font-semibold text-gray-700 mb-2">
                    New Image Preview
                  </p>

                  <img
                    src={URL.createObjectURL(newImage)}
                    alt="New preview"
                    className="w-full h-64 object-contain rounded-lg bg-gray-100 border border-gray-200"
                  />
                </div>
              )}
            </div>

            {/* Title */}
            <div>
              <label className="block font-semibold text-gray-700 mb-2">
                Title
              </label>

              <input
                type="text"
                name="title"
                value={formData.title}
                onChange={handleChange}
                required
                className="w-full border border-gray-300 rounded-lg px-4 py-3 outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>

            {/* Description */}
            <div>
              <label className="block font-semibold text-gray-700 mb-2">
                Description
              </label>

              <textarea
                name="description"
                value={formData.description}
                onChange={handleChange}
                required
                rows="4"
                className="w-full border border-gray-300 rounded-lg px-4 py-3 outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>

            {/* Category */}
            <div>
              <label className="block font-semibold text-gray-700 mb-2">
                Category
              </label>

              <input
                type="text"
                name="category"
                value={formData.category}
                onChange={handleChange}
                required
                className="w-full border border-gray-300 rounded-lg px-4 py-3 outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>

            {/* Color */}
            <div>
              <label className="block font-semibold text-gray-700 mb-2">
                Color
              </label>

              <input
                type="text"
                name="color"
                value={formData.color}
                onChange={handleChange}
                className="w-full border border-gray-300 rounded-lg px-4 py-3 outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>

            {/* Location */}
            <div>
              <label className="block font-semibold text-gray-700 mb-2">
                Location
              </label>

              <input
                type="text"
                name="location"
                value={formData.location}
                onChange={handleChange}
                required
                className="w-full border border-gray-300 rounded-lg px-4 py-3 outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>

            {/* Latitude */}
            <div>
              <label className="block font-semibold text-gray-700 mb-2">
                Latitude
              </label>

              <input
                type="number"
                step="any"
                name="latitude"
                value={formData.latitude}
                onChange={handleChange}
                className="w-full border border-gray-300 rounded-lg px-4 py-3 outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>

            {/* Longitude */}
            <div>
              <label className="block font-semibold text-gray-700 mb-2">
                Longitude
              </label>

              <input
                type="number"
                step="any"
                name="longitude"
                value={formData.longitude}
                onChange={handleChange}
                className="w-full border border-gray-300 rounded-lg px-4 py-3 outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>

            {/* Date */}
            <div>
              <label className="block font-semibold text-gray-700 mb-2">
                Date
              </label>

              <input
                type="date"
                name="date"
                value={formData.date}
                onChange={handleChange}
                required
                className="w-full border border-gray-300 rounded-lg px-4 py-3 outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>

            {/* Buttons */}
            <div className="flex gap-4 pt-4">

              <button
                type="button"
                onClick={() => navigate(`/item/${id}`)}
                disabled={updating}
                className="w-1/2 bg-gray-500 text-white py-3 rounded-lg font-semibold hover:bg-gray-600 transition disabled:bg-gray-400"
              >
                Cancel
              </button>

              <button
                type="submit"
                disabled={updating}
                className="w-1/2 bg-blue-600 text-white py-3 rounded-lg font-semibold hover:bg-blue-700 transition disabled:bg-gray-400"
              >
                {updating
                  ? "Updating..."
                  : "Update Item"}
              </button>

            </div>

          </form>
        </div>
      </div>
    </div>
  );
}

export default EditItem;

