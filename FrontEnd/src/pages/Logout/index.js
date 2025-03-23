import { useNavigate } from 'react-router-dom';
import Cookies from 'js-cookie';
import { useEffect } from 'react';
import { logoutUser } from '../../services/userService';
import { useDispatch } from "react-redux";
import { checkLogin } from "../../actions/login";

function Logout() {
    const navigate = useNavigate();
    const token = Cookies.get('token');
    const dispatch = useDispatch();

    useEffect(() => {
        const logout = async () => {
            try {
                const response = await logoutUser(token);
            } catch (error) {
                console.log(error.message);
            }
            Cookies.remove('token');
            dispatch(checkLogin(false));
            navigate('/login');
        }
        logout();
    }, [dispatch, navigate, token]);
    
    return (
        <></>
    );
}

export default Logout;