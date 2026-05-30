import React, { useEffect, useState } from "react";
import Sidebar from "../components/Layout/Sidebar";
import Navbar from "../components/Layout/Navbar";
import "../styles/pages/inventory.css";
import api from '../utils/api';
import { useNotificationStore } from '../utils/zustand';


const NotificationPage = () => {
  const [nextCursor, setNextCursor] = useState(null);
  const [hasMore, setHasMore] = useState(false);
  const [loading, setLoading] = useState(false);
  const {notifications, setNotifications,
  addNotification, setSeenNotification} = useNotificationStore();

  const fetchNotifications = async (cursor = null) => {
    setLoading(true);
    try {
      const response = await api.get("/user/notification", {
        params: cursor ? { cursor } : {},
      });
      const fetched = response.data.notification || [];
      cursor ? addNotifications(fetched) : setNotifications(fetched)

      setNextCursor(response.data.nextCursor || null);
      setHasMore(response.data.hasMore ?? false);

    } catch (error) {
      console.error("Failed to fetch notifications:", error);
    } finally {
      setLoading(false);
    }
  };

  const clearNotifications = async () => {
    try {
      await api.delete("/user/notification");
      setNotifications([]);
      setNextCursor(null);
      setHasMore(false);
    } catch (error) {
      console.error("Failed to clear notifications:", error);
    }
  };

  useEffect(() => {
    fetchNotifications();
    setSeenNotification(true)
  }, []);

  const renderNotification = (notification, index) => (
    <div key={notification._id || index} className="notification-item">
      <div className="notification-item__top">
        <p className="notification-message">{notification.message}</p>
        <span className="notification-category">
          {notification.category || "General Notification"}
        </span>
      </div>
      <p className="notification-date">
        {new Date(notification.createdAt).toLocaleString()}
      </p>
    </div>
  );

  return (
    <div className="notification-wrapper">
      <Sidebar />
      <main className="notification-main">
        <Navbar />

        <div className="notification-content">
          <div className="notification-header">
            <div>
              <h1 className="page-title">Notifications</h1>
              <p className="notification-subtitle">
                View and manage your recent alerts.
              </p>
            </div>
            <button
              type="button"
              className="clear-notifications-btn"
              onClick={clearNotifications}
            >
              Clear all
            </button>
          </div>

          <section className="notification-panel">
            {notifications.length < 1 ? (
              <div className="notification-empty">
                <h3>
                  {loading
                    ? "Loading notifications..."
                    : "No notifications yet"}
                </h3>
              </div>
            ) : (
              <div className="notification-list">
                {notifications.map(renderNotification)}
              </div>
            )}

            {hasMore && (
              <div className="notification-load-more">
                <button
                  type="button"
                  onClick={() => fetchNotifications(nextCursor)}
                  disabled={loading}
                  className="load-more-btn"
                >
                  {loading ? "Loading..." : "Load more"}
                </button>
              </div>
            )}
          </section>
        </div>
      </main>
    </div>
  );
};

export default NotificationPage;
