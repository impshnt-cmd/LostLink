
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import API from "../api/api";

function Navbar() {
  const navigate = useNavigate();

  const token = localStorage.getItem("token");

  const [unreadCount, setUnreadCount] = useState(0);
  const [menuOpen, setMenuOpen] = useState(false);

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

  const handleLogout = () => {
    localStorage.removeItem("token");
    alert("Logged out successfully!");
    navigate("/login");
    setMenuOpen(false);
  };

  const handleNavigate = (path) => {
    navigate(path);
    setMenuOpen(false);
  };

  return (
    <nav className="bg-blue-600 text-white shadow-md">
      <div className="max-w-6xl mx-auto px-4 py-4">

        <div className="flex justify-between items-center">

          {/* Logo */}
          <button
            onClick={() => handleNavigate("/")}
            className="text-2xl font-bold"
          >
            LostLink
          </button>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center gap-2">

            <button
              onClick={() => navigate("/")}
              className="px-3 py-2 rounded-lg hover:bg-blue-700 transition"
            >
              Home
            </button>

            {token && (
              <>
                <button
                  onClick={() => navigate("/dashboard")}
                  className="px-3 py-2 rounded-lg hover:bg-blue-700 transition"
                >
                  Dashboard
                </button>

                <button
                  onClick={() => navigate("/create-lost")}
                  className="px-3 py-2 rounded-lg hover:bg-blue-700 transition"
                >
                  Report Lost
                </button>

                <button
                  onClick={() => navigate("/create-found")}
                  className="px-3 py-2 rounded-lg hover:bg-blue-700 transition"
                >
                  Report Found
                </button>

                {/* Notification Bell */}
                <button
                  onClick={() => navigate("/notifications")}
                  className="relative px-3 py-2 rounded-lg hover:bg-blue-700 transition text-xl"
                  title="Notifications"
                >
                  🔔

                  {unreadCount > 0 && (
                    <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs font-bold rounded-full min-w-[20px] h-5 px-1 flex items-center justify-center">
                      {unreadCount > 99
                        ? "99+"
                        : unreadCount}
                    </span>
                  )}
                </button>

                <button
                  onClick={() => navigate("/profile")}
                  className="px-3 py-2 rounded-lg hover:bg-blue-700 transition"
                >
                  Profile
                </button>

                <button
                  onClick={handleLogout}
                  className="bg-red-500 px-4 py-2 rounded-lg font-semibold hover:bg-red-600 transition"
                >
                  Logout
                </button>
              </>
            )}

            {!token && (
              <>
                <button
                  onClick={() => navigate("/login")}
                  className="px-3 py-2 rounded-lg hover:bg-blue-700 transition"
                >
                  Login
                </button>

                <button
                  onClick={() => navigate("/register")}
                  className="bg-white text-blue-600 px-4 py-2 rounded-lg font-semibold hover:bg-gray-100 transition"
                >
                  Register
                </button>
              </>
            )}
          </div>

          {/* Mobile Menu Button */}
          <button
            onClick={() => setMenuOpen(!menuOpen)}
            className="md:hidden text-2xl px-2"
          >
            ☰
          </button>
        </div>

        {/* Mobile Navigation */}
        {menuOpen && (
          <div className="md:hidden mt-4 flex flex-col gap-2">

            <button
              onClick={() => handleNavigate("/")}
              className="text-left px-4 py-3 rounded-lg hover:bg-blue-700"
            >
              🏠 Home
            </button>

            {token && (
              <>
                <button
                  onClick={() => handleNavigate("/dashboard")}
                  className="text-left px-4 py-3 rounded-lg hover:bg-blue-700"
                >
                  📊 Dashboard
                </button>

                <button
                  onClick={() => handleNavigate("/create-lost")}
                  className="text-left px-4 py-3 rounded-lg hover:bg-blue-700"
                >
                  🔴 Report Lost
                </button>

                <button
                  onClick={() => handleNavigate("/create-found")}
                  className="text-left px-4 py-3 rounded-lg hover:bg-blue-700"
                >
                  🟢 Report Found
                </button>

                <button
                  onClick={() => handleNavigate("/notifications")}
                  className="relative text-left px-4 py-3 rounded-lg hover:bg-blue-700"
                >
                  🔔 Notifications

                  {unreadCount > 0 && (
                    <span className="ml-2 bg-red-500 text-white text-xs font-bold rounded-full px-2 py-1">
                      {unreadCount > 99
                        ? "99+"
                        : unreadCount}
                    </span>
                  )}
                </button>

                <button
                  onClick={() => handleNavigate("/profile")}
                  className="text-left px-4 py-3 rounded-lg hover:bg-blue-700"
                >
                  👤 Profile
                </button>

                <button
                  onClick={handleLogout}
                  className="text-left px-4 py-3 rounded-lg bg-red-500 hover:bg-red-600"
                >
                  🚪 Logout
                </button>
              </>
            )}

            {!token && (
              <>
                <button
                  onClick={() => handleNavigate("/login")}
                  className="text-left px-4 py-3 rounded-lg hover:bg-blue-700"
                >
                  🔐 Login
                </button>

                <button
                  onClick={() => handleNavigate("/register")}
                  className="text-left px-4 py-3 rounded-lg bg-white text-blue-600"
                >
                  📝 Register
                </button>
              </>
            )}
          </div>
        )}
      </div>
    </nav>
  );
}

export default Navbar;

