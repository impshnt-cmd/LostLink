import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import API from "../api/api";

const Notifications = () => {
const [notifications, setNotifications] = useState([]);
const [loading, setLoading] = useState(true);
const [error, setError] = useState("");

const navigate = useNavigate();

// Fetch notifications
const fetchNotifications = async () => {
try {
setLoading(true);
setError("");

  const response = await API.get("/notifications");

  setNotifications(
    response.data.notifications || []
  );
} catch (error) {
  console.error(
    "Fetch notifications error:",
    error
  );

  setError("Failed to load notifications");
} finally {
  setLoading(false);
}

};

useEffect(() => {
fetchNotifications();
}, []);

// Mark one notification as read
const markAsRead = async (notificationId) => {
try {
await API.put(
"/notifications/" +
notificationId +
"/read"
);

  setNotifications((prev) =>
    prev.map((notification) =>
      notification._id === notificationId
        ? {
            ...notification,
            isRead: true,
          }
        : notification
    )
  );
} catch (error) {
  console.error(
    "Mark notification read error:",
    error
  );
}

};

// Mark all notifications as read
const markAllAsRead = async () => {
try {
await API.put(
"/notifications/read-all"
);

  setNotifications((prev) =>
    prev.map((notification) => ({
      ...notification,
      isRead: true,
    }))
  );
} catch (error) {
  console.error(
    "Mark all notifications read error:",
    error
  );
}

};

// Notification click
const handleNotificationClick = async (
notification
) => {
if (!notification.isRead) {
await markAsRead(notification._id);
}

if (notification.relatedItem?._id) {
  navigate(
    "/item/" +
      notification.relatedItem._id
  );
}

};

const unreadCount = notifications.filter(
(notification) =>
!notification.isRead
).length;

return (
<div
style={{
minHeight: "100vh",
background: "#f5f7fb",
padding: "30px",
}}
>
<div
style={{
maxWidth: "900px",
margin: "0 auto",
}}
>
{/* Header */}
<div
style={{
display: "flex",
justifyContent: "space-between",
alignItems: "center",
marginBottom: "25px",
gap: "15px",
flexWrap: "wrap",
}}
>
<div>
<h1
style={{
margin: 0,
color: "#111827",
}}
>
Notifications
</h1>

        <p
          style={{
            marginTop: "8px",
            color: "#6b7280",
          }}
        >
          Stay updated about your lost
          and found items.
        </p>
      </div>

      {unreadCount > 0 && (
        <button
          onClick={markAllAsRead}
          style={{
            padding: "10px 16px",
            border: "none",
            borderRadius: "8px",
            background: "#2563eb",
            color: "#fff",
            cursor: "pointer",
            fontWeight: "600",
          }}
        >
          Mark all as read
        </button>
      )}
    </div>

    {/* Loading */}
    {loading && (
      <div
        style={{
          background: "#fff",
          padding: "30px",
          borderRadius: "12px",
          textAlign: "center",
        }}
      >
        Loading notifications...
      </div>
    )}

    {/* Error */}
    {error && !loading && (
      <div
        style={{
          background: "#fff",
          padding: "30px",
          borderRadius: "12px",
          textAlign: "center",
          color: "#dc2626",
        }}
      >
        {error}
      </div>
    )}

    {/* Empty State */}
    {!loading &&
      !error &&
      notifications.length === 0 && (
        <div
          style={{
            background: "#fff",
            padding: "50px 30px",
            borderRadius: "12px",
            textAlign: "center",
          }}
        >
          <div
            style={{
              fontSize: "50px",
              marginBottom: "15px",
            }}
          >
            🔔
          </div>

          <h2>No notifications</h2>

          <p
            style={{
              color: "#6b7280",
            }}
          >
            You don't have any
            notifications yet.
          </p>
        </div>
      )}

    {/* Notifications List */}
    {!loading &&
      !error &&
      notifications.length > 0 && (
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            gap: "12px",
          }}
        >
          {notifications.map(
            (notification) => (
              <div
                key={notification._id}
                onClick={() =>
                  handleNotificationClick(
                    notification
                  )
                }
                style={{
                  background:
                    notification.isRead
                      ? "#fff"
                      : "#eff6ff",

                  border:
                    notification.isRead
                      ? "1px solid #e5e7eb"
                      : "1px solid #bfdbfe",

                  borderRadius: "12px",
                  padding: "18px",

                  cursor:
                    notification.relatedItem
                      ? "pointer"
                      : "default",

                  transition:
                    "0.2s",
                }}
              >
                <div
                  style={{
                    display: "flex",
                    gap: "15px",
                    alignItems:
                      "flex-start",
                  }}
                >
                  {/* Icon */}
                  <div
                    style={{
                      width: "45px",
                      height: "45px",
                      borderRadius: "50%",
                      background:
                        "#dbeafe",

                      display: "flex",
                      alignItems:
                        "center",
                      justifyContent:
                        "center",

                      fontSize: "22px",
                      flexShrink: 0,
                    }}
                  >
                    🔔
                  </div>

                  {/* Content */}
                  <div
                    style={{
                      flex: 1,
                    }}
                  >
                    <div
                      style={{
                        display: "flex",
                        justifyContent:
                          "space-between",
                        gap: "10px",
                      }}
                    >
                      <h3
                        style={{
                          margin: 0,
                          color:
                            "#111827",
                        }}
                      >
                        {
                          notification.title
                        }
                      </h3>

                      {!notification.isRead && (
                        <span
                          style={{
                            background:
                              "#2563eb",

                            color: "#fff",

                            padding:
                              "4px 8px",

                            borderRadius:
                              "20px",

                            fontSize:
                              "11px",

                            fontWeight:
                              "700",
                          }}
                        >
                          NEW
                        </span>
                      )}
                    </div>

                    <p
                      style={{
                        margin:
                          "8px 0",
                        color:
                          "#4b5563",
                      }}
                    >
                      {
                        notification.message
                      }
                    </p>

                    {notification.relatedItem && (
                      <div
                        style={{
                          color:
                            "#2563eb",
                          fontSize:
                            "14px",
                          fontWeight:
                            "600",
                        }}
                      >
                        View Item →
                      </div>
                    )}

                    <small
                      style={{
                        display:
                          "block",
                        marginTop:
                          "8px",
                        color:
                          "#9ca3af",
                      }}
                    >
                      {new Date(
                        notification.createdAt
                      ).toLocaleString()}
                    </small>
                  </div>
                </div>
              </div>
            )
          )}
        </div>
      )}
  </div>
</div>

);
};

export default Notifications;