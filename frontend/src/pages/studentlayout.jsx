/**
 * @author Tyler Marois
 * @description The basic layout for the student dashboard, takes in a page/component
 */
import React, { useEffect, useState } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faHome, faGear, faClipboardList, faFileContract, faBoxesPacking, faQuestion } from "@fortawesome/free-solid-svg-icons";
import { useCookies } from "react-cookie";
import { Tooltip } from "react-tooltip";
import { useNavigate } from "react-router";
import myToast from "../myToast";
import APIpath from "../apipath";
import ChatWidget from "../components/chatwidget";


const StudentLayout = ({ page }) => {
    const [termsModal, setTermsModal] = useState(false);

    const navigator = useNavigate();
    const [cookies, removeCookies] = useCookies(['user', 'session']);

    useEffect(() => {
        if(!cookies.user) {
            navigator("/login");
        }
    }, []);

    useEffect(() => {
        if(!cookies.session) {
            myToast("Session expired.", 1);
            navigator("/login");
        } else if(!cookies.user || cookies.user === "undefined") {
            navigator("/login");
            removeCookies('session')
        }
    }, [cookies.user]);

    useEffect(() => {
        checkTerms();
    }, []);

    const checkTerms = async() => {
        try {
            const body = {
                userID: cookies.user?.id
            }

            const req = await fetch(`${APIpath}/order/checkterms`, {
                method: 'POST',
                headers: {
                    'Accept': 'application/json',
                    'Content-Type': 'application/json',
                    'authorization': `bearer ${cookies.session}`
                },
                body: JSON.stringify(body)
            });

            const res = await req.json();

            if(res.data === false) {
                setTermsModal(true);
            }            

        } catch (error) {
            console.log(error.message);
        }
    }

    const logout = () => {
        removeCookies('user');
    }
    

    return (
        <div className="flex flex-col w-full min-h-screen h-full">
            <div className="w-full h-[10vh] flex justify-between px-10 items-center bg-background-300 border-b-2 border-black border-opacity-25">
                <h1 className="text-3xl font-semibold font-hind text-primary">Trend Student Storage</h1>

                <div className="flex gap-5">
                    <button onClick={() => logout()} className="text-2xl font-hind font-semibold underline">Logout</button>
                    {cookies.user?.id ? <UserMenuButton /> : null}
                </div>
            </div>

            <div className="flex w-full flex-grow bg-background-100">
                <div className="flex w-[10vh] bg-primary justify-start items-center flex-col py-10 gap-10 text-primary text-3xl">
                    <FontAwesomeIcon onClick={() => navigator("/studentdashboard/home")} data-tooltip-id="Home" data-tooltip-content="Home" data-tooltip-place="right" className="bg-background-100 p-1 rounded-md w-10 cursor-pointer" icon={faHome} />
                    <Tooltip id="Home" className="bg-primary z-50" style={{ backgroundColor: "rgb(255, 255, 255)", color: "#1B3F9C", fontWeight: "bold" }} />

                    <FontAwesomeIcon icon={faFileContract} onClick={() => navigator("/studentdashboard/termsandconditions")} data-tooltip-id="Terms" data-tooltip-content="Terms and Conditions" data-tooltip-place="right" className="bg-background-100 p-1 rounded-md w-10 cursor-pointer" />
                    <Tooltip id="Terms" className="bg-primary z-50" style={{ backgroundColor: "rgb(255, 255, 255)", color: "#1B3F9C", fontWeight: "bold" }} />

                    <FontAwesomeIcon icon={faBoxesPacking} onClick={() => navigator("/studentdashboard/packingtips")} data-tooltip-id="Packing" data-tooltip-content="Packing Tips" data-tooltip-place="right" className="bg-background-100 p-1 rounded-md w-10 cursor-pointer" />
                    <Tooltip id="Packing" className="bg-primary z-50" style={{ backgroundColor: "rgb(255, 255, 255)", color: "#1B3F9C", fontWeight: "bold" }} />

                    <FontAwesomeIcon icon={faQuestion} onClick={() => navigator("/studentdashboard/faq")} data-tooltip-id="FAQ" data-tooltip-content="FAQ" data-tooltip-place="right" className="bg-background-100 p-1 rounded-md w-10 cursor-pointer" />
                    <Tooltip id="FAQ" className="bg-primary z-50" style={{ backgroundColor: "rgb(255, 255, 255)", color: "#1B3F9C", fontWeight: "bold" }} />
                </div>

               

                {page}

            </div>


            <ChatWidget />
            {termsModal ? <TermsAndConditions close={setTermsModal} /> : null}
        </div>
    )
}

const UserMenuButton = () => {
    const [cookies] = useCookies(['user']);

    return (
        <div className="rounded-full flex justify-center items-center text-white font-hind font-semibold text-3xl bg-tertiary cursor-pointer">
            <h1 className="p-2">{cookies.user?.name.split(" ")[0].charAt(0) + cookies.user?.name.split(" ")[cookies.user?.name.split(" ").length - 1].charAt(0)}</h1>
        </div>
    )
}

