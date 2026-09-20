import {
  BrowserRouter,
  Routes,
  Route,
  useLocation,
} from "react-router-dom";

import Register from "./pages/Register";
import Login from "./pages/Login";
import Profile from "./pages/Profile";
import LostItem from "./pages/LostItem";
import FoundItem from "./pages/FoundItem";
import Dashboard from "./pages/Dashboard";
import ItemDetails from "./pages/ItemDetails";
import EditItem from "./pages/EditItem";
import Notifications from "./pages/Notifications";

import ProtectedRoute from "./components/ProtectedRoute";
import Navbar from "./components/Navbar";

function Home() {
  return (
    <div className="min-h-screen flex items-center justify-center px-6 relative overflow-hidden">

      {/* Background decoration */}
      <div className="absolute top-10 left-10 w-72 h-72 bg-indigo-300/20 rounded-full blur-3xl"></div>

      <div className="absolute bottom-10 right-10 w-80 h-80 bg-blue-300/20 rounded-full blur-3xl"></div>

      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-purple-200/20 rounded-full blur-3xl"></div>

      {/* Main Content */}
      <div className="relative text-center max-w-4xl">

        {/* Community Badge */}
        <div className="inline-flex items-center gap-2 px-5 py-2 rounded-full bg-white/70 backdrop-blur-md border border-indigo-100 shadow-sm mb-7">

          <span className="w-2.5 h-2.5 bg-green-500 rounded-full animate-pulse"></span>

          <span className="text-sm font-semibold tracking-wide text-indigo-700">
            YOUR LOST & FOUND COMMUNITY
          </span>

        </div>

        {/* Logo */}
        <h1 className="text-6xl md:text-8xl font-extrabold tracking-tight">

          <span className="text-gray-900">
            Lost
          </span>

          <span className="text-indigo-600">
            Link
          </span>

        </h1>

        {/* Subtitle */}
        <p className="text-xl md:text-2xl font-semibold text-gray-700 mt-6">
          AI Powered Lost & Found Platform
        </p>

        {/* Description */}
        <p className="text-gray-500 text-lg md:text-xl mt-4 max-w-2xl mx-auto leading-relaxed">
          Find what you lost. Return what you found.
          <br />
          Together, we can reconnect people with what matters.
        </p>

        {/* Buttons */}
        <div className="flex flex-col sm:flex-row justify-center gap-4 mt-9">

          <a
            href="/create-lost"
            className="
              px-8 py-4
              rounded-xl
              bg-indigo-600
              text-white
              font-semibold
              shadow-lg
              shadow-indigo-200
              hover:bg-indigo-700
              hover:-translate-y-1
              transition-all
              duration-300
            "
          >
            🔎 Report Lost Item
          </a>

          <a
            href="/create-found"
            className="
              px-8 py-4
              rounded-xl
              bg-white/80
              backdrop-blur-md
              border
              border-gray-200
              text-gray-800
              font-semibold
              shadow-md
              hover:-translate-y-1
              hover:shadow-lg
              transition-all
              duration-300
            "
          >
            🤝 Report Found Item
          </a>

        </div>

        {/* Small feature cards */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mt-12">

          <div className="bg-white/60 backdrop-blur-md border border-white/70 rounded-2xl p-5 shadow-sm hover:shadow-md transition-all">
            <div className="text-2xl mb-2">🔎</div>

            <h3 className="font-bold text-gray-800">
              Easy Search
            </h3>

            <p className="text-sm text-gray-500 mt-1">
              Find reported items quickly.
            </p>
          </div>

          <div className="bg-white/60 backdrop-blur-md border border-white/70 rounded-2xl p-5 shadow-sm hover:shadow-md transition-all">
            <div className="text-2xl mb-2">🤝</div>

            <h3 className="font-bold text-gray-800">
              Community
            </h3>

            <p className="text-sm text-gray-500 mt-1">
              Help others recover belongings.
            </p>
          </div>

          <div className="bg-white/60 backdrop-blur-md border border-white/70 rounded-2xl p-5 shadow-sm hover:shadow-md transition-all">
            <div className="text-2xl mb-2">⚡</div>

            <h3 className="font-bold text-gray-800">
              Fast & Simple
            </h3>

            <p className="text-sm text-gray-500 mt-1">
              Report lost or found items easily.
            </p>
          </div>

        </div>

      </div>
    </div>
  );
}

function AppContent() {
  const location = useLocation();

  // Dashboard has its own redesigned header
  const isDashboard = location.pathname === "/dashboard";

  return (
    <>
      {/* Navbar */}
      {!isDashboard && <Navbar />}

      <Routes>

        {/* ================= PUBLIC ROUTES ================= */}

        <Route
          path="/"
          element={<Home />}
        />

        <Route
          path="/register"
          element={<Register />}
        />

        <Route
          path="/login"
          element={<Login />}
        />

        {/* ================= PROTECTED ROUTES ================= */}

        <Route
          path="/profile"
          element={
            <ProtectedRoute>
              <Profile />
            </ProtectedRoute>
          }
        />

        <Route
          path="/create-lost"
          element={
            <ProtectedRoute>
              <LostItem />
            </ProtectedRoute>
          }
        />

        <Route
          path="/create-found"
          element={
            <ProtectedRoute>
              <FoundItem />
            </ProtectedRoute>
          }
        />

        <Route
          path="/dashboard"
          element={
            <ProtectedRoute>
              <Dashboard />
            </ProtectedRoute>
          }
        />

        <Route
          path="/item/:id"
          element={
            <ProtectedRoute>
              <ItemDetails />
            </ProtectedRoute>
          }
        />

        <Route
          path="/edit-item/:id"
          element={
            <ProtectedRoute>
              <EditItem />
            </ProtectedRoute>
          }
        />

        <Route
          path="/notifications"
          element={
            <ProtectedRoute>
              <Notifications />
            </ProtectedRoute>
          }
        />

      </Routes>
    </>
  );
}

function App() {
  return (
    <BrowserRouter>
      <AppContent />
    </BrowserRouter>
  );
}

export default App;