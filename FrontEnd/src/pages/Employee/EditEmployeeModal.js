import React, { useEffect } from 'react';
import { Form, Input, Button, Space, message } from 'antd';

const EditEmployeeModal = ({ employee, onSubmit, onCancel }) => {
  const [form] = Form.useForm();
  useEffect(() => {
    form.setFieldsValue({
      fullName: employee?.fullName || '',
      email: employee?.email || '',
    });
  }, [employee, form]);

  const handleFinish = (values) => {
    try {
      onSubmit(values);
      form.resetFields();
      onCancel();
    } catch (error) {
      message.error('Đã xảy ra lỗi khi cập nhật nhân viên. Vui lòng thử lại!');
    }
  };

  return (
    <Form
      form={form}
      layout="vertical"
      onFinish={handleFinish}
      initialValues={{
        fullName: employee?.fullName || '',
        email: employee?.email || '',
      }}
    >
      <Form.Item
        name="fullName"
        label="Họ và tên"
        rules={[{ required: true, message: 'Họ và tên là bắt buộc!' }]}
      >
        <Input placeholder="Nhập họ và tên" />
      </Form.Item>

      <Form.Item
        name="email"
        label="Email"
        rules={[
          { required: true, message: 'Email là bắt buộc!' },
          { type: 'email', message: 'Email không hợp lệ!' },
        ]}
      >
        <Input placeholder="Nhập email" />
      </Form.Item>

      <Form.Item>
        <Space>
          <Button key="cancel" onClick={onCancel}>
            Hủy
          </Button>
          <Button key="submit" type="primary" htmlType="submit">
            Lưu
          </Button>
        </Space>
      </Form.Item>
    </Form>
  );
};

export default EditEmployeeModal;