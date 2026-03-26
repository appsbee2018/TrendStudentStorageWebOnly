/**
 * @author Tyler Marois
 * @description The manager order viewing page
 */
import React, { useEffect, useState } from "react";
import { useCookies } from "react-cookie";
import APIpath from "../../apipath";
import { useLocation, useNavigate, useParams } from "react-router";
import { AgGridReact } from 'ag-grid-react';
import { AllCommunityModule, ModuleRegistry } from 'ag-grid-community'; 
import myToast from "../../myToast";
import { toast } from "react-toastify";

ModuleRegistry.registerModules([AllCommunityModule]);

const OrderView = () => {
    const location = useLocation();
    const [cookies] = useCookies(['user', 'session']);
    const [order, setOrder] = useState(location.state.order);

    const [items, setItems] = useState([]);
    const [inventoryHeaders, setInventoryHeaders] = useState([
        { field: "name", flex: 1, filter: true, headerName: "Item Name"},
        { field: "price", flex: 1, filter: true, headerName: "Price" },
        { field: "cubic_feet", flex: 1, filter: true, headerName: "Cubic Feet" },
        { field: "id", flex: 1, filter: true, headerName: "Unit ID" },
    ]);
    const [cost, setCost] = useState(null);
    const [volume, setVolume] = useState(null);
    
    useEffect(() => {
        getItems();
    }, []);
    
    const getItems = async () => {
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


            if(req.status === 200) {
                const res = await req.json();
                
                setItems(res.items);
                setCost(res.totals.cost);
                setVolume(res.totals.volume);
            }
 
        } catch (error) {
            console.log(error.message);
        }
    }

    function formatPhoneNumber(input) {
        let value = input.replace(/\D/g, '');
        let formattedNumber = value;
      
        const match = value.match(/^(\d{1,3})(\d{0,3})(\d{0,4})$/);
        if (match) {
          formattedNumber = `(${match[1]}${match[2] ? ') ' : ''}${match[2]}${match[3] ? '-' : ''}${match[3]}`;
        }
        return formattedNumber;
    }

    const downloadLabels = async () => {
        try {
            const body = {
                orderID: order.id
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
            link.setAttribute('download', `${order.name}_labels.pdf`);

            document.body.appendChild(link);

            link.click();

            link.parentNode.removeChild(link);
            URL.revokeObjectURL(link.href);

            
        } catch (error) {
            console.log(error.message);
        }
    }

    const updateBalance = () => {
            console.log("Fwerfg");
            
            toast(<UpdateBalance />, {
                position: "top-right",
                hideProgressBar: true,
                pauseOnHover: false,
                draggable: false,
                progress: undefined,
                theme: "light",
                autoClose: 20000,
                data: {order: order, navigator: navigator, setOrder: setOrder}
            })
        }

    return (
        <div className="flex gap-5 w-full flex-grow overflow-y-auto">
            <div className="flex flex-col w-1/2 h-4/5  bg-background-200 rounded-md overflow-hidden m-5">
                <h2 className="text-3xl font-hind font-semibold w-full bg-secondary p-1 bg-opacity-50">Items</h2>

                <div className="flex flex-col w-full h-full overflow-y-auto ">
                    <AgGridReact 
                        rowData={items}
                        columnDefs={inventoryHeaders}
                        pagination={true}
                    />
                </div>

                <div className="w-full bg-background-300 p-2 flex justify-between">
                    <h2>Subtotal: ${cost}</h2>
                    <h2>Volume: {volume}ft&sup3;</h2>
                </div>
            </div>

            <div className="flex flex-col gap-5 p-5 justify-start w-1/2">
                <div className="flex justify-between gap-5 px-5 mb-5 text-2xl">
                    <h2>Balance: </h2>
                    <h2 className={`${order.paid ? 'text-green-500' : 'text-red-600'}`}>{order.paid ? 'Paid' : 'Unpaid'}</h2>
                </div>

                <div className="mt-6 mb-4 p-4 bg-background-200 rounded-md border border-background-300">
                    <h2 className="text-2xl font-hind font-semibold mb-2">Will you arrive back on campus early?</h2>
                    <h2 className={`text-2xl font-hind font-semibold mb-2 ${
                        order.isarriveearly === 'Yes' 
                        ? 'text-green-700' 
                        : order.isarriveearly === 'No' 
                            ? 'text-red-600' 
                            : 'text-gray-500'
                    }`}>
                        {order.isarriveearly ? order.isarriveearly.toUpperCase() : "Not Selected"}
                    </h2>
                </div>

                <div className="flex flex-col col-span-1 row-span-1 justify-start items-center rounded-md shadow-xl bg-background-200 border-2 border-black border-opacity-5 ">
                    <div className="w-full flex items-center justify-between p-5 border-b-2 border-black border-opacity-5">
                        <h1 className="text-3xl font-hind font-semibold">Student Details</h1>
                    </div>

                    <div className="flex-grow flex items-center justify-around w-full">
                        <div className="flex justify-start w-full items-center text-xl px-5 flex-wrap space-y-2 pb-4">
                            <h2 className="w-1/2 text-start">Name</h2>
                            <h2 className="w-1/2 text-end">{order.name}</h2>
                            
                            <h2 className="w-1/2 text-start">Email</h2>
                            <a href={order.email} className="w-1/2 text-end">{order.email}</a>
                            
                            <h2 className="w-1/2 text-start">Phone</h2>
                            <a href={order.phone} className="w-1/2 text-end">{formatPhoneNumber(order.phone)}</a>
                        </div>
                    </div>
                </div>  

                <div className="flex justify-evenly text-white gap-5 px-5 mb-5">
                    <button onClick={() => downloadLabels()}  className="p-1 bg-secondary flex-grow rounded-md">Download Labels</button>
                    {cookies.user?.role !== 'harvard' ? <button onClick={() => updateBalance()} className="p-1 bg-tertiary flex-grow rounded-md">Update Balance</button> : null}
                </div>
                
            </div>

        </div>
    )
}

const UpdateBalance = ({ data, closeToast }) => {
    const [cookies] = useCookies(['user', 'session']);
    
    const updateBalance = async (value) => {
        try {
            const body = {
                orderID: data.order.id,
                paid: value
            }

            const req = await fetch(`${APIpath}/admin/updatebalance`, {
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
                myToast(res.message, 2);
                closeToast();
                data.setOrder({ ...data.order, paid: value })
            } else {
                myToast(res.message, 1);
                closeToast();
                data.setOrder({ ...data.order, paid: value })
            }
            
            
        } catch (error) {
            console.log(error.message);
            myToast('Error Deleting Order', 1);
        }
    }

    return (
        <div className="w-full flex flex-col gap-5 text-lg">
            <h2>Has the student paid in full?</h2>
            <button onClick={() => updateBalance(true)} className="duration-300 hover:bg-green-500 hover:scale-105">Yes</button>
            <button onClick={() => updateBalance(false)} className="duration-300 hover:bg-red-500 hover:scale-105">No</button>
        </div>
    )
}

export default OrderView;