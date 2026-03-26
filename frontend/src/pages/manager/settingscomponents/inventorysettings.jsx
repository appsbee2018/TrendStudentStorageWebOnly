/**
 * @autor Tyler Marois
 * @description part of the manager settings for editing items in the system
 */
import React, { useState, useRef, useEffect, useCallback, useMemo } from "react";
import Input from "../../../components/input";
import { AgGridReact } from 'ag-grid-react';
import { useCookies } from "react-cookie";
import myToast from "../../../myToast";
import APIpath from "../../../apipath";
import { AllCommunityModule, ModuleRegistry } from 'ag-grid-community'; 

ModuleRegistry.registerModules([AllCommunityModule]);

const InventorySettings = () => {
    const [items, setItems] = useState([]);
    const [editted, setEditted] = useState(false);
    const [selectedItems, setSelectedItems] = useState([]);
    const [columnNames, setColumnNames] = useState([
        { field: "name", flex: 1, filter: true, headerName: "Name", editable: true},
        { field: "price", flex: 1, filter: true, headerName: "Price", editable: true },
        { field: "cubic_feet", flex: 1, filter: true, headerName: "Cubic Feet", editable: true },
    ]);

    const [cookies] = useCookies(['user', 'session']);

    useEffect(() => {
        getItems();
    }, []);

    const getItems = async() => {
        try {
            const req = await fetch(`${APIpath}/managersettings/getitems`, {
                method: 'GET',
                headers: {
                    'Accept': 'application/json',
                    'Content-Type': 'application/json',
                    'authorization': `bearer ${cookies.session}`
                }
            });

            const res = await req.json();

            if(req.status === 200) {
                setItems(res);
            }

            

        } catch (error) {
            console.log(error.message);
            myToast("Error getting logs", 1);
        }
    }

    const addItem = () => {
        setItems([...items, { name: "New Item", cubic_feet: 0, price: 0.00, uuid: Date.now().toString()}]);
    }

    const updateItems = async() => {
        try {
            const body = {
                items: items
            }

            const req = await fetch(`${APIpath}/managersettings/updateitem`, {
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
                myToast(res.message, 2);
                getItems();
                setEditted(false);
            }

        } catch (error) {
            console.log(error.message);
            myToast("Error Updating Items", 1);
        }
    }

    const deleteItems = async() => {
        try {
            const removed = items.filter((item) => !selectedItems.includes(item));

            const storedItems = selectedItems.filter((item) => item.id !== undefined);

            const body = {
                items: storedItems
            }
            
            const req = await fetch(`${APIpath}/managersettings/deleteitems`, {
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
                myToast(res.message, 2);
                setItems(items.filter((item) => removed.includes(item)))
            }
            
            
        } catch (error) {
            console.log(error.message);
            myToast("Error Deleting Items", 1);
        }
    }

    const rowSelection = useMemo(() => { 
        return { 
            mode: 'multiRow' 
        };
    }, []);

    return (
        <div className="w-full h-full mb-10 overflow-y-auto">
            <div className="w-full my-10 flex justify-between items-end">
                <h1 className=" font-hind font-semibold text-4xl">Item Inventory</h1>

                <div className="flex gap-5">
                    <button onClick={() => addItem()} className="bg-secondary rounded-md text-white p-1 ">Add Item</button>
                    <button onClick={() => updateItems()}  className={`bg-tertiary rounded-md text-white p-1 `}>Update Items</button>
                    {selectedItems.length > 0 ? <button onClick={() => deleteItems()}  className={`bg-red-700 rounded-md text-white p-1 `}>Delete Items</button> : null}
                </div>
            </div>

            <div className=" w-full h-[500px] overflow-hidden">
                {
                    items.length > 0 ? <AgGridReact
                        rowData={items}
                        columnDefs={columnNames}
                        pagination={true}
                        domLayout="normal"
                        onCellValueChanged={() => console.log(items)}
                        rowSelection={rowSelection}
                        onRowSelected={(event) => setSelectedItems(event.api.getSelectedRows())}
                    /> : null
                }
            </div>
        </div>
    )
}



export default InventorySettings;