import React from 'react'
import Navbar from './components/Navbar'
import Sidebar from './components/Sidebar'
import {Route, Routes} from 'react-router-dom'
import Add from './page/Add'
import Order from './page/Order'
import List from './page/List'
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

function App() {
  const url = "http://localhost:4000"
  
  return (
    <div>
      <ToastContainer/> 
      <Navbar/>
      <hr/>
      <div className="app-content">
        <Sidebar/>
        {/* Here routes */}
        <Routes>
           <Route path='/add' element={<Add url={url}/>}/> 
           <Route path='/list' element={<List url={url}/>}/> 
           <Route path='/order' element={<Order url={url}/>}/> 
        </Routes>

      </div>
    </div>
  )
}

export default App
