import { useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { Form, Input, Button, message, Row, Col } from 'antd';
import './ChangePassword.css';
import { changePassword } from '../../services/userService';

const ChangePassword = () => {
  const navigate = useNavigate();
  const [form] = Form.useForm();
  const { code } = useParams();
  const [loading, setLoading] = useState(false);

  const onFinish = async (values) => {
    setLoading(true);
    try {
      if (values.password !== values.confirmPassword) {
        message.error('Mật khẩu và xác nhận mật khẩu không khớp!');
        setLoading(false);
        return;
      }

      const response = await changePassword(code,values);
      console.log(response)

      if (response.code === 200) {
        message.success('Đổi mật khẩu thành công. Vui lòng đăng nhập lại!');
        setTimeout(() => {
          navigate('/login');
        }, 3000);
      }
    } catch (error) {
      message.error(error.response?.data?.message || 'Đã xảy ra lỗi. Vui lòng thử lại!');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="change-password-container">
      <Row justify="center" align="middle" style={{ minHeight: '100vh' }}>
        <Col xs={24} sm={18} md={12} lg={8}>
          <div className="change-password-box">
            <h2 style={{ textAlign: 'center', marginBottom: '20px' }}>Đổi Mật Khẩu</h2>
            <Form
              form={form}
              name="change_password"
              onFinish={onFinish}
              layout="vertical"
              requiredMark={false}
            >
              <Form.Item
                label="Mật khẩu mới"
                name="password"
                rules={[
                  {
                    required: true,
                    message: 'Vui lòng nhập mật khẩu mới!',
                  },
                  {
                    min: 6,
                    message: 'Mật khẩu phải có ít nhất 6 ký tự!',
                  },
                ]}
              >
                <Input.Password placeholder="Nhập mật khẩu mới" />
              </Form.Item>

              <Form.Item
                label="Xác nhận mật khẩu"
                name="confirmPassword"
                rules={[
                  {
                    required: true,
                    message: 'Vui lòng xác nhận mật khẩu!',
                  },
                ]}
              >
                <Input.Password placeholder="Xác nhận mật khẩu" />
              </Form.Item>

              <Form.Item
                label="Mã OTP"
                name="otp"
                rules={[
                  {
                    required: true,
                    message: 'Vui lòng nhập mã OTP!',
                  },
                ]}
              >
                <Input placeholder="Nhập mã OTP từ email" />
              </Form.Item>

              <Form.Item>
                <Button type="primary" htmlType="submit" loading={loading} block>
                  Đổi Mật Khẩu
                </Button>
              </Form.Item>
            </Form>
            <Button type="link" onClick={() => navigate('/login')} style={{ textAlign: 'center', display: 'block' }}>
              Quay lại Đăng nhập
            </Button>
          </div>
        </Col>
      </Row>
    </div>
  );
};

export default ChangePassword;