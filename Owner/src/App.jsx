import React from 'react';
import Snowfall from 'react-snowfall';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Homepage from './pages/HomePage/Homepage';
import Navbar from './components/Navbar/Navbar';
import ProductList from './pages/Productlist/ProductList';
import OrderList from './pages/Orders/Orderlist';
import Footer from './components/Footer/footer';
import AddProduct from './pages/Addproduct/AddProduct';
import Addnewcart from './pages/NewCart/Addnewcart';
import Profile from './pages/Profile/Profile';
import Company from './pages/NewCompany/Company';
import EditFoodCounter from './pages/Editfoodcounter/EditFoodCounter';
import EditProfile from './pages/EditProfile/EditProfile';
import EditFood from './pages/EditFoodProducts/EditFood';
//import DeliveryBoyRegister from './pages/DeliveryBoyRegister/DeliveryBoyRegister';

const App = () => {
  return (

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
          <Route path='/' element={<Homepage />} />
          <Route path='/list/:id' element={<ProductList />} />
          <Route path='/orderlist' element={<OrderList />} />
          <Route path='/addfood/:id' element={<AddProduct />} />
          <Route path='/addnewcart' element={<Addnewcart />} />
          <Route path='/profile' element={<Profile />} />
          <Route path='/company' element={<Company />} />
          <Route path="/edit/:id" element={<EditFoodCounter />} />
          <Route path="/profile/edit" element={<EditProfile />} />
          <Route path="/editfood/:id" element={<EditFood />} />
          {/* <Route path="/dboy" element={<DeliveryBoyRegister />} /> */}
        </Routes>
      </div>
      <Footer />
    </Router>
  );
};

export default App;
