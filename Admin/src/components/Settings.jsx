// import { useEffect, useState } from "react";
// import { toast, ToastContainer } from "react-toastify";
// import axios from "axios";
// import EditProfileModal from "./EditProfileModal";
// import "react-toastify/dist/ReactToastify.css";
// import { useAdminAuth } from "../Context/AdminAuthContext";

// const Settings = () => {
//   const { admin, fetchAdmin } = useAdminAuth(); // fetchAdmin will refresh profile instantly

//   const [darkMode, setDarkMode] = useState(false);
//   const [isEditModalOpen, setEditModalOpen] = useState(false);

//   useEffect(() => {
//     if (darkMode) {
//       document.body.classList.add("dark", "bg-gray-900", "text-white");
//       document.body.classList.remove("bg-gray-100", "text-gray-800");
//     } else {
//       document.body.classList.remove("dark", "bg-gray-900", "text-white");
//       document.body.classList.add("bg-gray-100", "text-gray-800");
//     }
//   }, [darkMode]);

//   useEffect(() => {
//     toast.info("Welcome to Settings Page!");
//   }, []);

//   if (!admin) return null;

//   return (
//     <>
//       <ToastContainer />

//       <div className="flex w-full flex-col">
//         <div className="p-6 h-[88vh] overflow-y-auto">
//           <h2 className="text-3xl font-bold text-center mb-8">Settings</h2>

//           {/* ACCOUNT SETTINGS */}
//           <div className="mb-8">
//             <h3 className="text-xl font-semibold mb-4">Account Settings</h3>
//             <div
//               className={`p-6 rounded-lg shadow-md transition-colors ${
//                 darkMode
//                   ? "bg-gray-800 border border-gray-700"
//                   : "bg-white border border-gray-300"
//               }`}
//             >
//               <button
//                 onClick={() => setEditModalOpen(true)}
//                 className="bg-blue-600 text-white py-2 px-4 rounded hover:bg-blue-700"
//               >
//                 Edit Profile
//               </button>
//             </div>
//           </div>

//           {/* APPEARANCE */}
//           <div className="mb-8">
//             <h3 className="text-xl font-semibold mb-4">Appearance</h3>
//             <div
//               className={`p-6 rounded-lg shadow-md transition-colors ${
//                 darkMode
//                   ? "bg-gray-800 border border-gray-700"
//                   : "bg-white border border-gray-300"
//               }`}
//             >
//               <label className="flex items-center space-x-3">
//                 <input
//                   type="checkbox"
//                   checked={darkMode}
//                   onChange={() => setDarkMode(!darkMode)}
//                   className="w-6 h-6"
//                 />
//                 <span className="font-medium">Enable Dark Mode</span>
//               </label>
//             </div>
//           </div>

//           {/* SECURITY */}
//           <div className="mb-8">
//             <h3 className="text-xl font-semibold mb-4">Security</h3>
//             <div
//               className={`p-6 rounded-lg shadow-md transition-colors ${
//                 darkMode
//                   ? "bg-gray-800 border border-gray-700"
//                   : "bg-white border border-gray-300"
//               }`}
//             >
//               <p>Manage your password and security settings.</p>
//               <button className="mt-4 bg-red-600 text-white py-2 px-4 rounded hover:bg-red-700">
//                 Change Password
//               </button>
//             </div>
//           </div>
//         </div>
//       </div>

//       {/* ⭐ Correct Modal Rendering */}
//       {isEditModalOpen && (
//         <EditProfileModal
//           isOpen={isEditModalOpen}
//           onClose={() => setEditModalOpen(false)}
//           admin={admin}
//           adminId={admin?._id}        // <-- correct!
//           refreshAdmin={fetchAdmin}   // <-- refresh instantly after update
//         />
//       )}
//     </>
//   );
// };

// export default Settings;

import { useEffect, useState } from "react";
import { toast, ToastContainer } from "react-toastify";
import { useNavigate } from "react-router-dom";
import "react-toastify/dist/ReactToastify.css";

import EditProfileModal from "./EditProfileModal";
import ChangePasswordModal from "./ChangePasswordModal";
import { useAdminAuth } from "../Context/AdminAuthContext";

