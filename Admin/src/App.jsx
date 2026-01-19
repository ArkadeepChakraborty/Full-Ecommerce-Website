import { BrowserRouter as Router, Route, Routes, Navigate } from "react-router-dom";
import { useAdminAuth } from "./Context/AdminAuthContext";
import Snowfall from 'react-snowfall';
import Layout from "./components/shared/Layout";
import Dashboard from "./components/Dashboard";
import Products from "./components/Products";
import Orders from "./components/Orders";
import Customers from "./components/Customers";
import Transactions from "./components/Transactions";
import OrderStatement from "./components/OrderStatement";
import AboutAdmin from "./components/AboutAdmin";
import Settings from "./components/Settings";
import AdminLogin from "./components/AdminLogin";
import DeliveryRegistration from "./components/DeliveryRegistration";

function App() {
  const { admin, loading } = useAdminAuth();

  // Wait for authentication check
  if (loading) return null;

  return (
    <Router>
      <Snowfall
        color="#cfd8dc"   // light gray / icy blue
        snowflakeCount={120}
        style={{
          position: 'fixed',
          width: '100vw',
          height: '100vh',
          zIndex: 9999,
          pointerEvents: 'none',
        }}
      />
      <Routes>

        {/* Landing: Login page */}
        <Route
          path="/"
          element={
            admin ? <Navigate to="/admin" replace /> : <AdminLogin />
          }
        />

        {/* Admin Protected Routes */}
        <Route
          path="/admin"
          element={
            admin ? <Layout /> : <Navigate to="/" replace />
          }
        >
          <Route index element={<Dashboard />} />
          <Route path="products" element={<Products />} />
          <Route path="orders" element={<Orders />} />
          <Route path="orderstatement" element={<OrderStatement />} />
          <Route path="customers" element={<Customers />} />
          <Route path="transactions" element={<Transactions />} />
          <Route path="deliveryboy" element={<DeliveryRegistration />} />
          <Route path="aboutadmin" element={<AboutAdmin />} />
          <Route path="settings" element={<Settings />} />
        </Route>

      </Routes>
    </Router>
  );
}

export default App;
