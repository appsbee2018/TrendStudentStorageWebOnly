/**
 * @author Tyler Marois
 * @description The basic layout for the manager dashboard, takes in a page/component
 */
import React, { useEffect } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faHome, faGear, faClipboardList, faPeopleGroup, faBoxOpen, faDolly } from "@fortawesome/free-solid-svg-icons";
import { useCookies } from "react-cookie";
import { Tooltip } from "react-tooltip";
import { useNavigate } from "react-router";
import myToast from "../myToast";

const ManagerLayout = ({ page }) => {

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

    const logout = () => {
        removeCookies('user');
        location.reload();
    }

    return (
        <div className="flex flex-col w-full h-[100vh] overflow-y-auto">
            <div className="w-full h-[10vh] flex justify-between px-10 items-center bg-background-300 border-b-2 border-black border-opacity-25">
                <h1 className="text-3xl font-semibold font-hind text-primary">Trend Student Storage</h1>
                
                <div className="flex gap-5">
                    <button onClick={() => logout()} className="text-2xl font-hind font-semibold underline">Logout</button>
                    {cookies.user?.id ? <UserMenuButton /> : null}
                </div>
            </div>

            <div className="flex w-full flex-grow h-full">
                <div className="flex h-full w-[10vh] bg-primary justify-start items-center flex-col py-10 gap-10 text-primary text-3xl">
                    <FontAwesomeIcon onClick={() => navigator("/managerdashboard/home")} data-tooltip-id="Home" data-tooltip-content="Home" data-tooltip-place="right" className="bg-background-100 p-1 rounded-md w-10 cursor-pointer" icon={faHome} />
                    <Tooltip id="Home" className="bg-primary z-50" style={{ backgroundColor: "rgb(255, 255, 255)", color: "#1B3F9C", fontWeight: "bold" }} />

                    <FontAwesomeIcon onClick={() => navigator("/managerdashboard/students")} data-tooltip-id="Students" data-tooltip-content="Students" data-tooltip-place="right" className="bg-background-100 p-1 rounded-md w-10 cursor-pointer" icon={faPeopleGroup} />
                    <Tooltip id="Students" className="bg-primary z-50" style={{ backgroundColor: "rgb(255, 255, 255)", color: "#1B3F9C", fontWeight: "bold" }} />

                    <FontAwesomeIcon onClick={() => navigator("/managerdashboard/orders")} data-tooltip-id="Orders" data-tooltip-content="Orders" data-tooltip-place="right" className="bg-background-100 p-1 rounded-md w-10 cursor-pointer" icon={faBoxOpen} />
                    <Tooltip id="Orders" className="bg-primary z-50" style={{ backgroundColor: "rgb(255, 255, 255)", color: "#1B3F9C", fontWeight: "bold" }} />
                    
                    <FontAwesomeIcon onClick={() => navigator("/managerdashboard/items")} data-tooltip-id="Items" data-tooltip-content="Items" data-tooltip-place="right" className="bg-background-100 p-1 rounded-md w-10 cursor-pointer" icon={faDolly} />
                    <Tooltip id="Items" className="bg-primary z-50" style={{ backgroundColor: "rgb(255, 255, 255)", color: "#1B3F9C", fontWeight: "bold" }} />

                    {cookies.user?.role === 'admin' ? <div><FontAwesomeIcon onClick={() => navigator("/managerdashboard/settings")} data-tooltip-id="Settings" data-tooltip-content="Settings" data-tooltip-place="right" className="bg-background-100 p-1 rounded-md w-10 cursor-pointer" icon={faGear} />
                    <Tooltip id="Settings" className="bg-primary z-50" style={{ backgroundColor: "rgb(255, 255, 255)", color: "#1B3F9C", fontWeight: "bold" }} /></div> : null}

                    {cookies.user?.role === 'admin' ? <div><FontAwesomeIcon icon={faClipboardList} onClick={() => navigator("/managerdashboard/logs")} data-tooltip-id="Logs" data-tooltip-content="Logs" data-tooltip-place="right" className="bg-background-100 p-1 rounded-md w-10 cursor-pointer"  />
                    <Tooltip id="Logs" className="bg-primary z-50" style={{ backgroundColor: "rgb(255, 255, 255)", color: "#1B3F9C", fontWeight: "bold" }} /></div> : null}
                </div>

                {page}
            </div>
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

export default ManagerLayout;