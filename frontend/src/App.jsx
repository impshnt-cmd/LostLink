import { BrowserRouter, Routes, Route } from "react-router-dom";

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
return ( <div className="min-h-screen bg-gray-100 flex items-center justify-center px-4"> <div className="text-center">

```
    <h1 className="text-5xl font-bold text-blue-600">
      LostLink
    </h1>

    <p className="text-gray-600 text-lg mt-4">
      AI Powered Lost & Found Platform
    </p>

    <p className="text-gray-500 mt-2">
      Find what you lost. Return what you found.
    </p>

  </div>
</div>

);
}

function App() {
return ( <BrowserRouter>


  {/* Common Navbar */}
  <Navbar />

  <Routes>

    {/* ==============================
        PUBLIC ROUTES
    ============================== */}

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

    {/* ==============================
        PROTECTED ROUTES
    ============================== */}

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

</BrowserRouter>


);
}

export default App;
