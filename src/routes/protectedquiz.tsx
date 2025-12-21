import type React from "react";
import { Navigate, useParams } from "react-router-dom";

type Props = {
    children : React.ReactNode
}
const Protectedquiz = ({children } : Props) =>
{
    {/*find title via params if not find dont allow to navigate */}
    const {title} = useParams();
    if(!title)
    {
       return <Navigate to="/dashboard" replace/>
    }
    return children;
}

export default Protectedquiz;