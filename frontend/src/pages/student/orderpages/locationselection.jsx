/**
 * @author Tyler Marois
 * @description The group selection of the order page
 */
import React, { useEffect, useState } from "react";
import { useCookies } from "react-cookie";
import APIpath from "../../../apipath";
import { useNavigate } from "react-router";
import myToast from "../../../myToast";

const LocationSelection = ({ order, setOrder }) => {
    const [locations, setLocations] = useState(['14 - 18 Mill St.', 'Quad Main Lot', 'Littauer Center']);

    const selectLocation = (location) => {
        setOrder({ ...order, location: location});
    }

    useEffect(() => {
        if(order.group.name !== "A") {
            setLocations(['14 - 18 Mill St.', 'Quad Main Lot'])
        }
        console.log(order.group);
        
    }, [order.group.name])

    return (
        <div className="flex flex-col gap-5 w-full flex-grow overflow-y-auto">
            <div className="flex flex-col w-full gap-5 p-10 h-full flex-grow">
                <div className="flex w-full justify-between items-center">
                    <h2 className="text-4xl font-hind font-semibold">Please select where you will dropoff and pickup your items!</h2>
                </div>

                <div className="flex justify-center items-center gap-5 flex-grow">

                    <div className="flex justify-evenly items-center gap-3 flex-wrap w-full">

                        {locations?.map((location, index) => {
                            return <Location location={location} selectLocation={selectLocation} key={index} order={order}  />
                        })}

                        
                    </div>

                </div>

                
            </div>
        </div>
    )
}

const Location = ({ location, selectLocation, order }) => {
    
    return (
        <div onClick={() => selectLocation(location)}  className={`cursor-pointer rounded-md flex h-full flex-col justify-center items-center text-xl gap-5 bg-background-200 border-2  border-background-300 drop-shadow-lg p-5 ${order.location === location ? "scale-110 border-primary" : null}`}>
            <div className="w-full flex justify-between px-2 gap-10">
                <h3>{location}</h3>
            </div>
        </div>
    )
}

export default LocationSelection;