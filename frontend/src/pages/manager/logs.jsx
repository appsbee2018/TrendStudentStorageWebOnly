/**
 * @autor Tyler Marois
 * @description a page that shows all the activity logs in the system
 */
import React, { useState, useRef, useEffect } from "react";
import Input from "../../components/input";
import GroupSettings from "./settingscomponents/groupsettings";
import { AgGridReact } from 'ag-grid-react';
import { useCookies } from "react-cookie";
import myToast from "../../myToast";
import APIpath from "../../apipath";
import { AllCommunityModule, ModuleRegistry } from 'ag-grid-community'; 

// Register all Community features
ModuleRegistry.registerModules([AllCommunityModule]);

const Logs = () => {
    const [logs, setLogs] = useState([]);
    const [columnNames, setColumnNames] = useState([
        { field: "user_name", flex: 1, filter: true, headerName: "User" },
        { field: "description", flex: 1, filter: true },
        { field: "route", flex: 1, filter: true },
        { field: "status_code", flex: 1, filter: true, headerName: "Status Code" },
        { field: "timestamp", flex: 1, filter: true, headerName: "Timestamp" }
    ]);

    const [cookies] = useCookies(['user', 'session']);

    useEffect(() => {
        getLogs();
    }, []);

    const getLogs = async() => {
        try {
            const req = await fetch(`${APIpath}/managersettings/getlogs`, {
                method: 'GET',
                headers: {
                    'Accept': 'application/json',
                    'Content-Type': 'application/json',
                    'authorization': `bearer ${cookies.session}`
                }
            });  

            let res = await req.json();

            setLogs(res.sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp)));

        } catch (error) {
            console.log(error.message);
            myToast("Error getting logs", 1);
        }
    }


    return (
        <div className="w-full h-full mx-10 mb-10 overflow-y-auto">
            <div className="w-full my-10 border-b-2 border-black border-opacity-20">
                <h1 className=" font-hind font-semibold text-5xl text-primary">Logs</h1>
            </div>

            <div className=" w-full h-4/5 ">
                {
                    logs.length > 0 ? <AgGridReact
                        rowData={logs}
                        columnDefs={columnNames}
                        pagination={true}
                    /> : null
                }
            </div>
        </div>
    )
}



export default Logs;