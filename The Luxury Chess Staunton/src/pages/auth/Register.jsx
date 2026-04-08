import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import "./auth.css";
import { authService } from "../../services/api";

// Registration flow:
// 1) POST /api/users/register/otp to request OTP & activation token
// 2) Redirect to Verify page with token in query params
// 3) User enters OTP and completes verification
// 4) Redirect to login page
const Register = () => {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setSuccess("");
    setLoading(true);

    try {
      if (!name || !email || !password) {
        throw new Error("All fields are required");
      }

      const data = await authService.register(name, email, password);

      // Successfully sent OTP
      if (data.activationToken) {
        setSuccess("Registration successful! Please check your email for OTP verification.");
        // Redirect to verify page with token and email in state
        navigate("/verify", {
          state: {
            activationToken: data.activationToken,
            email: email,
          },
        });
      } else {
        throw new Error(data.message || "Registration failed");
      }
    } catch (err) {
      setError(err.message || "Registration failed. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-page">
      <div className="auth-card">
        <h1 className="auth-title">Create your account</h1>
        <p className="auth-subtitle">
          Register to receive an OTP and confirm your email.
        </p>

        {error && <div className="auth-error">{error}</div>}
        {success && <div className="auth-success">{success}</div>}

        <form onSubmit={handleSubmit} className="auth-form">
          <label className="auth-label">
            Name
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
              className="auth-input"
              placeholder="Your name"
            />
          </label>

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

          <label className="auth-label">
            Password
            <div className="password-input-wrapper" style={{ position: 'relative' }}>
              <input
                type={showPassword ? "text" : "password"}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                className="auth-input"
                placeholder="Create a strong password"
                style={{ paddingRight: '45px' }}
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="password-toggle-btn"
                style={{
                  position: 'absolute',
                  right: '10px',
                  top: '50%',
                  transform: 'translateY(-50%)',
                  background: 'none',
                  border: 'none',
                  color: '#94a3b8',
                  cursor: 'pointer',
                  fontSize: '0.8rem',
                  fontWeight: '600',
                  padding: '5px'
                }}
              >
                {showPassword ? "HIDE" : "SHOW"}
              </button>
            </div>
          </label>

          <button type="submit" className="auth-button" disabled={loading}>
            {loading ? "Sending OTP..." : "Register"}
          </button>
        </form>
        <div className="auth-footer">
          <p>
            Already have an account? <Link to="/login">Log in</Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default Register;

