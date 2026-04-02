/**
 * @autor Tyler Marois
 * @description part of the manager settings for editing admins in the system
 */
import React, { useState, useRef, useEffect, useCallback, useMemo } from "react";
import Input from "../../../components/input";
import { AgGridReact } from 'ag-grid-react';
import { useCookies } from "react-cookie";
import myToast from "../../../myToast";
import APIpath from "../../../apipath";
import { AllCommunityModule, ModuleRegistry } from 'ag-grid-community'; 
import { toast } from "react-toastify";
import Swal from 'sweetalert2';

ModuleRegistry.registerModules([AllCommunityModule]);

const Admins = () => {
    const [admins, setAdmins] = useState([]);
    const [addingAdmin, setAddingAdmin] = useState(false);
    const [selectedAdmins, setSelectedAdmins] = useState([]);
    const [gridApi, setGridApi] = useState(null);
    const [columnNames, setColumnNames] = useState([
        { 
            field: "id", 
            width: 30,
            headerName: "",  
            filter: false, 
            sortable: false,
            resizable: false,
            suppressHeaderMenuButton: true,
            cellRenderer: () => null
        },
        { field: "name", flex: 1, filter: true, headerName: "Name" },
        { field: "email", flex: 1, filter: true, headerName: "Email"  },
        { field: "phone", flex: 1, filter: true, headerName: "Phone"  },
        { field: "role", flex: 1, filter: true, headerName: "Role"  },
    ]);

    const [cookies] = useCookies(['user', 'session']);
    const onGridReady = (params) => {
        setGridApi(params.api);
    };
    const onSelectionChanged = () => {
        const selectedNodes = gridApi.getSelectedNodes();
        const selectedData = selectedNodes.map(node => node.data);
        setSelectedAdmins(selectedData);
    };
    useEffect(() => {
        getAdmins();
    }, [cookies.session]);

    const getAdmins = async() => {
        try {
            const req = await fetch(`${APIpath}/admin/getadmins`, {
                method: 'GET',
                headers: {
                    'Accept': 'application/json',
                    'Content-Type': 'application/json',
                    'authorization': `bearer ${cookies.session}`
                }
            });

            const res = await req.json();

            if(req.status === 200) {
                setAdmins(res);
            }

            

        } catch (error) {
            console.log(error.message);
            myToast("Error getting Admins", 1);
        }
    }

    // const updateItems = async() => {
    //     try {
    //         const body = {
    //             items: items
    //         }

    //         const req = await fetch(`${APIpath}/managersettings/updateitem`, {
    //             method: 'POST',
    //             headers: {
    //                 'Accept': 'application/json',
    //                 'Content-Type': 'application/json',
    //                 'authorization': `bearer ${cookies.session}`
    //             },
    //             body: JSON.stringify(body)
    //         });

    //         const res = await req.json();

    //         if(req.status === 200) {
    //             myToast(res.message, 2);
    //             getAdmins();
    //             setEditted(false);
    //         }

    //     } catch (error) {
    //         console.log(error.message);
    //         myToast("Error Updating Items", 1);
    //     }
    // }

    //Adding Admin Delete Function
    const handleDeleteAdmins = async () => {
        const selectedNodes = gridApi.getSelectedNodes();
        const selectedData = selectedNodes.map(node => node.data);

        // 1. Toast if nothing is selected
        if (selectedData.length === 0) {
            toast.error("Please select at least one admin to delete.");
            return;
        }

        Swal.fire({
            title: 'Are you sure?',
            text: `You are about to delete ${selectedData[0].email}. This action cannot be undone!`,
            icon: 'warning',
            showCancelButton: true,
            confirmButtonColor: '#d33', // Professional red for delete
            cancelButtonColor: '#3085d6',
            confirmButtonText: 'Yes, delete it!',
            cancelButtonText: 'Cancel'
        }).then(async (result) => {
            if (result.isConfirmed) {
                try 
                {
                    const idToDelete = selectedData[0].id;
                    const response = await fetch(`${APIpath}/managersettings/deleteadmin`, {
                        method: 'POST',
                        headers: {
                        'Accept': 'application/json',
                        'Content-Type': 'application/json',
                        'authorization': `bearer ${cookies.session}`
                        },
                        body: JSON.stringify({ id: idToDelete }),
                    });
                    if (response.ok) 
                    {
                        Swal.fire('Deleted!','Admin has been removed successfully.','success');
                        getAdmins();
                        gridApi.deselectAll();
                    } 
                    else 
                    {
                        const errorData = await response.json();
                        Swal.fire('Error', errorData.message || "Failed to delete admin.", 'error');
                    }
                } 
                catch (error) {
                    console.log("Delete Error", error);
                    toast.error("A server error occured");
                }
            }
        });
    }

    return (
        <div className="w-full h-full mb-10 overflow-y-auto">
            <div className="w-full my-10 flex justify-between items-end">
                <h1 className=" font-hind font-semibold text-4xl">Admins</h1>

                <div className="flex gap-5">
                    <button onClick={() => setAddingAdmin(true)} className="bg-secondary rounded-md text-white p-1 ">Add Admin</button>
                    <button onClick={() => handleDeleteAdmins(true)} className="bg-red-700 rounded-md text-white p-1 ">Delete Admin</button>
                </div>
            </div>

            <div className=" w-full h-[500px] overflow-hidden">

                {
                    admins.length > 0 ? <AgGridReact
                        rowData={admins}
                        columnDefs={columnNames}
                        rowSelection={{ 
                            mode: 'singleRow', 
                            headerCheckbox: false 
                        }}
                        onGridReady={onGridReady}
                        onSelectionChanged={onSelectionChanged}
                        getRowId={(params) => String(params.data.id)}
                        pagination={true}
                        domLayout="normal"
                    /> : null
                }
            </div>

            {addingAdmin ? <AddAdmin isOpen={addingAdmin} close={setAddingAdmin} getAdmins={getAdmins} /> : null}
        </div>
    )
}

