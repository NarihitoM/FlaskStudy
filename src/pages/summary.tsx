import { gettoken } from "@/lib/auth";
import { getstore } from "@/services/api/userapi";
import type { SStorage,Array } from "@/types/types";
import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";

const Summary = () => {

    const { title } = useParams<{ title?: string }>();
    const [fetchsummary, setfetchsummary] = useState<SStorage[]>([]);
    const [isfetching, setisfetching] = useState<boolean>(true);

    const token = gettoken();

    {/*fetch summary */}
    useEffect(() => {
        const fetchsummary = async () => {
            setisfetching(true);
            try {
                const result = await getstore(token);
                if (result && result.success) {
                    setisfetching(false);
                    setfetchsummary(result.data);
                    console.log(result.data);
                }
            }
            catch (err: any) {
                console.log(err?.response?.data.message);
                setisfetching(false);
            }
        }
        fetchsummary();
    }, [])

    {/*find summary according to useParams title */}
    const findsummary : Array | undefined = fetchsummary?.[0]?.studies?.find((element : any) => element.title === title);
    const summaryinfo : string | undefined = findsummary?.summary;

    {/*Fetching loading screen */}
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
    {/*If not find summary toggle this */}
    if (!findsummary) {
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
            <h1 className="text-3xl font-bold text-yellow-600">{title} <span className="text-black">(Summary)</span></h1>
            <div dangerouslySetInnerHTML={{ __html: summaryinfo || ""}} />
        </>
    )
}

export default Summary;