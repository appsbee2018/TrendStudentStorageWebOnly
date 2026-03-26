/**
 * @author Tyler Marois
 * @description The overview of the order page
 */
import React, { useEffect, useState } from "react";
import { useCookies } from "react-cookie";
import APIpath from "../../../apipath";
import { useNavigate } from "react-router";
import dateFormat from "../../../dateformat";

const Review = ({ order, setOrder, isArriveEarly, setIsArriveEarly}) => {
    const [cartItems, setCartItems] = useState(order.inventory?.length > 0 ? order.inventory : []);
    
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
        <div className="flex gap-5 w-full flex-grow overflow-y-auto">
            <div className="flex flex-col w-1/2 flex-grow gap-5  bg-background-200 rounded-md overflow-hidden">
                <h2 className="text-3xl font-hind font-semibold w-full bg-tertiary p-1 bg-opacity-50">Cart</h2>

                <div className="flex flex-col w-full flex-grow overflow-y-auto p-3 gap-3">
                    {cartItems.map((item, index) => {
                        return <CartItem item={item} key={index} />
                    })}
                </div>

                <div className="w-full bg-background-300 p-2 flex justify-between">
                    <h2>Subtotal: ${getPriceTotal()}</h2>
                    <h2>Volume: {getVolumeTotal()}ft&sup3;</h2>
                </div>
            </div>

            <div className="flex flex-col p-5 justify-between w-1/2">
                <div  className={`cursor-pointer rounded-md flex h-fit flex-col w-fit justify-center items-center text-xl gap-3 bg-background-200 border-2  border-background-300 drop-shadow-lg p-5 ${order.groupID === order.group.id ? "scale-100 border-primary" : null}`}>
                    <div className="w-full flex justify-between px-2 gap-10">
                        <h3>Group</h3>
                        <h3>{order.group.name}</h3>
                    </div>

                    <div className="w-full flex justify-between px-2 gap-10">
                        <h3>Pickup</h3>
                        <h3>{dateFormat(order.group.pickup)}</h3>
                    </div>

                    <div className="w-full flex justify-between px-2 gap-10">
                        <h3>Dropoff</h3>
                        <h3>{dateFormat(order.group.dropoff)}</h3>
                    </div>

                    <div className="flex gap-5">
                        <h2>Capacity</h2>
                        <input type="range" disabled value={order.group.volume/order.group.capacity} id="" />
                        <h2>{((order.group.volume/order.group.capacity) * 100).toFixed(2)}%</h2>
                    </div>

                </div>
                
                {/* 2. Updated Radio Button Section */}
                <div className="mt-6 mb-4 p-4 bg-background-200 rounded-md border border-background-300">
                    <h2 className="text-2xl font-hind font-semibold mb-2">Will you arrive back on campus early?</h2>
                    <div className="flex gap-10 text-xl">
                        <label className="flex items-center gap-2 cursor-pointer">
                            <input 
                                type="radio" 
                                name="ArriveEarly" 
                                value="Yes" 
                                checked={isArriveEarly === "Yes"}
                                onChange={(e) => setIsArriveEarly(e.target.value)}
                                className="w-5 h-5 accent-primary"
                            />
                            Yes
                        </label>
                        <label className="flex items-center gap-2 cursor-pointer">
                            <input 
                                type="radio" 
                                name="ArriveEarly" 
                                value="No" 
                                checked={isArriveEarly === "No"}
                                onChange={(e) => setIsArriveEarly(e.target.value)}
                                className="w-5 h-5 accent-primary"
                            />
                            No
                        </label>
                    </div>
                    {isArriveEarly === null && (
                        <p className="text-red-500 text-sm mt-1">* Selection required to proceed</p>
                    )}
                </div>

                <div className="bg-background-200 p-2 w-full h-1/2 rounded-md shadow-xl  border border-background-300 overflow-y-auto">
                    <h2 className="text-2xl font-hind font-semibold">Details</h2>

                    <p className="w-4/5">
                        Upon clicking next your order will be submitted and you will recieve an email with your barcode labels,
                        It is very important that your labels are put onto your items very clearly for storage purposes.
                        <br /><br />
                        If your item doesn't have a good spot to put the whole label please clearly write the item ID onto your item with tape.

                        
                    </p>
                </div>
            </div>



        </div>
    )
}

const CartItem = ({ item }) => {

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

        </div>
    )
}

export default Review;