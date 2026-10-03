import React, { useState, useRef, useEffect } from "react";
import { Lock, ArrowLeft, Coffee, Eye, EyeOff, ShieldCheck } from "lucide-react";
import { authAPI } from "../services/api";

const VerifyOtpReset = ({ onNavigate, pageState }) => {
  const prefillEmail = pageState?.email || "";

  const [email, setEmail] = useState(prefillEmail);
  const [otp, setOtp] = useState(["", "", "", "", "", ""]);
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");
  const [successMsg, setSuccessMsg] = useState("");

  const otpRefs = useRef([]);

  // Auto-focus first OTP box on mount
  useEffect(() => {
    if (otpRefs.current[0]) otpRefs.current[0].focus();
  }, []);

  // Handle individual OTP digit input
  const handleOtpChange = (index, value) => {
    if (!/^\d?$/.test(value)) return; // digits only
    const newOtp = [...otp];
    newOtp[index] = value;
    setOtp(newOtp);
    if (errorMsg) setErrorMsg("");

    // Auto-advance to next box
    if (value && index < 5) {
      otpRefs.current[index + 1]?.focus();
    }
  };

  // Handle backspace to go back
  const handleOtpKeyDown = (index, e) => {
    if (e.key === "Backspace" && !otp[index] && index > 0) {
      otpRefs.current[index - 1]?.focus();
    }
  };

  // Handle paste (paste all 6 digits at once)
  const handleOtpPaste = (e) => {
    e.preventDefault();
    const pasted = e.clipboardData.getData("text").replace(/\D/g, "").slice(0, 6);
    if (pasted.length === 6) {
      setOtp(pasted.split(""));
      otpRefs.current[5]?.focus();
    }
  };

  const otpString = otp.join("");
  const passwordsMatch = newPassword && confirmPassword && newPassword === confirmPassword;

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrorMsg("");
    setSuccessMsg("");

    if (!email.trim()) {
      setErrorMsg("Email address is required.");
      return;
    }
    if (otpString.length !== 6) {
      setErrorMsg("Please enter the complete 6-digit OTP.");
      return;
    }
    if (newPassword.length < 6) {
      setErrorMsg("Password must be at least 6 characters.");
      return;
    }
    if (newPassword !== confirmPassword) {
      setErrorMsg("Passwords do not match.");
      return;
    }

    setSubmitting(true);
    try {
      const { data } = await authAPI.resetPasswordOtp(
        email.trim().toLowerCase(),
        otpString,
        newPassword
      );
      setSuccessMsg(data.message || "Password reset successfully!");

      // Navigate back to login after success
      setTimeout(() => {
        onNavigate("login");
      }, 2000);
    } catch (err) {
      setErrorMsg(
        err.response?.data?.message || "Failed to reset password. Please try again."
      );
    } finally {
      setSubmitting(false);
    }
  };

  const handleResendOtp = async () => {
    if (!email.trim()) {
      setErrorMsg("Please enter your email to resend the OTP.");
      return;
    }
    setErrorMsg("");
    setSuccessMsg("");
    try {
      await authAPI.sendOtp(email.trim().toLowerCase());
      setSuccessMsg("New OTP sent to your email!");
      setOtp(["", "", "", "", "", ""]);
      setTimeout(() => otpRefs.current[0]?.focus(), 100);
    } catch (err) {
      setErrorMsg(err.response?.data?.message || "Failed to resend OTP.");
    }
  };

  return (
    <div className="auth-page-wrapper">
      <div className="auth-blob auth-blob-1" />
      <div className="auth-blob auth-blob-2" />

      <div className="auth-card animate-fadeInUp" style={{ maxWidth: "460px" }}>
        {/* Back Button */}
        <button
          type="button"
          className="auth-back-btn"
          onClick={() => onNavigate("forgot-password")}
          aria-label="Back to forgot password"
        >
          <ArrowLeft size={16} />
          Back
        </button>

        {/* Brand Header */}
        <div className="auth-brand">
          <div className="auth-brand-icon" style={{ background: "linear-gradient(135deg,#10B981,#059669)" }}>
            <ShieldCheck size={28} />
          </div>
          <h1 className="auth-brand-title">Verify OTP</h1>
          <p className="auth-brand-subtitle">
            Enter the 6-digit code sent to your email and set a new password.
          </p>
        </div>

        {/* Success Message */}
        {successMsg && (
          <div className="auth-success animate-bounceIn" role="status">
            <span>✅ {successMsg}</span>
          </div>
        )}

        {/* Error Alert */}
        {errorMsg && (
          <div className="auth-error animate-fadeIn" role="alert">
            <span>⚠️ {errorMsg}</span>
          </div>
        )}

        <form onSubmit={handleSubmit} className="auth-form" noValidate>
          {/* Email (only shown if not prefilled from ForgotPassword state) */}
          {!prefillEmail && (
            <div className="auth-field-group">
              <label className="auth-label" htmlFor="verify-email">
                Email Address
              </label>
              <div className="auth-input-wrapper">
                <input
                  id="verify-email"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="Your registered email"
                  className="auth-input"
                  style={{ paddingLeft: "16px" }}
                />
              </div>
            </div>
          )}

          {/* Email display (read-only when prefilled) */}
          {prefillEmail && (
            <div className="auth-email-chip">
              <span>📧</span>
              <span>{prefillEmail}</span>
            </div>
          )}

          {/* 6-Digit OTP Input */}
          <div className="auth-field-group">
            <label className="auth-label">6-Digit OTP Code</label>
            <div className="auth-otp-grid" onPaste={handleOtpPaste}>
              {otp.map((digit, idx) => (
                <input
                  key={idx}
                  ref={(el) => (otpRefs.current[idx] = el)}
                  id={`otp-digit-${idx}`}
                  type="text"
                  inputMode="numeric"
                  maxLength={1}
                  value={digit}
                  onChange={(e) => handleOtpChange(idx, e.target.value)}
                  onKeyDown={(e) => handleOtpKeyDown(idx, e)}
                  className={`auth-otp-input${digit ? " auth-otp-input--filled" : ""}`}
                  aria-label={`OTP digit ${idx + 1}`}
                />
              ))}
            </div>
            <button
              type="button"
              className="auth-resend-btn"
              onClick={handleResendOtp}
            >
              Didn't receive the code? Resend OTP
            </button>
          </div>

          {/* New Password */}
          <div className="auth-field-group">
            <label className="auth-label" htmlFor="verify-new-password">
              New Password
            </label>
            <div className="auth-input-wrapper">
              <Lock size={16} className="auth-input-icon" />
              <input
                id="verify-new-password"
                type={showPassword ? "text" : "password"}
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                placeholder="Min. 6 characters"
                className="auth-input auth-input-padded-right"
                autoComplete="new-password"
              />
              <button
                type="button"
                className="auth-eye-btn"
                onClick={() => setShowPassword(!showPassword)}
                aria-label="Toggle password visibility"
              >
                {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
              </button>
            </div>
          </div>

          {/* Confirm New Password */}
          <div className="auth-field-group">
            <label className="auth-label" htmlFor="verify-confirm-password">
              Confirm New Password
            </label>
            <div className="auth-input-wrapper">
              <Lock size={16} className="auth-input-icon" />
              <input
                id="verify-confirm-password"
                type={showConfirmPassword ? "text" : "password"}
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                placeholder="Re-enter new password"
                className={`auth-input auth-input-padded-right${
                  confirmPassword && !passwordsMatch ? " auth-input-error" : ""
                }`}
                autoComplete="new-password"
              />
              <button
                type="button"
                className="auth-eye-btn"
                onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                aria-label="Toggle confirm password visibility"
              >
                {showConfirmPassword ? <EyeOff size={16} /> : <Eye size={16} />}
              </button>
            </div>
            {confirmPassword && !passwordsMatch && (
              <p className="auth-field-error">Passwords do not match</p>
            )}
          </div>

          {/* Submit */}
          <button
            id="verify-otp-submit-btn"
            type="submit"
            disabled={submitting || !!successMsg}
            className={`auth-submit-btn${submitting ? " auth-submit-btn--loading" : ""}`}
            style={{ background: "linear-gradient(135deg,#10B981,#059669)" }}
          >
            {submitting ? (
              <>
                <span className="auth-spinner" />
                Resetting Password...
              </>
            ) : (
              <>
                <ShieldCheck size={16} />
                Reset Password
              </>
            )}
          </button>
        </form>
      </div>
    </div>
  );
};

export default VerifyOtpReset;
