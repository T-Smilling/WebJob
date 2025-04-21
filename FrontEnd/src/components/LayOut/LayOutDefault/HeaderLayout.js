import { useState, useEffect } from "react";
import { Menu, Dropdown, Button,message,Avatar  } from "antd";
import { useDispatch } from "react-redux";
import { checkSearch } from "../../../actions/search";
import { Link, NavLink, useNavigate } from "react-router-dom";
import "./LayoutDefault.css";
import Cookies from "js-cookie";
import { getUserScopes, hasScope } from "../../../utils/authUtils";
import { getCompanyByEmployee } from "../../../services/employeeService";
import { getInfoUser } from "../../../services/userService";

function Header(){
    const token = Cookies.get('token');
    
    const [userScopes, setUserScopes] = useState([]);
    const [companyId, setCompanyId] = useState(null);
    const [userInfo, setUserInfo] = useState(null);
    const dispatch = useDispatch();

    const handleClickJobs = (e) => {
      dispatch(checkSearch(false));
    };
    const navigate = useNavigate();
    useEffect(() => {
        const fetchData = async () => {
            if (token) {
              try {
                const userResponse = await getInfoUser(token);
                setUserInfo(userResponse.result);
                const response = await getCompanyByEmployee(token);
                if (response.result.id != null){
                  setCompanyId(response.result.id);
                } 
                
              } catch (error) {
                
              }
          }
        };
        fetchData();
        const scopes = getUserScopes();
        setUserScopes(scopes);
    }, []);

    const isEmployer = userScopes && hasScope(userScopes, "ROLE_EMPLOYER");
    const isAdmin = userScopes && hasScope(userScopes, "ROLE_ADMIN");

    const handleClick = () =>{
        if (companyId){
            navigate(`/companies/${companyId}`)
        } else{
            message.error("Bạn chưa có công ty!")
            navigate(`companies/create`)
        }
    }

    const dropdownCVItems = [
        {
          key: '1',
          label: (
            <NavLink to = "/resume/upload">
              Tải lên CV
            </NavLink>
          ),
        },
        {
          key: '2',
          label: (
            <NavLink to = "/resume/all-resume">
              Quản lý CV
            </NavLink>
          ),
        },
    ];
    const dropdownJobItems = [
        {
          key: '1',
          label: (
            <NavLink to = "/jobs/search">
              Tìm việc ngay
            </NavLink>
          ),
        },
        {
          key: '2',
          label: (
            <NavLink to = "/application/user">
              Việc làm đã ứng tuyển
            </NavLink>
          ),
        },
    ];
    
    const items = [
        {
            key: "home",
            label: <Link to="/">Trang chủ</Link> 
        },
        {
            key: "jobs",
            label: <Dropdown menu={{ items: dropdownJobItems }} placement="bottomLeft">
                     <NavLink className="menu-item-label" to="/jobs" onClick={handleClickJobs} >Việc làm</NavLink>
                   </Dropdown>
        },
        {
            key: "resume",
            label:<Dropdown menu={{ items: dropdownCVItems }} placement="bottomLeft">
                    <NavLink className="menu-item-label" to = "/resume/all-resume">Hồ sơ & CV</NavLink>
                  </Dropdown>
        },
        {
            key: "companies",
            label: <Link to="/companies/all-company">Danh sách công ty</Link>
        }
    ]
    return(
        <>
        <div className="header-container">
            <div className="logo-default">
                <Link to="/">
                    <img src="/logo.jpg" alt="Logo IT Job" />
                </Link>
                <Link to="/">IT JOB</Link>
            </div>
            <Menu theme="dark" mode="horizontal" className="menu" items={items} key="key"/>
            <div className="auth-buttons">
                {token ? (
                    <>
                    {isEmployer ? (
                        <Button className="login-btn" onClick={handleClick}>Quản lý công ty</Button>
                    ) : isAdmin ? (
                        <NavLink to="/admin/dashboard" className="login-btn">Trang quản trị</NavLink>
                    ) : (
                        <NavLink to="/employee/register" className="login-btn">Bạn là nhà tuyển dụng?</NavLink>
                    )}
                    <NavLink to="/logout" className="login-btn">Đăng xuất</NavLink>
                    {userInfo && (
                      <Avatar 
                          src={userInfo.avatarUrl || "/default-avatar.png"} 
                          size={40} 
                          onClick={() => navigate("/my-info")}
                          style={{cursor:"pointer"}}
                      />
                    )}
                    </>
                ) : (
                    <>
                    <NavLink to="/login" className="login-btn">Đăng nhập</NavLink>
                    <NavLink to="/register" className="register-btn">Đăng ký</NavLink>
                    </>
                )}
            </div>
        </div>
        </>
    );
}

export default Header;