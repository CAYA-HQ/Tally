import React, { useEffect, useState } from 'react';
import { FiSearch } from 'react-icons/fi';
import Sidebar from "../components/Layout/Sidebar";
import Navbar from "../components/Layout/Navbar";
import "../styles/pages/inventory.css";
import api from '../utils/api';

const NotificationPage = () => {
  const [notifications, setNotifications] = useState([]);
  const [nextCursor, setNextCursor] = useState(null);
  const [hasMore, setHasMore] = useState(false);
  const [loading, setLoading] = useState(false);

  const fetchNotifications = async (cursor = null) => {
    setLoading(true);
    try {
      const response = await api.get("/user/notification", {
        params: cursor ? { cursor } : {},
      });
      const fetched = response.data.notification || [];
      setNotifications((prev) => (cursor ? [...prev, ...fetched] : fetched));
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
      console.log("Clear all clicked")
    } catch (error) {
      console.error("Failed to clear notifications:", error);
    }
  }

  useEffect(() => {
    fetchNotifications();
  }, []);

  const renderNotification = (notification, index) => (
    <div
      key={notification._id || index}
      style={{
        marginLeft: "35vh",
        paddingTop: "20px",
        paddingRight: "45px",
        borderBottom: "1px solid rgba(0,0,0,0.08)",
      }}
    >
      <p style={{ margin: 0, fontWeight: 600 }}>{notification.message}</p>
      <p style={{ margin: 0, opacity: 0.6 }}>
        {notification.category || "General Notification"}
        </p>
      <p style={{ margin: 0, opacity: 0.5 }}>
        {new Date(notification.createdAt).toLocaleString()}
      </p>
      
    </div>
  );

  return (
    <div className="order-wrapper">
      <Sidebar />
      
      <main className="notification-main">        
        <div style={{ marginLeft: "30vh", paddingTop: "40px", paddingLeft: "40px" }}>
          <div className="inventory-header" style={{ display: "flex", alignItems: "center", gap: "20px" }}>
            <h1 className='page-title'>Notifications</h1>
          </div>
          <hr style={{ width: "70vw" }} />
        </div>

        <div style={{
          marginLeft: "30vh",
          paddingTop: "20px",
          paddingRight: "45px",
          display: "flex",
          justifyContent: "right",
          alignItems: "center",
        }}>
          <h4 style={{ opacity: 0.5, cursor: 'pointer' }} onClick={clearNotifications}>clear all</h4>
        </div>

        {notifications.length < 1 ? (
          <div style={{ marginLeft: "35vh", paddingTop: "20px", paddingRight: "45px" }}>
            <h3 style={{ opacity: 0.5 }}>{loading ? "Loading notifications..." : "No notifications yet"}</h3>
          </div>
        ) : (
          notifications.map(renderNotification)
        )}

        {hasMore && (
          <div style={{ marginLeft: "35vh", padding: "20px 45px" }}>
            <button
              type="button"
              onClick={() => fetchNotifications(nextCursor)}
              disabled={loading}
              style={{
                padding: "10px 20px",
                backgroundColor: "#1d4ed8",
                color: "white",
                border: "none",
                borderRadius: "6px",
                cursor: loading ? "not-allowed" : "pointer",
              }}
            >
              {loading ? "Loading..." : "Load more"}
            </button>
          </div>
        )}
      </main>
    </div>
  );
};

export default NotificationPage;