const TermsAndConditions = ({ close }) => {
    const [cookies] = useCookies(['user', 'session']);


    const updateTerms = async() => {
        try {
            const date = new Date();
            const body = {
                userID: cookies.user?.id,
                date: `${date.getFullYear()}-${date.getMonth()+1}-${date.getDate()}`,
                agreed: true
            }

            const req = await fetch(`${APIpath}/order/updateterms`, {
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
                close(false);
            }            

        } catch (error) {
            console.log(error.message);
        }
    }

    return (
        <div className={`fixed bg-black bg-opacity-20 w-full h-[100vh] justify-center z-40 items-center left-0 top-0 flex`}>
            <div  className="flex flex-col w-1/2 h-3/4 bg-background-100 z-40 rounded-md overflow-hidden">
                <div className="w-full flex bg-primary p-1 justify-between items-center">
                    <h2 className="text-white text-2xl">Terms & Conditions</h2>
                </div>

                <div className="px-10 py-5 overflow-auto bg-background-100">
                    <ol className="list-decimal gap-5 flex flex-col text-justify">
                        <li>
                            Trend Moving & Storage Is Not Responsible for moving/transporting/packing any Liquids, Liquors, Aerosols, Combustibles or Flammables. All gas needs to be drained from any items before they can be moved. In the event that any items above are moved or put into boxes to be moved, Trend Moving & Storage will hold the acting party responsible for any losses or damages that occur to any and all affected shipments.
                        </li>

                        <li>
                            Trend Moving & Storage will not hold any liability for any damaged or missing items within any
                            boxes, unless it is clear that the box has been compromised or been subject to apparent structural
                            damage within the possession of Trend Moving & Storage. Each student, faculty, or staff member is
                            responsible for properly sealing and packing their boxes before dropping off at Harvard Student
                            Agencies designated areas. In the event that a box appears to have been opened, compromised, or
                            received structural damage under Trend Moving & Storage's possession the student, faculty, or staff
                            member is responsible to show either a Harvard Student Agencies or Trend Moving & Storage
                            representative immediately on delivery day for further examination. All properly sealed boxes that are
                            compromised under the possession of Trend Moving & Storage will be the responsibility of Trend
                            Moving & Storage to remedy with the student, faculty, or staff member.

                            <p className="text-lg text-justify mt-10 underline" >
                                These items include but are not limited to:
                            </p>

                            <ol className="list-disc gap-2 flex flex-col pl-10">
                                <li>Lamps</li>
                                <li>Lamp Shades</li>
                                <li>Light Bulbs</li>
                                <li>Musical Instruments</li>
                                <li>Glass</li>
                                <li>Ceramics</li>
                                <li>Fragile Materials</li>
                                <li>Dishware</li>
                                <li>TVs</li>
                                <li>Computers</li>
                                <li>All other breakable items</li>
                            </ol>
                        </li>

                        <li>
                            All boxes must be sealed and boxed in accordance to Trend Moving & Storages proper packing and
                            boxing etiquette shown in “Packing Tips”. Boxes not packed under the proper etiquette can be
                            deemed void of any liability protection.
                        </li>

                        <li>
                            Trend Moving & Storage will not be responsible for any jewelry, documents, or items of “high value”
                            in excess of $100 per pound. The customer/shipper will be responsible for moving all the items in
                            this category.
                        </li>

                        <li>
                            No firearms or ammunition will be moved or handled by Trend Moving & Storage.
                        </li>

                        <li>
                            Trend Moving & Storage will not be responsible for the transportation of any plants or other living
                            vegetation. 
                        </li>

                        <li>
                            All claims must be filed within 10 business days of the delivered goods in writing to Trend Moving &
                            Storage at <a className="underline" href="mailto:remedy@trendmoving.com">remedy@trendmoving.com</a>. After receipt of the claim, Trend Moving & Storage will have
                            10 business days to issue a reply. In the event that Trend Moving & Storage is found at fault for the
                            claim. Under Full Value Protection, Trend Moving & Storage will do one of the following actions of
                            their choosing:

                            <ol className="list-disc gap-2 flex flex-col pl-10 mt-3">
                                <li>Repair the item to a satisfactory level.</li>
                                <li>Replace with a similar item.</li>
                                <li>Make a cash settlement for the cost of repair or the current market replacement value with a value no
                                    higher than $240.</li>
                            </ol>
                        </li>

                        <li>
                            This Agreement shall be interpreted, construed, and governed according to the laws of the State of
                            New Hampshire. The customer acknowledges that any court action relating to this Agreement shall
                            only be conducted in the State of New Hampshires' state courts or Federal Courts.
                        </li>
                    </ol>
                </div>
            
                <div className="flex p-2 justify-center items-center gap-20 border-t-2 border-black border-opacity-25 bg-background-200">
                    <h2 className="font-hind font-semibold">By pressing this button you are accepting these Terms and Conditions</h2>
                    <button onClick={() => updateTerms()} className="text-lg font-hind bg-primary text-white p-1 rounded-md">Accept</button>
                </div>
            </div>
        </div>
        
    )
}

export default StudentLayout;