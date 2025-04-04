import React, { useState } from 'react'
import Navbar from './components/Navbar'
import { Route, Routes } from 'react-router-dom'
import Home from './pages/Home.jsx'
import Cart from './pages/Cart.jsx'
import PlaceOrder from './pages/PlaceOrder.jsx'
import Footer from './components/Footer.jsx'
import LoginPopup from './components/LoginPopup.jsx'
import Verify from './pages/Verify.jsx'
import MyOrders from './pages/MyOrders.jsx'

const App = () => {

  const[showLogin,setShowLogin] = useState(false)
  return (
  <>
  {showLogin?<LoginPopup setShowLogin={setShowLogin}/>:<></>}
    <div className='app'>
      <Navbar setShowLogin={setShowLogin}/>
      <Routes>
        <Route path='/' element={<Home/>} />
        <Route path='/cart' element={<Cart/>} />
        <Route path='/order' element={<PlaceOrder/>} />
        <Route path='/verify' element={<Verify/>} />
        <Route path='/myorders' element={<MyOrders/>} />
      </Routes>
      
    </div>
    <Footer/>
  </>
  )
}

export default App
