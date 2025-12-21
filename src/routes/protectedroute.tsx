import { gettoken } from "@/lib/auth";
import { Navigate } from "react-router-dom";

type Props = {
    children : React.ReactNode;
}

const Protectedroute = ({children} : Props) =>
{
    {/*find token if not find dont allow to navigate*/}
    const token = gettoken()
    if(!token)
    {
        return <Navigate to="/login" replace/>
    }
    return children;
}

export default Protectedroute;