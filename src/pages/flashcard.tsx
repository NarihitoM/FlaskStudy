
import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { getstore } from "@/services/api/userapi";
import { type SStorage, type Array, type Flashcards } from "@/types/types"; import { gettoken } from "@/lib/auth";
;

const Flashcard = () => {
    {/*Fetch from parameters Url*/ }

    const { title } = useParams<{ title?: string }>();
    {/*Token Fetch */ }
    const token = gettoken()
    {/*Type storage*/ }
    const [flashcarditems, setflashcarditems] = useState<SStorage[]>([]);
    const [currentIndex, setCurrentIndex] = useState(0);
    const [isFlipped, setIsFlipped] = useState(false);
    const [isfetching, setisfetching] = useState<boolean>(true);

    {/*Fetch Data From Ai Backend*/ }
    useEffect(() => {
        const fetchdata = async () => {
            setisfetching(true);
            try {
                const result = await getstore(token);
                if (result && result.success) {
                    setflashcarditems(result.data);
                    setisfetching(false);
                }
            }
            catch (err: any) {
                console.log(err);
                setisfetching(false);
            }
        }
        fetchdata()
    }, []);

    {/*Findflashcard via parameter url come from backend*/ }
    const findflashcard: Array | undefined = flashcarditems?.[0]?.studies?.find((item: any) => item.title === title);
    const flashcard: Flashcards[] = findflashcard?.flashcard ?? [];

    {/*Toggle next Card*/ }
    const nextCard = () => {
        setIsFlipped(false);
        setCurrentIndex((prev) =>
            prev < flashcard!.length - 1 ? prev + 1 : prev
        );
    };

    {/*Toggle prev Card */ }
    const prevCard = () => {
        setIsFlipped(false);
        setCurrentIndex((prev) =>
            prev > 0 ? prev - 1 : prev
        );
    };

    {/*Fetching Loading Screen */ }
    if (isfetching) {
        return (
            <> {isfetching &&
            <div className="fixed inset-0 bg-white/10 z-40 pointer-events-auto"></div>
        }
                {isfetching &&
                    (<div className="p-5 fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 flex w-full justify-center gap-3 items-center">
                        <span className="w-8 h-8 border-4 border-t-yellow-600 border-gray-200 rounded-full animate-spin"></span>
                        <h1 className="text-gray-700 font-semibold">Loading</h1>
                    </div>)}
            </>
        )
    }
    {/*Return if not flashcard found*/ }
    if (!findflashcard) {
        return (
            <>
                <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 shadow-lg p-3">
                    <div className="flex flex-col  gap-5">
                        <h1 className="font-bold text-2xl"><span className="text-yellow-600">OOPS</span>! Title Not Found!</h1>
                    </div>
                </div>
            </>
        )
    }
    return (
        <>
            <h1 className="text-3xl font-bold">
                <span className="text-yellow-600">{title} <span className="text-black">(Flashcards)</span></span>
            </h1>
            {flashcard!.length > 0 &&
                <div className="flex flex-col items-center w-full justify-center gap-6 py-20">
                    <div onClick={() => setIsFlipped(!isFlipped)} className="cursor-pointer bg-yellow-600 shadow-md rounded-xl p-8 text-center transition-all duration-300 hover:scale-105 w-[1000px] max-md:w-auto  max-w-full  flex items-center justify-center">
                        <p className="text-xl font-semibold text-white">
                            <div dangerouslySetInnerHTML={{ __html: isFlipped ? `Ans : ${flashcard![currentIndex].back}` : `Question : ${flashcard![currentIndex].front}` || "" }} />

                        </p>
                    </div>
                    <p className="text-sm text-gray-700">
                        Click card to flip
                    </p>
                    <div className="flex gap-4">
                        <button
                            onClick={prevCard}
                            disabled={currentIndex === 0}
                            className="px-4 py-2 rounded-lg bg-gray-300 disabled:opacity-50 active:translate-y-1">
                            Prev
                        </button>
                        <button
                            onClick={nextCard}
                            disabled={currentIndex === flashcard!.length - 1}
                            className="px-4 py-2 rounded-lg bg-yellow-700 text-white disabled:opacity-50 active:translate-y-1">
                            Next
                        </button>
                    </div>
                    <p className="text-sm text-gray-500">
                        {currentIndex + 1} / {flashcard!.length}
                    </p>
                </div>
            }
        </>
    )
}

export default Flashcard;