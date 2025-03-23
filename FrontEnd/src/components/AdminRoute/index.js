import { getUserScopes, hasScope } from "../../utils/authUtils";
import { useState, useEffect } from "react";
import { Outlet } from "react-router-dom";
import { Navigate } from "react-router-dom";

function AdminRoute() {
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
    // Kiểm tra quyền ADMIN

    const isAuth = userScopes && (hasScope(userScopes,"ROLE_ADMIN"));
    return(
        <>{isAuth ? <Outlet /> : <Navigate to="/" />}</>
    ); 
}

export default AdminRoute;