"use client"

import { Form, Input, Button, notification, Card } from "antd"
import { ArrowLeftOutlined } from "@ant-design/icons"
import "./RegisterForm.css"
import { NavLink, useNavigate } from "react-router-dom"
import { register } from "../../services/userService"
import { rules } from "../../utils/rules"
import HeaderLayout from "../../components/LayOut/LayOutDefault/HeaderLayout"

function Register() {
  const [message, contextHolder] = notification.useNotification()
  const navigate = useNavigate()

  const onFinish = async (values) => {
    try {
      const response = await register(values)
      if (response.code !== 200) {
        message.error({
          message: "Tài khoản đã tồn tại hoặc có lỗi xảy ra",
          duration: 3,
        })
      } else if (response.code === 200) {
        message.success({
          message: response.message,
          duration: 1.5,
        })
        setTimeout(() => {
          navigate("/login")
        }, 1500)
      }
    } catch (error) {
      message.error({
        message: "Register failed",
        duration: 1.5,
      })
    }
  }

  return (
    <>
      {contextHolder}

      <div className="register-page">
        <Card
          className="register-card"
          title={
            <div style={{ position: "relative", textAlign: "center" }}>
              <Button icon={<ArrowLeftOutlined />} onClick={() => navigate(-1)} className="back-button" />
              <span style={{ fontSize: "24px", fontWeight: "bold" }}>Đăng ký tài khoản</span>
            </div>
          }
        >
          <Form name="register-form" onFinish={onFinish} layout="vertical" size="large">
            <Form.Item name="username" label="Tên tài khoản" rules={[rules.required]}>
              <Input placeholder="Tên tài khoản" />
            </Form.Item>

            <Form.Item name="password" label="Mật khẩu" rules={[rules.required, rules.password]}>
              <Input.Password placeholder="Mật khẩu" />
            </Form.Item>

            <Form.Item name="email" label="Email" rules={[rules.required]}>
              <Input placeholder="Email" />
            </Form.Item>

            <Form.Item name="fullName" label="Tên đầy đủ" rules={[rules.required]}>
              <Input placeholder="Tên đầy đủ" />
            </Form.Item>

            <Form.Item name="phone" label="Số điện thoại" rules={[rules.required, rules.phone]}>
              <Input placeholder="Số điện thoại" />
            </Form.Item>

            <NavLink to="/login" className="redirect-login">
              Đã có tài khoản? Đăng nhập ngay
            </NavLink>

            <div className="button-container-w">
              <Form.Item>
                <Button type="primary" htmlType="submit" className="register-btn-w">
                  Đăng ký
                </Button>
              </Form.Item>
            </div>
          </Form>
        </Card>
      </div>
    </>
  )
}

export default Register

