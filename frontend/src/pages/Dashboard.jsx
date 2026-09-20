import { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import API from "../api/api";

function Dashboard() {
  const navigate = useNavigate();

  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [deletingId, setDeletingId] = useState(null);

  const [search, setSearch] = useState("");
  const [typeFilter, setTypeFilter] = useState("all");
  const [categoryFilter, setCategoryFilter] = useState("all");
  const [colorFilter, setColorFilter] = useState("all");
  const [locationFilter, setLocationFilter] = useState("all");

  // =========================
  // FETCH ITEMS
  // =========================
  const fetchItems = async () => {
    try {
      setLoading(true);
      setError("");

      const response = await API.get("/items");

      setItems(response.data.items || []);
    } catch (error) {
      console.error(
        "Fetch items error:",
        error.response?.data || error.message
      );

      setError(
        error.response?.data?.message ||
          "Failed to load lost and found items."
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchItems();
  }, []);

  // =========================
  // LOGOUT
  // =========================
  const handleLogout = () => {
    localStorage.removeItem("token");
    alert("Logged out successfully!");
    navigate("/login");
  };

  // =========================
  // DELETE
  // =========================
  const handleDelete = async (id) => {
    const confirmDelete = window.confirm(
      "Are you sure you want to delete this item?"
    );

    if (!confirmDelete) return;

    try {
      setDeletingId(id);

      await API.delete("/items/" + id);

      setItems((prevItems) =>
        prevItems.filter((item) => item._id !== id)
      );

      alert("Item deleted successfully!");
    } catch (error) {
      console.error(
        "Delete item error:",
        error.response?.data || error.message
      );

      alert(
        error.response?.data?.message ||
          "Failed to delete item"
      );
    } finally {
      setDeletingId(null);
    }
  };

  // =========================
  // FILTER DATA
  // =========================
  const categories = useMemo(
    () => [
      ...new Set(
        items
          .map((item) => item.category)
          .filter(Boolean)
      ),
    ],
    [items]
  );

  const colors = useMemo(
    () => [
      ...new Set(
        items
          .map((item) => item.color)
          .filter(Boolean)
      ),
    ],
    [items]
  );

  const locations = useMemo(
    () => [
      ...new Set(
        items
          .map((item) => item.location)
          .filter(Boolean)
      ),
    ],
    [items]
  );

  // =========================
  // STATISTICS
  // =========================
  const totalReports = items.length;

  const lostItems = items.filter(
    (item) => item.type === "lost"
  ).length;

  const foundItems = items.filter(
    (item) => item.type === "found"
  ).length;

  const activeItems = items.filter(
    (item) => item.status === "active"
  ).length;

  // =========================
  // FILTER ITEMS
  // =========================
  const filteredItems = useMemo(() => {
    const searchText = search.toLowerCase().trim();

    return items.filter((item) => {
      const matchesSearch =
        !searchText ||
        item.title?.toLowerCase().includes(searchText) ||
        item.description?.toLowerCase().includes(searchText) ||
        item.location?.toLowerCase().includes(searchText) ||
        item.category?.toLowerCase().includes(searchText) ||
        item.color?.toLowerCase().includes(searchText);

      const matchesType =
        typeFilter === "all" ||
        item.type === typeFilter;

      const matchesCategory =
        categoryFilter === "all" ||
        item.category === categoryFilter;

      const matchesColor =
        colorFilter === "all" ||
        item.color === colorFilter;

      const matchesLocation =
        locationFilter === "all" ||
        item.location === locationFilter;

      return (
        matchesSearch &&
        matchesType &&
        matchesCategory &&
        matchesColor &&
        matchesLocation
      );
    });
  }, [
    items,
    search,
    typeFilter,
    categoryFilter,
    colorFilter,
    locationFilter,
  ]);

  // =========================
  // RESET FILTERS
  // =========================
  const handleResetFilters = () => {
    setSearch("");
    setTypeFilter("all");
    setCategoryFilter("all");
    setColorFilter("all");
    setLocationFilter("all");
  };

  // =========================
  // IMAGE URL
  // =========================
  const getImageUrl = (image) => {
    if (!image) return "";

    if (
      image.startsWith("http://") ||
      image.startsWith("https://")
    ) {
      return image;
    }

    const apiUrl =
      import.meta.env.VITE_API_URL ||
      "http://localhost:5000/api";

    const backendUrl = apiUrl.replace(/\/api\/?$/, "");

    return backendUrl + image;
  };

  const handleImageError = (event) => {
    event.currentTarget.style.display = "none";
  };

  // =========================
  // DATE
  // =========================
  const formatDate = (date) => {
    if (!date) return "Date unavailable";

    try {
      return new Date(date).toLocaleDateString(
        "en-IN",
        {
          day: "2-digit",
          month: "short",
          year: "numeric",
        }
      );
    } catch {
      return "Date unavailable";
    }
  };

  // =========================
  // ICON
  // =========================
  const Icon = ({ children, className = "" }) => (
    <span
      className={`inline-flex items-center justify-center ${className}`}
    >
      {children}
    </span>
  );

  return (
    <div className="min-h-screen overflow-x-hidden bg-[#050816] text-white">

      {/* =====================================================
          BACKGROUND AURORA
      ====================================================== */}

      <div className="fixed inset-0 -z-10 overflow-hidden">

        <div className="absolute -left-32 -top-32 h-[420px] w-[420px] rounded-full bg-violet-600/20 blur-[120px]" />

        <div className="absolute right-[-150px] top-[180px] h-[450px] w-[450px] rounded-full bg-cyan-500/15 blur-[130px]" />

        <div className="absolute bottom-[-180px] left-[30%] h-[450px] w-[450px] rounded-full bg-fuchsia-600/10 blur-[140px]" />

        <div className="absolute inset-0 bg-[radial-gradient(circle_at_top,rgba(99,102,241,0.08),transparent_40%)]" />

      </div>

      {/* =====================================================
          NAVBAR
      ====================================================== */}

      <header className="sticky top-0 z-50 border-b border-white/10 bg-[#050816]/75 backdrop-blur-2xl">

        <div className="mx-auto flex max-w-[1500px] items-center gap-5 px-5 py-4 lg:px-8">

          {/* LOGO */}

          <button
            onClick={() => navigate("/dashboard")}
            className="group flex shrink-0 items-center gap-3"
          >

            <div className="relative">

              <div className="absolute inset-0 rounded-2xl bg-violet-500 blur-lg opacity-40 group-hover:opacity-70 transition" />

              <div className="relative flex h-11 w-11 items-center justify-center rounded-2xl bg-gradient-to-br from-violet-500 via-indigo-500 to-cyan-400 shadow-xl">
                <span className="text-xl font-black">
                  L
                </span>
              </div>

            </div>

            <div className="hidden sm:block text-left">
              <div className="text-lg font-black tracking-tight">
                Lost<span className="text-cyan-400">Link</span>
              </div>

              <div className="text-[10px] uppercase tracking-[0.25em] text-slate-500">
                Lost & Found
              </div>
            </div>

          </button>

          {/* SEARCH */}

          <div className="relative ml-auto hidden max-w-xl flex-1 md:block">

            <span className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500">
              🔍
            </span>

            <input
              type="text"
              value={search}
              onChange={(e) =>
                setSearch(e.target.value)
              }
              placeholder="Search items, locations, categories..."
              className="w-full rounded-2xl border border-white/10 bg-white/[0.06] py-3.5 pl-11 pr-4 text-sm text-white outline-none placeholder:text-slate-500 transition focus:border-violet-400/50 focus:bg-white/[0.09] focus:ring-4 focus:ring-violet-500/10"
            />

          </div>

          {/* NAV ACTIONS */}

          <div className="flex items-center gap-2">

            <button
              onClick={() => navigate("/notifications")}
              className="group relative flex h-11 w-11 items-center justify-center rounded-xl border border-white/10 bg-white/[0.05] text-slate-300 transition hover:border-violet-400/40 hover:bg-violet-500/10 hover:text-white"
              title="Notifications"
            >
              🔔

              <span className="absolute right-2 top-2 h-2 w-2 rounded-full bg-cyan-400 shadow-lg shadow-cyan-400/80" />
            </button>

            <button
              onClick={() => navigate("/profile")}
              className="hidden h-11 items-center gap-2 rounded-xl border border-white/10 bg-white/[0.05] px-4 text-sm font-semibold text-slate-300 transition hover:bg-white/10 hover:text-white sm:flex"
            >
              <span className="flex h-7 w-7 items-center justify-center rounded-lg bg-gradient-to-br from-violet-500 to-cyan-400 text-xs font-black">
                U
              </span>
              Profile
            </button>

            <button
              onClick={handleLogout}
              className="hidden h-11 rounded-xl border border-red-500/20 bg-red-500/5 px-4 text-sm font-semibold text-red-300 transition hover:bg-red-500/15 sm:block"
            >
              Logout
            </button>

          </div>

        </div>

        {/* MOBILE SEARCH */}

        <div className="px-5 pb-4 md:hidden">

          <div className="relative">

            <span className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500">
              🔍
            </span>

            <input
              type="text"
              value={search}
              onChange={(e) =>
                setSearch(e.target.value)
              }
              placeholder="Search LostLink..."
              className="w-full rounded-2xl border border-white/10 bg-white/[0.06] py-3 pl-11 pr-4 text-sm text-white outline-none placeholder:text-slate-500"
            />

          </div>

        </div>

      </header>

      {/* =====================================================
          MAIN
      ====================================================== */}

      <main className="mx-auto max-w-[1500px] px-5 py-8 lg:px-8">

        {/* =================================================
            HERO
        ================================================== */}

        <section className="relative overflow-hidden rounded-[32px] border border-white/10 bg-gradient-to-br from-violet-600 via-indigo-700 to-[#081b32] p-7 shadow-2xl shadow-indigo-950/50 sm:p-10 lg:p-12">

          {/* decorative circles */}

          <div className="absolute -right-24 -top-24 h-72 w-72 rounded-full border border-white/10" />

          <div className="absolute -right-10 -top-10 h-44 w-44 rounded-full border border-white/10" />

          <div className="absolute right-20 bottom-[-100px] h-64 w-64 rounded-full bg-cyan-400/10 blur-3xl" />

          <div className="relative grid items-center gap-10 lg:grid-cols-[1.3fr_0.7fr]">

            {/* LEFT */}

            <div>

              <div className="mb-5 inline-flex items-center gap-2 rounded-full border border-white/15 bg-white/10 px-4 py-2 text-xs font-bold text-cyan-200 backdrop-blur">
                <span className="h-2 w-2 animate-pulse rounded-full bg-cyan-300" />
                COMMUNITY DASHBOARD
              </div>

              <h1 className="max-w-3xl text-4xl font-black leading-[1.05] tracking-tight sm:text-5xl lg:text-6xl">

                Find what you lost.
                <br />

                <span className="bg-gradient-to-r from-cyan-200 via-white to-fuchsia-200 bg-clip-text text-transparent">
                  Return what you found.
                </span>

              </h1>

              <p className="mt-6 max-w-2xl text-base leading-7 text-indigo-100/75 sm:text-lg">
                Your central space for discovering lost belongings,
                reporting found items, and helping people reconnect
                with what matters.
              </p>

              {/* CTA */}

              <div className="mt-8 flex flex-col gap-3 sm:flex-row">

                <button
                  onClick={() => navigate("/create-lost")}
                  className="group rounded-2xl bg-white px-6 py-3.5 text-sm font-black text-indigo-700 shadow-xl transition hover:-translate-y-1 hover:shadow-2xl"
                >
                  <span className="mr-2">＋</span>
                  Report Lost Item
                  <span className="ml-2 transition group-hover:translate-x-1 inline-block">
                    →
                  </span>
                </button>

                <button
                  onClick={() => navigate("/create-found")}
                  className="rounded-2xl border border-white/20 bg-white/10 px-6 py-3.5 text-sm font-black text-white backdrop-blur transition hover:-translate-y-1 hover:bg-white/15"
                >
                  🔎 Report Found Item
                </button>

              </div>

            </div>

            {/* RIGHT VISUAL */}

            <div className="hidden lg:block">

              <div className="relative mx-auto h-[280px] max-w-[360px]">

                {/* glow */}

                <div className="absolute left-1/2 top-1/2 h-48 w-48 -translate-x-1/2 -translate-y-1/2 rounded-full bg-cyan-400/20 blur-3xl" />

                {/* center card */}

                <div className="absolute left-1/2 top-1/2 w-64 -translate-x-1/2 -translate-y-1/2 rotate-[-4deg] rounded-[28px] border border-white/20 bg-white/10 p-6 shadow-2xl backdrop-blur-xl">

                  <div className="mb-5 flex items-center justify-between">

                    <div>
                      <div className="text-xs text-white/50">
                        LIVE REPORTS
                      </div>

                      <div className="mt-1 text-3xl font-black">
                        {totalReports}
                      </div>
                    </div>

                    <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-cyan-400/20 text-xl">
                      ✦
                    </div>

                  </div>

                  <div className="space-y-3">

                    <div className="h-2 overflow-hidden rounded-full bg-white/10">
                      <div className="h-full w-[75%] rounded-full bg-gradient-to-r from-cyan-300 to-violet-400" />
                    </div>

                    <div className="flex justify-between text-[11px] text-white/50">
                      <span>Community activity</span>
                      <span>Active</span>
                    </div>

                  </div>

                </div>

                {/* floating cards */}

                <div className="absolute left-0 top-8 rounded-2xl border border-white/15 bg-white/10 px-4 py-3 backdrop-blur-xl shadow-xl">

                  <div className="text-[10px] uppercase tracking-wider text-white/50">
                    Lost
                  </div>

                  <div className="mt-1 text-xl font-black">
                    {lostItems}
                  </div>

                </div>

                <div className="absolute bottom-8 right-0 rounded-2xl border border-white/15 bg-white/10 px-4 py-3 backdrop-blur-xl shadow-xl">

                  <div className="text-[10px] uppercase tracking-wider text-white/50">
                    Found
                  </div>

                  <div className="mt-1 text-xl font-black">
                    {foundItems}
                  </div>

                </div>

              </div>

            </div>

          </div>

        </section>

        {/* =================================================
            STATISTICS
        ================================================== */}

        <section className="mt-7 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">

          {[
            {
              label: "Total Reports",
              value: totalReports,
              icon: "◈",
              text: "All community reports",
              gradient: "from-violet-500 to-indigo-500",
            },
            {
              label: "Lost Items",
              value: lostItems,
              icon: "⌖",
              text: "Items reported lost",
              gradient: "from-fuchsia-500 to-pink-500",
            },
            {
              label: "Found Items",
              value: foundItems,
              icon: "✓",
              text: "Items reported found",
              gradient: "from-cyan-400 to-blue-500",
            },
            {
              label: "Active Reports",
              value: activeItems,
              icon: "●",
              text: "Currently active",
              gradient: "from-emerald-400 to-teal-500",
            },
          ].map((stat) => (

            <div
              key={stat.label}
              className="group relative overflow-hidden rounded-3xl border border-white/10 bg-white/[0.045] p-5 backdrop-blur-xl transition duration-300 hover:-translate-y-1 hover:border-white/20 hover:bg-white/[0.07]"
            >

              <div
                className={`absolute right-[-30px] top-[-30px] h-28 w-28 rounded-full bg-gradient-to-br ${stat.gradient} opacity-10 blur-2xl`}
              />

              <div className="relative flex items-start justify-between">

                <div>

                  <p className="text-xs font-bold uppercase tracking-[0.15em] text-slate-500">
                    {stat.label}
                  </p>

                  <p className="mt-3 text-4xl font-black tracking-tight">
                    {stat.value}
                  </p>

                  <p className="mt-2 text-xs text-slate-500">
                    {stat.text}
                  </p>

                </div>

                <div
                  className={`flex h-12 w-12 items-center justify-center rounded-2xl bg-gradient-to-br ${stat.gradient} text-lg font-black shadow-lg`}
                >
                  {stat.icon}
                </div>

              </div>

            </div>

          ))}

        </section>

        {/* =================================================
            FILTER PANEL
        ================================================== */}

        <section className="mt-8 rounded-[28px] border border-white/10 bg-white/[0.045] p-5 shadow-xl backdrop-blur-xl sm:p-6">

          <div className="mb-5 flex flex-col justify-between gap-4 lg:flex-row lg:items-center">

            <div>

              <p className="text-xs font-bold uppercase tracking-[0.2em] text-violet-400">
                Explore reports
              </p>

              <h2 className="mt-1 text-xl font-black">
                Find exactly what you need
              </h2>

            </div>

            <button
              onClick={handleResetFilters}
              className="rounded-xl border border-white/10 bg-white/[0.05] px-4 py-2.5 text-xs font-bold text-slate-300 transition hover:bg-white/10 hover:text-white"
            >
              ↻ Reset Filters
            </button>

          </div>

          {/* TYPE */}

          <div className="mb-5 flex flex-wrap gap-2">

            {[
              ["all", "All Items"],
              ["lost", "Lost"],
              ["found", "Found"],
            ].map(([value, label]) => (

              <button
                key={value}
                onClick={() => setTypeFilter(value)}
                className={`rounded-xl px-5 py-2.5 text-sm font-bold transition ${
                  typeFilter === value
                    ? "bg-gradient-to-r from-violet-500 to-indigo-500 text-white shadow-lg shadow-violet-500/20"
                    : "border border-white/10 bg-white/[0.04] text-slate-400 hover:bg-white/[0.08] hover:text-white"
                }`}
              >
                {label}
              </button>

            ))}

          </div>

          {/* FILTER GRID */}

          <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">

            <select
              value={categoryFilter}
              onChange={(e) =>
                setCategoryFilter(e.target.value)
              }
              className="rounded-xl border border-white/10 bg-[#0c1224] px-4 py-3 text-sm text-slate-300 outline-none transition focus:border-violet-500/50"
            >
              <option value="all">All Categories</option>

              {categories.map((category) => (
                <option key={category} value={category}>
                  {category}
                </option>
              ))}

            </select>

            <select
              value={colorFilter}
              onChange={(e) =>
                setColorFilter(e.target.value)
              }
              className="rounded-xl border border-white/10 bg-[#0c1224] px-4 py-3 text-sm text-slate-300 outline-none transition focus:border-violet-500/50"
            >
              <option value="all">All Colors</option>

              {colors.map((color) => (
                <option key={color} value={color}>
                  {color}
                </option>
              ))}

            </select>

            <select
              value={locationFilter}
              onChange={(e) =>
                setLocationFilter(e.target.value)
              }
              className="rounded-xl border border-white/10 bg-[#0c1224] px-4 py-3 text-sm text-slate-300 outline-none transition focus:border-violet-500/50"
            >
              <option value="all">All Locations</option>

              {locations.map((location) => (
                <option key={location} value={location}>
                  {location}
                </option>
              ))}

            </select>

            <div className="flex items-center rounded-xl border border-white/10 bg-white/[0.03] px-4 text-sm text-slate-500">

              <span className="mr-3">⌕</span>

              <span>
                Showing{" "}
                <strong className="text-white">
                  {filteredItems.length}
                </strong>{" "}
                reports
              </span>

            </div>

          </div>

        </section>

        {/* =================================================
            CONTENT HEADER
        ================================================== */}

        <div className="mt-10 flex flex-col justify-between gap-3 sm:flex-row sm:items-end">

          <div>

            <p className="text-xs font-bold uppercase tracking-[0.2em] text-cyan-400">
              Community marketplace
            </p>

            <h2 className="mt-1 text-3xl font-black tracking-tight">
              Lost & Found Reports
            </h2>

          </div>

          <p className="text-sm text-slate-500">
            {filteredItems.length} matching report
            {filteredItems.length !== 1 ? "s" : ""}
          </p>

        </div>

        {/* =================================================
            LOADING
        ================================================== */}

        {loading && (

          <div className="grid gap-5 py-8 md:grid-cols-2 xl:grid-cols-3">

            {[1, 2, 3].map((item) => (

              <div
                key={item}
                className="h-[470px] animate-pulse rounded-3xl border border-white/10 bg-white/[0.04]"
              />

            ))}

          </div>

        )}

        {/* =================================================
            ERROR
        ================================================== */}

        {!loading && error && (

          <div className="mt-8 rounded-3xl border border-red-500/20 bg-red-500/5 p-8 text-center">

            <div className="text-4xl">⚠️</div>

            <h3 className="mt-4 text-xl font-black">
              Unable to load reports
            </h3>

            <p className="mt-2 text-sm text-slate-500">
              {error}
            </p>

            <button
              onClick={fetchItems}
              className="mt-5 rounded-xl bg-red-500 px-5 py-3 text-sm font-bold text-white transition hover:bg-red-400"
            >
              Try Again
            </button>

          </div>

        )}

        {/* =================================================
            EMPTY
        ================================================== */}

        {!loading &&
          !error &&
          items.length === 0 && (

            <div className="mt-8 rounded-[30px] border border-white/10 bg-white/[0.04] px-6 py-20 text-center">

              <div className="mx-auto flex h-20 w-20 items-center justify-center rounded-3xl bg-gradient-to-br from-violet-500/20 to-cyan-400/10 text-4xl">
                ✦
              </div>

              <h3 className="mt-6 text-2xl font-black">
                No reports yet
              </h3>

              <p className="mx-auto mt-3 max-w-md text-sm leading-6 text-slate-500">
                Be the first person to help your community.
                Report a lost or found item today.
              </p>

              <div className="mt-6 flex justify-center gap-3">

                <button
                  onClick={() => navigate("/create-lost")}
                  className="rounded-xl bg-violet-600 px-5 py-3 text-sm font-bold transition hover:bg-violet-500"
                >
                  Report Lost
                </button>

                <button
                  onClick={() => navigate("/create-found")}
                  className="rounded-xl border border-white/10 bg-white/5 px-5 py-3 text-sm font-bold transition hover:bg-white/10"
                >
                  Report Found
                </button>

              </div>

            </div>
          )}

        {/* =================================================
            NO FILTER RESULTS
        ================================================== */}

        {!loading &&
          !error &&
          items.length > 0 &&
          filteredItems.length === 0 && (

            <div className="mt-8 rounded-[30px] border border-white/10 bg-white/[0.04] px-6 py-20 text-center">

              <div className="text-5xl">
                🔎
              </div>

              <h3 className="mt-5 text-2xl font-black">
                Nothing matches your search
              </h3>

              <p className="mt-2 text-sm text-slate-500">
                Try another keyword or reset your filters.
              </p>

              <button
                onClick={handleResetFilters}
                className="mt-6 rounded-xl bg-gradient-to-r from-violet-500 to-indigo-500 px-6 py-3 text-sm font-bold shadow-lg shadow-violet-500/20 transition hover:-translate-y-0.5"
              >
                Clear Filters
              </button>

            </div>
          )}

        {/* =================================================
            ITEM GRID
        ================================================== */}

        {!loading &&
          !error &&
          filteredItems.length > 0 && (

            <div className="mt-6 grid gap-6 md:grid-cols-2 xl:grid-cols-3">

              {filteredItems.map((item) => {

                const isLost = item.type === "lost";

                return (

                  <article
                    key={item._id}
                    className="group overflow-hidden rounded-[28px] border border-white/10 bg-white/[0.045] shadow-xl shadow-black/20 backdrop-blur-xl transition duration-300 hover:-translate-y-2 hover:border-white/20 hover:bg-white/[0.07] hover:shadow-2xl"
                  >

                    {/* IMAGE */}

                    <div className="relative h-60 overflow-hidden bg-gradient-to-br from-[#11182e] to-[#080c18]">

                      {item.image ? (

                        <img
                          src={getImageUrl(item.image)}
                          alt={item.title}
                          onError={handleImageError}
                          className="h-full w-full object-cover transition duration-700 group-hover:scale-110"
                        />

                      ) : (

                        <div className="flex h-full items-center justify-center">

                          <div className="text-center">

                            <div className="text-5xl opacity-30">
                              {isLost ? "⌖" : "✓"}
                            </div>

                            <p className="mt-3 text-xs uppercase tracking-widest text-slate-600">
                              No image
                            </p>

                          </div>

                        </div>

                      )}

                      {/* image gradient */}

                      <div className="absolute inset-0 bg-gradient-to-t from-[#050816] via-transparent to-black/20" />

                      {/* type */}

                      <div className="absolute left-4 top-4">

                        <span
                          className={`rounded-full border px-3 py-1.5 text-[10px] font-black uppercase tracking-wider backdrop-blur-xl ${
                            isLost
                              ? "border-fuchsia-300/20 bg-fuchsia-500/20 text-fuchsia-200"
                              : "border-cyan-300/20 bg-cyan-500/20 text-cyan-200"
                          }`}
                        >
                          {isLost ? "Lost Item" : "Found Item"}
                        </span>

                      </div>

                      {/* status */}

                      <div className="absolute right-4 top-4">

                        <span className="flex items-center gap-1.5 rounded-full border border-emerald-300/20 bg-emerald-500/15 px-3 py-1.5 text-[10px] font-black uppercase tracking-wider text-emerald-300 backdrop-blur-xl">

                          <span className="h-1.5 w-1.5 rounded-full bg-emerald-400" />

                          {item.status || "active"}

                        </span>

                      </div>

                      {/* bottom title */}

                      <div className="absolute bottom-4 left-4 right-4">

                        <h3 className="truncate text-xl font-black text-white">
                          {item.title}
                        </h3>

                        <p className="mt-1 text-xs text-slate-300/70">
                          {item.category || "Uncategorized"}
                        </p>

                      </div>

                    </div>

                    {/* CONTENT */}

                    <div className="p-5">

                      <p className="min-h-[42px] line-clamp-2 text-sm leading-6 text-slate-400">
                        {item.description || "No description provided."}
                      </p>

                      {/* META */}

                      <div className="mt-5 grid grid-cols-2 gap-2">

                        <div className="rounded-xl border border-white/5 bg-white/[0.035] p-3">

                          <div className="text-[9px] font-bold uppercase tracking-wider text-slate-600">
                            Location
                          </div>

                          <div className="mt-1 truncate text-xs font-bold text-slate-300">
                            📍 {item.location || "Unknown"}
                          </div>

                        </div>

                        <div className="rounded-xl border border-white/5 bg-white/[0.035] p-3">

                          <div className="text-[9px] font-bold uppercase tracking-wider text-slate-600">
                            Color
                          </div>

                          <div className="mt-1 truncate text-xs font-bold text-slate-300">
                            🎨 {item.color || "Not specified"}
                          </div>

                        </div>

                      </div>

                      {/* DATE */}

                      <div className="mt-2 rounded-xl border border-white/5 bg-white/[0.035] px-3 py-2.5">

                        <div className="flex items-center justify-between">

                          <span className="text-[10px] uppercase tracking-wider text-slate-600">
                            Reported
                          </span>

                          <span className="text-xs font-bold text-slate-300">
                            {formatDate(item.date)}
                          </span>

                        </div>

                      </div>

                      {/* OWNER */}

                      {item.owner && (

                        <div className="mt-4 flex items-center gap-3 border-t border-white/5 pt-4">

                          <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-gradient-to-br from-violet-500/30 to-cyan-400/20 text-xs font-black">
                            {(item.owner.name || "U")
                              .charAt(0)
                              .toUpperCase()}
                          </div>

                          <div className="min-w-0">

                            <p className="text-[9px] uppercase tracking-wider text-slate-600">
                              Reported by
                            </p>

                            <p className="truncate text-xs font-bold text-slate-300">
                              {item.owner.name}
                            </p>

                          </div>

                        </div>

                      )}

                      {/* ACTIONS */}

                      <div className="mt-5 grid grid-cols-2 gap-2">

                        <button
                          onClick={() =>
                            navigate(
                              "/item/" + item._id
                            )
                          }
                          className="rounded-xl bg-gradient-to-r from-violet-500 to-indigo-500 py-3 text-xs font-black text-white shadow-lg shadow-violet-500/10 transition hover:-translate-y-0.5 hover:shadow-violet-500/25"
                        >
                          View Details
                        </button>

                        <button
                          onClick={() =>
                            navigate(
                              "/edit-item/" + item._id
                            )
                          }
                          className="rounded-xl border border-white/10 bg-white/[0.05] py-3 text-xs font-black text-slate-300 transition hover:bg-white/10 hover:text-white"
                        >
                          Edit
                        </button>

                      </div>

                      <button
                        onClick={() =>
                          handleDelete(item._id)
                        }
                        disabled={
                          deletingId === item._id
                        }
                        className="mt-2 w-full rounded-xl border border-red-500/10 bg-red-500/5 py-2.5 text-xs font-bold text-red-400 transition hover:bg-red-500/10 disabled:opacity-50"
                      >
                        {deletingId === item._id
                          ? "Deleting..."
                          : "Delete Item"}
                      </button>

                    </div>

                  </article>

                );
              })}

            </div>
          )}

        {/* =================================================
            CTA
        ================================================== */}

        <section className="relative mt-14 overflow-hidden rounded-[32px] border border-white/10 bg-gradient-to-r from-violet-600 via-indigo-600 to-cyan-600 p-8 shadow-2xl shadow-indigo-950/40 sm:p-10">

          <div className="absolute -right-20 -top-20 h-64 w-64 rounded-full bg-white/10 blur-3xl" />

          <div className="absolute -bottom-20 left-20 h-52 w-52 rounded-full bg-cyan-300/10 blur-3xl" />

          <div className="relative flex flex-col items-center justify-between gap-7 text-center lg:flex-row lg:text-left">

            <div>

              <div className="mb-3 inline-flex rounded-full border border-white/20 bg-white/10 px-3 py-1 text-[10px] font-black uppercase tracking-widest text-white/80">
                Make an impact
              </div>

              <h2 className="text-3xl font-black sm:text-4xl">
                Help reunite someone
                <br className="hidden sm:block" />
                with what matters.
              </h2>

              <p className="mt-3 max-w-xl text-sm leading-6 text-white/70">
                One small report can turn a stressful day into
                a happy reunion. Be part of the LostLink community.
              </p>

            </div>

            <div className="flex shrink-0 flex-col gap-3 sm:flex-row">

              <button
                onClick={() =>
                  navigate("/create-lost")
                }
                className="rounded-2xl bg-white px-6 py-3.5 text-sm font-black text-indigo-700 shadow-xl transition hover:-translate-y-1"
              >
                Report Lost Item
              </button>

              <button
                onClick={() =>
                  navigate("/create-found")
                }
                className="rounded-2xl border border-white/20 bg-white/10 px-6 py-3.5 text-sm font-black text-white backdrop-blur transition hover:bg-white/20"
              >
                Report Found Item
              </button>

            </div>

          </div>

        </section>

      </main>

      {/* =====================================================
          FOOTER
      ====================================================== */}

      <footer className="mt-12 border-t border-white/10 bg-[#03050d]/80">

        <div className="mx-auto flex max-w-[1500px] flex-col justify-between gap-5 px-5 py-8 text-sm sm:flex-row sm:items-center lg:px-8">

          <div>

            <div className="text-lg font-black">
              Lost<span className="text-cyan-400">Link</span>
            </div>

            <p className="mt-1 text-xs text-slate-600">
              Lost Today • Found Tomorrow.
            </p>

          </div>

          <div className="flex flex-wrap gap-5 text-xs font-semibold text-slate-500">

            <button className="transition hover:text-white">
              Privacy
            </button>

            <button className="transition hover:text-white">
              Terms
            </button>

            <button className="transition hover:text-white">
              Help
            </button>

            <span className="text-slate-700">
              © 2026 LostLink
            </span>

          </div>

        </div>

      </footer>

    </div>
  );
}

export default Dashboard;