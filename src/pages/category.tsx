import studyelement from "@/lib/studyelement";
import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { type SStorage, type Array } from "@/types/response";
import { getstore } from "@/services/api/userapi";
import { gettoken } from "@/lib/auth";

const Title = () => {
    {/* Parameter */}
    const { title } = useParams<{ title?: string }>();

    {/*Storage Type*/}
    const [itemlist, setitemlist] = useState<SStorage[]>([]);
    const [isfetching, setisfetching] = useState<boolean>(true);

    {/*Token Call */}

    const token = gettoken();

    {/*Fetch JSON From Ai Backend*/}
    useEffect(() => {
        const fetch = async () => {
            setisfetching(true);
            try {
                const result = await getstore(token);
                if (result && result.success) {
                    setitemlist(result.data);
                    setisfetching(false);
                }
            }
            catch (err: any) {
                console.log(err?.response.data.message);
                setisfetching(false);
            }
        }
        fetch();
    }, [])

    const navigate = useNavigate();
    const finditem: Array | undefined = itemlist?.[0]?.studies?.find((element: any) => element.title === title);
    const findtitle: string | undefined = finditem?.title;

    {/*Fetching Loading*/}
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
    {/*If No Title Return*/}

    if (!findtitle) {
        return (
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 shadow-lg p-3">
                <div className="flex flex-col  gap-5">
                    <h1 className="font-bold text-2xl"><span className="text-yellow-600">OOPS</span>! Title Not Found!</h1>
                </div>
            </div>
        )
    }
    {/* Render */}
    return (
        <> <div className="flex flex-col w-auto gap-5">
            <h1 className="font-bold text-3xl text-yellow-600">
                Title : {findtitle}
            </h1>
            <div className="flex flex-wrap  gap-4">
                {studyelement(title!).map((element, index) => {
                    const Icon = element.icon;
                    return (
                        <div key={index} onClick={() => navigate(`${element.url}`)} className="bg-white p-5 w-[200px] rounded-lg  shadow-lg font-medium">
                            <span className="text-yellow-600"><Icon /></span>{element.title}
                        </div>
                    )
                })}
            </div>
        </div>
        </>
    )
}


export default Title;