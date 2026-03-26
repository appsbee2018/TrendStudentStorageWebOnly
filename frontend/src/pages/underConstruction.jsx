/**
 * @author Tyler Marois
 * @description The page letting users know we are under construction
 */
import React from "react";

const UnderConstruction = () => {

    return (
        <div className="flex w-full h-[100vh] justify-center items-center bg-background-300 font-open">
            <div className="flex flex-col gap-20 justify-center items-center">
                <h1 className="text-5xl font-semibold font-hind">Sorry we are under Construction...</h1>
                <h2 className="text-3xl">Check back later!</h2>
            </div>
        </div>
    )
}

export default UnderConstruction;