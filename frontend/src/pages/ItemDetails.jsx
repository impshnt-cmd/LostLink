
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

    return "http://localhost:5000" + image;
  };

  // ======================================
  // GET ITEM
  // ======================================
  const fetchItem = async () => {
    try {
      setLoading(true);

      const response = await API.get(`/items/${id}`);

      if (response.data.success) {
        setItem(response.data.item);
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

      // Matching failure should not break
      // the main item details page.
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
      <div style={styles.loading}>
        Loading item...
      </div>
    );
  }

  // ======================================
  // ERROR
  // ======================================
  if (error || !item) {
    return (
      <div style={styles.page}>
        <div style={styles.container}>
          <div style={styles.error}>
            {error || "Item not found"}
          </div>

          <button
            style={styles.backButton}
            onClick={() => navigate("/dashboard")}
          >
            Back to Dashboard
          </button>
        </div>
      </div>
    );
  }

  return (
    <div style={styles.page}>
      <div style={styles.container}>

        {/* ==================================
            BACK BUTTON
        ================================== */}
        <button
          style={styles.backButton}
          onClick={() => navigate("/dashboard")}
        >
          ← Back to Dashboard
        </button>

        {/* ==================================
            ITEM DETAILS CARD
        ================================== */}
        <div style={styles.card}>

          {/* IMAGE */}
          {item.image ? (
            <img
              src={getImageUrl(item.image)}
              alt={item.title || "Item image"}
              style={styles.mainImage}
              onError={(e) => {
                e.currentTarget.style.display =
                  "none";
              }}
            />
          ) : (
            <div style={styles.noImage}>
              No Image Available
            </div>
          )}

          {/* TYPE + STATUS */}
          <div style={styles.topRow}>
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

          {/* TITLE */}
          <h1 style={styles.title}>
            {item.title}
          </h1>

          {/* DESCRIPTION */}
          <div style={styles.section}>
            <h3 style={styles.heading}>
              Description
            </h3>

            <p style={styles.description}>
              {item.description || "No description available"}
            </p>
          </div>

          {/* DETAILS */}
          <div style={styles.section}>
            <h3 style={styles.heading}>
              Item Information
            </h3>

            <div style={styles.detailsGrid}>
              <div style={styles.detailBox}>
                <strong>Category</strong>
                <span>
                  {item.category || "N/A"}
                </span>
              </div>

              <div style={styles.detailBox}>
                <strong>Color</strong>
                <span>
                  {item.color || "N/A"}
                </span>
              </div>

              <div style={styles.detailBox}>
                <strong>Location</strong>
                <span>
                  {item.location || "N/A"}
                </span>
              </div>

              <div style={styles.detailBox}>
                <strong>Date</strong>
                <span>
                  {item.date
                    ? new Date(
                        item.date
                      ).toLocaleDateString()
                    : "N/A"}
                </span>
              </div>
            </div>
          </div>

          {/* OWNER */}
          <div style={styles.section}>
            <h3 style={styles.heading}>
              Reported By
            </h3>

            <p style={styles.owner}>
              {item.owner?.name || "User"}
            </p>

            {item.owner?.email && (
              <p style={styles.ownerEmail}>
                {item.owner.email}
              </p>
            )}
          </div>

          {/* EDIT BUTTON */}
          <button
            style={styles.editButton}
            onClick={() =>
              navigate("/edit-item/" + item._id)
            }
          >
            Edit Item
          </button>
        </div>

        {/* ==================================
            POSSIBLE MATCHES
        ================================== */}
        <div style={styles.matchesSection}>

          <div style={styles.matchesHeader}>
            <div>
              <h2 style={styles.matchesTitle}>
                🔍 Possible Matches
              </h2>

              <p style={styles.matchesSubtitle}>
                Other {item.type === "lost" ? "found" : "lost"}{" "}
                reports that may match this item.
              </p>
            </div>

            {matches.length > 0 && (
              <span style={styles.matchCount}>
                {matches.length} match
                {matches.length > 1 ? "es" : ""}
              </span>
            )}
          </div>

          {/* MATCHES LOADING */}
          {matchesLoading ? (
            <div style={styles.matchesMessage}>
              Finding possible matches...
            </div>
          ) : matches.length === 0 ? (
            <div style={styles.matchesMessage}>
              <h3 style={styles.noMatchTitle}>
                No possible matches found
              </h3>

              <p style={styles.noMatchText}>
                We couldn't find another report that
                matches this item yet.
              </p>
            </div>
          ) : (
            <div style={styles.matchesGrid}>
              {matches.map((match) => {
                const matchedItem = match.item;

                return (
                  <div
                    key={matchedItem._id}
                    style={styles.matchCard}
                  >

                    {/* MATCH IMAGE */}
                    {matchedItem.image ? (
                      <img
                        src={getImageUrl(
                          matchedItem.image
                        )}
                        alt={
                          matchedItem.title ||
                          "Matched item"
                        }
                        style={styles.matchImage}
                        onError={(e) => {
                          e.currentTarget.style.display =
                            "none";
                        }}
                      />
                    ) : (
                      <div style={styles.matchNoImage}>
                        No Image
                      </div>
                    )}

                    {/* MATCH HEADER */}
                    <div style={styles.matchTop}>
                      <span
                        style={
                          matchedItem.type === "lost"
                            ? styles.lostBadge
                            : styles.foundBadge
                        }
                      >
                        {matchedItem.type?.toUpperCase()}
                      </span>

                      <span style={styles.scoreBadge}>
                        {match.score}% Match
                      </span>
                    </div>

                    {/* TITLE */}
                    <h3 style={styles.matchTitle}>
                      {matchedItem.title}
                    </h3>

                    {/* REASONS */}
                    {match.reasons?.length > 0 && (
                      <div style={styles.reasons}>
                        <strong>
                          Why it matches:
                        </strong>

                        {match.reasons.map(
                          (reason, index) => (
                            <span
                              key={index}
                              style={styles.reason}
                            >
                              ✓ {reason}
                            </span>
                          )
                        )}
                      </div>
                    )}

                    {/* DETAILS */}
                    <div style={styles.matchDetails}>
                      <p>
                        <strong>Category:</strong>{" "}
                        {matchedItem.category || "N/A"}
                      </p>

                      <p>
                        <strong>Color:</strong>{" "}
                        {matchedItem.color || "N/A"}
                      </p>

                      <p>
                        <strong>Location:</strong>{" "}
                        {matchedItem.location || "N/A"}
                      </p>

                      <p>
                        <strong>Date:</strong>{" "}
                        {matchedItem.date
                          ? new Date(
                              matchedItem.date
                            ).toLocaleDateString()
                          : "N/A"}
                      </p>
                    </div>

                    {/* VIEW MATCH */}
                    <button
                      style={styles.viewMatchButton}
                      onClick={() =>
                        navigate(
                          "/item/" +
                            matchedItem._id
                        )
                      }
                    >
                      View Match
                    </button>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

// ======================================
// STYLES
// ======================================
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

  loading: {
    minHeight: "100vh",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    fontSize: "20px",
    color: "#374151",
  },

  error: {
    background: "#fee2e2",
    color: "#b91c1c",
    padding: "15px",
    borderRadius: "10px",
    marginBottom: "20px",
  },

  backButton: {
    border: "none",
    background: "#374151",
    color: "#ffffff",
    padding: "10px 16px",
    borderRadius: "8px",
    cursor: "pointer",
    marginBottom: "20px",
  },

  card: {
    background: "#ffffff",
    padding: "30px",
    borderRadius: "16px",
    boxShadow: "0 3px 15px rgba(0,0,0,0.07)",
  },

  mainImage: {
    width: "100%",
    maxHeight: "450px",
    objectFit: "contain",
    borderRadius: "12px",
    background: "#f3f4f6",
    marginBottom: "25px",
  },

  noImage: {
    width: "100%",
    height: "300px",
    background: "#e5e7eb",
    borderRadius: "12px",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    color: "#6b7280",
    fontSize: "18px",
    marginBottom: "25px",
  },

  topRow: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: "15px",
  },

  lostBadge: {
    background: "#fee2e2",
    color: "#b91c1c",
    padding: "6px 12px",
    borderRadius: "20px",
    fontSize: "12px",
    fontWeight: "bold",
  },

  foundBadge: {
    background: "#dcfce7",
    color: "#15803d",
    padding: "6px 12px",
    borderRadius: "20px",
    fontSize: "12px",
    fontWeight: "bold",
  },

  status: {
    color: "#16a34a",
    fontSize: "14px",
    fontWeight: "600",
  },

  title: {
    fontSize: "32px",
    color: "#111827",
    marginBottom: "25px",
  },

  section: {
    marginTop: "25px",
  },

  heading: {
    color: "#111827",
    marginBottom: "10px",
  },

  description: {
    color: "#4b5563",
    lineHeight: "1.7",
  },

  detailsGrid: {
    display: "grid",
    gridTemplateColumns:
      "repeat(auto-fit, minmax(200px, 1fr))",
    gap: "15px",
  },

  detailBox: {
    background: "#f9fafb",
    padding: "15px",
    borderRadius: "10px",
    display: "flex",
    flexDirection: "column",
    gap: "6px",
    color: "#4b5563",
  },

  owner: {
    margin: 0,
    color: "#111827",
    fontWeight: "600",
  },

  ownerEmail: {
    color: "#6b7280",
  },

  editButton: {
    border: "none",
    background: "#f59e0b",
    color: "#ffffff",
    padding: "11px 18px",
    borderRadius: "8px",
    cursor: "pointer",
    marginTop: "25px",
  },

  matchesSection: {
    marginTop: "30px",
  },

  matchesHeader: {
    background: "#ffffff",
    padding: "22px",
    borderRadius: "14px 14px 0 0",
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    gap: "15px",
  },

  matchesTitle: {
    margin: 0,
    color: "#111827",
    fontSize: "24px",
  },

  matchesSubtitle: {
    margin: "7px 0 0",
    color: "#6b7280",
  },

  matchCount: {
    background: "#dbeafe",
    color: "#1d4ed8",
    padding: "7px 12px",
    borderRadius: "20px",
    fontSize: "13px",
    fontWeight: "600",
    whiteSpace: "nowrap",
  },

  matchesMessage: {
    background: "#ffffff",
    padding: "40px 20px",
    borderRadius: "0 0 14px 14px",
    textAlign: "center",
    color: "#6b7280",
  },

  noMatchTitle: {
    color: "#374151",
    marginBottom: "8px",
  },

  noMatchText: {
    margin: 0,
  },

  matchesGrid: {
    display: "grid",
    gridTemplateColumns:
      "repeat(auto-fit, minmax(300px, 1fr))",
    gap: "20px",
    marginTop: "20px",
  },

  matchCard: {
    background: "#ffffff",
    padding: "20px",
    borderRadius: "14px",
    boxShadow: "0 2px 10px rgba(0,0,0,0.06)",
  },

  matchImage: {
    width: "100%",
    height: "190px",
    objectFit: "contain",
    background: "#f3f4f6",
    borderRadius: "10px",
    marginBottom: "15px",
  },

  matchNoImage: {
    width: "100%",
    height: "190px",
    background: "#e5e7eb",
    borderRadius: "10px",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    color: "#6b7280",
    marginBottom: "15px",
  },

  matchTop: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    gap: "10px",
    marginBottom: "12px",
  },

  scoreBadge: {
    background: "#ede9fe",
    color: "#6d28d9",
    padding: "6px 10px",
    borderRadius: "20px",
    fontSize: "12px",
    fontWeight: "bold",
  },

  matchTitle: {
    color: "#111827",
    margin: "10px 0",
    fontSize: "20px",
  },

  reasons: {
    display: "flex",
    flexDirection: "column",
    gap: "5px",
    background: "#f0fdf4",
    padding: "12px",
    borderRadius: "8px",
    marginBottom: "15px",
    color: "#166534",
    fontSize: "13px",
  },

  reason: {
    color: "#15803d",
  },

  matchDetails: {
    color: "#4b5563",
    fontSize: "14px",
    lineHeight: "1.5",
  },

  viewMatchButton: {
    width: "100%",
    border: "none",
    background: "#2563eb",
    color: "#ffffff",
    padding: "11px",
    borderRadius: "8px",
    cursor: "pointer",
    marginTop: "15px",
  },
};

export default ItemDetails;

