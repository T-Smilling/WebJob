import { Modal, Form, Input, InputNumber, Select, message } from "antd";
import { useEffect } from "react";

const { Option } = Select;

const EditJobPostModal = ({ visible, onClose, onSubmit, initialValues }) => {
  const [form] = Form.useForm();

  useEffect(() => {
    if (visible && initialValues) {
      form.setFieldsValue({
        title: initialValues.title || "",
        description: initialValues.description || "",
        location: initialValues.location || "",
        salary: initialValues.salary || null,
        jobType: initialValues.jobType || null,
        updateSkills: initialValues.requiredSkills?.map(skill => skill.name) || [],
      });
    }
  }, [visible, initialValues, form]);

  const handleSubmit = () => {
    form
      .validateFields()
      .then((values) => {
        onSubmit({
          ...values,
          updateSkills: values.updateSkills?.map(skill => ({ name: skill })) || [],
        });
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
      title="Sửa thông tin việc làm"
      visible={visible}
      onOk={handleSubmit}
      onCancel={handleClose}
      okText="Lưu"
      cancelText="Hủy"
    >
      <Form form={form} layout="vertical">
        <Form.Item
          name="title"
          label="Tiêu đề"
          rules={[{ required: true, message: "Vui lòng nhập tiêu đề việc làm!" }]}
        >
          <Input placeholder="Nhập tiêu đề việc làm" />
        </Form.Item>
        <Form.Item
          name="description"
          label="Mô tả"
          rules={[{ required: false }]}
        >
          <Input.TextArea placeholder="Nhập mô tả việc làm" rows={4} />
        </Form.Item>
        <Form.Item
          name="location"
          label="Địa điểm"
          rules={[{ required: true, message: "Vui lòng nhập địa điểm việc làm!" }]}
        >
          <Input placeholder="Nhập địa điểm việc làm" />
        </Form.Item>
        <Form.Item
          name="salary"
          label="Lương"
          rules={[{ required: false }]}
        >
          <InputNumber
            placeholder="Nhập mức lương"
            min={0}
            style={{ width: "100%" }}
            formatter={(value) => `${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ",")}
            parser={(value) => value.replace(/\$\s?|(,*)/g, "")}
          />
        </Form.Item>
        <Form.Item
          name="jobType"
          label="Loại công việc"
          rules={[{ required: true, message: "Vui lòng chọn loại công việc!" }]}
        >
          <Select placeholder="Chọn loại công việc">
            <Option value="FULL_TIME">Toàn thời gian</Option>
            <Option value="PART_TIME">Bán thời gian</Option>
            <Option value="REMOTE">Làm việc từ xa</Option>
          </Select>
        </Form.Item>
        <Form.Item
          name="updateSkills"
          label="Kỹ năng yêu cầu"
          rules={[{ required: false }]}
        >
          <Select
            mode="tags"
            placeholder="Nhập kỹ năng yêu cầu (nhấn Enter để thêm)"
            tokenSeparators={[","]}
          />
        </Form.Item>
      </Form>
    </Modal>
  );
};

export default EditJobPostModal;