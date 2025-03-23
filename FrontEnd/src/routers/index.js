import LayoutDefault from "../components/LayOut/LayOutDefault"
import Login from "../pages/Login"
import Register from "../pages/Register"
import Home from "../pages/Home"
import Logout from "../pages/Logout"
import Job from "../pages/Jobs"
import Search from "../pages/Search"
import JobDetail from "../pages/Jobs/JobDetail"
import UploadResume from "../pages/UploadResume"
import PrivateRoute from "../components/PrivateRoute"
import { Navigate } from "react-router-dom"
import Applications from "../pages/Application"
import ApplyJob from "../pages/Application/ApplyJob"
import Resume from "../pages/Resume"
import AllResume from "../pages/Resume/AllResume"
import AllCompany from "../pages/Company/AllCompany"
import Company from "../pages/Company/index"
import CompanyDetail from "../pages/Company/CompanyDetail"
import Employee from "../pages/Employee"
import RegisterEmployee from "../pages/Employee/RegisterEmployee"
import CreateCompany from "../pages/Company/CreateCompany"
import JobApplications from "../pages/Application/JobApplications"
import ApplicationByUser from "../pages/Jobs/ApplicationByUser"
import ForgotPassword from "../pages/ForgotPassword"
import ChangePassword from "../pages/ChangePassword/ChangePassword"
import Change from "../pages/ChangePassword/index"
import ConfirmAccount from "../pages/ConfirmAccount/ConfirmAccount"
import Confirm from "../pages/ConfirmAccount"
import MyInfo from "../pages/MyInfo"
import AdminEmployerRoute from "../components/AdminAndEmployerRoute"
import LayOutAdmin from "../components/LayOut/LayOutAdmin"
import Dashboard from "../pages/Admin/Dashboard"
import UserManagement from "../pages/Admin/UserManagement"
import CompanyManagement from "../pages/Admin/CompanyManagement"
import JobManagement from "../pages/Admin/JobManagement"
import AdminRoute from "../components/AdminRoute"

export const routers = [
    //Public
    {
        path:"/",
        element: <LayoutDefault/>,
        children:[
            {
                index: true,
                element: <Home/>
            },
            {
                path:"jobs",
                element: <Job/>,
                children:[
                    {  
                        path:"search",
                        element: <Search/>
                    },
                    {
                        path:":id",
                        element: <JobDetail/>
                    }
                ]
            },
            {
                element: <PrivateRoute/>,
                children: [
                    {
                        path: "resume",
                        element: <Resume/>,
                        children: [
                            {
                                path: "upload",
                                element: <UploadResume/>
                            },
                            {
                                path: "all-resume",
                                element: <AllResume/>
                            }

                        ]
                    },
                    {
                        path: "application",
                        element: <Applications/>,
                        children: [
                            {
                                path: ":id",
                                element: <ApplyJob/>
                            },
                            {
                                path: "jobs",
                                element: <AdminEmployerRoute/>,
                                children: [
                                    {
                                        path: ":jobId",
                                        element: <JobApplications/>
                                    }
                                ]
                            },
                            {
                                path: "user",
                                element: <ApplicationByUser/>
                            }
                        ]
                    },
                    {
                        path: "companies",
                        element: <Company/>,
                        children: [
                            {
                                path: "all-company",
                                element: <AllCompany/>
                            },
                            {
                                path: ":id",
                                element: <CompanyDetail/>
                            },
                            {
                                path: "create",
                                element: <AdminEmployerRoute />, 
                                children: [
                                {
                                    path: "",
                                    element: <CreateCompany />,
                                },
                                ],
                            }
                        ]
                    },
                    {
                        path: "employee",
                        element: <Employee />,
                        children: [
                            {
                                path: "register",
                                element: <RegisterEmployee />,
                            },
                        ],
                    },
                    {
                        path: "my-info",
                        element: <MyInfo/>
                    }
                ]
            },
            {   
                path: "*",
                element: <Navigate to ="/"/>
            }
        ],
    },
    {
        path:"/admin",
        element: <AdminRoute/>,
        children: [
            {
                path: "",
                element: <LayOutAdmin/>,
                children:[
                    {
                        index: true,
                        path: "dashboard",
                        element: <Dashboard/>
                      },
                      {
                          path:"users",
                          element: <UserManagement/>
                      },
                      {
                          path: "companies",
                          element: <CompanyManagement/>
                      },
                      {
                          path:"jobs",
                          element: <JobManagement/>
                      }
                ]
            }
        ],
    },
    {
        path: "/login",
        element: <Login/>
    },
    {
        path:"/register",
        element: <Register/>
    },
    {
        path:"/logout",
        element: <Logout/>
    },
    {
        path:"/forgot-password",
        element: <ForgotPassword/>
    },
    {
        path: "/change-password",
        element: <Change/>,
        children: [
            {
                path: ":code",
                element: <ChangePassword/>
            }
        ]
    },
    {
        path: "/confirm-account",
        element: <Confirm/>,
        children:[
            {
                path:":code",
                element: <ConfirmAccount/>
            }
        ]
    }
]