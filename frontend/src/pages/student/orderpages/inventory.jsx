/**
 * @author Tyler Marois
 * @description The page where users actually select their inventory
 */
import React, { useEffect, useState } from "react";
import { useCookies } from "react-cookie";
import APIpath from "../../../apipath";
import { useNavigate } from "react-router";
import Input from "../../../components/input";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faTrashAlt } from "@fortawesome/free-solid-svg-icons";

const Inventory = ({ order, setOrder }) => {
    const [cookies] = useCookies(['user', 'session']);
    const [inventoryItems, setInventoryItems] = useState([]);
    const [filteredInventory, setFilteredInventory] = useState([]);
    const [search, setSearch] = useState("");
    const [cartItems, setCartItems] = useState(order.inventory?.length > 0 ? order.inventory : []);

    useEffect(() => {
        getInventoryItems();
    }, [])

    useEffect(() => {
        setFilteredInventory(inventoryItems.filter((item) => item.name.toLowerCase().includes(search.toLowerCase())));
    }, [search, inventoryItems]);

    useEffect(() => {
        setInventoryItems(inventoryItems.filter((item) => 
            !cartItems.some(cartItem => cartItem.id === item.id)
        ));

        setOrder(prevOrder => ({ ...prevOrder, inventory: cartItems }));
        
    }, [cartItems]);

    const updateCart = (item) => {
        const itemWithQuantity = { ...item, quantity: 1 };

        setCartItems([...cartItems, itemWithQuantity]);
    }

    const getInventoryItems = async() => {
        try {
            const req = await fetch(`${APIpath}/managersettings/getitems`, {
                method: 'GET',
                headers: {
                    'Accept': 'application/json',
                    'Content-Type': 'application/json',
                    'authorization': `bearer ${cookies.session}`
                }
            });
            
            const res = await req.json();
            
            setInventoryItems(res.filter((item) => 
                !cartItems.some(cartItem => cartItem.id === item.id)
            ));

            setFilteredInventory(res.filter((item) => 
                !cartItems.some(cartItem => cartItem.id === item.id)
            ));

            
        } catch (error) {
            console.log(error.message);
        }
    }

    const updateCartQuantity = (itemID, quantity) => {
        setCartItems(prevItems => 
            prevItems.map(item =>
                item.id === itemID ? { ...item, quantity } : item
            )
        );
    }

    const deleteFromCart = (cartItem) => {
        setCartItems([])
        setCartItems(cartItems.filter((item) => item.id !== cartItem.id));
        setInventoryItems([...inventoryItems, cartItem])
        
    }

    const getPriceTotal = () => {
        let total = 0;
        cartItems.forEach(item => {
            total += item.price * item.quantity;
        });
        
        return total;
    }

    const getVolumeTotal = () => {
        let total = 0;
        cartItems.forEach(item => {
            total += item.cubic_feet * item.quantity;
        });
        
        return total;
    }

    return (
        <div className="flex gap-5 w-full flex-grow overflow-y-auto pt-5">
            <div className="flex flex-col w-1/2 flex-grow  bg-background-200 rounded-md overflow-hidden">
                <div className="w-full bg-secondary p-1 bg-opacity-35 flex">
                    <h2 className="text-3xl font-hind font-semibold w-4/5">Available Items</h2>
                    <Input placeholder={"Search..."} value={search} onChange={setSearch} type={"text"} />
                </div>

                <div className="grid grid-cols-4 items-start justify-start w-full h-full overflow-y-auto p-3 gap-3 flex-wrap">
                    {filteredInventory.map((item, index) => {
                        return <InventoryItem item={item} updateCart={updateCart} index={index} key={index} />
                    })}
                </div>
            </div>

            <div className="flex flex-col w-1/2 gap-5  bg-background-200 rounded-md overflow-hidden">
                <h2 className="text-3xl font-hind font-semibold w-full bg-tertiary p-1 bg-opacity-50">Cart</h2>

                <div className="flex flex-col w-full h-full overflow-y-auto p-3 gap-3">
                    {cartItems.map((item, index) => {
                        return <CartItem updateCartQuantity={updateCartQuantity} item={item}  key={index} deleteFromCart={deleteFromCart} />
                    })}
                </div>

                <div className="w-full bg-background-300 p-2 flex justify-between">
                    <h2>Subtotal: ${getPriceTotal()}</h2>
                    <h2>Volume: {getVolumeTotal()}ft&sup3;</h2>
                </div>
            </div>
        </div>
    )
}

const InventoryItem = ({item, index, updateCart}) => {

    return (
        <div onClick={() => updateCart(item)} className="bg-background-300 flex flex-col flex-nowrap col-span-1 h-fit p-2 rounded-md shadow-lg cursor-pointer hover:scale-105 duration-300">
            <h2 className="text-lg font-hind font-semibold">{item.name}</h2>
            <h2>Price: ${item.price}</h2>
            <h2>Volume: {item.cubic_feet}ft&sup3;</h2>
        </div>
    )
}

const CartItem = ({ item, updateCartQuantity, deleteFromCart }) => {

    return (
        <div className="p-2 flex justify-between rounded-md shadow-lg w-full bg-background-300 items-center">
            <div className=" flex flex-col flex-nowrap w-1/4">
                <h2 className="text-lg font-hind font-semibold">{item.name}</h2>
                <h2>Price: ${item.price}</h2>
                <h2>Volume: {item.cubic_feet}ft&sup3;</h2>
            </div>

            <div className="flex items-center gap-2">
                <h2 className="w-4/5 text-lg">Quantity</h2>
                <input max={30} min={1} type={"number"} value={item.quantity} onChange={(e) => updateCartQuantity(item.id, e.target.value)} className={`border-2 border-opacity-5 shadow-inner focus:outline-none focus:ring-2 w-full focus:ring-secondary focus:ring-opacity-10 bg-background-200 p-1 rounded-md`} />
            </div>

            <div className=" flex flex-col items-end ">
                <h2>Total Price: ${item.price * item.quantity}</h2>
                <h2>Total Volume: {item.cubic_feet * item.quantity}ft&sup3;</h2>
            </div>

            <FontAwesomeIcon onClick={() => deleteFromCart(item)} icon={faTrashAlt} className="text-tertiary pr-2 cursor-pointer" />
        </div>
    )
}

export default Inventory;