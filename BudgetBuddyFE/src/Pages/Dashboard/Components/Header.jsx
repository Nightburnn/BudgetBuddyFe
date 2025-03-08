import React, { useState, useRef, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import { Bell } from 'lucide-react';
import "./style/notifications.css";
import { API_URL } from '../../../config/api';
import { useAuth } from "../../../Auth/AuthContext";

const Header = ({ toggleSidebar, isSidebarOpen }) => {
  const [showNotifications, setShowNotifications] = useState(false);
  const [notifications, setNotifications] = useState({ recent: [], older: [] });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [hasUnreadNotifications, setHasUnreadNotifications] = useState(false);
  const notificationRef = useRef(null);
  const location = useLocation();

  const { currentUser } = useAuth();

  const getPageTitle = () => {
    const pathParts = location.pathname.split("/").filter(part => part);

    if (pathParts.length === 1 && pathParts[0] === "dashboard") {
      return "Dashboard";
    }

    if (pathParts.length > 1) {
      const lastPart = pathParts[pathParts.length - 1];
      return lastPart.charAt(0).toUpperCase() + lastPart.slice(1);
    }

    return "Dashboard";
  };

  // Fetch notifications from API
  const fetchNotifications = async () => {
    if (!currentUser || !currentUser.department_id) {
      console.error("No departmentId found in currentUser");
      setError("No department ID found. Please log in again.");
      setLoading(false);
      return;
    }

    try {
      setLoading(true);
      const response = await fetch(`${API_URL}/departments/${currentUser.department_id}/notifications`);
      if (!response.ok) {
        throw new Error('Failed to fetch notifications');
      }
      const data = await response.json();
      console.log("this is notification data", data);

      // Access the recent and older arrays directly from the data object
      const { recent, older } = data;

      // Check if there are unread notifications in the recent array
      const hasUnread = recent.some(notification => !notification.isRead);

      setNotifications({ recent, older });
      setHasUnreadNotifications(hasUnread);
      setError(null);
    } catch (err) {
      setError('Failed to load notifications');
      console.error('Error fetching notifications:', err);
    } finally {
      setLoading(false);
    }
  };

  // Fetch notifications on component mount
  useEffect(() => {
    fetchNotifications();
  }, []);

  // Handle click outside notifications panel
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (notificationRef.current && !notificationRef.current.contains(event.target)) {
        setShowNotifications(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // Handle opening notifications panel
  const handleNotificationClick = () => {
    setShowNotifications(!showNotifications);
  };

  return (
    <header className="border-bottom bg-white">
      <div className="container-fluid">
        <div className="container">
          <div className="row align-items-center py-3">
            <div className="d-lg-none col-auto">
              <button
                className="btn mobile-menu-btn"
                onClick={toggleSidebar}
              >
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
                  onClick={handleNotificationClick}
                  className="btn notification-btn"
                >
                  <Bell size={20} />
                  {hasUnreadNotifications && <span className="notification-dot"></span>}
                </button>

                {showNotifications && (
                  <>
                    <div
                      className="notification-overlay"
                      onClick={() => setShowNotifications(false)}
                    ></div>

                    <div className="notification-panel">
                      <div className="d-flex justify-content-between align-items-center p-3 border-bottom notifi-head">
                        <h6 className="mb-0">Notifications</h6>
                        <button
                          onClick={() => setShowNotifications(false)}
                          className="btn btn-link"
                        >
                          Close
                        </button>
                      </div>

                      <div className="notification-content">
                        {loading ? (
                          <div className="p-3 text-center">Loading...</div>
                        ) : error ? (
                          <div className="p-3 text-center text-danger">{error}</div>
                        ) : (
                          <>
                            {notifications.recent.length === 0 && notifications.older.length === 0 ? (
                              <div className="p-3 text-center">You have no notifications right now</div>
                            ) : (
                              <>
                                {notifications.recent.length > 0 && (
                                  <div className="p-3">
                                    <h6 className="mb-3 topic">Recent</h6>
                                    {notifications.recent.map((notification) => (
                                      <div key={notification.id} className="notification-item recent">
                                        <div className="notification-dot-indicator"></div>
                                        <div>
                                          <h6 className="mb-1">{notification.type}</h6>
                                          <p className="mb-1">{notification.message}</p>
                                          <div className="notification-time">
                                            <span>{notification.time}</span>
                                            <span className="time-separator"></span>
                                            <span>{notification.date}</span>
                                          </div>
                                        </div>
                                      </div>
                                    ))}
                                  </div>
                                )}

                                {notifications.older.length > 0 && (
                                  <div className="p-3 border-top">
                                    <h6 className="mb-3 topic">Older</h6>
                                    {notifications.older.map((notification) => (
                                      <div key={notification.id} className="notification-item older">
                                        <div className="notification-dot-indicator"></div>
                                        <div>
                                          <h6 className="mb-1">{notification.type}</h6>
                                          <p className="mb-1">{notification.message}</p>
                                          <div className="notification-time">
                                            <span>{notification.time}</span>
                                            <span className="time-separator"></span>
                                            <span>{notification.date}</span>
                                          </div>
                                        </div>
                                      </div>
                                    ))}
                                  </div>
                                )}
                              </>
                            )}
                          </>
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
  );
};

export default Header;