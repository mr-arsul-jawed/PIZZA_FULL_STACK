import orderModel from "../models/orderModel.js";
import userModel from "../models/userModel.js";
import Razorpay from "razorpay";

// Set up Razorpay
const razorpay = new Razorpay({
  key_id: process.env.RAZORPAY_KEY_ID,
  key_secret: process.env.RAZORPAY_SECRET_KEY,
});

// Placing user order and creating Razorpay payment order
const placeOrder = async (req, res) => {
  try {
    const { userId, items, amount, address } = req.body;

    // Save the order in the database
    const newOrder = new orderModel({ 
      userId,
      items,
      amount,
      address,
    });
    await newOrder.save();

    // Clear user's cart data after placing the order
    await userModel.findByIdAndUpdate(userId, { cartData: {} });

    // Create Razorpay Order
    const options = {
      amount: amount *84*100, // Amount in paise (INR), use original amount if conversion is not needed
      currency: "INR",
      receipt: `order_${newOrder._id}`,
      payment_capture: 1,
    };

    const razorpayOrder = await razorpay.orders.create(options);

    // Send the Razorpay Order ID to the frontend for payment
    res.json({
      success: true,
      orderId: newOrder._id,
      razorpayOrderId: razorpayOrder.id,
      amount, // Send original amount instead of recalculating
      key: process.env.RAZORPAY_KEY_ID, // Send public key to frontend
    });
  } catch (error) {
    console.error("Error placing the order:", error);
    res.status(500).json({ success: false, message: "Error placing the order" });
  }
};

// Verify Payment and Update Order
const verifyOrder = async (req, res) => {
  const { orderId, success } = req.body;
  try {
    if (success === "true") {
      await orderModel.findByIdAndUpdate(orderId, { payment: true });
      res.json({ success: true, message: "Payment successful. Order has been updated." });
    } else {
      await orderModel.findByIdAndDelete(orderId);
      res.json({ success: false, message: "Payment failed. Order has been canceled." });
    }
  } catch (error) {
    console.error("Error verifying payment:", error);
    res.status(500).json({ success: false, message: "Error processing payment" });
  }
}

//user orders for frontend

const userOrders = async (req,res)=> {
  try {
      console.log("Fetching orders for user:", req.body.userId);
      const orders = await orderModel.find({userId:req.body.userId});
      res.json({success:true,data:orders})
  } catch (error) {
    console.log(error)
    res.json({success:false,message:Error})
    
  }

}

// List orders for admin panel
const listOrders = async (req,res) => {
  try {
    const orders = await orderModel.find({});
    res.json({success:true,data:orders})
  } catch (error) {
    console.log(error);
    res.json({success:false,message:"Error"})
    
    
  }
     
}

//api for updating order status

const updateStatus = async (req,res) =>{
    try {
        await orderModel.findByIdAndUpdate(req.body.orderId,{status:req.body.status});
        res.json({success:true,message:"Status Updated"})
    } catch (error) {
      console.log(error);
      res.json({success:false,message:"Error"})
      
      
    }
}

export { placeOrder, verifyOrder, userOrders, listOrders,updateStatus};

