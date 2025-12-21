import { useState, useEffect } from "react";
import { getprofile } from "@/services/api/userapi";
import dashboarditems from "@/lib/dashboarditems";
import { useNavigate } from "react-router-dom";


const Dashboard = () => {
    const navigate = useNavigate();
    const [username, setusername] = useState<string>("");
    const token = localStorage.getItem("token");
    
    {/*Live Login Auto */}

    let logoutTimer: ReturnType<typeof setTimeout>;

    useEffect(() => {
        const getpf = async () => {
            if (!token) {
                navigate("/login");
                return;
            }
            const result = await getprofile(token);
            if (result && result.success) {
                setusername(result.user.username);
            }
            const exp = result.user.exp;
            const expireat = exp * 1000;
            const timeleft = expireat - Date.now();
           
            logoutTimer = setTimeout(() => {
                localStorage.removeItem("token");
                navigate("/login");
            }, timeleft);
        };
        getpf();
        return () => {
            if (logoutTimer) clearTimeout(logoutTimer);
        }
    }, [])

    return (
        <>
            <h1 className="text-3xl font-bold mb-6">Welcome <span className="text-yellow-600">{username}</span>!</h1>
            <div className="w-full">
                <div className="bg-white p-4 rounded-lg shadow-md w-full">
                    <h2 className="text-xl font-bold mb-2">Welcome to <span className="text-yellow-600">Flasks</span> Study!</h2>
                    <p className="font-medium">Are You Ready To Thrive Adventuring with our study tool?</p>
                </div>
            </div>
            <h1 className="text-black font-bold text-3xl "><span className="text-yellow-600">F</span>eatures</h1>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {
                    dashboarditems.map((element, index) => {
                        const Icon = element.icon;
                        return (
                            <div key={index} className="bg-white p-4 rounded-lg shadow-md">
                                <div className="flex flex-row justify-start">
                                    <div className="flex justify-center items-center gap-3 mb-2">
                                        <Icon className="text-yellow-600 " />
                                        <h2 className="text-xl font-bold"> {element.title}</h2>
                                    </div>
                                </div>
                                <p className="font-medium">{element.summary}</p>
                            </div>
                        )
                    })
                }
            </div>

        </>

    )
}

export default Dashboard;