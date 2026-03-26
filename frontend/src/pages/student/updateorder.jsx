/**
 * @author Tyler Marois
 * @description The update of the order page
 */
import React, { useEffect, useState, useRef } from "react";
import { useCookies } from "react-cookie";
import APIpath from "../../apipath";
import { useNavigate, useParams } from "react-router";
import { AgGridReact } from 'ag-grid-react';
import { AllCommunityModule, ModuleRegistry } from 'ag-grid-community'; 
import myToast from "../../myToast";
import Input from "../../components/input";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faTrashAlt } from "@fortawesome/free-solid-svg-icons";
import dateFormat from "../../dateformat";

const UpdateOrder = () => {
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

    const [inventoryItems, setInventoryItems] = useState([]);
    const [filteredInventory, setFilteredInventory] = useState([]);
    const [search, setSearch] = useState("");
    const [cartItems, setCartItems] = useState([]);

    const [location, setLocation] = useState("");
    const [locations, setLocations] = useState(['14 - 18 Mill St.', 'Quad Main Lot', 'Littauer Center']);

    const [year, setYear] = useState(new Date().getFullYear());
    const [groups, setGroups] = useState([]);

    const [excliamer, setExclaimer] = useState(false);
    
    const selectLocation = (location) => {
        setLocation(location);
    }
    
    useEffect(() => {
        getOrder();
    }, [])

    useEffect(() => {
        getTotals();
    }, [inventory])

    useEffect(() => {
        if(group.name === 'A') {
            setLocations(['14 - 18 Mill St.', 'Quad Main Lot', 'Littauer Center'])
        } else {
            setLocations(['14 - 18 Mill St.', 'Quad Main Lot'])
            if(location === 'Littauer Center') {
                setLocation('Quad Main Lot')
            }
        }
    }, [group]);

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
                getCartItems();
                getGroup(res.orders[0].group_id);
                setOrderDetails(res.orders[0]);
                setLocation(res.orders[0].location);
            } else {
                navigator('/studentdashboard/home');
                myToast("This is not your order!", 1);
            }
 
        } catch (error) {
            console.log(error.message);
        }
    }

    useEffect(() => {
        getInventoryItems();
    }, [])

    useEffect(() => {
        setFilteredInventory(inventoryItems.filter((item) => item.name.toLowerCase().includes(search.toLowerCase())));
    }, [search, inventoryItems]);

    useEffect(() => {
        setInventoryItems(inventoryItems.filter((item) => 
            !cartItems.some(cartItem => cartItem.name === item.name)
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

    const getCartItems = async () => {
        try {
            const body = {
                orderID: orderID
            }
            
            const req = await fetch(`${APIpath}/order/getorderitemswithquantity`, {
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
                setCartItems(res.items);
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
                setGroup(res.group);
                
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

    const updateCartQuantity = (itemName, quantity) => {
        setCartItems(prevItems => 
            prevItems.map(item =>
                item.name === itemName ? { ...item, quantity } : item
            )
        );
    }

    const deleteFromCart = (cartItem) => {
        setCartItems([])
        setCartItems(cartItems.filter((item) => item.name !== cartItem.name));
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

    useEffect(() => {
        getGroups();
    }, [year]);

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

    const selectGroup = (groupID, group) => {
        if(group.volume/group.capacity >= 1) {
            myToast("Please select a different group, this one is over capacity", 1);
        } else {
            setGroup(group);
        }
    }

    const updateOrder = async () => {
        try {

            const body = {
                orderID: orderID,
                groupID: group.id,
                location: location,
                inventory: cartItems
            }

            const req = await fetch(`${APIpath}/order/updateorder`, {
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
                myToast("Order Updated!", 2);
            } else if(req.status === 409) {
                myToast(res.message, 1);
            } else {
                myToast("Unexpected error  ", 1);
            }
        
            
        } catch (error) {
            console.log(error.message);
            myToast("Unexpected error when updating order", 1);
        }
    }

    return (
        <div className="flex flex-col gap-5 w-full flex-grow pt-5 p-10 h-full">

            <div>
                <h1 className="text-4xl font-hind font-semibold">Inventory</h1>
                <p>Update any of your items here, please keep in mind your total will change</p>
            </div>
            <div className="w-full flex gap-5 flex-grow h-full">
                <div className="flex flex-col w-1/2 h-[60vh] flex-grow  bg-background-200 rounded-md overflow-hidden">
                    <div className="w-full bg-secondary p-1 bg-opacity-35 flex">
                        <h2 className="text-3xl font-hind font-semibold w-4/5">Available Items</h2>
                        <Input placeholder={"Search..."} value={search} onChange={setSearch} type={"text"} />
                    </div>

                    <div className="grid grid-cols-4 items-start justify-start w-full flex-grow h-full overflow-y-auto p-3 gap-3 flex-wrap">
                        {filteredInventory.map((item, index) => {
                            return <InventoryItem item={item} updateCart={updateCart} index={index} key={index} />
                        })}
                    </div>
                </div>

                <div className="flex flex-col w-1/2 h-[60vh] gap-5  bg-background-200 rounded-md overflow-y-auto ">
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


            <div className="flex flex-col w-full gap-5 p-10">
                <div className="flex w-full justify-between items-center">
                    <h2 className="text-4xl font-hind font-semibold">Please update where you will dropoff and pickup your items!</h2>

                    
                </div>

                <div className="flex justify-start items-center gap-5">

                    <div className="flex justify-evenly items-center gap-3 flex-wrap w-full">

                        {locations?.map((locationSelection, index) => {
                            return <Location location={locationSelection} selectLocation={selectLocation} key={index} orderedLocation={location} />
                        })}

                        
                    </div>

                </div>

                
            </div>

            <div className="flex flex-col w-full gap-5 p-10">
                <div className="flex w-full justify-between items-center">
                    <h2 className="text-4xl font-hind font-semibold">Please Update Your Group</h2>

                    <div className="flex h-full justify-center rounded-md items-center text-xl gap-3 bg-background-200 border-2 border-background-300 drop-shadow-lg p-5">
                        <h3>Year</h3>
                        <input className="bg-background-200 p-1" type="number" min="1900" max="2099" step="1" value={year} onChange={(e) => setYear(e.target.value)} />
                    </div>
                </div>

                <div className="flex justify-start items-center gap-5">
                    <div className="flex justify-evenly items-center gap-5 flex-wrap w-full">

                        {groups?.sort((a, b) => a.name.localeCompare(b.name)).map((groupSelection, index) => {
                            return <Group group={groupSelection} orderedGroup={group} selectGroup={selectGroup} key={index} cartItems={cartItems} />
                        })}
                    </div>

                </div>
            </div>

            <div className="flex justify-evenly text-white gap-5 px-5 mb-5">
                <button onClick={() => navigator(`/studentdashboard/order/${orderID}`)} className="p-1 bg-secondary flex-grow rounded-md">Go Back</button>
                <button onClick={() => {setExclaimer(true); updateOrder()}} className="p-1 bg-tertiary flex-grow rounded-md">Update!</button>
            </div>

            {excliamer ? <Exclaimer setOpen={setExclaimer} orderID={orderID} /> : null}
        </div>
    )
}

const Group = ({ group, orderedGroup, selectGroup, cartItems }) => {
    const [volume, setVolume] = useState(null);
    const [cookies] = useCookies(['user', 'session']);

    useEffect(() => {
        getVolume();
    }, [cartItems])

    useEffect(() => {
        getVolume();

        const timer = setInterval(() => {
            getVolume();
        }, 300000);  

        return () => {
            clearInterval(timer);
        };
    }, []);

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
                setVolume(res.totals.volume)
            }
            
        } catch (error) {
            console.log(error.message);
            myToast("Unexpected Error", 1);
        }
    }
    

    return (
        <div onClick={() => selectGroup(group.id, { ...group, volume: volume })}  className={`cursor-pointer rounded-md flex h-full flex-col justify-center items-center text-xl gap-5 bg-background-200 border-2  border-background-300 drop-shadow-lg p-5 ${orderedGroup.id === group.id ? "scale-110 border-primary" : null}`}>
            <div className="w-full flex justify-between px-2 gap-10">
                <h3>Group</h3>
                <h3>{group.name}</h3>
            </div>

            <div className="w-full flex justify-between px-2 gap-10">
                <h3>Pickup</h3>
                <h3>{dateFormat(group.pickup)}</h3>
            </div>

            <div className="w-full flex justify-between px-2 gap-10">
                <h3>Dropoff</h3>
                <h3>{dateFormat(group.dropoff)}</h3>
            </div>

            <div className="flex gap-5">
                <h2>Capacity</h2>
                <input type="range" disabled value={volume/group.capacity} id="" />
                <h2>{((volume/group.capacity) * 100).toFixed(2)}%</h2>
            </div>

        </div>
    )
}

const Location = ({ location, selectLocation, orderedLocation }) => {
    
    return (
        <div onClick={() => selectLocation(location)}  className={`cursor-pointer rounded-md flex h-full flex-col justify-center items-center text-xl gap-5 bg-background-200 border-2  border-background-300 drop-shadow-lg p-5 ${location === orderedLocation ? "scale-110 border-primary" : null}`}>
            <div className="w-full flex justify-between px-2 gap-10">
                <h3>{location}</h3>
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
                <input max={30} min={1} type={"number"} value={item.quantity} onChange={(e) => updateCartQuantity(item.name, e.target.value)} className={`border-2 border-opacity-5 shadow-inner focus:outline-none focus:ring-2 w-full focus:ring-secondary focus:ring-opacity-10 bg-background-200 p-1 rounded-md`} />
            </div>

            <div className=" flex flex-col items-end ">
                <h2>Total Price: ${item.price * item.quantity}</h2>
                <h2>Total Volume: {item.cubic_feet * item.quantity}ft&sup3;</h2>
            </div>

            <FontAwesomeIcon onClick={() => deleteFromCart(item)} icon={faTrashAlt} className="text-tertiary pr-2 cursor-pointer" />
        </div>
    )
}

const Exclaimer = ({ setOpen, orderID }) => {
    const [downloaded, setDownloaded] = useState(false);
    const [cookies] = useCookies(['user', 'session']);
    const navigator = useNavigate();
    
    
    
    const downloadLabels = async () => {
        try {
            const body = {
                orderID: orderID
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

            
            if(response.status === 200) {
                myToast("Labels Downloaded", 2);
                setDownloaded(true)
            } else {
                myToast("Error Retreiving labels", 1);
            }
        } catch (error) {
            console.log(error.message);
        }
    }

    return (
        <div className={`fixed flex bg-black bg-opacity-30 w-full h-[100vh] justify-center z-40 items-center left-0 top-0 `}>
            <div className="flex flex-col w-[25%] h-fit bg-background-100 z-40 rounded-md overflow-hidden">
                <div className="w-full flex bg-primary p-1 justify-between items-center">
                    <h2 className="text-white text-2xl">Attention</h2>
                </div>

                    
                <div className="w-full p-10">
                    <div className="flex flex-col justify-center items-center text-center">
                        <h2 className="text-4xl">You Need to reprint your labels!</h2><br />
                        <h2 className="text-xl">Your unit IDs have changed and a reprint of your labels is required!</h2>
                    </div>
                </div>

                <div className="flex gap-5 w-full justify-center p-3">
                    {downloaded ? <button onClick={() => navigator(`/studentdashboard/order/${orderID}`)} className="text-white bg-primary p-1 rounded-md" >Back to Order</button> : <button onClick={(e) => downloadLabels(e)} className="text-white bg-red-600 p-1 rounded-md">Download Labels</button> }
                </div>
                
            </div>
        </div>
    )
}

export default UpdateOrder;