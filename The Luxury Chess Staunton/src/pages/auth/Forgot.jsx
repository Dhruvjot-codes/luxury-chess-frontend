import React, { useState } from "react";
import { Link } from "react-router-dom";
import "./auth.css";
import { authService } from "../../services/api";

const Forgot = () => {
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setSuccess("");
    setLoading(true);

    try {
      const data = await authService.forgotPassword(email);
      setSuccess(data.message || "Reset link sent successfully. Please check your email.");
    } catch (err) {
      setError(err.message || "Failed to send reset link. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-page">
      <div className="auth-card">
        <h1 className="auth-title">Forgot Password</h1>
        <p className="auth-subtitle">
          Enter your email and we'll send you a link to reset your password.
        </p>

        {error && <div className="auth-error">{error}</div>}
        {success && <div className="auth-success">{success}</div>}

        <form onSubmit={handleSubmit} className="auth-form">
          <label className="auth-label">
            Email
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              className="auth-input"
              placeholder="you@example.com"
            />
          </label>

          <button type="submit" className="auth-button" disabled={loading}>
            {loading ? "Sending..." : "Send link"}
          </button>
        </form>
        <p className="auth-subtitle" style={{ marginTop: "12px" }}>
          Remembered your password?{" "}
          <Link to="/login" style={{ color: "#38bdf8", textDecoration: "none" }}>
            Log in
          </Link>
        </p>
      </div>
    </div>
  );
};

export default Forgot;
