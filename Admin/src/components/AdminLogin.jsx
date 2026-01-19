// import { useEffect, useState } from "react";
// import { IoEyeSharp, IoEyeOffSharp } from "react-icons/io5";
// import { useNavigate } from "react-router-dom";
// import { useAdminAuth } from "../Context/AdminAuthContext";

// const AdminLogin = () => {
//   const navigate = useNavigate();
//   const { setAdmin, fetchAdmin } = useAdminAuth();

//   const [email, setEmail] = useState("");
//   const [password, setPassword] = useState("");
//   const [showPassword, setShowPassword] = useState(false);
//   const [error, setError] = useState("");

//   const handlelogin = async () => {
//     try {
//       const response = await fetch(
//         "http://localhost:8000/api/v1/adminRoute/admin/login",
//         {
//           method: "POST",
//           headers: { "Content-Type": "application/json" },
//           credentials: "include",
//           body: JSON.stringify({ email, password }),
//         }
//       );

//       const data = await response.json();

//       if (response.ok && data.success) {
//         setAdmin(data.admin); // store admin in context
//         await fetchAdmin();   // refresh admin session
//         alert("Admin Login Successfully");
//         navigate("/admin", { replace: true });
//       } else {
//         setError(data.message || "Admin Login Failed");
//       }
//     } catch (err) {
//       console.error("Login Error:", err);
//       setError("Something went wrong. Please try again.");
//     }
//   };

//   return (
//     <div className="flex items-center justify-center min-h-screen bg-cover bg-center bg-no-repeat"
//       style={{
//         backgroundImage:
//           "url('https://img.freepik.com/free-photo/top-view-frame-with-food-copy-space_23-2148247893.jpg?semt=ais_hybrid&w=740')",
//       }}
//     >
//       <div className="w-full max-w-md p-8 space-y-6 shadow-xl rounded-lg"
//         style={{ backgroundColor: "rgb(255 166 6)" }}
//       >
//         <h2 className="text-2xl font-bold text-center text-gray-900">
//           Welcome to Admin Login
//         </h2>

//         {error && <p className="text-red-500 text-sm text-center">{error}</p>}

//         <div>
//           <label className="block text-sm font-medium text-gray-900">
//             Email
//           </label>
//           <input
//             type="email"
//             value={email}
//             onChange={(e) => setEmail(e.target.value)}
//             required
//             className="w-full px-4 py-2 mt-1 border rounded-md"
//             placeholder="admin@example.com"
//           />
//         </div>

//         <div className="relative">
//           <label className="block text-sm font-medium text-gray-900">
//             Password
//           </label>
//           <div className="relative">
//             <input
//               type={showPassword ? "text" : "password"}
//               value={password}
//               onChange={(e) => setPassword(e.target.value)}
//               required
//               className="w-full px-4 py-2 mt-1 border rounded-md"
//               placeholder="••••••••"
//             />
//             <button
//               type="button"
//               onClick={() => setShowPassword(!showPassword)}
//               className="absolute inset-y-0 right-0 flex items-center px-3"
//               style={{ top: "50%", transform: "translateY(-50%)" }}
//             >
//               {showPassword ? <IoEyeSharp /> : <IoEyeOffSharp />}
//             </button>
//           </div>
//         </div>

//         <button
//           onClick={handlelogin}
//           className="w-full px-4 py-2 text-white bg-blue-600 rounded-md"
//         >
//           Login
//         </button>

//         <p className="text-center text-sm mt-4 text-gray-900">
//           Forgot Password?{" "}
//           <a className="text-blue-500 hover:underline" href="#">
//             Reset here
//           </a>
//         </p>
//       </div>
//     </div>
//   );
// };

// export default AdminLogin;

import { useState } from "react";
import { IoEyeSharp, IoEyeOffSharp } from "react-icons/io5";
import { useNavigate } from "react-router-dom";
import { useAdminAuth } from "../Context/AdminAuthContext";
import ForgetPassword from "./AdminForgetPassword";

const AdminLogin = () => {
  const navigate = useNavigate();
  const { setAdmin, fetchAdmin } = useAdminAuth();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");
  const [showForget, setShowForget] = useState(false);

  // 👉 Show Forget Password Page
  if (showForget) {
    return <ForgetPassword setShowForget={setShowForget} />;
  }

  const handleLogin = async () => {
    try {
      const response = await fetch(
        "http://localhost:8000/api/v1/adminRoute/admin/login",
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          credentials: "include",
          body: JSON.stringify({ email, password }),
        }
      );

      const data = await response.json();

      if (response.ok && data.success) {
        setAdmin(data.admin);
        await fetchAdmin();
        alert("Admin Login Successfully");
        navigate("/admin", { replace: true });
      } else {
        setError(data.message || "Admin Login Failed");
      }
    } catch (err) {
      console.error("Login Error:", err);
      setError("Something went wrong. Please try again.");
    }
  };

  return (
    <div
      className="flex items-center justify-center min-h-screen bg-cover bg-center bg-no-repeat"
      style={{
        backgroundImage:
          "url('https://img.freepik.com/free-photo/top-view-frame-with-food-copy-space_23-2148247893.jpg')",
      }}
    >
      <div
        className="w-full max-w-md p-8 space-y-6 shadow-xl rounded-lg"
        style={{ backgroundColor: "rgb(255 166 6)" }}
      >
        <h2 className="text-2xl font-bold text-center text-gray-900">
          Welcome to Admin Login
        </h2>

        {error && (
          <p className="text-red-600 text-sm text-center">{error}</p>
        )}

        {/* Email */}
        <div>
          <label className="block text-sm font-medium text-gray-900">
            Email
          </label>
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="w-full px-4 py-2 mt-1 border rounded-md"
            placeholder="admin@example.com"
            required
          />
        </div>

        {/* Password */}
        <div>
          <label className="block text-sm font-medium text-gray-900">
            Password
          </label>
          <div className="relative">
            <input
              type={showPassword ? "text" : "password"}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full px-4 py-2 mt-1 border rounded-md"
              placeholder="••••••••"
              required
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute right-3 top-3"
            >
              {showPassword ? <IoEyeSharp /> : <IoEyeOffSharp />}
            </button>
          </div>
        </div>

        {/* Login Button */}
        <button
          onClick={handleLogin}
          className="w-full py-2 text-white bg-blue-600 rounded-md hover:bg-blue-700"
        >
          Login
        </button>

        {/* Forget Password */}
        <p className="text-center text-sm mt-4 text-gray-900">
          Forgot Password?{" "}
          <span
            onClick={() => setShowForget(true)}
            className="text-blue-600 cursor-pointer hover:underline"
          >
            Reset here
          </span>
        </p>
      </div>
    </div>
  );
};

export default AdminLogin;

