/**
 * @author Tyler Marois
 * @description The overview of the order page
 */
import React, { useEffect, useState } from "react";
import { useCookies } from "react-cookie";
import APIpath from "../../../apipath";
import { useNavigate } from "react-router";

const Finish = ({ order }) => {
    const [cookies] = useCookies(['user', 'session'])
    const navigator = useNavigate();

    const downloadLabels = async () => {
        try {
            const body = {
                orderID: order.orderID
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

    return (
        <div className="flex flex-col gap-5 w-full flex-grow overflow-y-auto justify-center items-center text-xl">
            <h2 className="text-4xl font-hind font-semibold text-primary">Thank you for taking the time to submit your order!</h2>
            <h3 className="text-2xl">We've got it from here and we will see you in May!</h3>
            <h3>If you need to modify your order please do so before bringing your items to us as you won't be able to after.</h3>

            <div>
                <button className="bg-secondary p-1 rounded-md text-white text-xl w-fit m-3" onClick={() => {downloadLabels()}}>Download Labels</button>
                <button className="bg-tertiary p-1 rounded-md text-white text-xl w-fit m-3" onClick={() => navigator("/studentdashboard/home")}>Home</button>
            </div>
        </div>
    )
}

export default Finish;