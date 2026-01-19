// import { useEffect, useState } from "react";
// import { GiSplitCross } from "react-icons/gi";
// import axios from "axios";
// import { useAdminAuth } from "../Context/AdminAuthContext";

// const ProfileSection = ({ onClose }) => {
//   const { admin, fetchAdmin } = useAdminAuth();
//   const [imagePreview, setImagePreview] = useState("");

//   useEffect(() => {
//     if (admin) {
//       setImagePreview(
//         admin.image ||
//           "https://static.vecteezy.com/system/resources/previews/043/900/634/non_2x/user-profile-icon-illustration-vector.jpg"
//       );
//     }
//   }, [admin]);

//   // ===========================================
//   // 🔼 FIXED: Upload Profile Photo
//   // ===========================================
//   const handleImageUpload = async (e) => {
//     const file = e.target.files[0];
//     if (!file || !admin?._id) return;

//     try {
//       const formData = new FormData();
//       formData.append("image", file);

//       const res = await axios.put(
//         `http://localhost:8000/api/v1/adminRoute/admin/update/photo/${admin.id}`,
//         formData,
//         {
//           withCredentials: true,
//           headers: {
//             "Content-Type": "multipart/form-data",
//           },
//         }
//       );

//       if (res.data.success) {
//         setImagePreview(res.data.data.image); // update preview
//         await fetchAdmin(); // refresh admin instantly
//       }
//     } catch (error) {
//       console.error("Image upload failed:", error);
//     }
//   };

//   if (!admin) {
//     return (
//       <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 text-white text-lg">
//         Loading admin data...
//       </div>
//     );
//   }

//   return (
//     <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
//       <div className="bg-white rounded-lg shadow-lg w-96 p-6">

//         {/* Header */}
//         <div className="flex justify-between items-center border-b pb-3">
//           <h2 className="text-xl font-semibold ml-20">Admin Profile</h2>
//           <button
//             onClick={onClose}
//             className="text-gray-500 hover:text-gray-700 text-2xl"
//           >
//             <GiSplitCross />
//           </button>
//         </div>

//         {/* Profile Content */}
//         <div className="mt-4 flex flex-col items-center text-center">
//           <div className="relative w-32 h-32">

//             <input
//               id="uploadImage"
//               type="file"
//               accept="image/*"
//               className="hidden"
//               onChange={handleImageUpload}
//             />

//             <label htmlFor="uploadImage" className="cursor-pointer">
//               <div className="w-full h-full rounded-full overflow-hidden border-2 border-gray-300">
//                 <img
//                   src={imagePreview}
//                   alt="Admin"
//                   className="w-full h-full object-cover"
//                 />
//               </div>
//             </label>
//           </div>

//           <h3 className="text-lg font-semibold mt-3">
//             {admin.name || "N/A"}
//           </h3>
//           <p className="text-sm text-gray-500">Role: Admin</p>
//         </div>

//         {/* Details Section */}
//         <div className="mt-6 space-y-4">
//           <div className="flex items-center gap-3 ml-14">
//             <span className="font-semibold text-gray-900">Email:</span>
//             <span className="text-gray-600">{admin.email}</span>
//           </div>

//           <div className="flex items-center gap-3 ml-20">
//             <span className="font-semibold text-gray-900">Phone:</span>
//             <span className="text-gray-600">
//               {admin.phone_number || "Not Added"}
//             </span>
//           </div>
//         </div>

//       </div>
//     </div>
//   );
// };

// export default ProfileSection;

import { useEffect, useState } from "react";
import { GiSplitCross } from "react-icons/gi";
import axios from "axios";
import Swal from "sweetalert2";
import { useAdminAuth } from "../Context/AdminAuthContext";


