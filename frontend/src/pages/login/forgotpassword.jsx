/**
 * @author Tyler Marois
 * @description The page for users to be able to send a password reset pin to their email. 
 */
import React, { useState } from "react";
import myToast from "../../myToast";
import Input from "../../components/input";
import { useNavigate } from "react-router";
import APIpath from "../../apipath";

const ForgotPassword = () => {
    const [email, setEmail] = useState("");

    const navigator = useNavigate();

    const sendReset = async (e) => {
        e.preventDefault();
        try {
            const body = {
                email: email
            }

            const req = await fetch(`${APIpath}/registration/forgotpassword`, {
                method: 'POST',
                headers: {
                    'Accept': 'application/json',
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(body)
            });
            
            const res = await req.json();

            if(req.status === 200) {
                navigator(`/register/verify/${res.id}`);
            } else if (req.status === 406) {
                myToast("No account with that email. Please try a different one.", 1)
            } else {
                myToast("Error sending password reset.", 1);
            }
            
        } catch (error) {
            console.log(error.message);
            myToast("Error sending password reset.", 1);
        }
    }

    return (
        <div className="flex w-full h-[100vh] justify-center items-center bg-background-300 font-open">
            <div className="flex w-1/2 h-3/5 flex-row-reverse  justify-center items-center shadow-2xl rounded-md overflow-hidden">
                <div className="w-full h-full bg-background-100 flex flex-col  justify-around items-center py-3">
                    <h1 className="text-4xl font-hind font-semibold">Forgot Password</h1>

                    <form className="flex flex-col gap-10 w-full justify-center items-center" onSubmit={(e) => sendReset(e)}  action="">

                        <h2>Please Enter the Email for your Account.</h2>

                        <div className="flex flex-col gap-2 w-3/5">
                            <Input title="Email" required={true} type="text" value={email} onChange={setEmail} />
                        </div>

                        <input className="bg-primary text-white w-1/2 py-1 rounded-md cursor-pointer" type="submit" value="Verify" />
                    </form>
                </div>
            </div>
        </div>
    )
}

export default ForgotPassword;