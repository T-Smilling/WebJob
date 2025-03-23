import { Modal, Form, Input, message } from "antd";

const CreateUserModal = ({ visible, onClose, onSubmit }) => {
  const [form] = Form.useForm();

  const handleSubmit = () => {
    form
      .validateFields()
      .then((values) => {
        onSubmit(values);
        form.resetFields();
      })
      .catch((info) => {
        console.log("Validate Failed:", info);
      });
  };

  const handleClose = () => {
    form.resetFields();
    onClose();
  };

  return (
    <Modal
      title="Thêm mới tài khoản"
      visible={visible}
      onOk={handleSubmit}
      onCancel={handleClose}
      okText="Tạo"
      cancelText="Hủy"
    >
      <Form form={form} layout="vertical">
        <Form.Item
          name="username"
          label="Tên người dùng"
          rules={[
            { required: true, message: "Vui lòng nhập tên người dùng!" },
            { min: 4, message: "Tên người dùng phải có ít nhất 4 ký tự!" },
          ]}
        >
          <Input placeholder="Nhập tên người dùng" />
        </Form.Item>
        <Form.Item
          name="password"
          label="Mật khẩu"
          rules={[
            { required: true, message: "Vui lòng nhập mật khẩu!" },
            { min: 6, message: "Mật khẩu phải có ít nhất 6 ký tự!" },
          ]}
        >
          <Input.Password placeholder="Nhập mật khẩu" />
        </Form.Item>
        <Form.Item
          name="fullName"
          label="Họ tên"
          rules={[{ required: true, message: "Vui lòng nhập họ tên!" }]}
        >
          <Input placeholder="Nhập họ tên" />
        </Form.Item>
        <Form.Item
          name="phone"
          label="Số điện thoại"
          rules={[{ required: true, message: "Vui lòng nhập số điện thoại!" }]}
        >
          <Input placeholder="Nhập số điện thoại" />
        </Form.Item>
        <Form.Item
          name="email"
          label="Email"
          rules={[
            { required: true, message: "Vui lòng nhập email!" },
            { type: "email", message: "Email không hợp lệ!" },
          ]}
        >
          <Input placeholder="Nhập email" />
        </Form.Item>
      </Form>
    </Modal>
  );
};

export default CreateUserModal;