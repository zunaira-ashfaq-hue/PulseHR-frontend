import { useState, useEffect, useRef } from "react";
import "./App.css";
import Auth from "./components/Auth";
import Dashboard from "./components/Dashboard";
import Employees from "./components/Employees";
import Attendance from "./components/Attendance";
import Leaves from "./components/Leaves";
import Profile from "./components/Profile";
import Feedback from "./components/Feedback";

const API_URL = "https://pulsehr-backend-sa06.onrender.com/api";

// Icons as SVG components
const DashboardIcon = () => (
  <svg fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      d="M4 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2V6zM14 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V6zM4 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2v-2zM14 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z"
    />
  </svg>
);

const EmployeesIcon = () => (
  <svg fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z"
    />
  </svg>
);

const AttendanceIcon = () => (
  <svg fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
    />
  </svg>
);

const LeavesIcon = () => (
  <svg fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"
    />
  </svg>
);

const FeedbackIcon = () => (
  <svg fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z"
    />
  </svg>
);

const ProfileIcon = () => (
  <svg fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
    />
  </svg>
);

const LogoutIcon = () => (
  <svg fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1"
    />
  </svg>
);

const MenuIcon = () => (
  <svg fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      d="M4 6h16M4 12h16M4 18h16"
    />
  </svg>
);

const BellIcon = () => (
  <svg fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9"
    />
  </svg>
);

const LogoIcon = () => (
  <svg fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      d="M4 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2V6zM14 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V6zM4 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2v-2zM14 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z"
    />
  </svg>
);

const pageTitles = {
  dashboard: "Dashboard",
  employees: "Employees",
  attendance: "Attendance",
  leaves: "Leave Management",
  feedback: "Feedback & Complaints",
  profile: "My Profile",
};

const sidebarLabels = {
  dashboard: "Dashboard",
  employees: "Employees",
  attendance: "Attendance",
  leaves: "Leaves",
  feedback: "Feedback",
  profile: "Profile",
};

