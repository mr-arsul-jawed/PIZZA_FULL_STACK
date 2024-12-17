import React, { useContext, useEffect, useState } from 'react'
import '../css/MyOrders.css'
import { StoreContext } from '../context/StoreContext';
import axios from 'axios';
import { assets } from '../assets/assets';

function MyOrders() {
    
   const{url,token} = useContext(StoreContext);
   const[data,setData] = useState([]);

   
   const fetchOrders = async ()=> {
    const response = await axios.post(url+"/api/order/userorders",{},{headers:{token}});
    setData(response.data.data);
}
useEffect(()=>{
    if (token) {
        fetchOrders();
    }

   },[token])
return (
    <div className='my-orders'>
        <h2>My Orders</h2>
        <div className="container">
            {data.map((order,index)=>{
                return(
                    <div key={index} className='my-orders-order'>
                        <img src={assets.parcel_icon} alt="" />
                        <p>{order.items.map((item,index)=>{
                            if (index === order.items.length-1 ) {
                                return item.name+" x "+item.quantity
                            }
                            else {
                                return item.name+" x "+item.quantity+", "
                            }
                        })}</p>
                        <p>${order.amount}.00</p>
                        <p>Items:{order.items.length}</p>
                        <p><span>&#x25cf;</span> <b>{order.status}</b><br></br>{order.status === 'Out For Delivery' && (<img id='out-of-delivery' src={assets.out_of_delivery} alt="Out Of Delivery" />)} {order.status === 'Food Processing' && (<img id='Food-Processing' src={assets.food_processing} alt="Food Processing" />)} {order.status === 'Delivered' && (<img id='Delivered' src={assets.food_delivery} alt="Delivered" />)} </p>
                        <button onClick={fetchOrders}>Track Order</button>
                    </div>
                )
            })}
        </div>
      
    </div>
  )
}

export default MyOrders
