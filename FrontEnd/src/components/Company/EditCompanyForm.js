import {useEffect} from 'react';
import { Form, Input, Button, Upload, message } from 'antd';
import { UploadOutlined } from '@ant-design/icons';
import "./EditCompanyForm.css"
const { TextArea } = Input;

const EditCompanyForm = ({ company, onSubmit, onCancel }) => {
  const [form] = Form.useForm();

  useEffect(() => {
    form.setFieldsValue({
      companyName: company.companyName,
      description: company.description,
      website: company.website,
      address: company.address,
      numberOfEmployees: company.numberOfEmployees,
    });
  }, [company, form]);

  const onFinish = (values) => {
    const formData = new FormData();
    formData.append('companyName', values.companyName);
    formData.append('description', values.description || '');
    formData.append('website', values.website || '');
    formData.append('address', values.address);

    if (values.logoUrl && values.logoUrl.length > 0) {
      const fileItem = values.logoUrl[0];
      if (fileItem.originFileObj) {
        console.log('New file:', fileItem.originFileObj);
        formData.append('logoUrl', fileItem.originFileObj);
      }
    }
    
    onSubmit(formData);
  };

  const onFinishFailed = () => {
    message.error("Please fill in all required fields!");
  };

  return (
    <Form
      form={form}
      name="editCompany"
      onFinish={onFinish}
      onFinishFailed={onFinishFailed}
      layout="vertical"
    >
      <Form.Item
        name="companyName"
        label="Company Name"
        rules={[{ required: true, message: "Please input the company name!" }]}
      >
        <Input placeholder="Enter company name..." />
      </Form.Item>

      <Form.Item
        name="description"
        label="Description"
      >
        <TextArea rows={4} placeholder="Enter company description..." />
      </Form.Item>

      <Form.Item
        name="website"
        label="Website"
      >
        <Input placeholder="Enter company website..." />
      </Form.Item>

      <Form.Item
        name="address"
        label="Address"
        rules={[{ required: true, message: "Please input the company address!" }]}
      >
        <Input placeholder="Enter company address..." />
      </Form.Item>

      <Form.Item
        name="logoUrl"
        label="Logo"
        valuePropName="fileList"
        getValueFromEvent={(e) => {
          if (Array.isArray(e)) return e;
          return e && e.fileList;
        }}
      >
        <Upload
          name="logoUrl"
          listType="picture"
          beforeUpload={() => false}
          maxCount={1}
          defaultFileList={
            company.logoUrl
              ? [{ uid: '-1', name: 'Logo hiện tại', status: 'done', url: company.logoUrl }]
              : []
          }
        >
          <Button icon={<UploadOutlined />}>Tải lên Logo</Button>
        </Upload>
      </Form.Item>

      <Form.Item>
        <Button type="primary" htmlType="submit" block>
          Cập nhật
        </Button>
        <Button style={{ marginTop: 8 }} block onClick={onCancel}>
          Hủy
        </Button>
      </Form.Item>
    </Form>
  );
};

export default EditCompanyForm;