const AddAdmin = ({ isOpen, close, getAdmins }) => {
    const background = useRef(null);

    const [name, setName] = useState("");
    const [email, setEmail] = useState("");
    const [phone, setPhone] = useState("");
    const [role, setRole] = useState("");
        
    const [cookies] = useCookies(['user', 'session']);
    
    const createAdmin = async(e) => {
        e.preventDefault();
        try {
            const body = {
                name: name,
                email: email,
                phone: phone,
                role: role
            }

            const req = await fetch(`${APIpath}/managersettings/addadmin`, {
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
                getAdmins();
                close(!isOpen);
            } else {
                myToast(res.message, 1);
            }

        } catch (error) {
            console.log(error.message);
            myToast("Error Updating Items", 1);
        }
    }

    useEffect(() => {
        function handleClickOutside(event) {
            if (background.current && !background.current.contains(event.target)) {
                close(!isOpen);
            }
        }
    
        document.addEventListener("mousedown", handleClickOutside);
        return () => {
            document.removeEventListener("mousedown", handleClickOutside);
        };
    }, [background]);

    return (
        <div className={`fixed bg-black bg-opacity-20 w-full h-[100vh] justify-center z-40 items-center left-0 top-0 ${isOpen ? 'flex' : 'hidden'}`}>
            <div ref={background}  className="flex flex-col w-[25%] h-fit bg-background-100 z-40 rounded-md overflow-hidden">
                <div className="w-full flex bg-primary p-1 justify-between items-center">
                    <h2 className="text-white text-2xl">Add Admin</h2>
                    <button onClick={() => close(!isOpen)} className="text-2xl font-hind font-bold text-white px-2">x</button>
                </div>

                <form action="" onSubmit={(e) => createAdmin(e)} className="w-full h-full flex justify-between my-5 flex-col px-3 items-center gap-10">
                    
                    <div className="w-full flex flex-col gap-5">
                        <Input title={"Name"}  value={name} onChange={setName} type={"text"} />
                        <Input title={"Email"}  value={email} onChange={setEmail} type={"text"} />

                        <Input type={"text"} title={"Phone"} value={phone} onChange={setPhone} />
                        
                        <div>
                            <h2 className="font-hind font-semibold">Role</h2>
                            <select value={role} onChange={(e) => setRole(e.target.value)} className={`border-2 border-opacity-5 shadow-inner focus:outline-none focus:ring-2 w-full focus:ring-secondary focus:ring-opacity-10 bg-background-200 p-1 rounded-md`}>
                                <option value=""></option>
                                <option value="harvard">harvard</option>
                                <option value="sales">sales</option>
                                <option value="admin">admin</option>
                            </select>
                        </div>
                    </div>

                    <div className="flex gap-5">
                        <input onClick={(e) => createAdmin(e)} type="submit" className="text-white bg-tertiary p-1 rounded-md" value="Add" />
                        <button onClick={() => close(false)} className="text-white bg-secondary bg-opacity-80 p-1 rounded-md">Cancel</button>
                    </div>
                </form>
            </div>
        </div>
    )
}

export default Admins;