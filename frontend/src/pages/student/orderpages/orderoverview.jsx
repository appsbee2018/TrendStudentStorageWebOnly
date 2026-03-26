/**
 * @author Tyler Marois
 * @description The overview of the order page
 */
import React, { useEffect, useState } from "react";
import { useCookies } from "react-cookie";
import APIpath from "../../../apipath";
import { useNavigate } from "react-router";

const OrderOverview = () => {

    return (
        <div className="flex flex-col gap-5 w-full flex-grow overflow-y-auto">
            <h2 className="mt-10 text-3xl font-hind">Thank you for trusting Trend Moving & Storage to be your summer storage answer!</h2>
            
            <h3 className="text-2xl">How our process works:</h3>

            <p className="w-[90ch]">In the following steps you will select all the items you need to store with us over the summer
                and which group you would like to be a part of. Your group determines your dropoff and pickup day, 
                It is important you stick to those days as it is how we organize your items and ensure they
                get back to you on the correct date. If you need to change dates please change it here in the app before bringing your items.
                <br /><br />
                Boxes bought through Harvard show up as free in our system as you have already bought those through Harvard.
                Any items aside from a 4.5ft&sup3; box is an additional charge. Simply select the items you wish to store and the total
                cost will be accounted for. Over the course of the summer our sales team will be in touch to collect payment from you.
                We will not be able to release any items that have not been paid for.
                <br /><br />
                *Please don't use your browsers forward and back arrows as your progress will not be saved!*
                <br /><br />
                Again thank you for using our services, we hope the rest of the semester goes well and we will see you in May!

                
            </p>
        </div>
    )
}

export default OrderOverview;