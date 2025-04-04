import React, { useState } from 'react'
import '../css/Home.css'
import Header from '../Header/Header'
import ExploreMenu from '../components/ExploreMenu'
import FoodDisplay from '../components/FoodDisplay'
// import Appdownload from '../components/Appdownload'

function Home() {
  const [category, setCategory] = useState("All")
  return (
    <div>
        <Header/>
        <ExploreMenu category={category} setCategory={setCategory}/>
        <FoodDisplay category={category}/>
        {/* <Appdownload/> */}
    </div>
  )
}

export default Home
