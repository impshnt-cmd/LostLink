import { useEffect, useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import API from "../api/api";

function Navbar() {
  const navigate = useNavigate();
  const location = useLocation();

  const token = localStorage.getItem("token");

  const [unreadCount, setUnreadCount] = useState(0);
  const [menuOpen, setMenuOpen] = useState(false);

  // =========================
  // NOTIFICATION COUNT
  // =========================

  const fetchUnreadCount = async () => {
    if (!token) {
      setUnreadCount(0);
      return;
    }

    try {
      const response = await API.get(
        "/notifications/unread-count"
      );

      setUnreadCount(response.data.count || 0);
    } catch (error) {
      console.error(
        "Unread notification count error:",
        error
      );
    }
  };

  useEffect(() => {
    fetchUnreadCount();

    const interval = setInterval(() => {
      fetchUnreadCount();
    }, 10000);

    return () => clearInterval(interval);
  }, [token]);

  // =========================
  // LOGOUT
  // =========================

  const handleLogout = () => {
    localStorage.removeItem("token");
    alert("Logged out successfully!");
    navigate("/login");
    setMenuOpen(false);
  };

  // =========================
  // NAVIGATION
  // =========================

  const handleNavigate = (path) => {
    navigate(path);
    setMenuOpen(false);
  };

  // =========================
  // ACTIVE ROUTE
  // =========================

  const isActive = (path) => {
    return location.pathname === path;
  };

  return (
    <nav className="sticky top-0 z-50 border-b border-white/10 bg-[#050816]/80 text-white shadow-2xl backdrop-blur-2xl">

      {/* AURORA GLOW */}

      <div className="pointer-events-none absolute inset-0 overflow-hidden">

        <div className="absolute left-[10%] top-[-80px] h-40 w-40 rounded-full bg-violet-600/10 blur-3xl" />

        <div className="absolute right-[15%] top-[-80px] h-40 w-40 rounded-full bg-cyan-500/10 blur-3xl" />

      </div>

      {/* NAV CONTAINER */}

      <div className="relative mx-auto max-w-[1500px] px-5 lg:px-8">

        <div className="flex h-[76px] items-center justify-between gap-5">

          {/* =================================================
              LOGO
          ================================================== */}

          <button
            onClick={() => handleNavigate("/")}
            className="group flex shrink-0 items-center gap-3"
          >

            {/* Logo Icon */}

            <div className="relative">

              <div className="absolute inset-0 rounded-2xl bg-violet-500 opacity-30 blur-lg transition group-hover:opacity-60" />

              <div className="relative flex h-11 w-11 items-center justify-center rounded-2xl bg-gradient-to-br from-violet-500 via-indigo-500 to-cyan-400 shadow-lg shadow-violet-500/20 transition duration-300 group-hover:scale-105">

                <span className="text-xl font-black">
                  L
                </span>

              </div>

            </div>

            {/* Brand */}

            <div className="hidden text-left sm:block">

              <div className="text-xl font-black tracking-tight">

                Lost
                <span className="text-cyan-400">
                  Link
                </span>

              </div>

              <div className="mt-0.5 text-[9px] font-bold uppercase tracking-[0.28em] text-slate-500">
                Lost & Found Platform
              </div>

            </div>

          </button>

          {/* =================================================
              DESKTOP NAVIGATION
          ================================================== */}

          <div className="hidden items-center gap-1 lg:flex">

            {/* HOME */}

            <button
              onClick={() => handleNavigate("/")}
              className={`rounded-xl px-4 py-2.5 text-sm font-semibold transition ${
                isActive("/")
                  ? "bg-white/10 text-white"
                  : "text-slate-400 hover:bg-white/5 hover:text-white"
              }`}
            >
              Home
            </button>

            {token && (
              <>

                {/* DASHBOARD */}

                <button
                  onClick={() =>
                    handleNavigate("/dashboard")
                  }
                  className={`rounded-xl px-4 py-2.5 text-sm font-semibold transition ${
                    isActive("/dashboard")
                      ? "bg-violet-500/15 text-violet-300"
                      : "text-slate-400 hover:bg-white/5 hover:text-white"
                  }`}
                >
                  Dashboard
                </button>

                {/* REPORT LOST */}

                <button
                  onClick={() =>
                    handleNavigate("/create-lost")
                  }
                  className={`rounded-xl px-4 py-2.5 text-sm font-semibold transition ${
                    isActive("/create-lost")
                      ? "bg-fuchsia-500/15 text-fuchsia-300"
                      : "text-slate-400 hover:bg-white/5 hover:text-white"
                  }`}
                >
                  Report Lost
                </button>

                {/* REPORT FOUND */}

                <button
                  onClick={() =>
                    handleNavigate("/create-found")
                  }
                  className={`rounded-xl px-4 py-2.5 text-sm font-semibold transition ${
                    isActive("/create-found")
                      ? "bg-cyan-500/15 text-cyan-300"
                      : "text-slate-400 hover:bg-white/5 hover:text-white"
                  }`}
                >
                  Report Found
                </button>

              </>
            )}

          </div>

          {/* =================================================
              RIGHT SIDE
          ================================================== */}

          <div className="flex items-center gap-2">

            {token ? (
              <>

                {/* NOTIFICATIONS */}

                <button
                  onClick={() =>
                    handleNavigate("/notifications")
                  }
                  title="Notifications"
                  className={`group relative flex h-11 w-11 items-center justify-center rounded-xl border transition ${
                    isActive("/notifications")
                      ? "border-violet-400/30 bg-violet-500/15"
                      : "border-white/10 bg-white/[0.04] hover:border-violet-400/30 hover:bg-violet-500/10"
                  }`}
                >

                  <span className="text-lg transition group-hover:scale-110">
                    🔔
                  </span>

                  {/* unread badge */}

                  {unreadCount > 0 && (

                    <span className="absolute -right-1 -top-1 flex h-5 min-w-5 items-center justify-center rounded-full border-2 border-[#050816] bg-gradient-to-r from-fuchsia-500 to-red-500 px-1 text-[9px] font-black text-white shadow-lg">

                      {unreadCount > 99
                        ? "99+"
                        : unreadCount}

                    </span>

                  )}

                </button>

                {/* PROFILE */}

                <button
                  onClick={() =>
                    handleNavigate("/profile")
                  }
                  className={`hidden items-center gap-2 rounded-xl border px-3 py-2 transition md:flex ${
                    isActive("/profile")
                      ? "border-violet-400/30 bg-violet-500/10"
                      : "border-white/10 bg-white/[0.04] hover:bg-white/[0.08]"
                  }`}
                >

                  <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-gradient-to-br from-violet-500 to-cyan-400 text-xs font-black">
                    U
                  </div>

                  <span className="text-sm font-semibold text-slate-300">
                    Profile
                  </span>

                </button>

                {/* LOGOUT */}

                <button
                  onClick={handleLogout}
                  className="hidden rounded-xl border border-red-500/15 bg-red-500/5 px-4 py-2.5 text-sm font-bold text-red-300 transition hover:border-red-500/30 hover:bg-red-500/10 md:block"
                >
                  Logout
                </button>

              </>
            ) : (
              <>

                {/* LOGIN */}

                <button
                  onClick={() =>
                    handleNavigate("/login")
                  }
                  className={`hidden rounded-xl px-4 py-2.5 text-sm font-semibold transition sm:block ${
                    isActive("/login")
                      ? "bg-white/10 text-white"
                      : "text-slate-400 hover:bg-white/5 hover:text-white"
                  }`}
                >
                  Login
                </button>

                {/* REGISTER */}

                <button
                  onClick={() =>
                    handleNavigate("/register")
                  }
                  className="hidden rounded-xl bg-gradient-to-r from-violet-500 to-indigo-500 px-5 py-2.5 text-sm font-black text-white shadow-lg shadow-violet-500/20 transition hover:-translate-y-0.5 hover:shadow-violet-500/30 sm:block"
                >
                  Get Started
                </button>

              </>
            )}

            {/* MOBILE MENU */}

            <button
              onClick={() =>
                setMenuOpen(!menuOpen)
              }
              className="flex h-11 w-11 items-center justify-center rounded-xl border border-white/10 bg-white/[0.04] text-xl transition hover:bg-white/10 lg:hidden"
              aria-label="Open menu"
            >
              {menuOpen ? "✕" : "☰"}
            </button>

          </div>

        </div>

        {/* =================================================
            MOBILE MENU
        ================================================== */}

        {menuOpen && (

          <div className="border-t border-white/10 py-4 lg:hidden">

            <div className="flex flex-col gap-2">

              {/* HOME */}

              <button
                onClick={() =>
                  handleNavigate("/")
                }
                className={`flex items-center gap-3 rounded-xl px-4 py-3 text-left text-sm font-semibold transition ${
                  isActive("/")
                    ? "bg-white/10 text-white"
                    : "text-slate-400 hover:bg-white/5 hover:text-white"
                }`}
              >
                <span>🏠</span>
                Home
              </button>

              {token ? (
                <>

                  {/* DASHBOARD */}

                  <button
                    onClick={() =>
                      handleNavigate("/dashboard")
                    }
                    className={`flex items-center gap-3 rounded-xl px-4 py-3 text-left text-sm font-semibold transition ${
                      isActive("/dashboard")
                        ? "bg-violet-500/15 text-violet-300"
                        : "text-slate-400 hover:bg-white/5 hover:text-white"
                    }`}
                  >
                    <span>📊</span>
                    Dashboard
                  </button>

                  {/* REPORT LOST */}

                  <button
                    onClick={() =>
                      handleNavigate("/create-lost")
                    }
                    className={`flex items-center gap-3 rounded-xl px-4 py-3 text-left text-sm font-semibold transition ${
                      isActive("/create-lost")
                        ? "bg-fuchsia-500/15 text-fuchsia-300"
                        : "text-slate-400 hover:bg-white/5 hover:text-white"
                    }`}
                  >
                    <span>🔴</span>
                    Report Lost
                  </button>

                  {/* REPORT FOUND */}

                  <button
                    onClick={() =>
                      handleNavigate("/create-found")
                    }
                    className={`flex items-center gap-3 rounded-xl px-4 py-3 text-left text-sm font-semibold transition ${
                      isActive("/create-found")
                        ? "bg-cyan-500/15 text-cyan-300"
                        : "text-slate-400 hover:bg-white/5 hover:text-white"
                    }`}
                  >
                    <span>🟢</span>
                    Report Found
                  </button>

                  {/* NOTIFICATIONS */}

                  <button
                    onClick={() =>
                      handleNavigate("/notifications")
                    }
                    className={`flex items-center justify-between rounded-xl px-4 py-3 text-left text-sm font-semibold transition ${
                      isActive("/notifications")
                        ? "bg-violet-500/15 text-violet-300"
                        : "text-slate-400 hover:bg-white/5 hover:text-white"
                    }`}
                  >

                    <span className="flex items-center gap-3">
                      <span>🔔</span>
                      Notifications
                    </span>

                    {unreadCount > 0 && (

                      <span className="rounded-full bg-gradient-to-r from-fuchsia-500 to-red-500 px-2.5 py-1 text-[10px] font-black text-white">
                        {unreadCount > 99
                          ? "99+"
                          : unreadCount}
                      </span>

                    )}

                  </button>

                  {/* PROFILE */}

                  <button
                    onClick={() =>
                      handleNavigate("/profile")
                    }
                    className={`flex items-center gap-3 rounded-xl px-4 py-3 text-left text-sm font-semibold transition ${
                      isActive("/profile")
                        ? "bg-violet-500/15 text-violet-300"
                        : "text-slate-400 hover:bg-white/5 hover:text-white"
                    }`}
                  >
                    <span>👤</span>
                    Profile
                  </button>

                  {/* LOGOUT */}

                  <button
                    onClick={handleLogout}
                    className="mt-1 flex items-center gap-3 rounded-xl border border-red-500/10 bg-red-500/5 px-4 py-3 text-left text-sm font-bold text-red-300 transition hover:bg-red-500/10"
                  >
                    <span>🚪</span>
                    Logout
                  </button>

                </>
              ) : (
                <>

                  {/* LOGIN */}

                  <button
                    onClick={() =>
                      handleNavigate("/login")
                    }
                    className="flex items-center gap-3 rounded-xl px-4 py-3 text-left text-sm font-semibold text-slate-400 transition hover:bg-white/5 hover:text-white"
                  >
                    <span>🔐</span>
                    Login
                  </button>

                  {/* REGISTER */}

                  <button
                    onClick={() =>
                      handleNavigate("/register")
                    }
                    className="flex items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-violet-500 to-indigo-500 px-4 py-3 text-sm font-black text-white shadow-lg shadow-violet-500/20"
                  >
                    <span>✨</span>
                    Create Account
                  </button>

                </>
              )}

            </div>

          </div>

        )}

      </div>

    </nav>
  );
}

export default Navbar;