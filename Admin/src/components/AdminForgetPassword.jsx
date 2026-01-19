import { useState } from "react";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const AdminForgetPassword = ({ setShowForget }) => {
  const [step, setStep] = useState(1);
  const [email, setEmail] = useState("");
  const [otp, setOtp] = useState("");
  const [newPassword, setNewPassword] = useState("");

  const BASE_URL = "http://localhost:8000/api/v1/adminRoute";
  const sendOtpHandler = async () => {
    try {
      const response = await fetch(`${BASE_URL}/send-otp`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email }),
      });

      const result = await response.json();

      if (result.success) {
        toast.success("OTP sent to your email");
        setStep(2);
      } else {
        toast.error(result.message);
      }
    } catch {
      toast.error("Failed to send OTP");
    }
  };

  const verifyOtpHandler = async () => {
    try {
      const response = await fetch(`${BASE_URL}/verify-otp`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, otp }),
      });

      const result = await response.json();

      if (result.success) {
        toast.success("OTP verified");
        setStep(3);
      } else {
        toast.error(result.message);
      }
    } catch {
      toast.error("OTP verification failed");
    }
  };

  const resetPasswordHandler = async () => {
    try {
      const response = await fetch(`${BASE_URL}/reset-password`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, newPassword }),
      });

      const result = await response.json();

      if (result.success) {
        toast.success("Password reset successfully");
        // setShowForget(false);
        setTimeout(() => {
          setShowForget(false);
        }, 1500); // 1.5 seconds
      } else {
        toast.error(result.message);
      }
    } catch {
      toast.error("Failed to reset password");
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100">
      <ToastContainer />

      <div className="w-full max-w-md p-6 bg-white rounded-lg shadow-md">
        <h2 className="text-xl font-bold text-center mb-4">
          Admin Forget Password
        </h2>

        {step === 1 && (
          <>
            <input
              type="email"
              placeholder="Enter Admin Email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full px-4 py-2 mb-3 border rounded-md"
            />
            <button
              onClick={sendOtpHandler}
              className="w-full py-2 bg-blue-600 text-white rounded-md"
            >
              Send OTP
            </button>
          </>
        )}

        {step === 2 && (
          <>
            <input
              type="text"
              placeholder="Enter OTP"
              value={otp}
              onChange={(e) => setOtp(e.target.value)}
              className="w-full px-4 py-2 mb-3 border rounded-md"
            />
            <button
              onClick={verifyOtpHandler}
              className="w-full py-2 bg-green-600 text-white rounded-md"
            >
              Verify OTP
            </button>
          </>
        )}

        {step === 3 && (
          <>
            <input
              type="password"
              placeholder="Enter New Password"
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
              className="w-full px-4 py-2 mb-3 border rounded-md"
            />
            <button
              onClick={resetPasswordHandler}
              className="w-full py-2 bg-purple-600 text-white rounded-md"
            >
              Reset Password
            </button>
          </>
        )}

        <p
          className="text-center text-sm text-blue-600 mt-4 cursor-pointer"
          onClick={() => setShowForget(false)}
        >
          ← Back to Login
        </p>
      </div>
    </div>
  );
};

export default AdminForgetPassword;
