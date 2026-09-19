
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

    if (!confirmDelete) {
      return;
    }

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

    return "http://localhost:5000" + image;
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

  // ======================================
  // LOADING
  // ======================================
  if (loading) {
    return (
      <div style={styles.loading}>
        Loading profile...
      </div>
    );
  }

  return (
    <div style={styles.page}>
      <div style={styles.container}>

        {/* Header */}
        <div style={styles.header}>
          <h1 style={styles.title}>
            My Profile
          </h1>

          <p style={styles.subtitle}>
            Manage your profile and reported items.
          </p>
        </div>

        {/* Error */}
        {error && (
          <div style={styles.error}>
            {error}
          </div>
        )}

        {/* Profile Card */}
        <div style={styles.profileCard}>

          <div style={styles.avatar}>
            {user.name
              ? user.name.charAt(0).toUpperCase()
              : "U"}
          </div>

          <div>
            <h2 style={styles.name}>
              {user.name || "User"}
            </h2>

            <p style={styles.email}>
              {user.email || "Email not available"}
            </p>

            <span style={styles.member}>
              LostLink Member
            </span>
          </div>

        </div>

        {/* Statistics */}
        <div style={styles.stats}>

          <div style={styles.statCard}>
            <h3 style={styles.statNumber}>
              {totalItems}
            </h3>

            <p style={styles.statLabel}>
              Total Reports
            </p>
          </div>

          <div style={styles.statCard}>
            <h3 style={styles.statNumber}>
              {lostCount}
            </h3>

            <p style={styles.statLabel}>
              Lost Items
            </p>
          </div>

          <div style={styles.statCard}>
            <h3 style={styles.statNumber}>
              {foundCount}
            </h3>

            <p style={styles.statLabel}>
              Found Items
            </p>
          </div>

        </div>

        {/* My Items */}
        <div style={styles.section}>

          <h2 style={styles.sectionTitle}>
            My Reported Items
          </h2>

          <p style={styles.sectionSubtitle}>
            Items reported by you.
          </p>

          {/* Empty */}
          {items.length === 0 ? (
            <div style={styles.empty}>

              <p style={styles.emptyText}>
                You have not reported any items yet.
              </p>

              <div style={styles.emptyButtons}>

                <button
                  style={styles.primaryButton}
                  onClick={() =>
                    navigate("/create-lost")
                  }
                >
                  Report Lost Item
                </button>

                <button
                  style={styles.secondaryButton}
                  onClick={() =>
                    navigate("/create-found")
                  }
                >
                  Report Found Item
                </button>

              </div>

            </div>
          ) : (
            <div style={styles.itemsGrid}>

              {items.map((item) => (
                <div
                  key={item._id}
                  style={styles.itemCard}
                >

                  {/* Image */}
                  {item.image ? (
                    <img
                      src={getImageUrl(item.image)}
                      alt={item.title || "Item"}
                      style={styles.itemImage}
                      onError={(e) => {
                        e.currentTarget.style.display =
                          "none";
                      }}
                    />
                  ) : (
                    <div style={styles.noImage}>
                      No Image
                    </div>
                  )}

                  {/* Type + Status */}
                  <div style={styles.itemTop}>

                    <span
                      style={
                        item.type === "lost"
                          ? styles.lostBadge
                          : styles.foundBadge
                      }
                    >
                      {item.type?.toUpperCase() || "ITEM"}
                    </span>

                    <span style={styles.status}>
                      {item.status || "active"}
                    </span>

                  </div>

                  {/* Title */}
                  <h3 style={styles.itemTitle}>
                    {item.title}
                  </h3>

                  {/* Description */}
                  {item.description && (
                    <p style={styles.description}>
                      {item.description}
                    </p>
                  )}

                  {/* Details */}
                  <div style={styles.details}>

                    <p>
                      <strong>Category:</strong>{" "}
                      {item.category || "N/A"}
                    </p>

                    <p>
                      <strong>Color:</strong>{" "}
                      {item.color || "N/A"}
                    </p>

                    <p>
                      <strong>Location:</strong>{" "}
                      {item.location || "N/A"}
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

                  {/* Buttons */}
                  <div style={styles.buttons}>

                    <button
                      style={styles.viewButton}
                      onClick={() =>
                        navigate(
                          "/item/" + item._id
                        )
                      }
                    >
                      View Details
                    </button>

                    <button
                      style={styles.editButton}
                      onClick={() =>
                        navigate(
                          "/edit-item/" + item._id
                        )
                      }
                    >
                      Edit
                    </button>

                    <button
                      style={styles.deleteButton}
                      onClick={() =>
                        handleDelete(item._id)
                      }
                    >
                      Delete
                    </button>

                  </div>

                </div>
              ))}

            </div>
          )}

        </div>

      </div>
    </div>
  );
}

