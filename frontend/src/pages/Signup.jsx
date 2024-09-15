import { useState } from "react"
import { Heading } from "../Components/Heading"
import { SubHeading } from "../Components/SubHeading"
import { Button } from "../Components/Button"
import { InputBox } from "../Components/InputBox"
import { BottomWarning } from "../Components/BottomWarning"
import axios from "axios"
import { useNavigate } from "react-router-dom"

// if u want to put custom bg image:- bg-[url('/img/hero-pattern.svg')]
export function Signup (){

const [firstName, setFirstName] = useState("")
const [lastName, setLastName] = useState("")
const [username, setuserName] = useState("")
const [password, setpassword] = useState("")
const navigate = useNavigate()

    return <div className="bg-slate-400 h-screen flex justify-center">
        <div className="flex flex-col justify-center">
            <div className="rounded-lg bg-white w-80 text-center p-2 h-max px-4">
                <Heading label={"SignUp"}/>
                <SubHeading label={"Create a new account"}/>
                <InputBox type={"text"} label = {"First Name"} placeholder={"John"} onChange={(e) => {
                    setFirstName(e.target.value)
                }}/>
                <InputBox type={"text"} label = {"Last Name"} placeholder={"Down"} onChange={(e) => {
                    setLastName(e.target.value)
                }}/>
                <InputBox type={"email"} label = {"Email"} placeholder={"Email"} onChange={(e) => {
                    setuserName(e.target.value)
                }}/>
                <InputBox type={"password"} label = {"Password"} placeholder={"Password"} onChange={(e) => {
                    setpassword(e.target.value)
                }}/>
                <BottomWarning label={"Signin to existing account"} buttonText={"signin"} to={"/signin"}/>
                <div className="pt-4">
                <Button label={"SignUp"} onClick={ async ()=> {
                    // here we can pass in the key value or without the key value same thing
                    const response = await axios.post("http://localhost:3000/api/v1/users/signup", {
                        // the key must be match with the defined key at the backend side
                        username,
                        firstName,
                        lastName,
                        password
                    });
                    localStorage.setItem("token", response.data.token) // here we are the storing the response to the local storage of the browser
                    navigate("/dashboard")
                }}/>
                </div>
            </div>

        </div>

    </div>
}