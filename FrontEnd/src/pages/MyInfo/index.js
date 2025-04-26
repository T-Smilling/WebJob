import React, { useEffect, useState } from 'react';
import { Card, Avatar, Typography, Button, Modal, Form, Input, Upload, message } from 'antd';
import { UserOutlined, MailOutlined, PhoneOutlined, EditOutlined, UploadOutlined, LockOutlined } from '@ant-design/icons';
import './MyInfo.css';
import Cookies from 'js-cookie';
import { getInfoUser, updateUser } from '../../services/userService';

const { Title, Text } = Typography;

function MyInfo() {
  const [user, setUser] = useState({});
  const token = Cookies.get('token');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [form] = Form.useForm();
  const [fileList, setFileList] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await getInfoUser(token);
        setUser(response.result);
      } catch (error) {
        message.error("Lấy thông tin thất bại");
      }
    };
    fetchData();
  }, [token]);

  const handleFinish = async (values) => {
    const formData = new FormData();

    if (values.fullName) formData.append('fullName', values.fullName);
    if (values.phone) formData.append('phone', values.phone);
    if (values.password) formData.append('password', values.password);

    if (fileList.length > 0 && fileList[0] instanceof File) {
      formData.append('avatarUrl', fileList[0]);
    }

    try {
      const response = await updateUser(user.id, formData, token);
      console.log('Response:', response); // Debug response
      if (response.code === 200) {
        setUser(prev => ({
          ...prev,
          fullName: values.fullName || prev.fullName,
          phone: values.phone || prev.phone,
          avatarUrl: fileList.length > 0 ? URL.createObjectURL(fileList[0]) : prev.avatarUrl
        }));
        message.success("Cập nhật thành công");
        setIsModalOpen(false);
        setFileList([]);
      } else {
        message.error("Cập nhật thất bại: " + (response.message || "Unknown error"));
      }
    } catch (error) {
      console.error('Error:', error.response || error);
      message.error("Cập nhật thất bại: " + (error.response?.data?.message || error.message));
    }
  };

  const uploadProps = {
    onRemove: () => {
      setFileList([]);
    },
    beforeUpload: (file) => {
      const isImage = file.type.startsWith('image/');
      if (!isImage) {
        message.error('You can only upload image files!');
        return false;
      }
      setFileList([file]); // Lưu file gốc thay vì originFileObj
      return false; // Ngăn upload tự động
    },
    fileList,
    maxCount: 1,
    accept: 'image/*',
    onChange: (info) => {
      if (info.fileList.length > 0 && info.file.status !== 'error') {
        setFileList([info.fileList[0].originFileObj]);
      }
    }
  };

  return (
    <div className="profile-container">
      <Card className="profile-card">
        <div className="profile-header">
          <Avatar size={120} src={user.avatarUrl} icon={<UserOutlined />} />
          <Title level={2} style={{ margin: '10px 0' }}>{user.fullName}</Title>
          <Text type="secondary">username: {user.username}</Text>
        </div>

        <div className="profile-info">
          <div className="info-item">
            <Text strong><MailOutlined /> Email: </Text>
            <Text>
              {user.email}
              {user.emailVerified && <span className="verified"> ✓ Verified</span>}
            </Text>
          </div>
          <div className="info-item">
            <Text strong><PhoneOutlined /> Phone: </Text>
            <Text>{user.phone}</Text>
          </div>
        </div>

        <Button
          type="primary"
          icon={<EditOutlined />}
          onClick={() => setIsModalOpen(true)}
          block
        >
          Edit Profile
        </Button>
      </Card>

      <Modal
        title="Edit Profile"
        open={isModalOpen}
        onCancel={() => {
          setIsModalOpen(false);
          setFileList([]);
          form.resetFields();
        }}
        footer={null}
      >
        <Form
          form={form}
          initialValues={{
            fullName: user.fullName,
            phone: user.phone,
          }}
          onFinish={handleFinish}
          layout="vertical"
        >
          <Form.Item
            name="fullName"
            label="Full Name"
            rules={[{ required: true, message: 'Please enter your full name' }]}
          >
            <Input prefix={<UserOutlined />} />
          </Form.Item>

          <Form.Item
            name="phone"
            label="Phone"
            rules={[{ required: true, message: 'Please enter your phone number' }]}
          >
            <Input prefix={<PhoneOutlined />} />
          </Form.Item>

          <Form.Item
            name="password"
            label="Password"
            rules={[{ min: 6, message: 'Password must be at least 6 characters' }]}
          >
            <Input.Password prefix={<LockOutlined />} />
          </Form.Item>

          <Form.Item
            name="avatarUrl"
            label="Avatar"
          >
            <Upload {...uploadProps}>
              <Button icon={<UploadOutlined />}>Upload Avatar</Button>
            </Upload>
          </Form.Item>

          <Form.Item>
            <div className="form-buttons">
              <Button type="primary" htmlType="submit">
                Update
              </Button>
              <Button 
                onClick={() => {
                  setIsModalOpen(false);
                  setFileList([]);
                  form.resetFields();
                }} 
                style={{ marginLeft: 8 }}
              >
                Cancel
              </Button>
            </div>
          </Form.Item>
        </Form>
      </Modal>
    </div>
  );
}

export default MyInfo;