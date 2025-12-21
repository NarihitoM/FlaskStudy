import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { type Quizset } from "@/types/response";
import { aiquiz } from "@/services/api/aiapi";
import { ArrowLeft, ArrowRight } from "lucide-react";
import { AnimatePresence, motion } from "framer-motion";
import { getprofile, storehistory } from "@/services/api/userapi";
import { gettoken, removetoken } from "@/lib/auth";
import { Card, CardDescription, CardFooter, CardTitle } from "@/components/ui/card";

const Quiz = () => {
    const { title } = useParams<{ title?: string }>();
    const [Quiz, setQuiz] = useState<Quizset[]>([]);
    const [toggle, settoggle] = useState<boolean>(true);
    const [togglewarning, settogglewarning] = useState<boolean>();
    const [number, setnumber] = useState<number>(0);
    const [difficult, setdifficult] = useState<string>("Please provide Level");
    const [togglecheck, settogglecheck] = useState<boolean>(false);
    const [openquiz, setopenquiz] = useState<boolean>();
    const [total, settotal] = useState<number>(0);
    const [currentindex, setcurrentindex] = useState<number>(0);
    const [selectedindex, setSelectedIndex] = useState<(number | null)[]>([]);
    const [isfetching, setisfetching] = useState<boolean>();
    const [toggleresult, settoggleresult] = useState<boolean>();
    const [time, settime] = useState<number>(0);
    const token = gettoken();
    const [id, setid] = useState<string>("");
    const navigate = useNavigate();

    {/*live login to fetch existing userid*/ }
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
                console.log(id);
            }
            const exp = result.user.exp;
            const expireat = exp * 1000;
            const timeleft = expireat - Date.now();

            logoutTimer = setTimeout(() => {
                removetoken();
                navigate("/login");
            }, timeleft);
        };
        getpf();
        return () => {
            if (logoutTimer) clearTimeout(logoutTimer);
        }
    }, [])

    {/*Send the Backend To Ai For Data */ }
    const send = async (title: string, number: number, difficult: string) => {
        settoggle(false);
        setisfetching(true);
        try {
            const result = await aiquiz(title, number.toString(), difficult)
            if (result && result.success) {
                setopenquiz(true);
                setQuiz([result.data]);
                localStorage.setItem("QuizData", JSON.stringify(result.data));
                console.log(result.data);
                console.log(Quiz);
                setisfetching(false);
            }
        }
        catch (err: any) {
            console.log(err);
        }
    }

    {/*Timer For Quiz Auto Terminate Session When Times Out*/ }
    useEffect(() => {
        if (!openquiz || time <= 0)
            return;
        const timeinterval = setInterval(() => {
            settime(prev => {
                if (prev <= 1) {
                    clearInterval(timeinterval);
                    settime(0);
                    newhistory("Failed", total.toString());
                    localStorage.removeItem("QuizProgress");
                    setopenquiz(false);
                    settoggle(true);
                    return 0;
                }
                return prev - 1;
            });
        }, 1000);
        return () => clearInterval(timeinterval);
    }, [openquiz]);

    {/*Auto Saving On Web When Answering Prevent From Going to Start When Refresh*/ }
    useEffect(() => {
        if (Quiz.length > 0 && time! > 0) {
            const dataToSave = {
                title: Quiz[0].title,
                quiz: Quiz[0].quiz,
                timer: time,
                currentindex,
                selectedindex
            };
            localStorage.setItem("QuizProgress", JSON.stringify(dataToSave));
        }
    }, [Quiz, currentindex, selectedindex, time]);

    {/*Check Whether There is Quiz or not */ }
    useEffect(() => {
        const saved = localStorage.getItem("QuizProgress");
        if (saved) {
            const parsed = JSON.parse(saved);
            if (parsed?.quiz?.length > 0) {
                setQuiz([{
                    title: parsed.title,
                    quiz: parsed.quiz
                }]);
                setcurrentindex(parsed.currentindex || 0);
                settime(parsed.timer || null);
                setSelectedIndex(parsed.selectedindex || []);
                setopenquiz(true);
                settoggle(false);
            }
        }
    }, []);

    {/*Next page toggle */ }
    const nextpage = () => {
        if (selectedindex[currentindex] === null || selectedindex[currentindex] === undefined) {
            settogglewarning(true);
            setTimeout(() => {
                settogglewarning(false);
            }, 3000);
            return;
        }
        setcurrentindex(prev => prev === Quiz[0].quiz.length - 1 ? prev : prev + 1);
    }
    {/*Prev page toggle*/ }
    const prevpage = () => {
        setcurrentindex(prev => prev === 0 ? prev : prev - 1);
    };

    {/*calculate the result */ }
    const calculate = () => {
        localStorage.removeItem("QuizProgress");
        settogglecheck(false);
        settoggleresult(true);
        for (let i = 0; i < Quiz[0].quiz.length; i++) {
            const isselect = selectedindex[i];
            if (isselect !== null && Quiz[0].quiz[i].choices[isselect] === Quiz[0].quiz[i].answer) {
                settotal(prev => prev + 1);
            }
        }
    }
    {/*See The Answer */ }
    const check = () => {
        if (selectedindex[currentindex] === null || selectedindex[currentindex] === undefined) {
            settogglewarning(true);
            setTimeout(() => {
                settogglewarning(false);
            }, 3000);
            return;
        }
        settogglecheck(true);
        setopenquiz(false);
    }
    {/*toggle to render changes in Quizsetter and Quiz*/ }
    const handlequiz = () => {
        setopenquiz(true);
        settogglecheck(false);
    }

    {/*Store History To Database */ }
    const newhistory = async (status: string, score: string) => {
        const stored = localStorage.getItem("QuizData");
        if (!stored) {
            console.error("No Quizdata in localStorage");
            return;
        }
        if (!id) return;
        const data: Quizset = JSON.parse(stored);
        try {
            const result = await storehistory(id, data, status, score);
            if (result && result.success) {
                console.log("Store");
            }
        } catch (err: any) {
            console.log(err);
        }
    };

    {/*Retake the quiz again*/ }
    const requiz = () => {
        settoggle(true);
        settogglecheck(false);
        setopenquiz(false);
        settoggleresult(false);
        newhistory("Completed", total.toString())
        setSelectedIndex([]);
        setQuiz([]);
        setcurrentindex(0);
        setTimeout(() => {
            localStorage.removeItem("QuizProgress");
            window.location.reload()

        }, 2000);
    }
    {/*Terminate the current Quiz */ }
    const Terminate = () => {

        newhistory("Failed", total.toString());
        setTimeout(() => {
            localStorage.removeItem("QuizProgress");
            window.location.reload()

        }, 2000);
    }
    return (
        <> {isfetching &&
            <div className="fixed inset-0 bg-white/10 z-40 pointer-events-auto"></div>
        }
            {toggle &&
                <>
                    <Card className="flex flex-col justify-center max-md:flex-col items-center gap-4 p-5 md:absolute md:top-1/2 md:left-1/2 md:-translate-x-1/2 md:-translate-y-1/2 shadow-lg rounded-lg">
                        <CardTitle><h1 className="tex-yellow-600 text-3xl font-bold">Ready To Take Quiz?</h1></CardTitle>
                        <CardDescription>
                            <p className="font-bold">Related Title : <span className="text-yellow-600 ">{title}</span></p>
                            <div className="flex flex-col gap-2 w-full">
                                <p className="font-medium">Number Of Quiz : <span className="text-yellow-600">{number}</span></p>
                                <p className="font-medium">Difficulty : <span className="text-yellow-600">{difficult}</span></p>
                                <p className="font-medium">Time : <span className="text-yellow-600">{time}</span></p>
                                <div className="w-full flex flex-row">
                                    <h1 className="font-medium">
                                        Quiz Number:
                                    </h1>
                                    <select value={number} onChange={(e) => setnumber(Number(e.target.value))} className="w-full border p-1 rounded-lg border-yellow-600">
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
                                </div>
                                <div className="flex flex-row w-full gap-5 justify-evenly items-center">
                                    <h1 className="font-medium">Level: </h1>
                                    <select value={difficult} onChange={(e) => setdifficult(e.target.value)} className="p-1 w-full rounded-lg border border-yellow-600">
                                        <option value="" disabled>
                                            Select an option
                                        </option>
                                        <option value="Easy">Easy</option>
                                        <option value="Medium">Medium</option>
                                        <option value="Hard">Hard</option>
                                    </select>
                                </div>
                                <div className="flex flex-row gap-5 justify-center items-center">
                                    <h1 className="font-medium">Time: </h1>
                                    <select value={time} onChange={(e) => settime(Number(e.target.value))} className="p-1 w-full rounded-lg border border-yellow-600">
                                        <option value="" disabled>
                                            Select an option
                                        </option>
                                        <option value={300}>5 minute(For Easy With 10 Quizes)</option>
                                        <option value={600}>10 minute(For Medium With 20 Quizes)</option>
                                        <option value={900}>15 minute(For Hard With 30 Quizes)</option>
                                    </select>
                                </div>
                            </div>
                        </CardDescription>

                        <CardFooter>
                            <button className="p-2 shadow-lg font-medium text-white bg-yellow-600 rounded-lg active:translate-y-1" onClick={() => {
                                if (!title || !number || !difficult || !time)
                                    return;
                                send(title, number, difficult)
                            }}>Generate</button>
                        </CardFooter>
                    </Card>
                </>
            }
            {togglewarning &&
                <AnimatePresence>
                    <motion.div
                        initial={{ opacity: 0, scale: 0.8 }}
                        animate={{ opacity: 1, scale: 1 }}
                        exit={{ opacity: 0, scale: 0.8 }}
                        transition={{ duration: 0.2 }}
                        className="absolute z-1000 bottom-5 right-3 font-medium bg-amber-200 text-yellow-600 rounded-lg shadow-2xl p-5">
                        <h1 className="text-red-600">Please choose the answer</h1>
                    </motion.div>
                </AnimatePresence>
            }
            {isfetching ?
                (<div className="p-5 fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 flex w-full justify-center gap-3 items-center">
                    <span className="w-8 h-8 border-4 border-t-yellow-600 border-gray-200 rounded-full animate-spin"></span>
                    <h1 className="text-gray-700 font-semibold">Loading</h1>
                </div>) :
                (!toggle && openquiz && Quiz?.[0]?.quiz?.length > 0 && (<>
                    <h1 className="text-3xl font-bold text-yellow-600">{title} <span className="text-black">(Quiz)</span></h1>

                    <div className="flex flex-col items-center w-full justify-center gap-6 py-10">
                        <p className="text-black font-medium">Time Left : <span className="text-red-600">{time}</span></p>
                        <div className="bg-yellow-600 p-8  w-[1000px] max-md:w-[300px]   max-w-full rounded-lg">
                            <p className="text-white font-bold"> <div dangerouslySetInnerHTML={{ __html: Quiz[0].quiz[currentindex].question || "" }} /></p>
                        </div>
                        <div className="flex flex-col w-[1000px] max-md:w-[300px] justify-center items-center gap-5">
                            {Quiz[0].quiz[currentindex].choices.map((element, index) => {
                                const isselect = selectedindex[currentindex] === index;
                                return (
                                    <div key={index}
                                        onClick={() => setSelectedIndex((prev) => {
                                            const updated = [...prev];
                                            updated[currentindex] = index;
                                            return updated;
                                        })} className={`p-2 shadow-lg rounded-lg w-full bg-gray-300 hover:bg-gray-300 font-medium hover:bg- ${isselect ? "bg-yellow-600" : "bg-white"}`}>
                                        <div dangerouslySetInnerHTML={{ __html: element || "" }} />
                                    </div>)
                            })}
                        </div>
                        <div className="flex gap-4">
                            <button disabled={currentindex === 0} className="flex flex-row gap-1 bg-gray-300 rounded-lg p-2 active:translate-y-1 disabled:opacity-50" onClick={prevpage}><ArrowLeft></ArrowLeft>Prev</button>
                            <button className="bg-red-600 p-1 rounded-lg text-white" onClick={Terminate}>Terminate</button>
                            {currentindex === Quiz[0].quiz.length - 1 && <button className="text-white bg-green-600 p-2 rounded-lg" onClick={check}>Check</button>}
                            <button disabled={currentindex === Quiz[0].quiz.length - 1} className="flex flex-row gap-1 text-white bg-yellow-700 rounded-lg p-2 active:translate-y-1 disabled:opacity-50" onClick={nextpage}><ArrowRight></ArrowRight>Next</button>
                        </div>
                        <p className="text-sm text-gray-500">
                            {currentindex + 1} / {Quiz[0].quiz.length}
                        </p>
                    </div>
                </>
                ))}
            {togglecheck &&
                <div className="overflow-auto flex flex-col gap-3 ">
                    <h1 className="font-bold text-3xl text-yellow-600">Answer: </h1>
                    {Quiz[0].quiz.map((element, index) => {
                        const isselect = selectedindex[index];
                        const selectanswer = isselect !== null ? element.choices[isselect] : <span className="text-red-600">No Answer Provided</span>;
                        return (
                            <p key={index} className="font-medium">
                                {index + 1}. {selectanswer}
                            </p>
                        )
                    })}
                    <button className="bg-yellow-600 p-2 rounded-lg font-medium active:translate-y-1" onClick={handlequiz}>Back To Quiz</button>
                    <button className="bg-green-600 p-2 rounded-lg font-medium active:translate-y-1" onClick={calculate}>Calculate</button>
                </div>
            }
            {toggleresult && (
                <div className="flex flex-col shadow-lg p-4 justify-center items-center gap-3">
                    <h1 className="text-2xl font-bold text-yellow-600">Result : </h1>
                    <p className="font-bold text-xxl  ">Your Score : <span className="text-yellow-600">{total}/{Quiz[0].quiz.length}</span></p>
                    <button className="bg-yellow-600 rounded-lg p-1 text-white active:translate-y-1" onClick={requiz}>Requiz</button>
                </div>
            )}
        </>
    )
}

export default Quiz;