
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import API from "../api/api";

function Dashboard() {
  const navigate = useNavigate();

  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [deletingId, setDeletingId] = useState(null);

  // ======================================
  // SEARCH & FILTER STATES
  // ======================================
  const [search, setSearch] = useState("");
  const [typeFilter, setTypeFilter] = useState("all");
  const [categoryFilter, setCategoryFilter] = useState("all");
  const [colorFilter, setColorFilter] = useState("all");
  const [locationFilter, setLocationFilter] = useState("all");

  // ======================================
  // FETCH ALL ITEMS
  // ======================================
  const fetchItems = async () => {
    try {
      setLoading(true);
      setError("");

      const response = await API.get("/items");

      console.log("Items response:", response.data);

      setItems(response.data.items || []);
    } catch (error) {
      console.error(
        "Fetch items error:",
        error.response?.data || error.message
      );

      setError(
        error.response?.data?.message ||
          "Failed to load lost items"
      );
    } finally {
      setLoading(false);
    }
  };

  // ======================================
  // LOAD ITEMS
  // ======================================
  useEffect(() => {
    fetchItems();
  }, []);

  // ======================================
  // LOGOUT
  // ======================================
  const handleLogout = () => {
    localStorage.removeItem("token");

    alert("Logged out successfully!");

    navigate("/login");
  };

  // ======================================
  // DELETE ITEM
  // ======================================
  const handleDelete = async (id) => {
    const confirmDelete = window.confirm(
      "Are you sure you want to delete this item?"
    );

    if (!confirmDelete) {
      return;
    }

    try {
      setDeletingId(id);

      const response = await API.delete("/items/" + id);

      console.log("Delete response:", response.data);

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

  // ======================================
  // GET UNIQUE CATEGORIES
  // ======================================
  const categories = [
    ...new Set(
      items
        .map((item) => item.category)
        .filter(Boolean)
    ),
  ];

  // ======================================
  // GET UNIQUE COLORS
  // ======================================
  const colors = [
    ...new Set(
      items
        .map((item) => item.color)
        .filter(Boolean)
    ),
  ];

  // ======================================
  // GET UNIQUE LOCATIONS
  // ======================================
  const locations = [
    ...new Set(
      items
        .map((item) => item.location)
        .filter(Boolean)
    ),
  ];

  // ======================================
  // DASHBOARD STATISTICS
  // ======================================
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

  // ======================================
  // FILTER ITEMS
  // ======================================
  const filteredItems = items.filter((item) => {
    const searchText = search.toLowerCase().trim();

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

  // ======================================
  // RESET FILTERS
  // ======================================
  const handleResetFilters = () => {
    setSearch("");
    setTypeFilter("all");
    setCategoryFilter("all");
    setColorFilter("all");
    setLocationFilter("all");
  };

  // ======================================
  // IMAGE URL
  // ======================================
  const getImageUrl = (image) => {
    if (!image) {
      return "";
    }

    if (
      image.startsWith("http://") ||
      image.startsWith("https://")
    ) {
      return image;
    }

    return "http://localhost:5000" + image;
  };

  // ======================================
  // HANDLE IMAGE ERROR
  // ======================================
  const handleImageError = (event) => {
    event.currentTarget.style.display = "none";
  };

  return (
    <div className="min-h-screen bg-gray-100 py-10 px-4">
      <div className="max-w-6xl mx-auto">

        {/* ======================================
            HEADER
        ====================================== */}
        <div className="mb-8">
          <div className="flex justify-between items-center">

            <div>
              <h1 className="text-3xl font-bold text-gray-800">
                Lost & Found Dashboard
              </h1>

              <p className="text-gray-500 mt-2">
                View recently reported lost and found items.
              </p>
            </div>

            <button
              onClick={handleLogout}
              className="bg-red-600 text-white px-5 py-3 rounded-lg font-semibold hover:bg-red-700 transition"
            >
              Logout
            </button>

          </div>
        </div>

        {/* ======================================
            DASHBOARD STATISTICS
        ====================================== */}
        {!loading && !error && (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">

            {/* Total Reports */}
            <div className="bg-white rounded-xl shadow-md p-6">
              <div className="flex items-center justify-between">

                <div>
                  <p className="text-gray-500 text-sm font-semibold">
                    Total Reports
                  </p>

                  <h2 className="text-3xl font-bold text-gray-800 mt-2">
                    {totalReports}
                  </h2>
                </div>

                <div className="bg-blue-100 text-blue-600 w-12 h-12 rounded-full flex items-center justify-center text-xl font-bold">
                  T
                </div>

              </div>
            </div>

            {/* Lost Items */}
            <div className="bg-white rounded-xl shadow-md p-6">
              <div className="flex items-center justify-between">

                <div>
                  <p className="text-gray-500 text-sm font-semibold">
                    Lost Items
                  </p>

                  <h2 className="text-3xl font-bold text-red-600 mt-2">
                    {lostItems}
                  </h2>
                </div>

                <div className="bg-red-100 text-red-600 w-12 h-12 rounded-full flex items-center justify-center text-xl font-bold">
                  L
                </div>

              </div>
            </div>

            {/* Found Items */}
            <div className="bg-white rounded-xl shadow-md p-6">
              <div className="flex items-center justify-between">

                <div>
                  <p className="text-gray-500 text-sm font-semibold">
                    Found Items
                  </p>

                  <h2 className="text-3xl font-bold text-green-600 mt-2">
                    {foundItems}
                  </h2>
                </div>

                <div className="bg-green-100 text-green-600 w-12 h-12 rounded-full flex items-center justify-center text-xl font-bold">
                  F
                </div>

              </div>
            </div>

            {/* Active Reports */}
            <div className="bg-white rounded-xl shadow-md p-6">
              <div className="flex items-center justify-between">

                <div>
                  <p className="text-gray-500 text-sm font-semibold">
                    Active Reports
                  </p>

                  <h2 className="text-3xl font-bold text-yellow-600 mt-2">
                    {activeItems}
                  </h2>
                </div>

                <div className="bg-yellow-100 text-yellow-600 w-12 h-12 rounded-full flex items-center justify-center text-xl font-bold">
                  A
                </div>

              </div>
            </div>

          </div>
        )}

        {/* ======================================
            SEARCH & FILTERS
        ====================================== */}
        {!loading &&
          !error &&
          items.length > 0 && (
            <div className="bg-white rounded-xl shadow-md p-6 mb-8">

              <h2 className="text-xl font-bold text-gray-800 mb-5">
                Search & Filter
              </h2>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">

                {/* Search */}
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Search
                  </label>

                  <input
                    type="text"
                    value={search}
                    onChange={(e) =>
                      setSearch(e.target.value)
                    }
                    placeholder="Search..."
                    className="w-full border border-gray-300 rounded-lg px-4 py-3 outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>

                {/* Type */}
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Type
                  </label>

                  <select
                    value={typeFilter}
                    onChange={(e) =>
                      setTypeFilter(e.target.value)
                    }
                    className="w-full border border-gray-300 rounded-lg px-4 py-3 outline-none focus:ring-2 focus:ring-blue-500"
                  >
                    <option value="all">
                      All Items
                    </option>

                    <option value="lost">
                      Lost
                    </option>

                    <option value="found">
                      Found
                    </option>
                  </select>
                </div>

                {/* Category */}
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Category
                  </label>

                  <select
                    value={categoryFilter}
                    onChange={(e) =>
                      setCategoryFilter(e.target.value)
                    }
                    className="w-full border border-gray-300 rounded-lg px-4 py-3 outline-none focus:ring-2 focus:ring-blue-500"
                  >
                    <option value="all">
                      All Categories
                    </option>

                    {categories.map((category) => (
                      <option
                        key={category}
                        value={category}
                      >
                        {category}
                      </option>
                    ))}
                  </select>
                </div>

                {/* Color */}
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Color
                  </label>

                  <select
                    value={colorFilter}
                    onChange={(e) =>
                      setColorFilter(e.target.value)
                    }
                    className="w-full border border-gray-300 rounded-lg px-4 py-3 outline-none focus:ring-2 focus:ring-blue-500"
                  >
                    <option value="all">
                      All Colors
                    </option>

                    {colors.map((color) => (
                      <option
                        key={color}
                        value={color}
                      >
                        {color}
                      </option>
                    ))}
                  </select>
                </div>

                {/* Location */}
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Location
                  </label>

                  <select
                    value={locationFilter}
                    onChange={(e) =>
                      setLocationFilter(e.target.value)
                    }
                    className="w-full border border-gray-300 rounded-lg px-4 py-3 outline-none focus:ring-2 focus:ring-blue-500"
                  >
                    <option value="all">
                      All Locations
                    </option>

                    {locations.map((location) => (
                      <option
                        key={location}
                        value={location}
                      >
                        {location}
                      </option>
                    ))}
                  </select>
                </div>

              </div>

              {/* Filter Bottom */}
              <div className="flex justify-between items-center mt-5">

                <p className="text-sm text-gray-500">
                  Showing{" "}
                  <span className="font-semibold text-gray-700">
                    {filteredItems.length}
                  </span>{" "}
                  of{" "}
                  <span className="font-semibold text-gray-700">
                    {items.length}
                  </span>{" "}
                  items
                </p>

                <button
                  onClick={handleResetFilters}
                  className="bg-gray-600 text-white px-5 py-2 rounded-lg font-semibold hover:bg-gray-700 transition"
                >
                  Reset Filters
                </button>

              </div>

            </div>
          )}

        {/* ======================================
            LOADING
        ====================================== */}
        {loading && (
          <div className="bg-white p-6 rounded-xl shadow text-center">
            <p className="text-gray-600">
              Loading items...
            </p>
          </div>
        )}

        {/* ======================================
            ERROR
        ====================================== */}
        {!loading && error && (
          <div className="bg-red-100 text-red-700 p-4 rounded-lg mb-6">
            {error}
          </div>
        )}

        {/* ======================================
            NO ITEMS
        ====================================== */}
        {!loading &&
          !error &&
          items.length === 0 && (
            <div className="bg-white p-8 rounded-xl shadow text-center">

              <h2 className="text-xl font-semibold text-gray-700">
                No items reported yet
              </h2>

              <p className="text-gray-500 mt-2">
                Report a lost or found item to see it here.
              </p>

            </div>
          )}

        {/* ======================================
            NO FILTER RESULTS
        ====================================== */}
        {!loading &&
          !error &&
          items.length > 0 &&
          filteredItems.length === 0 && (
            <div className="bg-white p-8 rounded-xl shadow text-center">

              <h2 className="text-xl font-semibold text-gray-700">
                No matching items found
              </h2>

              <p className="text-gray-500 mt-2">
                Try changing your search or filters.
              </p>

              <button
                onClick={handleResetFilters}
                className="mt-5 bg-blue-600 text-white px-5 py-2 rounded-lg font-semibold hover:bg-blue-700 transition"
              >
                Clear Filters
              </button>

            </div>
          )}

        {/* ======================================
            ITEMS
        ====================================== */}
        {!loading &&
          !error &&
          filteredItems.length > 0 && (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">

              {filteredItems.map((item) => (
                <div
                  key={item._id}
                  className="bg-white rounded-xl shadow-md p-6"
                >

                  {/* ======================================
                      ITEM IMAGE
                  ====================================== */}
                  {item.image ? (
                    <img
                      src={getImageUrl(item.image)}
                      alt={item.title || "Item image"}
                      className="w-full h-52 object-cover rounded-lg mb-5"
                      onError={handleImageError}
                    />
                  ) : (
                    <div className="w-full h-52 bg-gray-200 rounded-lg mb-5 flex items-center justify-center">
                      <div className="text-center">

                        <div className="text-4xl mb-2">
                          📷
                        </div>

                        <p className="text-gray-500">
                          No Image Available
                        </p>

                      </div>
                    </div>
                  )}

                  {/* Type and Status */}
                  <div className="flex justify-between items-center mb-4">

                    <span
                      className={
                        "px-3 py-1 rounded-full text-sm font-semibold " +
                        (item.type === "lost"
                          ? "bg-red-100 text-red-700"
                          : "bg-green-100 text-green-700")
                      }
                    >
                      {item.type
                        ? item.type.toUpperCase()
                        : "UNKNOWN"}
                    </span>

                    <span className="text-sm text-gray-500">
                      {item.status || "active"}
                    </span>

                  </div>

                  {/* Title */}
                  <h2 className="text-xl font-bold text-gray-800 mb-2">
                    {item.title}
                  </h2>

                  {/* Description */}
                  <p className="text-gray-600 mb-4">
                    {item.description}
                  </p>

                  {/* Details */}
                  <div className="space-y-2 text-sm">

                    <p>
                      <strong>Category:</strong>{" "}
                      {item.category}
                    </p>

                    {item.color && (
                      <p>
                        <strong>Color:</strong>{" "}
                        {item.color}
                      </p>
                    )}

                    <p>
                      <strong>Location:</strong>{" "}
                      {item.location}
                    </p>

                    <p>
                      <strong>Date:</strong>{" "}
                      {item.date
                        ? new Date(
                            item.date
                          ).toLocaleDateString()
                        : "N/A"}
                    </p>

                  </div>

                  {/* Owner */}
                  {item.owner && (
                    <div className="border-t mt-5 pt-4 text-sm text-gray-500">

                      Reported by:{" "}

                      <span className="font-medium text-gray-700">
                        {item.owner.name}
                      </span>

                    </div>
                  )}

                  {/* View Details */}
                  <button
                    onClick={() =>
                      navigate("/item/" + item._id)
                    }
                    className="w-full mt-5 bg-blue-600 text-white py-3 rounded-lg font-semibold hover:bg-blue-700 transition"
                  >
                    View Details
                  </button>

                  {/* Edit Item */}
                  <button
                    onClick={() =>
                      navigate("/edit-item/" + item._id)
                    }
                    className="w-full mt-3 bg-yellow-500 text-white py-3 rounded-lg font-semibold hover:bg-yellow-600 transition"
                  >
                    Edit Item
                  </button>

                  {/* Delete Item */}
                  <button
                    onClick={() =>
                      handleDelete(item._id)
                    }
                    disabled={
                      deletingId === item._id
                    }
                    className="w-full mt-3 bg-red-600 text-white py-3 rounded-lg font-semibold hover:bg-red-700 transition disabled:bg-gray-400"
                  >
                    {deletingId === item._id
                      ? "Deleting..."
                      : "Delete Item"}
                  </button>

                </div>
              ))}

            </div>
          )}

      </div>
    </div>
  );
}

export default Dashboard;




    
