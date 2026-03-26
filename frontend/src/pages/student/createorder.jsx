/**
 * @author Tyler Marois
 * @description The order page
 */
import React, { useEffect, useState } from "react";
import { useCookies } from "react-cookie";
import APIpath from "../../apipath";
import { useNavigate } from "react-router";
import OrderOverview from "./orderpages/orderoverview";
import Inventory from "./orderpages/inventory";
import GroupSelection from "./orderpages/groupselection";
import Review from "./orderpages/review";
import Finish from "./orderpages/finish";
import myToast from "../../myToast";
import LocationSelection from "./orderpages/locationselection";
import { toast } from "react-toastify";

const CreateOrder = () => {
    const [cookies] = useCookies(['user', 'session'])
    const [currentPage, setCurrentPage] = useState(0);
    const [order, setOrder] = useState({});

    //Add state to track the football team selection
    const [isArriveEarly, setIsArriveEarly] = useState(null);

    const getPriceTotal = () => {
        let total = 0;
        order.inventory.forEach(item => {
            total += item.price * item.quantity;
        });
        
        return total;
    }
    
    const submitOrder = async() => {
        try {
            const body = {
                userID: cookies.user.id,
                groupID: order.group.id,
                inventory: order.inventory,
                balance: getPriceTotal(),
                location: order.location,
                groupName: order.group.name,
                isArriveEarly: isArriveEarly
            }
            
            const req = await fetch(`${APIpath}/order/createorder`, {
                method: 'POST',
                headers: {
                    'Accept': 'application/json',
                    'Content-Type': 'application/json',
                    'authorization': `bearer ${cookies.session}`
                },
                body: JSON.stringify(body)
            });
            
            const res = await req.json();

            if(req.status === 200) {
                myToast("Order Submitted Successfully", 2);
                console.log(res);
                
                setOrder({ ...order, orderID: res.orderID})
                return true;
            } else {
                myToast(res, 1);
            }
            
        } catch (error) {
            console.log(error.message);
            myToast(error.message, 1);
        }
    }

    const decrementPage = () => {
        switch (currentPage) {
            case 0:
                setCurrentPage(0);
                break;

            case 1:
                setCurrentPage(0);
                break;

            case 2:
                setCurrentPage(1);
                break;

            case 3:
                setCurrentPage(2);
                break;

            case 4: 
                setCurrentPage(3);
                break;
            
            case 5: 
                setCurrentPage(5);
                break;
        
            default:
                setCurrentPage(currentPage)
                break;
        }
    }

    const incrementPage = async() => {
        switch (currentPage) {
            case 0:
                setCurrentPage(1);
                break;

            case 1:
                if(order.inventory?.length > 0) {
                    setCurrentPage(2);
                } else {
                    myToast("Please Select an Item.", 1);
                }
                break;

            case 2:
                if(order.inventory?.length > 0 && order.groupID !== undefined) {
                    setCurrentPage(3);
                } else {
                    myToast("Please Select a Group.", 1);
                }
                break;

            case 3:
                if(order.location?.length > 0) {
                    setCurrentPage(4);
                } else {
                    myToast("Select a location", 1);
                }
                break;

            case 4: 
                const orderResult = await submitOrder();
                if(orderResult) {
                    setCurrentPage(5);
                } 
                break;
        
            default:
                setCurrentPage(currentPage)
                break;
        }
    }

    

    return (
        <div className="flex flex-col w-full h-full min-h-[90vh]  mx-10 justify-center items-center">
            <div className="w-full my-5 border-b-2 border-black border-opacity-20">
                <h1 className=" font-hind font-semibold text-5xl text-primary">Create Order</h1>
            </div>

            <div className="w-full flex items-center gap-5 justify-evenly">
                <OrderStep index={0} setPage={setCurrentPage} name="Overview" currentPage={currentPage} />
                <span className="flex flex-grow h-1 border-dashed border-2 border-secondary"></span>

                <OrderStep index={1} setPage={setCurrentPage} name="Items" currentPage={currentPage} />
                <span className="flex flex-grow h-1 border-dashed border-2 border-secondary"></span>

                <OrderStep index={2} setPage={setCurrentPage} name="Group" currentPage={currentPage} />
                <span className="flex flex-grow h-1 border-dashed border-2 border-secondary"></span>

                <OrderStep index={3} setPage={setCurrentPage} name="Location" currentPage={currentPage} />
                <span className="flex flex-grow h-1 border-dashed border-2 border-secondary"></span>

                <OrderStep index={4} setPage={setCurrentPage} name="Review" currentPage={currentPage} />
                <span className="flex flex-grow h-1 border-dashed border-2 border-secondary"></span>

                <OrderStep index={5} setPage={setCurrentPage} name="Finish" currentPage={currentPage} />
            </div>

            {currentPage === 0 ? <OrderOverview /> : null}
            {currentPage === 1 ? <Inventory order={order} setOrder={setOrder} /> : null}
            {currentPage === 2 ? <GroupSelection order={order} setOrder={setOrder} /> : null}
            {currentPage === 3 ? <LocationSelection order={order} setOrder={setOrder} /> : null}
            {currentPage === 4 ? <Review order={order} setOrder={setOrder} isArriveEarly={isArriveEarly} setIsArriveEarly={setIsArriveEarly} /> : null}
            {currentPage === 5 ? <Finish order={order} /> : null}


            {currentPage !== 5 ? 
                <div className="w-full flex justify-evenly py-2">
                    <button onClick={() => decrementPage() } className="bg-secondary p-1 rounded-md text-white text-xl">Previous</button>
                    {/* <button onClick={() => incrementPage() } className="bg-tertiary p-1 rounded-md text-white text-xl">Next</button> */}

                    <button onClick={() => {
                        
                        if (currentPage === 4 && isArriveEarly === null) {
                            //alert("Please select if you are a member of the football team.");
                            myToast("Please select if you arrive back on campus early?", 1);
                            return;
                        }
                        incrementPage();

                    }} className="bg-tertiary p-1 rounded-md text-white text-xl">Next</button>

                </div>
            :
                null
            }
        </div>
    )
}

const OrderStep = ({ index, setPage, name, currentPage }) => {

    return (
        <div className={`mt-4 flex flex-col justify-center items-center hover:scale-110 duration-300 ${currentPage === index ? "text-primary scale-110" : null}`}>
            {/* <button onClick={() => setPage(index)} className={`text-3xl font-hind font-semibold rounded-full p-3 border-secondary border-2 size-16 text-center bg-background-200 ${currentPage === index ? "border-4" : null}`}>{index+1}</button> */}
            <button  className={`text-3xl font-hind font-semibold rounded-full p-3 border-secondary border-2 size-16 text-center bg-background-200 ${currentPage === index ? "border-4" : null}`}>{index+1}</button>
            
            <h2 className=" font-hind font-semibold text-lg">{name}</h2>
        </div>
    )
}

export default CreateOrder;