/**
 * @author Tyler Marois
 * @description The managers home page
 */
import React, { useEffect, useState } from "react";
import { Cookies, useCookies } from "react-cookie";
import { useSearchParams } from "react-router";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCircleNotch } from "@fortawesome/free-solid-svg-icons";
import myToast from "../../myToast";
import APIpath from "../../apipath";
import dateFormat from "../../dateformat";

const ManagerHome = () => {
    const [cookies] = useCookies(['user', 'session']);

    const [year, setYear] = useState(new Date().getFullYear());

    const[items, setItems] = useState([]);
    const [itemQuantities, setItemQuantities] = useState([]);
    const [users, setUsers] = useState([]);
    const [orders, setOrders] = useState([]);

    useEffect(() => {
        getItems();
        getOrders();
        getUsers();
    }, []);

    const getItems = async () => {
        try {
            const body = {
                year: year
            }

            const req = await fetch(`${APIpath}/admin/getitemtotals`, {
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
                setItems(res);
                setItemQuantities([res.quantities[0], res.quantities[1], res.quantities[2]]);
            }
        } catch (error) {
            console.log(error.message);
        }
    }

    const getOrders = async () => {
        try {
            const body = {
                year: year
            }

            const req = await fetch(`${APIpath}/admin/getorders`, {
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
                setOrders(res.orders);
            }
        } catch (error) {
            console.log(error.message);
        }
    }

    const getUsers = async () => {
        try {
            const body = {
                year: year
            }

            const req = await fetch(`${APIpath}/admin/getstudents`, {
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
                setUsers(res.users);
            }
        } catch (error) {
            console.log(error.message);
        }
    }

    return (
        <div className="w-full h-full mx-10 mb-10 overflow-y-auto">
            <div className="w-full my-10 border-b-2 border-black border-opacity-20 flex justify-between items-end">
                <h1 className=" font-hind font-semibold text-5xl text-primary">Home</h1>
                <div className="flex h-full justify-center rounded-md items-center text-xl gap-3 bg-background-200 border-2 border-background-300 drop-shadow-lg p-5">
                    <h3>Year</h3>
                    <input className="bg-background-200 p-1" type="number" min="1900" max="2099" step="1" value={year} onChange={(e) => setYear(e.target.value)} />
                </div>
            </div>

            <div className="grid grid-cols-4 grid-rows-4 gap-5  w-full h-full ">
                <GroupWidget year={year} />

                {
                    cookies.user.role === 'admin' ? 
                    <div className="flex flex-col col-span-1 row-span-1 justify-start items-center rounded-md shadow-xl bg-background-200 border-2 border-black border-opacity-5 ">
                        <div className="w-full flex items-center justify-between p-5 border-b-2 border-black border-opacity-5">
                            <h1 className="text-3xl font-hind font-semibold">Total Revenue</h1>
                        </div>

                        <div className="flex-grow flex items-center justify-around w-full">
                            <div className="flex flex-col justify-center items-center text-2xl text-green-600">
                                {items.price > 0 ? <h2>${items.price}</h2> : <FontAwesomeIcon className=" animate-spin size-1/4 text-primary" icon={faCircleNotch} />}
                            </div>
                        </div>
                    </div> : null
                }

                <div className="flex flex-col col-span-1 row-span-1 justify-start items-center rounded-md shadow-xl bg-background-200 border-2 border-black border-opacity-5 ">
                    <div className="w-full flex items-center justify-between p-5 border-b-2 border-black border-opacity-5">
                        <h1 className="text-3xl font-hind font-semibold">Total Volume</h1>
                    </div>

                    <div className="flex-grow flex items-center justify-around w-full">
                        <div className="flex flex-col justify-center items-center text-2xl">
                            {items.volume > 0 ? <h2>{items.volume} ft&sup3;</h2> : <FontAwesomeIcon className=" animate-spin size-1/4 text-primary" icon={faCircleNotch} />}
                        </div>
                    </div>
                </div>    

                <div className="flex flex-col col-span-1 row-span-1 justify-start items-center rounded-md shadow-xl bg-background-200 border-2 border-black border-opacity-5 ">
                    <div className="w-full flex items-center justify-between p-5 border-b-2 border-black border-opacity-5">
                        <h1 className="text-3xl font-hind font-semibold">Total Orders</h1>
                    </div>

                    <div className="flex-grow flex items-center justify-around w-full">
                        <div className="flex flex-col justify-center items-center text-2xl">
                            {orders.length > 0 ? <h2>{orders.length}</h2> : <FontAwesomeIcon className=" animate-spin size-1/4 text-primary" icon={faCircleNotch} />}
                        </div>
                    </div>
                </div>    

                <div className="flex flex-col col-span-1 row-span-1 justify-start items-center rounded-md shadow-xl bg-background-200 border-2 border-black border-opacity-5 ">
                    <div className="w-full flex items-center justify-between p-5 border-b-2 border-black border-opacity-5">
                        <h1 className="text-3xl font-hind font-semibold">Total Students</h1>
                    </div>

                    <div className="flex-grow flex items-center justify-around w-full">
                        <div className="flex flex-col justify-center items-center text-2xl">
                            {users.length > 0 ? <h2>{users.length}</h2> : <FontAwesomeIcon className=" animate-spin size-1/4 text-primary" icon={faCircleNotch} />}

                        </div>
                    </div>
                </div>  


                <ItemQuantityWidget items={itemQuantities} />

                

            </div>
        </div>
    )
}

const GroupWidget = ({ year }) => {
    const [cookies] = useCookies(['user', 'session'])
    const [groups, setGroups] = useState([]);

    useEffect(() => {
        getGroups();
    }, [year])

    const getGroups = async() => {
        try {
            const body = {
                year: year
            }
            

            const req = await fetch(`${APIpath}/managersettings/getgroupsbyyear`, {
                method: 'POST',
                headers: {
                    'Accept': 'application/json',
                    'Content-Type': 'application/json',
                    'authorization': `bearer ${cookies.session}`
                },
                body: JSON.stringify({ year: year})
            });

            const res = await req.json();

            setGroups(res.groups);
            

        } catch (error) {
            console.log(error.message);
            myToast("Unexpected Error", 1);
        }
    }

    

    return (
        <div className="flex flex-col col-span-2 row-span-2 justify-start items-center rounded-md shadow-xl bg-background-200 border-2 border-black border-opacity-5 ">
            <div className="w-full flex items-center justify-between p-5 border-b-2 border-black border-opacity-5">
                <h1 className="text-3xl font-hind font-semibold">Groups</h1>
            </div>

            <div className="flex-grow flex items-center justify-around w-full overflow-scroll">
                {
                    groups.length !== 0 ?
                    (groups?.sort((groupA, groupB) => groupA.name.localeCompare(groupB.name)).map((group, index) => {
                        return <GroupTotals group={group} key={index} />
                    })) : <FontAwesomeIcon className=" animate-spin size-1/4 text-primary" icon={faCircleNotch} />
                }
            </div>
        </div>
    )
}

const GroupTotals = ({ group, key }) => {
    const [cookies] = useCookies(['user', 'session'])
    const [volume, setVolume] = useState(null);

    useEffect(() => {
        getVolume();
    }, [])

    const getVolume = async() => {
        try {
            const body = { 
                groupID: group.id
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
                setVolume(Number(res.totals.volume));
            }
            
        } catch (error) {
            console.log(error.message);
            myToast("Unexpected Error", 1);
        }
    }

    // return (
    //     <div className="flex flex-col justify-center items-center gap-10 w-full border-x-2">
    //         <h1 className="text-4xl font-hind font-semibold">{group.name}</h1>
    //         <div className="flex gap-5">
    //             <div className="flex justify-center items-center flex-col">
    //                 <h2 className="underline font-semibold text-xl">Pickup</h2>
    //                 <h2 className="text-lg">{dateFormat(group.pickup)}</h2>
    //             </div>

    //             <div className="flex justify-center items-center flex-col">
    //                 <h2 className="underline font-semibold text-xl">Dropoff</h2>
    //                 <h2 className="text-lg">{dateFormat(group.dropoff)}</h2>
    //             </div>
    //         </div>

    //         <h2 className="text-3xl">{((volume/group.capacity) * 100).toFixed(2)}%</h2>
    //     </div>
    // )

    return (
        <div className="flex flex-col justify-center items-center p-3 gap-10 w-full border-x-2">
            <h2 className="text-3xl font-hind font-semibold">{group.name}</h2>
            <div className="flex gap-5">
                <div className="flex justify-center items-center flex-col">
                    <h2 className="underline font-semibold text-xl">Pickup</h2>
                    <h2 className="text-lg">{dateFormat(group.pickup)}</h2>
                </div>

                <div className="flex justify-center items-center flex-col">
                    <h2 className="underline font-semibold text-xl">Dropoff</h2>
                    <h2 className="text-lg">{dateFormat(group.dropoff)}</h2>
                </div>
            </div>

            <h2 className="text-3xl">{((volume/group.capacity) * 100).toFixed(2)}%</h2>
        </div>
    )
}

const ItemQuantityWidget = ({ items }) => {
    
    
    return (
        <div className="flex flex-col col-span-3 row-span-1 justify-start items-center rounded-md shadow-xl bg-background-200 border-2 border-black border-opacity-5 ">
            <div className="w-full flex items-center justify-between p-5 border-b-2 border-black border-opacity-5">
                <h1 className="text-3xl font-hind font-semibold">Highest Selling Items</h1>
            </div>

            <div className="flex-grow flex items-center justify-around w-full">
                {
                    items?.length !== 0 ?
                    (items?.map((item, index) => {
                        return (
                            <div className="flex flex-col justify-center items-center text-2xl">
                                <h2>{item?.name}</h2>
                                <h2>{item?.quantity}</h2>
                            </div>
                        )
                    })) : <FontAwesomeIcon className=" animate-spin size-1/4 text-primary" icon={faCircleNotch} />
                }
            </div>
        </div>
    )
}

export default ManagerHome;