function App() {
  const [token, setToken] = useState(localStorage.getItem("token") || null);
  const [user, setUser] = useState(null);
  const [activeTab, setActiveTab] = useState("dashboard");
  const [sidebarExpanded, setSidebarExpanded] = useState(false);
  const [showNotifications, setShowNotifications] = useState(false);
  const [notifications, setNotifications] = useState([]);
  const notificationRef = useRef(null);

  const handleLogout = () => {
    setToken(null);
    setUser(null);
    localStorage.removeItem("token");
    setActiveTab("dashboard");
  };

  const loadProfile = async () => {
    try {
      const res = await fetch(`${API_URL}/auth/profile`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      if (res.ok) {
        const data = await res.json();
        setUser(data);
      } else {
        handleLogout();
      }
    } catch {
      handleLogout();
    }
  };

  const loadNotifications = async () => {
    try {
      // Load pending leaves count
      const leavesRes = await fetch(`${API_URL}/leaves`, {
        headers: { Authorization: `Bearer ${token}` },
      });

      const notifs = [];

      if (leavesRes.ok) {
        const leaves = await leavesRes.json();
        const pendingLeaves = leaves.filter((l) => l.status === "pending");
        if (pendingLeaves.length > 0) {
          notifs.push({
            id: "leaves",
            title: "Pending Leave Requests",
            message: `${pendingLeaves.length} leave request(s) awaiting approval`,
            type: "warning",
            time: "Now",
          });
        }
      }

      // Load pending feedback count for admin
      if (user?.role === "admin") {
        const feedbackRes = await fetch(`${API_URL}/feedback/pending-count`, {
          headers: { Authorization: `Bearer ${token}` },
        });

        if (feedbackRes.ok) {
          const { count } = await feedbackRes.json();
          if (count > 0) {
            notifs.push({
              id: "feedback",
              title: "New Feedback",
              message: `${count} feedback item(s) pending review`,
              type: "info",
              time: "Now",
            });
          }
        }
      }

      setNotifications(notifs);
    } catch (error) {
      console.error("Error loading notifications:", error);
    }
  };

  useEffect(() => {
    if (token) {
      loadProfile();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [token]);

  useEffect(() => {
    if (user) {
      loadNotifications();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [user]);

  // Close notifications when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (
        notificationRef.current &&
        !notificationRef.current.contains(event.target)
      ) {
        setShowNotifications(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleLogin = (newToken, userData) => {
    setToken(newToken);
    setUser(userData);
    localStorage.setItem("token", newToken);
  };

  const toggleSidebar = () => {
    setSidebarExpanded(!sidebarExpanded);
  };

  if (!token || !user) {
    return <Auth onLogin={handleLogin} />;
  }

  const isAdmin = user.role === "admin";
  const initials = user.name
    .split(" ")
    .map((n) => n[0])
    .join("")
    .toUpperCase()
    .substring(0, 2);

  // Navigation items based on role
  const navItems = isAdmin
    ? [
        {
          key: "dashboard",
          icon: DashboardIcon,
          label: sidebarLabels.dashboard,
        },
        {
          key: "employees",
          icon: EmployeesIcon,
          label: sidebarLabels.employees,
        },
        {
          key: "attendance",
          icon: AttendanceIcon,
          label: sidebarLabels.attendance,
        },
        { key: "leaves", icon: LeavesIcon, label: sidebarLabels.leaves },
        { key: "feedback", icon: FeedbackIcon, label: sidebarLabels.feedback },
      ]
    : [
        {
          key: "dashboard",
          icon: DashboardIcon,
          label: sidebarLabels.dashboard,
        },
        {
          key: "attendance",
          icon: AttendanceIcon,
          label: sidebarLabels.attendance,
        },
        { key: "leaves", icon: LeavesIcon, label: sidebarLabels.leaves },
        { key: "feedback", icon: FeedbackIcon, label: sidebarLabels.feedback },
      ];

  return (
    <div className="app">
      {/* Sidebar */}
      <aside className={`sidebar ${sidebarExpanded ? "expanded" : ""}`}>
        <div className="sidebar-logo">
          <LogoIcon />
          {sidebarExpanded && <span className="sidebar-logo-text">PulseHR</span>}
        </div>

        <nav className="sidebar-nav">
          {navItems.map(({ key, icon: Icon, label }) => (
            <button
              key={key}
              className={`sidebar-item ${!sidebarExpanded ? "tooltip" : ""} ${activeTab === key ? "active" : ""}`}
              onClick={() => setActiveTab(key)}
              data-tooltip={label}
            >
              <Icon />
              {sidebarExpanded && (
                <span className="sidebar-label">{label}</span>
              )}
            </button>
          ))}
        </nav>

        <div className="sidebar-bottom">
          <button
            className={`sidebar-item ${!sidebarExpanded ? "tooltip" : ""} ${activeTab === "profile" ? "active" : ""}`}
            onClick={() => setActiveTab("profile")}
            data-tooltip="Profile"
          >
            <ProfileIcon />
            {sidebarExpanded && <span className="sidebar-label">Profile</span>}
          </button>
          <button
            className={`logout-btn ${!sidebarExpanded ? "tooltip" : ""}`}
            onClick={handleLogout}
            data-tooltip="Logout"
          >
            <LogoutIcon />
            {sidebarExpanded && <span className="sidebar-label">Logout</span>}
          </button>
        </div>
      </aside>

      {/* Main Content */}
      <main
        className={`main-content ${sidebarExpanded ? "sidebar-expanded" : ""}`}
      >
        {/* Header */}
        <header className="header">
          <div className="header-left">
            <button className="menu-toggle" onClick={toggleSidebar}>
              <MenuIcon />
            </button>
            <h1 className="page-title">{pageTitles[activeTab]}</h1>
          </div>

          <div className="header-right">
            <div className="notification-wrapper" ref={notificationRef}>
              <button
                className="header-icon-btn notification-btn"
                onClick={() => setShowNotifications(!showNotifications)}
              >
                <BellIcon />
                {notifications.length > 0 && (
                  <span className="notification-badge">
                    {notifications.length}
                  </span>
                )}
              </button>

              {showNotifications && (
                <div className="notification-dropdown">
                  <div className="notification-header">
                    <h3>Notifications</h3>
                    {notifications.length > 0 && (
                      <span className="notification-count">
                        {notifications.length} new
                      </span>
                    )}
                  </div>
                  <div className="notification-list">
                    {notifications.length === 0 ? (
                      <div className="notification-empty">
                        No new notifications
                      </div>
                    ) : (
                      notifications.map((notif) => (
                        <div
                          key={notif.id}
                          className={`notification-item notification-${notif.type}`}
                          onClick={() => {
                            if (notif.id === "leaves") setActiveTab("leaves");
                            if (notif.id === "feedback")
                              setActiveTab("feedback");
                            setShowNotifications(false);
                          }}
                        >
                          <div className="notification-content">
                            <p className="notification-title">{notif.title}</p>
                            <p className="notification-message">
                              {notif.message}
                            </p>
                          </div>
                          <span className="notification-time">
                            {notif.time}
                          </span>
                        </div>
                      ))
                    )}
                  </div>
                </div>
              )}
            </div>
            <div
              className="user-avatar"
              onClick={() => setActiveTab("profile")}
              title="View Profile"
            >
              {initials}
            </div>
          </div>
        </header>

        {/* Content Area */}
        <div className="content">
          {activeTab === "dashboard" && (
            <Dashboard token={token} user={user} isAdmin={isAdmin} />
          )}
          {activeTab === "employees" && isAdmin && (
            <Employees token={token} user={user} isAdmin={isAdmin} />
          )}
          {activeTab === "attendance" && (
            <Attendance token={token} user={user} isAdmin={isAdmin} />
          )}
          {activeTab === "leaves" && (
            <Leaves token={token} user={user} isAdmin={isAdmin} />
          )}
          {activeTab === "feedback" && (
            <Feedback token={token} user={user} isAdmin={isAdmin} />
          )}
          {activeTab === "profile" && (
            <Profile token={token} user={user} onUpdate={loadProfile} />
          )}
        </div>
      </main>
    </div>
  );
}

export default App;
