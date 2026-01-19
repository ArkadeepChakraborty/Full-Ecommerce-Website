import { useEffect, useState } from "react";
import axios from "axios";
import { ToastContainer, toast } from "react-toastify";

const Products = () => {
  const [foodProducts, setFoodProducts] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [categories, setCategories] = useState(["All"]);
  const [filterCategory, setFilterCategory] = useState("All");

  const showToast = (message) => {
    toast(message, {
      position: "top-right",
      autoClose: 2500,
      hideProgressBar: true,
      closeButton: false,
      pauseOnHover: false,
      draggable: true,
    });
  };

  const token = localStorage.getItem("token");

  // -------------------------------
  // Load All Food Items Initially
  // -------------------------------
  const fetchFoods = async () => {
    try {
      const res = await axios.get(`http://localhost:8000/api/v1/food/get`, {
        headers: { Authorization: `Bearer ${token}` },
      });

      if (res.data.success) {
        setFoodProducts(res.data.foods);
      } else {
        showToast("Failed to load products");
      }
    } catch (err) {
      showToast("Error fetching products");
      console.log(err);
    }
  };

  // -------------------------------
  // Load Categories for Dropdown
  // -------------------------------
  const fetchCategories = async () => {
    try {
      const res = await axios.get(`http://localhost:8000/api/v1/food/categories`);

      if (res.data.success) {
        setCategories(["All", ...res.data.categories]);
      }
    } catch (error) {
      console.log("Category fetch error:", error);
    }
  };

  useEffect(() => {
    fetchFoods();
    fetchCategories();
  }, []);

  // -------------------------------------
  // Live Search (Backend Based)
  // -------------------------------------
  useEffect(() => {
    const delayDebounce = setTimeout(() => {
      if (searchTerm.trim() === "") {
        fetchFoods();
        return;
      }

      searchFoodByName(searchTerm);
    }, 350);

    return () => clearTimeout(delayDebounce);
  }, [searchTerm]);

  const searchFoodByName = async (name) => {
    try {
      const res = await axios.get(
        `http://localhost:8000/api/v1/food/search/${name}`,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      if (res.data.success) {
        setFoodProducts(res.data.foods);
      }
    } catch (err) {
      setFoodProducts([]);
      console.log("Search error:", err);
    }
  };

  // -------------------------------------
  // Category Filter (Backend Based)
  // -------------------------------------
  const filterByCategory = async (category) => {
    setFilterCategory(category);

    if (category === "All") {
      fetchFoods();
      return;
    }

    try {
      const res = await axios.get(
        `http://localhost:8000/api/v1/food/category/${category}`,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      if (res.data.success) {
        setFoodProducts(res.data.foods);
      }
    } catch (err) {
      setFoodProducts([]);
      console.log("Category filter error:", err);
    }
  };

  // -------------------------------------
  // Delete Food
  // -------------------------------------
  const handleDelete = async (id) => {
    try {
      await axios.delete(`http://localhost:8000/api/v1/food/delete/${id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });

      setFoodProducts((prev) => prev.filter((p) => p._id !== id));
      showToast("Product deleted");
    } catch (err) {
      showToast("Delete failed");
    }
  };

  return (
    <>
      <ToastContainer />

      <div className="flex w-full flex-col">
        <div className="bg-white rounded-md p-4 border border-gray-200 overflow-y-scroll h-[88vh]">
          
          {/* Header */}
          <div className="flex justify-between flex-wrap gap-4 items-center mb-4">
            <div className="text-black font-bold text-2xl">
              Products Details
            </div>

            {/* Search + Category Filter */}
            <div className="flex flex-wrap gap-3">
              
              {/* Search */}
              <input
                type="text"
                placeholder="Search by name"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="px-4 py-2 border rounded-lg w-full sm:w-64"
              />

              {/* Dynamic Category Dropdown */}
              <select
                onChange={(e) => filterByCategory(e.target.value)}
                value={filterCategory}
                className="px-4 py-2 border rounded-lg shadow-sm"
              >
                {categories.map((cat) => (
                  <option key={cat} value={cat}>
                    {cat}
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* Product Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6 p-4">
            {foodProducts.map((product) => (
              <div
                key={product._id}
                className="flex items-center border border-gray-300 rounded-lg p-4 bg-white shadow-md max-w-sm"
              >
                <img
                  src={product.photo}
                  alt={product.name}
                  className="w-24 h-24 rounded-lg mr-4"
                />

                <div className="flex flex-col">
                  <h2 className="text-xl font-bold text-gray-800">
                    {product.name}
                  </h2>

                  <p className="text-gray-600">
                    Price:{" "}
                    <span className="font-semibold">₹{product.price}</span>
                  </p>

                  <p className="text-gray-600">
                    Category:{" "}
                    <span className="font-semibold text-blue-600">
                      {product.category}
                    </span>
                  </p>

                  <p className="text-gray-600">
                    Counter:{" "}
                    <span className="font-semibold text-blue-600">
                      {product.food_counter_id?.name || "Unknown Counter"}
                    </span>
                  </p>

                  {/* <button
                    onClick={() => handleDelete(product._id)}
                    className="mt-3 px-4 py-2 rounded-lg bg-red-600 text-white hover:bg-red-700"
                  >
                    Delete
                  </button> */}
                </div>
              </div>
            ))}
          </div>

        </div>
      </div>
    </>
  );
};

export default Products;
