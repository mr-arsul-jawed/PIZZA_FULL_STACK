import React, { useContext, useEffect, useState } from 'react';
import '../css/PlaceOrder.css';
import { StoreContext } from '../context/StoreContext';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

function PlaceOrder() {
  const navigate = useNavigate();
  const { getTotalCartAmount, token, food_list, CartItem, url } = useContext(StoreContext);

  const [data, setData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    street: '',
    city: '',
    state: '',
    zipcode: '',
    country: '',
    phone: '',
  });

  const [isLoading, setIsLoading] = useState(false); // New state to manage button loading

  const onChangeHandler = (event) => {
    const { name, value } = event.target;
    setData((prevData) => ({ ...prevData, [name]: value }));
  };

  // Load Razorpay script
  const loadRazorpayScript = () =>
    new Promise((resolve) => {
      const script = document.createElement('script');
      script.src = 'https://checkout.razorpay.com/v1/checkout.js';
      script.onload = () => resolve(true);
      script.onerror = () => resolve(false);
      document.body.appendChild(script);
    });

  const placeOrder = async (event) => {
    event.preventDefault();
    setIsLoading(true);
    try {
      // Prepare order items
      const orderItems = food_list
        .filter((item) => CartItem[item._id] > 0)
        .map((item) => ({ ...item, quantity: CartItem[item._id] }));
      const orderData = {
        address: data,
        items: orderItems,
        amount: getTotalCartAmount() + 2,
      };

      // Step 1: Place the order on your backend and get Razorpay order details
      const response = await axios.post(`${url}/api/order/place`, orderData, {
        headers: { token },
      });

      // Step 2: Handle the payment response
      if (response.data.success) {
        const { razorpayOrderId, amount, key } = response.data;

        // Load Razorpay script
        const isScriptLoaded = await loadRazorpayScript();
        if (!isScriptLoaded) {
          alert('Razorpay SDK failed to load. Please try again.');
          setIsLoading(false);
          return;
        }

        // Step 3: Set up Razorpay options
        const options = {
          key,
          amount: amount*84 * 100, // Convert to paisa (INR)
          currency: 'INR',
          name: 'Pizza Delivery',
          description: 'Order Payment',
          order_id: razorpayOrderId,
          handler: async (paymentResponse) => {
            const { orderId, success } = paymentResponse;
            await axios.post(`${url}/api/order/verify`, { orderId, success: "true" }); // Send verification to backend
            navigate(`/verify?success=true&orderId=${response.data.orderId}`);
          },
          prefill: {
            name: `${data.firstName} ${data.lastName}`,
            email: data.email,
            contact: data.phone,
          },
          theme: { color: '#3399cc' },
        };
        const rzp = new window.Razorpay(options);

        rzp.on('payment.failed', async (response) => {
          try {
            // await axios.post(`${url}/api/order/verify`, { orderId: razorpayOrderId, success:false }); // Send verification to backend
            await axios.post(`${url}/api/order/verify`, {
              orderId: options.order_id, // Use options.order_id here
              success: false,
            });
            alert(`Payment failed: ${response.error.description}`);
            navigate("/"); // Redirect to home on failure
            
          } catch (error) {
            console.error("Payment failure reporting error:", error);
          } finally {
            setIsLoading(false); // Ensure loading state is reset
          }
        
        });

        // Step 4: Open Razorpay checkout
        rzp.open();
      } else {
        alert('Error placing order. Please try again.');
      }
    } catch (error) {
      // console.error('Error placing order:', error);
      alert('An error occurred while placing your order. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(()=>{
    if(!token) {
      navigate('/cart')
    }
    else if(getTotalCartAmount()===0) 
    {
      navigate('/cart')

    }
  },[token])

  
  // Here: Start HTML code
  return (
    <form onSubmit={placeOrder} className="place-order">
      <div className="place-order-left">
        <p className="title">Delivery Information</p>
        <div className="multi-fields">
          <input
            required
            name="firstName"
            onChange={onChangeHandler}
            value={data.firstName}
            type="text"
            placeholder="First name"
          />
          <input
            required
            name="lastName"
            onChange={onChangeHandler}
            value={data.lastName}
            type="text"
            placeholder="Last name"
          />
        </div>
        <input
          required
          name="email"
          onChange={onChangeHandler}
          value={data.email}
          type="email"
          placeholder="Email address"
        />
        <input
          required
          name="street"
          onChange={onChangeHandler}
          value={data.street}
          type="text"
          placeholder="Street"
        />
        <div className="multi-fields">
          <input
            required
            name="city"
            onChange={onChangeHandler}
            value={data.city}
            type="text"
            placeholder="City"
          />
          <input
            required
            name="state"
            onChange={onChangeHandler}
            value={data.state}
            type="text"
            placeholder="State"
          />
        </div>
        <div className="multi-fields">
          <input
            required
            name="zipcode"
            onChange={onChangeHandler}
            value={data.zipcode}
            type="text"
            placeholder="Zip code"
          />
          <input
            required
            name="country"
            onChange={onChangeHandler}
            value={data.country}
            type="text"
            placeholder="Country"
          />
        </div>
        <input
          required
          name="phone"
          onChange={onChangeHandler}
          value={data.phone}
          type="text"
          placeholder="Phone"
        />
      </div>

      <div className="place-order-right">
        <div className="cart-total">
          <h2>Cart Totals</h2>
          <div className="cart-total-details">
            <p>Subtotal</p>
            <p>${getTotalCartAmount()}</p>
          </div>
          <hr />
          <div className="cart-total-details">
            <p>Delivery fee</p>
            <p>${getTotalCartAmount() === 0 ? 0 : 2}</p>
          </div>
          <hr />
          <div className="cart-total-details">
            <b>Total</b>
            <b>${getTotalCartAmount() === 0 ? 0 : getTotalCartAmount() + 2}</b>
          </div>
          <button type="submit" disabled={isLoading}>
            {isLoading ? 'Processing...' : 'Proceed To Payment'}
          </button>
        </div>
      </div>
    </form>
  );
}

export default PlaceOrder;
