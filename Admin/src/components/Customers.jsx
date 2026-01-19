import { useEffect, useState } from "react";
import { IoFilter, IoPeopleCircle } from "react-icons/io5";
import axios from "axios";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const Customers = () => {
  const [customers, setCustomers] = useState([]);
  const [foodProviders, setFoodProviders] = useState([]);
  const [deliveryBoys, setDeliveryBoys] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [activeTab, setActiveTab] = useState("customers");
  const [keyword, setKeyword] = useState(""); // For search
  const rowsPerPage = 6;
  const API = axios.create({
    baseURL: "http://localhost:8000/api/v1",
    withCredentials: true,
  });

  // --- Fetch initial data ---
  const fetchAllData = async () => {
    try {
      // Fetch all users (customers + providers)
      const resUsers = await API.get("/user/admin/users");
      if (resUsers.data.success) {
        const allUsers = resUsers.data.users;
        setCustomers(allUsers.filter((u) => u.role === "user"));
        setFoodProviders(allUsers.filter((u) => u.role === "food_provider"));
      }

      // Fetch all delivery boys
      const resDelivery = await API.get("/deliveryBoy/all");
      if (resDelivery.data.success) setDeliveryBoys(resDelivery.data.deliveryBoys);
    } catch (err) {
      console.error("Error fetching data:", err);
      toast.error("Failed to fetch initial data");
    }
  };

  useEffect(() => {
    toast("Welcome to Customer Page!");
    fetchAllData();
  }, []);

  // --- Search functionality ---
  useEffect(() => {
    const delayDebounce = setTimeout(() => {
      handleSearch();
    }, 500); // 500ms debounce

    return () => clearTimeout(delayDebounce);
  }, [keyword, activeTab]);

  const handleSearch = async () => {
    if (!keyword.trim()) {
      // If search is empty, reload full data
      fetchAllData();
      return;
    }

    try {
      if (activeTab === "customers" || activeTab === "providers") {
        const res = await API.get(`/user/${encodeURIComponent(keyword)}`);
        if (res.data.success) {
          const allUsers = res.data.users;
          setCustomers(allUsers.filter((u) => u.role === "user"));
          setFoodProviders(allUsers.filter((u) => u.role === "food_provider"));
        } else {
          setCustomers([]);
          setFoodProviders([]);
        }
      } else if (activeTab === "deliveryboy") {
        const res = await API.get(`/deliveryBoy/byname/${encodeURIComponent(keyword)}`);
        if (res.data.success) setDeliveryBoys(res.data.deliveryBoys);
        else setDeliveryBoys([]);
      }
      setCurrentPage(1);
    } catch (err) {
      console.error("Search error:", err);
      toast.error("Search failed");
    }
  };

  const getTabData = () => {
    if (activeTab === "customers") return customers;
    if (activeTab === "providers") return foodProviders;
    if (activeTab === "deliveryboy") return deliveryBoys;
    return [];
  };

  const data = getTabData();
  const totalPages = Math.ceil(data.length / rowsPerPage);
  const currentPageData = data.slice((currentPage - 1) * rowsPerPage, currentPage * rowsPerPage);

  const getStatusClass = (status) => {
    if (status === "Active" || status === "Available") return "text-green-600";
    if (status === "Inactive" || status === "Unavailable" || status === "Deactive") return "text-red-600";
    return "text-gray-600";
  };

  const switchTab = (tab) => {
    setActiveTab(tab);
    setCurrentPage(1);
    setKeyword(""); // Reset search on tab switch
  };

  return (
    <>
      <ToastContainer />
      <div className="flex w-full flex-col">
        <div className="bg-white rounded-md p-4 border border-gray-200 overflow-y-scroll h-[88vh]">

          {/* Header */}
          <div className="flex items-center mb-4">
            <h1 className="text-2xl font-bold text-gray-800">Customer & Food Provider Details</h1>
          </div>

          {/* Notification Banner */}
          <div className="bg-green-50 text-green-800 p-4 rounded-lg mb-6 shadow-md">
            <p className="text-sm">
              This section bridges the gap between service users and providers.
              Maintaining accurate and up-to-date details enhances communication and streamlines order management.
            </p>
          </div>

          {/* Stats Grid */}
          <div className="grid grid-cols-3 gap-6 mb-6">
            <div className="bg-white shadow-lg p-4 rounded-lg">
              <div className="flex justify-between items-center">
                <h2 className="text-gray-800 font-semibold text-xl">Total Customers</h2>
                <IoPeopleCircle className="text-orange-500 text-3xl" />
              </div>
              <p className="mt-2 text-lg font-bold">{customers.length}</p>
            </div>

            <div className="bg-white shadow-lg p-4 rounded-lg">
              <div className="flex justify-between items-center">
                <h2 className="text-gray-800 font-semibold text-xl">Total Food Providers</h2>
                <IoPeopleCircle className="text-red-500 text-3xl" />
              </div>
              <p className="mt-2 text-lg font-bold">{foodProviders.length}</p>
            </div>

            <div className="bg-white shadow-lg p-4 rounded-lg">
              <div className="flex justify-between items-center">
                <h2 className="text-gray-800 font-semibold text-xl">Total Delivery Boys</h2>
                <IoPeopleCircle className="text-blue-500 text-3xl" />
              </div>
              <p className="mt-2 text-lg font-bold">{deliveryBoys.length}</p>
            </div>
          </div>

          {/* Tabs */}
          <div className="flex border-b border-gray-300 mb-4">
            <button
              className={`py-2 px-3 ${activeTab === "customers" ? "text-blue-500 border-b-2 border-blue-500" : "text-gray-600 hover:text-blue-500"}`}
              onClick={() => switchTab("customers")}>Customer Details</button>
            <button
              className={`py-2 px-3 ${activeTab === "providers" ? "text-blue-500 border-b-2 border-blue-500" : "text-gray-600 hover:text-blue-500"}`}
              onClick={() => switchTab("providers")}>Food Provider Details</button>
            <button
              className={`py-2 px-3 ${activeTab === "deliveryboy" ? "text-blue-500 border-b-2 border-blue-500" : "text-gray-600 hover:text-blue-500"}`}
              onClick={() => switchTab("deliveryboy")}>Delivery Boy Details</button>
          </div>

          {/* Search */}
          <div className="flex justify-between items-center mb-4 gap-2">
            <input
              type="text"
              placeholder="Search by name..."
              value={keyword}
              onChange={(e) => setKeyword(e.target.value)}
              className="border border-gray-400 rounded-lg px-3 py-1 w-full max-w-xl"
            />
            <button className="bg-gray-200 px-3 py-1 rounded-lg hover:bg-gray-300 flex items-center gap-1">
              <IoFilter />Filters
            </button>
          </div>

          {/* Table */}
          <div className="bg-white rounded-lg shadow-md overflow-hidden">
            <table className="w-full text-gray-700 items-center">
              <thead>
                <tr>
                  <th className="text-center py-2">#</th>
                  <th className="text-center py-2">Name</th>
                  <th className="text-center py-2">Email</th>
                  <th className="text-center py-2">Contact</th>
                  <th className="text-center py-2">Status</th>
                </tr>
              </thead>
              <tbody>
                {currentPageData.length > 0 ? currentPageData.map((item, index) => (
                  <tr key={index} className="border-t">
                    <td className="text-center py-2">{(currentPage - 1) * rowsPerPage + index + 1}</td>
                    <td className="text-center py-2">{item.fullname}</td>
                    <td className="text-center py-2">{item.email}</td>
                    <td className="text-center py-2">{item.phoneNumber}</td>
                    <td className={`text-center py-2 font-semibold ${getStatusClass(item.status)}`}>{item.status}</td>
                  </tr>
                )) : (
                  <tr>
                    <td colSpan="5" className="text-center py-4 text-gray-500">No data found</td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>

          {/* Pagination */}
          <div className="flex justify-center mt-4 gap-2">
            <button
              disabled={currentPage === 1}
              onClick={() => setCurrentPage(currentPage - 1)}
              className="px-3 py-1 bg-gray-200 rounded hover:bg-gray-300 disabled:opacity-40">Previous</button>
            <button
              disabled={currentPage === totalPages || totalPages === 0}
              onClick={() => setCurrentPage(currentPage + 1)}
              className="px-3 py-1 bg-gray-200 rounded hover:bg-gray-300 disabled:opacity-40">Next</button>
          </div>
        </div>
      </div>
    </>
  );
};

export default Customers;
