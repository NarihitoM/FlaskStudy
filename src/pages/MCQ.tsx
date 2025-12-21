import { getstore } from "@/services/api/userapi";
import { type Array, type SStorage, type Response } from "@/types/response";
import { ArrowLeft, ArrowRight } from "lucide-react";
import { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import { AnimatePresence, motion } from "framer-motion";
import { gettoken } from "@/lib/auth";

const MCQ = () => {

    const { title } = useParams<{ title?: string }>();
    const [MCQ, setMCQ] = useState<SStorage[]>([]);
    const [currentindex, setCurrentIndex] = useState<number>(0);
    const [isfetching, setisfetching] = useState<boolean>(true);
    const token = gettoken();
    const [selectedIndex, setSelectedIndex] = useState<(number | null)[]>([]);
    const [toggle, settoggle] = useState<boolean>();

    {/* Fetching data from backend via token key */ }
    useEffect(() => {
        setisfetching(true);
        const fetchdata = async () => {
            try {
                const result = await getstore(token);
                if (result && result.success) {
                    setMCQ(result.data);
                }
            } catch (err: any) {
                console.log(err?.response?.data?.message);
            } finally {
                setisfetching(false);
            }
        }
        fetchdata();
    }, [token]);

    const findquestion: Array | undefined = MCQ?.[0]?.studies?.find((element: any) => element.title === title);
    const questionlist: Response[] = findquestion?.response ?? [];



    {/* Next page */ }
    const nextpage = () => {
        if (selectedIndex[currentindex] == null) {
            settoggle(true);
            setTimeout(() => settoggle(false), 2000);
            return;
        }
        setCurrentIndex(index => index < questionlist.length - 1 ? index + 1 : index);
    }

    {/* Prev page */ }
    const prevpage = () => {
        setCurrentIndex(index => index > 0 ? index - 1 : index);
    }

    {/* Loading screen */ }
    if (isfetching) {
        return (
            <>
                <div className="fixed inset-0 bg-white/10 z-40 pointer-events-auto"></div>
                <div className="p-5 fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 flex w-full justify-center gap-3 items-center">
                    <span className="w-8 h-8 border-4 border-t-yellow-600 border-gray-200 rounded-full animate-spin"></span>
                    <h1 className="text-gray-700 font-semibold">Loading</h1>
                </div>
            </>
        )
    }

    {/* Title not found */ }
    if (!findquestion) {
        return (
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 shadow-lg p-3">
                <div className="flex flex-col gap-5">
                    <h1 className="font-bold text-2xl"><span className="text-yellow-600">OOPS</span>! Title Not Found!</h1>
                </div>
            </div>
        )
    }

    return (
        <>
            {/* Warning toggle */}
            {toggle &&
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

            <h1 className="text-3xl font-bold text-yellow-600">{title} <span className="text-black">(MCQ)</span></h1>

            {questionlist.length > 0 &&
                <div className="flex flex-col items-center w-full justify-center gap-6 py-10">
                    {/* Question */}
                    <div className="bg-yellow-600 p-8 w-[1000px] max-md:w-[300px] max-w-full rounded-lg">
                        <p className="text-white font-bold">
                            <div dangerouslySetInnerHTML={{ __html: questionlist[currentindex].question || "" }} />
                        </p>
                    </div>

                    {/* Choices */}
                    <div className="flex flex-col w-[1000px] max-md:w-[300px] justify-center items-center gap-5">
                        {questionlist[currentindex].choices.map((element, index) => {
                            const isselect = selectedIndex[currentindex] === index;
                            const isanswer = element === questionlist[currentindex].answer;

                            return (
                                <div
                                    key={index}
                                    className={`${selectedIndex[currentindex] != null
                                            ? isanswer
                                                ? "bg-green-600 text-white"  
                                                : isselect
                                                    ? "bg-red-600 text-white" 
                                                    : "bg-white"             
                                            : "bg-white hover:bg-gray-300"
                                        } shadow-lg p-3 rounded-lg w-full font-medium transition-all`}
                                    onClick={() => {
                                        if (selectedIndex[currentindex] == null) {
                                            const updated = [...selectedIndex];
                                            updated[currentindex] = index;
                                            setSelectedIndex(updated);
                                        }
                                    }}
                                >
                                    <div dangerouslySetInnerHTML={{ __html: element || "" }} />
                                </div>
                            )
                        })}
                    </div>

                    {/* Navigation */}
                    <div className="flex gap-4">
                        <button
                            disabled={currentindex === 0}
                            className="flex flex-row gap-1 bg-gray-300 rounded-lg p-2 active:translate-y-1 disabled:opacity-50"
                            onClick={prevpage}
                        ><ArrowLeft /> Prev</button>

                        <button
                            disabled={currentindex === questionlist.length - 1}
                            className="flex flex-row gap-1 text-white bg-yellow-700 rounded-lg p-2 active:translate-y-1 disabled:opacity-50"
                            onClick={nextpage}
                        ><ArrowRight /> Next</button>
                    </div>

                    <p className="text-sm text-gray-500">
                        {currentindex + 1} / {questionlist.length}
                    </p>
                </div>
            }
        </>
    )
}

export default MCQ;
