import { Layout, Menu, Input, Avatar, Badge, Dropdown, Button, message } from "antd";
import { SettingOutlined, UserOutlined, DashboardOutlined, TeamOutlined, ShopOutlined, FileTextOutlined, MenuOutlined, HomeOutlined } from "@ant-design/icons";
import { Outlet, useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";
import Cookies from "js-cookie";
import ProfileModal from "../../../pages/Admin/User/ProfileModal";
import { getInfoUser, logoutUser } from "../../../services/userService"; 
import "./LayOutAdmin.css";
import { useDispatch } from "react-redux";
import { checkLogin } from "../../../actions/login";

const { Header, Sider, Content } = Layout;

function LayOutAdmin() {
  const navigate = useNavigate();
  const [collapsed, setCollapsed] = useState(false);
  const [isMobile, setIsMobile] = useState(false);
  const [profileModalVisible, setProfileModalVisible] = useState(false);
  const [currentUser, setCurrentUser] = useState(null);
  const token = Cookies.get("token");

  useEffect(() => {
    const fetchCurrentUser = async () => {
      try {
        const response = await getInfoUser(token);
        setCurrentUser(response.result);
      } catch (error) {
        console.error("Failed to fetch current user:", error);
        message.error("Không thể lấy thông tin người dùng");
      }
    };

    if (token) {
      fetchCurrentUser();
    }
  }, [token]);

  useEffect(() => {
    const handleResize = () => {
      const mobile = window.innerWidth <= 768;
      setIsMobile(mobile);
      setCollapsed(mobile);
    };

    handleResize();
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  const menuItems = [
    {
      key: "dashboard",
      icon: <DashboardOutlined />,
      label: "Dashboard",
      onClick: () => navigate("/admin/dashboard"),
    },
    {
      key: "users",
      icon: <TeamOutlined />,
      label: "Quản lý tài khoản",
      onClick: () => navigate("/admin/users"),
    },
    {
      key: "companies",
      icon: <ShopOutlined />,
      label: "Quản lý công ty",
      onClick: () => navigate("/admin/companies"),
    },
    {
      key: "jobs",
      icon: <FileTextOutlined />,
      label: "Quản lý việc làm",
      onClick: () => navigate("/admin/jobs"),
    },
  ];
  const dispatch = useDispatch();
  const handleClick = async () =>{
    try {
      const response = await logoutUser(token);    
    } catch (error) {
      console.log(error.message);
    }
    Cookies.remove('token');
    dispatch(checkLogin(false));
    navigate('/login');
  }
  const userMenu = (
    <Menu className="admin-user-menu">
      <Menu.Item key="profile" onClick={() => setProfileModalVisible(true)} className="admin-user-menu-item">
        Profile
      </Menu.Item>
      <Menu.Item key="logout" className="admin-user-menu-item" onClick={handleClick}>
        Đăng xuất
      </Menu.Item>
    </Menu>
  );

  const handleNavigateHome = () => {
    navigate("/");
  };

  return (
    <Layout className={`admin-layout ${isMobile ? 'admin-mobile' : ''}`}>
      <Sider
        className="admin-sider"
        collapsible
        collapsed={collapsed}
        onCollapse={(value) => setCollapsed(value)}
        breakpoint="md"
        collapsedWidth={isMobile ? 0 : 80}
      >
        <div className="admin-logo">
          {collapsed ? "J" : "JOB"}
        </div>
        <Menu theme="light" mode="inline" items={menuItems} defaultSelectedKeys={["dashboard"]} />
      </Sider>
      <Layout className={`admin-content-layout ${collapsed ? 'admin-content-layout-collapsed' : ''}`}>
        <Header className="admin-header">
          <div className="admin-header-left">
            {isMobile && (
              <Button
                type="text"
                icon={<MenuOutlined />}
                onClick={() => setCollapsed(!collapsed)}
                className="admin-collapse-btn"
              />
            )}
            <Input.Search
              placeholder="Search..."
              className="admin-search-input"
            />
          </div>
          <div className="admin-header-right">
            {!isMobile && (
              <Button
                icon={<HomeOutlined />}
                onClick={handleNavigateHome}
                className="admin-home-btn"
              >
                Trang chủ
              </Button>
            )}
            {!isMobile && <SettingOutlined className="admin-icon-button" />}
            <div className="admin-dropdown">
              <Dropdown overlay={userMenu} trigger={["click"]}>
                <Avatar className="admin-avatar" icon={<UserOutlined />} src={currentUser?.avatarUrl} />
              </Dropdown>
            </div>
          </div>
        </Header>
        <Content className="admin-content">
          <Outlet />
        </Content>
      </Layout>

      <ProfileModal
        visible={profileModalVisible}
        onClose={() => setProfileModalVisible(false)}
        user={currentUser}
      />
    </Layout>
  );
}

export default LayOutAdmin;