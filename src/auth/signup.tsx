import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle, } from "@/components/ui/card";
import Logo from "../assets/mainlogo.png";
import { useEffect, useState, type FormEvent } from "react";
import { NavLink, useNavigate } from "react-router-dom";
import { signup } from "@/services/api/userapi";
import { Check, X, Mail, Lock, User, EyeOff, Eye } from "lucide-react";

const Signup = () => {
    const [username, setusername] = useState<string>("");
    const [useremail, setuseremail] = useState<string>("");
    const [userpassword, setuserpassword] = useState<string>("");
    const [confirmpassword, setconfirmpassword] = useState<string>("");
    const [message, setmessage] = useState<string>("");
    const [newmessage, setnewmessage] = useState<string>("");
    const [bool, setbool] = useState<boolean>();
    const [response, setresponse] = useState<any>();
    const [loading, setloading] = useState<boolean>();
    const [disable, setdisable] = useState<number>(0);
    const [eyetoggle, seteyetoggle] = useState<boolean>();
    const [eyetoggle1, seteyetoggle1] = useState<boolean>();

    const navigate = useNavigate();

    {/*Email regex */ }
    const emailregex = /^[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,}$/;

    {/*time interval to prevent spamming click */ }
    useEffect(() => {
        if (disable! < 0)
            return;
        const timeinterval =
            setInterval(() => {
                setdisable((prev) => (prev! - 1));
            }, 1000);
        return () => clearInterval(timeinterval);
    }, [])

    {/*Submit the form with validation */ }
    const handlesubmit = async (e: FormEvent) => {
        e.preventDefault();
        if (!username) {
            setmessage("Please enter username");
            setTimeout(() => {
                setmessage("");
            }, 2000);
            return;
        }
        else if (!useremail) {
            setmessage("Please enter email");
            setTimeout(() => {
                setmessage("");
            }, 2000);
            return;
        }
        else if (!emailregex.test(useremail)) {
            setmessage("Please enter valid email address");
            setTimeout(() => {
                setmessage("");
            }, 2000);
            return;
        }
        else if (!userpassword) {
            setmessage("Please enter password");
            setTimeout(() => {
                setmessage("");
            }, 2000);
            return;
        }
        else if (userpassword.length < 7) {
            setmessage("Please enter 8 letters passwords.");
            setTimeout(() => {
                setmessage("");
            }, 2000);
            return;
        }
        else if (!confirmpassword) {
            setmessage("Please enter confirm password");
            setTimeout(() => {
                setmessage("");
            }, 2000);
            return;
        }
        else if (userpassword !== confirmpassword) {
            setmessage("Password do not match");
            setTimeout(() => {
                setmessage("");
            }, 2000);
            return;
        }
        else {
            setbool(true);
            setloading(true);
            try {
                const result = await signup(username, useremail, userpassword);
                if (result && result.success) {
                    setbool(true);
                    setloading(false);
                    setdisable(3);
                    setmessage("");
                    setresponse(<Check className="text-green-600 w-12 h-12" />)
                    setnewmessage(result.message || "Sign Up Successful")
                    setTimeout(() => {
                        navigate("/login");
                    }, 3000);
                }
            }
            catch (err: any) {
                setbool(true);
                setloading(false);
                setdisable(3);
                setresponse(<X className="text-red-600 w-12 h-12" />)
                setmessage("");
                setnewmessage(err?.response?.data.message || "Unexpected Error");
            }
        }
    }


    return (
        <>
            {bool &&
                <div className="fixed inset-0 bg-black/40 z-40 pointer-events-auto"></div>
            }
            {bool &&
                <div className="fixed top-1/2 z-1000 left-1/2 -translate-x-1/2 -translate-y-1/2 pointer-events-auto">
                    {loading ?
                        (<Card >
                            <CardContent className="flex gap-3 justify-center items-center p-6">
                                <span className="w-8 h-8 border-4 border-t-yellow-600 border-gray-200 rounded-full animate-spin"></span>
                                <h1 className="text-gray-500">Loading</h1>
                            </CardContent>
                        </Card>) :
                        (< Card >
                            <CardHeader>
                                <CardTitle className="flex items-center justify-center gap-2">
                                    {response}
                                </CardTitle>
                            </CardHeader >
                            <CardContent>
                                {newmessage === "Sign Up Successful" ? <p className="text-green-600">{newmessage}</p> : <p className="text-red-600">{newmessage}</p>}
                            </CardContent>
                            <CardFooter className="flex justify-center items-center">
                                <button onClick={() => setbool(prev => !prev)} className="bg-yellow-600 p-2 rounded-lg flex justify-center items-center hover:bg-gray-500">
                                    Close
                                </button>
                            </CardFooter>
                        </Card >)
                    }
                </div >
            }
            <div className="flex justify-center items-center h-screen">
                <Card className="h-auto px-8">
                    <CardHeader >
                        <CardTitle className="flex flex-col justify-center items-center">
                            <img src={Logo} alt="Logo" className="w-20 h-20" />
                            <div className="flex flex-row gap-13 justify-around">
                                <h1 className="text-2xl font-bold text-black">
                                    <span className="text-yellow-700">F</span>laskS
                                </h1>
                                <h1 className="text-2xl fold-bold text-black">
                                    SignUp
                                </h1>
                            </div>
                        </CardTitle>
                        <CardDescription className="text-center fond-bold">
                            Create an account to get started!
                        </CardDescription>
                    </CardHeader>
                    <CardContent>
                        <form onSubmit={handlesubmit}>
                            <div className="flex flex-col gap-2">

                                <label htmlFor="username" className="text-[14px]">Username</label>
                                <div className="relative flex flex-row gap-1 items-center">
                                    <User className="absolute w-4 text-gray-500 left-2" />
                                    <input type="text" value={username} onChange={(e) => setusername(e.target.value)} placeholder="Enter Username" className="w-full px-8 py-1 border rounded-lg  border-black outline-none placeholder:text-[13px]  text-[13px]" />
                                </div>

                                <label htmlFor="email" className="text-[14px]">Email</label>
                                <div className="relative flex flex-row gap-1 items-center">
                                    <Mail className="absolute w-4 text-gray-500 left-2" />
                                    <input type="text" value={useremail} onChange={(e) => setuseremail(e.target.value)} placeholder="Enter Email" className="w-full px-8 py-1 border rounded-lg border-black outline-none placeholder:text-[13px] text-[13px]" />
                                </div>

                                <label htmlFor="password" className="text-[14px]">Password</label>
                                <div className="relative flex flex-row gap-1 items-center">
                                    <Lock className="absolute w-4 text-gray-500 left-2" />
                                    <button onClick={() => seteyetoggle(prev => !prev)} type="button" className="absolute right-2">
                                        {eyetoggle ? <Eye className="w-4 text-gray-500" /> : <EyeOff className="w-4 text-gray-500" />}
                                    </button>
                                    <input type={eyetoggle ? "text" : "password"} value={userpassword} onChange={(e) => setuserpassword(e.target.value)} placeholder="Enter Password" className="w-full px-8 py-1 border rounded-lg border-black outline-none placeholder:text-[13px] text-[13px]" />
                                </div>

                                <label htmlFor="confirmpassword" className="text-[14px]">Confirm password</label>
                                <div className="relative flex flex-row gap-1 items-center">
                                    <Lock className="absolute w-4 text-gray-500 left-2" />
                                    <button onClick={() => seteyetoggle1(prev => !prev)} type="button" className="absolute right-2">
                                        {eyetoggle1 ? <Eye className="w-4 text-gray-500" /> : <EyeOff className="w-4 text-gray-500" />}
                                    </button>
                                    <input type={eyetoggle1 ? "text" : "password"} value={confirmpassword} onChange={(e) => setconfirmpassword(e.target.value)} placeholder="Enter Confirmpassword" className="w-full px-8 py-1 border rounded-lg border-black outline-none placeholder:text-[13px] text-[13px]" />
                                </div>
                                {message && <p className="text-[13px] text-red-600">{message}</p>}
                                <button type="submit" disabled={disable > 0} className="bg-yellow-600 w-full rounded-lg p-2 text-[14px] font-medium text-white hover:bg-gray-600 mt-2 active:translate-y-1">
                                    Sign Up
                                </button>
                                <div className="flex flex-row justify-between w-full gap-8">
                                    <button onClick={() => navigate("/")} type="button" className="bg-black w-full rounded-lg p-2 text-[14px] font-medium text-white hover:bg-gray-600 mt-2 active:translate-y-1">
                                        Back
                                    </button>
                                </div>
                            </div>
                        </form>
                    </CardContent>
                    <CardFooter className="flex flex-col gap-2">
                        <div className="flex flex-row justify-between gap-8">
                            <h1 className="text-[14px]">Already have an account?</h1>
                            <NavLink className="text-[14px] text-blue-600" to="/login">Login</NavLink>
                        </div>
                    </CardFooter>
                </Card>
            </div >
        </>
    )
}

export default Signup;