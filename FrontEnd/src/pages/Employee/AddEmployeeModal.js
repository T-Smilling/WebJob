import { Modal, Button, Form, Input, message } from 'antd';
import Cookies from 'js-cookie';
import { addEmployee } from '../../services/employeeService';

const AddEmployeeModal = ({ companyId, visible, onClose }) => {
  const [form] = Form.useForm();
  const token = Cookies.get("token");

  const handleAddEmployee = async (values) => {
    try {
      const response = await addEmployee(companyId, values, token);

      if (response.code === 200) {
        message.success("Thêm nhân viên thành công!");
        form.resetFields();
        window.location.reload()
        onClose();
      } else{
        message.error("Thêm nhân viên thất bại. Đã có sẵn!");
      }
    } catch (error) {
      message.error("Thêm nhân viên thất bại. Vui lòng thử lại!");
    }
  };

  return (
    <Modal
      title={<strong><h2>Thêm Nhân Viên</h2></strong>}
      open={visible}
      onCancel={onClose}
      footer={null}
      width={600}
    >
      <Form form={form} layout="vertical" onFinish={handleAddEmployee}>
        <Form.Item
          name="fullName"
          label="Họ và tên"
          rules={[{ required: true, message: "Vui lòng nhập họ và tên!" }]}
        >
          <Input placeholder="Nhập họ và tên" />
        </Form.Item>

        <Form.Item
          name="email"
          label="Email"
          rules={[{ required: true, message: "Vui lòng nhập email!" }, { type: 'email', message: "Email không hợp lệ!" }]}
        >
          <Input placeholder="Nhập email" />
        </Form.Item>

        <Form.Item>
          <Button type="primary" htmlType="submit">Thêm</Button>
        </Form.Item>
      </Form>
    </Modal>
  );
};

export default AddEmployeeModal;