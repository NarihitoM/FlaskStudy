import { aiupload } from "@/services/api/aiapi";
import { filestore, getprofile, getstore } from "@/services/api/userapi";
import type { SStorage } from "@/types/types";
import { AnimatePresence, motion } from "framer-motion";
import { File, Trash, X } from "lucide-react";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Check } from "lucide-react";
import { deletetitle } from "@/services/api/userapi";
import React from "react";
import { gettoken, removetoken } from "@/lib/auth";
import { Card, CardDescription, CardFooter } from "@/components/ui/card";

const Study = () => {
    const navigate = useNavigate();
    const [clicktogglemats, setclicktogglemats] = useState<boolean>(false);
    const [id, setid] = useState<string>("");
    const [title, settitle] = useState<SStorage[]>([]);
    const [bool, setbool] = useState<boolean>(false);
    const token = gettoken()
    const [toast, settoast] = useState<boolean>();
    const [loading, setloading] = useState<boolean>();
    const [message, setmessage] = useState<string>("");
    const [response, setresponse] = useState<any>();
    const [isfetching, setisfetching] = useState<boolean>(true);
    const [file, setfile] = useState<File | null>(null);
    const [number, setnumber] = useState<number | null>();

    {/*live login to fetch userid*/}

    let logoutTimer: ReturnType<typeof setTimeout>;

    useEffect(() => {
        const getpf = async () => {
            if (!token) {
                navigate("/login");
                return;
            }
            const result = await getprofile(token);
            if (result && result.success) {
                setid(result.user.id);
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

    {/*Select the file */}
    const filechange = async (e: any) => {
        setfile(e.target.files?.[0]);
        if (!file)
            return;
    }

    {/*submit the file */}
    const submit = async (file: File, number: number) => {
        const formdata = new FormData();
        formdata.append("file", file);
        formdata.append("number", number.toString());
        try {
            setbool(true);
            setclicktogglemats(prev => !prev);
            const result = await aiupload(formdata);
            if (result && result.success) {
                setbool(false);
                console.log(result.content);
                setTimeout(() => {
                    window.location.reload()
                }, 1000);
            }
            await filestore(id, result.content);
        }
        catch (err: any) {
            setbool(false);
            alert(err?.response?.data.message || "Fail To Upload");
        }
    }
    {/*fetch the data again to display */}
    useEffect(() => {
        const fetchdata = async () => {
            try {
                if (!token)
                    return;
                setisfetching(true);
                const result = await getstore(token);
                if (result && result.success) {
                    settitle(result.data);
                    setisfetching(false);
                }
            }
            catch (err: any) {
                console.log(err?.response?.data.message);
                setisfetching(false);
            }
        }
        fetchdata();
    }, [])

    {/*delete the title via index */}
    const deleteindex = async (index: number) => {
        settoast(true);
        setloading(true);
        try {
            const result = await deletetitle(index, token!);
            if (result && result.success) {
                setresponse(<Check className="text-green-600 w-12 h-12" />)
                setmessage(result.message || "Delete Successful");
                setloading(false);
                setTimeout(() => {
                    settoast(false);
                    window.location.reload();
                }, 1000);
            }
        }
        catch (err: any) {
            setresponse(<X className="text-red-600 w-12 h-12" />)
            setmessage(err?.response?.data.message || "Delete Successful");
            setloading(false);
            setTimeout(() => {
                settoast(false);
            }, 1000);
        }
    }
    return (
        <>
            {(bool || isfetching || toast) &&
                <div className="fixed inset-0 bg-white/10 z-40 pointer-events-auto"></div>
            }
            {bool &&
                <div className="fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 p-5 bg-white shadow-lg z-1000 flex justify-center gap-3 items-center rounded-lg">
                    <span className="w-8 h-8 border-4 border-t-yellow-600 border-gray-200 rounded-full animate-spin"></span>
                    <h1 className="text-gray-700 font-semibold">Uploading</h1>
                </div>
            }
            {toast &&
                <div className="fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 p-5 bg-white shadow-lg z-1000 flex justify-center gap-3 items-center rounded-lg">
                    {loading ? <span className="w-8 h-8 border-4 border-t-yellow-600 border-gray-200 rounded-full animate-spin"></span> : response}
                    <h1 className="text-gray-700 font-semibold">{loading ? "Deleting..." : message === "Delete Successful" ? <p className="text-green-600">{message}</p> : <p className="text-red-700">{message}</p>}</h1>
                </div>
            }
            <AnimatePresence>
                {clicktogglemats &&
                    <motion.div
                        initial={{ opacity: 0, scale: 1, y: 20 }}
                        animate={{ opacity: 1, scale: 1, y: -20 }}
                        exit={{ opacity: 0, scale: 1, y: 20 }}
                        transition={{ duration: 0.2 }}
                        className=" z-2000  fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2">
                        <Card className="bg-white justify-center items-center relative rounded-lg  shadow-lg p-10 flex flex-col gap-3">
                            <div className="absolute right-3 top-2">
                                <button className="active:bg-gray-200 active:translate-y-1 p-1 rounded-lg hover:bg-gray-100" onClick={() => { setclicktogglemats(prev => !prev); }}>
                                    <X className="text-yellow-600" />
                                </button></div>
                            <h1 className="font-bold text-3xl max-md:text-2xl text-center"><span className="text-yellow-600">Add</span> Materials</h1>
                            <label
                                htmlFor="fileUpload"
                                className="flex flex-col w-full items-center justify-center border-2 border-dashed border-yellow-500 rounded-lg p-6 cursor-pointer hover:bg-yellow-50 transition">
                                <File />
                                <p className="text-sm text-gray-600">
                                    <span className="font-semibold text-black">Click to upload</span>
                                </p>
                                <p className="text-xs text-gray-400 mt-1">
                                    PDF
                                </p>
                                <input
                                    id="fileUpload"
                                    type="file"
                                    onChange={filechange}
                                    accept=".pdf"
                                    className="hidden"
                                />
                            </label>
                            <CardDescription className="flex flex-col gap-3 max-md:gap-2">

                                <h1 className="font-medium text-center">How many questions you want to generate?</h1>
                                <select value={number ?? ""} onChange={(e) => setnumber(Number(e.target.value))} className="w-full border p-1 rounded-lg border-yellow-600">
                                    <option value="" disabled>
                                        Select an option
                                    </option>
                                    <option value={10}>
                                        10
                                    </option>
                                    <option value={20}>
                                        20
                                    </option>
                                    <option value={30}>
                                        30
                                    </option>
                                </select>
                                <div className="flex flex-col">
                                    <p className="font-medium max-md:text-[14px]">File: <span className="text-yellow-600">{file ? file.name : "No file"}</span></p>
                                    <p className="font-medium max-md:text-[14px]">Questions : <span className="text-yellow-600">{number ? number : "Please select number."}</span></p>
                                </div>
                            </CardDescription>
                            <CardFooter>
                                <button disabled={!file || !number || bool} onClick={() => { if (!file || !number) return; submit(file, number) }} className="p-2 shadow-lg font-medium w-full text-white bg-yellow-600 rounded-lg active:translate-y-1">Go</button>
                            </CardFooter>
                        </Card>
                    </motion.div>
                }
            </AnimatePresence >
            <h1 className="text-3xl font-bold"><span className="text-yellow-600">S</span>tudy</h1>
            <div className="w-full flex flex-row gap-3">
                <button onClick={() => setclicktogglemats(prev => !prev)} className="bg-yellow-600 text-white font-medium active:translate-y-1 p-2 w-full rounded-lg shadow-lg">+ Add Materials</button>
            </div>
            {isfetching ? (
                <div className="p-5 z-1000 flex w-full justify-center gap-3 items-center">
                    <span className="w-8 h-8 border-4 border-t-yellow-600 border-gray-200 rounded-full animate-spin"></span>
                    <h1 className="text-gray-700 font-semibold">Loading</h1>
                </div>
            ) :
                (<div className="flex flex-col w-full overflow-auto gap-3">
                    {title.map((element) => (
                        <React.Fragment key={element._id}>
                            {element.studies.length > 0 ? (element.studies.map((itemslist, index) => (
                                <div key={index} className="relative flex flex-row gap-3 bg-gray-200 p-3 rounded-lg ">
                                    <button onClick={() => deleteindex(index)} className="absolute right-3 top-3"><Trash className="text-red-600 w-6 active:translate-y-1" /></button>
                                    <File className="text-yellow-600" />
                                    <span className="font-medium  md:w-auto w-[200px] text-black" onClick={() => navigate(`/studydetail/${itemslist.title}`)}>{itemslist.title}</span>
                                </div>
                            ))) :
                                (
                                    <h1 className="text-yellow-600 font-medium">No Title found</h1>
                                )}
                        </React.Fragment>
                    ))}
                </div>)}
        </>
    )
}

export default Study;