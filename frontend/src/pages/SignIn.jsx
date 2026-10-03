import React, { useState } from "react";
import { Mail, Lock, LogIn, Coffee, Eye, EyeOff } from "lucide-react";
import { useAuth } from "../context/AuthContext";
import { authAPI } from "../services/api";

const SignIn = ({ onNavigate }) => {
  const [formData, setFormData] = useState({ email: "", password: "" });
  const [showPassword, setShowPassword] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");

  const { login } = useAuth();

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
    if (errorMsg) setErrorMsg("");
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    setErrorMsg("");

    try {
      const { data } = await authAPI.login(formData.email, formData.password);
      login(data);
    } catch (err) {
      setErrorMsg(
        err.response?.data?.message || "Invalid credentials. Please try again."
      );
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="auth-page-wrapper">
      {/* Background blobs */}
      <div className="auth-blob auth-blob-1" />
      <div className="auth-blob auth-blob-2" />

      <div className="auth-card animate-fadeInUp">
        {/* Brand Header */}
        <div className="auth-brand">
          <div className="auth-brand-icon">
            <Coffee size={28} />
          </div>
          <h1 className="auth-brand-title">MazariCS</h1>
          <p className="auth-brand-subtitle">Welcome back — sign in to continue</p>
        </div>

        {/* Error Alert */}
        {errorMsg && (
          <div className="auth-error animate-fadeIn" role="alert">
            <span>⚠️ {errorMsg}</span>
          </div>
        )}

        {/* Form */}
        <form onSubmit={handleSubmit} className="auth-form" noValidate>
          {/* Email */}
          <div className="auth-field-group">
            <label className="auth-label" htmlFor="signin-email">
              Email Address
            </label>
            <div className="auth-input-wrapper">
              <Mail size={16} className="auth-input-icon" />
              <input
                id="signin-email"
                type="email"
                name="email"
                required
                autoComplete="email"
                value={formData.email}
                onChange={handleChange}
                placeholder="name@example.com"
                className="auth-input"
              />
            </div>
          </div>

          {/* Password */}
          <div className="auth-field-group">
            <label className="auth-label" htmlFor="signin-password">
              Password
            </label>
            <div className="auth-input-wrapper">
              <Lock size={16} className="auth-input-icon" />
              <input
                id="signin-password"
                type={showPassword ? "text" : "password"}
                name="password"
                required
                minLength={6}
                autoComplete="current-password"
                value={formData.password}
                onChange={handleChange}
                placeholder="••••••••"
                className="auth-input auth-input-padded-right"
              />
              <button
                type="button"
                className="auth-eye-btn"
                onClick={() => setShowPassword(!showPassword)}
                aria-label={showPassword ? "Hide password" : "Show password"}
              >
                {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
              </button>
            </div>
            {/* Forgot Password Link */}
            <button
              type="button"
              className="auth-forgot-link"
              onClick={() => onNavigate("forgot-password")}
            >
              Forgot Password?
            </button>
          </div>

          {/* Submit */}
          <button
            id="signin-submit-btn"
            type="submit"
            disabled={submitting}
            className={`auth-submit-btn${submitting ? " auth-submit-btn--loading" : ""}`}
          >
            {submitting ? (
              <>
                <span className="auth-spinner" />
                Signing In...
              </>
            ) : (
              <>
                <LogIn size={16} />
                Sign In
              </>
            )}
          </button>
        </form>

        {/* Toggle to Register */}
        <div className="auth-toggle">
          <span>Don't have an account?</span>
          <button
            type="button"
            className="auth-toggle-link"
            onClick={() => onNavigate("register")}
          >
            Sign Up
          </button>
        </div>
      </div>
    </div>
  );
};

export default SignIn;
