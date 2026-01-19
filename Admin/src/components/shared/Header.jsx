// import {
//   HiOutlineBell,
//   HiOutlineChatAlt,
// } from "react-icons/hi";
// import {
//   Menu,
//   MenuButton,
//   Popover,
//   PopoverPanel,
//   MenuItems,
//   MenuItem,
// } from "@headlessui/react";
// import Swal from "sweetalert2";
// import { useEffect, useState } from "react";
// import ProfileSection from "../ProfileSection";
// import EditProfileModal from "../EditProfile"; // adjust path if needed

// const Header = () => {
//   const [isProfileModalOpen, setProfileModalOpen] = useState(false);
//   const [isEditModalOpen, setEditModalOpen] = useState(false);

//   const [image1, setImage1] = useState("");
//   const [name, setName] = useState("");
//   const [adminId, setAdminId] = useState("");

//   const toggleProfileModal = () => setProfileModalOpen(true);
//   const toggleModal = () => setProfileModalOpen(false);

//   // ✅ Delete account (calls backend)
//   const deleteaccount = () => {
//     Swal.fire({
//       title: "Are you sure?",
//       text: "You want to delete this account!",
//       icon: "warning",
//       showCancelButton: true,
//       confirmButtonColor: "#3085d6",
//       cancelButtonColor: "#d33",
//       confirmButtonText: "Yes, delete it!",
//     }).then(async (result) => {
//       if (result.isConfirmed) {
//         try {
//           const res = await fetch(`http://localhost:8000/api/v1/adminRoute/admin/${adminId}`, {
//             method: "DELETE",
//             credentials: "include", // ✅ send JWT cookie
//           });

//           const data = await res.json();
//           if (res.ok) {
//             Swal.fire("Deleted!", data.message, "success");
//             localStorage.removeItem("loggedUser");
//             window.location.href = "/";
//           } else {
//             Swal.fire("Error", data.message, "error");
//           }
//         } catch (err) {
//           console.error("Delete failed:", err);
//           Swal.fire("Error", "Something went wrong", "error");
//         }
//       }
//     });
//   };

//   // ✅ Fetch admin data
//   useEffect(() => {
//     const getAdminData = async () => {
//       const email = localStorage.getItem("loggedUser");
//       if (!email) return;

//       try {
//         const response = await fetch(
//           `http://localhost:8000/api/v1/adminRoute/admin/email/${email}`,
//           {
//             credentials: "include", // ✅ required for auth
//           }
//         );

//         const data = await response.json();
//         console.log("Fetched admin data:", data);

//         if (response.ok) {
//           setImage1(data.image);
//           setName(data.name);
//           setAdminId(data._id);
//         } else {
//           console.error("Error fetching admin:", data.message);
//         }
//       } catch (error) {
//         console.error("Failed to fetch admin data:", error);
//       }
//     };

//     getAdminData();
//   }, []);

//   return (
//     <div className="bg-white h-16 px-4 flex justify-between items-center border-b border-gray-250">
//       {/* Admin Dashboard Heading */}
//       <div className="text-xl font-bold text-gray-800 ml-4">
//         Admin Dashboard
//       </div>

//       {/* Right Section */}
//       <div className="flex items-center gap-4 mr-2">
//         {/* Chat */}
//         <Popover className="relative">
//           <Popover.Button className="p-1.5 rounded-md inline-flex items-center text-gray-800 hover:text-opacity-100 focus:outline-none active:bg-gray-100">
//             <HiOutlineChatAlt fontSize={24} />
//           </Popover.Button>
//           <PopoverPanel className="absolute right-0 z-10 mt-2.5 w-80 bg-neutral-200 rounded-sm shadow-md px-2 py-2.5">
//             <strong className="text-gray-700 font-medium">Messages</strong>
//             <div className="mt-2 py-1 text-sm">This is messages panel</div>
//           </PopoverPanel>
//         </Popover>

//         {/* Notifications */}
//         <Popover className="relative">
//           <Popover.Button className="p-1.5 rounded-md inline-flex items-center text-gray-800 hover:text-opacity-100 focus:outline-none active:bg-gray-100">
//             <HiOutlineBell fontSize={24} />
//           </Popover.Button>
//           <PopoverPanel className="absolute right-16 z-10 mt-2.5 w-80 bg-neutral-200 rounded-sm shadow-md px-2 py-2.5">
//             <strong className="text-gray-700 font-medium">Notifications</strong>
//             <div className="mt-2 py-1 text-sm">
//               This is notifications panel
//             </div>
//           </PopoverPanel>
//         </Popover>

