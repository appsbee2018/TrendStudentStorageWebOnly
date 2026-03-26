/**
 * @author Tyler Marois
 * @description The managers home page
 */
import React, { useEffect, useState } from "react";
import { Cookies, useCookies } from "react-cookie";
import { useNavigate, useSearchParams } from "react-router";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCircleNotch } from "@fortawesome/free-solid-svg-icons";
import myToast from "../../myToast";
import APIpath from "../../apipath";
import { AgGridReact } from 'ag-grid-react';
import { AllCommunityModule, ModuleRegistry } from 'ag-grid-community'; 

ModuleRegistry.registerModules([AllCommunityModule]);

const Students = () => {
    const navigator = useNavigate();
    const [cookies] = useCookies(['user', 'session']);
    const [year, setYear] = useState(new Date().getFullYear());

    const [users, setUsers] = useState([]);
    const [columnNames, setColumnNames] = useState([
        { field: "name", flex: 1, filter: true, headerName: "Name"},
        { field: "email", flex: 1, filter: true, headerName: "Email" },
        { field: "phone", flex: 1, filter: true, headerName: "Phone" },
    ]); 

    useEffect(() => {
        getUsers()
    }, [year])
    
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
            

            if(req.status === 200) {
                const res = await req.json();
                setUsers(res.users);
            } else {
                setUsers([]);
            }
        } catch (error) {
            console.log(error.message);
        }
    }

    return (
        <div className="w-full h-full mx-10 mb-10 overflow-y-auto">
            <div className="w-full my-10 border-b-2 border-black border-opacity-20 flex justify-between items-end">
                <h1 className=" font-hind font-semibold text-5xl text-primary">Students</h1>
                <div className="flex h-full justify-center rounded-md items-center text-xl gap-3 bg-background-200 border-2 border-background-300 drop-shadow-lg p-5">
                    <h3>Year</h3>
                    <input className="bg-background-200 p-1" type="number" min="1900" max="2099" step="1" value={year} onChange={(e) => setYear(e.target.value)} />
                </div>
            </div>

            <div className=" w-full h-4/5 ">
                
                {
                    users.length > 0 ? <AgGridReact
                        rowData={users}
                        onRowClicked={(e) => navigator(`/managerdashboard/studentview`, { state: { student: e.data } })}
                        columnDefs={columnNames}
                        pagination={true}
                        onRowSelected={(event) => setSelectedItems(event.api.getSelectedRows())}
                    /> : null
                }
                

            </div>
        </div>
    )
}


export default Students;