import { Modal, Form, Input, Upload, Button } from "antd";
import { UploadOutlined } from "@ant-design/icons";
import { useEffect, useState } from "react";

const EditUserModal = ({ visible, onClose, onSubmit, initialValues }) => {
  const [form] = Form.useForm();
  const [fileList, setFileList] = useState([]);

  const getFileList = (url) => {
    if (!url) return [];
    return [
      {
        uid: "-1",
        name: "avatar.png",
        status: "done",
        url: url,
      },
    ];
  };

  useEffect(() => {
    if (visible && initialValues) {
      const initialFileList = getFileList(initialValues.avatarUrl);
      setFileList(initialFileList);
      form.setFieldsValue({
        password: "",
        fullName: initialValues.fullName || "",
        phone: initialValues.phone || "",
        avatarUrl: initialFileList,
      });
    }
  }, [visible, initialValues, form]);

  const handleUploadChange = ({ fileList: newFileList }) => {
    setFileList(newFileList);
    form.setFieldsValue({ avatarUrl: newFileList });
  };

  const handleSubmit = () => {
    form
      .validateFields()
      .then((values) => {
        const avatarFile = values.avatarUrl?.[0]?.originFileObj;
        onSubmit({
          ...values,
          avatarUrl: avatarFile || null,
        });
        // Chỉ reset các trường không liên quan đến fileList
        form.resetFields(["password", "fullName", "phone"]);
      })
      .catch((info) => {
        console.log("Validate Failed:", info);
      });
  };

  const handleClose = () => {
    form.resetFields();
    setFileList([]); // Reset fileList khi đóng modal
    onClose();
  };

  return (
    <Modal
      title="Sửa thông tin người dùng"
      visible={visible}
      onOk={handleSubmit}
      onCancel={handleClose}
      okText="Lưu"
      cancelText="Hủy"
    >
      <Form
        form={form}
        layout="vertical"
        initialValues={{
          password: "",
          fullName: initialValues?.fullName || "",
          phone: initialValues?.phone || "",
          avatarUrl: getFileList(initialValues?.avatarUrl),
        }}
      >
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
          name="password"
          label="Mật khẩu"
          rules={[{ required: false, message: "Vui lòng nhập mật khẩu!" }]}
        >
          <Input.Password placeholder="Nhập mật khẩu mới (nếu muốn thay đổi)" />
        </Form.Item>
        <Form.Item
          name="avatarUrl"
          label="Ảnh đại diện"
          valuePropName="fileList"
          getValueFromEvent={(e) => (Array.isArray(e) ? e : e && e.fileList)}
        >
          <Upload
            name="avatarUrl"
            listType="picture"
            maxCount={1}
            beforeUpload={() => false}
            fileList={fileList}
            onChange={handleUploadChange}
          >
            <Button icon={<UploadOutlined />}>Chọn ảnh</Button>
          </Upload>
        </Form.Item>
      </Form>
    </Modal>
  );
};

export default EditUserModal;