const styles = {
  page: {
    minHeight: "100vh",
    background: "#f7f8fc",
    padding: "40px 20px",
  },

  container: {
    maxWidth: "1100px",
    margin: "0 auto",
  },

  header: {
    marginBottom: "25px",
  },

  title: {
    margin: 0,
    fontSize: "32px",
    color: "#111827",
  },

  subtitle: {
    marginTop: "8px",
    color: "#6b7280",
  },

  error: {
    background: "#fee2e2",
    color: "#b91c1c",
    padding: "12px 16px",
    borderRadius: "8px",
    marginBottom: "20px",
  },

  profileCard: {
    background: "#ffffff",
    padding: "25px",
    borderRadius: "14px",
    display: "flex",
    alignItems: "center",
    gap: "20px",
    boxShadow:
      "0 2px 10px rgba(0,0,0,0.06)",
  },

  avatar: {
    width: "70px",
    height: "70px",
    borderRadius: "50%",
    background: "#2563eb",
    color: "#ffffff",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    fontSize: "28px",
    fontWeight: "bold",
  },

  name: {
    margin: 0,
    fontSize: "24px",
    color: "#111827",
  },

  email: {
    margin: "5px 0",
    color: "#6b7280",
  },

  member: {
    fontSize: "13px",
    color: "#2563eb",
    fontWeight: "600",
  },

  stats: {
    display: "grid",
    gridTemplateColumns:
      "repeat(auto-fit, minmax(200px, 1fr))",
    gap: "20px",
    margin: "25px 0",
  },

  statCard: {
    background: "#ffffff",
    padding: "25px",
    borderRadius: "14px",
    textAlign: "center",
    boxShadow:
      "0 2px 10px rgba(0,0,0,0.06)",
  },

  statNumber: {
    margin: 0,
    fontSize: "30px",
    color: "#111827",
  },

  statLabel: {
    marginTop: "8px",
    color: "#6b7280",
  },

  section: {
    marginTop: "30px",
  },

  sectionTitle: {
    marginBottom: "5px",
    color: "#111827",
  },

  sectionSubtitle: {
    color: "#6b7280",
    marginTop: 0,
  },

  itemsGrid: {
    display: "grid",
    gridTemplateColumns:
      "repeat(auto-fit, minmax(300px, 1fr))",
    gap: "20px",
    marginTop: "20px",
  },

  itemCard: {
    background: "#ffffff",
    padding: "20px",
    borderRadius: "14px",
    boxShadow:
      "0 2px 10px rgba(0,0,0,0.06)",
  },

  itemImage: {
    width: "100%",
    height: "200px",
    objectFit: "contain",
    borderRadius: "10px",
    background: "#f3f4f6",
    marginBottom: "15px",
  },

  noImage: {
    width: "100%",
    height: "200px",
    background: "#e5e7eb",
    borderRadius: "10px",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    color: "#6b7280",
    marginBottom: "15px",
  },

  itemTop: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: "12px",
  },

  lostBadge: {
    background: "#fee2e2",
    color: "#b91c1c",
    padding: "5px 10px",
    borderRadius: "20px",
    fontSize: "12px",
    fontWeight: "bold",
  },

  foundBadge: {
    background: "#dcfce7",
    color: "#15803d",
    padding: "5px 10px",
    borderRadius: "20px",
    fontSize: "12px",
    fontWeight: "bold",
  },

  status: {
    color: "#16a34a",
    fontSize: "13px",
  },

  itemTitle: {
    margin: "10px 0",
    color: "#111827",
  },

  description: {
    color: "#6b7280",
  },

  details: {
    color: "#4b5563",
    fontSize: "14px",
    lineHeight: "1.6",
  },

  buttons: {
    display: "flex",
    gap: "8px",
    flexWrap: "wrap",
    marginTop: "18px",
  },

  viewButton: {
    border: "none",
    background: "#2563eb",
    color: "#ffffff",
    padding: "9px 12px",
    borderRadius: "7px",
    cursor: "pointer",
  },

  editButton: {
    border: "none",
    background: "#f59e0b",
    color: "#ffffff",
    padding: "9px 12px",
    borderRadius: "7px",
    cursor: "pointer",
  },

  deleteButton: {
    border: "none",
    background: "#dc2626",
    color: "#ffffff",
    padding: "9px 12px",
    borderRadius: "7px",
    cursor: "pointer",
  },

  primaryButton: {
    border: "none",
    background: "#2563eb",
    color: "#ffffff",
    padding: "10px 16px",
    borderRadius: "7px",
    cursor: "pointer",
  },

  secondaryButton: {
    border: "none",
    background: "#16a34a",
    color: "#ffffff",
    padding: "10px 16px",
    borderRadius: "7px",
    cursor: "pointer",
  },

  empty: {
    background: "#ffffff",
    padding: "40px",
    borderRadius: "14px",
    textAlign: "center",
  },

  emptyText: {
    color: "#6b7280",
    marginBottom: "20px",
  },

  emptyButtons: {
    display: "flex",
    justifyContent: "center",
    gap: "10px",
    flexWrap: "wrap",
  },

  loading: {
    minHeight: "100vh",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    fontSize: "20px",
  },
};

export default Profile;

