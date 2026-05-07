import React, { useState } from "react";
import "../styles/pages/registerpage.css";
import { FcGoogle } from "react-icons/fc";
import { FaApple } from "react-icons/fa";
import Logo from "../components/Logo";
import PasswordInput from "../components/PasswordInput";
import Cookies from "js-cookie";
import { useNavigate } from "react-router-dom";
import RoutePaths from "../routes/routePaths";

function RegisterPage() {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
  });

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log("Form submitted:", formData);
    // Later, we'll add API call here
    Cookies.set("accessToken", "static-token-123");
    navigate(RoutePaths.DASHBOARD);
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
              />
              <label htmlFor="terms" className="checkbox-text">
                I agree to the{" "}
                <a href="/terms" className="terms-link">
                  Terms and Conditions
                </a>
              </label>
            </div>

            <button type="submit" className="btn-primary">
              Register
            </button>
          </form>

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

export default RegisterPage;
