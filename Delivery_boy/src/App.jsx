// App.jsx
import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Snowfall from 'react-snowfall';
import Navbar from './components/Navbar/Navbar';
import Footer from './components/Footer/footer';
import DeliveryCart from './pages/DeliveryCart/DeliveryCart';
import EditProfile from './pages/EditProfile/editProfile';
import Profile from './pages/Profile/profile';
import { AuthProvider } from './Context/AuthContext';
import AssignedOrders from './pages/AssignedOrders/AssignedOrders';

const App = () => {
  return (
    <AuthProvider>
      <Router>
        <div className='app'>
          <Navbar />
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
            <Route path='/' element={<AssignedOrders />} />
            <Route path='/deliveryboy/:orderId' element={<DeliveryCart />} />
            <Route path='/profile' element={<Profile />} />
            <Route path='/profile/edit' element={<EditProfile />} />
          </Routes>
        </div>
        <Footer />
      </Router>
    </AuthProvider>
  );
};

export default App;
