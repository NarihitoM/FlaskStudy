import { SidebarContent, Sidebar, SidebarGroup, SidebarRail, SidebarGroupContent, SidebarMenu, SidebarMenuButton, SidebarMenuItem, SidebarProvider, SidebarTrigger, SidebarHeader, SidebarFooter } from "@/components/ui/sidebar";
import itemslist from "@/lib/sidebarelement";
import { getprofile } from "@/services/api/userapi";
import { useEffect, useState } from "react";
import { Outlet, useNavigate } from "react-router-dom";
import { LogOut, UserIcon } from "lucide-react";
import Logo from "../assets/mainlogo.png";
import { gettoken, removetoken } from "@/lib/auth";

const Mainrenderpage = () => {
    const navigate = useNavigate();
    const [open, setopen] = useState<boolean>();
    const token = gettoken();
    const [username, setusername] = useState<string>("");
    const [useremail, setuseremail] = useState<string>("");

    {/*Live login */}
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
                setuseremail(result.user.useremail);
            }
            const exp = result.user.exp;
            const expireat = exp * 1000;
            const timeleft = expireat - Date.now();
           
            logoutTimer = setTimeout(() => {
                removetoken()
                navigate("/login");
            }, timeleft);
        };
        getpf();
        return () => {
            if (logoutTimer) clearTimeout(logoutTimer);
        }
    }, [])
 
    {/*Logout */}

    const logout = () => {
        removetoken()
        navigate("/");
    }

    return (
        <>
            <div className="p-3 bg-white w-full z-50 border-t shadow-md md:hidden">
                <div className="flex justify-between py-2 mr-5">
                    <div className="flex flex-row justify-center items-center">
                        <img className="w-17 h-17" src={Logo} />
                        <div className="flex flex-col ">
                            <h1 className="text-xl font-bold text-black">
                                <span className="text-yellow-700">F</span>laskS
                            </h1>
                            <p className="text-gray-500 text-[13px] font-medium">Study</p>
                        </div>
                    </div>
                    <div className="flex flex-row gap-3 bg-gray-100 p-2 rounded-lg justify-center items-center">
                        <div className="flex flex-col w-[150px]">
                            <p className="font-semibold">{username}</p>
                            <p className="font-medium text-[13px]">{useremail}</p>
                        </div>
                        <button onClick={logout} className="bg-red-600 p-1.5 rounded-lg active:translate-y-1"><LogOut className="w-4 h-4 text-white" /></button>
                    </div>
                </div>
            </div>
            <SidebarProvider open={open} defaultOpen={false} onOpenChange={() => setopen(prev => !prev)}>
                <div className="flex flex-row">
                    <Sidebar collapsible="icon">
                        <SidebarHeader>
                            <SidebarTrigger />
                            <h1 className="text-[14px] font-bold"><span className="text-yellow-600">F</span>lasks</h1>
                        </SidebarHeader>
                        <SidebarContent>
                            <SidebarGroup>
                                <SidebarGroupContent>
                                    <SidebarMenu>
                                        {itemslist.map((element, index) => {
                                            const Icon = element.icon;
                                            return (<SidebarMenuItem key={index}>
                                                <SidebarMenuButton className="hover:bg-gray-300" onClick={() => navigate(element.url)}>
                                                    <Icon className="text-yellow-700" />
                                                    <p className="font-semibold" >{element.title}</p>
                                                </SidebarMenuButton>
                                            </SidebarMenuItem>)
                                        })}
                                    </SidebarMenu>
                                </SidebarGroupContent>
                            </SidebarGroup>
                        </SidebarContent>
                        <SidebarFooter>
                            <SidebarGroup>
                                <SidebarGroupContent>
                                    <SidebarMenu>
                                        <SidebarMenuItem>
                                            <SidebarMenuButton>
                                                <UserIcon className="text-yellow-700 " />
                                                <div className="flex flex-col">
                                                    <p className="font-semibold">{username}</p>
                                                    <p className="font-medium text-[11px]">{useremail}</p>
                                                </div>
                                                <p onClick={logout} className="bg-red-600 p-2 rounded-lg active:translate-y-1"><LogOut className="w-4 h-4 text-white" /></p>
                                            </SidebarMenuButton>
                                        </SidebarMenuItem>
                                    </SidebarMenu>
                                </SidebarGroupContent>
                            </SidebarGroup>
                        </SidebarFooter>
                        <SidebarRail />
                    </Sidebar>
                    <main className="flex flex-col w-full h-screen overflow-auto p-3" style={{ scrollbarWidth: "none" }}>
                        <div className="flex w-full flex-wrap gap-5  rounded-lg p-5 max-md:pb-20">
                            <Outlet />
                        </div>
                    </main>
                    <div className="fixed bottom-0 left-0  right-0 z-50 bg-white border-t shadow-md md:hidden">
                        <div className="flex justify-evenly py-2">
                            {itemslist.map((item, idx) => {
                                const Icon = item.icon;
                                return (
                                    <button
                                        key={idx}
                                        onClick={() => navigate(item.url)}
                                        className="flex flex-col items-center text-sm rounded-lg p-2 text-black hover:bg-gray-300">
                                        <Icon className="h-6 w-6 text-yellow-700" />
                                        <span className="text-xs font-semibold">{item.title}</span>
                                    </button>
                                );
                            })}
                        </div>
                    </div>
                </div>
            </SidebarProvider>
        </>
    )
}

export default Mainrenderpage;