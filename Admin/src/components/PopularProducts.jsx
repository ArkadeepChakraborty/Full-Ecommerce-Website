import { useEffect, useState } from "react";
import axios from "axios";
import { Link } from "react-router-dom";

const PopularProducts = () => {
  const [products, setProducts] = useState([]);

  const getStockClass = (stock) => {
    if (stock === 0) return "text-red-500";
    if (stock > 50) return "text-green-500";
    return "text-orange-500";
  };

  useEffect(() => {
    const fetchTopSelling = async () => {
      try {
        const res = await axios.get(
          "http://localhost:8000/api/v1/order/top-selling-basic"
        );

        if (res.data.success) {
          setProducts(res.data.data);
        }
      } catch (error) {
        console.log("Error fetching top selling products:", error);
      }
    };

    fetchTopSelling();
  }, []);

  return (
    <div className="w-[20rem] bg-white p-4 rounded-sm border border-gray-200">
      <strong className="text-gray-700 font-medium">Popular Products</strong>

      <div className="mt-4 flex flex-col gap-3 h-[35vh] overflow-y-scroll pr-4">
        {products.map((product) => (
          <Link
            key={product.id}
            to={`/product/${product.id}`}
            className="flex items-start hover:no-underline"
          >
            <div className="w-10 h-10 min-w-[2.5rem] bg-gray-200 rounded-sm">
              <img
                className="w-full h-full object-cover rounded-sm"
                src={product.image}
                alt={product.name}
              />
            </div>

            <div className="ml-4 flex-1">
              <p className="text-sm text-gray-800">{product.name}</p>

              <span className="text-xs font-medium text-green-500">
                Best Seller
              </span>
            </div>

            <div className="text-xs text-gray-600 pl-1.5">
              ₹{product.price}
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
};

export default PopularProducts;
