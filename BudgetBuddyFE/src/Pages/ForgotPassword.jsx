import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import axios from 'axios';
import bb from "../assests/images/bb.png";
import "./Signup.css";
import { API_URL } from '../config/api';

const ForgotPassword = () => {
  const navigate = useNavigate();
  const [step, setStep] = useState(1);
  const [email, setEmail] = useState('');
  const [otp, setOtp] = useState(['', '', '', '', '', '']);
  const [timer, setTimer] = useState(600); 
  const [showResend, setShowResend] = useState(false);
  const [isVerifying, setIsVerifying] = useState(false);
  const [otpError, setOtpError] = useState(false);
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const otpRefs = useRef([]);

  const validateEmail = (email) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };

  const validatePassword = (password) => {
    const passwordRegex = /^(?=.*[A-Z])(?=.*[!@#$%^&*])(?=.{8,})/;
    return passwordRegex.test(password);
  };

  useEffect(() => {
    let interval;
    if (step === 2 && timer > 0) {
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

  const handleSendEmail = async () => {
    try {
      const response = await axios.post(`${API_URL}/auth/forgot-password`, { email });
      if (response.data.success) {
        toast.success('OTP sent to your email!');
        setStep(2);
        setTimer(600); 
        setShowResend(false);
      }
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to send OTP. Please try again.');
    }
  };

  // We'll verify the OTP along with the password reset
  const handleMoveToPasswordReset = () => {
    if (otp.some(digit => digit === '')) {
      toast.error('Please enter the complete OTP');
      return;
    }
    setStep(3);
  };

  const handleResetPassword = async () => {
    if (password !== confirmPassword) {
      toast.error('Passwords do not match!');
      return;
    }

    // Check if OTP has expired
    if (timer === 0) {
      toast.error('OTP has expired. Please request a new one.');
      setStep(2);
      return;
    }

    setIsVerifying(true);
    try {
      const response = await axios.post(`${API_URL}/auth/reset-password`, {
        email,
        password,
        otp: otp.join('')
      });

      if (response.data.success) {
        toast.success('Password reset successfully!');
        setTimeout(() => {
          navigate('/login');
        }, 2000);
      }
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to reset password. Please try again.');
      // If the error is related to OTP, go back to OTP screen
      if (error.response?.data?.message?.toLowerCase().includes('otp')) {
        setStep(2);
        setOtpError(true);
      }
    } finally {
      setIsVerifying(false);
    }
  };

  const handleResend = async () => {
    try {
      // Reuse the forgot-password endpoint to resend the OTP
      const response = await axios.post(`${API_URL}/auth/forgot-password`, { email });
      if (response.data.success) {
        toast.success('New OTP sent successfully!');
        setOtp(['', '', '', '', '', '']);
        setTimer(600); 
        setShowResend(false);
        setOtpError(false);
      }
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to resend OTP. Please try again.');
    }
  };

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

  const formatTime = (seconds) => {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    return `${String(minutes).padStart(2, '0')}:${String(remainingSeconds).padStart(2, '0')}`;
  };

  return (
    <div className="signup-container d-flex flex-column flex-lg-row">
      <ToastContainer position="top-right" autoClose={3000} />
      
      <div className="signup-image">
        <img src={bb} alt="Safe" className="img-fluid" />
      </div>

      <div className="signup-form-container d-flex flex-column justify-content-center">
        <div className="d-flex justify-content-center align-items-center mb-4">
          <div className="d-flex align-items-start gap-5">
            <button 
              onClick={() => navigate('/login')}
              className="back-button me-auto"
            >
              <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 20 20" fill="none">
                <path d="M12.9422 15.8078C13.0003 15.8659 13.0463 15.9348 13.0777 16.0107C13.1092 16.0866 13.1254 16.1679 13.1254 16.25C13.1254 16.3321 13.1092 16.4134 13.0777 16.4893C13.0463 16.5652 13.0003 16.6341 12.9422 16.6922C12.8841 16.7503 12.8152 16.7963 12.7393 16.8277C12.6634 16.8592 12.5821 16.8753 12.5 16.8753C12.4179 16.8753 12.3366 16.8592 12.2607 16.8277C12.1848 16.7963 12.1159 16.7503 12.0578 16.6922L5.80782 10.4422C5.74971 10.3841 5.70361 10.3152 5.67215 10.2393C5.6407 10.1635 5.62451 10.0821 5.62451 10C5.62451 9.91786 5.6407 9.83653 5.67215 9.76066C5.70361 9.68478 5.74971 9.61585 5.80782 9.55781L12.0578 3.30781C12.1751 3.19053 12.3342 3.12465 12.5 3.12465C12.6659 3.12465 12.8249 3.19053 12.9422 3.30781C13.0595 3.42508 13.1254 3.58414 13.1254 3.75C13.1254 3.91585 13.0595 4.07491 12.9422 4.19218L7.1336 10L12.9422 15.8078Z" fill="#723FEB"/>
              </svg>
            </button>
          </div>
          <h2 className="flex-grow-1 text-center mb-0">Forgot Password</h2>
        </div>

        {step === 1 && (
          <div className="form-step second forgotpass">
            <p className="text-center right mb-4">Enter your email address</p>
            <div className="form-group">
              <input
                type="email"
                className="form-control"
                placeholder="Enter your email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
            </div>
            <button
              className={`btn btn-primary btn-block mt-4 ${validateEmail(email) ? 'active' : ''}`}
              onClick={handleSendEmail}
              disabled={!validateEmail(email)}
            >
              Next
            </button>
          </div>
        )}

        {step === 2 && (
          <div className="form-step forgotpass">
            <p className="text-center right mb-4 main-highlight">Enter the 6-digit OTP sent to <span className="highlight-email">{email}</span></p>
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
                <span className="main-highlight">OTP expired. <span className="text-primary cursor-pointer" onClick={handleResend}>Resend OTP</span></span>
              ) : (
                <span className="main-highlight">
                  OTP valid for: <span className="highlight-timer">{formatTime(timer)}</span>
                </span>
              )}
            </p>
            <button
              className={`btn btn-primary btn-block ${otp.every(digit => digit !== '') && timer > 0 ? 'active' : ''}`}
              onClick={handleMoveToPasswordReset}
              disabled={!otp.every(digit => digit !== '') || timer === 0}
            >
              Next
            </button>
          </div>
        )}

        {step === 3 && (
          <div className="form-step second forgotpass">
            <p className="text-center right mb-4">Set New Password</p>
            <div className="form-group password-field position-relative">
              <label>Create Password</label>
              <input
                type={showPassword ? "text" : "password"}
                className="form-control mb-3"
                placeholder="Enter new password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
              <i
                className={`bi ${showPassword ? "bi-eye-slash" : "bi-eye"} toggle-password`}
                onClick={() => setShowPassword(!showPassword)}
              />
            </div>
            <div className="form-group password-field position-relative">
              <label>Confirm Password</label>
              <input
                type={showConfirmPassword ? "text" : "password"}
                className="form-control"
                placeholder="Confirm new password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
              />
              <i
                className={`bi ${showConfirmPassword ? "bi-eye-slash" : "bi-eye"} toggle-password`}
                onClick={() => setShowConfirmPassword(!showConfirmPassword)}
              />
            </div>
            <p className="text-muted mt-2">
              Minimum of 8 characters, starting with a capital letter and
              containing a special character (e.g., @, #, $, !).
            </p>
            <button
              className={`btn btn-primary btn-block mt-4 ${validatePassword(password) && password === confirmPassword ? 'active' : ''}`}
              onClick={handleResetPassword}
              disabled={!validatePassword(password) || password !== confirmPassword}
            >
              Reset Password
            </button>
          </div>
        )}

        {isVerifying && (
          <div className="modal-overlay">
            <div className="modal-content-dark">
              <p className="modal-text m-0">Verifying...</p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default ForgotPassword;