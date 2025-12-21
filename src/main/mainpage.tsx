import { useState, useRef, type FormEvent } from "react";
import Logo from "../assets/mainlogo.png";
import Aboutus from "../assets/aboutus.png";
import { Facebook, Mail, Menu, Phone, X, Check, Youtube } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { ChevronDown } from "lucide-react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import featureslist from "@/lib/features";
import faq from "@/lib/faq";
import { AnimatePresence, motion } from "framer-motion";
import React from "react";
import { form } from "@/services/api/userapi";
import { gettoken } from "@/lib/auth";

const Mainpage = () => {
    const [navbarbool, setnavbarbool] = useState<boolean>(false);
    const [showdetail, setshowdetail] = useState<number | null>(null);
    const [email, setemail] = useState<string>("");
    const [loading, setloading] = useState<boolean>();
    const [name, setname] = useState<string>("")
    const [text, settext] = useState<string>("");
    const [toast, setToast] = useState<boolean>(false);
    const [bool, setbool] = useState<boolean>();
    const [response, setresponse] = useState<any>(<X className="text-red-600" />);
    const [message, setmessage] = useState<string>("");
    const home = useRef<HTMLElement>(null);
    const features = useRef<HTMLElement>(null);
    const about = useRef<HTMLElement | null>(null);
    const faqref = useRef<HTMLElement | null>(null);
    const contact = useRef<HTMLElement | null>(null);

    const token = gettoken();

    const emailregex = /^[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,}$/;

    const navigate = useNavigate();
    const togglebar = () => {
        setnavbarbool(prev => !prev);
    }

    const handlesubmit = async (e: FormEvent) => {
        e.preventDefault();
        if (!name) {
            setToast(true);
            setmessage("Please enter name.");
            setTimeout(() => {
                setToast(false);
                setmessage("");
            }, 3000);
        }
        else if (!email) {
            setToast(true);
            setmessage("Please enter email.");
            setTimeout(() => {
                setToast(false);
                setmessage("");
            }, 3000);
        }
        else if (!emailregex.test(email)) {
            setToast(true);
            setmessage("Please enter valid email address.");
            setTimeout(() => {
                setToast(false);
                setmessage("");
            }, 3000);
        }
        else if (!text) {
            setToast(true);
            setmessage("Please enter message.");
            setTimeout(() => {
                setToast(false);
                setmessage("");
            }, 3000);
        }
        else {
            setbool(true);
            setToast(false);
            setloading(true);
            try {
                const result = await form(name, email, text);
                if (result && result.success) {
                    setToast(true);
                    setbool(false);
                    setloading(false);
                    setresponse(<Check className="text-green-600" />);
                    setmessage(result.message || "Sent successful.");
                    setTimeout(() => {
                        setToast(false);
                        setmessage("");
                    }, 3000);
                }
            }
            catch (err: any) {
                setToast(true);
                setbool(false);
                setloading(false);
                setmessage(err?.response?.data.message || "Unexpected Error");
                setTimeout(() => {
                    setToast(false);
                    setmessage("");
                }, 3000);
            }
        }
    }

    const handleref = (refobject: React.RefObject<HTMLElement | null>) => {
        refobject.current?.scrollIntoView({ behavior: "smooth" });
        setnavbarbool(false);
    }

    return (
        <>
            {/* Toast */}
            {bool &&
                <div className="fixed inset-0 z-40 bg-white/25 pointer-events-auto overflow-hidden">
                </div>
            }
            {loading && (
                <div className="fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 p-5 bg-white shadow-lg z-1000 flex justify-center gap-3 items-center rounded-lg">
                    <span className="w-8 h-8 border-4 border-t-yellow-600 border-gray-200 rounded-full animate-spin"></span>
                    <h1 className="text-gray-700 font-semibold">Loading</h1>
                </div>
            )
            }
            <AnimatePresence>
                {toast && !loading && (
                    (<motion.div
                        initial={{ opacity: 0, scale: 0.8, y: 20 }}
                        animate={{ opacity: 1, scale: 1, y: -20 }}
                        exit={{ opacity: 0, scale: 0.8, y: 20 }}

                        className="fixed flex flex-row gap-3 items-center bottom-3 border border-gray-400 left-1/2 -translate-x-1/2 z-2000 bg-white px-4 py-2 rounded-lg shadow-lg">
                        {response}<p className={message === "Sent successful." ? "text-green-600 font-semibold" : "text-red-600 font-semibold"}>{message}</p>
                    </motion.div >)
                )}
            </AnimatePresence>
            {/*  Header  */}
            <header className="p-3 z-1000 fixed w-full bg-white border shadow-[0_0_5px_0_gray] border-white">
                <div className=" flex justify-between items-center">
                    <div className="flex flex-row justify-center items-center">
                        <img className="w-17 h-17" src={Logo} />
                        <div className="flex flex-col ">
                            <h1 className="text-2xl font-bold text-black">
                                <span className="text-yellow-700">F</span>laskS
                            </h1>
                            <p className="text-gray-500 text-[13px] font-medium">Study</p>
                        </div>
                    </div>
                    <div className="flex flex-row justify-center items-center gap-2 max-md:hidden">
                        <p onClick={() => handleref(home)} className="text-black cursor-pointer list-none font-medium p-1 hover:bg-gray-100 hover:rounded-lg">Home</p>
                        <p onClick={() => handleref(about)} className="text-black cursor-pointer list-none font-medium p-1 hover:bg-gray-100 hover:rounded-lg">About</p>
                        <p onClick={() => handleref(features)} className="text-black cursor-pointer list-none font-medium p-1 hover:bg-gray-100 hover:rounded-lg">Features</p>
                        <p onClick={() => handleref(faqref)} className="text-black cursor-pointer list-none font-medium p-1 hover:bg-gray-100 hover:rounded-lg">FAQ</p>
                        <p onClick={() => handleref(contact)} className="text-black cursor-pointer list-none font-medium p-1 hover:bg-gray-100 hover:rounded-lg">Contact</p>
                        {token && <p onClick={() => navigate("/dashboard")} className="text-black cursor-pointer list-none font-medium p-1 hover:bg-gray-100 hover:rounded-lg">Study</p>
                        }
                        <button onClick={() => navigate("/signup")} className="bg-yellow-700 p-2 rounded-lg font-medium text-[14px] text-white hover:bg-gray-600 active:translate-y-1">Sign in</button>
                    </div>
                    <button className="md:hidden text-3xl" onClick={togglebar}>{navbarbool ? <X /> : <Menu />}</button>
                    {navbarbool &&
                        <div className="absolute z-1000 md:hidden top-20 left-0 pb-5 w-full bg-white flex flex-col justify-center items-center gap-2">
                            <p onClick={() => handleref(home)} className="text-black cursor-pointer list-none font-medium p-1 hover:bg-gray-100 hover:rounded-lg">Home</p>
                            <p onClick={() => handleref(about)} className="text-black cursor-pointer list-none font-medium p-1 hover:bg-gray-100 hover:rounded-lg">About</p>
                            <p onClick={() => handleref(features)} className="text-black cursor-pointer list-none font-medium p-1 hover:bg-gray-100 hover:rounded-lg">Features</p>
                            <p onClick={() => handleref(faqref)} className="text-black cursor-pointer list-none font-medium p-1 hover:bg-gray-100 hover:rounded-lg">FAQ</p>
                            <p onClick={() => handleref(contact)} className="text-black cursor-pointer list-none font-medium p-1 hover:bg-gray-100 hover:rounded-lg">Contact</p>
                            {token && <p onClick={() => navigate("/dashboard")} className="text-black cursor-pointer list-none font-medium p-1 hover:bg-gray-100 hover:rounded-lg">Study</p>
                            }
                            <button onClick={() => navigate("/signup")} className="bg-yellow-700 p-2 rounded-lg font-medium text-[14px] text-white hover:bg-gray-600 active:translate-y-1">Sign in</button>
                        </div>
                    }
                </div>
            </header >
            <main className="grow">
                {/* Section-1 */}
                <section ref={home} className="h-screen p-3 w-full bgimage">
                    <div className="flex flex-col justify-center items-center gap-2 h-screen">
                        <h1 className="font-bold text-5xl max-md:text-4xl">Study <span className="text-yellow-700">Smarter</span></h1>
                        <h1 className="font-bold text-4xl max-md:text-3xl ">Learn <span className="text-yellow-700">Faster!</span></h1>
                        <p className="font-medium text-xl max-md:text-[15px] text-center">Everything you need to study efficiently — all in one place.{<br />}
                            Reduce study time. Improve memory. Boost grades.{<br />}
                            Take notes, create flashcards, and revise — instantly.</p>
                        <button onClick={() => navigate("/login")} className="bg-yellow-700 p-2 rounded-lg font-medium text-[14px] text-white  hover:bg-gray-600 active:translate-y-1">Start Today</button>

                    </div>
                </section>

                {/* Section-2 */}
                <section ref={about} className="h-auto w-full max-md:py-15">
                    <div className="flex flex-col justify-center items-center h-screen">
                        <h1 className="text-4xl font-bold text-black">
                            <span className="text-yellow-700">About</span>Us
                        </h1>
                        <div className="flex flex-row justify-between items-center max-md:justify-center max-md:flex-col max-md:items-center px-10 gap-10 mt-10">
                            <img src={Aboutus} className="-z-50 w-70 h-70 max-md:w-50 max-md:h-50 rounded-lg shadow-[0_0_10px_0_black] hover:scale-105 transition-all" alt="Flasks" />
                            <div className="max-w-xl text-center md:text-left">
                                <h2 className="max-md:text-xl text-2xl font-bold text-black mb-4">
                                    About Flasks Study
                                </h2>
                                <p className="text-gray-900 max-md:text-base mb-3">
                                    <span className="font-bold text-yellow-700">Flasks Study</span> helps students master subjects with flashcards, memory techniques, and organized note-taking tools.
                                    Whether you’re preparing for exams or learning new topics, our platform makes studying more effective and enjoyable.
                                </p>
                                <button className="bg-yellow-600 p-2 rounded-lg font-medium text-[14px] text-white hover:bg-gray-600 active:translate-y-1">Create an account</button>
                            </div>
                        </div>
                    </div>
                </section>
                {/* Section-3 */}
                <section ref={features} className="h-auto w-full max-md:py-20 py-5">
                    <div className="flex flex-col justify-center items-center h-screen">
                        <h1 className="text-4xl font-bold text-black">
                            <span className="text-yellow-700">F</span>eatures
                        </h1>
                        <div className="flex justify-center items-center flex-wrap gap-10 mt-10">
                            {featureslist.map((element, index) => {
                                const Icon = element.icon;
                                return (
                                    <Card key={index} className="p-5 w-50 shadow-lg hover:scale-105 transition-all">
                                        <CardHeader>
                                            <Icon className="text-yellow-700" />
                                            <CardTitle>
                                                {element.title}
                                            </CardTitle>
                                            <CardDescription className="font-semibold">
                                                {element.description}
                                            </CardDescription>
                                        </CardHeader>
                                    </Card>
                                )
                            })}
                        </div>
                    </div>
                </section>
                {/* Section-4 */}
                <section ref={faqref} className="h-auto w-full">
                    <div className="flex flex-col justify-center items-center h-screen">
                        <h1 className="text-4xl font-bold text-black text-center">
                            <span className="text-yellow-700">Frequently</span> Ask Questions?
                        </h1>
                        <div className="flex justify-center items-center w-full px-10 flex-wrap gap-5 mt-10">
                            {faq.map((element, index) => {
                                const Icon = element.icon;
                                return (
                                    <React.Fragment key={index}>
                                        <div onClick={() => setshowdetail(prev => (prev === index ? null : index))} className="w-5/6 flex flex-row gap-5 justify-between bg-yellow-700 text-white p-3 rounded-lg">
                                            <Icon className="text-black" /> <p className="font-semibold">{element.question}</p>
                                            <ChevronDown className={`text-black transition-transform duration-200 ${showdetail === index ? "rotate-180" : ""}`} />
                                        </div>
                                        <AnimatePresence>
                                            {
                                                showdetail === index &&
                                                <motion.div
                                                    initial={{ opacity: 0, scale: 0.9 }}
                                                    animate={{ opacity: 1, scale: 1 }}
                                                    exit={{ opacity: 0, scale: 0.8 }}
                                                    className="bg-white font-semibold shadow-lg rounded-lg p-3 w-5/6">
                                                    <p><span className="font-bold text-yellow-600">Ans:</span>{element.answer}</p>
                                                </motion.div >

                                            }</AnimatePresence>
                                    </React.Fragment>
                                )
                            })}
                        </div>
                    </div>
                </section >
                {/* Section-5 */}
                <section ref={contact} className="w-full h-auto max-md:py-45 py-10">
                    <div className="flex flex-col justify-center items-center h-screen">
                        <h1 className="text-4xl font-bold text-black">
                            <span className="text-yellow-700">Contact</span>Us
                        </h1>
                        <div className="flex flex-row justify-between items-center gap-10 w-8/9 px-20 mt-10 max-md:justify-center max-md:items-center max-md:flex-col">
                            <div className="flex flex-col pb-20">
                                <h1 className="font-bold text-2xl">
                                    Contact Information
                                </h1>
                                <div className="flex flex-col justify-center items-start mt-10 gap-3">
                                    <div className="flex flex-row gap-2">
                                        <Mail className="animate-bounce text-gray-500" /><p className="font-bold text-yellow-700">heinboss234@gmail.com</p>
                                    </div>
                                    <div className="flex flex-row gap-2">
                                        <Phone className="animate-bounce text-gray-500" /><p className="font-bold text-yellow-700">09986287158</p>
                                    </div>
                                </div>
                            </div>
                            <form onSubmit={handlesubmit}>
                                <Card className="p-5 w-[400px] max-md:w-full bg-amber-600 shadow-lg transition-all hover:scale-102">
                                    <CardTitle className="text-center">
                                        Tell us about your experience or review?
                                    </CardTitle>
                                    <CardContent className="flex flex-col gap-3 ">
                                        <input type="text" value={name} onChange={(e) => setname(e.target.value)} className="bg-white px-3 py-1 rounded-lg font-semibold placeholder:text-[14px] placeholder:font-semibold text-[14px]" placeholder="Enter Name" />
                                        <input type="text" value={email} onChange={(e) => setemail(e.target.value)} className="bg-white px-3 py-1 rounded-lg font-semibold placeholder:text-[14px] placeholder:font-semibold text-[14px]" placeholder="Enter Email" />
                                        <textarea value={text} onChange={(e) => settext(e.target.value)} placeholder="Enter Message" className="bg-white font-semibold placeholder:font-semibold resize-none rounded-lg h-[170px] p-3 text-[14px]" style={{ scrollbarWidth: "none" }}>
                                        </textarea>
                                        <button type="submit" className="bg-black text-white rounded-lg py-2 active:translate-y-1 hover:bg-gray-700">Submit</button>
                                    </CardContent>
                                </Card>
                            </form>
                        </div>
                    </div>
                </section>
            </main>
            {/* Footer */}
            <footer className="w-full bg-black text-white py-10 px-5 justify-around">
                <div className="max-w-7xl mx-auto flex flex-col md:flex-row justify-between gap-10">
                    <div className="flex flex-col gap-3">
                        <div className="flex items-center gap-2">
                            <img src={Logo} alt="Logo" className="w-10 h-10" />
                            <h1 className="text-2xl font-bold">
                                <span className="text-yellow-500">F</span>laskS
                            </h1>
                        </div>
                        <p className="text-gray-300 text-sm font-semibold max-w-xs">
                            Study smarter, learn faster. Flashcards, notes, and memory tools all in one place.
                        </p>
                        <p className="text-sm max-w-xs text-gray-300 font-semibold"> Developed by <a href="https://narihito-portfolio.vercel.app" className="text-blue-600">Narihito</a></p>
                    </div>
                    <div className="flex flex-col gap-2">
                        <h2 className="font-semibold text-lg">Quick Links</h2>
                        <p onClick={() => handleref(home)} className="text-gray-300 hover:text-yellow-500 transition-colors">Home</p>
                        <p onClick={() => handleref(about)} className="text-gray-300 hover:text-yellow-500 transition-colors">About</p>
                        <p onClick={() => handleref(features)} className="text-gray-300 hover:text-yellow-500 transition-colors">Features</p>
                        <p onClick={() => handleref(faqref)} className="text-gray-300 hover:text-yellow-500 transition-colors">FAQ</p>
                        <p onClick={() => handleref(contact)} className="text-gray-300 hover:text-yellow-500 transition-colors">Contact</p>
                    </div>
                    <div className="flex flex-col gap-2">
                        <h2 className="font-semibold text-lg">Contact</h2>
                        <div className="flex items-center gap-2">
                            <Mail className="w-5 h-5" />
                            <span>heinboss234@gmail.com</span>
                        </div>
                        <div className="flex items-center gap-2">
                            <Phone className="w-5 h-5" />
                            <span>09986287158</span>
                        </div>
                    </div>
                </div>

                <div className="mt-10 text-center text-gray-400 text-sm mb-0">
                    &copy; {new Date().getFullYear()} FlaskS. All rights reserved.
                </div>
            </footer>

        </>
    )
}

export default Mainpage;