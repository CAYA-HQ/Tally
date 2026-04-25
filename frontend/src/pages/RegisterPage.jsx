import React, { useState } from "react";
import "../styles/pages/registerpage.css";
import { AiOutlineEye, AiOutlineEyeInvisible } from "react-icons/ai";
import { FcGoogle } from "react-icons/fc";
import { FaApple } from "react-icons/fa";
import Logo from "../components/Logo";
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
    Cookies.set("accessToken", "static-token-123");
    navigate(RoutePaths.DASHBOARD);
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
          <h2>Create Account</h2>
          <p className="subtitle">Already have an account ? <a href="/login">Login here</a></p>

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

    <div className="checkbox-container">
    <input type="checkbox" name="terms" id="terms" className="checkbox-input" />
    <p className="checkbox-text">
        I agree to the <a href="/terms" className="terms-link">Terms and Conditions</a>
    </p>
</div>

            <button type="submit" className="login-btn">
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
