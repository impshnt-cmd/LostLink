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

    if (message) {
      setMessage("");
    }
  };

  // ======================================
  // HANDLE IMAGE
  // ======================================
  const handleImageChange = (e) => {
    const file = e.target.files?.[0];

    if (!file) return;

    const allowedTypes = [
      "image/jpeg",
      "image/jpg",
      "image/png",
      "image/webp",
    ];

    if (!allowedTypes.includes(file.type)) {
      setMessage(
        "Only JPG, JPEG, PNG and WEBP images are allowed."
      );

      e.target.value = "";
      return;
    }

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

      if (image) {
        data.append("image", image);
      }

      const response = await API.post("/items", data);

      console.log(
        "Lost Item Response:",
        response.data
      );

      setMessage(
        response.data.message ||
          "Lost item created successfully"
      );

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

      // Reset file input
      const fileInput =
        document.getElementById("lost-item-image");

      if (fileInput) {
        fileInput.value = "";
      }
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
    <div className="min-h-screen bg-[#050816] text-white relative overflow-hidden">

      {/* ======================================
          AURORA BACKGROUND
      ====================================== */}
      <div className="fixed inset-0 pointer-events-none overflow-hidden">

        <div className="absolute w-[550px] h-[550px] bg-violet-600/15 blur-[150px] rounded-full -top-48 -left-48" />

        <div className="absolute w-[500px] h-[500px] bg-red-500/8 blur-[150px] rounded-full top-[30%] -right-48" />

        <div className="absolute w-[450px] h-[450px] bg-cyan-500/8 blur-[140px] rounded-full bottom-0 left-[30%]" />

      </div>

      {/* ======================================
          MAIN
      ====================================== */}
      <main className="relative max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8">

        {/* ==================================
            HEADER
        ================================== */}
        <div className="mb-8">

          <div className="flex items-start gap-4">

            <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-red-500/20 to-violet-500/20 border border-red-400/15 flex items-center justify-center text-2xl shadow-lg">
              🔎
            </div>

            <div>
              <div className="flex flex-wrap items-center gap-3">

                <h1 className="text-3xl sm:text-4xl font-black tracking-tight">
                  Report Lost Item
                </h1>

                <span className="px-3 py-1 rounded-full bg-red-500/10 border border-red-400/20 text-red-300 text-[10px] font-bold tracking-wider">
                  LOST
                </span>

              </div>

              <p className="text-white/40 text-sm sm:text-base mt-2 max-w-2xl">
                Tell the LostLink community what you lost.
                Accurate details increase the chance of finding it.
              </p>
            </div>

          </div>
        </div>

        {/* ==================================
            MAIN FORM CARD
        ================================== */}
        <div className="rounded-[28px] border border-white/10 bg-white/[0.045] backdrop-blur-2xl shadow-2xl overflow-hidden">

          {/* CARD HEADER */}
          <div className="px-6 sm:px-8 lg:px-10 py-6 border-b border-white/10 bg-white/[0.02]">

            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">

              <div>
                <h2 className="text-lg font-bold">
                  Lost Item Information
                </h2>

                <p className="text-xs text-white/35 mt-1">
                  Provide as much information as possible.
                </p>
              </div>

              <div className="flex items-center gap-2 self-start sm:self-auto px-3 py-2 rounded-xl bg-red-500/10 border border-red-400/10">
                <span className="w-1.5 h-1.5 rounded-full bg-red-400 animate-pulse" />

                <span className="text-xs text-red-300">
                  Lost Report
                </span>
              </div>

            </div>
          </div>

          {/* FORM */}
          <form
            onSubmit={handleSubmit}
            className="p-6 sm:p-8 lg:p-10"
          >

            {/* ==================================
                MESSAGE
            ================================== */}
            {message && (
              <div
                className={`mb-7 rounded-2xl border p-4 flex items-start gap-3 ${
                  message.toLowerCase().includes("success")
                    ? "bg-emerald-500/10 border-emerald-400/20"
                    : "bg-red-500/10 border-red-400/20"
                }`}
              >

                <div className="text-lg">
                  {message
                    .toLowerCase()
                    .includes("success")
                    ? "✓"
                    : "⚠️"}
                </div>

                <div>
                  <p
                    className={`text-sm font-semibold ${
                      message
                        .toLowerCase()
                        .includes("success")
                        ? "text-emerald-300"
                        : "text-red-300"
                    }`}
                  >
                    {message}
                  </p>
                </div>

              </div>
            )}

            {/* ==================================
                BASIC DETAILS
            ================================== */}
            <section className="mb-10">

              <div className="flex items-center gap-3 mb-6">

                <div className="w-9 h-9 rounded-xl bg-violet-500/10 border border-violet-400/10 flex items-center justify-center">
                  📝
                </div>

                <div>
                  <h3 className="font-bold">
                    Basic Details
                  </h3>

                  <p className="text-xs text-white/35">
                    Describe the item you lost.
                  </p>
                </div>

              </div>

              <div className="space-y-5">

                {/* TITLE */}
                <div>
                  <label className="block text-sm font-semibold text-white/70 mb-2">
                    Item Title
                  </label>

                  <input
                    type="text"
                    name="title"
                    value={formData.title}
                    onChange={handleChange}
                    placeholder="Example: Black Wallet"
                    required
                    className="w-full px-4 py-3.5 rounded-xl bg-white/[0.045] border border-white/10 text-white placeholder:text-white/20 outline-none focus:border-violet-400/50 focus:ring-4 focus:ring-violet-500/10 transition-all"
                  />
                </div>

                {/* DESCRIPTION */}
                <div>
                  <label className="block text-sm font-semibold text-white/70 mb-2">
                    Description
                  </label>

                  <textarea
                    name="description"
                    value={formData.description}
                    onChange={handleChange}
                    placeholder="Describe the item, identifying marks, brand, size, contents, etc."
                    rows="5"
                    required
                    className="w-full px-4 py-3.5 rounded-xl bg-white/[0.045] border border-white/10 text-white placeholder:text-white/20 outline-none focus:border-violet-400/50 focus:ring-4 focus:ring-violet-500/10 transition-all resize-none"
                  />

                  <p className="text-[11px] text-white/25 mt-2">
                    Tip: Include unique details that can help identify your item.
                  </p>
                </div>

                {/* CATEGORY + COLOR */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">

                  {/* CATEGORY */}
                  <div>
                    <label className="block text-sm font-semibold text-white/70 mb-2">
                      Category
                    </label>

                    <input
                      type="text"
                      name="category"
                      value={formData.category}
                      onChange={handleChange}
                      placeholder="Example: Wallet"
                      required
                      className="w-full px-4 py-3.5 rounded-xl bg-white/[0.045] border border-white/10 text-white placeholder:text-white/20 outline-none focus:border-violet-400/50 focus:ring-4 focus:ring-violet-500/10 transition-all"
                    />
                  </div>

                  {/* COLOR */}
                  <div>
                    <label className="block text-sm font-semibold text-white/70 mb-2">
                      Color
                    </label>

                    <input
                      type="text"
                      name="color"
                      value={formData.color}
                      onChange={handleChange}
                      placeholder="Example: Black"
                      className="w-full px-4 py-3.5 rounded-xl bg-white/[0.045] border border-white/10 text-white placeholder:text-white/20 outline-none focus:border-violet-400/50 focus:ring-4 focus:ring-violet-500/10 transition-all"
                    />
                  </div>

                </div>
              </div>
            </section>

            {/* ==================================
                LOCATION DETAILS
            ================================== */}
            <section className="mb-10">

              <div className="flex items-center gap-3 mb-6">

                <div className="w-9 h-9 rounded-xl bg-cyan-500/10 border border-cyan-400/10 flex items-center justify-center">
                  📍
                </div>

                <div>
                  <h3 className="font-bold">
                    Location Details
                  </h3>

                  <p className="text-xs text-white/35">
                    Where did you lose the item?
                  </p>
                </div>

              </div>

              <div className="space-y-5">

                {/* LOCATION */}
                <div>
                  <label className="block text-sm font-semibold text-white/70 mb-2">
                    Location
                  </label>

                  <input
                    type="text"
                    name="location"
                    value={formData.location}
                    onChange={handleChange}
                    placeholder="Example: College Main Gate"
                    required
                    className="w-full px-4 py-3.5 rounded-xl bg-white/[0.045] border border-white/10 text-white placeholder:text-white/20 outline-none focus:border-cyan-400/40 focus:ring-4 focus:ring-cyan-500/10 transition-all"
                  />
                </div>

                {/* COORDINATES */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">

                  <div>
                    <label className="block text-sm font-semibold text-white/70 mb-2">
                      Latitude
                    </label>

                    <input
                      type="number"
                      step="any"
                      name="latitude"
                      value={formData.latitude}
                      onChange={handleChange}
                      placeholder="Example: 28.6139"
                      className="w-full px-4 py-3.5 rounded-xl bg-white/[0.045] border border-white/10 text-white placeholder:text-white/20 outline-none focus:border-cyan-400/40 focus:ring-4 focus:ring-cyan-500/10 transition-all"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-semibold text-white/70 mb-2">
                      Longitude
                    </label>

                    <input
                      type="number"
                      step="any"
                      name="longitude"
                      value={formData.longitude}
                      onChange={handleChange}
                      placeholder="Example: 77.2090"
                      className="w-full px-4 py-3.5 rounded-xl bg-white/[0.045] border border-white/10 text-white placeholder:text-white/20 outline-none focus:border-cyan-400/40 focus:ring-4 focus:ring-cyan-500/10 transition-all"
                    />
                  </div>

                </div>

                <div className="rounded-xl bg-cyan-500/[0.05] border border-cyan-400/10 px-4 py-3">
                  <p className="text-xs text-cyan-200/50">
                    📍 Coordinates are optional. They can help with
                    location-based matching.
                  </p>
                </div>

              </div>
            </section>

            {/* ==================================
                DATE
            ================================== */}
            <section className="mb-10">

              <div className="flex items-center gap-3 mb-6">

                <div className="w-9 h-9 rounded-xl bg-amber-500/10 border border-amber-400/10 flex items-center justify-center">
                  📅
                </div>

                <div>
                  <h3 className="font-bold">
                    When Did You Lose It?
                  </h3>

                  <p className="text-xs text-white/35">
                    Enter the date and time as accurately as possible.
                  </p>
                </div>

              </div>

              <input
                type="datetime-local"
                name="date"
                value={formData.date}
                onChange={handleChange}
                required
                className="w-full px-4 py-3.5 rounded-xl bg-white/[0.045] border border-white/10 text-white outline-none focus:border-amber-400/40 focus:ring-4 focus:ring-amber-500/10 transition-all"
              />
            </section>

            {/* ==================================
                IMAGE UPLOAD
            ================================== */}
            <section className="mb-10">

              <div className="flex items-center gap-3 mb-6">

                <div className="w-9 h-9 rounded-xl bg-pink-500/10 border border-pink-400/10 flex items-center justify-center">
                  🖼️
                </div>

                <div>
                  <h3 className="font-bold">
                    Item Image
                  </h3>

                  <p className="text-xs text-white/35">
                    Add a clear photo to improve identification.
                  </p>
                </div>

              </div>

              {/* UPLOAD */}
              <label className="group block cursor-pointer">

                <div className="rounded-2xl border border-dashed border-white/15 bg-white/[0.025] hover:bg-white/[0.05] hover:border-violet-400/30 transition-all p-8 text-center">

                  <div className="w-16 h-16 mx-auto rounded-2xl bg-gradient-to-br from-violet-500/15 to-pink-500/15 border border-violet-400/10 flex items-center justify-center text-2xl mb-4 group-hover:scale-105 transition-transform">
                    📤
                  </div>

                  <p className="font-semibold text-white/80">
                    Click to upload an image
                  </p>

                  <p className="text-xs text-white/35 mt-2">
                    JPG, JPEG, PNG or WEBP
                  </p>

                  <p className="text-[11px] text-white/25 mt-1">
                    Maximum file size: 5 MB
                  </p>

                  <input
                    id="lost-item-image"
                    type="file"
                    accept="image/jpeg,image/jpg,image/png,image/webp"
                    onChange={handleImageChange}
                    className="hidden"
                  />

                </div>
              </label>

              {/* PREVIEW */}
              {imagePreview && (
                <div className="mt-5">

                  <div className="flex items-center justify-between gap-3 mb-3">

                    <p className="text-sm font-semibold text-white/70">
                      Image Preview
                    </p>

                    <span className="px-3 py-1 rounded-full bg-emerald-500/10 border border-emerald-400/10 text-emerald-300 text-[10px] font-bold">
                      READY
                    </span>

                  </div>

                  <div className="rounded-2xl overflow-hidden border border-violet-400/20 bg-black/20">

                    <img
                      src={imagePreview}
                      alt="Lost item preview"
                      className="w-full h-64 sm:h-80 object-contain"
                    />

                  </div>

                </div>
              )}
            </section>

            {/* ==================================
                SUBMIT
            ================================== */}
            <div className="pt-7 border-t border-white/10">

              <button
                type="submit"
                disabled={loading}
                className="w-full py-4 rounded-xl bg-gradient-to-r from-violet-600 via-indigo-600 to-blue-600 hover:from-violet-500 hover:via-indigo-500 hover:to-blue-500 shadow-xl shadow-violet-600/20 font-bold text-base transition-all disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {loading ? (
                  <span className="flex items-center justify-center gap-3">

                    <span className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />

                    Reporting Lost Item...

                  </span>
                ) : (
                  "🔎 Report Lost Item"
                )}
              </button>

              <p className="text-center text-xs text-white/25 mt-4">
                By submitting this report, you help the LostLink
                community reunite lost items with their owners.
              </p>

            </div>

          </form>
        </div>

        {/* ======================================
            INFO CARDS
        ====================================== */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mt-6">

          <div className="rounded-2xl border border-white/10 bg-white/[0.035] p-5">
            <div className="text-xl mb-3">
              ⚡
            </div>

            <h3 className="font-semibold text-sm">
              Fast Matching
            </h3>

            <p className="text-xs text-white/35 mt-1.5 leading-5">
              Your report can be compared with existing found reports.
            </p>
          </div>

          <div className="rounded-2xl border border-white/10 bg-white/[0.035] p-5">
            <div className="text-xl mb-3">
              🔐
            </div>

            <h3 className="font-semibold text-sm">
              Secure Reports
            </h3>

            <p className="text-xs text-white/35 mt-1.5 leading-5">
              Your report is securely stored in the LostLink platform.
            </p>
          </div>

          <div className="rounded-2xl border border-white/10 bg-white/[0.035] p-5">
            <div className="text-xl mb-3">
              🤝
            </div>

            <h3 className="font-semibold text-sm">
              Community Powered
            </h3>

            <p className="text-xs text-white/35 mt-1.5 leading-5">
              More reports mean more chances of successful recovery.
            </p>
          </div>

        </div>

        {/* ======================================
            FOOTER
        ====================================== */}
        <footer className="py-8 text-center">

          <p className="text-xs text-white/25">
            © {new Date().getFullYear()} LostLink ·
            AI Powered Lost & Found Platform
          </p>

        </footer>

      </main>
    </div>
  );
}

export default LostItem;