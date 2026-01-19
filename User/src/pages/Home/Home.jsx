import React, { useState } from 'react'
import './Home.css'
import Header from '../../components/Header/Header'
import HowItWorks from '../../components/Work/HowItWorks'
import BestDeals from '../../components/BestDeals/BestDeals'
import Foodcart from '../../components/FoodCart/Foodcart'
import FeaturesSection from '../../components/FeaturesSections/FeaturesSection'
import Testimonials from '../../components/Testimonials/Testimonials'
import About from '../../components/About/About'
import ExploreMenulist from '../../components/ExploreMenulist/ExploreMenulist'

const Home = () => {

  const [category, setCategory] = useState('All')
  return (
    <div>
      <Header/>
      <About/>
      <HowItWorks/>
      <ExploreMenulist/>
      <Foodcart/>
      <BestDeals/>
      <FeaturesSection/>
      <Testimonials/>
    </div>
  )
}

export default Home