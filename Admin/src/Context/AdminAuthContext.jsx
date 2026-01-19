import { createContext, useContext, useEffect, useState } from "react";
import axios from "axios";

// Always send cookies with Axios
axios.defaults.withCredentials = true;

// Stop Axios from throwing errors for 401 / 403
axios.defaults.validateStatus = () => true;

const AdminAuthContext = createContext();
export const useAdminAuth = () => useContext(AdminAuthContext);

export const AdminAuthProvider = ({ children }) => {
  const [admin, setAdmin] = useState(null);
  const [loading, setLoading] = useState(true);

  const fetchAdmin = async () => {
    const res = await axios.get(
      "http://localhost:8000/api/v1/adminRoute/admin/me"
    );

    // ✅ If not logged in — do NOT show error (normal case)
    if (res.status === 401 || res.status === 403) {
      setAdmin(null);
    }

    // ✅ Logged in
    else if (res.status === 200 && res.data.success) {
      setAdmin(res.data.admin);
    }

    setLoading(false);
  };

  useEffect(() => {
    fetchAdmin(); // Runs once on page load
  }, []);

  return (
    <AdminAuthContext.Provider
      value={{ admin, setAdmin, fetchAdmin, loading }}
    >
      {children}
    </AdminAuthContext.Provider>
  );
};








// import { createContext, useContext, useEffect, useState } from "react";
// import axios from "axios";

// axios.defaults.withCredentials = true; // allow cookies

// const AdminAuthContext = createContext();
// export const useAdminAuth = () => useContext(AdminAuthContext);

// export const AdminAuthProvider = ({ children }) => {
//   const [admin, setAdmin] = useState(null);
//   const [loading, setLoading] = useState(true);

//   const fetchAdmin = async () => {
//     try {
//       const res = await axios.get(
//         "http://localhost:8000/api/v1/adminRoute/admin/me",
//         { validateStatus: () => true } // avoid axios throwing 401
//       );

//       if (res.status === 200 && res.data.success) {
//         setAdmin(res.data.admin); // logged in
//       } else {
//         setAdmin(null); // not logged in (normal case)
//       }
//     } catch (error) {
//       console.error("Fetch admin failed:", error);
//       setAdmin(null);
//     } finally {
//       setLoading(false);
//     }
//   };

//   // ❗ Fetch once on mount
//   useEffect(() => {
//     fetchAdmin();
//   }, []);

//   return (
//     <AdminAuthContext.Provider
//       value={{ admin, setAdmin, fetchAdmin, loading }}
//     >
//       {children}
//     </AdminAuthContext.Provider>
//   );
// };

