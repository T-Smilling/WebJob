import { useState } from "react"
import { Row, Col, Form, Input, Button, Upload, message } from "antd"
import { UploadOutlined } from "@ant-design/icons"
import "./CreateCompany.css"
import { useNavigate } from "react-router-dom"
import Cookies from "js-cookie"
import { createCompany } from "../../services/companyService"

const { TextArea } = Input

const CreateCompany = () => {
  const [form] = Form.useForm()
  const [fileList, setFileList] = useState([])
  const token = Cookies.get("token")
  const navigate = useNavigate()

  const handleFileChange = (info) => {
    setFileList(info.fileList)
  }

  const onFinish = async (values) => {
    try {
      const formData = new FormData()
      formData.append("companyName", values.companyName)
      formData.append("description", values.description || "")
      formData.append("website", values.website || "")
      formData.append("address", values.address)

      if (fileList.length > 0) {
        formData.append("logoUrl", fileList[0].originFileObj)
        console.log("File appended to FormData:", fileList[0].originFileObj)
      } else {
        console.log("No file selected")
      }

      const response = await createCompany(formData, token)

      form.resetFields()
      setFileList([])
      if (response.code === 200) {
        message.success("Company created successfully!")
        navigate("jobs/create")
      }
    } catch (error) {
      message.error("Failed to create company. Please try again!")
      form.resetFields()
      setFileList([])
    }
  }

  const onFinishFailed = () => {
    message.error("Please fill in all required fields!")
    form.resetFields()
    setFileList([])
  }

  return (
    <div className="create-company-container">
      <Row justify="center" align="middle" style={{ minHeight: "100vh" }}>
        <Col xs={22} sm={20} md={18} lg={14} xl={12}>
          <div className="create-company-form">
            <h2 style={{ textAlign: "center", marginBottom: "32px" }}>Create New Company</h2>
            <Form
              form={form}
              name="createCompany"
              onFinish={onFinish}
              onFinishFailed={onFinishFailed}
              layout="vertical"
              initialValues={{
                companyName: "",
                description: "",
                website: "",
                address: "",
              }}
            >
              <Form.Item
                name="companyName"
                label="Company Name"
                rules={[{ required: true, message: "Please input the company name!" }]}
              >
                <Input placeholder="Enter company name..." />
              </Form.Item>

              <Form.Item name="description" label="Description">
                <TextArea rows={4} placeholder="Enter company description..." />
              </Form.Item>

              <Form.Item name="website" label="Website">
                <Input placeholder="Enter website URL..." />
              </Form.Item>

              <Form.Item name="logoUrl" label="Logo">
                <Upload
                  beforeUpload={() => false}
                  maxCount={1}
                  fileList={fileList}
                  showUploadList={true}
                  onChange={handleFileChange}
                >
                  <Button icon={<UploadOutlined />}>Click to Upload Logo</Button>
                </Upload>
              </Form.Item>

              <Form.Item
                name="address"
                label="Address"
                rules={[{ required: true, message: "Please input the company address!" }]}
              >
                <Input placeholder="Enter company address..." />
              </Form.Item>

              <Form.Item>
                <Button type="primary" htmlType="submit" block>
                  Create Company
                </Button>
              </Form.Item>
            </Form>
          </div>
        </Col>
      </Row>
    </div>
  )
}

export default CreateCompany

