import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import API from "../api/api";

function Profile() {
  const navigate = useNavigate();

  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const [user, setUser] = useState({
    name: "",
    email: "",
  });

  // ======================================
  // GET CURRENT LOGGED-IN USER
  // ======================================
  const fetchCurrentUser = async () => {
    try {
      const response = await API.get("/auth/me");

      console.log("Current user:", response.data);

      if (response.data.success && response.data.user) {
        setUser({
          name: response.data.user.name || "",
          email: response.data.user.email || "",
        });
      }
    } catch (error) {
      console.error(
        "Fetch current user error:",
        error.response?.data || error.message
      );
    }
  };

  // ======================================
  // GET USER'S REPORTED ITEMS
  // ======================================
  const fetchMyItems = async () => {
    try {
      setLoading(true);
      setError("");

      const response = await API.get("/items/my");

      console.log("My items response:", response.data);

      setItems(response.data.items || []);
    } catch (error) {
      console.error(
        "Fetch my items error:",
        error.response?.data || error.message
      );

      setError(
        error.response?.data?.message ||
          "Failed to load your profile"
      );
    } finally {
      setLoading(false);
    }
  };

  // ======================================
  // LOAD PROFILE
  // ======================================
  useEffect(() => {
    fetchCurrentUser();
    fetchMyItems();
  }, []);

  // ======================================
  // DELETE ITEM
  // ======================================
  const handleDelete = async (id) => {
    const confirmDelete = window.confirm(
      "Are you sure you want to delete this item?"
    );

    if (!confirmDelete) return;

    try {
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
    }
  };

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

    const apiUrl =
      import.meta.env.VITE_API_URL ||
      "http://localhost:5000/api";

    const backendUrl = apiUrl.replace(/\/api\/?$/, "");

    return backendUrl + image;
  };

  // ======================================
  // FORMAT DATE
  // ======================================
  const formatDate = (date) => {
    if (!date) return "N/A";

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
      return "N/A";
    }
  };

  // ======================================
  // STATISTICS
  // ======================================
  const totalItems = items.length;

  const lostCount = items.filter(
    (item) => item.type === "lost"
  ).length;

  const foundCount = items.filter(
    (item) => item.type === "found"
  ).length;

  const activeCount = items.filter(
    (item) => item.status === "active"
  ).length;

  // ======================================
  // LOADING
  // ======================================
  if (loading) {
    return (
      <div className="min-h-screen bg-[#050816] text-white">

        <div className="fixed inset-0 overflow-hidden">

          <div className="absolute left-[-100px] top-[-100px] h-80 w-80 rounded-full bg-violet-600/15 blur-[120px]" />

          <div className="absolute right-[-100px] top-[200px] h-80 w-80 rounded-full bg-cyan-500/10 blur-[120px]" />

        </div>

        <div className="relative flex min-h-screen items-center justify-center">

          <div className="text-center">

            <div className="mx-auto h-14 w-14 animate-spin rounded-full border-4 border-white/10 border-t-violet-500" />

            <p className="mt-5 text-sm font-semibold text-slate-400">
              Loading your profile...
            </p>

          </div>

        </div>

      </div>
    );
  }

  return (
    <div className="min-h-screen overflow-x-hidden bg-[#050816] text-white">

      {/* =================================================
          BACKGROUND
      ================================================== */}

      <div className="fixed inset-0 -z-10 overflow-hidden">

        <div className="absolute left-[-150px] top-[-120px] h-[450px] w-[450px] rounded-full bg-violet-600/15 blur-[140px]" />

        <div className="absolute right-[-150px] top-[250px] h-[450px] w-[450px] rounded-full bg-cyan-500/10 blur-[140px]" />

        <div className="absolute bottom-[-150px] left-[35%] h-[400px] w-[400px] rounded-full bg-fuchsia-600/10 blur-[140px]" />

      </div>

      {/* =================================================
          MAIN CONTAINER
      ================================================== */}

      <main className="mx-auto max-w-[1400px] px-5 py-8 lg:px-8">

        {/* =================================================
            PAGE HEADER
        ================================================== */}

        <section className="mb-8">

          <div className="flex flex-col justify-between gap-5 sm:flex-row sm:items-end">

            <div>

              <div className="mb-3 inline-flex items-center gap-2 rounded-full border border-violet-400/20 bg-violet-500/10 px-3 py-1.5 text-[10px] font-black uppercase tracking-[0.2em] text-violet-300">

                <span className="h-1.5 w-1.5 rounded-full bg-violet-400" />

                Account Center

              </div>

              <h1 className="text-4xl font-black tracking-tight sm:text-5xl">

                My{" "}
                <span className="bg-gradient-to-r from-violet-400 via-fuchsia-400 to-cyan-400 bg-clip-text text-transparent">
                  Profile
                </span>

              </h1>

              <p className="mt-3 max-w-xl text-sm leading-6 text-slate-500 sm:text-base">
                Manage your LostLink account and keep track
                of everything you've reported.
              </p>

            </div>

            <button
              onClick={() => navigate("/dashboard")}
              className="rounded-xl border border-white/10 bg-white/[0.05] px-5 py-3 text-sm font-bold text-slate-300 transition hover:bg-white/10 hover:text-white"
            >
              ← Back to Dashboard
            </button>

          </div>

        </section>

        {/* =================================================
            ERROR
        ================================================== */}

        {error && (

          <div className="mb-6 rounded-2xl border border-red-500/20 bg-red-500/5 p-4 text-sm text-red-300">
            ⚠️ {error}
          </div>

        )}

        {/* =================================================
            PROFILE HERO
        ================================================== */}

        <section className="relative overflow-hidden rounded-[32px] border border-white/10 bg-gradient-to-br from-violet-600/90 via-indigo-700/90 to-[#071527] p-7 shadow-2xl shadow-indigo-950/40 sm:p-9">

          {/* decorative circles */}

          <div className="absolute right-[-80px] top-[-100px] h-72 w-72 rounded-full border border-white/10" />

          <div className="absolute right-[-30px] top-[-50px] h-52 w-52 rounded-full border border-white/10" />

          <div className="absolute bottom-[-120px] left-[30%] h-64 w-64 rounded-full bg-cyan-400/10 blur-3xl" />

          <div className="relative flex flex-col gap-8 md:flex-row md:items-center md:justify-between">

            {/* USER */}

            <div className="flex flex-col items-start gap-5 sm:flex-row sm:items-center">

              {/* AVATAR */}

              <div className="relative">

                <div className="absolute inset-0 rounded-[28px] bg-cyan-400/30 blur-xl" />

                <div className="relative flex h-24 w-24 items-center justify-center rounded-[28px] border border-white/20 bg-white/10 text-4xl font-black shadow-2xl backdrop-blur-xl sm:h-28 sm:w-28">

                  {user.name
                    ? user.name
                        .charAt(0)
                        .toUpperCase()
                    : "U"}

                </div>

              </div>

              {/* INFO */}

              <div>

                <div className="mb-2 inline-flex items-center gap-2 rounded-full border border-white/15 bg-white/10 px-3 py-1 text-[10px] font-bold uppercase tracking-wider text-cyan-200">

                  <span className="h-1.5 w-1.5 rounded-full bg-cyan-300" />

                  Verified Member

                </div>

                <h2 className="text-3xl font-black sm:text-4xl">
                  {user.name || "User"}
                </h2>

                <p className="mt-1 text-sm text-indigo-100/60">
                  {user.email || "Email not available"}
                </p>

                <p className="mt-3 text-xs font-bold uppercase tracking-widest text-white/40">
                  LostLink Community Member
                </p>

              </div>

            </div>

            {/* QUICK INFO */}

            <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 md:min-w-[400px]">

              <div className="rounded-2xl border border-white/10 bg-white/10 p-4 backdrop-blur-xl">

                <div className="text-[10px] font-bold uppercase tracking-wider text-white/40">
                  Reports
                </div>

                <div className="mt-2 text-2xl font-black">
                  {totalItems}
                </div>

              </div>

              <div className="rounded-2xl border border-white/10 bg-white/10 p-4 backdrop-blur-xl">

                <div className="text-[10px] font-bold uppercase tracking-wider text-white/40">
                  Active
                </div>

                <div className="mt-2 text-2xl font-black">
                  {activeCount}
                </div>

              </div>

              <div className="col-span-2 rounded-2xl border border-white/10 bg-white/10 p-4 backdrop-blur-xl sm:col-span-1">

                <div className="text-[10px] font-bold uppercase tracking-wider text-white/40">
                  Community
                </div>

                <div className="mt-2 text-sm font-black text-cyan-200">
                  Helping Others
                </div>

              </div>

            </div>

          </div>

        </section>

        {/* =================================================
            STATISTICS
        ================================================== */}

        <section className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">

          {/* TOTAL */}

          <div className="group relative overflow-hidden rounded-3xl border border-white/10 bg-white/[0.045] p-6 backdrop-blur-xl transition hover:-translate-y-1 hover:bg-white/[0.07]">

            <div className="absolute right-[-30px] top-[-30px] h-32 w-32 rounded-full bg-violet-500/15 blur-3xl" />

            <div className="relative flex items-center justify-between">

              <div>

                <p className="text-xs font-bold uppercase tracking-[0.15em] text-slate-500">
                  Total Reports
                </p>

                <p className="mt-3 text-4xl font-black">
                  {totalItems}
                </p>

                <p className="mt-2 text-xs text-slate-600">
                  All your reported items
                </p>

              </div>

              <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-violet-500/15 text-2xl">
                ◈
              </div>

            </div>

          </div>

          {/* LOST */}

          <div className="group relative overflow-hidden rounded-3xl border border-white/10 bg-white/[0.045] p-6 backdrop-blur-xl transition hover:-translate-y-1 hover:bg-white/[0.07]">

            <div className="absolute right-[-30px] top-[-30px] h-32 w-32 rounded-full bg-fuchsia-500/15 blur-3xl" />

            <div className="relative flex items-center justify-between">

              <div>

                <p className="text-xs font-bold uppercase tracking-[0.15em] text-slate-500">
                  Lost Items
                </p>

                <p className="mt-3 text-4xl font-black">
                  {lostCount}
                </p>

                <p className="mt-2 text-xs text-slate-600">
                  Items you've lost
                </p>

              </div>

              <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-fuchsia-500/15 text-2xl">
                ⌖
              </div>

            </div>

          </div>

          {/* FOUND */}

          <div className="group relative overflow-hidden rounded-3xl border border-white/10 bg-white/[0.045] p-6 backdrop-blur-xl transition hover:-translate-y-1 hover:bg-white/[0.07]">

            <div className="absolute right-[-30px] top-[-30px] h-32 w-32 rounded-full bg-cyan-500/15 blur-3xl" />

            <div className="relative flex items-center justify-between">

              <div>

                <p className="text-xs font-bold uppercase tracking-[0.15em] text-slate-500">
                  Found Items
                </p>

                <p className="mt-3 text-4xl font-black">
                  {foundCount}
                </p>

                <p className="mt-2 text-xs text-slate-600">
                  Items you've found
                </p>

              </div>

              <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-cyan-500/15 text-2xl">
                ✓
              </div>

            </div>

          </div>

        </section>

        {/* =================================================
            MY ITEMS HEADER
        ================================================== */}

        <section className="mt-12">

          <div className="flex flex-col justify-between gap-3 sm:flex-row sm:items-end">

            <div>

              <p className="text-xs font-bold uppercase tracking-[0.2em] text-cyan-400">
                Your Activity
              </p>

              <h2 className="mt-1 text-3xl font-black tracking-tight">
                My Reported Items
              </h2>

              <p className="mt-2 text-sm text-slate-500">
                Items reported by you on LostLink.
              </p>

            </div>

            <div className="rounded-full border border-white/10 bg-white/[0.04] px-4 py-2 text-xs font-bold text-slate-400">
              {totalItems} report
              {totalItems !== 1 ? "s" : ""}
            </div>

          </div>

          {/* =================================================
              EMPTY STATE
          ================================================== */}

          {items.length === 0 ? (

            <div className="relative mt-6 overflow-hidden rounded-[30px] border border-white/10 bg-white/[0.04] px-6 py-20 text-center backdrop-blur-xl">

              <div className="absolute left-1/2 top-[-100px] h-56 w-56 -translate-x-1/2 rounded-full bg-violet-500/10 blur-3xl" />

              <div className="relative">

                <div className="mx-auto flex h-20 w-20 items-center justify-center rounded-3xl bg-gradient-to-br from-violet-500/20 to-cyan-400/10 text-4xl">
                  ✦
                </div>

                <h3 className="mt-6 text-2xl font-black">
                  No reports yet
                </h3>

                <p className="mx-auto mt-3 max-w-md text-sm leading-6 text-slate-500">
                  You haven't reported any lost or found
                  items yet. Start helping your community today.
                </p>

                <div className="mt-7 flex flex-col justify-center gap-3 sm:flex-row">

                  <button
                    onClick={() =>
                      navigate("/create-lost")
                    }
                    className="rounded-xl bg-gradient-to-r from-violet-500 to-indigo-500 px-6 py-3 text-sm font-black shadow-lg shadow-violet-500/20 transition hover:-translate-y-0.5"
                  >
                    Report Lost Item
                  </button>

                  <button
                    onClick={() =>
                      navigate("/create-found")
                    }
                    className="rounded-xl border border-white/10 bg-white/[0.05] px-6 py-3 text-sm font-black text-slate-300 transition hover:bg-white/10 hover:text-white"
                  >
                    Report Found Item
                  </button>

                </div>

              </div>

            </div>

          ) : (

            /* =================================================
               ITEMS GRID
            ================================================== */

            <div className="mt-6 grid gap-6 md:grid-cols-2 xl:grid-cols-3">

              {items.map((item) => {

                const isLost = item.type === "lost";

                return (

                  <article
                    key={item._id}
                    className="group overflow-hidden rounded-[28px] border border-white/10 bg-white/[0.045] shadow-xl shadow-black/20 backdrop-blur-xl transition duration-300 hover:-translate-y-2 hover:border-white/20 hover:bg-white/[0.07]"
                  >

                    {/* IMAGE */}

                    <div className="relative h-56 overflow-hidden bg-gradient-to-br from-[#11182e] to-[#080c18]">

                      {item.image ? (

                        <img
                          src={getImageUrl(item.image)}
                          alt={item.title || "Item"}
                          onError={(e) => {
                            e.currentTarget.style.display =
                              "none";
                          }}
                          className="h-full w-full object-cover transition duration-700 group-hover:scale-110"
                        />

                      ) : (

                        <div className="flex h-full items-center justify-center">

                          <div className="text-center">

                            <div className="text-5xl opacity-20">
                              {isLost ? "⌖" : "✓"}
                            </div>

                            <p className="mt-3 text-[10px] font-bold uppercase tracking-widest text-slate-600">
                              No Image
                            </p>

                          </div>

                        </div>

                      )}

                      <div className="absolute inset-0 bg-gradient-to-t from-[#050816] via-transparent to-black/20" />

                      {/* TYPE */}

                      <div className="absolute left-4 top-4">

                        <span
                          className={`rounded-full border px-3 py-1.5 text-[10px] font-black uppercase tracking-wider backdrop-blur-xl ${
                            isLost
                              ? "border-fuchsia-300/20 bg-fuchsia-500/20 text-fuchsia-200"
                              : "border-cyan-300/20 bg-cyan-500/20 text-cyan-200"
                          }`}
                        >
                          {isLost
                            ? "Lost Item"
                            : "Found Item"}
                        </span>

                      </div>

                      {/* STATUS */}

                      <div className="absolute right-4 top-4">

                        <span className="flex items-center gap-1.5 rounded-full border border-emerald-300/20 bg-emerald-500/15 px-3 py-1.5 text-[10px] font-black uppercase tracking-wider text-emerald-300 backdrop-blur-xl">

                          <span className="h-1.5 w-1.5 rounded-full bg-emerald-400" />

                          {item.status || "active"}

                        </span>

                      </div>

                      {/* TITLE */}

                      <div className="absolute bottom-4 left-4 right-4">

                        <h3 className="truncate text-xl font-black">
                          {item.title || "Untitled Item"}
                        </h3>

                        <p className="mt-1 text-xs text-slate-300/60">
                          {item.category || "Uncategorized"}
                        </p>

                      </div>

                    </div>

                    {/* CONTENT */}

                    <div className="p-5">

                      {/* DESCRIPTION */}

                      {item.description && (

                        <p className="min-h-[42px] line-clamp-2 text-sm leading-6 text-slate-400">
                          {item.description}
                        </p>

                      )}

                      {/* DETAILS */}

                      <div className="mt-4 grid grid-cols-2 gap-2">

                        <div className="rounded-xl border border-white/5 bg-white/[0.035] p-3">

                          <p className="text-[9px] font-bold uppercase tracking-wider text-slate-600">
                            Category
                          </p>

                          <p className="mt-1 truncate text-xs font-bold text-slate-300">
                            {item.category || "N/A"}
                          </p>

                        </div>

                        <div className="rounded-xl border border-white/5 bg-white/[0.035] p-3">

                          <p className="text-[9px] font-bold uppercase tracking-wider text-slate-600">
                            Color
                          </p>

                          <p className="mt-1 truncate text-xs font-bold text-slate-300">
                            {item.color || "N/A"}
                          </p>

                        </div>

                        <div className="rounded-xl border border-white/5 bg-white/[0.035] p-3">

                          <p className="text-[9px] font-bold uppercase tracking-wider text-slate-600">
                            Location
                          </p>

                          <p className="mt-1 truncate text-xs font-bold text-slate-300">
                            📍 {item.location || "N/A"}
                          </p>

                        </div>

                        <div className="rounded-xl border border-white/5 bg-white/[0.035] p-3">

                          <p className="text-[9px] font-bold uppercase tracking-wider text-slate-600">
                            Date
                          </p>

                          <p className="mt-1 truncate text-xs font-bold text-slate-300">
                            {formatDate(item.date)}
                          </p>

                        </div>

                      </div>

                      {/* ACTIONS */}

                      <div className="mt-5 grid grid-cols-2 gap-2">

                        <button
                          onClick={() =>
                            navigate(
                              "/item/" + item._id
                            )
                          }
                          className="rounded-xl bg-gradient-to-r from-violet-500 to-indigo-500 py-3 text-xs font-black text-white shadow-lg shadow-violet-500/10 transition hover:-translate-y-0.5"
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
                        className="mt-2 w-full rounded-xl border border-red-500/10 bg-red-500/5 py-2.5 text-xs font-bold text-red-400 transition hover:bg-red-500/10"
                      >
                        Delete Item
                      </button>

                    </div>

                  </article>

                );
              })}

            </div>

          )}

        </section>

        {/* =================================================
            BOTTOM CTA
        ================================================== */}

        <section className="relative mt-14 overflow-hidden rounded-[32px] border border-white/10 bg-gradient-to-r from-violet-600 via-indigo-600 to-cyan-600 p-8 shadow-2xl shadow-indigo-950/40 sm:p-10">

          <div className="absolute right-[-70px] top-[-70px] h-64 w-64 rounded-full bg-white/10 blur-3xl" />

          <div className="relative flex flex-col items-center justify-between gap-6 text-center lg:flex-row lg:text-left">

            <div>

              <p className="text-[10px] font-black uppercase tracking-[0.2em] text-white/60">
                LostLink Community
              </p>

              <h2 className="mt-2 text-2xl font-black sm:text-3xl">
                Ready to help someone find what matters?
              </h2>

              <p className="mt-2 max-w-xl text-sm text-white/60">
                Report a lost or found item and make a
                difference in your community.
              </p>

            </div>

            <div className="flex flex-col gap-3 sm:flex-row">

              <button
                onClick={() =>
                  navigate("/create-lost")
                }
                className="rounded-xl bg-white px-6 py-3 text-sm font-black text-indigo-700 shadow-xl transition hover:-translate-y-1"
              >
                Report Lost
              </button>

              <button
                onClick={() =>
                  navigate("/create-found")
                }
                className="rounded-xl border border-white/20 bg-white/10 px-6 py-3 text-sm font-black text-white backdrop-blur transition hover:bg-white/20"
              >
                Report Found
              </button>

            </div>

          </div>

        </section>

      </main>

      {/* =================================================
          FOOTER
      ================================================== */}

      <footer className="mt-12 border-t border-white/10 bg-[#03050d]/80">

        <div className="mx-auto flex max-w-[1400px] flex-col justify-between gap-4 px-5 py-8 text-sm sm:flex-row sm:items-center lg:px-8">

          <div>

            <div className="text-lg font-black">
              Lost<span className="text-cyan-400">Link</span>
            </div>

            <p className="mt-1 text-xs text-slate-600">
              Lost Today • Found Tomorrow.
            </p>

          </div>

          <p className="text-xs text-slate-600">
            © 2026 LostLink. Built to reconnect people with what matters.
          </p>

        </div>

      </footer>

    </div>
  );
}

export default Profile;