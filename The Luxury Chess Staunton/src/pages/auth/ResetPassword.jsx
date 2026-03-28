import React, { useState } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import "./auth.css";
import { authService } from "../../services/api";

const ResetPassword = () => {
  const { token } = useParams();
  const navigate = useNavigate();
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setSuccess("");

    if (password !== confirmPassword) {
      setError("Passwords do not match");
      return;
    }

    setLoading(true);

    try {
      const data = await authService.resetPassword(token, password);
      setSuccess("Your password has been reset successfully!");
      setTimeout(() => navigate("/login"), 3000);
    } catch (err) {
      setError(err.message || "Failed to reset password. The link may have expired.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-page">
      <div className="auth-card">
        <h2 className="auth-title">Set new password</h2>
        <p className="auth-subtitle">
          Please enter your new password below.
        </p>

        {error && <div className="auth-error">{error}</div>}
        {success && <div className="auth-success">{success}</div>}

        <form onSubmit={handleSubmit} className="auth-form">
          <label className="auth-label">
            New password
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              className="auth-input"
              placeholder="Enter at least 8 characters"
              minLength="8"
            />
          </label>

          <label className="auth-label">
            Confirm new password
            <input
              type="password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              required
              className="auth-input"
              placeholder="Type it again"
              minLength="8"
            />
          </label>

          <button type="submit" className="auth-button" disabled={loading}>
            {loading ? "Resetting..." : "Save password"}
          </button>
        </form>
        <p className="auth-subtitle" style={{ marginTop: "12px" }}>
            Return to {" "}
            <Link to="/login" style={{ color: "#38bdf8", textDecoration: "none" }}>
              Login
            </Link>
        </p>
      </div>
    </div>
  );
};

export default ResetPassword;
