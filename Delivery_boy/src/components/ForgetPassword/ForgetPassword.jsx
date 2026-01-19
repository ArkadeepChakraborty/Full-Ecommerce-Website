// ForgetPassword.jsx
import React, { useState } from 'react';
import './ForgetPassword.css';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const ForgetPassword = ({ setShowForget }) => {
    const [step, setStep] = useState(1);
    const [email, setEmail] = useState('');
    const [otp, setOtp] = useState('');
    const [newPassword, setNewPassword] = useState('');

    const sendOtpHandler = async () => {
        try {
            const response = await fetch("http://localhost:8000/api/v1/deliveryBoy/forgetpassword/send-otp", {
                method: "POST",
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ email })
            });
            const result = await response.json();
            if (result.success) {
                toast.success("OTP sent successfully");
                setStep(2);
            } else {
                toast.error(result.message);
            }
        } catch (err) {
            toast.error("Failed to send OTP");
        }
    };

    const verifyOtpHandler = async () => {
        try {
            const response = await fetch("http://localhost:8000/api/v1/deliveryBoy/forgetpassword/verify-otp", {
                method: "POST",
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ email, otp })
            });
            const result = await response.json();
            if (result.success) {
                toast.success("OTP verified");
                setStep(3);
            } else {
                toast.error(result.message);
            }
        } catch (err) {
            toast.error("Failed to verify OTP");
        }
    };

    const resetPasswordHandler = async () => {
        try {
            const response = await fetch("http://localhost:8000/api/v1/deliveryBoy/forgetpassword/reset", {
                method: "POST",
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ email, newPassword })
            });
            const result = await response.json();
            if (result.success) {
                toast.success("Password reset successful");
                // setShowForget(false);
                setTimeout(() => {
                    setShowForget(false);
                }, 1500); // 1.5 seconds
            } else {
                toast.error(result.message);
            }
        } catch (err) {
            toast.error("Failed to reset password");
        }
    };

    return (
        <div className="forget-password">
            <ToastContainer />
            <div className="forget-password-box">
                <h2>Forget Password</h2>
                {step === 1 && (
                    <>
                        <input type="email" placeholder="Enter your email" value={email} onChange={(e) => setEmail(e.target.value)} required />
                        <button onClick={sendOtpHandler}>Send OTP</button>
                    </>
                )}
                {step === 2 && (
                    <>
                        <input type="text" placeholder="Enter OTP" value={otp} onChange={(e) => setOtp(e.target.value)} required />
                        <button onClick={verifyOtpHandler}>Verify OTP</button>
                    </>
                )}
                {step === 3 && (
                    <>
                        <input type="password" placeholder="Enter New Password" value={newPassword} onChange={(e) => setNewPassword(e.target.value)} required />
                        <button onClick={resetPasswordHandler}>Reset Password</button>
                    </>
                )}
            </div>
        </div>
    );
};

export default ForgetPassword;
