import { gettoken } from "@/lib/auth";
import { deletehistory, gethistory } from "@/services/api/userapi";
import type { QuizData } from "@/types/response";
import { useEffect, useState } from "react";
import { Check, X } from "lucide-react";
import { ArrowLeft, ArrowRight } from "lucide-react";

const History = () => {
    const [history, sethistory] = useState<QuizData[]>([]);
    const [isfetching, setisfetching] = useState<boolean>();
    const [toast, settoast] = useState<boolean>();
    const [response, setresponse] = useState<any>();
    const [message, setmessage] = useState<string>("");
    const [loading, setloading] = useState<boolean>();
    const [title, settitle] = useState<boolean>(true);
    const [openquiz, setopenquiz] = useState<boolean>();
    const [openquizlist, setopenquizlist] = useState<QuizData | null>();
    const [currentindex, setcurrentindex] = useState<number>(0);

    const token = gettoken();

    {/* Live Login to fetch history via token*/}

    useEffect(() => {
        setisfetching(true);
        const fetchhistory = async () => {
            if (!token)
                return;
            try {
                const result = await gethistory(token);
                if (result && result.success) {
                    setisfetching(false);
                    sethistory(result.data);
                    console.log(result.data);
                }
            }
            catch (err: any) {
                console.log(err?.response?.data.message);
                setisfetching(false);
            }
        }
        fetchhistory();
    }, [])

    {/*delete the history via index */}

    const deleteindex = async (index: number) => {
        settoast(true);
        setloading(true);
        try {
            if (!token)
                return;
            const result = await deletehistory(token, index.toString());
            if (result && result.success) {
                settoast(true);
                setloading(false);
                setresponse(<Check className="text-green-600 w-12 h-12" />)
                setmessage(result.message || "Delete Successful");
                setTimeout(() => {
                    settoast(false);
                    window.location.reload();
                }, 1000);

            }
        }
        catch (err: any) {
            setresponse(<X className="text-red-600 w-12 h-12" />)
            setmessage(err?.response?.data.message || "Unexpected Error");
            setTimeout(() => {
                settoast(false);
            }, 1000);
            setisfetching(false);
        }
    }

    {/*Render the page with via boolean */}

    const navigation = (data: QuizData) => {
        setopenquizlist(data);
        settitle(false);
        setopenquiz(true);
    }

    {/*toggle next page */}
    const nextpage = () => {
        setcurrentindex((prev) => prev < openquizlist!.quiz.length - 1 ? prev + 1 : prev)
    }

    {/*toggle prev page */}
    const prevpage = () => {
        setcurrentindex((prev) => prev > 0 ? prev - 1 : prev);
    }

    {/*toggle back page */}
    const back = () => {
        settitle(true);
        setopenquiz(false);
    }
    return (
        <>
            {(toast || isfetching )&&
                <div className="fixed inset-0 bg-white/10 z-40 pointer-events-auto"></div>
            }
            {toast &&
                <div className="fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 p-5 bg-white shadow-lg z-1000 flex justify-center gap-3 items-center rounded-lg">
                    {loading ? <span className="w-8 h-8 border-4 border-t-yellow-600 border-gray-200 rounded-full animate-spin"></span> : response}
                    <h1 className="text-gray-700 font-semibold">{loading ? "Deleting..." : message === "Delete Successful" ? <p className="text-green-600">{message}</p> : <p className="text-red-700">{message}</p>}</h1>
                </div>
            }
            <h1 className="text-3xl font-bold"><span className="text-yellow-600">H</span>istory</h1>
            {title && <div className="flex flex-col w-full overflow-auto gap-3">
                {isfetching ? (  
                <div className="p-5 z-1000 flex w-full justify-center gap-3 items-center">
                    <span className="w-8 h-8 border-4 border-t-yellow-600 border-gray-200 rounded-full animate-spin"></span>
                    <h1 className="text-gray-700 font-semibold">Loading</h1>
                </div>) :
                    (history.length > 0 ? history?.map((element, index) => (
                        <div key={index} onClick={() => navigation(element)} className="bg-gray-100 p-3 flex flex-row justify-between items-center w-full rounded-lg">
                            <h1 className="font-medium text-[18px] text-yellow-600">{element.title}</h1>
                            <div className="flex flex-col items-center w-20">
                                <p className={`${element.status === "Failed" ? "text-red-600" : "text-green-600"} font-semibold`}>
                                    {element.status}
                                </p>
                                <p>
                                    {element.score} / {element.quiz?.length}
                                </p>
                                <button onClick={(e: any) => { e.stopPropagation(); deleteindex(index) }} className="bg-red-600 p-1.5 text-white font-medium rounded-lg active:translate-y-1">Delete</button>
                            </div>
                        </div>)
                    ) : (
                        <h1 className="text-yellow-600 font-medium ">No History found</h1>
                    ))}
            </div>}
            {openquiz && openquizlist && !toast && (
                <div className="flex flex-col items-center w-full justify-center gap-6 py-10">
                    <h1 className="text-2xl font-bold text-yellow-600">{openquizlist.title}</h1>
                    <div className="bg-yellow-600 p-8 w-[1000px] max-md:w-[300px] max-w-full rounded-lg">
                        <p className="text-white font-bold">
                            <div dangerouslySetInnerHTML={{ __html: openquizlist.quiz[currentindex].question || "" }} />
                        </p>
                    </div>
                    <div className="flex flex-col w-[1000px] max-md:w-[300px]  justify-center items-center gap-5">
                        {openquizlist.quiz[currentindex].choices.map((element, index) => {
                            const isanswer = element === openquizlist.quiz[currentindex].answer;
                            return (
                                <div key={index} className={`shadow-lg p-3 rounded-lg w-full font-medium transition-all ${isanswer ? "bg-green-600 text-white" : "bg-gray-200"
                                    }`}>
                                    <div dangerouslySetInnerHTML={{ __html: element || "" }} />
                                </div>)
                        })}
                    </div>
                    <div className="flex gap-4">
                        <button disabled={currentindex === 0} className="flex flex-row gap-1 bg-gray-300 rounded-lg p-2 active:translate-y-1 disabled:opacity-50" onClick={prevpage}><ArrowLeft></ArrowLeft>Prev</button>
                        <button className="bg-gray-600 p-1 rounded-lg text-white active:translate-y-1" onClick={back}>Back</button>
                        <button disabled={currentindex === openquizlist.quiz.length - 1} className="flex flex-row gap-1 text-white bg-yellow-700 rounded-lg p-2 active:translate-y-1 disabled:opacity-50" onClick={nextpage}><ArrowRight></ArrowRight>Next</button>
                    </div>
                    <p className="text-sm text-gray-500">
                        {currentindex + 1} / {openquizlist.quiz.length}
                    </p>
                </div>
            )}
        </>
    )
}

export default History;