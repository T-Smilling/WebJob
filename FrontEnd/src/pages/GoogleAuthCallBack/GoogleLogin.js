import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";
import { checkLogin } from "../../actions/login";
import Cookies from "js-cookie";
import { getUserScopes, hasScope } from "../../utils/authUtils";

function GoogleLogin(){
  const navigate = useNavigate();
  const dispatch = useDispatch();

  useEffect(() => {
    const urlParams = new URLSearchParams(window.location.search);
    const token = urlParams.get("token");
    if (token) {
      Cookies.set("token", token, { expires: 1, secure: true });
      dispatch(checkLogin(true));
      const scopes = getUserScopes();
      if (hasScope(scopes, "ROLE_ADMIN")) {
        navigate("/admin");
      } else {
        navigate("/");
      }
    } else {
      navigate("/login");
    }
  }, [navigate, dispatch]);

  return <div>Loading...</div>;
}

export default GoogleLogin;