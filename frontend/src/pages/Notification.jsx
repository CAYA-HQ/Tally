import React, { useEffect, useState } from "react";
import Sidebar from "../components/Layout/Sidebar";
import Navbar from "../components/Layout/Navbar";
import api from '../utils/api';
import { useNotificationStore } from '../utils/zustand';
import { fetchNotifications, markRead } from "../utils/fetchBackend";
import '../styles/pages/notification.css'



const NotificationPage = () => {
  const [hasMore, setHasMore] = useState(false);
  const [loading, setLoading] = useState(false);
  const {notifications, setNotifications, setNextCursor,
  addNotification, nextCursor} = useNotificationStore();

  const data = {
    setNotifications, addNotification, setNextCursor,
    notifications, setHasMore, hasMore, setLoading
  }

  const cursor = null

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
    fetchNotifications(cursor, data)
    markRead()
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
                  onClick={() => fetchNotifications(nextCursor, data)}
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
