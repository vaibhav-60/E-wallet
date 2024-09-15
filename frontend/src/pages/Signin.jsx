import { Heading } from "../Components/Heading"
import { SubHeading } from "../Components/SubHeading"
import { InputBox } from "../Components/InputBox"
import { BottomWarning } from "../Components/BottomWarning"
import { Button } from "../Components/Button"
import { useState } from "react"
import { useNavigate } from "react-router-dom"
import axios from "axios"

export function Signin (){
    // add change event for input fields to update state
    const [username, setusername] = useState("")
    const [password, setpassword] = useState("")
    const navigate = useNavigate()

    return <div className="bg-slate-400 h-screen flex justify-center">
    <div className="flex flex-col justify-center">
        <div className="rounded-lg bg-white w-80 text-center p-2 h-max px-4">
            <Heading label={"SignIn"}/>
            <SubHeading label={"Create a new account"}/>
            <InputBox type={"email"} label = {"Email"} placeholder={"Email"} onChange={(e) => {
                setusername(e.target.value)
            }}/>
            <InputBox type={"password"} label = {"Password"} placeholder={"Password"} onChange={(e) => {
                setpassword(e.target.value)
            }}/>
            <BottomWarning label={"Signup to create new account"} buttonText={"signup"} to={"/signup"}/>
            <div className="pt-4">
            <Button label={"SignIn"} onClick={async ()=> {
                // here we can pass in the key value or without the key value same thing
                const response = await axios.post("http://localhost:3000/api/v1/users/signin", {
                    username,
                    password
                });
                localStorage.setItem("token", response.data.token)
                // if successful, redirect to dashboard
                navigate("/dashboard")
                
            }}/>
            </div>
        </div>

    </div>

</div>
}