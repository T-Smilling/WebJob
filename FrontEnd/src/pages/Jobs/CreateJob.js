import { Row, Col, Form, Input, Button, Select, DatePicker, message } from "antd";
import "./CreateJob.css";
import Cookies from "js-cookie";
import { createJob } from "../../services/jobService";

const { TextArea } = Input;
const { Option } = Select;

function CreateJob({ companyId, onClose, onJobCreated }) {
  const [form] = Form.useForm();
  const token = Cookies.get("token")

  const onFinish = async (values) => {
    try {
      const formattedValues = {
        ...values,
        startDate: values.startDate ? values.startDate.toISOString() : null,
        endDate: values.endDate ? values.endDate.toISOString() : null,
        createJobSkills: values.skills ? values.skills.split(",").map(skill => ({ name: skill.trim() })) : [],
      };

      const response = await createJob(companyId,formattedValues,token);
      if (response.code === 200){
        message.success("Job created successfully!");
        form.resetFields();
        onJobCreated(response.result.id);
      }
    } catch (error) {
      message.error("Failed to create job. Please try again!");
    }
  };

  const onFinishFailed = () => {
    message.error("Please fill in all required fields!");
  };

  return (
    <div className="create-job-modal-content">
      <Form
        form={form}
        name="createJob"
        onFinish={onFinish}
        onFinishFailed={onFinishFailed}
        layout="vertical"
        initialValues={{
          title: "",
          description: "",
          location: "",
          salary: null,
          jobType: undefined,
          quantity: null,
          startDate: null,
          endDate: null,
          skills: "",
        }}
      >
        <Row gutter={16}>
          {/* Cột 1 */}
          <Col span={12}>
            <Form.Item
              name="title"
              label="Job Title"
              rules={[{ required: true, message: "Please input the job title!" }]}
            >
              <Input placeholder="Enter job title..." />
            </Form.Item>

            <Form.Item
              name="description"
              label="Description"
            >
              <TextArea rows={4} placeholder="Enter job description..." />
            </Form.Item>

            <Form.Item
              name="location"
              label="Location"
              rules={[{ required: true, message: "Please input the job location!" }]}
            >
              <Input placeholder="Enter job location..." />
            </Form.Item>
            <Form.Item
              name="salary"
              label="Salary"
            >
              <Input type="number" placeholder="Enter salary..." />
            </Form.Item>
          </Col>

          {/* Cột 2 */}
          <Col span={12}>
            <Form.Item
              name="jobType"
              label="Job Type"
            >
              <Select placeholder="Select job type...">
                <Option value="FULL_TIME">Full Time</Option>
                <Option value="PART_TIME">Part Time</Option>
                <Option value="REMOTE">Remote</Option>
              </Select>
            </Form.Item>

            <Form.Item
              name="quantity"
              label="Quantity"
            >
              <Input type="number" placeholder="Enter quantity..." />
            </Form.Item>

            <Form.Item
              name="startDate"
              label="Start Date"
            >
              <DatePicker style={{ width: "100%" }} />
            </Form.Item>

            <Form.Item
              name="endDate"
              label="End Date"
            >
              <DatePicker style={{ width: "100%" }} />
            </Form.Item>

            <Form.Item
              name="skills"
              label="Skills (comma-separated)"
            >
              <Input placeholder="Enter skills (e.g., Java, Python)..." />
            </Form.Item>
          </Col>
        </Row>

        <Form.Item>
          <Button type="primary" htmlType="submit" block>
          Thêm tin tuyển dụng
          </Button>
        </Form.Item>
      </Form>
    </div>
  );
}

export default CreateJob;