const ProfileSection = ({ onClose }) => {
  const { admin, fetchAdmin } = useAdminAuth();
  const [imagePreview, setImagePreview] = useState("");

  useEffect(() => {
    if (admin) {
      setImagePreview(
        admin.image ||
        "https://static.vecteezy.com/system/resources/previews/043/900/634/non_2x/user-profile-icon-illustration-vector.jpg"
      );
    }
  }, [admin]);

  // const handleImageUpload = async (e) => {
  //   const file = e.target.files[0];
  //   if (!file || !admin?._id) return;

  //   try {
  //     const formData = new FormData();
  //     formData.append("image", file);

  //     const res = await axios.put(
  //       `http://localhost:8000/api/v1/adminRoute/admin/update/photo/${admin._id}`, // ✅ fixed
  //       formData,
  //       {
  //         withCredentials: true,
  //         headers: {
  //           "Content-Type": "multipart/form-data",
  //         },
  //       }
  //     );

  //     if (res.data.success) {
  //       setImagePreview(res.data.data.image); // update preview
  //       await fetchAdmin(); // refresh admin context

  //       // ✅ Show success message
  //       Swal.fire({
  //         icon: "success",
  //         title: "Profile photo updated!",
  //         showConfirmButton: false,
  //         timer: 1500,
  //       });
  //     }
  //   } catch (error) {
  //     console.error("Image upload failed:", error);
  //     Swal.fire({
  //       icon: "error",
  //       title: "Upload failed",
  //       text: "Please try again",
  //     });
  //   }
  // };
  const handleImageUpload = async (e) => {
    const file = e.target.files[0];
     console.log("Selected file:", file);
    if (!file || !admin?._id) return;

    try {
      const formData = new FormData();
      formData.append("image", file);

      const res = await axios.put(
        `http://localhost:8000/api/v1/adminRoute/admin/update/photo/${admin._id}`,
        formData,
        { withCredentials: true }
      );

        console.log("Response:", res.data);

      if (res.data.success) {
        // Cache-busting to avoid browser caching old image
        const newImage = res.data.data.image + "?t=" + new Date().getTime();
        setImagePreview(newImage);
        await fetchAdmin(); // refresh admin context

        Swal.fire({
          icon: "success",
          title: "Profile photo updated!",
          showConfirmButton: false,
          timer: 1500,
        });
      }
    } catch (err) {
      console.error(err);
      Swal.fire({
        icon: "error",
        title: "Upload failed",
        text: "Please try again",
      });
    }
  };



  if (!admin) {
    return (
      <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 text-white text-lg">
        Loading admin data...
      </div>
    );
  }

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
      <div className="bg-white rounded-lg shadow-lg w-96 p-6">
        {/* Header */}
        <div className="flex justify-between items-center border-b pb-3">
          <h2 className="text-xl font-semibold ml-20">Admin Profile</h2>
          <button
            onClick={onClose}
            className="text-gray-500 hover:text-gray-700 text-2xl"
          >
            <GiSplitCross />
          </button>
        </div>

        {/* Profile Content */}
        <div className="mt-4 flex flex-col items-center text-center">
          <div className="relative w-32 h-32">
            <input
              id="uploadImage"
              type="file"
              accept="image/*"
              className="hidden"
              onChange={handleImageUpload}
            />
            <label htmlFor="uploadImage" className="cursor-pointer">
              <div className="w-full h-full rounded-full overflow-hidden border-2 border-gray-300">
                <img
                  src={imagePreview}
                  alt="Admin"
                  className="w-full h-full object-cover"
                />
              </div>
            </label>
          </div>

          <h3 className="text-lg font-semibold mt-3">{admin.name || "N/A"}</h3>
          <p className="text-sm text-gray-500">Role: Admin</p>
        </div>

        {/* Details Section */}
        <div className="mt-6 space-y-4">
          <div className="flex items-center gap-3 ml-14">
            <span className="font-semibold text-gray-900">Email:</span>
            <span className="text-gray-600">{admin.email}</span>
          </div>

          <div className="flex items-center gap-3 ml-20">
            <span className="font-semibold text-gray-900">Phone:</span>
            <span className="text-gray-600">
              {admin.phone_number || "Not Added"}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProfileSection;

