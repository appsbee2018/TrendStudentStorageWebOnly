/**
 * @author Tyler Marois
 * @description settings for groups
 */
import React, { useState, useRef, useEffect } from "react";
import Input from "../../../components/input";
import myToast from "../../../myToast";
import APIpath from "../../../apipath";
import { useCookies } from "react-cookie";
import dateFormat from "../../../dateformat";

const GroupSettings = () => {
    const [year, setYear] = useState(new Date().getFullYear());
    const [groups, setGroups] = useState([]);
    const [currentGroup, setCurrentGroup] = useState({});
    
    const [cookies] = useCookies(['user', 'session']);


    useEffect(() => {
        getGroups();
    }, [])

    useEffect(() => {
        getGroups();
    }, [year])

    const addGroup = async() => {
        try {
            if(groups.length > 0) {
                setGroups([...groups, { name: "-", capacity: 6000, pickup: `${year}-01-01`, dropoff: `${year}-12-31` }]);
            }

            const body = { 
                name: "-", 
                capacity: 6000, 
                pickup: `${year}-01-01`,
                dropoff: `${year}-12-31`
            }
            

            const req = await fetch(`${APIpath}/managersettings/addgroup`, {
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
                getGroups();
            } else {
                myToast(res.message, 1);
            }
            
        } catch (error) {
            console.log(error.message);
        }
    }

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
        <div className="flex flex-col w-full gap-5">
            <div className="flex w-full justify-between items-center">
                <h2 className="text-4xl font-hind font-semibold">Groups</h2>

                <div className="flex h-full justify-center rounded-md items-center text-xl gap-3 bg-background-200 border-2 border-background-300 drop-shadow-lg p-5">
                    <h3>Year</h3>
                    <input className="bg-background-200 p-1" type="number" min="1900" max="2099" step="1" value={year} onChange={(e) => setYear(e.target.value)} />
                </div>
            </div>

            <div className="flex justify-start items-center gap-5">
                

                <div className="flex justify-start items-center gap-3 flex-wrap">

                    {groups?.sort((a, b) => a.name.localeCompare(b.name)).map((group, index) => {
                        return (
                            <div key={index} className="cursor-pointer rounded-md flex h-full flex-col justify-center items-center text-xl gap-3 bg-background-200 border-2  border-background-300 drop-shadow-lg p-5">
                                <div className="w-full flex justify-between px-2 gap-10">
                                    <h3>Group</h3>
                                    <h3>{group.name}</h3>
                                </div>

                                <div className="w-full flex justify-between px-2 gap-10">
                                    <h3>Capacity</h3>
                                    <h3>{group.capacity} CuFt.</h3>
                                </div>

                                <div className="w-full flex justify-between px-2 gap-10">
                                    <h3>Pickup</h3>
                                    <h3>{dateFormat(group.pickup)}</h3>
                                </div>

                                <div className="w-full flex justify-between px-2 gap-10">
                                    <h3>dropoff</h3>
                                    <h3>{dateFormat(group.dropoff)}</h3>
                                </div>
                                
                                
                                <button onClick={() => setCurrentGroup(group)} className="text-white bg-secondary p-1 rounded-md">edit</button>
                            </div>
                        )
                    })}

                    <div onClick={() => addGroup()} className="cursor-pointer rounded-md flex h-full flex-col justify-center items-center text-xl gap-3 bg-background-200 border-2 border-dashed border-secondary drop-shadow-lg p-5 text-secondary">
                        <h3>Add Group</h3>
                        <h3 className="text-3xl ">+</h3>
                    </div>
                </div>

            </div>

            {
                currentGroup.name ? <GroupEdit group={currentGroup} setGroup={setCurrentGroup} refreshGroups={getGroups} /> : null
            }
        </div>
    )
}

const GroupEdit = ({ group, setGroup, refreshGroups }) => {
    const [name, setName] = useState(group.name);
    const [capacity, setCapacity] = useState(group.capacity);
    const [pickup, setPickup] = useState(group.pickup.split("T")[0]);
    const [dropoff, setDropoff] = useState(group.dropoff.split("T")[0]);

    
    const background = useRef(null);
    
    const [cookies] = useCookies(['user', 'session']);
    

    useEffect(() => {
        function handleClickOutside(event) {
            if (background.current && !background.current.contains(event.target)) {
                setGroup({});
            }
        }
  
        document.addEventListener("mousedown", handleClickOutside);
        return () => {
            document.removeEventListener("mousedown", handleClickOutside);
        };
    }, [background]);

    

    const updateGroup = async(e) => {
        e.preventDefault();
        try {

            const body = { 
                name: name, 
                capacity: capacity, 
                pickup: pickup,
                dropoff: dropoff,
                id: group.id
            }
            

            const req = await fetch(`${APIpath}/managersettings/updategroup`, {
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
                refreshGroups();
                setGroup({});
                myToast(res.message, 2);
            } else {
                myToast(res.message, 1);
            }
            
        } catch (error) {
            console.log(error.message);
            myToast(error.message, 1);
        }
    }
    
    const deleteGroup = async (e) => {
        e.preventDefault();
        try {

            const body = { 
                id: group.id
            }
            

            const req = await fetch(`${APIpath}/managersettings/deletegroup`, {
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
                refreshGroups();
                setGroup({});
                myToast(res.message, 2);
            } else {
                myToast(res.message, 1);
            }
            
        } catch (error) {
            console.log(error.message);
            myToast(error.message, 1);
        }
    }

    const dateFormat = (date) => {
        const dateObject = new Date(date);
        

        return `${(dateObject.getMonth() + 1)}/${dateObject.getDate()}/${dateObject.getFullYear()}`
    }

    return (
        <div className={`fixed bg-black bg-opacity-20 w-full h-[100vh] justify-center z-40 items-center left-0 top-0 ${group.name ? 'flex' : 'hidden'}`}>
            <div ref={background}  className="flex flex-col w-[25%] h-fit bg-background-100 z-40 rounded-md overflow-hidden">
                <div className="w-full flex bg-primary p-1 justify-between items-center">
                    <h2 className="text-white text-2xl">Edit Group</h2>
                    <button onClick={() => setGroup({})} className="text-2xl font-hind font-bold text-white px-2">x</button>
                </div>

                <form action="" onSubmit={(e) => updateGroup(e)} className="w-full h-full flex justify-between my-5 flex-col px-3 items-center gap-10">
                    
                    <div className="w-full flex flex-col gap-5">
                        <Input title={"Name"}  value={name} onChange={setName} type={"text"} />
                        <Input title={"Capacity (Cubic Ft.)"}  value={capacity} onChange={setCapacity} step={500} type={"number"} />

                        <Input type={"date"} title={"Pickup Date"} value={pickup} onChange={setPickup} />
                        <Input type={"date"} title={"Dropoff Date"} value={dropoff} onChange={setDropoff} />

                    </div>

                    <div className="flex gap-5">
                        <input onClick={(e) => updateGroup(e)} type="submit" className="text-white bg-tertiary p-1 rounded-md" value="Update" />
                        <button onClick={(e) => deleteGroup(e)} className="text-white bg-red-600 p-1 rounded-md">Delete</button>
                    </div>
                </form>
            </div>
        </div>
    )
}

export default GroupSettings;