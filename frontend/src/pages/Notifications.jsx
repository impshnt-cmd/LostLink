import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import API from "../api/api";

const Notifications = () => {
  const [notifications, setNotifications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [markingAll, setMarkingAll] = useState(false);

  const navigate = useNavigate();

  // =========================
  // FETCH NOTIFICATIONS
  // =========================
  const fetchNotifications = async () => {
    try {
      setLoading(true);
      setError("");

      const response = await API.get("/notifications");

      setNotifications(response.data.notifications || []);
    } catch (error) {
      console.error("Fetch notifications error:", error);
      setError("Failed to load notifications");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchNotifications();
  }, []);

  // =========================
  // MARK ONE AS READ
  // =========================
  const markAsRead = async (notificationId) => {
    try {
      await API.put(`/notifications/${notificationId}/read`);

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
      console.error("Mark notification read error:", error);
    }
  };

  // =========================
  // MARK ALL AS READ
  // =========================
  const markAllAsRead = async () => {
    try {
      setMarkingAll(true);

      await API.put("/notifications/read-all");

      setNotifications((prev) =>
        prev.map((notification) => ({
          ...notification,
          isRead: true,
        }))
      );
    } catch (error) {
      console.error("Mark all notifications read error:", error);
    } finally {
      setMarkingAll(false);
    }
  };

  // =========================
  // NOTIFICATION CLICK
  // =========================
  const handleNotificationClick = async (notification) => {
    if (!notification.isRead) {
      await markAsRead(notification._id);
    }

    if (notification.relatedItem?._id) {
      navigate(`/item/${notification.relatedItem._id}`);
    }
  };

  const unreadCount = notifications.filter(
    (notification) => !notification.isRead
  ).length;

  return (
    <div className="relative min-h-screen overflow-hidden bg-[#050816] text-white">

      {/* =========================
          BACKGROUND AURORA
      ========================= */}
      <div className="pointer-events-none absolute inset-0 overflow-hidden">
        <div className="absolute -left-32 -top-32 h-96 w-96 rounded-full bg-violet-600/20 blur-3xl" />
        <div className="absolute right-[-100px] top-20 h-96 w-96 rounded-full bg-cyan-500/15 blur-3xl" />
        <div className="absolute bottom-[-150px] left-1/3 h-96 w-96 rounded-full bg-fuchsia-600/10 blur-3xl" />

        <div
          className="absolute inset-0 opacity-[0.035]"
          style={{
            backgroundImage:
              "linear-gradient(rgba(255,255,255,.4) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,.4) 1px, transparent 1px)",
            backgroundSize: "40px 40px",
          }}
        />
      </div>

      {/* =========================
          MAIN CONTAINER
      ========================= */}
      <div className="relative z-10 mx-auto max-w-5xl px-4 py-8 sm:px-6 lg:px-8">

        {/* =========================
            HEADER
        ========================= */}
        <div className="mb-8 flex flex-col gap-5 sm:flex-row sm:items-end sm:justify-between">

          <div>
            <div className="mb-3 inline-flex items-center gap-2 rounded-full border border-violet-400/20 bg-violet-500/10 px-3 py-1.5 text-xs font-semibold text-violet-200">
              <span className="h-2 w-2 rounded-full bg-violet-400 shadow-[0_0_12px_rgba(167,139,250,.9)]" />
              LostLink Updates
            </div>

            <h1 className="text-3xl font-black tracking-tight sm:text-4xl">
              Notifications
            </h1>

            <p className="mt-2 max-w-xl text-sm leading-6 text-slate-400 sm:text-base">
              Stay updated about your lost and found items, possible matches,
              and activity on LostLink.
            </p>
          </div>

          {unreadCount > 0 && (
            <button
              onClick={markAllAsRead}
              disabled={markingAll}
              className="group inline-flex items-center justify-center gap-2 rounded-xl border border-violet-400/20 bg-gradient-to-r from-violet-600 to-indigo-600 px-5 py-3 text-sm font-bold text-white shadow-lg shadow-violet-900/20 transition duration-300 hover:-translate-y-0.5 hover:from-violet-500 hover:to-indigo-500 disabled:cursor-not-allowed disabled:opacity-60"
            >
              <span>
                {markingAll ? "Marking..." : "✓ Mark all as read"}
              </span>
            </button>
          )}
        </div>

        {/* =========================
            SUMMARY BAR
        ========================= */}
        {!loading && !error && notifications.length > 0 && (
          <div className="mb-6 grid grid-cols-1 gap-3 sm:grid-cols-3">

            <div className="rounded-2xl border border-white/10 bg-white/[0.045] p-4 backdrop-blur-xl">
              <p className="text-xs font-semibold uppercase tracking-wider text-slate-500">
                Total
              </p>

              <p className="mt-1 text-2xl font-black text-white">
                {notifications.length}
              </p>
            </div>

            <div className="rounded-2xl border border-violet-400/15 bg-violet-500/[0.06] p-4 backdrop-blur-xl">
              <p className="text-xs font-semibold uppercase tracking-wider text-violet-300">
                Unread
              </p>

              <p className="mt-1 text-2xl font-black text-violet-200">
                {unreadCount}
              </p>
            </div>

            <div className="rounded-2xl border border-cyan-400/15 bg-cyan-500/[0.05] p-4 backdrop-blur-xl">
              <p className="text-xs font-semibold uppercase tracking-wider text-cyan-300">
                Status
              </p>

              <p className="mt-1 text-sm font-bold text-cyan-200">
                {unreadCount > 0 ? "New updates available" : "All caught up"}
              </p>
            </div>

          </div>
        )}

        {/* =========================
            LOADING
        ========================= */}
        {loading && (
          <div className="rounded-3xl border border-white/10 bg-white/[0.045] p-10 text-center shadow-2xl shadow-black/20 backdrop-blur-xl">

            <div className="mx-auto mb-5 flex h-14 w-14 items-center justify-center rounded-2xl border border-violet-400/20 bg-violet-500/10">
              <div className="h-6 w-6 animate-spin rounded-full border-2 border-violet-300/30 border-t-violet-400" />
            </div>

            <h2 className="text-lg font-bold text-white">
              Loading notifications
            </h2>

            <p className="mt-2 text-sm text-slate-500">
              Checking your latest LostLink updates...
            </p>

          </div>
        )}

        {/* =========================
            ERROR
        ========================= */}
        {error && !loading && (
          <div className="rounded-3xl border border-red-400/20 bg-red-500/[0.06] p-10 text-center backdrop-blur-xl">

            <div className="mx-auto mb-5 flex h-14 w-14 items-center justify-center rounded-2xl border border-red-400/20 bg-red-500/10 text-2xl">
              !
            </div>

            <h2 className="text-lg font-bold text-white">
              Something went wrong
            </h2>

            <p className="mt-2 text-sm text-red-300">
              {error}
            </p>

            <button
              onClick={fetchNotifications}
              className="mt-6 rounded-xl bg-white px-5 py-2.5 text-sm font-bold text-slate-900 transition hover:bg-slate-200"
            >
              Try Again
            </button>

          </div>
        )}

        {/* =========================
            EMPTY STATE
        ========================= */}
        {!loading &&
          !error &&
          notifications.length === 0 && (
            <div className="rounded-3xl border border-white/10 bg-white/[0.045] px-6 py-16 text-center shadow-2xl shadow-black/20 backdrop-blur-xl">

              <div className="mx-auto mb-6 flex h-20 w-20 items-center justify-center rounded-3xl border border-violet-400/20 bg-gradient-to-br from-violet-500/15 to-cyan-500/10 text-4xl shadow-xl shadow-violet-900/10">
                🔔
              </div>

              <h2 className="text-2xl font-black text-white">
                No notifications yet
              </h2>

              <p className="mx-auto mt-3 max-w-md text-sm leading-6 text-slate-400">
                You don't have any notifications right now. When there is
                activity on your lost or found items, updates will appear here.
              </p>

              <div className="mt-7 flex flex-col justify-center gap-3 sm:flex-row">
                <button
                  onClick={() => navigate("/create-lost")}
                  className="rounded-xl bg-gradient-to-r from-violet-600 to-indigo-600 px-5 py-3 text-sm font-bold text-white shadow-lg shadow-violet-900/20 transition hover:-translate-y-0.5"
                >
                  Report Lost Item
                </button>

                <button
                  onClick={() => navigate("/create-found")}
                  className="rounded-xl border border-white/10 bg-white/[0.06] px-5 py-3 text-sm font-bold text-white transition hover:bg-white/10"
                >
                  Report Found Item
                </button>
              </div>

            </div>
          )}

        {/* =========================
            NOTIFICATIONS LIST
        ========================= */}
        {!loading &&
          !error &&
          notifications.length > 0 && (
            <div className="space-y-3">

              {notifications.map((notification) => {
                const isUnread = !notification.isRead;
                const hasItem = Boolean(notification.relatedItem?._id);

                return (
                  <div
                    key={notification._id}
                    onClick={() =>
                      handleNotificationClick(notification)
                    }
                    className={`group relative overflow-hidden rounded-2xl border p-5 backdrop-blur-xl transition duration-300 ${
                      hasItem
                        ? "cursor-pointer hover:-translate-y-0.5"
                        : ""
                    } ${
                      isUnread
                        ? "border-violet-400/20 bg-gradient-to-r from-violet-500/[0.10] to-indigo-500/[0.05] shadow-lg shadow-violet-950/10"
                        : "border-white/10 bg-white/[0.035] hover:border-white/15 hover:bg-white/[0.055]"
                    }`}
                  >

                    {/* Unread glow */}
                    {isUnread && (
                      <div className="pointer-events-none absolute right-0 top-0 h-32 w-32 rounded-full bg-violet-500/10 blur-3xl" />
                    )}

                    <div className="relative flex gap-4">

                      {/* ICON */}
                      <div
                        className={`flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl border text-xl ${
                          isUnread
                            ? "border-violet-400/20 bg-violet-500/15 shadow-lg shadow-violet-900/20"
                            : "border-white/10 bg-white/[0.06]"
                        }`}
                      >
                        🔔
                      </div>

                      {/* CONTENT */}
                      <div className="min-w-0 flex-1">

                        {/* TOP ROW */}
                        <div className="flex flex-col gap-2 sm:flex-row sm:items-start sm:justify-between">

                          <h3
                            className={`text-base font-bold leading-6 ${
                              isUnread
                                ? "text-white"
                                : "text-slate-200"
                            }`}
                          >
                            {notification.title}
                          </h3>

                          {isUnread && (
                            <span className="w-fit rounded-full border border-violet-300/20 bg-violet-500/15 px-2.5 py-1 text-[10px] font-black tracking-widest text-violet-200">
                              NEW
                            </span>
                          )}

                        </div>

                        {/* MESSAGE */}
                        <p className="mt-2 text-sm leading-6 text-slate-400">
                          {notification.message}
                        </p>

                        {/* RELATED ITEM */}
                        {hasItem && (
                          <div className="mt-4 inline-flex items-center gap-2 rounded-lg border border-cyan-400/10 bg-cyan-400/[0.05] px-3 py-2 text-xs font-bold text-cyan-300 transition group-hover:border-cyan-400/20 group-hover:bg-cyan-400/[0.08]">
                            View Item
                            <span className="transition-transform group-hover:translate-x-1">
                              →
                            </span>
                          </div>
                        )}

                        {/* DATE */}
                        <p className="mt-4 text-xs text-slate-600">
                          {new Date(
                            notification.createdAt
                          ).toLocaleString()}
                        </p>

                      </div>
                    </div>
                  </div>
                );
              })}

            </div>
          )}

        {/* =========================
            BOTTOM CTA
        ========================= */}
        {!loading && !error && notifications.length > 0 && (
          <div className="mt-10 overflow-hidden rounded-3xl border border-white/10 bg-gradient-to-r from-violet-600/15 via-indigo-500/10 to-cyan-500/10 p-6 backdrop-blur-xl sm:p-8">

            <div className="flex flex-col gap-5 sm:flex-row sm:items-center sm:justify-between">

              <div>
                <p className="text-xs font-bold uppercase tracking-[0.18em] text-violet-300">
                  LostLink Community
                </p>

                <h3 className="mt-2 text-xl font-black text-white">
                  Looking for something you lost?
                </h3>

                <p className="mt-2 max-w-lg text-sm leading-6 text-slate-400">
                  Browse reported items or create a new lost-item report to
                  help the community reconnect it with you.
                </p>
              </div>

              <button
                onClick={() => navigate("/dashboard")}
                className="shrink-0 rounded-xl bg-white px-5 py-3 text-sm font-black text-slate-900 shadow-xl transition hover:-translate-y-0.5 hover:bg-slate-100"
              >
                Explore Dashboard →
              </button>

            </div>
          </div>
        )}

        {/* =========================
            FOOTER
        ========================= */}
        <div className="mt-10 border-t border-white/10 pt-6 text-center">
          <p className="text-xs text-slate-600">
            LostLink • Find what you lost. Return what you found.
          </p>
        </div>

      </div>
    </div>
  );
};

export default Notifications;