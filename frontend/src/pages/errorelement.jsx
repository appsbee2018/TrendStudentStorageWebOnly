/**
 * @author Tyler Marois
 * @description The error element for when a page has something wrong 
 */
import React from "react";
import Logo from "../assets/logos/Trend_Logo.png"
import { useRouteError } from "react-router-dom";

const ErrorElement = () => {
    const { error } = useRouteError();

    console.log(error);
    
    return (
        <div className="flex justify-center items-center flex-col w-full h-[100vh] bg-background-100 gap-5">
            <div className="w-full flex justify-center items-center flex-col">
                <h1 className="text-5xl font-hind font-semibold">Oops! Something went wrong.</h1>
                <h2 className="text-3xl">Please go back and try again...</h2>
            </div>

            <img src={Logo} alt="" />

            {error ? <p>Error: {error.message}</p> : null}
        </div>
    )
}

export default ErrorElement;