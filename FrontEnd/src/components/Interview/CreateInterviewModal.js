import { useState } from "react"
import { Modal, Form, DatePicker, Select, Input, Button, message } from "antd"
import { createInterview } from "../../services/interviewService"
import Cookies from "js-cookie"
import "./CreateInterviewModel.css"

const { Option } = Select

const CreateInterviewModal = ({ visible, onClose, jobApplicationId, onSuccess }) => {
  const [form] = Form.useForm()
  const [loading, setLoading] = useState(false)
  const token = Cookies.get("token")
  const handleSubmit = async (values) => {
    setLoading(true)
    try {
      const interviewDate = values.interviewDate ? values.interviewDate.toISOString() : null
      if (!interviewDate) {
        message.error("Vui lòng chọn ngày phỏng vấn!")
        setLoading(false)
        return
      }
      const interviewData = {
        interviewDate: interviewDate,
        interviewType: values.interviewType,
        location: values.interviewType === "Offline" ? values.location : null,
        meetingLink: values.interviewType === "Online" ? values.meetingLink : null,
        interviewStatus: values.interviewStatus,
        feedback: "", // Feedback để trống khi tạo mới
      }

      const response = await createInterview(jobApplicationId, interviewData, token)
      if (response.code === 200) {
        message.success("Tạo cuộc phỏng vấn thành công!")
        onSuccess(response.result)
        form.resetFields()
        onClose()
      } else {
        message.error(response.message || "Tạo cuộc phỏng vấn thất bại!")
      }
    } catch (error) {
      message.error("Không thể tạo cuộc phỏng vấn. Vui lòng thử lại!")
      console.log(error.message)
    } finally {
      setLoading(false)
    }
  }

  return (
    <Modal title="Tạo cuộc phỏng vấn" open={visible} onCancel={onClose} footer={null} className="interview-modal" closable={false}>
      <Form
        form={form}
        layout="vertical"
        onFinish={handleSubmit}
        initialValues={{
          interviewType: "Online",
          interviewStatus: "Scheduled",
        }}
      >
        <Form.Item
          label="Ngày phỏng vấn"
          name="interviewDate"
          rules={[{ required: true, message: "Vui lòng chọn ngày phỏng vấn!" }]}
        >
          <DatePicker showTime style={{ width: "100%" }} />
        </Form.Item>
        <Form.Item
          label="Loại phỏng vấn"
          name="interviewType"
          rules={[{ required: true, message: "Vui lòng chọn loại phỏng vấn!" }]}
        >
          <Select>
            <Option value="Online">Online</Option>
            <Option value="Offline">Offline</Option>
          </Select>
        </Form.Item>
        <Form.Item
          noStyle
          shouldUpdate={(prevValues, currentValues) => prevValues.interviewType !== currentValues.interviewType}
        >
          {({ getFieldValue }) =>
            getFieldValue("interviewType") === "Online" ? (
              <Form.Item
                label="Link họp"
                name="meetingLink"
                rules={[{ required: true, message: "Vui lòng nhập link họp!" }]}
              >
                <Input />
              </Form.Item>
            ) : (
              <Form.Item
                label="Địa điểm"
                name="location"
                rules={[{ required: true, message: "Vui lòng nhập địa điểm!" }]}
              >
                <Input />
              </Form.Item>
            )
          }
        </Form.Item>
        <Form.Item
          label="Trạng thái phỏng vấn"
          name="interviewStatus"
          rules={[{ required: true, message: "Vui lòng chọn trạng thái phỏng vấn!" }]}
        >
          <Select>
            <Option value="Scheduled">Scheduled</Option>
            <Option value="Completed">Completed</Option>
            <Option value="Cancelled">Cancelled</Option>
          </Select>
        </Form.Item>
        <Form.Item>
          <Button type="primary" htmlType="submit" loading={loading}>
            Tạo
          </Button>
          <Button style={{ marginLeft: 8 }} onClick={onClose}>
            Hủy
          </Button>
        </Form.Item>
      </Form>
    </Modal>
  )
}

export default CreateInterviewModal

