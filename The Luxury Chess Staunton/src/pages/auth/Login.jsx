import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import "./auth.css";
import { authService, setStoredUser } from "../../services/api";

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      if (!email || !password) {
        throw new Error("Email and password are required");
      }

      const data = await authService.login(email, password);

      if (data.token) {
        localStorage.setItem("authToken", data.token);
        if (data.user) {
          setStoredUser(data.user);
        }
        // Redirect to home on successful login
        navigate("/", { replace: true });
      } else {
        throw new Error(data.message || "Login failed");
      }
    } catch (err) {
      setError("Login failed. Please check your credentials and try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-page">
      <div className="auth-card">
        <h1 className="auth-title">Welcome back</h1>
        <p className="auth-subtitle">Log in to manage your orders.</p>

        {error && <div className="auth-error">{error}</div>}

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

          <label className="auth-label">
            Password
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              className="auth-input"
              placeholder="••••••••"
            />
          </label>

          <button type="submit" className="auth-button" disabled={loading}>
            {loading ? "Logging in..." : "Log in"}
          </button>
        </form>
        <p className="auth-subtitle" style={{ marginTop: "12px" }}>
          Don&apos;t have an account yet?{" "}
          <Link to="/register" style={{ color: "#38bdf8", textDecoration: "none" }}>
            Register
          </Link>
        </p>
      </div>
    </div>
  );
};

export default Login;