//         {/* Profile */}
//         <Menu as="div" className="relative">
//           <div className="inline-flex">
//             <MenuButton className="ml-2 inline-flex rounded-full focus:outline-none focus:ring-2">
//               <span className="sr-only">Open Menu</span>
//               <div
//                 className="rounded-full h-10 w-10 bg-cover bg-no-repeat bg-center"
//                 style={{
//                   backgroundImage: `url(${image1 || "https://via.placeholder.com/150"})`,
//                 }}
//               >
//                 <span className="sr-only">{name}</span>
//               </div>
//             </MenuButton>
//           </div>
//           <MenuItems className="right-0 mt-2 z-10 absolute w-52 origin-top-right rounded-xl shadow-md p-1 bg-gray-100 ring-1 ring-black ring-opacity-5 focus:outline-none">
//             <MenuItem>
//               <button
//                 className="w-full text-left text-gray-700 px-4 py-2 hover:bg-gray-300 rounded-md"
//                 onClick={toggleProfileModal}
//               >
//                 Your Profile
//               </button>
//             </MenuItem>
//             <MenuItem>
//               <button
//                 className="w-full text-left text-gray-700 px-4 py-2 hover:bg-gray-300 rounded-md"
//                 onClick={() => setEditModalOpen(true)}
//               >
//                 Edit Profile
//               </button>
//             </MenuItem>
//             <MenuItem>
//               <button
//                 className="w-full text-left text-gray-700 px-4 py-2 hover:bg-gray-300 rounded-md"
//                 onClick={deleteaccount}
//               >
//                 Delete Account
//               </button>
//             </MenuItem>
//           </MenuItems>
//         </Menu>
//       </div>

//       {isProfileModalOpen && <ProfileSection onClose={toggleModal} />}
//       {isEditModalOpen && (
//         <EditProfileModal onClose={() => setEditModalOpen(false)} />
//       )}
//     </div>
//   );
// };

// export default Header;




import { useState } from "react";
import { HiOutlineBell, HiOutlineChatAlt } from "react-icons/hi";
import { Menu, MenuButton, MenuItems, MenuItem } from "@headlessui/react";
import Swal from "sweetalert2";
import ProfileSection from "../ProfileSection"; // adjust path if needed
import EditProfileModal from "../EditProfile"; // adjust path if needed
import { useAdminAuth } from "../../Context/AdminAuthContext"; // correct relative path

const Header = () => {
  const { admin } = useAdminAuth(); // ✅ context gives latest admin data
  const [isProfileModalOpen, setProfileModalOpen] = useState(false);
  const [isEditModalOpen, setEditModalOpen] = useState(false);

  const toggleProfileModal = () => setProfileModalOpen(true);
  const toggleModal = () => setProfileModalOpen(false);

  // Delete account
  const deleteaccount = () => {
    if (!admin?._id) return;

    Swal.fire({
      title: "Are you sure?",
      text: "You want to delete this account!",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#3085d6",
      cancelButtonColor: "#d33",
      confirmButtonText: "Yes, delete it!",
    }).then(async (result) => {
      if (result.isConfirmed) {
        try {
          const res = await fetch(
            `http://localhost:8000/api/v1/adminRoute/admin/${admin._id}`,
            { method: "DELETE", credentials: "include" }
          );
          const data = await res.json();

          if (res.ok) {
            Swal.fire("Deleted!", data.message, "success");
            localStorage.removeItem("loggedUser");
            window.location.href = "/";
          } else {
            Swal.fire("Error", data.message, "error");
          }
        } catch (err) {
          console.error("Delete failed:", err);
          Swal.fire("Error", "Something went wrong", "error");
        }
      }
    });
  };

  return (
    <div className="bg-white h-16 px-4 flex justify-between items-center border-b border-gray-250">
      {/* Dashboard Title */}
      <div className="text-xl font-bold text-gray-800 ml-4">Admin Dashboard</div>

      {/* Right section: Notifications, Chat, Profile */}
      <div className="flex items-center gap-4 mr-2">
        {/* Chat */}
        {/* <div className="relative">
          <button className="p-1.5 rounded-md inline-flex items-center text-gray-800 hover:text-opacity-100 focus:outline-none active:bg-gray-100">
            <HiOutlineChatAlt fontSize={24} />
          </button>
        </div> */}

        {/* Notifications */}
        {/* <div className="relative">
          <button className="p-1.5 rounded-md inline-flex items-center text-gray-800 hover:text-opacity-100 focus:outline-none active:bg-gray-100">
            <HiOutlineBell fontSize={24} />
          </button>
        </div> */}

        {/* Profile Menu */}
        <Menu as="div" className="relative">
          <div className="inline-flex">
            <MenuButton className="ml-2 inline-flex rounded-full focus:outline-none focus:ring-2">
              <span className="sr-only">Open Menu</span>
              <div
                className="rounded-full h-10 w-10 bg-cover bg-no-repeat bg-center"
                style={{
                  backgroundImage: `url(${
                    admin?.image ||
                    "https://static.vecteezy.com/system/resources/previews/043/900/634/non_2x/user-profile-icon-illustration-vector.jpg"
                  })`,
                }}
              >
                <span className="sr-only">{admin?.name}</span>
              </div>
            </MenuButton>
          </div>

          <MenuItems className="right-0 mt-2 z-10 absolute w-52 origin-top-right rounded-xl shadow-md p-1 bg-gray-100 ring-1 ring-black ring-opacity-5 focus:outline-none">
            <MenuItem>
              <button
                className="w-full text-left text-gray-700 px-4 py-2 hover:bg-gray-300 rounded-md"
                onClick={toggleProfileModal}
              >
                Your Profile
              </button>
            </MenuItem>
            <MenuItem>
              <button
                className="w-full text-left text-gray-700 px-4 py-2 hover:bg-gray-300 rounded-md"
                onClick={() => setEditModalOpen(true)}
              >
                Edit Profile
              </button>
            </MenuItem>
            <MenuItem>
              <button
                className="w-full text-left text-gray-700 px-4 py-2 hover:bg-gray-300 rounded-md"
                onClick={deleteaccount}
              >
                Delete Account
              </button>
            </MenuItem>
          </MenuItems>
        </Menu>
      </div>

      {/* Modals */}
      {isProfileModalOpen && <ProfileSection onClose={toggleModal} />}
      {isEditModalOpen && (
        <EditProfileModal onClose={() => setEditModalOpen(false)} />
      )}
    </div>
  );
};

