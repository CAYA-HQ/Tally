import React, { useState } from "react";
import "../styles/pages/loginpage.css";
import { FcGoogle } from "react-icons/fc";
import { FaApple } from "react-icons/fa";
import Logo from "../components/Logo";
import PasswordInput from "../components/PasswordInput";
import { useNavigate } from "react-router-dom";
import RoutePaths from "../routes/routePaths";
import api from "../session/api";
import { setAccessToken } from "../session/token";
import { toast } from "react-toastify";

function LoginPage() {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({ email: "", password: "" });
  const [isLoading, setIsLoading] = useState(false);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    try {
      const { data } = await api.post("/auth/login", formData);
      setAccessToken(data.accessToken, data.user);
      navigate(RoutePaths.DASHBOARD);
    } catch (err) {
      toast.error(err.response?.data?.message || "Something went wrong. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="login-page">
      {/* LEFT SIDE - Dark blue section */}
      <div className="login-left">
        <Logo />
        <div className="welcome-text">
          <h1>
            Manage your business <br /> the simple way
          </h1>
          <p>
            Keep track of your stock, tasks, and daily <br /> activities without
            stress or confusion.
          </p>
        </div>
      </div>

      {/* RIGHT SIDE - White section with form */}
      <div className="login-right">
        <div className="login-form-container">
          <h2>Welcome back</h2>
          <p className="subtitle">Please enter your details below</p>

          <form onSubmit={handleSubmit}>
            <div className="form-group">
              <input
                type="email"
                id="email"
                name="email"
                value={formData.email}
                onChange={handleInputChange}
                placeholder="Email"
                required
              />
            </div>

            <PasswordInput
              id="password"
              name="password"
              value={formData.password}
              onChange={handleInputChange}
              placeholder="Enter your Password"
              required
            />

            <div className="forgot-password">
              <a href="/forgot-password">Forgotten Password</a>
            </div>

            <button type="submit" className="btn-primary" disabled={isLoading}>
              {isLoading ? "Logging in..." : "Log in"}
            </button>
          </form>

          <p className="signup-text">
            Dont have an account? <a href="/register">Register here</a>
          </p>

          <div className="divider">
            <span>Or sign in with</span>
          </div>

          <div className="social-login">
            <button type="button" className="social-btn google-btn">
              <FcGoogle size={20} />
              Google
            </button>
            <button type="button" className="social-btn apple-btn">
              <FaApple size={20} />
              Apple
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default LoginPage;
