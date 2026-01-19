import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import './ProductList.css';
import { motion } from 'framer-motion';

const ProductList = () => {
  const { id: counterId } = useParams();
  const navigate = useNavigate();
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]); // dynamic categories
  const [loading, setLoading] = useState(true);
  const [selectedCategory, setSelectedCategory] = useState('');

  // Fetch products
  const fetchProducts = async () => {
    try {
      setLoading(true);
      let res;

      if (selectedCategory) {
        res = await axios.get(
          `http://localhost:8000/api/v1/food/category/${counterId}/${selectedCategory}`,
          { withCredentials: true }
        );
      } else {
        res = await axios.get(
          `http://localhost:8000/api/v1/food/counter/${counterId}`,
          { withCredentials: true }
        );
      }

      setProducts(res.data.success ? res.data.foods : []);
    } catch (err) {
      console.error('API error:', err);
      setProducts([]);
    } finally {
      setLoading(false);
    }
  };

  // Fetch categories
  const fetchCategories = async () => {
    try {
      const res = await axios.get(`http://localhost:8000/api/v1/food/categories`, {
        withCredentials: true,
      });
      if (res.data.success) {
        setCategories(res.data.categories);
      }
    } catch (err) {
      console.error('Error fetching categories:', err);
      setCategories([]);
    }
  };

  useEffect(() => {
    fetchProducts();
  }, [counterId, selectedCategory]);

  useEffect(() => {
    fetchCategories();
  }, []);

  const handleStatusToggle = async (productId, currentStatus) => {
    const newStatus = currentStatus === 'Available' ? 'Unavailable' : 'Available';
    try {
      const res = await axios.put(
        `http://localhost:8000/api/v1/food/updatestatus/${productId}`,
        { status: newStatus },
        { withCredentials: true }
      );

      if (res.data.success) fetchProducts();
    } catch (error) {
      console.error('Status update failed:', error);
      alert('Failed to update status.');
    }
  };

  return (
    <motion.div
      className="flist-container"
      initial={{ opacity: 0, y: 30 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6, ease: 'easeOut' }}
    >
      <div className="flist-header">
        <h2>Products</h2>
        <div className="flist-controls">
          <button
            className="flist-btn flist-add-btn"
            onClick={() => navigate(`/addfood/${counterId}`)}
          >
            + Add Product
          </button>

          <select
            name="category"
            className="flist-select"
            value={selectedCategory}
            onChange={(e) => setSelectedCategory(e.target.value)}
          >
            <option value="">All Categories</option>
            {categories.map((cat, idx) => (
              <option key={idx} value={cat}>
                {cat}
              </option>
            ))}
          </select>
        </div>
      </div>

      {loading ? (
        <p>Loading...</p>
      ) : products.length === 0 ? (
        <p>No products found.</p>
      ) : (
        <div className="flist-grid">
          {products.map((product) => (
            <div key={product._id} className="flist-cardx">
              <img
                src={product.photo || '/placeholder.png'}
                alt={product.name}
                className="flist-img"
              />

              <span
                className={`flist-status ${
                  product.status === 'Available' ? 'available' : 'unavailable'
                }`}
              >
                {product.status}
              </span>

              <h3 className="flist-title">{product.name}</h3>
              <p className="flist-meta">📍 {product.category}</p>
              <p className="flist-price">₹{product.price.toFixed(2)}</p>

              <div className="flist-actions">
                <button
                  className="flist-btn flist-edit-btn"
                  onClick={() => navigate(`/editfood/${product._id}`)}
                >
                  Edit
                </button>
                <button
                  className="flist-btn flist-delete-btn"
                  onClick={() => {
                    if (window.confirm('Are you sure you want to delete this product?')) {
                      axios
                        .delete(`http://localhost:8000/api/v1/food/delete/${product._id}`, {
                          withCredentials: true,
                        })
                        .then(() => fetchProducts());
                    }
                  }}
                >
                  Delete
                </button>
                <button
                  className={`flist-btn ${
                    product.status === 'Available'
                      ? 'flist-unavailable-btn'
                      : 'flist-available-btn'
                  }`}
                  onClick={() => handleStatusToggle(product._id, product.status)}
                >
                  {product.status === 'Available'
                    ? 'Make Unavailable'
                    : 'Make Available'}
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </motion.div>
  );
};

export default ProductList;
