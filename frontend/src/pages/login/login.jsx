/**
 * @author Tyler Marois
 * @description The login page of the student storage website
 */
import React, { useState } from "react";
import Logo from "../../assets/logos/Trend_Logo.png";
import path from "../../frontendpath.js";
import Input from "../../components/input.jsx";
import APIpath from "../../apipath.js";
import { jwtDecode } from "jwt-decode";
import { useCookies } from "react-cookie";
import myToast from "../../myToast.js";
import { useNavigate } from "react-router";

const Login = () => {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");

    const [cookies, setCookies] = useCookies(['session', 'user']);
    const navigator = useNavigate();

    const login = async(e) => {
        e.preventDefault();

        if(!formValidation()) {
            return;
        }

        try {
            const body = {
                email: email,
                password: password,
            }

            const req = await fetch(`${APIpath}/authentication/login`, {
                method: "POST",
                body: JSON.stringify(body),
                headers: {
                    'Content-Type': 'application/json',
                }
            });

            const res = await req.json();

            if(req.status === 200) {
                const user = jwtDecode(res);
                
                setCookies('session', res, { maxAge: 86000});
                setCookies('user', user, { maxAge: 86000}); 
                if(user.role === 'student') {
                    navigator('/studentdashboard/home');
                } else {
                    navigator('/managerdashboard/home');
                }
            } else {
                myToast(res, 1);
            }           
            
        } catch (error) {
            console.log(error.message);
            myToast("Unexpected error", 1);
        }
    }

    const formValidation = () => {
        if(email.length === 0 && password.length === 0) {
            return false;
        }

        return true;
    }

    return (
        <div className="flex w-full h-[100vh] justify-center items-center bg-background-300 font-open">
            <div className="flex w-1/2 h-3/5  justify-center items-center shadow-2xl rounded-md overflow-hidden">
                <div className="w-1/2 h-full flex flex-col bg-primary justify-around items-center px-10 rounded-md">
                    <h1 className="text-white text-3xl">Trend Moving & Storage</h1>
                    <img className="w-[150px] bg-background-100 rounded-md" src={Logo} alt="Trend Moving logo" />
                    <h2 className="text-white text-xl text-center">Student Storage Portal</h2>
                </div>

                <div className="w-1/2 h-full bg-background-100 flex flex-col justify-around items-center py-3">
                    <h1 className="text-4xl">Welcome Back!</h1>

                    <form className="flex flex-col gap-10 w-full justify-center items-center" action="" onSubmit={(e) => login(e)}>
                        <div className="flex flex-col gap-2 w-3/5">
                            <Input title="Email" type="text" required={true} value={email} onChange={setEmail} />
                            <Input title="Password" type="password" required={true} value={password} onChange={setPassword} />
                        </div>

                        <div className="w-full flex flex-col justify-center items-center gap-3">
                            <input className="bg-primary text-white w-1/2 py-1 rounded-md" type="submit" value="Log In" />
                            <button className="underline text-primary" onClick={() => navigator("/forgotpassword")}>forgot password?</button>
                        </div>
                    </form>

                    <div>
                        <h2>Or, sign up <button className="underline text-primary" onClick={() => navigator("/register")}>here</button> now!</h2>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default Login;