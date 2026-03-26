/**
 * @author Tyler Marois
 * @description The group selection of the order page
 */
import React, { useEffect, useState } from "react";
import { useCookies } from "react-cookie";
import APIpath from "../../../apipath";
import { useNavigate } from "react-router";
import myToast from "../../../myToast";
import dateFormat from "../../../dateformat";

const GroupSelection = ({ order, setOrder }) => {
    const [year, setYear] = useState(new Date().getFullYear());
    const [groups, setGroups] = useState([]);

    const [cookies] = useCookies(['user', 'session']);

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
            setOrder({...order, groupID: groupID, group: group});
        }
    }

    

    return (
        <div className="flex flex-col gap-5 w-full flex-grow overflow-y-auto">
            <div className="flex flex-col w-full gap-5 p-10">
                <div className="flex w-full justify-between items-center">
                    <h2 className="text-4xl font-hind font-semibold">Please Select Your Group</h2>

                    <div className="flex h-full justify-center rounded-md items-center text-xl gap-3 bg-background-200 border-2 border-background-300 drop-shadow-lg p-5">
                        <h3>Year</h3>
                        <input className="bg-background-200 p-1" type="number" min="1900" max="2099" step="1" value={year} onChange={(e) => setYear(e.target.value)} />
                    </div>
                </div>

                <div className="flex justify-start items-center gap-5">
                    

                    <div className="flex justify-evenly items-center gap-3 flex-wrap w-full">

                        {groups?.sort((a, b) => a.name.localeCompare(b.name)).map((group, index) => {
                            return <Group group={group} selectGroup={selectGroup} key={index} order={order} />
                        })}

                        
                    </div>

                </div>

                
            </div>
        </div>
    )
}

const Group = ({ group, selectGroup, order }) => {
    const [volume, setVolume] = useState(null);
    const [cookies] = useCookies(['user', 'session']);

    const getVolumeTotal = () => {
        let total = 0;
        console.log(order.inventory);
        
        order.inventory.forEach(item => {
            total += item.cubic_feet * item.quantity;
        });
        
        return total;
    }

    useEffect(() => {
        getVolume();

        const timer = setInterval(() => {
            getVolume();
        }, 300000);  

        return () => {
            clearInterval(timer);
            console.log("Interval cleared");
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
                setVolume(Number(res.totals.volume) + Number(getVolumeTotal()));
            }
            
        } catch (error) {
            console.log(error.message);
            myToast("Unexpected Error", 1);
        }
    }
    

    return (
        <div onClick={() => selectGroup(group.id, { ...group, volume: volume })}  className={`cursor-pointer rounded-md flex h-full flex-col justify-center items-center text-xl gap-5 bg-background-200 border-2  border-background-300 drop-shadow-lg p-5 ${order.groupID === group.id ? "scale-110 border-primary" : null}`}>
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

export default GroupSelection;