import { useState, useEffect } from "react";
import axios from "axios";
import { toast } from "react-toastify";

const EditProfileModal = ({ isOpen, onClose, admin, adminId, refreshAdmin }) => {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone_number: ""
  });

  // Load current values when modal opens
  useEffect(() => {
    if (admin) {
      setFormData({
        name: admin.name || "",
        email: admin.email || "",
        phone_number: admin.phone_number || ""
      });
    }
  }, [admin]);

  const handleUpdate = async () => {
    try {
      const { data } = await axios.put(
        `http://localhost:8000/api/v1/adminRoute/admin/update/info/${adminId}`,
        formData
      );

      toast.success("Profile Updated!");

      // 🔥 Update UI instantly
      await refreshAdmin();

      onClose();
    } catch (error) {
      console.log(error);
      toast.error("Something went wrong");
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-60 flex items-center justify-center z-50">
      <div className="bg-white dark:bg-gray-800 p-6 rounded-lg w-[400px] shadow-xl">

        <h2 className="text-xl font-bold mb-4">Edit Profile</h2>

        <div className="space-y-3">
          <input
            type="text"
            className="w-full p-2 border rounded"
            value={formData.name}
            onChange={(e) =>
              setFormData({ ...formData, name: e.target.value })
            }
            placeholder="Name"
          />

          <input
            type="email"
            className="w-full p-2 border rounded"
            value={formData.email}
            onChange={(e) =>
              setFormData({ ...formData, email: e.target.value })
            }
            placeholder="Email"
          />

          <input
            type="text"
            className="w-full p-2 border rounded"
            value={formData.phone_number}
            onChange={(e) =>
              setFormData({ ...formData, phone_number: e.target.value })
            }
            placeholder="Phone Number"
          />
        </div>

        <div className="flex justify-end mt-5 space-x-3">
          <button
            className="bg-gray-400 px-4 py-2 rounded"
            onClick={onClose}
          >
            Cancel
          </button>

          <button
            className="bg-blue-600 text-white px-4 py-2 rounded"
            onClick={handleUpdate}
          >
            Update
          </button>
        </div>

      </div>
    </div>
  );
};

export default EditProfileModal;
