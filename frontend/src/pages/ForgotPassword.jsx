import React, { useState } from "react";
import { Mail, ArrowLeft, Coffee, Send } from "lucide-react";
import { authAPI } from "../services/api";

const ForgotPassword = ({ onNavigate }) => {
  const [email, setEmail] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");
  const [successMsg, setSuccessMsg] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrorMsg("");
    setSuccessMsg("");

    if (!email.trim()) {
      setErrorMsg("Please enter your email address.");
      return;
    }

    setSubmitting(true);
    try {
      const { data } = await authAPI.sendOtp(email.trim().toLowerCase());
      setSuccessMsg(data.message || "OTP sent! Check your inbox.");

      // After short delay, navigate to the OTP verification step
      setTimeout(() => {
        onNavigate("verify-otp", { email: email.trim().toLowerCase() });
      }, 1500);
    } catch (err) {
      setErrorMsg(
        err.response?.data?.message || "Something went wrong. Please try again."
      );
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="auth-page-wrapper">
      <div className="auth-blob auth-blob-1" />
      <div className="auth-blob auth-blob-2" />

      <div className="auth-card animate-fadeInUp">
        {/* Back Button */}
        <button
          type="button"
          className="auth-back-btn"
          onClick={() => onNavigate("login")}
          aria-label="Back to sign in"
        >
          <ArrowLeft size={16} />
          Back to Sign In
        </button>

        {/* Brand Header */}
        <div className="auth-brand">
          <div className="auth-brand-icon" style={{ background: "linear-gradient(135deg,#C68B45,#a87337)" }}>
            <Coffee size={28} />
          </div>
          <h1 className="auth-brand-title">Forgot Password?</h1>
          <p className="auth-brand-subtitle">
            Enter your email and we'll send you a 6-digit OTP to reset your password.
          </p>
        </div>

        {/* Success Message */}
        {successMsg && (
          <div className="auth-success animate-fadeIn" role="status">
            <span>✅ {successMsg}</span>
          </div>
        )}

        {/* Error Alert */}
        {errorMsg && (
          <div className="auth-error animate-fadeIn" role="alert">
            <span>⚠️ {errorMsg}</span>
          </div>
        )}

        {/* Form */}
        <form onSubmit={handleSubmit} className="auth-form" noValidate>
          <div className="auth-field-group">
            <label className="auth-label" htmlFor="forgot-email">
              Registered Email Address
            </label>
            <div className="auth-input-wrapper">
              <Mail size={16} className="auth-input-icon" />
              <input
                id="forgot-email"
                type="email"
                name="email"
                required
                autoComplete="email"
                value={email}
                onChange={(e) => {
                  setEmail(e.target.value);
                  if (errorMsg) setErrorMsg("");
                }}
                placeholder="name@example.com"
                className="auth-input"
                disabled={!!successMsg}
              />
            </div>
          </div>

          <button
            id="forgot-submit-btn"
            type="submit"
            disabled={submitting || !!successMsg}
            className={`auth-submit-btn${submitting ? " auth-submit-btn--loading" : ""}`}
          >
            {submitting ? (
              <>
                <span className="auth-spinner" />
                Sending OTP...
              </>
            ) : (
              <>
                <Send size={16} />
                Send OTP
              </>
            )}
          </button>
        </form>

        {/* OTP Info Note */}
        <div className="auth-info-note">
          <span>🔒</span>
          <p>
            The OTP is valid for <strong>10 minutes</strong>. Check your spam folder if you don't see it.
          </p>
        </div>
      </div>
    </div>
  );
};

export default ForgotPassword;
