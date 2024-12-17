import {createContext, useEffect, useState} from 'react';
// import { food_list } from '../assets/assets';
import axios from 'axios'

export const StoreContext = createContext(null);

const StoreContextProvider = (props) => {

    const [CartItem,SetCartItem] = useState({});

    //This is backend url set
    const url = 'http://localhost:4000'


    //This is my token function
    const [token,setToken] =useState("")

    //This is food_list function
    const [food_list,setFoodList] = useState([]);

    //This is my add and remove item function
    const addToCart = async (itemId) => {
        if(!CartItem[itemId]) {
            SetCartItem((prev)=>({...prev,[itemId]:1}))
        }
        else {
            SetCartItem((prev)=>({...prev,[itemId]:prev[itemId]+1}))
        }
        if (token) {
            await axios.post(url+"/api/cart/add",{itemId},{headers:{token}})
        }
    }

    const removeFromCart = async (itemId) => {
        SetCartItem((prev)=>({...prev,[itemId]:prev[itemId]-1}))
        if (token) {
            await axios.post(url+"/api/cart/remove",{itemId},{headers:{token}})
            
        }
    }

    // useEffect(()=>{
    //     console.log(CartItem);
    // },[CartItem])



    //This is function of add amount
    const getTotalCartAmount = ()=>{
        let totalAmount = 0;
        for(const item in CartItem)
        {
            if(CartItem[item]>0){
                let itemInfo = food_list.find((product)=>String(product._id) === String(item));
                if(itemInfo){
                  totalAmount += itemInfo.price* CartItem[item];
                }
            }
        }
        return totalAmount;
    }

    // here fetch the food 
    const fetchFoodList = async () => {
        const response = await axios.get(url+"/api/food/list");
        setFoodList(response.data.data)
    }

    //loadcart function

    const loadCartData = async (token) => {
        const response = await axios.post(url+"/api/cart/get",{},{headers:{token}})
        SetCartItem(response.data.cartData);
    }

    //when i refresh my page not logout this is function 
    useEffect(()=>{
       async function loadData() {
            await fetchFoodList();
            if (localStorage.getItem("token")) {
                setToken(localStorage.getItem("token"));
                await loadCartData(localStorage.getItem("token"));
            }
        }
        loadData();
    },[])

    //This is my pass function
    const contextValue = {
        food_list,
        CartItem,
        SetCartItem,
        addToCart,
        removeFromCart,
        getTotalCartAmount,
        url,
        token,
        setToken

    }

    return (
        <StoreContext.Provider value={contextValue}>
        {props.children}
        </StoreContext.Provider>
    )
}

export default StoreContextProvider;

