/**
 * @author Tyler Marois
 * @description Where the user creates their password for the first time
 */
import React, { useState } from "react";
import Input from "../../components/input";
import { useNavigate, useParams } from "react-router";
import APIpath from "../../apipath";

const CreatePassword = () => {
    const { id, registrationcode } = useParams();

    const [password, setPassword] = useState("");
    const [reenterPassword, setReenterPassword] = useState("");

    const [success, setSuccess] = useState(false);

    const naviagtor = useNavigate();

    const createPassword = async (e) => {
        e.preventDefault();

        if(!formValidation()) {
            return
        }

        try {
            const body = {
                password: password,
                registrationCode: registrationcode,
                id: id
            }

            const req = await fetch(`${APIpath}/registration/resetpassword`, {
                method: "POST",
                body: JSON.stringify(body),
                headers: {
                    'Content-Type': 'application/json',
                }
            });

            const res = await req.json();
            
            if(req.status === 200) {
                setSuccess(true);
            }
            
        } catch (error) {
            console.log(error.message);
        }
    }

    const formValidation = () => {
        if(password !== reenterPassword) {
            
            return false;
        }


        return true;
    }

    return (
        <div className="flex w-full h-[100vh] justify-center items-center bg-background-300 font-open">
            <div className="flex w-1/2 h-3/5 flex-row-reverse  justify-center items-center shadow-2xl rounded-md overflow-hidden">
                <div className="w-full h-full bg-background-100 flex flex-col  justify-around items-center py-5">
                    {(
                        !success ? 
                        <>
                            <div className="w-full flex justify-center items-center flex-col">
                                <h1 className="text-4xl font-hind font-semibold">Create Password</h1>

                                <h2>Please enter the password you would like to use to access the student storage portal</h2>

                                <p className="mt-5 underline">Passwords must meet the following criteria:</p>
                                <ol className=" list-disc">
                                    <li>12-256 characters long</li>
                                    <li>1 Special Character</li>
                                    <li>1 Number</li>
                                    <li>1 Capital letter</li>
                                </ol>
                            </div>

                            <form className="flex flex-col gap-10 w-full justify-around items-center" onSubmit={(e) => createPassword(e)}  action="">
                                
                                <div className="flex flex-col gap-2 w-3/5">
                                    <Input title="Password" required={true} type="password" value={password} onChange={setPassword} />
                                    <Input title="Re-enter Password" required={true} type="password" value={reenterPassword} onChange={setReenterPassword} />
                                </div>
                                

                                <input className="bg-primary text-white w-1/2 py-1 rounded-md cursor-pointer" type="submit" value="Create!" />
                            </form>
                        </>
                        :
                        <>
                            <h1 className="text-4xl font-hind font-semibold">Success!</h1>
                            <h2>Head back to the login page where you can now use your password to login.</h2>
                            <button onClick={() => naviagtor("/login")} className="bg-primary text-white w-1/2 py-1 rounded-md cursor-pointer">Back to Login</button>
                        </>
                    )}
                </div>
            </div>
        </div>
    )
}

export default CreatePassword;