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
  const [newImagePreview, setNewImagePreview] = useState("");

  const [loading, setLoading] = useState(true);
  const [updating, setUpdating] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

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

    const baseUrl =
      import.meta.env.VITE_API_URL?.replace("/api", "") ||
      "http://localhost:5000";

    return baseUrl + image;
  };

  // ======================================
  // GET ITEM
  // ======================================
  useEffect(() => {
    const fetchItem = async () => {
      try {
        setLoading(true);
        setError("");

        const response = await API.get(`/items/${id}`);

        const item = response.data.item;

        if (!item) {
          throw new Error("Item not found");
        }

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
            ? new Date(item.date)
                .toISOString()
                .split("T")[0]
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
            error.message ||
            "Failed to load item"
        );
      } finally {
        setLoading(false);
      }
    };

    fetchItem();
  }, [id]);

  // ======================================
  // HANDLE INPUT
  // ======================================
  const handleChange = (e) => {
    const { name, value } = e.target;

    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));

    if (error) setError("");
    if (success) setSuccess("");
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
      setError(
        "Only JPG, JPEG, PNG and WEBP images are allowed."
      );
      setNewImage(null);
      setNewImagePreview("");
      e.target.value = "";
      return;
    }

    if (file.size > 5 * 1024 * 1024) {
      setError("Image size must be less than 5 MB.");
      setNewImage(null);
      setNewImagePreview("");
      e.target.value = "";
      return;
    }

    setError("");
    setSuccess("");
    setNewImage(file);

    const previewUrl = URL.createObjectURL(file);
    setNewImagePreview(previewUrl);
  };

  // ======================================
  // UPDATE ITEM
  // ======================================
  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      setUpdating(true);
      setError("");
      setSuccess("");

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

      if (newImage) {
        data.append("image", newImage);
      }

      const response = await API.put(
        `/items/${id}`,
        data
      );

      console.log(
        "Update response:",
        response.data
      );

      setSuccess("Item updated successfully!");

      setTimeout(() => {
        navigate(`/item/${id}`);
      }, 800);
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
      <div className="relative flex min-h-screen items-center justify-center overflow-hidden bg-[#050816] text-white">

        <div className="absolute -left-40 -top-40 h-[500px] w-[500px] rounded-full bg-violet-600/15 blur-[140px]" />

        <div className="absolute -bottom-40 -right-40 h-[500px] w-[500px] rounded-full bg-cyan-500/10 blur-[140px]" />

        <div className="relative text-center">

          <div className="mx-auto mb-5 flex h-16 w-16 items-center justify-center rounded-2xl border border-white/10 bg-white/5 backdrop-blur-xl">

            <div className="h-7 w-7 animate-spin rounded-full border-2 border-violet-400/20 border-t-violet-400" />

          </div>

          <p className="text-sm text-white/50">
            Loading item...
          </p>

        </div>
      </div>
    );
  }

  // ======================================
  // LOAD ERROR
  // ======================================
  if (error && !formData.title) {
    return (
      <div className="relative flex min-h-screen items-center justify-center overflow-hidden bg-[#050816] px-5 text-white">

        <div className="absolute right-0 top-0 h-[500px] w-[500px] rounded-full bg-red-500/10 blur-[140px]" />

        <div className="relative w-full max-w-lg rounded-3xl border border-white/10 bg-white/[0.045] p-8 text-center shadow-2xl backdrop-blur-2xl">

          <div className="mx-auto mb-5 flex h-16 w-16 items-center justify-center rounded-2xl border border-red-400/20 bg-red-500/10 text-3xl">
            ⚠️
          </div>

          <h2 className="mb-3 text-2xl font-bold">
            Unable to Load Item
          </h2>

          <p className="mb-7 text-sm leading-6 text-white/45">
            {error}
          </p>

          <button
            onClick={() => navigate("/dashboard")}
            className="rounded-xl bg-gradient-to-r from-violet-600 to-indigo-600 px-6 py-3 font-semibold transition-all hover:from-violet-500 hover:to-indigo-500"
          >
            ← Back to Dashboard
          </button>

        </div>
      </div>
    );
  }

  return (
    <div className="relative min-h-screen overflow-hidden bg-[#050816] text-white">

      {/* ======================================
          AURORA BACKGROUND
      ====================================== */}
      <div className="pointer-events-none fixed inset-0 overflow-hidden">

        <div className="absolute -left-48 -top-48 h-[550px] w-[550px] rounded-full bg-violet-600/15 blur-[150px]" />

        <div className="absolute -right-48 top-[30%] h-[500px] w-[500px] rounded-full bg-blue-600/10 blur-[150px]" />

        <div className="absolute bottom-0 left-[30%] h-[400px] w-[400px] rounded-full bg-cyan-500/10 blur-[140px]" />

      </div>

      {/* ======================================
          MAIN
      ====================================== */}
      <main className="relative mx-auto max-w-5xl px-4 py-8 sm:px-6 lg:px-8">

        {/* ======================================
            TOP BAR
        ====================================== */}
        <div className="mb-8 flex items-center justify-between gap-4">

          <button
            onClick={() => navigate(`/item/${id}`)}
            disabled={updating}
            className="group flex items-center gap-2 rounded-xl border border-white/10 bg-white/[0.05] px-4 py-2.5 text-white/70 transition-all hover:border-white/20 hover:bg-white/[0.09] hover:text-white disabled:opacity-50"
          >
            <span className="text-lg transition-transform group-hover:-translate-x-1">
              ←
            </span>

            <span className="text-sm font-medium">
              Back to Item
            </span>
          </button>

          <div className="hidden items-center gap-2 text-xs text-white/35 sm:flex">
            <span>LostLink</span>
            <span>/</span>
            <span className="text-white/65">
              Edit Item
            </span>
          </div>

        </div>

        {/* ======================================
            HEADER
        ====================================== */}
        <div className="mb-8">

          <div className="flex items-center gap-4">

            <div className="flex h-14 w-14 items-center justify-center rounded-2xl border border-violet-400/20 bg-gradient-to-br from-violet-500/20 to-indigo-500/20 text-2xl shadow-lg shadow-violet-500/10">
              ✏️
            </div>

            <div>

              <div className="mb-1 flex items-center gap-3">

                <h1 className="text-3xl font-black tracking-tight sm:text-4xl">
                  Edit Item
                </h1>

                <span className="hidden rounded-full border border-violet-400/20 bg-violet-500/10 px-3 py-1 text-[10px] font-bold uppercase tracking-wider text-violet-300 sm:block">
                  Update
                </span>

              </div>

              <p className="text-sm text-white/40">
                Update your lost or found item details.
              </p>

            </div>

          </div>
        </div>

        {/* ======================================
            FORM CARD
        ====================================== */}
        <div className="overflow-hidden rounded-[28px] border border-white/10 bg-white/[0.045] shadow-2xl backdrop-blur-2xl">

          {/* TOP LINE */}
          <div className="h-1 bg-gradient-to-r from-violet-500 via-indigo-500 to-cyan-400" />

          {/* CARD HEADER */}
          <div className="border-b border-white/10 bg-white/[0.02] px-6 py-6 sm:px-8 lg:px-10">

            <div className="flex items-center justify-between gap-4">

              <div>

                <h2 className="text-lg font-bold">
                  Item Information
                </h2>

                <p className="mt-1 text-xs text-white/35">
                  Keep your report accurate and up to date.
                </p>

              </div>

              <div className="hidden items-center gap-2 rounded-xl border border-emerald-400/10 bg-emerald-500/10 px-3 py-2 sm:flex">

                <span className="h-1.5 w-1.5 animate-pulse rounded-full bg-emerald-400" />

                <span className="text-xs text-emerald-300">
                  Secure Edit
                </span>

              </div>

            </div>
          </div>

          {/* FORM */}
          <form
            onSubmit={handleSubmit}
            className="p-6 sm:p-8 lg:p-10"
          >

            {/* ======================================
                SUCCESS / ERROR
            ====================================== */}
            {(error || success) && (
              <div
                className={`mb-7 flex items-start gap-3 rounded-2xl border p-4 ${
                  success
                    ? "border-emerald-400/20 bg-emerald-500/10"
                    : "border-red-400/20 bg-red-500/10"
                }`}
              >

                <div className="text-lg">
                  {success ? "✓" : "⚠️"}
                </div>

                <div>

                  <p
                    className={`text-sm font-semibold ${
                      success
                        ? "text-emerald-300"
                        : "text-red-300"
                    }`}
                  >
                    {success
                      ? "Update Successful"
                      : "Something went wrong"}
                  </p>

                  <p
                    className={`mt-1 text-xs ${
                      success
                        ? "text-emerald-200/60"
                        : "text-red-200/60"
                    }`}
                  >
                    {success || error}
                  </p>

                </div>

              </div>
            )}

            {/* ======================================
                CURRENT IMAGE
            ====================================== */}
            <section className="mb-10">

              <div className="mb-5 flex items-center gap-3">

                <div className="flex h-10 w-10 items-center justify-center rounded-xl border border-violet-400/10 bg-violet-500/10">
                  🖼️
                </div>

                <div>

                  <h3 className="font-bold">
                    Current Image
                  </h3>

                  <p className="text-xs text-white/35">
                    Your currently uploaded item image
                  </p>

                </div>

              </div>

              <div className="overflow-hidden rounded-2xl border border-white/10 bg-black/20">

                {currentImage ? (
                  <img
                    src={getImageUrl(currentImage)}
                    alt={
                      formData.title ||
                      "Current item"
                    }
                    className="h-64 w-full object-contain sm:h-80"
                    onError={(e) => {
                      e.currentTarget.style.display =
                        "none";
                    }}
                  />
                ) : (
                  <div className="flex h-64 flex-col items-center justify-center sm:h-80">

                    <div className="mb-3 flex h-16 w-16 items-center justify-center rounded-2xl border border-white/10 bg-white/5 text-3xl">
                      📦
                    </div>

                    <span className="text-sm text-white/35">
                      No Image Available
                    </span>

                  </div>
                )}

              </div>

            </section>

            {/* ======================================
                CHANGE IMAGE
            ====================================== */}
            <section className="mb-10">

              <div className="mb-5 flex items-center gap-3">

                <div className="flex h-10 w-10 items-center justify-center rounded-xl border border-cyan-400/10 bg-cyan-500/10">
                  📤
                </div>

                <div>

                  <h3 className="font-bold">
                    Change Image
                  </h3>

                  <p className="text-xs text-white/35">
                    Upload a new image to replace the current one.
                  </p>

                </div>

              </div>

              <label className="group block cursor-pointer">

                <div className="rounded-2xl border border-dashed border-white/15 bg-white/[0.025] p-8 text-center transition-all hover:border-violet-400/30 hover:bg-white/[0.05]">

                  <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-2xl border border-violet-400/10 bg-gradient-to-br from-violet-500/15 to-indigo-500/15 text-2xl transition-transform group-hover:scale-105">
                    ⬆️
                  </div>

                  <p className="font-semibold text-white/80">
                    Click to choose a new image
                  </p>

                  <p className="mt-2 text-xs text-white/35">
                    JPG, JPEG, PNG or WEBP · Maximum 5 MB
                  </p>

                  <input
                    type="file"
                    accept="image/jpeg,image/jpg,image/png,image/webp"
                    onChange={handleImageChange}
                    className="hidden"
                  />

                </div>

              </label>

              {/* NEW IMAGE PREVIEW */}
              {newImage && (
                <div className="mt-5">

                  <div className="mb-3 flex items-center justify-between gap-3">

                    <p className="text-sm font-semibold text-white/70">
                      New Image Preview
                    </p>

                    <span className="rounded-full border border-emerald-400/10 bg-emerald-500/10 px-3 py-1 text-xs text-emerald-300">
                      Ready to upload
                    </span>

                  </div>

                  <div className="overflow-hidden rounded-2xl border border-violet-400/20 bg-black/20">

                    <img
                      src={newImagePreview}
                      alt="New preview"
                      className="h-64 w-full object-contain sm:h-80"
                    />

                  </div>

                </div>
              )}

            </section>

            {/* ======================================
                BASIC DETAILS
            ====================================== */}
            <section className="mb-10">

              <div className="mb-6 flex items-center gap-3">

                <div className="flex h-10 w-10 items-center justify-center rounded-xl border border-blue-400/10 bg-blue-500/10">
                  📝
                </div>

                <div>

                  <h3 className="font-bold">
                    Basic Details
                  </h3>

                  <p className="text-xs text-white/35">
                    Update the main information about your item.
                  </p>

                </div>

              </div>

              <div className="space-y-5">

                {/* TITLE */}
                <div>

                  <label className="mb-2 block text-sm font-semibold text-white/70">
                    Title
                  </label>

                  <input
                    type="text"
                    name="title"
                    value={formData.title}
                    onChange={handleChange}
                    required
                    placeholder="e.g. Black Wallet"
                    className="w-full rounded-2xl border border-white/10 bg-white/[0.045] px-4 py-3.5 text-white outline-none transition-all placeholder:text-white/20 focus:border-violet-400/50 focus:ring-4 focus:ring-violet-500/10"
                  />

                </div>

                {/* DESCRIPTION */}
                <div>

                  <label className="mb-2 block text-sm font-semibold text-white/70">
                    Description
                  </label>

                  <textarea
                    name="description"
                    value={formData.description}
                    onChange={handleChange}
                    required
                    rows="5"
                    placeholder="Describe the item clearly..."
                    className="w-full resize-none rounded-2xl border border-white/10 bg-white/[0.045] px-4 py-3.5 text-white outline-none transition-all placeholder:text-white/20 focus:border-violet-400/50 focus:ring-4 focus:ring-violet-500/10"
                  />

                </div>

                {/* CATEGORY + COLOR */}
                <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">

                  <div>

                    <label className="mb-2 block text-sm font-semibold text-white/70">
                      Category
                    </label>

                    <input
                      type="text"
                      name="category"
                      value={formData.category}
                      onChange={handleChange}
                      required
                      placeholder="e.g. Wallet"
                      className="w-full rounded-2xl border border-white/10 bg-white/[0.045] px-4 py-3.5 text-white outline-none transition-all placeholder:text-white/20 focus:border-violet-400/50 focus:ring-4 focus:ring-violet-500/10"
                    />

                  </div>

                  <div>

                    <label className="mb-2 block text-sm font-semibold text-white/70">
                      Color
                    </label>

                    <input
                      type="text"
                      name="color"
                      value={formData.color}
                      onChange={handleChange}
                      placeholder="e.g. Black"
                      className="w-full rounded-2xl border border-white/10 bg-white/[0.045] px-4 py-3.5 text-white outline-none transition-all placeholder:text-white/20 focus:border-violet-400/50 focus:ring-4 focus:ring-violet-500/10"
                    />

                  </div>

                </div>

              </div>
            </section>

            {/* ======================================
                LOCATION
            ====================================== */}
            <section className="mb-10">

              <div className="mb-6 flex items-center gap-3">

                <div className="flex h-10 w-10 items-center justify-center rounded-xl border border-cyan-400/10 bg-cyan-500/10">
                  📍
                </div>

                <div>

                  <h3 className="font-bold">
                    Location Details
                  </h3>

                  <p className="text-xs text-white/35">
                    Update where the item was lost or found.
                  </p>

                </div>

              </div>

              <div className="space-y-5">

                <div>

                  <label className="mb-2 block text-sm font-semibold text-white/70">
                    Location
                  </label>

                  <input
                    type="text"
                    name="location"
                    value={formData.location}
                    onChange={handleChange}
                    required
                    placeholder="e.g. College Campus"
                    className="w-full rounded-2xl border border-white/10 bg-white/[0.045] px-4 py-3.5 text-white outline-none transition-all placeholder:text-white/20 focus:border-cyan-400/40 focus:ring-4 focus:ring-cyan-500/10"
                  />

                </div>

                <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">

                  <div>

                    <label className="mb-2 block text-sm font-semibold text-white/70">
                      Latitude
                    </label>

                    <input
                      type="number"
                      step="any"
                      name="latitude"
                      value={formData.latitude}
                      onChange={handleChange}
                      placeholder="e.g. 28.6139"
                      className="w-full rounded-2xl border border-white/10 bg-white/[0.045] px-4 py-3.5 text-white outline-none transition-all placeholder:text-white/20 focus:border-cyan-400/40 focus:ring-4 focus:ring-cyan-500/10"
                    />

                  </div>

                  <div>

                    <label className="mb-2 block text-sm font-semibold text-white/70">
                      Longitude
                    </label>

                    <input
                      type="number"
                      step="any"
                      name="longitude"
                      value={formData.longitude}
                      onChange={handleChange}
                      placeholder="e.g. 77.2090"
                      className="w-full rounded-2xl border border-white/10 bg-white/[0.045] px-4 py-3.5 text-white outline-none transition-all placeholder:text-white/20 focus:border-cyan-400/40 focus:ring-4 focus:ring-cyan-500/10"
                    />

                  </div>

                </div>

              </div>
            </section>

            {/* ======================================
                DATE
            ====================================== */}
            <section className="mb-10">

              <div className="mb-6 flex items-center gap-3">

                <div className="flex h-10 w-10 items-center justify-center rounded-xl border border-amber-400/10 bg-amber-500/10">
                  📅
                </div>

                <div>

                  <h3 className="font-bold">
                    Date
                  </h3>

                  <p className="text-xs text-white/35">
                    When was the item lost or found?
                  </p>

                </div>

              </div>

              <input
                type="date"
                name="date"
                value={formData.date}
                onChange={handleChange}
                required
                className="w-full rounded-2xl border border-white/10 bg-white/[0.045] px-4 py-3.5 text-white outline-none transition-all focus:border-amber-400/40 focus:ring-4 focus:ring-amber-500/10"
              />

            </section>

            {/* ======================================
                ACTIONS
            ====================================== */}
            <div className="border-t border-white/10 pt-7">

              <div className="flex flex-col-reverse gap-3 sm:flex-row">

                <button
                  type="button"
                  onClick={() =>
                    navigate(`/item/${id}`)
                  }
                  disabled={updating}
                  className="flex-1 rounded-2xl border border-white/10 bg-white/[0.05] py-3.5 font-semibold text-white/70 transition-all hover:border-white/20 hover:bg-white/[0.09] hover:text-white disabled:opacity-40"
                >
                  Cancel
                </button>

                <button
                  type="submit"
                  disabled={updating}
                  className="flex-1 rounded-2xl bg-gradient-to-r from-violet-600 via-indigo-600 to-blue-600 py-3.5 font-bold shadow-lg shadow-violet-600/20 transition-all hover:from-violet-500 hover:via-indigo-500 hover:to-blue-500 disabled:cursor-not-allowed disabled:opacity-50"
                >

                  {updating ? (
                    <span className="flex items-center justify-center gap-2">

                      <span className="h-4 w-4 animate-spin rounded-full border-2 border-white/30 border-t-white" />

                      Updating...

                    </span>
                  ) : (
                    "✓ Update Item"
                  )}

                </button>

              </div>

              <div className="mt-4 flex items-center justify-center gap-2 text-xs text-white/25">
                <span>🔐</span>
                Your changes are saved securely to LostLink.
              </div>

            </div>

          </form>
        </div>

        {/* ======================================
            BOTTOM INFO
        ====================================== */}
        <div className="mt-8 grid gap-4 sm:grid-cols-3">

          <div className="rounded-2xl border border-white/10 bg-white/[0.035] p-5 text-center backdrop-blur-xl">

            <div className="mb-2 text-2xl">
              🔐
            </div>

            <h3 className="font-semibold">
              Secure
            </h3>

            <p className="mt-1 text-xs text-white/35">
              Your report stays protected.
            </p>

          </div>

          <div className="rounded-2xl border border-white/10 bg-white/[0.035] p-5 text-center backdrop-blur-xl">

            <div className="mb-2 text-2xl">
              ✨
            </div>

            <h3 className="font-semibold">
              Accurate
            </h3>

            <p className="mt-1 text-xs text-white/35">
              Keep item information updated.
            </p>

          </div>

          <div className="rounded-2xl border border-white/10 bg-white/[0.035] p-5 text-center backdrop-blur-xl">

            <div className="mb-2 text-2xl">
              🤝
            </div>

            <h3 className="font-semibold">
              Connected
            </h3>

            <p className="mt-1 text-xs text-white/35">
              Better details improve matching.
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

export default EditItem;