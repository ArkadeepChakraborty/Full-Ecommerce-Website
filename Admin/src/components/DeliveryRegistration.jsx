import { useEffect, useState } from "react";
import { toast, ToastContainer } from "react-toastify";
import axios from "axios";
import "react-toastify/dist/ReactToastify.css";
import Select from "react-select";

const DeliveryRegistration = () => {
  const [mode, setMode] = useState("register");
  const [formData, setFormData] = useState({
    _id: "",
    name: "",
    email: "",
    password: "",
    phone: "",
    availability: true,
  });
  const [deliveryBoys, setDeliveryBoys] = useState([]);

  // Axios base instance
  const API = axios.create({
    baseURL: "http://localhost:8000/api/v1/deliveryBoy",
    withCredentials: true,
  });

  // Show welcome toast
  useEffect(() => {
    toast.info("Welcome to Delivery Boy Registration Page!");
  }, []);

  // Fetch delivery boys when in "update" mode
  useEffect(() => {
    if (mode === "update") {
      fetchDeliveryBoys();
    }
  }, [mode]);

  // Fetch all delivery boys
  const fetchDeliveryBoys = async () => {
    try {
      const res = await API.get("/avaiable/all"); // fetch available delivery boys
      if (res.data.success) {
        setDeliveryBoys(res.data.deliveryBoys);
      }
    } catch (err) {
      console.error("Error fetching delivery boys:", err);
      toast.error("Failed to fetch delivery boys");
    }
  };

  // Handle input changes
  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  // Register or Update
  const handleSubmit = async (e) => {
    e.preventDefault();
    const { name, email, password, phone, availability, _id } = formData;

    // Validation
    if (
      !phone ||
      (mode === "register" && (!name || !email || !password)) ||
      (mode === "update" && !name)
    ) {
      toast.error("Please fill all required fields.");
      return;
    }

    try {
      if (mode === "register") {
        const res = await API.post("/register", {
          fullname: name,
          email,
          phoneNumber: phone,
          password,
        });
        if (res.data.success) {
          toast.success(res.data.message);
          setFormData({
            _id: "",
            name: "",
            email: "",
            password: "",
            phone: "",
            availability: true,
          });
        } else {
          toast.error(res.data.message || "Registration failed.");
        }
      } else {
        const res = await API.put(`/updatestatus/${encodeURIComponent(name)}`, {
          status: availability ? "Available" : "Unavailable",
        });
        if (res.data.success) {
          toast.success(res.data.message);
          setFormData({
            _id: "",
            name: "",
            email: "",
            password: "",
            phone: "",
            availability: true,
          });
          fetchDeliveryBoys();
        } else {
          toast.error(res.data.message || "Update failed.");
        }
      }
    } catch (err) {
      console.error(err);
      toast.error("Something went wrong. Check console.");
    }
  };

  // Delete delivery boy
  const handleDelete = async () => {
    if (!formData.name) {
      toast.error("Please select a delivery boy to delete.");
      return;
    }

    if (!window.confirm("Are you sure you want to remove this delivery boy?")) return;

    try {
      const res = await API.delete("/delete", { data: { fullname: formData.name } });

      if (res.data.success) {
        toast.success(res.data.message || "Deleted successfully!");

        // Remove the deleted delivery boy from the dropdown instantly
        setDeliveryBoys((prev) => prev.filter((boy) => boy._id !== formData._id));

        // Reset form
        setFormData({ _id: "", name: "", email: "", password: "", phone: "", availability: true });

      } else {
        toast.error(res.data.message || "Deletion failed.");
      }
    } catch (err) {
      console.error("Error deleting delivery boy:", err);
      toast.error("Something went wrong. Check console.");
    }
  };

  return (
    <>
      <ToastContainer />
      <div className="flex w-full flex-col">
        <div className="bg-white rounded-md p-6 border border-gray-200 overflow-y-scroll h-[88vh] shadow-md">
          <h1 className="text-2xl font-bold text-gray-800 mb-4">
            Delivery Boy {mode === "register" ? "Registration" : "Management"}
          </h1>

          <div className="bg-violet-50 text-violet-800 p-4 rounded-lg mb-6 shadow-md text-sm">
            <p>
              This section allows administrators to register, update, or remove delivery personnel. Changes will reflect in the delivery dashboard.
            </p>
          </div>

          <div className="max-w-md mx-auto">
            <div className="flex justify-between mb-6 gap-2">
              <button
                className={`flex-1 mx-1 py-2 px-4 rounded-lg font-semibold transition-all ${mode === "register" ? "bg-purple-600 text-white" : "bg-gray-300 text-black"
                  }`}
                onClick={() => setMode("register")}
              >
                Register
              </button>
              <button
                className={`flex-1 mx-1 py-2 px-4 rounded-lg font-semibold transition-all ${mode === "update" ? "bg-purple-600 text-white" : "bg-gray-300 text-black"
                  }`}
                onClick={() => setMode("update")}
              >
                Update / Remove
              </button>
            </div>
          </div>

          <form onSubmit={handleSubmit} className="flex flex-col gap-4 max-w-md mx-auto">
            {mode === "register" ? (
              <>
                <label className="font-semibold text-gray-700">Name:</label>
                <input
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  className="p-2 border rounded-lg"
                  required
                />
                <label className="font-semibold text-gray-700">Email:</label>
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  className="p-2 border rounded-lg"
                  required
                />
                <label className="font-semibold text-gray-700">Password:</label>
                <input
                  type="password"
                  name="password"
                  value={formData.password}
                  onChange={handleChange}
                  className="p-2 border rounded-lg"
                  required
                />
                <label className="font-semibold text-gray-700">Phone:</label>
                <input
                  type="tel"
                  name="phone"
                  value={formData.phone}
                  onChange={handleChange}
                  className="p-2 border rounded-lg"
                  required
                />
              </>
            ) : (
              <>
                <label className="font-semibold text-gray-700">Select Delivery Boy:</label>
                <Select
                  options={deliveryBoys.map((boy) => ({
                    value: boy._id,
                    label: `${boy.fullname} (${boy.phoneNumber})`,
                    data: boy,
                  }))}
                  onChange={(selected) => {
                    const boy = selected.data;
                    setFormData({
                      _id: boy._id,
                      name: boy.fullname,
                      email: boy.email || "",
                      password: "",
                      phone: boy.phoneNumber || "",
                      availability: boy.status === "Available",
                    });
                  }}
                  placeholder="Search by name or phone..."
                />

                <label className="font-semibold text-gray-700">Set Availability:</label>
                <select
                  name="availability"
                  value={formData.availability ? "Available" : "Unavailable"}
                  onChange={(e) =>
                    setFormData((prev) => ({
                      ...prev,
                      availability: e.target.value === "Available",
                    }))
                  }
                  className="p-2 border rounded-lg"
                >
                  <option value="Available">Available</option>
                  <option value="Unavailable">Unavailable</option>
                </select>
              </>
            )}

            <button
              type="submit"
              className="py-3 bg-green-500 text-white rounded-lg hover:bg-green-600"
            >
              {mode === "register" ? "Register" : "Update Availability"}
            </button>

            {mode === "update" && (
              <button
                type="button"
                onClick={handleDelete}
                className="py-3 bg-red-500 text-white rounded-lg hover:bg-red-600"
              >
                Remove
              </button>
            )}
          </form>
        </div>
      </div>
    </>
  );
};

export default DeliveryRegistration;