export default Header;



// import { useState } from "react";
// import { HiOutlineBell, HiOutlineChatAlt } from "react-icons/hi";
// import { Menu, MenuButton, MenuItems, MenuItem } from "@headlessui/react";
// import Swal from "sweetalert2";
// import ProfileSection from "../ProfileSection";
// import EditProfileModal from "../EditProfile";
// import { useAdminAuth } from "../../Context/AdminAuthContext";

// const Header = () => {
//   const { admin } = useAdminAuth(); // ✅ use context instead of manual fetch
//   const [isProfileModalOpen, setProfileModalOpen] = useState(false);
//   const [isEditModalOpen, setEditModalOpen] = useState(false);

//   const toggleProfileModal = () => setProfileModalOpen(true);
//   const toggleModal = () => setProfileModalOpen(false);

//   // Delete account
//   const deleteaccount = () => {
//     if (!admin?._id) return;

//     Swal.fire({
//       title: "Are you sure?",
//       text: "You want to delete this account!",
//       icon: "warning",
//       showCancelButton: true,
//       confirmButtonColor: "#3085d6",
//       cancelButtonColor: "#d33",
//       confirmButtonText: "Yes, delete it!",
//     }).then(async (result) => {
//       if (result.isConfirmed) {
//         try {
//           const res = await fetch(
//             `http://localhost:8000/api/v1/adminRoute/admin/${admin._id}`,
//             { method: "DELETE", credentials: "include" }
//           );
//           const data = await res.json();

//           if (res.ok) {
//             Swal.fire("Deleted!", data.message, "success");
//             localStorage.removeItem("loggedUser");
//             window.location.href = "/";
//           } else {
//             Swal.fire("Error", data.message, "error");
//           }
//         } catch (err) {
//           console.error("Delete failed:", err);
//           Swal.fire("Error", "Something went wrong", "error");
//         }
//       }
//     });
//   };

//   return (
//     <div className="bg-white h-16 px-4 flex justify-between items-center border-b border-gray-250">
//       <div className="text-xl font-bold text-gray-800 ml-4">Admin Dashboard</div>

//       <div className="flex items-center gap-4 mr-2">
//         {/* Notifications and Chat (unchanged) */}

//         {/* Profile */}
//         <Menu as="div" className="relative">
//           <div className="inline-flex">
//             <MenuButton className="ml-2 inline-flex rounded-full focus:outline-none focus:ring-2">
//               <span className="sr-only">Open Menu</span>
//               <div
//                 className="rounded-full h-10 w-10 bg-cover bg-no-repeat bg-center"
//                 style={{
//                   backgroundImage: `url(${
//                     admin?.image ||
//                     "https://static.vecteezy.com/system/resources/previews/043/900/634/non_2x/user-profile-icon-illustration-vector.jpg"
//                   })`,
//                 }}
//               >
//                 <span className="sr-only">{admin?.name}</span>
//               </div>
//             </MenuButton>
//           </div>
//           <MenuItems className="right-0 mt-2 z-10 absolute w-52 origin-top-right rounded-xl shadow-md p-1 bg-gray-100 ring-1 ring-black ring-opacity-5 focus:outline-none">
//             <MenuItem>
//               <button
//                 className="w-full text-left text-gray-700 px-4 py-2 hover:bg-gray-300 rounded-md"
//                 onClick={toggleProfileModal}
//               >
//                 Your Profile
//               </button>
//             </MenuItem>
//             <MenuItem>
//               <button
//                 className="w-full text-left text-gray-700 px-4 py-2 hover:bg-gray-300 rounded-md"
//                 onClick={() => setEditModalOpen(true)}
//               >
//                 Edit Profile
//               </button>
//             </MenuItem>
//             <MenuItem>
//               <button
//                 className="w-full text-left text-gray-700 px-4 py-2 hover:bg-gray-300 rounded-md"
//                 onClick={deleteaccount}
//               >
//                 Delete Account
//               </button>
//             </MenuItem>
//           </MenuItems>
//         </Menu>
//       </div>

//       {isProfileModalOpen && <ProfileSection onClose={toggleModal} />}
//       {isEditModalOpen && (
//         <EditProfileModal onClose={() => setEditModalOpen(false)} />
//       )}
//     </div>
//   );
// };

// export default Header;
