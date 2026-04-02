import React, { useEffect, useState } from "react";
import { adminService, getStoredUser } from "../../services/api";
import { useNavigate } from "react-router-dom";
import OrderManagement from "../admin/OrderManagement";
import ProductManagement from "../admin/ProductManagement";
import "./auth.css";

const AdminDashboard = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [activeTab, setActiveTab] = useState("products");
  const navigate = useNavigate();

  const currentUser = getStoredUser();

  useEffect(() => {
    // Check if the user is actually an admin
    if (!currentUser || currentUser.role !== "admin") {
      navigate("/");
      return;
    }

    if (activeTab === "users") {
      fetchUsers();
    }
  }, [currentUser, navigate, activeTab]);

  const fetchUsers = async () => {
    try {
      const data = await adminService.getUsers();
      // the backend returns { users: [...], ... }
      setUsers(Array.isArray(data) ? data : (data.users || []));
    } catch (err) {
      setError(err.message || "Failed to load users");
    } finally {
      setLoading(false);
    }
  };

  const handleRoleChange = async (userId, newRole) => {
    try {
      await adminService.updateRole(userId, newRole);
      setUsers(users.map(u => (u._id === userId ? { ...u, role: newRole } : u)));
      alert(`User role updated to ${newRole}`);
    } catch (err) {
      alert(err.message || "Failed to update role");
    }
  };

  const handleDeleteUser = async (userId) => {
    if (!window.confirm("Are you sure you want to delete this user? This action cannot be undone.")) return;
    try {
      await adminService.deleteUser(userId);
      setUsers(users.filter(u => u._id !== userId));
      alert("User deleted successfully.");
    } catch (err) {
      alert(err.message || "Failed to delete user");
    }
  };

  if (loading && activeTab === "users") return <div className="auth-page"><div className="auth-card">Loading administration panel...</div></div>;

  return (
    <div className="admin-dashboard">
      <div className="dashboard-header">
        <h1>Admin Dashboard</h1>
        <p>Welcome, {currentUser?.username}!</p>
      </div>

      <div className="dashboard-tabs">
        <button 
          className={`tab-btn ${activeTab === "products" ? "active" : ""}`}
          onClick={() => setActiveTab("products")}
        >
          Product Management
        </button>
        <button 
          className={`tab-btn ${activeTab === "users" ? "active" : ""}`}
          onClick={() => setActiveTab("users")}
        >
          User Management
        </button>
        <button 
          className={`tab-btn ${activeTab === "orders" ? "active" : ""}`}
          onClick={() => setActiveTab("orders")}
        >
          Order Management
        </button>
      </div>

      {error && <div className="error-message">{error}</div>}

      <div className="dashboard-content">
        {activeTab === "products" && (
          <div className="products-section">
            <ProductManagement />
          </div>
        )}

        {activeTab === "users" && (
          <div className="users-section">
            <h2>User Management</h2>
            <table style={{ width: "100%", borderCollapse: "collapse", textAlign: "left" }}>
              <thead>
                <tr style={{ borderBottom: "2px solid #eee" }}>
                  <th style={{ padding: "12px 8px" }}>Name</th>
                  <th style={{ padding: "12px 8px" }}>Email</th>
                  <th style={{ padding: "12px 8px" }}>Current Role</th>
                  <th style={{ padding: "12px 8px" }}>Action</th>
                </tr>
              </thead>
              <tbody>
                {users.map(u => (
                  <tr key={u._id} style={{ borderBottom: "1px solid #eee" }}>
                    <td style={{ padding: "12px 8px" }}>{u.username}</td>
                    <td style={{ padding: "12px 8px", color: "#666" }}>{u.email}</td>
                    <td style={{ padding: "12px 8px" }}>
                      <span className={`role-badge ${u.role}`}>{u.role}</span>
                    </td>
                    <td style={{ padding: "12px 8px" }}>
                      <select
                        value={u.role}
                        onChange={(e) => handleRoleChange(u._id, e.target.value)}
                        className="role-select"
                      >
                        <option value="user">User</option>
                        <option value="admin">Admin</option>
                      </select>
                      <button
                        onClick={() => handleDeleteUser(u._id)}
                        className="delete-btn"
                        disabled={u._id === currentUser._id}
                        style={{ marginLeft: "8px" }}
                      >
                        Delete
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        {activeTab === "orders" && (
          <div className="orders-section">
            <OrderManagement />
          </div>
        )}
      </div>
    </div>
  );
};

export default AdminDashboard;
