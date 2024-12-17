// import React, { useState } from 'react';
// import '../css/Navbar.css';
// import {assets} from '../assets/assets';

// function Navbar ()  {
//     const [menu,setMenu] = useState("Home");
//   return (

//     <div className='navbar'>
//        <img src={assets.logo} alt="logo" className="logo" />
//        <ul className="navbar-menu">
//         <li onClick={()=> setMenu("Home")} className={menu === "Home" ? "active": ""}>Home</li>
//         <li onClick={()=> setMenu("menu")} className={menu ==="menu" ? "active": ""}>Menu</li>
//         <li onClick={()=> setMenu("mobile-app")} className={menu === "mobile-app" ? "active": ""}>mobile-app</li>
//         <li onClick={()=> setMenu("contact-us")} className={menu === "contact-us" ? "active": ""}>contact-us</li>
//        </ul>
//       <div className="navbar-right">
//         <img src={assets.search_icon} alt="" />
//         <div className="navrbar-search-icon">
//             <img src={assets.basket_icon} alt="" />
//             <div className="dot"></div>
//         </div>
//         <button>sign in</button>
//       </div>
//     </div>
//   )
// }

// export default Navbar

import React, { Profile, useContext, useState } from 'react';
import '../css/Navbar.css';
import { assets } from '../assets/assets';
import { Link, useNavigate } from 'react-router-dom';
import { StoreContext } from '../context/StoreContext';

function Navbar({setShowLogin}) {

  const [menu, setMenu] = useState("Home");

  const{getTotalCartAmount, token,setToken } = useContext(StoreContext);

  //this is my navigate function
  const navigate = useNavigate();

   
  //this is my logout function
  const logout = ()=>{
    localStorage.removeItem("token");
    setToken("");
    navigate("/");

  }

  return (
    <div className='navbar'>
    <Link to='/'><img id='logo' src={assets.logo} alt="logo" className="logo" /></Link> 
      <ul className="navbar-menu">
        <Link to="/" onClick={() => setMenu("Home")} className={menu === "Home" ? "active" : ""}>Home</Link>
        {/* <a href='#explore-menu' onClick={() => setMenu("menu")} className={menu === "menu" ? "active" : ""}>Menu</a> */}
        {/* <a href='#app-download' onClick={() => setMenu("mobile-app")} className={menu === "mobile-app" ? "active" : ""}>Mobile App</a> */}
        <a href='#footer' onClick={() => setMenu("contact-us")} className={menu === "contact-us" ? "active" : ""}>Contact Us</a>
      </ul>
      <div className="navbar-right">
        {/* <img src={assets.search_icon} alt="search" /> */}
        {/* <div className="navbar-search-icon">
          <Link to='./cart'><img src={assets.basket_icon} alt="basket" /></Link>
          <div className={getTotalCartAmount()===0?"":"dot"}></div>
        </div> */}
        {!token?<button onClick={()=>setShowLogin(true)}>Sign In</button>
        :<div className='navbar-profile'>
           <img src={assets.profile_icon} alt="" />
          <ul className="nav-profile-dropdown">
            <li onClick={()=>navigate('/myorders')}><img src={assets.bag_icon} alt=""/><p>Orders</p></li>
            <hr/>
            <li onClick={logout}><img src={assets.logout_icon} alt=""/><p>Logout</p></li>
          </ul>
          
          </div>}
        
      </div>
    </div>
  );
}

export default Navbar;
