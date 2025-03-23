import { Modal, Form, Input, Upload, Button, message } from "antd";
import { UploadOutlined } from "@ant-design/icons";
import { useEffect, useState } from "react";

const EditCompanyModal = ({ visible, onClose, onSubmit, initialValues }) => {
  const [form] = Form.useForm();
  const [fileList, setFileList] = useState([]);

  const getFileList = (url) => {
    if (!url) return [];
    return [
      {
        uid: "-1",
        name: "logo.png",
        status: "done",
        url: url,
      },
    ];
  };

  useEffect(() => {
    if (visible && initialValues) {
      const initialFileList = getFileList(initialValues.logoUrl);
      setFileList(initialFileList);
      form.setFieldsValue({
        companyName: initialValues.companyName || "",
        description: initialValues.description || "",
        website: initialValues.website || "",
        address: initialValues.address || "",
        logoUrl: initialFileList,
      });
    }
  }, [visible, initialValues, form]);

  const handleUploadChange = ({ fileList: newFileList }) => {
    setFileList(newFileList);
    form.setFieldsValue({ logoUrl: newFileList });
  };

  const handleSubmit = () => {
    form
      .validateFields()
      .then((values) => {
        const logoFile = values.logoUrl?.[0]?.originFileObj;
        onSubmit({
          ...values,
          logoUrl: logoFile || null,
        });
        form.resetFields(["companyName", "description", "website", "address"]);
        setFileList([]);
      })
      .catch((info) => {
        console.log("Validate Failed:", info);
      });
  };

  const handleClose = () => {
    form.resetFields();
    setFileList([]);
    onClose();
  };

  return (
    <Modal
      title="Sửa thông tin công ty"
      visible={visible}
      onOk={handleSubmit}
      onCancel={handleClose}
      okText="Lưu"
      cancelText="Hủy"
    >
      <Form form={form} layout="vertical">
        <Form.Item
          name="companyName"
          label="Tên công ty"
          rules={[{ required: true, message: "Vui lòng nhập tên công ty!" }]}
        >
          <Input placeholder="Nhập tên công ty" />
        </Form.Item>
        <Form.Item
          name="description"
          label="Mô tả"
          rules={[{ required: false }]}
        >
          <Input.TextArea placeholder="Nhập mô tả công ty" rows={4} />
        </Form.Item>
        <Form.Item
          name="website"
          label="Website"
          rules={[{ required: false }]}
        >
          <Input placeholder="Nhập website công ty" />
        </Form.Item>
        <Form.Item
          name="logoUrl"
          label="Logo công ty"
          valuePropName="fileList"
          getValueFromEvent={(e) => (Array.isArray(e) ? e : e && e.fileList)}
        >
          <Upload
            name="logoUrl"
            listType="picture"
            maxCount={1}
            beforeUpload={() => false}
            fileList={fileList}
            onChange={handleUploadChange}
          >
            <Button icon={<UploadOutlined />}>Chọn logo</Button>
          </Upload>
        </Form.Item>
        <Form.Item
          name="address"
          label="Địa chỉ"
          rules={[{ required: true, message: "Vui lòng nhập địa chỉ công ty!" }]}
        >
          <Input placeholder="Nhập địa chỉ công ty" />
        </Form.Item>
      </Form>
    </Modal>
  );
};

export default EditCompanyModal;