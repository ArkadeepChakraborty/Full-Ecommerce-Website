import React, { useState } from 'react';
import Snowfall from 'react-snowfall';
import { Route, Routes } from 'react-router-dom';
import Navbar from './components/Navbar/Navbar';
import Footer from './components/Footer/Footer';
import LoginPopup from './components/LoginPopup/LoginPopup';
import Home from './pages/Home/Home';
import Cart from './pages/Cart/Cart';
import MyOrders from './pages/MyOrders/MyOrders';
import Foodcart from './components/FoodCart/Foodcart';
import TopDishes from './components/FoodCartItems/TopDishes';
import ProductDetail from './components/PopularProducts/ProductDetail';
import Wishlist from './pages/Wishlist/Wishlist';
import Account from './pages/UserAccount/Account';
import ReviewPage from './pages/FoodReview/ReviewPage';
import About from './components/About/About';
import ExploreMenulist from './components/ExploreMenulist/ExploreMenulist';
import EditProfile from './components/EditProfile/EditProfile';
import ViewFoodcart from './components/ViewFoodCart/ViewFoodCart';
import ForgetPassword from './components/ForgetPassword/ForgetPassword';
import AddLocation from './components/AddLocation/AddLocation';

import { CartProvider } from './components/Context/CartContext';
import { AuthProvider } from './components/Context/AuthContext';

const App = () => {
  const [showLogin, setShowLogin] = useState(false);

  return (
    <AuthProvider>
      <CartProvider>
        {showLogin && <LoginPopup setShowLogin={setShowLogin} />}
        <div className='app'>
          <Navbar setShowLogin={setShowLogin} />
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
            <Route path='/' element={<Home />} />
            <Route path='/cart' element={<Cart />} />
            <Route path='/myorders' element={<MyOrders />} />
            <Route path='/foodcart' element={<Foodcart />} />
            <Route path='/viewfoodcart' element={<ViewFoodcart />} />
            <Route path='/topdishes/:counterId' element={<TopDishes />} />
            <Route path='/detail/:id' element={<ProductDetail />} />
            <Route path='/wishlist' element={<Wishlist />} />
            <Route path='/account' element={<Account />} />
            <Route path='/review' element={<ReviewPage />} />
            <Route path='/about' element={<About />} />
            <Route path='/explore-menu-list' element={<ExploreMenulist />} />
            <Route path='/profile/edit' element={<EditProfile />} />
            <Route path='/forget-password' element={<ForgetPassword />} />
            <Route path='/addLocation/:orderId' element={<AddLocation />} />
          </Routes>
        </div>
        <Footer />
      </CartProvider>
    </AuthProvider>
  );
};

export default App;
