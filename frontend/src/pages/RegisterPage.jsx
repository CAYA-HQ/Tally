import React, { useState } from "react";
import "../styles/pages/registerpage.css";
import { FcGoogle } from "react-icons/fc";
import { FaApple } from "react-icons/fa";
import Logo from "../components/Logo";
import PasswordInput from "../components/PasswordInput";
import { useNavigate } from "react-router-dom";
import RoutePaths from "../routes/routePaths";
import api from "../session/api";
import { toast } from "react-toastify";

function RegisterPage() {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
  });
  const [isLoading, setIsLoading] = useState(false);
  const authBaseURL =
    import.meta.env.VITE_BASE_URL || "http://localhost:3000/api";

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    try {
      const { data } = await api.post("/auth/register", formData);
      toast.success("Account created. Please verify your email.");
      navigate(RoutePaths.VERIFY, { state: { email: data.email } });
    } catch (err) {
      toast.error(
        err.response?.data?.message || "Something went wrong. Please try again."
      );
    } finally {
      setIsLoading(false);
    }
  };

  const handleGoogleLogin = () => {
    window.location.href = `${authBaseURL}/auth/google`;
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
          <h2>Create Account</h2>
          <p className="subtitle">
            Already have an account ? <a href="/login">Login here</a>
          </p>

          <form onSubmit={handleSubmit}>
            <div className="form-group">
              <input
                type="text"
                id="name"
                name="name"
                value={formData.name}
                onChange={handleInputChange}
                placeholder="Full Name"
                required
              />
            </div>

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

            <div className="checkbox-container">
              <input
                type="checkbox"
                name="terms"
                id="terms"
                className="checkbox-input"
                required
              />
              <label htmlFor="terms" className="checkbox-text">
                I agree to the{" "}
                <a href="/terms" className="terms-link">
                  Terms and Conditions
                </a>
              </label>
            </div>

            <button type="submit" className="btn-primary" disabled={isLoading}>
              {isLoading ? "Creating account..." : "Register"}
            </button>
          </form>

          <div className="divider">
            <span>Or sign in with</span>
          </div>

          <div className="social-login">
            <button
              type="button"
              className="social-btn google-btn"
              onClick={handleGoogleLogin}
            >
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

export default RegisterPage;
