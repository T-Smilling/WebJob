import { Row, Col, Form, Input, Button, message } from 'antd';
import './RegisterEmployee.css';
import { useNavigate } from 'react-router-dom';
import Cookies from 'js-cookie';
import { upRole } from '../../services/roleService';

const RegisterEmployee = () => {
  const [form] = Form.useForm();
  const token = Cookies.get("token")
  const navigate = useNavigate();

  const onFinish = async (values) => {
    try {
      const response = await upRole(values,token); 
      form.resetFields();
      if(response.code === 200){
        navigate("/companies/create")
      }
    } catch (error) {
      message.error('Failed to register employee. Please try again!');
      form.resetFields();
    }
  };

  const onFinishFailed = () => {
    message.error('Please fill in all required fields!');
    form.resetFields();
  };

  return (
    <div className="register-employee-container">
      <Row justify="center" align="top" style={{ minHeight: '100vh', paddingTop: '5vh' }}>
        <Col xs={22} sm={16} md={12} lg={8} xl={6}>
          <div className="register-employee-form">
            <h2 style={{ textAlign: 'center', marginBottom: '24px' }}>Register Employee</h2>
            <Form
              form={form}
              name="registerEmployee"
              onFinish={onFinish}
              onFinishFailed={onFinishFailed}
              layout="vertical"
              initialValues={{
                email: '',
                username: '',
              }}
            >
              <Form.Item
                name="email"
                label="Email"
                rules={[
                  { required: true, message: 'Please input the email!' },
                  { type: 'email', message: 'Please enter a valid email!' },
                ]}
              >
                <Input placeholder="Enter email..." />
              </Form.Item>

              <Form.Item
                name="username"
                label="Username"
                rules={[{ required: true, message: 'Please input the username!' }]}
              >
                <Input placeholder="Enter username..." />
              </Form.Item>

              <Form.Item>
                <Button type="primary" htmlType="submit" block>
                  Register Employee
                </Button>
              </Form.Item>
            </Form>
          </div>
        </Col>
      </Row>
    </div>
  );
};

export default RegisterEmployee;