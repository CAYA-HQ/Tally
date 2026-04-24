import React, { useState } from "react";
import "../styles/pages/loginpage.css";
import { AiOutlineEye, AiOutlineEyeInvisible } from "react-icons/ai";
import { FcGoogle } from "react-icons/fc";
import { FaApple } from "react-icons/fa";
import Logo from "../components/Logo";

function LoginPage() {
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });

  const [showPassword, setShowPassword] = useState(false);

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
  };

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  return (
    <div className="login-page">
      {/* LEFT SIDE - Dark blue section */}
      <div className="login-left">
        <Logo />
        <div className="welcome-text">
          <h1>Hey Micheal !</h1>
          <p>
            Lorem Ipsum dolor sit amet, consectetur adipiscing elit. Aliquam
            quis set facilibus, posuere nulla vel, ornare erat. Vivamus
            pellentesque, massa eget tincidunt ornare, ipsum velit tincidunt
            tortor, a eleifend ante mi non metus. Curabitur at est euismod,
            congue quam in, suscipit enim. Pellentesque accumsan tincidunt nisl
            vestibulum laoreet. Phasellus nec sapien et mauris ornare eleifend.
            Integer massudda vitae lectus nec verius. Integer mollis non quam
            vitae fringilla.
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

            <div className="form-group">
              <div className="password-input-wrapper">
                <input
                  type={showPassword ? "text" : "password"}
                  id="password"
                  name="password"
                  value={formData.password}
                  onChange={handleInputChange}
                  placeholder="Enter your Password"
                  required
                />
                <button
                  type="button"
                  className="password-toggle"
                  onClick={togglePasswordVisibility}
                  aria-label="Toggle password visibility"
                >
                  {showPassword ? (
                    <AiOutlineEyeInvisible size={20} />
                  ) : (
                    <AiOutlineEye size={20} />
                  )}
                </button>
              </div>
            </div>

            <div className="forgot-password">
              <a href="/forgot-password">Forgotten Password</a>
            </div>

            <button type="submit" className="login-btn">
              Log in
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
