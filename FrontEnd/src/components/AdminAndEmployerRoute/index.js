import { getUserScopes, hasScope } from "../../utils/authUtils";
import { useState, useEffect } from "react";
import { Outlet } from "react-router-dom";
import { Navigate } from "react-router-dom";

function AdminEmployerRoute() {
    const [userScopes, setUserScopes] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const scopes = getUserScopes();
        setUserScopes(scopes);
        setLoading(false);
    },[])

    if (loading) {
        return null;
    }
    // Kiểm tra quyền ADMIN hoặc EMPLOYER

    const isAuth = (hasScope(userScopes, "ROLE_EMPLOYER") || hasScope(userScopes,"ROLE_ADMIN"));
    return(
        <>{isAuth ? <Outlet /> : <Navigate to="/" />}</>
    ); 
}

export default AdminEmployerRoute;