const Settings = () => {
  const { admin, fetchAdmin } = useAdminAuth();
  const navigate = useNavigate();

  const [darkMode, setDarkMode] = useState(false);
  const [isEditModalOpen, setEditModalOpen] = useState(false);
  const [showChangePassword, setShowChangePassword] = useState(false);

  // 🌙 Dark Mode Toggle
  useEffect(() => {
    if (darkMode) {
      document.body.classList.add("dark", "bg-gray-900", "text-white");
      document.body.classList.remove("bg-gray-100", "text-gray-800");
    } else {
      document.body.classList.remove("dark", "bg-gray-900", "text-white");
      document.body.classList.add("bg-gray-100", "text-gray-800");
    }
  }, [darkMode]);

  // 👋 Welcome toast
  useEffect(() => {
    toast.info("Welcome to Settings Page!");
  }, []);

  if (!admin) return null;

  // 🚪 Logout after password change
  const logoutAfterPasswordChange = async () => {
    try {
      await fetch(
        "http://localhost:8000/api/v1/adminRoute/admin/logout",
        {
          method: "get",
          credentials: "include",
        }
      );
    } catch (err) {
      console.error("Logout failed:", err);
    }

    // navigate("/admin/login", { replace: true });
    window.location.href = "/";
  };


  return (
    <>
      <ToastContainer />

      <div className="flex w-full flex-col">
        <div className="p-6 h-[88vh] overflow-y-auto">
          <h2 className="text-3xl font-bold text-center mb-8">
            Settings
          </h2>

          {/* ================= ACCOUNT SETTINGS ================= */}
          <div className="mb-8">
            <h3 className="text-xl font-semibold mb-4">
              Account Settings
            </h3>

            <div
              className={`p-6 rounded-lg shadow-md transition-colors ${
                darkMode
                  ? "bg-gray-800 border border-gray-700"
                  : "bg-white border border-gray-300"
              }`}
            >
              <button
                onClick={() => setEditModalOpen(true)}
                className="bg-blue-600 text-white py-2 px-4 rounded hover:bg-blue-700"
              >
                Edit Profile
              </button>
            </div>
          </div>

          {/* ================= APPEARANCE ================= */}
          <div className="mb-8">
            <h3 className="text-xl font-semibold mb-4">
              Appearance
            </h3>

            <div
              className={`p-6 rounded-lg shadow-md transition-colors ${
                darkMode
                  ? "bg-gray-800 border border-gray-700"
                  : "bg-white border border-gray-300"
              }`}
            >
              <label className="flex items-center space-x-3">
                <input
                  type="checkbox"
                  checked={darkMode}
                  onChange={() => setDarkMode(!darkMode)}
                  className="w-6 h-6"
                />
                <span className="font-medium">
                  Enable Dark Mode
                </span>
              </label>
            </div>
          </div>

          {/* ================= SECURITY ================= */}
          <div className="mb-8">
            <h3 className="text-xl font-semibold mb-4">
              Security
            </h3>

            <div
              className={`p-6 rounded-lg shadow-md transition-colors ${
                darkMode
                  ? "bg-gray-800 border border-gray-700"
                  : "bg-white border border-gray-300"
              }`}
            >
              <p className="mb-4">
                Manage your password and security settings.
              </p>

              <button
                onClick={() => setShowChangePassword(true)}
                className="bg-red-600 text-white py-2 px-4 rounded hover:bg-red-700"
              >
                Change Password
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* ================= EDIT PROFILE MODAL ================= */}
      {isEditModalOpen && (
        <EditProfileModal
          isOpen={isEditModalOpen}
          onClose={() => setEditModalOpen(false)}
          admin={admin}
          adminId={admin._id}
          refreshAdmin={fetchAdmin}
        />
      )}

      {/* ================= CHANGE PASSWORD MODAL ================= */}
      {showChangePassword && (
        <ChangePasswordModal
          onClose={() => setShowChangePassword(false)}
          onSuccess={logoutAfterPasswordChange}
        />
      )}
    </>
  );
};

export default Settings;
