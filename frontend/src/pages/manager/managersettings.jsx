/**
 * @author Tyler Marois
 * @description The managers settings page
 */
import React, { useState, useRef, useEffect } from "react";
import Input from "../../components/input";
import GroupSettings from "./settingscomponents/groupsettings";
import InventorySettings from "./settingscomponents/inventorysettings";
import Admins from "./settingscomponents/admins";

const ManagerSettings = () => {

    return (
        <div className="w-full h-full mx-10 mb-10 overflow-y-auto">
            <div className="w-full my-10 border-b-2 border-black border-opacity-20">
                <h1 className=" font-hind font-semibold text-5xl text-primary">Settings</h1>
            </div>

            <div className="flex w-full flex-col">
                <GroupSettings />
                <InventorySettings />
                <Admins />
            </div>
        </div>
    )
}



export default ManagerSettings;