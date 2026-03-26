/**
 * @author Tyler Marois
 * @description The managers orders page
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
import exportToExcel from "../../excelWriter";

ModuleRegistry.registerModules([AllCommunityModule]);

const Items = () => {
    const [cookies] = useCookies(['user', 'session']);
    const [year, setYear] = useState(new Date().getFullYear());
    const navigator = useNavigate();
    const [items, setItems] = useState([]);
    const [columnNames, setColumnNames] = useState([
        { field: "name", flex: 1, filter: true, headerName: "Item Name"},
        { field: "cubic_feet", flex: 1, filter: true, headerName: "Cubic Feet", type: 'numericColumn'},
        { field: "location", flex: 1, filter: true, headerName: "Location" },
        { field: "group_name", flex: 1, filter: true, headerName: "Group" },
        { field: "vault", flex: 1, filter: true, headerName: "Vault" },
        { field: "student_name", flex: 1, filter: true, headerName: "Student Name" },
        { field: "email", flex: 1, filter: true, headerName: "Email" },
        { field: "phone", flex: 1, filter: true, headerName: "Phone" },
    ]); 
    const [gridApi, setGridApi] = useState(null);
    const [filteredStatus, setFilteredStatus] = useState(false);

    useEffect(() => {
        getItems();
    }, [year])
    
    const getItems = async () => {
        try {
            const body = {
                year: year
            }

            const req = await fetch(`${APIpath}/admin/getitems`, {
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
                
                setItems(res.items)
                
            } else {
                setItems([]);
            }
        } catch (error) {
            console.log(error.message);
        }
    }

    const getFiltered = () => {
        if(!gridApi) {
            return;
        }

        let filteredItems = [];
        gridApi.forEachNodeAfterFilterAndSort((node) => {
            filteredItems.push(node.data);
        })

        exportToExcel(filteredItems, "StudentStorageItems");
    }

    console.log(filteredStatus);
    
    return (
        <div className="w-full h-full mx-10 mb-10 overflow-y-auto">
            <div className="w-full my-10 border-b-2 border-black border-opacity-20 flex justify-between items-end">
                <h1 className=" font-hind font-semibold text-5xl text-primary">Items</h1>
                
                <div className="flex gap-5 items-end">
                    <button onClick={() => getFiltered()}  className="w-fit h-fit bg-green-600 px-2 py-2 rounded-lg text-white font-hind text-nowrap">Export to Excel</button>

                   {filteredStatus ? <button className="w-fit h-fit bg-red-600 px-2 py-2 rounded-lg text-white font-hind text-nowrap" onClick={() => {gridApi?.setFilterModel(null); setFilteredStatus(false)}}>Clear All Filters</button> : null}

                    <div className="flex h-full justify-center rounded-md items-center text-xl gap-3 bg-background-200 border-2 border-background-300 drop-shadow-lg p-5">
                        <h3>Year</h3>
                        <input className="bg-background-200 p-1" type="number" min="1900" max="2099" step="1" value={year} onChange={(e) => setYear(e.target.value)} />
                    </div>
                </div>
            </div>

            <div className=" w-full h-4/5 ">
                
                {
                    items.length > 0 ? <AgGridReact
                        onGridReady={(params) => setGridApi(params.api)}
                        rowData={items}
                        columnDefs={columnNames}
                        pagination={true}
                        paginationPageSizeSelector={[10, 20, 50, 100, 500, 1000, 10000]}
                        onFilterChanged={() => setFilteredStatus(true)}
                    /> : null
                }
                

            </div>
        </div>
    )
}


export default Items;