import { useState } from "react"
import { Modal, Form, DatePicker, Select, Input, Button, message } from "antd"
import dayjs from "dayjs"
import Cookies from "js-cookie"
import { updateInterview } from "../../services/interviewService"
import "./EditInterviewModel.css"

const { Option } = Select

const EditInterviewModal = ({ visible, onClose, interview, jobApplicationId, onSuccess }) => {
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
        location: values.interviewType === "Offline" ? values.location : undefined,
        meetingLink: values.interviewType === "Online" ? values.meetingLink : undefined,
        interviewStatus: values.interviewStatus,
        feedback: values.feedback || "",
      }

      const response = await updateInterview(jobApplicationId, interview.id, interviewData, token)

      if (response.code === 200) {
        message.success("Cập nhật cuộc phỏng vấn thành công!")
        onSuccess(response.result)
        form.resetFields()
        onClose()
      } else {
        message.error(response.message || "Cập nhật cuộc phỏng vấn thất bại!")
      }
    } catch (error) {
      message.error("Không thể cập nhật cuộc phỏng vấn. Vui lòng thử lại!")
      console.log(error.message)
    } finally {
      setLoading(false)
    }
  }

  // Chuyển đổi initialValues.interviewDate sang đối tượng dayjs
  const initialInterviewDate = interview?.interviewDate
    ? dayjs(interview.interviewDate) // Chuyển đổi sang dayjs
    : null

  return (
    <Modal
      title="Chỉnh sửa cuộc phỏng vấn"
      open={visible}
      onCancel={onClose}
      footer={null}
      className="edit-interview-modal"
      closable={false}
    >
      <Form
        form={form}
        layout="vertical"
        onFinish={handleSubmit}
        initialValues={{
          interviewDate: initialInterviewDate,
          interviewType: interview?.interviewType || "Online",
          location: interview?.location,
          meetingLink: interview?.meetingLink,
          interviewStatus: interview?.interviewStatus || "Scheduled",
          feedback: interview?.feedback || "",
        }}
      >
        <Form.Item
          label="Ngày phỏng vấn"
          name="interviewDate"
          rules={[{ required: true, message: "Vui lòng chọn ngày phỏng vấn!" }]}
        >
          <DatePicker showTime style={{ width: "100%" }} format="YYYY-MM-DD HH:mm:ss" />
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
        <Form.Item label="Phản hồi" name="feedback">
          <Input.TextArea rows={4} />
        </Form.Item>
        <Form.Item>
          <Button type="primary" htmlType="submit" loading={loading}>
            Cập nhật
          </Button>
          <Button style={{ marginLeft: 8 }} onClick={onClose}>
            Hủy
          </Button>
        </Form.Item>
      </Form>
    </Modal>
  )
}

export default EditInterviewModal

