import React, { useState } from "react";
import { Mail, Lock, User, LogIn, Coffee } from "lucide-react";
import { useAuth } from "../../context/AuthContext";

const AuthPage = () => {
  const [isLogin, setIsLogin] = useState(true);
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
  });
  const [submitting, setSubmitting] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");

  const { login } = useAuth();

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    setErrorMsg("");

    const endpoint = isLogin ? "/api/auth/login" : "/api/auth/register";
    const payload = isLogin
      ? { email: formData.email, password: formData.password }
      : formData;

    try {
      const response = await fetch(endpoint, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(
          data.message || "Invalid credentials or error occurred",
        );
      }

      login(data);
    } catch (err) {
      setErrorMsg(err.message);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div
      style={{
        minHeight: "100vh",
        width: "100%",
        backgroundColor: "#3D2817",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        padding: "20px",
        fontFamily: "sans-serif",
        boxSizing: "border-box",
      }}
    >
      <div
        style={{
          backgroundColor: "#FAF6F0",
          width: "100%",
          maxWidth: "420px",
          borderRadius: "24px",
          padding: "32px",
          boxShadow: "0 20px 25px -5px rgba(0, 0, 0, 0.3)",
          border: "1px solid #e7e5e4",
          boxSizing: "border-box",
        }}
      >
        {/* Brand Header */}
        <div style={{ textAlign: "center", marginBottom: "24px" }}>
          <div
            style={{
              width: "56px",
              height: "56px",
              borderRadius: "50%",
              backgroundColor: "#C68B45",
              color: "#ffffff",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              margin: "0 auto 12px auto",
              boxShadow: "0 4px 6px -1px rgba(0, 0, 0, 0.1)",
            }}
          >
            <Coffee size={28} />
          </div>
          <h1
            style={{
              fontSize: "28px",
              fontWeight: "bold",
              color: "#3D2817",
              margin: 0,
            }}
          >
            MazariCS
          </h1>
          <p
            style={{
              fontSize: "13px",
              color: "#78716c",
              marginTop: "6px",
              marginBottom: 0,
            }}
          >
            {isLogin
              ? "Sign in to access your orders & menu"
              : "Create an account to start ordering"}
          </p>
        </div>

        {/* Error Alert */}
        {errorMsg && (
          <div
            style={{
              marginBottom: "16px",
              padding: "10px 14px",
              backgroundColor: "#fee2e2",
              border: "1px solid #fca5a5",
              color: "#b91c1c",
              fontSize: "12px",
              borderRadius: "12px",
              textAlign: "center",
              fontWeight: "500",
            }}
          >
            {errorMsg}
          </div>
        )}

        {/* Auth Form */}
        <form
          onSubmit={handleSubmit}
          style={{ display: "flex", flexDirection: "column", gap: "16px" }}
        >
          {!isLogin && (
            <div>
              <label
                style={{
                  display: "block",
                  fontSize: "12px",
                  fontWeight: "600",
                  color: "#57534e",
                  marginBottom: "6px",
                }}
              >
                Full Name
              </label>
              <div style={{ position: "relative" }}>
                <User
                  size={16}
                  style={{
                    position: "absolute",
                    left: "12px",
                    top: "12px",
                    color: "#a8a29e",
                  }}
                />
                <input
                  type="text"
                  name="name"
                  required
                  value={formData.name}
                  onChange={handleChange}
                  placeholder="Azhar Mahmood"
                  style={{
                    width: "100%",
                    paddingLeft: "38px",
                    paddingRight: "12px",
                    paddingTop: "10px",
                    paddingBottom: "10px",
                    fontSize: "14px",
                    backgroundColor: "#ffffff",
                    border: "1px solid #d6d3d1",
                    borderRadius: "12px",
                    outline: "none",
                    boxSizing: "border-box",
                  }}
                />
              </div>
            </div>
          )}

          <div>
            <label
              style={{
                display: "block",
                fontSize: "12px",
                fontWeight: "600",
                color: "#57534e",
                marginBottom: "6px",
              }}
            >
              Email Address
            </label>
            <div style={{ position: "relative" }}>
              <Mail
                size={16}
                style={{
                  position: "absolute",
                  left: "12px",
                  top: "12px",
                  color: "#a8a29e",
                }}
              />
              <input
                type="email"
                name="email"
                required
                value={formData.email}
                onChange={handleChange}
                placeholder="name@example.com"
                style={{
                  width: "100%",
                  paddingLeft: "38px",
                  paddingRight: "12px",
                  paddingTop: "10px",
                  paddingBottom: "10px",
                  fontSize: "14px",
                  backgroundColor: "#ffffff",
                  border: "1px solid #d6d3d1",
                  borderRadius: "12px",
                  outline: "none",
                  boxSizing: "border-box",
                }}
              />
            </div>
          </div>

          <div>
            <label
              style={{
                display: "block",
                fontSize: "12px",
                fontWeight: "600",
                color: "#57534e",
                marginBottom: "6px",
              }}
            >
              Password
            </label>
            <div style={{ position: "relative" }}>
              <Lock
                size={16}
                style={{
                  position: "absolute",
                  left: "12px",
                  top: "12px",
                  color: "#a8a29e",
                }}
              />
              <input
                type="password"
                name="password"
                required
                minLength={6}
                value={formData.password}
                onChange={handleChange}
                placeholder="••••••••"
                style={{
                  width: "100%",
                  paddingLeft: "38px",
                  paddingRight: "12px",
                  paddingTop: "10px",
                  paddingBottom: "10px",
                  fontSize: "14px",
                  backgroundColor: "#ffffff",
                  border: "1px solid #d6d3d1",
                  borderRadius: "12px",
                  outline: "none",
                  boxSizing: "border-box",
                }}
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={submitting}
            style={{
              width: "100%",
              padding: "12px",
              backgroundColor: "#C68B45",
              color: "#ffffff",
              fontWeight: "600",
              fontSize: "14px",
              borderRadius: "12px",
              border: "none",
              cursor: submitting ? "not-allowed" : "pointer",
              opacity: submitting ? 0.7 : 1,
              marginTop: "8px",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              gap: "8px",
              boxShadow: "0 2px 4px rgba(0,0,0,0.1)",
            }}
          >
            <LogIn size={16} />
            {submitting
              ? "Please wait..."
              : isLogin
                ? "Sign In"
                : "Create Account"}
          </button>
        </form>

        {/* Toggle Login / Register */}
        <div
          style={{
            marginTop: "20px",
            textAlign: "center",
            fontSize: "13px",
            color: "#57534e",
          }}
        >
          {isLogin ? "Don't have an account? " : "Already have an account? "}
          <button
            type="button"
            onClick={() => {
              setIsLogin(!isLogin);
              setErrorMsg("");
            }}
            style={{
              background: "none",
              border: "none",
              fontWeight: "bold",
              color: "#C68B45",
              cursor: "pointer",
              padding: 0,
              marginLeft: "4px",
            }}
          >
            {isLogin ? "Sign Up" : "Log In"}
          </button>
        </div>
      </div>
    </div>
  );
};

export default AuthPage;
