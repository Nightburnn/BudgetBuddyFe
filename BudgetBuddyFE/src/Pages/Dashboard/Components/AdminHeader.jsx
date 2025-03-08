import React, { useState, useRef, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import { Bell, MoreVertical } from 'lucide-react';
import axios from 'axios';
import "./style/notificationAdmin.css";
import { API_URL } from '../../../config/api';
import { toast, ToastContainer } from 'react-toastify';

const AdminHeader = ({ toggleSidebar, isSidebarOpen }) => {
  const [showNotifications, setShowNotifications] = useState(false);
  const [notifications, setNotifications] = useState({ older: [], recent: [] }); 
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [hasUnreadNotifications, setHasUnreadNotifications] = useState(false);
  const [activeNotificationId, setActiveNotificationId] = useState(null);

  const notificationRef = useRef(null);
  const location = useLocation();

  const getPageTitle = () => {
    const pathParts = location.pathname.split("/").filter(part => part);
    return pathParts.length === 0 ? "Dashboard" : 
           pathParts[pathParts.length - 1].charAt(0).toUpperCase() + 
           pathParts[pathParts.length - 1].slice(1);
  };

  const fetchNotifications = async () => {
    setLoading(true);
    try {
      const response = await axios.get(`${API_URL}/admin/notifications`);
      setNotifications(response.data);
      console.log("this is the notification:", response.data);
  
      const hasUnread = 
        response.data.recent.some(n => !n.read) || 
        response.data.older.some(n => !n.read);
      setHasUnreadNotifications(hasUnread);
  
      setError(null);
    } catch (err) {
      console.error("Error fetching notifications:", err);
      setError("Failed to load notifications. Please try again.");
    } finally {
      setLoading(false);
    }
  };



  useEffect(() => {
    fetchNotifications();
  }, []);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (notificationRef.current && !notificationRef.current.contains(event.target)) {
        setShowNotifications(false);
        setActiveNotificationId(null);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const renderNotificationItem = (notification) => (
    <div key={notification.id} className="notification-item mb-3">
      <div className="d-flex justify-content-between">
        <div className="notification-info">
          <h6 className="mb-1">{notification.type}</h6>
          <p className="mb-1">{notification.message}</p>
          <small className="text-muted">{notification.from|| 'No Department'}</small>
        </div>
        <div className="notification-actions d-flex flex-column align-items-end">
          <small className="text-muted mt-2">{notification.time}<br/> {notification.date}</small>
        </div>
      </div>
    </div>
  );

  return (
    <>
      <header className="border-bottom bg-white">
        <div className="container-fluid">
          <div className="container">
            <div className="row align-items-center py-3">
              <div className="d-lg-none col-auto">
                <button className="btn mobile-menu-btn" onClick={toggleSidebar}>
                  {isSidebarOpen ? (
                    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24">
                      <path d="M18 6L6 18M6 6l12 12" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
                    </svg>
                  ) : (
                    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24">
                      <path d="M4 6h16M4 12h16M4 18h16" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
                    </svg>
                  )}
                </button>
              </div>
              <div className="col">
                <h4 className="mb-0">{getPageTitle()}</h4>
              </div>
              <div className="col-auto">
                <div className="position-relative" ref={notificationRef}>
                  <button
                    onClick={() => setShowNotifications(!showNotifications)}
                    className="btn notification-btn"
                  >
                    <Bell size={20} />
                    {hasUnreadNotifications && <span className="notification-dot"></span>}
                  </button>

                  {showNotifications && (
                    <>
                      <div className="notification-overlay" onClick={() => setShowNotifications(false)}></div>
                      <div className="notification-panel-admin">
                        <div className="d-flex justify-content-between align-items-center p-3 border-bottom notifi-head">
                          <h6 className="mb-0">Notifications</h6>
                          <button onClick={() => setShowNotifications(false)} className="btn btn-link">
                            Close
                          </button>
                        </div>

                        <div className="notification-content">
                          {loading ? (
                            <div className="p-3 text-center">Loading...</div>
                          ) : error ? (
                            <div className="p-3 text-center text-danger">{error}</div>
                          ) : (
                            <div className="p-3">
                              <h6 className="mb-3">Recent</h6>
                              {notifications.recent.map(renderNotificationItem)}
                              <h6 className="mb-3 mt-4">Older</h6>
                              {notifications.older.map(renderNotificationItem)}
                            </div>
                          )}
                        </div>
                      </div>
                    </>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      </header>
    </>
  );
};

export default AdminHeader;