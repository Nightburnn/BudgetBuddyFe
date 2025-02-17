import React, { useState, useRef, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import { Bell, MoreVertical } from 'lucide-react';
import "./style/notificationAdmin.css";

const AdminHeader = ({ toggleSidebar, isSidebarOpen }) => {
  const [showNotifications, setShowNotifications] = useState(false);
  const [notifications, setNotifications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [hasUnreadNotifications, setHasUnreadNotifications] = useState(false);
  const [activeNotificationId, setActiveNotificationId] = useState(null);
  const [selectedNotification, setSelectedNotification] = useState(null);
  const [modalState, setModalState] = useState({
    detail: false,
    approve: false,
    reject: false
  });
  const [rejectReason, setRejectReason] = useState('');

  const notificationRef = useRef(null);
  const location = useLocation();

  const dummyNotifications = [
    {
      id: 1,
      type: 'Budget Approval',
      message: 'Staff Welfare budget is waiting for your approval',
      department: 'Operations Department',
      date: '09/01/25',
      time: '14:02',
      isRead: false
    },
    {
      id: 2,
      type: 'Expense Approval',
      message: 'Food expense of N 400,000.00 assigned to Staff Welfare budget is waiting for your approval',
      department: 'Operations Department',
      date: '09/01/25',
      time: '14:02',
      isRead: false
    },
    {
      id: 3,
      type: 'Recurring Expense Approval',
      message: 'Staff Welfare budget is waiting for your approval',
      department: 'Operations Department',
      date: '09/01/25',
      time: '14:02',
      isRead: true
    }
  ];

  const getPageTitle = () => {
    const pathParts = location.pathname.split("/").filter(part => part);
    return pathParts.length === 0 ? "Dashboard" : 
           pathParts[pathParts.length - 1].charAt(0).toUpperCase() + 
           pathParts[pathParts.length - 1].slice(1);
  };

  useEffect(() => {
    setLoading(true);
    setTimeout(() => {
      setNotifications(dummyNotifications);
      setHasUnreadNotifications(dummyNotifications.some(n => !n.isRead));
      setLoading(false);
    }, 500);
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

  const handleAction = (notification, action) => {
    setSelectedNotification(notification);
    setModalState(prev => ({
      ...prev,
      detail: action === 'view',
      approve: action === 'approve',
      reject: action === 'reject'
    }));
    setShowNotifications(false);
  };

  const closeAllModals = () => {
    setModalState({
      detail: false,
      approve: false,
      reject: false
    });
    setRejectReason('');
    setSelectedNotification(null);
  };

  const handleModalAction = (action) => {
    console.log(`Performing ${action} for notification:`, selectedNotification);
    // Add your actual action handling logic here
    closeAllModals();
  };

  const renderNotificationItem = (notification) => (
    <div key={notification.id} className="notification-item mb-3">
      <div className="d-flex justify-content-between">
        <div className="notification-info">
          <h6 className="mb-1">{notification.type}</h6>
          <p className="mb-1">{notification.message}</p>
          <small className="text-muted">{notification.department}</small>
        </div>
        <div className="notification-actions d-flex flex-column align-items-end">
          <div className="position-relative">
            <button
              className="btn p-0 dropdown-toggle custom-dropdown-toggle"
              onClick={() => setActiveNotificationId(
                activeNotificationId === notification.id ? null : notification.id
              )}
            >
              <MoreVertical size={16} />
            </button>
            {activeNotificationId === notification.id && (
              <div className="dropdown-menu show" style={{
                left: 'auto',
                right: '100%',
                top: '0',
                margin: '0 8px',
                minWidth: '120px'
              }}>
                <button 
                  className="dropdown-item custom-dropdown-item" 
                  onClick={() => handleAction(notification, 'view')}
                >
                  View
                </button>
                <button 
                  className="dropdown-item custom-dropdown-item" 
                  onClick={() => handleAction(notification, 'approve')}
                >
                  Approve
                </button>
                <button 
                  className="dropdown-item custom-dropdown-item" 
                  onClick={() => handleAction(notification, 'reject')}
                >
                  Reject
                </button>
              </div>
            )}
          </div>
          <small className="text-muted mt-2">{notification.time} {notification.date}</small>
        </div>
      </div>
    </div>
  );

  const renderModal = (type, title, content, confirmText) => (
    <div className="budget-modal">
      <div className="modal-backdrop show"></div>
      <div className="modal budget-list-modal show d-block">
        <div className="modal-dialog modal-dialog-centered">
          <div className="modal-content">
            <div className="modal-body text-center p-4">
              {content}
              <div className="d-flex justify-content-center gap-4 mt-2">
                <button className="btn btn-light" onClick={closeAllModals}>
                  Cancel
                </button>
                <button 
                  className="btn btn-send"
                  onClick={() => handleModalAction(type)}
                >
                  {confirmText}
                </button>
              </div>
            </div>
          </div>
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
                              {notifications.filter(n => !n.isRead).map(renderNotificationItem)}
                              <h6 className="mb-3 mt-4">Older</h6>
                              {notifications.filter(n => n.isRead).map(renderNotificationItem)}
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

      {modalState.detail && renderModal(
        'view',
        'View Budget?',
        <>
     
          <div className="modal-pic mb-2">
          <svg xmlns="http://www.w3.org/2000/svg" width="24" height="25" viewBox="0 0 24 25" fill="none">
  <path d="M18 11.375C18 11.5975 17.934 11.815 17.8104 12C17.6868 12.185 17.5111 12.3292 17.3055 12.4144C17.1 12.4995 16.8738 12.5218 16.6555 12.4784C16.4373 12.435 16.2368 12.3278 16.0795 12.1705C15.9222 12.0132 15.815 11.8127 15.7716 11.5945C15.7282 11.3762 15.7505 11.15 15.8356 10.9445C15.9208 10.7389 16.065 10.5632 16.25 10.4396C16.435 10.316 16.6525 10.25 16.875 10.25C17.1734 10.25 17.4595 10.3685 17.6705 10.5795C17.8815 10.7905 18 11.0766 18 11.375ZM14.25 6.5H10.5C10.3011 6.5 10.1103 6.57902 9.96967 6.71967C9.82902 6.86032 9.75 7.05109 9.75 7.25C9.75 7.44891 9.82902 7.63968 9.96967 7.78033C10.1103 7.92098 10.3011 8 10.5 8H14.25C14.4489 8 14.6397 7.92098 14.7803 7.78033C14.921 7.63968 15 7.44891 15 7.25C15 7.05109 14.921 6.86032 14.7803 6.71967C14.6397 6.57902 14.4489 6.5 14.25 6.5ZM23.25 11V14C23.25 14.5967 23.0129 15.169 22.591 15.591C22.169 16.0129 21.5967 16.25 21 16.25H20.7788L19.2591 20.5044C19.155 20.7958 18.9634 21.0479 18.7105 21.2261C18.4575 21.4044 18.1557 21.5 17.8463 21.5H16.6538C16.3443 21.5 16.0425 21.4044 15.7895 21.2261C15.5366 21.0479 15.345 20.7958 15.2409 20.5044L15.0609 20H9.68906L9.50906 20.5044C9.40502 20.7958 9.2134 21.0479 8.96047 21.2261C8.70754 21.4044 8.40568 21.5 8.09625 21.5H6.90375C6.59433 21.5 6.29246 21.4044 6.03953 21.2261C5.7866 21.0479 5.59498 20.7958 5.49094 20.5044L4.3125 17.2081C3.19142 15.9393 2.48945 14.3553 2.3025 12.6725C2.06046 12.7996 1.85777 12.9905 1.71633 13.2245C1.57489 13.4584 1.50009 13.7266 1.5 14C1.5 14.1989 1.42098 14.3897 1.28033 14.5303C1.13968 14.671 0.948912 14.75 0.75 14.75C0.551088 14.75 0.360322 14.671 0.21967 14.5303C0.0790176 14.3897 0 14.1989 0 14C0.00114598 13.3312 0.225771 12.6819 0.638188 12.1553C1.05061 11.6287 1.62716 11.2551 2.27625 11.0938C2.4438 9.02687 3.38252 7.09859 4.90601 5.6918C6.42951 4.28502 8.42634 3.50263 10.5 3.5H20.25C20.4489 3.5 20.6397 3.57902 20.7803 3.71967C20.921 3.86032 21 4.05109 21 4.25C21 4.44891 20.921 4.63968 20.7803 4.78033C20.6397 4.92098 20.4489 5 20.25 5H18.2447C19.4894 5.87328 20.4683 7.07378 21.0731 8.46875C21.1134 8.5625 21.1528 8.65625 21.1903 8.75C21.7535 8.7978 22.278 9.0558 22.6596 9.47268C23.0413 9.88957 23.252 10.4348 23.25 11ZM21.75 11C21.75 10.8011 21.671 10.6103 21.5303 10.4697C21.3897 10.329 21.1989 10.25 21 10.25H20.6569C20.4971 10.2502 20.3415 10.1993 20.2127 10.1049C20.0839 10.0105 19.9885 9.87738 19.9406 9.725C19.5109 8.35375 18.6542 7.15571 17.4956 6.3057C16.337 5.45569 14.937 4.99821 13.5 5H10.5C9.19005 4.99993 7.90838 5.38103 6.81128 6.09682C5.71419 6.81261 4.84907 7.83217 4.32143 9.03115C3.79379 10.2301 3.62643 11.5568 3.83975 12.8492C4.05308 14.1417 4.63787 15.3442 5.52281 16.31C5.59048 16.3836 5.64276 16.47 5.67656 16.5641L6.90375 20H8.09625L8.45438 18.9978C8.50637 18.8522 8.60211 18.7262 8.72848 18.6371C8.85485 18.548 9.00568 18.5001 9.16031 18.5H15.5897C15.7443 18.5001 15.8951 18.548 16.0215 18.6371C16.1479 18.7262 16.2436 18.8522 16.2956 18.9978L16.6538 20H17.8463L19.5441 15.2478C19.5961 15.1022 19.6918 14.9762 19.8182 14.8871C19.9445 14.798 20.0954 14.7501 20.25 14.75H21C21.1989 14.75 21.3897 14.671 21.5303 14.5303C21.671 14.3897 21.75 14.1989 21.75 14V11Z" fill="#723FEB"/>
</svg>
          </div>
          <h3 className="mb-2">View Budget?</h3>
          <p className="text-muted">This action will open the csv file using an external application</p>
        </>,
        'View'
      )}

      {modalState.approve && renderModal(
        'approve',
        'Approve?',
        <>
          <div className="modal-pic-approve mb-2">
            <div className="approve-icon">
              <svg xmlns="http://www.w3.org/2000/svg" width="24" height="25" viewBox="0 0 24 25" fill="none">
                <path d="M21.5307 7.78104L9.53068 19.781C9.46102 19.8508 9.3783 19.9061 9.28726 19.9438C9.19621 19.9816 9.09861 20.001 9.00005 20.001C8.90149 20.001 8.80389 19.9816 8.71285 19.9438C8.6218 19.9061 8.53908 19.8508 8.46943 19.781L3.21943 14.531C3.0787 14.3903 2.99963 14.1994 2.99963 14.0004C2.99963 13.8014 3.0787 13.6105 3.21943 13.4698C3.36016 13.3291 3.55103 13.25 3.75005 13.25C3.94907 13.25 4.13995 13.3291 4.28068 13.4698L9.00005 18.1901L20.4694 6.71979C20.6102 6.57906 20.801 6.5 21.0001 6.5C21.1991 6.5 21.3899 6.57906 21.5307 6.71979C21.6714 6.86052 21.7505 7.05139 21.7505 7.25042C21.7505 7.44944 21.6714 7.64031 21.5307 7.78104Z" fill="white"/>
              </svg>
            </div>
          </div>
          <h3 className="mb-2">Approve?</h3>
          <p className="text-muted">Are you sure you want to approve this budget?</p>
        </>,
        'Approve'
      )}

      {modalState.reject && renderModal(
        'reject',
        'Reject Budget?',
        <>
          <div className="modal-pic-reject mb-2">
            <div className="reject-icon">
            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="25" viewBox="0 0 24 25" fill="none">
                <path d="M19.2807 18.7198C19.3504 18.7895 19.4056 18.8722 19.4433 18.9632C19.4811 19.0543 19.5005 19.1519 19.5005 19.2504C19.5005 19.349 19.4811 19.4465 19.4433 19.5376C19.4056 19.6286 19.3504 19.7114 19.2807 19.781C19.211 19.8507 19.1283 19.906 19.0372 19.9437C18.9462 19.9814 18.8486 20.0008 18.7501 20.0008C18.6515 20.0008 18.5539 19.9814 18.4629 19.9437C18.3718 19.906 18.2891 19.8507 18.2194 19.781L12.0001 13.5607L5.78068 19.781C5.63995 19.9218 5.44907 20.0008 5.25005 20.0008C5.05103 20.0008 4.86016 19.9218 4.71943 19.781C4.5787 19.6403 4.49963 19.4494 4.49963 19.2504C4.49963 19.0514 4.5787 18.8605 4.71943 18.7198L10.9397 12.5004L4.71943 6.28104C4.5787 6.14031 4.49963 5.94944 4.49963 5.75042C4.49963 5.55139 4.5787 5.36052 4.71943 5.21979C4.86016 5.07906 5.05103 5 5.25005 5C5.44907 5 5.63995 5.07906 5.78068 5.21979L12.0001 11.4401L18.2194 5.21979C18.3602 5.07906 18.551 5 18.7501 5C18.9491 5 19.1399 5.07906 19.2807 5.21979C19.4214 5.36052 19.5005 5.55139 19.5005 5.75042C19.5005 5.94944 19.4214 6.14031 19.2807 6.28104L13.0604 12.5004L19.2807 18.7198Z" fill="white" />
              </svg>
            </div>
          </div>
          <h3 className="mb-2">Reject Budget?</h3>
          <div className="form-group mb-3">
            <textarea
              className="form-control"
              placeholder="State reason for rejection..."
              value={rejectReason}
              onChange={(e) => setRejectReason(e.target.value)}
              rows="3"
            />
          </div>
        </>,
        'Reject'
      )}
    </>
  );
};

export default AdminHeader;