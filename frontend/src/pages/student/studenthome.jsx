/**
 * @author Tyler Marois
 * @description The students home page
 */
import React, { useEffect, useState } from "react";
import { useCookies } from "react-cookie";
import APIpath from "../../apipath";
import { useNavigate } from "react-router";
import dateFormat from "../../dateformat";

const StudentHome = () => {

    return (
        <div className="w-full h-full mx-10 mb-10 overflow-y-auto">
            <div className="w-full my-10 border-b-2 border-black border-opacity-20">
                <h1 className=" font-hind font-semibold text-5xl text-primary">Home</h1>
            </div>

            <div className="grid grid-cols-4 grid-rows-4 gap-5  w-full h-full ">
                <Orders />
            </div>
        </div>
    )
}

const Orders = () => {
    const [cookies] = useCookies(['user', 'session']);
    const [orders, setOrders] = useState([]);
    const navigator = useNavigate();

    useEffect(() => {
        getOrders();
    }, []);

    const getOrders = async() => {
        try {
            const body = {
                userID: cookies.user.id
            }
            
            const req = await fetch(`${APIpath}/order/getorders`, {
                method: 'POST',
                headers: {
                    'Accept': 'application/json',
                    'Content-Type': 'application/json',
                    'authorization': `bearer ${cookies.session}`
                },
                body: JSON.stringify(body)
            });

            const res = await req.json();

            setOrders(res.orders);
        } catch (error) {
            console.log(error.message);
        }
    }


    return (
        <div className="flex flex-col col-span-2 row-span-2 justify-start items-center rounded-md shadow-xl bg-background-200 border-2 border-black border-opacity-5 ">
            <div className="w-full flex items-center justify-between p-5 border-b-2 border-black border-opacity-5">
                <h1 className="text-3xl font-hind font-semibold">Orders</h1>
                <button onClick={() => navigator("/studentdashboard/createorder")} className="bg-secondary text-white rounded-md p-1">Create Order</button>
            </div>

            {orders?.length > 0 ? <table className="w-full divide-y-4 ">
                <thead>
                    <tr className="">
                        <th>Group</th>
                        <th>Cost</th>
                        <th>Volume</th>
                        <th>Dropoff</th>
                        <th>Pickup</th>
                        <th>Location</th>
                    </tr>
                </thead>
                <tbody className=" ">
                    {orders.map((order, index) => {
                        return <Order key={index} order={order} />
                    })}
                </tbody>
                
            </table> 
            : 
            <div className="h-full flex justify-center items-center opacity-30 text-xl">
                <h2>No orders found, please click the button to make a new one</h2>
            </div>
            }
        </div>
    )
}

const Order = ({ order, index }) => {
    const [cookies] = useCookies(['user', 'session']);
    const [totals, setTotals] = useState({});
    const navigator = useNavigate();

    useEffect(() => {
        getTotals();
    }, []);

    const getTotals = async() => {
        try {
            const body = {
                orderID: order.id
            }
            
            const req = await fetch(`${APIpath}/order/getorderitemsandtotals`, {
                method: 'POST',
                headers: {
                    'Accept': 'application/json',
                    'Content-Type': 'application/json',
                    'authorization': `bearer ${cookies.session}`
                },
                body: JSON.stringify(body)
            });

            const res = await req.json();

            setTotals(res.totals);
            
        } catch (error) {
            console.log(error.message);
        }
    }

    
    
    return (
        <tr onClick={() => navigator(`/studentdashboard/order/${order.id}`)} key={index} className="text-center hover:shadow-xl hover:bg-secondary hover:bg-opacity-25 hover:cursor-pointer divide-x-4">
            <td className="py-2 my-2">{order.name}</td>
            <td className="py-2 my-2">${totals.cost}</td>
            <td className="py-2 my-2">{totals.volume}ft&sup3;</td>
            <td>{dateFormat(order.pickup)}</td>
            <td>{dateFormat(order.dropoff)}</td>
            <td>{order.location}</td>
        </tr>
    )
}

export default StudentHome;