/**
 * @author Tyler Marois
 * @description The managers orders page
 */
import React, { useEffect, useState, useRef } from "react";
import { Cookies, useCookies } from "react-cookie";
import { useNavigate, useSearchParams } from "react-router";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCircleNotch } from "@fortawesome/free-solid-svg-icons";
import myToast from "../../myToast";
import APIpath from "../../apipath";
import { AgGridReact } from 'ag-grid-react';
import { AllCommunityModule, ModuleRegistry } from 'ag-grid-community'; 
import exportToExcel from "../../excelWriter";
import Swal from 'sweetalert2'

ModuleRegistry.registerModules([AllCommunityModule]);

const Items = () => {
    const gridRef = useRef();
    const [cookies] = useCookies(['user', 'session']);
    const [year, setYear] = useState(new Date().getFullYear());
    const navigator = useNavigate();
    const [items, setItems] = useState([]);
    const [selectedCount, setSelectedCount] = useState(0);
    const [gridApi, setGridApi] = useState(null);
    const [columnNames, setColumnNames] = useState([
        {
            checkboxSelection: true, 
            headerCheckboxSelection: true,
            sortable: false,
            width: 60, 
            filter: false,
            headerCheckboxSelectionCurrentPageOnly: true,
            pinned: 'none'
        },
        { field: "name", flex: 1, filter: true, headerName: "Item Name"},
        { field: "cubic_feet", flex: 1, filter: true, headerName: "Cubic Feet", type: 'numericColumn'},
        { field: "location", flex: 1, filter: true, headerName: "Location" },
        { field: "group_name", flex: 1, filter: true, headerName: "Group" },
        { field: "vault", flex: 1, filter: true, headerName: "Vault", valueGetter: (params) => {
            const vaultValue = params.data.vault;
            if (!vaultValue || vaultValue === '') {
                return "Not Assigned";
            }
            return vaultValue;
        }},
        { field: "status", flex: 1, filter: true, headerName: "Status", valueGetter: (params) => {
                if (params.data.vault) {
                    return "Checked In";
                }
                return params.data.status ? params.data.status : "Ordered";
                
            }, cellStyle: (params) => {
            if (params.value === "Checked In") {
                
                return { color: '#2ecc71', fontWeight: 'bold' };
            }
            return null; 
        }},
        { field: "student_name", flex: 1, filter: true, headerName: "Student Name" },
        { field: "email", flex: 1, filter: true, headerName: "Email" },
        { field: "phone", flex: 1, filter: true, headerName: "Phone" },
    ]); 
    //const [gridApi, setGridApi] = useState(null);
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

    const deleteSelectedOrderItems = async () => {

        const selectedNodes = gridRef.current.api.getSelectedNodes();
        const idsToDelete = selectedNodes.map(node => node.data.id);

        if (idsToDelete.length === 0) {
            return myToast("Select some items first!", 1);
        }

        const body = { itemIDs: idsToDelete }

        if (selectedCount === 0) return;

        Swal.fire({
            title: "Are you sure?",
            text: `You are about to delete ${selectedCount} selected order item${selectedCount > 1 ? 's' : ''}. This action cannot be undone!`,
            icon: "warning",
            showCancelButton: true,
            confirmButtonColor: "#1b3f9d",
            cancelButtonColor: "#d33",
            confirmButtonText: "Yes, delete!"
        }).then(async (result) => {
            if (result.isConfirmed)
            {
                try {

                    const req = await fetch(`${APIpath}/admin/deleteorderitems`, {
                        method: 'POST',
                        headers: {
                            'Accept': 'application/json',
                            'Content-Type': 'application/json',
                            'authorization': `bearer ${cookies.session}`
                        },
                        body: JSON.stringify(body)
                    });

                    if(req.status === 200) {
                        gridRef.current.api.applyTransaction({ remove: selectedNodes.map(n => n.data) });
                        Swal.fire({
                            title: "Deleted!",
                            text: "Selected Item(s) are deleted",
                            icon: "success"
                        });
                    } 
                    else {
                        Swal.fire("Error", "Could not delete the selected items.", "error");
                    }

                } catch(error){
                    console.log(error.message);
                    myToast('Error Deleting Operation', 1);
                }
            }
        });
    }

   
    const onSelectionChanged = (event) => {
        const selectedNodes = event.api.getSelectedNodes();
        setSelectedCount(selectedNodes.length);
        console.log(selectedNodes.length);
    };
    
    return (
        <div className="w-full h-full mx-10 mb-10 overflow-y-auto">
            <div className="w-full my-10 border-b-2 border-black border-opacity-20 flex justify-between items-end">
                <h1 className=" font-hind font-semibold text-5xl text-primary">Items</h1>
                
                <div className="flex gap-5 items-center">
                    {selectedCount > 0 && (
                        <span className="text-md font-bold text-red-600 animate-bounce">
                            {selectedCount} items selected
                        </span>
                    )}
                    <button onClick={() => getFiltered()}  className="w-fit h-fit bg-green-600 px-2 py-2 rounded-lg text-white font-hind text-nowrap">Export to Excel</button>
                    { items.length > 0 && cookies.user?.role == 'admin' ? <button onClick={() => deleteSelectedOrderItems()} className="w-fit h-fit bg-red-600 px-2 py-2 rounded-lg text-white font-hind text-nowrap">Delete {selectedCount > 0 ? `(${selectedCount})` : ''} Selected Items</button> : null }

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
                        ref={gridRef}
                        onGridReady={(params) => setGridApi(params.api)}
                        rowData={items}
                        columnDefs={columnNames}
                        rowSelection={'multiple'}
                        pagination={true}
                        suppressRowClickSelection={true}
                        paginationPageSizeSelector={[10, 20, 50, 100, 500, 1000, 10000]}
                        getRowId={(params) => params.data.id}
                        onSelectionChanged={onSelectionChanged}
                        onFilterChanged={() => setFilteredStatus(true)}
                    /> : null
                }
                

            </div>
        </div>
    )
}


export default Items;