import { useEffect } from "react"
import { Modal, Form, Input, Select, Button } from "antd"
import "./EditJobModel.css"

const { Option } = Select

const EditJobModal = ({ visible, onCancel, onFinish, job }) => {
  const [form] = Form.useForm()

  useEffect(() => {
    form.setFieldsValue({
      title: job?.title,
      description: job?.description,
      location: job?.location,
      salary: job?.salary,
      jobType: job?.jobType,
      jobLevel: job?.jobLevel,
      updateSkills: job?.requiredSkills?.map((skill) => skill.name) || [],
    })
  }, [job, form])

  const handleFinish = (values) => {
    onFinish(values)
  }

  return (
    <Modal
      title={`Chỉnh sửa ${job?.title}`}
      visible={visible}
      onCancel={onCancel}
      footer={null}
      width={800}
      className="edit-job-modal"
      closable={false}
    >
      <Form
        form={form}
        layout="vertical"
        onFinish={handleFinish}
        initialValues={{
          title: job?.title,
          description: job?.description,
          location: job?.location,
          salary: job?.salary,
          jobType: job?.jobType,
          jobLevel: job?.jobLevel,
          updateSkills: job?.requiredSkills?.map((skill) => skill.name) || [],
        }}
      >
        <Form.Item name="title" label="Title" rules={[{ required: true, message: "Title is required!" }]}>
          <Input placeholder="Enter job title" />
        </Form.Item>

        <Form.Item name="description" label="Description">
          <Input.TextArea placeholder="Enter job description" rows={4} />
        </Form.Item>

        <Form.Item name="location" label="Location" rules={[{ required: true, message: "Location is required!" }]}>
          <Input placeholder="Enter location" />
        </Form.Item>

        <Form.Item name="salary" label="Salary">
          <Input type="number" placeholder="Enter salary" />
        </Form.Item>

        <Form.Item name="jobType" label="Job Type" rules={[{ required: true, message: "Job type is required!" }]}>
          <Select placeholder="Select job type">
            <Option value="FULL_TIME">FULL_TIME</Option>
            <Option value="PART_TIME">PART_TIME</Option>
            <Option value="REMOTE">REMOTE</Option>
          </Select>
        </Form.Item>
        <Form.Item
          name="jobLevel"
          label="Job Level"
        >
          <Select placeholder="Select job level...">
            <Option value="INTERN">Intern</Option>
            <Option value="JUNIOR">Junior</Option>
            <Option value="MID">Middle</Option>
            <Option value="SENIOR">Senior</Option>
            <Option value="LEADER">Leader</Option>
          </Select>
        </Form.Item>

        <Form.Item name="updateSkills" label="Required Skills">
          <Select mode="tags" placeholder="Enter required skills" style={{ width: "100%" }} />
        </Form.Item>

        <Form.Item>
          <Button type="primary" htmlType="submit">
            Save Changes
          </Button>
        </Form.Item>
      </Form>
    </Modal>
  )
}

export default EditJobModal

