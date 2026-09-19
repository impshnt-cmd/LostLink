import { useState } from "react";
import API from "../api/api";

function CreateLost() {
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    category: "",
    location: "",
    date: "",
    contact: "",
  });

  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    setLoading(true);

    try {
      const payload = {
        type: "lost",
        title: formData.title,
        description: formData.description,
        category: formData.category,
        location: formData.location,
        date: formData.date,
      };

      console.log("Sending data:", payload);

      const response = await API.post("/items", payload);

      console.log("Backend response:", response.data);

      alert("Lost item reported successfully!");

      setFormData({
        title: "",
        description: "",
        category: "",
        location: "",
        date: "",
        contact: "",
      });
    } catch (error) {
      console.error(
        "Create lost item error:",
        error.response?.data || error.message
      );

      alert(
        error.response?.data?.message ||
          "Failed to report lost item"
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 py-10 px-4">
      <div className="max-w-2xl mx-auto bg-white p-8 rounded-xl shadow-md">

        <h1 className="text-3xl font-bold text-gray-800 mb-2">
          Report Lost Item
        </h1>

        <p className="text-gray-500 mb-8">
          Enter the details of your lost item.
        </p>

        <form onSubmit={handleSubmit} className="space-y-5">

          {/* Item Name */}
          <div>
            <label className="block font-medium mb-2">
              Item Name
            </label>

            <input
              type="text"
              name="title"
              value={formData.title}
              onChange={handleChange}
              placeholder="Example: Black Wallet"
              className="w-full border rounded-lg px-4 py-3"
              required
            />
          </div>

          {/* Description */}
          <div>
            <label className="block font-medium mb-2">
              Description
            </label>

            <textarea
              name="description"
              value={formData.description}
              onChange={handleChange}
              placeholder="Describe your lost item..."
              rows="4"
              className="w-full border rounded-lg px-4 py-3"
              required
            />
          </div>

          {/* Category */}
          <div>
            <label className="block font-medium mb-2">
              Category
            </label>

            <select
              name="category"
              value={formData.category}
              onChange={handleChange}
              className="w-full border rounded-lg px-4 py-3"
              required
            >
              <option value="">Select Category</option>
              <option value="Electronics">Electronics</option>
              <option value="Documents">Documents</option>
              <option value="Wallet">Wallet</option>
              <option value="Bag">Bag</option>
              <option value="Keys">Keys</option>
              <option value="Other">Other</option>
            </select>
          </div>

          {/* Location */}
          <div>
            <label className="block font-medium mb-2">
              Lost Location
            </label>

            <input
              type="text"
              name="location"
              value={formData.location}
              onChange={handleChange}
              placeholder="Example: College Campus"
              className="w-full border rounded-lg px-4 py-3"
              required
            />
          </div>

          {/* Date */}
          <div>
            <label className="block font-medium mb-2">
              Lost Date
            </label>

            <input
              type="date"
              name="date"
              value={formData.date}
              onChange={handleChange}
              className="w-full border rounded-lg px-4 py-3"
              required
            />
          </div>

          {/* Contact */}
          <div>
            <label className="block font-medium mb-2">
              Contact Information
            </label>

            <input
              type="text"
              name="contact"
              value={formData.contact}
              onChange={handleChange}
              placeholder="Phone or Email"
              className="w-full border rounded-lg px-4 py-3"
              required
            />
          </div>

          {/* Submit */}
          <button
            type="submit"
            disabled={loading}
            className="w-full bg-blue-600 text-white py-3 rounded-lg font-semibold hover:bg-blue-700 disabled:bg-gray-400"
          >
            {loading ? "Submitting..." : "Submit Lost Item"}
          </button>

        </form>
      </div>
    </div>
  );
}

export default CreateLost;