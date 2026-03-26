/**
 * @author Tyler Marois
 * @description The overview of the order page
 */
import React, { useEffect, useState } from "react";
import { useCookies } from "react-cookie";
import APIpath from "../../apipath";
import { useNavigate, useParams } from "react-router";
import { AgGridReact } from 'ag-grid-react';
import { AllCommunityModule, ModuleRegistry } from 'ag-grid-community'; 
import myToast from "../../myToast";
import { toast } from "react-toastify";
import dateFormat from "../../dateformat";

ModuleRegistry.registerModules([AllCommunityModule]);

const Order = () => {
    const navigator = useNavigate();
    const [cookies] = useCookies(['user', 'session']);
    const { orderID } = useParams();
    const [order, setOrder] = useState({});
    const [orderDetails, setOrderDetails] = useState({});
    const [inventory, setInventory] = useState([]);
    const [group, setGroup] = useState({});
    const [cost, setCost] = useState(null);
    const [volume, setVolume] = useState(null);
    const [inventoryHeaders, setInventoryHeaders] = useState([
        { field: "name", flex: 1, filter: true, headerName: "Item Name"},
        { field: "price", flex: 1, filter: true, headerName: "Price" },
        { field: "cubic_feet", flex: 1, filter: true, headerName: "Cubic Feet" },
        { field: "id", flex: 1, filter: true, headerName: "Unit ID" },
    ]);
    
    useEffect(() => {
        getOrder();
    }, [])

    useEffect(() => {
        getTotals();
    }, [inventory])

    const getOrder = async () => {
        try {
            const body = {
                orderID: Number(orderID)
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


            if(req.status === 200 && res.orders[0].user_id === cookies.user.id) {
                setOrder(res);
                getItems();
                getGroup(res.orders[0].group_id);
                setOrderDetails(res.orders[0])
            } else {
                navigator('/studentdashboard/home');
                myToast("This is not your order!", 1);
            }
 
        } catch (error) {
            console.log(error.message);
        }
    }

    const getItems = async () => {
        try {
            const body = {
                orderID: orderID
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


            if(req.status === 200) {
                setInventory(res.items);
            }
 
        } catch (error) {
            console.log(error.message);
        }
    }

    const getGroup = async (groupID) => {
        try {
            const body = {
                groupID: groupID
            }

            const req = await fetch(`${APIpath}/order/getgrouptotals`, {
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
                setGroup(res);
                
            }
 
        } catch (error) {
            console.log(error.message);
        }
    }

    const getTotals = () => {
        let cubicFeet = 0;
        let price = 0;
        inventory.forEach(item => {
            price += Number(item.price);
            cubicFeet += Number(item.cubic_feet);
        });
        
        setCost(price)
        setVolume(cubicFeet)
    }

    const checkDate = () => {
        if(!group.group) {
            return
        }

        const dateNoTime = group.group?.pickup.split("T")[0]
        const [year, month, day] = dateNoTime?.split("-");
        
    

        const todaysDate = new Date();
        const dropoffDate = new Date(year, month-1, day);

        todaysDate.setHours(0, 0, 0, 0);
        dropoffDate.setHours(0, 0, 0, 0);
        
        return dropoffDate >= todaysDate
    }

    const downloadLabels = async () => {
        try {
            const body = {
                orderID: orderDetails.id
            }

            

            const response = await fetch(`${APIpath}/order/downloadlabels`, {
                method: 'POST',
                headers: {
                    'Accept': 'application/json',
                    'Content-Type': 'application/json',
                    'authorization': `bearer ${cookies.session}`
                },
                body: JSON.stringify(body)
            });
            const pdfBlob = await response.blob();

            const link = document.createElement('a');
            link.href = URL.createObjectURL(pdfBlob);
            link.setAttribute('download', `${cookies.user.name}_labels.pdf`);

            document.body.appendChild(link);

            link.click();

            link.parentNode.removeChild(link);
            URL.revokeObjectURL(link.href);

            
        } catch (error) {
            console.log(error.message);
        }
    }

    const deleteOrder = () => {
        toast(<DeleteOrder />, {
            position: "top-right",
            hideProgressBar: true,
            pauseOnHover: false,
            draggable: false,
            progress: undefined,
            theme: "light",
            autoClose: 20000,
            data: {order: order.orders[0], navigator: navigator}
        })
    }

    return (
        <div className="flex gap-5 w-full flex-grow overflow-y-auto">
            <div className="flex flex-col w-1/2 h-4/5 gap-5  bg-background-200 rounded-md overflow-hidden m-5">
                <h2 className="text-3xl font-hind font-semibold w-full bg-secondary p-1 bg-opacity-50">Cart</h2>

                <div className="flex flex-col w-full h-full overflow-y-auto p-3 gap-3">
                    <AgGridReact 
                        rowData={inventory}
                        columnDefs={inventoryHeaders}
                        pagination={true}
                    />
                </div>

                <div className="w-full bg-background-300 p-2 flex justify-between">
                    <h2>Subtotal: ${cost}</h2>
                    <h2>Volume: {volume}ft&sup3;</h2>
                </div>
            </div>

            <div className="flex flex-col p-5 justify-start w-1/2">
                <div className="flex justify-evenly text-white gap-5 px-5 mb-5">
                    <button onClick={() => downloadLabels()} className="p-1 bg-secondary flex-grow rounded-md">Download Labels</button>
                    {checkDate() ? <button onClick={() => navigator(`/studentdashboard/order/updateorder/${orderID}`)} className="p-1 bg-tertiary flex-grow rounded-md">Update Order</button> : null}
                    {checkDate() ? <button onClick={() => deleteOrder()} className="p-1 bg-red-600 flex-grow rounded-md">Delete Order</button> : null}
                </div>


                <div  className={`cursor-pointer w-full rounded-md flex h-fit flex-col justify-center items-center text-xl gap-3 bg-background-200 border-2  border-background-300 drop-shadow-lg p-5 `}>
                    <div className="w-full flex justify-between px-2 gap-10">
                        <h3>Group</h3>
                        <h3>{group.group?.name}</h3>
                    </div>

                    <div className="w-full flex justify-between px-2 gap-10">
                        <h3>Pickup</h3>
                        <h3>{dateFormat(group.group?.pickup)}</h3>
                    </div>

                    <div className="w-full flex justify-between px-2 gap-10">
                        <h3>Dropoff</h3>
                        <h3>{dateFormat(group.group?.dropoff)}</h3>
                    </div>

                    <div className="w-full flex justify-between px-2 gap-10">
                        <h3>Location</h3>
                        <h3>{orderDetails.location}</h3>
                    </div>

                    <div className="w-full flex justify-between px-2 gap-10">
                        <h3>Will you arrive back on campus early?</h3>
                        <h3 className={`text-2xl font-hind font-semibold mb-2 ${
                            orderDetails.isarriveearly === 'Yes' 
                            ? 'text-green-700' 
                            : orderDetails.isarriveearly === 'No' 
                                ? 'text-red-600' 
                                : 'text-gray-500'
                        }`}>
                            {orderDetails.isarriveearly ? orderDetails.isarriveearly.toUpperCase() : "Not Selected"}
                        </h3>
                    </div>

                    <div className="w-full flex justify-between px-2 gap-10">
                        <h2>Capacity</h2>
                        <input className="w-full" type="range" disabled value={group.totals?.volume/group.group?.capacity} id="" />
                        <h2>{((group.totals?.volume/group.group?.capacity) * 100).toFixed(2)}%</h2>
                    </div>

                </div>

                
            </div>

        </div>
    )
}


const DeleteOrder = ({ data, closeToast }) => {
    const [cookies] = useCookies(['user', 'session']);
    
    const deleteOrder = async () => {
        try {
            const body = {
                orderID: data.order.id
            }

            const req = await fetch(`${APIpath}/order/deleteorder`, {
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
                myToast(res, 2);
                closeToast();
                data.navigator('/studentdashboard/home');
            } else {
                myToast(res, 1);
            }
            
            
        } catch (error) {
            console.log(error.message);
            myToast('Error Deleting Order', 1);
        }
    }

    return (
        <div className="w-full flex flex-col gap-5 text-lg">
            <h2>Are you sure you'd like to delete this order?</h2>
            <button onClick={() => deleteOrder()} className="duration-300 hover:bg-red-400 hover:scale-105">Yes</button>
            <button onClick={() => closeToast()} className="duration-300 hover:bg-background-300 hover:scale-105">No</button>
        </div>
    )
}

export default Order;