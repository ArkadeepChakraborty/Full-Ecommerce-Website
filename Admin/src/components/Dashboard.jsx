import { useEffect } from "react";
import BuyerChart from "./BuyerChart";
import DashboardStart from "./DashboardStart";
import PopularProducts from "./PopularProducts";
import RecentOrders from "./RecentOrders";
import TransactionDetails from "./TransactionDetails";
import { ToastContainer, toast } from 'react-toastify';

const Dashboard = () => {

  useEffect(()=>{
    toast("Welcome to Admin Dashboard!");
  },[])

  return (
    <>
    <ToastContainer />
    <div className="flex gap-4 flex-col h-[88vh] overflow-y-scroll">
      <DashboardStart />
      <div className="flex flex-row gap-4 w-full">
        <TransactionDetails />
        <BuyerChart />
      </div>
      <div className="flex flex-row gap-4 w-full" style={{marginBottom:'20px'}}>
        <RecentOrders />
        <PopularProducts />
      </div>
    </div>
    </>
  );
};

export default Dashboard;
