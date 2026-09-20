import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import API from "../api/api";

function ItemDetails() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [item, setItem] = useState(null);
  const [matches, setMatches] = useState([]);
  const [loading, setLoading] = useState(true);
  const [matchesLoading, setMatchesLoading] = useState(true);
  const [error, setError] = useState("");

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
  const fetchItem = async () => {
    try {
      setLoading(true);
      setError("");

      const response = await API.get(`/items/${id}`);

      if (response.data.success) {
        setItem(response.data.item);
      } else {
        setError("Item not found");
      }
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

  // ======================================
  // GET POSSIBLE MATCHES
  // ======================================
  const fetchMatches = async () => {
    try {
      setMatchesLoading(true);

      const response = await API.get(
        `/items/${id}/matches`
      );

      if (response.data.success) {
        setMatches(response.data.matches || []);
      }
    } catch (error) {
      console.error(
        "Fetch matches error:",
        error.response?.data || error.message
      );

      setMatches([]);
    } finally {
      setMatchesLoading(false);
    }
  };

  // ======================================
  // LOAD DATA
  // ======================================
  useEffect(() => {
    fetchItem();
    fetchMatches();
  }, [id]);

  // ======================================
  // LOADING
  // ======================================
  if (loading) {
    return (
      <div className="min-h-screen bg-[#050816] text-white flex items-center justify-center relative overflow-hidden">
        <div className="absolute w-96 h-96 bg-violet-600/20 blur-[120px] rounded-full -top-20 -left-20" />
        <div className="absolute w-96 h-96 bg-cyan-500/10 blur-[120px] rounded-full bottom-0 right-0" />

        <div className="relative text-center">
          <div className="w-14 h-14 mx-auto mb-5 rounded-2xl border border-white/10 bg-white/5 backdrop-blur-xl flex items-center justify-center">
            <div className="w-7 h-7 border-2 border-violet-400/30 border-t-violet-400 rounded-full animate-spin" />
          </div>

          <p className="text-white/60 text-sm">
            Loading item details...
          </p>
        </div>
      </div>
    );
  }

  // ======================================
  // ERROR
  // ======================================
  if (error || !item) {
    return (
      <div className="min-h-screen bg-[#050816] text-white px-5 py-10 relative overflow-hidden">
        <div className="absolute w-96 h-96 bg-red-500/10 blur-[130px] rounded-full top-0 right-0" />

        <div className="relative max-w-4xl mx-auto pt-10">
          <div className="rounded-3xl border border-red-400/20 bg-red-500/10 backdrop-blur-xl p-7 mb-6">
            <div className="text-4xl mb-4">⚠️</div>

            <h2 className="text-xl font-bold text-white mb-2">
              Unable to load item
            </h2>

            <p className="text-red-200/70">
              {error || "Item not found"}
            </p>
          </div>

          <button
            onClick={() => navigate("/dashboard")}
            className="px-6 py-3 rounded-xl bg-white/10 border border-white/10 hover:bg-white/15 transition-all text-white font-semibold"
          >
            ← Back to Dashboard
          </button>
        </div>
      </div>
    );
  }

  const formattedDate = item.date
    ? new Date(item.date).toLocaleDateString("en-IN", {
        day: "numeric",
        month: "short",
        year: "numeric",
      })
    : "N/A";

  return (
    <div className="min-h-screen bg-[#050816] text-white relative overflow-hidden">

      {/* ======================================
          BACKGROUND AURORA
      ====================================== */}
      <div className="fixed inset-0 pointer-events-none overflow-hidden">
        <div className="absolute w-[500px] h-[500px] bg-violet-600/15 blur-[140px] rounded-full -top-40 -left-40" />

        <div className="absolute w-[450px] h-[450px] bg-blue-600/10 blur-[140px] rounded-full top-[35%] -right-40" />

        <div className="absolute w-[400px] h-[400px] bg-cyan-500/8 blur-[140px] rounded-full bottom-0 left-[25%]" />
      </div>

      {/* ======================================
          MAIN CONTAINER
      ====================================== */}
      <main className="relative max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">

        {/* ==================================
            TOP BAR
        ================================== */}
        <div className="flex flex-wrap items-center justify-between gap-4 mb-8">

          <button
            onClick={() => navigate("/dashboard")}
            className="group flex items-center gap-2 px-4 py-2.5 rounded-xl bg-white/[0.05] border border-white/10 text-white/70 hover:text-white hover:bg-white/[0.09] hover:border-white/20 transition-all"
          >
            <span className="text-lg group-hover:-translate-x-1 transition-transform">
              ←
            </span>

            <span className="text-sm font-medium">
              Back to Dashboard
            </span>
          </button>

          <div className="flex items-center gap-2 text-xs text-white/40">
            <span>LostLink</span>
            <span>/</span>
            <span className="text-white/70">
              Item Details
            </span>
          </div>
        </div>

        {/* ==================================
            ITEM HERO CARD
        ================================== */}
        <section className="rounded-[28px] border border-white/10 bg-white/[0.045] backdrop-blur-2xl shadow-2xl overflow-hidden">

          {/* IMAGE AREA */}
          <div className="relative bg-black/20">

            {item.image ? (
              <div className="relative h-[280px] sm:h-[380px] lg:h-[460px] overflow-hidden">

                <img
                  src={getImageUrl(item.image)}
                  alt={item.title || "Item image"}
                  className="w-full h-full object-contain"
                  onError={(e) => {
                    e.currentTarget.style.display = "none";
                  }}
                />

                <div className="absolute inset-0 bg-gradient-to-t from-[#050816]/80 via-transparent to-transparent pointer-events-none" />

                <div className="absolute top-5 left-5">
                  <span
                    className={`px-4 py-2 rounded-full text-xs font-bold tracking-wide border backdrop-blur-xl ${
                      item.type === "lost"
                        ? "bg-red-500/15 text-red-300 border-red-400/20"
                        : "bg-emerald-500/15 text-emerald-300 border-emerald-400/20"
                    }`}
                  >
                    {item.type?.toUpperCase() || "ITEM"}
                  </span>
                </div>

                <div className="absolute top-5 right-5">
                  <span className="px-4 py-2 rounded-full bg-emerald-500/10 border border-emerald-400/20 text-emerald-300 text-xs font-semibold backdrop-blur-xl">
                    ● {item.status || "active"}
                  </span>
                </div>
              </div>
            ) : (
              <div className="h-[280px] sm:h-[380px] lg:h-[460px] flex flex-col items-center justify-center bg-gradient-to-br from-white/[0.04] to-transparent">

                <div className="w-20 h-20 rounded-3xl bg-white/5 border border-white/10 flex items-center justify-center mb-4">
                  <span className="text-4xl opacity-50">
                    📦
                  </span>
                </div>

                <p className="text-white/40 text-sm">
                  No image available
                </p>
              </div>
            )}
          </div>

          {/* CONTENT */}
          <div className="p-6 sm:p-8 lg:p-10">

            {/* TYPE / STATUS */}
            <div className="flex flex-wrap items-center gap-3 mb-5">

              <span
                className={`px-3 py-1.5 rounded-full text-[11px] font-bold tracking-wider ${
                  item.type === "lost"
                    ? "bg-red-500/10 text-red-300 border border-red-400/20"
                    : "bg-emerald-500/10 text-emerald-300 border border-emerald-400/20"
                }`}
              >
                {item.type?.toUpperCase() || "ITEM"}
              </span>

              <span className="px-3 py-1.5 rounded-full bg-white/5 border border-white/10 text-white/50 text-[11px]">
                Reported {formattedDate}
              </span>
            </div>

            {/* TITLE */}
            <div className="max-w-4xl">
              <h1 className="text-3xl sm:text-4xl lg:text-5xl font-black tracking-tight leading-tight">
                {item.title}
              </h1>

              <p className="mt-4 text-white/55 leading-7 max-w-3xl">
                {item.description ||
                  "No description available for this item."}
              </p>
            </div>

            {/* ==================================
                ITEM INFORMATION
            ================================== */}
            <div className="mt-10">

              <div className="flex items-center gap-3 mb-5">
                <div className="w-9 h-9 rounded-xl bg-violet-500/10 border border-violet-400/20 flex items-center justify-center">
                  <span>📋</span>
                </div>

                <div>
                  <h2 className="text-lg font-bold">
                    Item Information
                  </h2>

                  <p className="text-xs text-white/40">
                    Details about the reported item
                  </p>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">

                {/* CATEGORY */}
                <div className="group rounded-2xl border border-white/10 bg-white/[0.035] p-5 hover:bg-white/[0.06] hover:border-white/15 transition-all">
                  <div className="text-xs text-white/35 mb-2">
                    CATEGORY
                  </div>

                  <div className="font-semibold text-white capitalize">
                    {item.category || "N/A"}
                  </div>
                </div>

                {/* COLOR */}
                <div className="group rounded-2xl border border-white/10 bg-white/[0.035] p-5 hover:bg-white/[0.06] hover:border-white/15 transition-all">
                  <div className="text-xs text-white/35 mb-2">
                    COLOR
                  </div>

                  <div className="font-semibold text-white capitalize">
                    {item.color || "N/A"}
                  </div>
                </div>

                {/* LOCATION */}
                <div className="group rounded-2xl border border-white/10 bg-white/[0.035] p-5 hover:bg-white/[0.06] hover:border-white/15 transition-all">
                  <div className="text-xs text-white/35 mb-2">
                    LOCATION
                  </div>

                  <div className="font-semibold text-white">
                    {item.location || "N/A"}
                  </div>
                </div>

                {/* DATE */}
                <div className="group rounded-2xl border border-white/10 bg-white/[0.035] p-5 hover:bg-white/[0.06] hover:border-white/15 transition-all">
                  <div className="text-xs text-white/35 mb-2">
                    DATE
                  </div>

                  <div className="font-semibold text-white">
                    {formattedDate}
                  </div>
                </div>
              </div>
            </div>

            {/* ==================================
                OWNER
            ================================== */}
            <div className="mt-10 rounded-2xl border border-white/10 bg-gradient-to-r from-violet-500/[0.08] to-blue-500/[0.05] p-5 sm:p-6">

              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-5">

                <div className="flex items-center gap-4">

                  <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-violet-500 to-indigo-600 flex items-center justify-center font-black text-lg shadow-lg shadow-violet-500/20">
                    {(item.owner?.name || "U")
                      .charAt(0)
                      .toUpperCase()}
                  </div>

                  <div>
                    <p className="text-xs text-white/35 mb-1">
                      REPORTED BY
                    </p>

                    <h3 className="font-bold text-white">
                      {item.owner?.name || "User"}
                    </h3>

                    {item.owner?.email && (
                      <p className="text-sm text-white/45 mt-0.5">
                        {item.owner.email}
                      </p>
                    )}
                  </div>
                </div>

                <div className="px-4 py-2 rounded-xl bg-white/5 border border-white/10 text-xs text-white/45">
                  LostLink Member
                </div>
              </div>
            </div>

            {/* ==================================
                ACTIONS
            ================================== */}
            <div className="mt-8 flex flex-col sm:flex-row gap-3">

              <button
                onClick={() =>
                  navigate("/edit-item/" + item._id)
                }
                className="flex-1 sm:flex-none px-7 py-3.5 rounded-xl bg-gradient-to-r from-violet-600 to-indigo-600 hover:from-violet-500 hover:to-indigo-500 shadow-lg shadow-violet-600/20 transition-all font-semibold"
              >
                ✏️ Edit Item
              </button>

              <button
                onClick={() => navigate("/dashboard")}
                className="flex-1 sm:flex-none px-7 py-3.5 rounded-xl bg-white/[0.05] hover:bg-white/[0.09] border border-white/10 hover:border-white/20 transition-all font-semibold text-white/80"
              >
                View All Reports
              </button>
            </div>
          </div>
        </section>

        {/* ======================================
            POSSIBLE MATCHES
        ====================================== */}
        <section className="mt-8">

          {/* HEADER */}
          <div className="rounded-t-[28px] border border-white/10 bg-white/[0.045] backdrop-blur-2xl px-6 sm:px-8 py-6">

            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-5">

              <div className="flex items-start gap-4">

                <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-cyan-500/20 to-violet-500/20 border border-cyan-400/10 flex items-center justify-center text-xl">
                  🔍
                </div>

                <div>
                  <h2 className="text-xl sm:text-2xl font-bold">
                    Possible Matches
                  </h2>

                  <p className="text-sm text-white/40 mt-1">
                    Other{" "}
                    {item.type === "lost"
                      ? "found"
                      : "lost"}{" "}
                    reports that may match this item.
                  </p>
                </div>
              </div>

              {matches.length > 0 && (
                <span className="self-start sm:self-auto px-4 py-2 rounded-full bg-violet-500/10 border border-violet-400/20 text-violet-300 text-xs font-bold">
                  {matches.length} match
                  {matches.length > 1 ? "es" : ""}
                </span>
              )}
            </div>
          </div>

          {/* MATCH CONTENT */}
          <div className="border-x border-b border-white/10 rounded-b-[28px] bg-white/[0.025] p-5 sm:p-8">

            {/* MATCH LOADING */}
            {matchesLoading ? (
              <div className="py-16 flex flex-col items-center justify-center text-center">

                <div className="w-12 h-12 rounded-2xl border border-white/10 bg-white/5 flex items-center justify-center mb-4">
                  <div className="w-6 h-6 border-2 border-violet-400/20 border-t-violet-400 rounded-full animate-spin" />
                </div>

                <h3 className="font-semibold text-white">
                  Finding possible matches
                </h3>

                <p className="text-sm text-white/35 mt-2">
                  Our matching system is checking similar reports...
                </p>
              </div>

            ) : matches.length === 0 ? (

              /* NO MATCH */
              <div className="py-16 flex flex-col items-center justify-center text-center">

                <div className="w-20 h-20 rounded-3xl bg-white/5 border border-white/10 flex items-center justify-center text-4xl mb-5">
                  🔎
                </div>

                <h3 className="text-lg font-bold text-white">
                  No possible matches yet
                </h3>

                <p className="text-sm text-white/40 mt-2 max-w-md leading-6">
                  We couldn't find another report that
                  matches this item yet. New reports may
                  create a match later.
                </p>

                <button
                  onClick={() => navigate("/dashboard")}
                  className="mt-6 px-5 py-2.5 rounded-xl bg-white/5 border border-white/10 hover:bg-white/10 transition-all text-sm font-semibold"
                >
                  Browse Reports
                </button>
              </div>

            ) : (

              /* MATCH CARDS */
              <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-5">

                {matches.map((match) => {
                  const matchedItem = match.item;

                  return (
                    <div
                      key={matchedItem._id}
                      className="group rounded-2xl border border-white/10 bg-white/[0.04] overflow-hidden hover:bg-white/[0.065] hover:border-violet-400/20 hover:-translate-y-1 transition-all duration-300"
                    >

                      {/* IMAGE */}
                      <div className="relative h-52 bg-black/20">

                        {matchedItem.image ? (
                          <img
                            src={getImageUrl(
                              matchedItem.image
                            )}
                            alt={
                              matchedItem.title ||
                              "Matched item"
                            }
                            className="w-full h-full object-contain"
                            onError={(e) => {
                              e.currentTarget.style.display =
                                "none";
                            }}
                          />
                        ) : (
                          <div className="w-full h-full flex flex-col items-center justify-center text-white/30">
                            <span className="text-3xl mb-2">
                              📦
                            </span>
                            <span className="text-xs">
                              No Image
                            </span>
                          </div>
                        )}

                        <div className="absolute top-3 left-3">
                          <span
                            className={`px-3 py-1.5 rounded-full text-[10px] font-bold border backdrop-blur-xl ${
                              matchedItem.type === "lost"
                                ? "bg-red-500/15 text-red-300 border-red-400/20"
                                : "bg-emerald-500/15 text-emerald-300 border-emerald-400/20"
                            }`}
                          >
                            {matchedItem.type?.toUpperCase()}
                          </span>
                        </div>

                        {/* SCORE */}
                        <div className="absolute top-3 right-3">
                          <span className="px-3 py-1.5 rounded-full bg-violet-500/20 border border-violet-400/20 text-violet-200 text-[10px] font-bold backdrop-blur-xl">
                            {match.score}% Match
                          </span>
                        </div>
                      </div>

                      {/* CARD BODY */}
                      <div className="p-5">

                        <h3 className="text-lg font-bold text-white truncate">
                          {matchedItem.title}
                        </h3>

                        {/* REASONS */}
                        {match.reasons?.length > 0 && (
                          <div className="mt-4 rounded-xl bg-emerald-500/[0.06] border border-emerald-400/10 p-4">

                            <p className="text-[11px] font-bold text-emerald-300 uppercase tracking-wider mb-2">
                              Why it matches
                            </p>

                            <div className="space-y-1.5">
                              {match.reasons.map(
                                (reason, index) => (
                                  <div
                                    key={index}
                                    className="flex gap-2 text-xs text-emerald-200/70"
                                  >
                                    <span className="text-emerald-400">
                                      ✓
                                    </span>

                                    <span>
                                      {reason}
                                    </span>
                                  </div>
                                )
                              )}
                            </div>
                          </div>
                        )}

                        {/* DETAILS */}
                        <div className="mt-5 space-y-2.5 text-sm">

                          <div className="flex justify-between gap-3">
                            <span className="text-white/35">
                              Category
                            </span>

                            <span className="text-white/75 capitalize text-right">
                              {matchedItem.category ||
                                "N/A"}
                            </span>
                          </div>

                          <div className="flex justify-between gap-3">
                            <span className="text-white/35">
                              Color
                            </span>

                            <span className="text-white/75 capitalize text-right">
                              {matchedItem.color ||
                                "N/A"}
                            </span>
                          </div>

                          <div className="flex justify-between gap-3">
                            <span className="text-white/35">
                              Location
                            </span>

                            <span className="text-white/75 text-right">
                              {matchedItem.location ||
                                "N/A"}
                            </span>
                          </div>

                          <div className="flex justify-between gap-3">
                            <span className="text-white/35">
                              Date
                            </span>

                            <span className="text-white/75 text-right">
                              {matchedItem.date
                                ? new Date(
                                    matchedItem.date
                                  ).toLocaleDateString(
                                    "en-IN"
                                  )
                                : "N/A"}
                            </span>
                          </div>
                        </div>

                        {/* VIEW MATCH */}
                        <button
                          onClick={() =>
                            navigate(
                              "/item/" +
                                matchedItem._id
                            )
                          }
                          className="w-full mt-5 py-3 rounded-xl bg-gradient-to-r from-violet-600/80 to-indigo-600/80 hover:from-violet-500 hover:to-indigo-500 border border-violet-400/10 transition-all text-sm font-bold"
                        >
                          View Match →
                        </button>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        </section>

        {/* ======================================
            BOTTOM CTA
        ====================================== */}
        <section className="mt-8 rounded-[28px] border border-white/10 bg-gradient-to-r from-violet-600/15 via-indigo-600/10 to-cyan-500/10 p-7 sm:p-10 text-center">

          <div className="w-14 h-14 mx-auto rounded-2xl bg-white/5 border border-white/10 flex items-center justify-center text-2xl mb-4">
            ✨
          </div>

          <h2 className="text-2xl sm:text-3xl font-black">
            Help reunite what matters
          </h2>

          <p className="text-white/45 max-w-xl mx-auto mt-3 text-sm sm:text-base leading-6">
            Every report increases the chance of connecting
            a lost item with its rightful owner.
          </p>

          <div className="flex flex-col sm:flex-row justify-center gap-3 mt-6">

            <button
              onClick={() => navigate("/create-lost")}
              className="px-6 py-3 rounded-xl bg-gradient-to-r from-violet-600 to-indigo-600 hover:from-violet-500 hover:to-indigo-500 font-semibold shadow-lg shadow-violet-600/20 transition-all"
            >
              Report Lost Item
            </button>

            <button
              onClick={() => navigate("/create-found")}
              className="px-6 py-3 rounded-xl bg-white/5 hover:bg-white/10 border border-white/10 font-semibold transition-all"
            >
              Report Found Item
            </button>
          </div>
        </section>

        {/* FOOTER */}
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

export default ItemDetails;