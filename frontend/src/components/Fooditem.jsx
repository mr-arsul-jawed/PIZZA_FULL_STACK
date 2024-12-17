import React, { useContext } from 'react'
import '../css/Fooditem.css'
import { assets } from '../assets/assets'
import { StoreContext } from '../context/StoreContext'

function Fooditem({id,name,price,description,image}) {
    const {CartItem,addToCart,removeFromCart,url} = useContext(StoreContext);

    // console.log("Fooditem ID:", id);
  return (
    <div className='food-item'>
        <div className="food-item-img-container">
            <img className="food-item-image" 
            src={url+"/images/"+image} 
            alt={image} />
            {!CartItem[id]?
            <img className='add' onClick={()=>addToCart(id)} src={assets.add_icon_white} alt="Add to cart" />
             :<div className="food-item-counter">
                <img onClick={()=>removeFromCart(id)} src={assets.remove_icon_red} alt=" " />
                <p>{CartItem[id]}</p>
                <img onClick={()=>addToCart(id)} src={assets.add_icon_green} alt=" " />
             </div>
            }
        </div>
        <div className="food-item-info">
            <div className="food-item-name-rating">
                <p>{name}</p>
                <img src={assets.rating_starts} alt="" />
            </div>
            <p className='food-item-desc'>{description}</p>
            <p className="food-item-price">${price}</p>
        </div>
      
    </div>
  );
}

export default Fooditem;
