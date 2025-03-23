import { Navigate, Outlet } from "react-router-dom";
import Cookies from "js-cookie";
import { useEffect, useState } from "react";
import { validateToken } from "../../services/authService";

function PrivateRoute(){
    const [auth,setAuth] = useState(null);

    const token = Cookies.get("token")
    useEffect(() => {
        const checkAuth = async () => {
            if (!token) {
                setAuth(false);
                return;
            }
            try {
                const response = await validateToken(token);
                setAuth(response.result.valid);
            } catch (error) {
                console.log("Fail to load:", error.message);
                setAuth(false);
            }
        };

        checkAuth();
    }, [token]);

    if (auth === null) return null;

    return (
        <>
        {auth ? (<Outlet/>) : (<Navigate to = '/login'/>)}
        </>
    );
}

export default PrivateRoute;