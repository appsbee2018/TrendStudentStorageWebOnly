/**
 * @author Tyler Marois
 * @description The overview of the order page
 */
import React, { useEffect, useState } from "react";
import { useCookies } from "react-cookie";
import APIpath from "../../apipath";
import { useLocation, useNavigate, useParams } from "react-router";
import { AgGridReact } from 'ag-grid-react';
import { AllCommunityModule, ModuleRegistry } from 'ag-grid-community'; 
import myToast from "../../myToast";
import { toast } from "react-toastify";
import dateFormat from "../../dateformat";

ModuleRegistry.registerModules([AllCommunityModule]);

const StudentView = () => {
    const navigator = useNavigate();
    const location = useLocation();
    const [cookies] = useCookies(['user', 'session']);
    const { student } = location.state;
    const [orders, setOrders] = useState();
    const [inventoryHeaders, setInventoryHeaders] = useState([
        { field: "name", flex: 1, filter: true, headerName: "Group"},
        { field: "pickup", flex: 1, filter: true, headerName: "Pickup"},
        { field: "dropoff", flex: 1, filter: true, headerName: "Dropoff"},
        { field: "balance", flex: 1, filter: true, headerName: "Balance", type: 'numericColumn', },
        { field: "location", flex: 1, filter: true, headerName: "Location" },
        { field: "paid", flex: 1, filter: true, headerName: "Paid" },
    ]); 
    
    useEffect(() => {
        getOrders();
    }, [])

    const getOrders = async() => {
        try {
            const body = {
                userID: student.id
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
            
            setOrders(res.orders.map(order => ({
                ...order,
                pickup: dateFormat(order.pickup),
                dropoff: dateFormat(order.dropoff)
            })));
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

    function formatPhoneNumber(input) {
        let value = input.replace(/\D/g, '');
        let formattedNumber = value;
      
        const match = value.match(/^(\d{1,3})(\d{0,3})(\d{0,4})$/);
        if (match) {
          formattedNumber = `(${match[1]}${match[2] ? ') ' : ''}${match[2]}${match[3] ? '-' : ''}${match[3]}`;
        }
        return formattedNumber;
    }

    return (
        <div className="flex gap-5 w-full flex-grow overflow-y-auto">
            <div className="flex flex-col w-1/2 h-4/5  bg-background-200 rounded-md overflow-hidden m-5">
                <h2 className="text-3xl font-hind font-semibold w-full bg-secondary p-1 bg-opacity-50">Orders</h2>

                <div className="flex flex-col w-full h-full overflow-y-auto ">
                    <AgGridReact 
                        onRowClicked={(e) => navigator('/managerdashboard/orderview', { state: { order: { ...e.data, name: student.name, email: student.email, phone: student.phone } } })}
                        rowData={orders}
                        columnDefs={inventoryHeaders}
                        pagination={true}
                    />
                </div>
            </div>

            <div className="flex flex-col p-5 justify-start w-1/2">
                {/* <div className="flex justify-evenly text-white gap-5 px-5 mb-5">
                    <button  className="p-1 bg-secondary flex-grow rounded-md">Download Labels</button>
                    <button className="p-1 bg-tertiary flex-grow rounded-md">Update Order</button>
                    <button  className="p-1 bg-red-600 flex-grow rounded-md">Delete Order</button>
                </div> */}


                <div className="flex flex-col col-span-1 row-span-1 justify-start items-center rounded-md shadow-xl bg-background-200 border-2 border-black border-opacity-5 ">
                    <div className="w-full flex items-center justify-between p-5 border-b-2 border-black border-opacity-5">
                        <h1 className="text-3xl font-hind font-semibold">Student Details</h1>
                    </div>

                    <div className="flex-grow flex items-center justify-around w-full">
                        <div className="flex justify-start w-full items-center text-xl px-5 flex-wrap">
                            <h2 className="w-1/2 text-start">Name</h2>
                            <h2 className="w-1/2 text-end">{student.name}</h2>

                            <h2 className="w-1/2 text-start">Email</h2>
                            <a href={student.email} className="w-1/2 text-end">{student.email}</a>

                            <h2 className="w-1/2 text-start">Phone</h2>
                            <a href={student.phone} className="w-1/2 text-end">{formatPhoneNumber(student.phone)}</a>
                        </div>
                    </div>
                </div>  
                
            </div>

        </div>
    )
}

export default StudentView;