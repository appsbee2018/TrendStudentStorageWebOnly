/**
 * @author Tyler Marois
 */
import React, { useState } from "react";
import Input from "../../components/input";
import { useNavigate, useParams } from "react-router";
import APIpath from "../../apipath";
import { toast } from "react-toastify";

const Verify = () => {
    const { id } = useParams();
    const [code, setCode] = useState("");

    const navigator = useNavigate();

    const verify = async(e) => {
        e.preventDefault();

        try {
            const body = {
                id: id,
                registrationCode: code
            }

            const req = await fetch(`${APIpath}/registration/checkregistration`, {
                method: "POST",
                body: JSON.stringify(body),
                headers: {
                    'Content-Type': 'application/json',
                }
            });

            
            const res = await req.json();
            
            if(req.status === 200) {
                navigator(`/register/createpassword/${id}/${res.registration_code}`);
            }
            else if(req.status === 403) {
                toast.error(res);
            }
            
        } catch (error) {
            console.log(error.message);
        }
    }

    return (
        <div className="flex w-full min-h-screen p-4 justify-center items-center bg-background-300 font-open">
            <div className="flex w-full md:w-full max-w-5xl min-h-[50vh] md:h-3/5 justify-center items-stretch shadow-2xl rounded-md overflow-hidden">
                <div className="w-full flex-1 bg-background-100 flex flex-col justify-center items-center py-10 px-6">
                    <h1 className="text-4xl font-hind font-semibold">Verify Account</h1>

                    <form className="flex flex-col gap-10 w-full justify-center items-center" onSubmit={(e) => verify(e)}  action="">

                        <h2 className="text-center">Please verify the 6 digit code that was sent to your email.</h2>

                        <div className="flex flex-col gap-2 w-[90%] md:w-3/5">
                            <Input title="Registration Code" required={true} type="text" value={code} onChange={setCode} />
                        </div>

                        <input className="bg-primary text-white w-1/2 py-1 rounded-md cursor-pointer" type="submit" value="Verify" />
                    </form>
                    <p className="mt-8"><a href="/" className="bg-primary text-white w-1/2 py-1 rounded-md cursor-pointer py-3 px-3">Back to Login</a></p>
                </div>
            </div>
        </div>
    )
}

export default Verify;