import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Form, Input, Button, message, Row, Col } from 'antd';
import './ForgotPassword.css';
import { forgotPassword } from '../../services/userService';

const ForgotPassword = () => {
  const navigate = useNavigate();
  const [form] = Form.useForm();
  const [loading, setLoading] = useState(false);

  const onFinish = async (values) => {
    setLoading(true);
    try {
      const response = await forgotPassword(values);
        console.log(response)
      if (response.code === 200) {
        message.success('Yêu cầu quên mật khẩu đã được gửi. Kiểm tra email của bạn!');
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
    <div className="forgot-password-container">
      <Row justify="center" align="middle" style={{ minHeight: '100vh' }}>
        <Col xs={24} sm={18} md={12} lg={8}>
          <div className="forgot-password-box">
            <h2 style={{ textAlign: 'center', marginBottom: '20px' }}>Quên Mật Khẩu</h2>
            <Form
              form={form}
              name="forgot_password"
              onFinish={onFinish}
              layout="vertical"
              requiredMark={false}
            >
              <Form.Item
                label="Email"
                name="email"
                rules={[
                  {
                    required: true,
                    message: 'Vui lòng nhập email!',
                  },
                  {
                    type: 'email',
                    message: 'Email không hợp lệ!',
                  },
                ]}
              >
                <Input placeholder="Nhập email của bạn" />
              </Form.Item>

              <Form.Item>
                <Button type="primary" htmlType="submit" loading={loading} block>
                  Gửi Yêu Cầu
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

export default ForgotPassword;