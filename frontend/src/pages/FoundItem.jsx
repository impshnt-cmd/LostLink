import { useState } from "react";
import API from "../api/api";

function FoundItem() {
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

      data.append("type", "found");
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

      const response = await API.post(
        "/items",
        data
      );

      console.log(
        "Found Item Response:",
        response.data
      );

      setMessage(
        "Found item reported successfully!"
      );

      // Reset form
      setFormData({
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

      const fileInput =
        document.getElementById("found-item-image");

      if (fileInput) {
        fileInput.value = "";
      }
    } catch (error) {
      console.error(
        "Found Item Error:",
        error.response?.data || error.message
      );

      setMessage(
        error.response?.data?.message ||
          "Failed to report found item"
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="relative min-h-screen overflow-hidden bg-[#050816] text-white">

      {/* ======================================
          BACKGROUND AURORA
      ====================================== */}
      <div className="pointer-events-none absolute inset-0 overflow-hidden">
        <div className="absolute -left-32 -top-32 h-96 w-96 rounded-full bg-emerald-500/20 blur-3xl" />

        <div className="absolute right-[-120px] top-20 h-[420px] w-[420px] rounded-full bg-cyan-500/15 blur-3xl" />

        <div className="absolute bottom-[-180px] left-1/3 h-[420px] w-[420px] rounded-full bg-teal-500/10 blur-3xl" />
      </div>

      {/* ======================================
          MAIN CONTENT
      ====================================== */}
      <div className="relative z-10 px-4 py-10 sm:px-6 lg:px-8">

        <div className="mx-auto max-w-4xl">

          {/* ======================================
              HEADER
          ====================================== */}
          <div className="mb-8 text-center">

            <div className="mb-4 inline-flex items-center gap-2 rounded-full border border-emerald-400/20 bg-emerald-400/10 px-4 py-2 text-sm font-semibold text-emerald-300 backdrop-blur-xl">
              <span className="flex h-2 w-2 rounded-full bg-emerald-400 shadow-[0_0_12px_rgba(52,211,153,0.9)]" />

              FOUND ITEM
            </div>

            <h1 className="text-4xl font-black tracking-tight sm:text-5xl">
              Report a{" "}
              <span className="bg-gradient-to-r from-emerald-300 via-teal-300 to-cyan-300 bg-clip-text text-transparent">
                Found Item
              </span>
            </h1>

            <p className="mx-auto mt-4 max-w-2xl text-sm leading-6 text-slate-400 sm:text-base">
              Help someone get their belongings back.
              Provide accurate details about the item you
              found so the owner can identify and claim it.
            </p>

          </div>

          {/* ======================================
              MAIN CARD
          ====================================== */}
          <div className="overflow-hidden rounded-3xl border border-white/10 bg-white/[0.055] shadow-2xl shadow-black/30 backdrop-blur-2xl">

            {/* TOP GRADIENT */}
            <div className="h-1.5 bg-gradient-to-r from-emerald-400 via-teal-400 to-cyan-400" />

            <div className="p-6 sm:p-8 lg:p-10">

              <form onSubmit={handleSubmit}>

                {/* ======================================
                    BASIC DETAILS
                ====================================== */}
                <div className="mb-10">

                  <div className="mb-6 flex items-center gap-4">

                    <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-emerald-400/10 text-xl">
                      🔎
                    </div>

                    <div>
                      <h2 className="text-xl font-bold text-white">
                        Item Details
                      </h2>

                      <p className="text-sm text-slate-400">
                        Tell us about the item you found.
                      </p>
                    </div>

                  </div>

                  {/* TITLE */}
                  <div className="mb-6">
                    <label className="mb-2 block text-sm font-semibold text-slate-200">
                      Item Title
                    </label>

                    <input
                      type="text"
                      name="title"
                      value={formData.title}
                      onChange={handleChange}
                      placeholder="Example: Black Wallet"
                      className="w-full rounded-2xl border border-white/10 bg-black/20 px-4 py-3.5 text-white outline-none transition placeholder:text-slate-600 focus:border-emerald-400/50 focus:bg-black/30 focus:ring-2 focus:ring-emerald-400/10"
                      required
                    />
                  </div>

                  {/* DESCRIPTION */}
                  <div className="mb-6">
                    <label className="mb-2 block text-sm font-semibold text-slate-200">
                      Description
                    </label>

                    <textarea
                      name="description"
                      value={formData.description}
                      onChange={handleChange}
                      placeholder="Describe the found item, its condition, unique marks, stickers, scratches, etc."
                      rows="5"
                      className="w-full resize-none rounded-2xl border border-white/10 bg-black/20 px-4 py-3.5 text-white outline-none transition placeholder:text-slate-600 focus:border-emerald-400/50 focus:bg-black/30 focus:ring-2 focus:ring-emerald-400/10"
                      required
                    />
                  </div>

                  {/* CATEGORY + COLOR */}
                  <div className="grid gap-6 md:grid-cols-2">

                    <div>
                      <label className="mb-2 block text-sm font-semibold text-slate-200">
                        Category
                      </label>

                      <input
                        type="text"
                        name="category"
                        value={formData.category}
                        onChange={handleChange}
                        placeholder="Example: Wallet"
                        className="w-full rounded-2xl border border-white/10 bg-black/20 px-4 py-3.5 text-white outline-none transition placeholder:text-slate-600 focus:border-emerald-400/50 focus:ring-2 focus:ring-emerald-400/10"
                        required
                      />
                    </div>

                    <div>
                      <label className="mb-2 block text-sm font-semibold text-slate-200">
                        Color
                      </label>

                      <input
                        type="text"
                        name="color"
                        value={formData.color}
                        onChange={handleChange}
                        placeholder="Example: Black"
                        className="w-full rounded-2xl border border-white/10 bg-black/20 px-4 py-3.5 text-white outline-none transition placeholder:text-slate-600 focus:border-emerald-400/50 focus:ring-2 focus:ring-emerald-400/10"
                      />
                    </div>

                  </div>

                </div>

                {/* ======================================
                    LOCATION
                ====================================== */}
                <div className="mb-10">

                  <div className="mb-6 flex items-center gap-4">

                    <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-cyan-400/10 text-xl">
                      📍
                    </div>

                    <div>
                      <h2 className="text-xl font-bold text-white">
                        Found Location
                      </h2>

                      <p className="text-sm text-slate-400">
                        Where did you find this item?
                      </p>
                    </div>

                  </div>

                  {/* LOCATION */}
                  <div className="mb-6">

                    <label className="mb-2 block text-sm font-semibold text-slate-200">
                      Location
                    </label>

                    <input
                      type="text"
                      name="location"
                      value={formData.location}
                      onChange={handleChange}
                      placeholder="Example: College Parking"
                      className="w-full rounded-2xl border border-white/10 bg-black/20 px-4 py-3.5 text-white outline-none transition placeholder:text-slate-600 focus:border-cyan-400/50 focus:ring-2 focus:ring-cyan-400/10"
                      required
                    />

                  </div>

                  {/* COORDINATES */}
                  <div className="grid gap-6 md:grid-cols-2">

                    <div>
                      <label className="mb-2 block text-sm font-semibold text-slate-200">
                        Latitude
                      </label>

                      <input
                        type="number"
                        step="any"
                        name="latitude"
                        value={formData.latitude}
                        onChange={handleChange}
                        placeholder="28.6139"
                        className="w-full rounded-2xl border border-white/10 bg-black/20 px-4 py-3.5 text-white outline-none transition placeholder:text-slate-600 focus:border-cyan-400/50 focus:ring-2 focus:ring-cyan-400/10"
                      />
                    </div>

                    <div>
                      <label className="mb-2 block text-sm font-semibold text-slate-200">
                        Longitude
                      </label>

                      <input
                        type="number"
                        step="any"
                        name="longitude"
                        value={formData.longitude}
                        onChange={handleChange}
                        placeholder="77.2090"
                        className="w-full rounded-2xl border border-white/10 bg-black/20 px-4 py-3.5 text-white outline-none transition placeholder:text-slate-600 focus:border-cyan-400/50 focus:ring-2 focus:ring-cyan-400/10"
                      />
                    </div>

                  </div>

                </div>

                {/* ======================================
                    DATE
                ====================================== */}
                <div className="mb-10">

                  <div className="mb-3 flex items-center gap-2">
                    <span className="text-lg">🗓️</span>

                    <label className="text-sm font-semibold text-slate-200">
                      Date & Time Found
                    </label>
                  </div>

                  <input
                    type="datetime-local"
                    name="date"
                    value={formData.date}
                    onChange={handleChange}
                    className="w-full rounded-2xl border border-white/10 bg-black/20 px-4 py-3.5 text-white outline-none transition focus:border-emerald-400/50 focus:ring-2 focus:ring-emerald-400/10"
                    required
                  />

                </div>

                {/* ======================================
                    IMAGE UPLOAD
                ====================================== */}
                <div className="mb-10">

                  <div className="mb-5 flex items-center gap-4">

                    <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-purple-400/10 text-xl">
                      📷
                    </div>

                    <div>
                      <h2 className="text-xl font-bold text-white">
                        Item Image
                      </h2>

                      <p className="text-sm text-slate-400">
                        Add a clear photo to help identify the item.
                      </p>
                    </div>

                  </div>

                  {/* UPLOAD BOX */}
                  <label
                    htmlFor="found-item-image"
                    className="group flex cursor-pointer flex-col items-center justify-center rounded-3xl border border-dashed border-white/15 bg-black/20 px-6 py-10 text-center transition hover:border-emerald-400/40 hover:bg-emerald-400/[0.03]"
                  >

                    <div className="mb-4 flex h-16 w-16 items-center justify-center rounded-2xl bg-gradient-to-br from-emerald-400/20 to-cyan-400/20 text-3xl transition group-hover:scale-110">
                      ⬆️
                    </div>

                    <h3 className="font-semibold text-white">
                      Click to upload image
                    </h3>

                    <p className="mt-2 text-sm text-slate-500">
                      JPG, JPEG, PNG or WEBP
                    </p>

                    <p className="mt-1 text-xs text-slate-600">
                      Maximum file size: 5 MB
                    </p>

                    <input
                      id="found-item-image"
                      type="file"
                      accept="image/jpeg,image/jpg,image/png,image/webp"
                      onChange={handleImageChange}
                      className="hidden"
                    />

                  </label>

                  {/* IMAGE PREVIEW */}
                  {imagePreview && (
                    <div className="mt-6 overflow-hidden rounded-3xl border border-white/10 bg-black/20">

                      <div className="flex items-center justify-between border-b border-white/10 px-5 py-4">

                        <div>
                          <p className="font-semibold text-white">
                            Image Preview
                          </p>

                          <p className="text-xs text-slate-500">
                            Uploaded item photo
                          </p>
                        </div>

                        <span className="rounded-full bg-emerald-400/10 px-3 py-1 text-xs font-semibold text-emerald-300">
                          Ready
                        </span>

                      </div>

                      <div className="p-4">
                        <img
                          src={imagePreview}
                          alt="Found item preview"
                          className="max-h-96 w-full rounded-2xl object-contain"
                        />
                      </div>

                    </div>
                  )}

                </div>

                {/* ======================================
                    INFO BOX
                ====================================== */}
                <div className="mb-8 rounded-2xl border border-emerald-400/10 bg-emerald-400/[0.04] p-5">

                  <div className="flex gap-4">

                    <div className="text-xl">
                      💚
                    </div>

                    <div>
                      <h3 className="font-semibold text-emerald-300">
                        You're helping someone
                      </h3>

                      <p className="mt-1 text-sm leading-6 text-slate-400">
                        Accurate information increases the
                        chances of matching this item with its
                        rightful owner.
                      </p>
                    </div>

                  </div>

                </div>

                {/* ======================================
                    MESSAGE
                ====================================== */}
                {message && (
                  <div
                    className={`mb-6 rounded-2xl border px-5 py-4 text-sm ${
                      message.toLowerCase().includes("success")
                        ? "border-emerald-400/20 bg-emerald-400/10 text-emerald-300"
                        : "border-red-400/20 bg-red-400/10 text-red-300"
                    }`}
                  >
                    {message}
                  </div>
                )}

                {/* ======================================
                    SUBMIT BUTTON
                ====================================== */}
                <button
                  type="submit"
                  disabled={loading}
                  className="group relative w-full overflow-hidden rounded-2xl bg-gradient-to-r from-emerald-500 via-teal-500 to-cyan-500 px-6 py-4 font-bold text-white shadow-lg shadow-emerald-500/20 transition duration-300 hover:scale-[1.01] hover:shadow-emerald-500/30 disabled:cursor-not-allowed disabled:opacity-50"
                >

                  <span className="relative z-10 flex items-center justify-center gap-3">

                    {loading ? (
                      <>
                        <span className="h-5 w-5 animate-spin rounded-full border-2 border-white/30 border-t-white" />
                        Submitting...
                      </>
                    ) : (
                      <>
                        <span>✓</span>
                        Report Found Item
                      </>
                    )}

                  </span>

                  <div className="absolute inset-0 -translate-x-full bg-white/10 transition duration-700 group-hover:translate-x-full" />

                </button>

              </form>

            </div>
          </div>

          {/* ======================================
              BOTTOM FEATURES
          ====================================== */}
          <div className="mt-8 grid gap-4 sm:grid-cols-3">

            <div className="rounded-2xl border border-white/10 bg-white/[0.04] p-5 text-center backdrop-blur-xl">
              <div className="mb-2 text-2xl">🔐</div>

              <h3 className="font-semibold text-white">
                Safe & Secure
              </h3>

              <p className="mt-1 text-xs leading-5 text-slate-500">
                Your information is handled securely.
              </p>
            </div>

            <div className="rounded-2xl border border-white/10 bg-white/[0.04] p-5 text-center backdrop-blur-xl">
              <div className="mb-2 text-2xl">🤝</div>

              <h3 className="font-semibold text-white">
                Community Driven
              </h3>

              <p className="mt-1 text-xs leading-5 text-slate-500">
                Help connect lost items with their owners.
              </p>
            </div>

            <div className="rounded-2xl border border-white/10 bg-white/[0.04] p-5 text-center backdrop-blur-xl">
              <div className="mb-2 text-2xl">⚡</div>

              <h3 className="font-semibold text-white">
                Fast Matching
              </h3>

              <p className="mt-1 text-xs leading-5 text-slate-500">
                Smart matching helps identify potential owners.
              </p>
            </div>

          </div>

          {/* ======================================
              FOOTER
          ====================================== */}
          <div className="mt-10 pb-4 text-center">

            <p className="text-xs text-slate-600">
              LostLink • Find what you lost. Return what you found.
            </p>

          </div>

        </div>
      </div>
    </div>
  );
}

export default FoundItem;