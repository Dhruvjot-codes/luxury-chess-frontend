import React, { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import "./auth.css";
import { authService } from "../../services/api";

// Step 2 of OTP registration: verify OTP and activation token
// POST /api/users/register/verify with { activationToken, otp }
// After verification, redirect to login page
const Verify = () => {
  const [otp, setOtp] = useState("");
  const [activationToken, setActivationToken] = useState("");
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const location = useLocation();
  const navigate = useNavigate();

  useEffect(() => {
    // Get data from navigation state (preferred) or URL params
    if (location.state) {
      setActivationToken(location.state.activationToken || "");
      setEmail(location.state.email || "");
    } else {
      // Fallback to URL params
      const params = new URLSearchParams(window.location.search);
      const token = params.get("activationToken") || "";
      const emailParam = params.get("email") || "";
      setActivationToken(token);
      setEmail(emailParam);
    }
  }, [location]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setSuccess("");
    setLoading(true);

    try {
      if (!activationToken) {
        throw new Error("Activation token missing. Please register again.");
      }

      if (!otp) {
        throw new Error("OTP is required");
      }

      const data = await authService.verifyOtp(activationToken, otp);

      if (data.token) {
        localStorage.setItem("authToken", data.token);
        if (data.user) {
          localStorage.setItem("user", JSON.stringify(data.user));
        }
      }

      setSuccess("Your account has been verified successfully!");
      
      // After successful verification, redirect to home page
      setTimeout(() => {
        navigate("/", { replace: true });
      }, 1500);
    } catch (err) {
      setError(err.message || "OTP verification failed. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-page">
      <div className="auth-card">
        <h1 className="auth-title">Verify your email</h1>
        <p className="auth-subtitle">
          Enter the OTP we sent to <strong>{email || "your email"}</strong>.
        </p>

        {error && <div className="auth-error">{error}</div>}
        {success && <div className="auth-success">{success}</div>}

        <form onSubmit={handleSubmit} className="auth-form">
          <label className="auth-label">
            OTP code
            <input
              type="text"
              value={otp}
              onChange={(e) => setOtp(e.target.value)}
              required
              className="auth-input"
              placeholder="6‑digit code"
            />
          </label>

          <button type="submit" className="auth-button" disabled={loading}>
            {loading ? "Verifying..." : "Verify account"}
          </button>
        </form>
      </div>
    </div>
  );
};

export default Verify;

