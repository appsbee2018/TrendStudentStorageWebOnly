/**
 * @author Tyler Marois
 * @description Basic text input style used across the application
 */
import React from "react";

const Input = ({ title, type, value, onChange, invalid, placeholder, step, required, max, min }) => {

    return (
        <div className="w-full">
            {(required ? 
                <>
                    <h2 className="font-hind font-semibold">{title}*</h2>
                    <input max={max} min={min} placeholder={placeholder} value={value} required onChange={(e) => onChange(e.target.value)} className={`border-2 border-opacity-5 shadow-inner focus:outline-none focus:ring-2 w-full focus:ring-secondary focus:ring-opacity-10 bg-background-200 p-1 rounded-md`} type={type} />
                </> 
                : 
                <>
                    <h2 className="font-hind font-semibold">{title}</h2>
                    <input max={max} min={min} placeholder={placeholder} step={step} value={value} onChange={(e) => onChange(e.target.value)} className={`border-2 border-opacity-5 shadow-inner focus:outline-none focus:ring-2 w-full focus:ring-secondary focus:ring-opacity-10 bg-background-200 p-1 rounded-md`} type={type} />
                </>
                )}
        </div>
    )
}

export default Input;