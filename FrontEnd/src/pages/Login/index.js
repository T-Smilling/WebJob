import { Form, Input, Button, notification, Card } from "antd"
import { GoogleOutlined, ArrowLeftOutlined } from "@ant-design/icons"
import "./LoginForm.css"
import { NavLink, useNavigate } from "react-router-dom"
import { rules } from "../../utils/rules"
import { login } from "../../services/userService"
import Cookies from "js-cookie"
import { useDispatch } from "react-redux"
import { getUserScopes, hasScope } from "../../utils/authUtils"
import { checkLogin } from "../../actions/login"

function Login() {
  const [message, contextHolder] = notification.useNotification()
  const navigate = useNavigate()
  const dispatch = useDispatch()

  const onFinish = async (values) => {
    try {
      const response = await login(values)
      if (response.code !== 200) {
        message.error({
          message: `Login failed`,
          description: response.message,
          duration: 3,
        })
        return
      }
      Cookies.set("token", response.result.token, { expires: 1, secure: true })

      dispatch(checkLogin(true))
      const scopes = getUserScopes()

      if (hasScope(scopes, "ROLE_ADMIN")) {
        navigate("/admin")
      } else {
        navigate("/")
      }
    } catch (error) {
      message.error({
        message: `Login failed`,
        description: error.message,
        duration: 1.5,
      })
    }
  }
  const loginWithGoogle = () =>{
    window.location.href = "http://localhost:8080/auth/google-login"
  }
  return (
    <>
      {contextHolder}
      <div className="login-page">
        <Card
          className="login-card"
          title={
            <div style={{ position: "relative", textAlign: "center" }}>
              <Button icon={<ArrowLeftOutlined />} onClick={() => navigate(-1)} className="back-button" />
              <span style={{ fontSize: "24px", fontWeight: "bold" }}>Đăng nhập</span>
            </div>
          }
        >
          <Form name="login-form" onFinish={onFinish} layout="vertical" size="large">
            <Form.Item name="username" label="Tên tài khoản" rules={[rules.required]}>
              <Input placeholder="Tên tài khoản" />
            </Form.Item>

            <Form.Item  name="password" label="Mật khẩu" rules={[rules.required]}>
              <Input.Password placeholder="Mật khẩu" />
            </Form.Item>

            <Form.Item>
              <NavLink to="/forgot-password" className="forgot-password-w">
                Quên mật khẩu?
              </NavLink>
              <span className="redirect-register-w">
                Chưa có tài khoản?
                <NavLink to="/register"> Đăng ký ngay</NavLink>
              </span>
            </Form.Item>

            <div className="button-container-w">
              <Form.Item>
                <Button type="primary" htmlType="submit" className="login-btn-w">
                  Đăng nhập
                </Button>
              </Form.Item>

              <Form.Item>
                <Button icon={<GoogleOutlined />} className="google-btn-w" onClick={loginWithGoogle}>
                  Đăng nhập bằng Google
                </Button>
              </Form.Item>
            </div>
          </Form>
        </Card>
      </div>
    </>
  )
}

export default Login

