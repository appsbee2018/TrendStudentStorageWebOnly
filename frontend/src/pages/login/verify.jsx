/**
 * @author Tyler Marois
 */
import React, { useState } from "react";
import Input from "../../components/input";
import { useNavigate, useParams } from "react-router";
import APIpath from "../../apipath";

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
            
        } catch (error) {
            console.log(error.message);
        }
    }

    return (
        <div className="flex w-full h-[100vh] justify-center items-center bg-background-300 font-open">
            <div className="flex w-1/2 h-3/5 flex-row-reverse  justify-center items-center shadow-2xl rounded-md overflow-hidden">
                <div className="w-full h-full bg-background-100 flex flex-col  justify-around items-center py-3">
                    <h1 className="text-4xl font-hind font-semibold">Verify Account</h1>

                    <form className="flex flex-col gap-10 w-full justify-center items-center" onSubmit={(e) => verify(e)}  action="">

                        <h2>Please verify the 6 digit code that was sent to your email.</h2>

                        <div className="flex flex-col gap-2 w-3/5">
                            <Input title="Registration Code" required={true} type="text" value={code} onChange={setCode} />
                        </div>

                        <input className="bg-primary text-white w-1/2 py-1 rounded-md cursor-pointer" type="submit" value="Verify" />
                    </form>
                </div>
            </div>
        </div>
    )
}

export default Verify;