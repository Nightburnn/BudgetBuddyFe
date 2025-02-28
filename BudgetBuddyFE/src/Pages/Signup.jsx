import React, { useState, useEffect, useRef } from "react";
import "./Signup.css";
import "bootstrap/dist/css/bootstrap.min.css";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import axios from "axios";
import bb from "../assests/images/bb.png";
import { API_URL } from '../config/api';

const Signup = () => {
  // Initial form state
  const [step, setStep] = useState(1);
  const [selectedRole, setSelectedRole] = useState(null);
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [email, setEmail] = useState("");
  const [department, setDepartment] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  // OTP verification state
  const [otp, setOtp] = useState(['', '', '', '', '', '']);
  const [timer, setTimer] = useState(480);
  const [showResend, setShowResend] = useState(false);
  const [isVerifying, setIsVerifying] = useState(false);
  const [otpError, setOtpError] = useState(false);
  const otpRefs = useRef([]);

  const validateEmail = (email) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };

  const departments = [
    { id: 1, name: "Human Resources" },
    { id: 2, name: "Information Technology" },
    { id: 3, name: "Finance" },
    { id: 4, name: "Marketing" },
    { id: 5, name: "Operations" },
    { id: 6, name: "Sales" },
    { id: 7, name: "Research & Development" },
    { id: 8, name: "Customer Service" }
  ];

  const validatePassword = (password) => {
    const passwordRegex = /^(?=.*[A-Z])(?=.*[!@#$%^&*])(?=.{8,})/;
    return passwordRegex.test(password);
  };

  // OTP Timer effect
  useEffect(() => {
    let interval;
    if (step === 4 && timer > 0) {
      interval = setInterval(() => {
        setTimer((prev) => {
          if (prev <= 1) {
            setShowResend(true);
            clearInterval(interval);
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [step, timer]);

  const handleNext = () => {
    if (step === 1) {
      if (selectedRole === "admin") {
        setStep(3);
      } else if (selectedRole === "hod") {
        setStep(2);
      }
    } else if (step === 2 && isNextButtonEnabledStep2) {
      setStep(3);
    } else if (step === 3 && isFormValidStep3) {
      // Proceed directly to signup instead of requesting OTP first
      handleSignup();
    }
  };

  const handleBack = () => {
    if (selectedRole === "admin" && step === 3) {
      setStep(1);
    } else if (step > 1) {
      setStep(step - 1);
    }
  };

  const isNextButtonEnabledStep2 =
    firstName.trim() !== "" &&
    lastName.trim() !== "" &&
    email.trim() !== "" &&
    validateEmail(email);

  const isFormValidStep3 =
    selectedRole === "admin"
      ? email.trim() !== "" &&
      validateEmail(email) &&
      password.trim() !== "" &&
      confirmPassword.trim() !== "" &&
      password === confirmPassword &&
      validatePassword(password)
      : department !== "" &&
      password.trim() !== "" &&
      confirmPassword.trim() !== "" &&
      password === confirmPassword &&
      validatePassword(password);

  const handleRoleSelect = (role) => setSelectedRole(role);

  // Handle OTP input change
  const handleOtpChange = (index, value) => {
    if (value.length <= 1 && /^\d*$/.test(value)) {
      const newOtp = [...otp];
      newOtp[index] = value;
      setOtp(newOtp);
      setOtpError(false);

      if (value && index < 5) {
        otpRefs.current[index + 1].focus();
      }
    }
  };

  const handleVerifyOTP = async () => {
    try {
      setIsVerifying(true);
      const otpString = otp.join('');
      
      const requestData = {
        email,
        otp: otpString
      };
      
      // Log what we're sending
      console.log("Verifying OTP with data:", requestData);
      console.log("OTP type:", typeof otpString);
      console.log("Email type:", typeof email);
      
      // Use the verification endpoint
      const response = await axios.post(`${API_URL}/auth/verify-otp`, requestData);
      
      console.log("Verification response:", response.data);
  
      if (response.data.success) {
        toast.success("Registration successful!");
        setTimeout(() => {
          window.location.href = "/login";
        }, 3000);
      }
    } catch (error) {
      console.error("OTP verification error:", error);
      console.log("Error status:", error.response?.status);
      console.log("Error data:", error.response?.data);
      
      const errorMessage =
        error.response?.data?.message || "Invalid OTP. Please try again.";
      toast.error(errorMessage);
      setOtpError(true);
    } finally {
      setIsVerifying(false);
    }
  };
  

// Resend OTP
const handleResendOTP = async () => {
  try {
    // Since the same endpoint only accepts email and OTP, for resend we'll 
    // just send the email with an empty OTP string
    const response = await axios.post(`${API_URL}/auth/password/verify-otp`, {
      email,
      otp: "" // Empty OTP to indicate this is a resend request
    });

    if (response.data.success) {
      toast.success("New OTP sent successfully!");
      setOtp(['', '', '', '', '', '']);
      setTimer(480);
      setShowResend(false);
      setOtpError(false);
    }
  } catch (error) {
    const errorMessage =
      error.response?.data?.message || "Failed to resend OTP. Please try again.";
    toast.error(errorMessage);
  }
};
  // Initial signup process - registers user and triggers OTP generation
  const handleSignup = async () => {
    try {
      setIsLoading(true);
      console.log("Starting signup process...");
  
      // Use one of two signup endpoints based on role
      const endpoint = selectedRole === "admin"
        ? `${API_URL}/auth/signup/admin`
        : `${API_URL}/auth/signup/hod`;
  
      const userData = {
        email,
        password,
        ...(selectedRole === "hod" && {
          firstName,
          lastName,
          departmentId: parseInt(department, 10),
                }),
      };
  
      console.log("Sending request to:", endpoint);
      const response = await axios.post(endpoint, userData);
      console.log("Signup response:", response.data);
  
      // After successful signup, move to OTP verification regardless of response.data.success
      setStep(4);
      setTimer(480);
      setShowResend(false);
      toast.success("Registration initiated! Please verify your email with OTP.");
      
    } catch (error) {
      console.error("Error during signup:", error);
      console.log("Error response:", error.response?.data);
      
      const errorMessage =
        error.response?.data?.message || "Registration failed. Please try again.";
      toast.error(errorMessage);
    } finally {
      setIsLoading(false); // Always reset loading state
    }
  };

 

  const formatTime = (seconds) => {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    return `${String(minutes).padStart(2, '0')}:${String(remainingSeconds).padStart(2, '0')}`;
  };

  return (
    <div className="signup-container d-flex flex-column flex-lg-row">
      {/* Left Side with Image */}
      <div className="signup-image">
        <img src={bb} alt="Safe" className="img-fluid" />
      </div>

      {/* Right Side Form */}
      <div className="signup-form-container d-flex flex-column justify-content-center">
        <ToastContainer
          position="top-right"
          autoClose={5000}
          hideProgressBar={false}
          newestOnTop
          closeOnClick
          rtl={false}
          pauseOnFocusLoss
          draggable
          pauseOnHover
        />
        <div className="d-flex justify-content-center align-items-center mb-4">
          <div className="d-flex align-items-start gap-5">
            {step > 1 && (
              <button onClick={handleBack} className="back-button me-auto">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="20"
                  height="20"
                  viewBox="0 0 20 20"
                  fill="none"
                >
                  <path
                    d="M12.9422 15.8078C13.0003 15.8659 13.0463 15.9348 13.0777 16.0107C13.1092 16.0866 13.1254 16.1679 13.1254 16.25C13.1254 16.3321 13.1092 16.4134 13.0777 16.4893C13.0463 16.5652 13.0003 16.6341 12.9422 16.6922C12.8841 16.7503 12.8152 16.7963 12.7393 16.8277C12.6634 16.8592 12.5821 16.8753 12.5 16.8753C12.4179 16.8753 12.3366 16.8592 12.2607 16.8277C12.1848 16.7963 12.1159 16.7503 12.0578 16.6922L5.80782 10.4422C5.74971 10.3841 5.70361 10.3152 5.67215 10.2393C5.6407 10.1635 5.62451 10.0821 5.62451 10C5.62451 9.91786 5.6407 9.83653 5.67215 9.76066C5.70361 9.68478 5.74971 9.61585 5.80782 9.55781L12.0578 3.30781C12.1751 3.19053 12.3342 3.12465 12.5 3.12465C12.6659 3.12465 12.8249 3.19053 12.9422 3.30781C13.0595 3.42508 13.1254 3.58414 13.1254 3.75C13.1254 3.91585 13.0595 4.07491 12.9422 4.19218L7.1336 10L12.9422 15.8078Z"
                    fill="#723FEB"
                  />
                </svg>
              </button>
            )}
          </div>
          <h2 className="flex-grow-1 text-center mb-0">Welcome!</h2>
        </div>
        <p className="text-center right">Let's create your account</p>

        {step === 1 && (
          <div className="form-step">
            <p className="form-label reg mb-3">I am registering as</p>
            <div className="form-group">
              <div
                className={`option mb-3 ${selectedRole === "admin" ? "selected" : ""
                  }`}
                onClick={() => handleRoleSelect("admin")}
              >
                <span>Administrator</span>
                <input
                  type="radio"
                  name="role"
                  value="admin"
                  className="radio-input"
                  checked={selectedRole === "admin"}
                  readOnly
                />
                <svg
                  className="radio-svg"
                  xmlns="http://www.w3.org/2000/svg"
                  width="18"
                  height="19"
                  viewBox="0 0 18 19"
                  fill="none"
                >
                  <path
                    d="M9 2.1875C7.55373 2.1875 6.13993 2.61637 4.9374 3.41988C3.73486 4.22339 2.7976 5.36544 2.24413 6.70163C1.69067 8.03781 1.54586 9.50811 1.82801 10.9266C2.11017 12.3451 2.80661 13.648 3.82928 14.6707C4.85196 15.6934 6.15492 16.3898 7.57341 16.672C8.99189 16.9541 10.4622 16.8093 11.7984 16.2559C13.1346 15.7024 14.2766 14.7651 15.0801 13.5626C15.8836 12.3601 16.3125 10.9463 16.3125 9.5C16.3105 7.56123 15.5394 5.70246 14.1685 4.33154C12.7975 2.96063 10.9388 2.18955 9 2.1875ZM9 15.6875C7.77623 15.6875 6.57994 15.3246 5.56241 14.6447C4.54488 13.9648 3.75182 12.9985 3.2835 11.8679C2.81518 10.7372 2.69265 9.49314 2.93139 8.29288C3.17014 7.09262 3.75944 5.99011 4.62478 5.12478C5.49012 4.25944 6.59262 3.67014 7.79288 3.43139C8.99314 3.19264 10.2372 3.31518 11.3679 3.7835C12.4985 4.25181 13.4648 5.04488 14.1447 6.06241C14.8246 7.07994 15.1875 8.27623 15.1875 9.5C15.1856 11.1405 14.5331 12.7132 13.3732 13.8732C12.2132 15.0331 10.6405 15.6856 9 15.6875ZM9 5C8.10999 5 7.23996 5.26392 6.49994 5.75839C5.75992 6.25285 5.18314 6.95566 4.84255 7.77792C4.50195 8.60019 4.41284 9.50499 4.58647 10.3779C4.7601 11.2508 5.18869 12.0526 5.81802 12.682C6.44736 13.3113 7.24918 13.7399 8.1221 13.9135C8.99501 14.0872 9.89981 13.9981 10.7221 13.6575C11.5443 13.3169 12.2471 12.7401 12.7416 12.0001C13.2361 11.26 13.5 10.39 13.5 9.5C13.4987 8.30693 13.0242 7.16309 12.1805 6.31946C11.3369 5.47583 10.1931 5.0013 9 5ZM9 12.875C8.33249 12.875 7.67997 12.6771 7.12495 12.3062C6.56994 11.9354 6.13736 11.4083 5.88191 10.7916C5.62646 10.1749 5.55963 9.49626 5.68985 8.84157C5.82008 8.18688 6.14152 7.58552 6.61352 7.11351C7.08552 6.64151 7.68689 6.32008 8.34157 6.18985C8.99626 6.05962 9.67486 6.12646 10.2916 6.38191C10.9083 6.63735 11.4354 7.06993 11.8062 7.62495C12.1771 8.17997 12.375 8.83249 12.375 9.5C12.3741 10.3948 12.0182 11.2527 11.3855 11.8855C10.7527 12.5182 9.89482 12.8741 9 12.875Z"
                    fill="#C6C6C6"
                  />
                </svg>
              </div>

              <div
                className={`option ${selectedRole === "hod" ? "selected" : ""}`}
                onClick={() => handleRoleSelect("hod")}
              >
                <span>HOD/ User</span>
                <input
                  type="radio"
                  name="role"
                  value="hod"
                  className="radio-input"
                  checked={selectedRole === "hod"}
                  readOnly
                />
                <svg
                  className="radio-svg"
                  xmlns="http://www.w3.org/2000/svg"
                  width="18"
                  height="19"
                  viewBox="0 0 18 19"
                  fill="none"
                >
                  <path
                    d="M9 2.1875C7.55373 2.1875 6.13993 2.61637 4.9374 3.41988C3.73486 4.22339 2.7976 5.36544 2.24413 6.70163C1.69067 8.03781 1.54586 9.50811 1.82801 10.9266C2.11017 12.3451 2.80661 13.648 3.82928 14.6707C4.85196 15.6934 6.15492 16.3898 7.57341 16.672C8.99189 16.9541 10.4622 16.8093 11.7984 16.2559C13.1346 15.7024 14.2766 14.7651 15.0801 13.5626C15.8836 12.3601 16.3125 10.9463 16.3125 9.5C16.3105 7.56123 15.5394 5.70246 14.1685 4.33154C12.7975 2.96063 10.9388 2.18955 9 2.1875ZM9 15.6875C7.77623 15.6875 6.57994 15.3246 5.56241 14.6447C4.54488 13.9648 3.75182 12.9985 3.2835 11.8679C2.81518 10.7372 2.69265 9.49314 2.93139 8.29288C3.17014 7.09262 3.75944 5.99011 4.62478 5.12478C5.49012 4.25944 6.59262 3.67014 7.79288 3.43139C8.99314 3.19264 10.2372 3.31518 11.3679 3.7835C12.4985 4.25181 13.4648 5.04488 14.1447 6.06241C14.8246 7.07994 15.1875 8.27623 15.1875 9.5C15.1856 11.1405 14.5331 12.7132 13.3732 13.8732C12.2132 15.0331 10.6405 15.6856 9 15.6875ZM9 5C8.10999 5 7.23996 5.26392 6.49994 5.75839C5.75992 6.25285 5.18314 6.95566 4.84255 7.77792C4.50195 8.60019 4.41284 9.50499 4.58647 10.3779C4.7601 11.2508 5.18869 12.0526 5.81802 12.682C6.44736 13.3113 7.24918 13.7399 8.1221 13.9135C8.99501 14.0872 9.89981 13.9981 10.7221 13.6575C11.5443 13.3169 12.2471 12.7401 12.7416 12.0001C13.2361 11.26 13.5 10.39 13.5 9.5C13.4987 8.30693 13.0242 7.16309 12.1805 6.31946C11.3369 5.47583 10.1931 5.0013 9 5ZM9 12.875C8.33249 12.875 7.67997 12.6771 7.12495 12.3062C6.56994 11.9354 6.13736 11.4083 5.88191 10.7916C5.62646 10.1749 5.55963 9.49626 5.68985 8.84157C5.82008 8.18688 6.14152 7.58552 6.61352 7.11351C7.08552 6.64151 7.68689 6.32008 8.34157 6.18985C8.99626 6.05962 9.67486 6.12646 10.2916 6.38191C10.9083 6.63735 11.4354 7.06993 11.8062 7.62495C12.1771 8.17997 12.375 8.83249 12.375 9.5C12.3741 10.3948 12.0182 11.2527 11.3855 11.8855C10.7527 12.5182 9.89482 12.8741 9 12.875Z"
                    fill="#C6C6C6"
                  />
                </svg>
              </div>
            </div>
            <button
              className={`btn btn-primary btn-block mt-4 ${selectedRole ? "active" : ""
                }`}
              onClick={handleNext}
              disabled={!selectedRole}
            >
              Next
            </button>
          </div>
        )}

        {step === 2 && (
          <div className="form-step second">
            <div className="form-group mb-3">
              <label>First Name</label>
              <input
                type="text"
                className="form-control"
                value={firstName}
                onChange={(e) => setFirstName(e.target.value)}
              />
            </div>
            <div className="form-group mb-3">
              <label>Last Name</label>
              <input
                type="text"
                className="form-control"
                value={lastName}
                onChange={(e) => setLastName(e.target.value)}
              />
            </div>
            <div className="form-group">
              <label>Email Address</label>
              <input
                type="email"
                className="form-control"
                placeholder="Enter your email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </div>
            <button
              className={`btn btn-primary btn-block mt-4 ${isNextButtonEnabledStep2 ? "active" : ""
                }`}
              onClick={handleNext}
              disabled={!isNextButtonEnabledStep2}
            >
              Next
            </button>
          </div>
        )}

        {step === 3 && (
          <div className="form-step second">
            {selectedRole === "hod" && (
              <div className="form-group mb-3">
                <label>Department</label>
                <select
                  className="form-control"
                  value={department}
                  onChange={(e) => setDepartment(e.target.value)}
                >
                 
                   <option value="">Select Department</option>
                   {departments.map((dept) => (
                     <option key={dept.id} value={dept.id}>
                       {dept.name}
                     </option>
                  ))}
                </select>
              </div>
            )}

            {selectedRole === "admin" && (
              <div className="form-group mb-3">
                <label>Email Address</label>
                <input
                  type="email"
                  className="form-control"
                  placeholder="Enter your email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                />
              </div>
            )}

            <div className="form-group mt-3 password-field position-relative">
              <label>Create Password</label>
              <input
                type={showPassword ? "text" : "password"}
                className="form-control"
                id="password"
                placeholder="Enter your password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
              <i
                className={`bi ${showPassword ? "bi-eye-slash" : "bi-eye"
                  } toggle-password`}
                onClick={() => setShowPassword(!showPassword)}
              ></i>{" "}
            </div>
            <div className="form-group password-field position-relative mt-3">
              <label>Confirm Password</label>
              <input
                type={showConfirmPassword ? "text" : "password"}
                className="form-control"
                id="confirm-password"
                placeholder="Confirm your password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
              />
              <i
                className={`bi ${showConfirmPassword ? "bi-eye-slash" : "bi-eye"
                  } toggle-password`}
                onClick={() => setShowConfirmPassword(!showConfirmPassword)}
              ></i>
            </div>
            <p className="text-muted mt-2">
              Minimum of 8 characters, starting with a capital letter and
              containing a special character (e.g., @, #, $, !).
            </p>

            <button
              className={`btn btn-primary btn-block mt-3 ${isFormValidStep3 ? "active" : ""
                }`}
              disabled={!isFormValidStep3 || isLoading}
              onClick={handleNext}
            >
              {isLoading ? <span>Signing Up...</span> : "Sign Up"}
            </button>
          </div>
        )}

        {step === 4 && (
          <div className="form-step forgotpass">
            <p className="text-center right mb-4 main-highlight">
              Enter the 6-digit OTP sent to <span className="highlight-email">{email}</span>
            </p>
            <div className="d-flex justify-content-between mb-1">
              {otp.map((digit, index) => (
                <input
                  key={index}
                  ref={(el) => (otpRefs.current[index] = el)}
                  type="text"
                  className={`form-control otp-input ${otpError ? 'invalid' : ''}`}
                  value={digit}
                  onChange={(e) => handleOtpChange(index, e.target.value)}
                  placeholder="-"
                  maxLength={1}
                />
              ))}
            </div>
            {otpError && (
              <p className="text-danger mb-3">Incorrect code</p>
            )}
            <p className="text-center mb-3 mt-2">
              {showResend ? (
                <span className="main-highlight">OTP expired. <span className="text-primary cursor-pointer" onClick={handleResendOTP}>Resend</span></span>
              ) : (
                <span className="main-highlight">
                  OTP valid for: <span className="highlight-timer">{formatTime(timer)}</span>
                </span>
              )}
            </p>
            <button
              className={`btn btn-primary btn-block ${otp.every(digit => digit !== '') ? 'active' : ''}`}
              onClick={handleVerifyOTP}
              disabled={!otp.every(digit => digit !== '') || isVerifying}
            >
              {isVerifying ? <span>Verifying...</span> : "Verify"}
            </button>
          </div>
        )}

        {isVerifying && (
          <div className="modal-overlay">
            <div className="modal-content-dark">
              <p className="modal-text m-0">Verifying OTP...</p>
            </div>
          </div>
        )}

        <p className="auth-footer mt-3">
          Have an account? <a href="/login">Sign In</a>
        </p>
      </div>
    </div>
  );
};

export default Signup;