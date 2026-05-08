/**
 * @author Tyler Marois
 * @description The login page of the student storage website
 */
import React, { useState } from "react";
import Logo from "../../assets/logos/Trend_Logo.png";
import path from "../../frontendpath.js";
import Input from "../../components/input.jsx";
import myToast from "../../myToast.js";
import APIpath from "../../apipath.js";
import { useNavigate } from "react-router";
import { toast } from "react-toastify";

const Register = () => {
    const [name, setName] = useState("");
    const [email, setEmail] = useState("");
    const [phone, setPhone] = useState("");
    const [formMessage, setFormMessage] = useState("");
    const [emailSent, setEmailSent] = useState(false);
    const [user, setUser] = useState({});

    const navigator = useNavigate();

    const register = async(e) => {
        e.preventDefault();

        if(!formValidation()) {
            return;
        }

        try {
            const body = {
                name: name,
                email: email,
                phone: phone,
                role: "student"
            }

            const req = await fetch(`${APIpath}/registration/signup`, {
                method: "POST",
                body: JSON.stringify(body),
                headers: {
                    'Content-Type': 'application/json',
                }
            });

            const res = await req.json();

            if(req.status === 200) {
                setEmailSent(true);
                setUser(res);
            }
            else if (req.status === 409) {
               toast.error("Email already exists. Try logging in again or resetting your password");
            }
            
        } catch (error) {
            console.log(error.message);
        }
    }

    const formValidation = () => {
        const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;

        if(!emailRegex.test(email)) {
            setFormMessage("Email is invalid");
            return false;
        }

        return true;
    }

    return (
        <div className="flex w-full min-h-screen p-4 justify-center items-center bg-background-300 font-open">
            <div className="flex w-full max-w-4xl min-h-[60vh] md:h-3/5 flex-col-reverse md:flex-row-reverse justify-center items-stretch shadow-2xl rounded-md overflow-hidden">
                {
                    (!emailSent ? 
                    <>
                        <div className="w-full md:w-1/2 flex flex-col bg-primary justify-center gap-6 py-10 items-center px-10 rounded-md">
                            <h1 className="text-white text-3xl font-hind font-semibold text-center">Trend Moving & Storage</h1>
                            <img className="w-[150px] bg-background-100 rounded-md" src={Logo} alt="Trend Moving logo" />
                            <h2 className="text-white text-xl text-center">Student Storage Portal</h2>
                        </div>
        
                        <div className="w-full md:w-1/2 bg-background-100 flex flex-col  justify-around items-center py-10 px-6">
                            <h1 className="text-4xl font-hind font-semibold mb-4">Register</h1>
        
                            <form className="flex flex-col gap-10 w-full justify-center items-center" onSubmit={(e) => register(e)} action="">
                                <div className="flex flex-col gap-2 w-[90%] md:w-4/5">
                                    <Input required={true} title="Full Name" type="text" value={name} onChange={setName} />
                                    <Input required={true} title="Email" type="email" value={email} onChange={setEmail} />
                                    <Input required={true} title="Phone" type="tel" value={phone} onChange={setPhone} />
                                </div>
        
                                {formMessage.length > 0 ? <h2 className="text-red-600">{formMessage}</h2> : null}
        
                                <input className="bg-primary text-white w-1/2 py-1 rounded-md cursor-pointer" type="submit" value="Register!" />
                            </form>
        
                            <div className="mt-4">
                                <h2 >Already have an account? login <button className="underline text-primary" onClick={() => navigator("/login")}>here</button>!</h2>
                            </div>
                        </div> 
                    </> 
                    : 
                    <div className="w-full p-4 flex flex-col justify-center items-center text-center bg-background-100">
                        <h1 className="text-3xl font-hind font-semibold">Verification Email Sent!</h1>
                        <p>Thank you for registering with us {user.name.split(" ")[0]}! An email has been sent with your 6 digit verification code.</p>
                        <button onClick={() => navigator(`/register/verify/${user.id}`)} className="bg-primary text-white font-hind font-semibold mt-4 px-4 py-2 rounded-md">Verify</button>
                    </div>
                )}
            </div>
        </div>
    )
}

export default Register;