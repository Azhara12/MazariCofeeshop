import React, { useState } from "react";
import { Mail, Lock, User, Coffee, Eye, EyeOff, CheckCircle } from "lucide-react";
import { useAuth } from "../context/AuthContext";
import { authAPI } from "../services/api";

const SignUp = ({ onNavigate }) => {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    confirmPassword: "",
  });
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");

  const { login } = useAuth();

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
    if (errorMsg) setErrorMsg("");
  };

  const passwordStrength = () => {
    const p = formData.password;
    if (!p) return null;
    if (p.length < 6) return { label: "Too short", color: "#EF4444", width: "25%" };
    if (p.length < 8) return { label: "Weak", color: "#F59E0B", width: "50%" };
    if (p.match(/[A-Z]/) && p.match(/[0-9]/)) return { label: "Strong", color: "#10B981", width: "100%" };
    return { label: "Fair", color: "#C68B45", width: "75%" };
  };

  const strength = passwordStrength();
  const passwordsMatch = formData.password && formData.confirmPassword &&
    formData.password === formData.confirmPassword;

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrorMsg("");

    if (formData.password !== formData.confirmPassword) {
      setErrorMsg("Passwords do not match.");
      return;
    }
    if (formData.password.length < 6) {
      setErrorMsg("Password must be at least 6 characters.");
      return;
    }

    setSubmitting(true);
    try {
      const { data } = await authAPI.register(
        formData.name,
        formData.email,
        formData.password
      );
      login(data);
    } catch (err) {
      setErrorMsg(
        err.response?.data?.message || "Registration failed. Please try again."
      );
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="auth-page-wrapper">
      <div className="auth-blob auth-blob-1" />
      <div className="auth-blob auth-blob-2" />

      <div className="auth-card animate-fadeInUp" style={{ maxWidth: "460px" }}>
        {/* Brand Header */}
        <div className="auth-brand">
          <div className="auth-brand-icon">
            <Coffee size={28} />
          </div>
          <h1 className="auth-brand-title">Create Account</h1>
          <p className="auth-brand-subtitle">Join MazariCS — start your coffee journey</p>
        </div>

        {/* Error Alert */}
        {errorMsg && (
          <div className="auth-error animate-fadeIn" role="alert">
            <span>⚠️ {errorMsg}</span>
          </div>
        )}

        {/* Form */}
        <form onSubmit={handleSubmit} className="auth-form" noValidate>
          {/* Full Name */}
          <div className="auth-field-group">
            <label className="auth-label" htmlFor="signup-name">
              Full Name
            </label>
            <div className="auth-input-wrapper">
              <User size={16} className="auth-input-icon" />
              <input
                id="signup-name"
                type="text"
                name="name"
                required
                autoComplete="name"
                value={formData.name}
                onChange={handleChange}
                placeholder="Azhar Mahmood"
                className="auth-input"
              />
            </div>
          </div>

          {/* Email */}
          <div className="auth-field-group">
            <label className="auth-label" htmlFor="signup-email">
              Email Address
            </label>
            <div className="auth-input-wrapper">
              <Mail size={16} className="auth-input-icon" />
              <input
                id="signup-email"
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
            <label className="auth-label" htmlFor="signup-password">
              Password
            </label>
            <div className="auth-input-wrapper">
              <Lock size={16} className="auth-input-icon" />
              <input
                id="signup-password"
                type={showPassword ? "text" : "password"}
                name="password"
                required
                minLength={6}
                autoComplete="new-password"
                value={formData.password}
                onChange={handleChange}
                placeholder="Min. 6 characters"
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
            {/* Password Strength Bar */}
            {strength && (
              <div className="auth-strength-bar">
                <div
                  className="auth-strength-fill"
                  style={{ width: strength.width, background: strength.color }}
                />
                <span className="auth-strength-label" style={{ color: strength.color }}>
                  {strength.label}
                </span>
              </div>
            )}
          </div>

          {/* Confirm Password */}
          <div className="auth-field-group">
            <label className="auth-label" htmlFor="signup-confirm-password">
              Confirm Password
            </label>
            <div className="auth-input-wrapper">
              <Lock size={16} className="auth-input-icon" />
              <input
                id="signup-confirm-password"
                type={showConfirmPassword ? "text" : "password"}
                name="confirmPassword"
                required
                autoComplete="new-password"
                value={formData.confirmPassword}
                onChange={handleChange}
                placeholder="Re-enter your password"
                className={`auth-input auth-input-padded-right${
                  formData.confirmPassword && !passwordsMatch ? " auth-input-error" : ""
                }`}
              />
              <button
                type="button"
                className="auth-eye-btn"
                onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                aria-label="Toggle confirm password visibility"
              >
                {showConfirmPassword ? <EyeOff size={16} /> : <Eye size={16} />}
              </button>
              {passwordsMatch && (
                <CheckCircle
                  size={16}
                  style={{ position: "absolute", right: "40px", top: "50%", transform: "translateY(-50%)", color: "#10B981" }}
                />
              )}
            </div>
            {formData.confirmPassword && !passwordsMatch && (
              <p className="auth-field-error">Passwords do not match</p>
            )}
          </div>

          {/* Submit */}
          <button
            id="signup-submit-btn"
            type="submit"
            disabled={submitting}
            className={`auth-submit-btn${submitting ? " auth-submit-btn--loading" : ""}`}
          >
            {submitting ? (
              <>
                <span className="auth-spinner" />
                Creating Account...
              </>
            ) : (
              "Create Account"
            )}
          </button>
        </form>

        {/* Toggle to Sign In */}
        <div className="auth-toggle">
          <span>Already have an account?</span>
          <button
            type="button"
            className="auth-toggle-link"
            onClick={() => onNavigate("login")}
          >
            Sign In
          </button>
        </div>
      </div>
    </div>
  );
};

export default SignUp;
