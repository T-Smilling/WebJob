import { useParams, NavLink } from "react-router-dom";
import { Card, Row, Col, Tag, Button, notification, Modal, Form, Input, Select } from "antd";
import { CalendarOutlined, DollarOutlined, TeamOutlined, EnvironmentOutlined, EyeOutlined, MailOutlined, UserOutlined, PhoneOutlined, BarsOutlined } from "@ant-design/icons";
import "./JobDetail.css";
import { useEffect, useState } from "react";
import { formatDate } from "../../utils/formatdate";
import { formatSalary } from "../../utils/formatsalary";
import { checkCreateBy, getJobDetail, updateJob } from "../../services/jobService";
import { getUserScopes, hasScope } from "../../utils/authUtils";
import Cookies from "js-cookie";
import ModelApply from "../../components/ModelApply";
import EditJobModal from "./EditJobModal";
import { sendEmailToSubscribers, subscribeToJob } from "../../services/subscribeService";

function JobDetail() {
  const token = Cookies.get('token');
  const { id } = useParams();
  const [job, setJob] = useState({});
  const [message, contextHolder] = notification.useNotification();

  const [isModalVisible, setIsModalVisible] = useState(false);
  const [isEditModalVisible, setIsEditModalVisible] = useState(false);
  const [isSubscribeModalVisible, setIsSubscribeModalVisible] = useState(false);
  const [isEmailModalVisible, setIsEmailModalVisible] = useState(false); // Modal xác nhận gửi email
  const [userScopes, setUserScopes] = useState([]);
  const [isEmployee, setIsEmployee] = useState(false);
  const [form] = Form.useForm();

  // Kiểm tra xem công việc đã hết hạn chưa
  const isJobExpired = () => {
    if (!job.endDate) return false;
    const currentDate = new Date();
    const endDate = new Date(job.endDate);
    return currentDate > endDate;
  };

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await getJobDetail(id);
        setJob(response.result);
      } catch (error) {
        message.error({
          message: 'Get job detail failed',
          duration: 1.5
        });
        return;
      }

      try {
        const responseCheck = await checkCreateBy(id, token);
        setIsEmployee(responseCheck.result.isEmployee);
      } catch (error) {
        console.log("Error checking employee status:", error.message);
      }
    };

    fetchData();
    const scopes = getUserScopes();
    setUserScopes(scopes);
  }, [id, token]);

  const handleClick = () => {
    if (!isJobExpired()) {
      setIsModalVisible(true); // Chỉ mở modal nếu chưa hết hạn
    }
  };
  const handleCancel = () => {
    setIsModalVisible(false);
  };

  const showEditModal = () => {
    setIsEditModalVisible(true);
  };

  const handleEditCancel = () => {
    setIsEditModalVisible(false);
  };
  setTimeout(() => {
    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  }, 0);
  const handleEditFinish = async (values) => {
    try {
      const payload = {
        title: values.title,
        description: values.description,
        location: values.location,
        salary: values.salary,
        jobType: values.jobType,
        jobLevel: values.jobLevel,
        updateSkills: values.updateSkills.map((skillName) => ({ name: skillName })),
      };
      const response = await updateJob(id, payload, token);
      if (response.code === 200) {
        message.success({
          message: "Cập nhật thành công",
          description: "Cập nhật công việc thành công!. Hãy xem xét đúng chưa"
        });
        const updatedJob = { ...job, ...response.result };
        setJob(updatedJob);
        setIsEditModalVisible(false);
      } else {
        message.error({
          message: response.message || "Cập nhật thất bại!",
          description: "Không thể cập nhật công việc. Vui lòng thử lại!"
        });
      }
    } catch (error) {
      message.error({
        message: "Cập nhật thất bại!",
        description: "Không thể cập nhật công việc. Vui lòng thử lại!"
      });
      console.log(error.message);
    }
  };

  const handleSubscribeClick = () => {
    setIsSubscribeModalVisible(true);
  };

  const handleSubscribeCancel = () => {
    setIsSubscribeModalVisible(false);
    form.resetFields();
  };

  const handleSubscribeFinish = async (values) => {
    const payload = {
      name: values.name,
      email: values.email,
      phone: values.phone,
      updateSkills: values.updateSkills ? values.updateSkills.map(skill => ({ name: skill })) : []
    };

    try {
        const response = await subscribeToJob(id, payload, token);
        if(response.code === 200){
          message.success({
              message: "Đăng ký theo dõi thành công",
              description: "Bạn đã theo dõi công việc này!"
            });
          setIsSubscribeModalVisible(false);
          form.resetFields();
        }
    } catch (error) {
      message.error({
        message: "Đăng ký thất bại",
        description: "Không thể đăng ký theo dõi. Vui lòng thử lại!"
      });
    }
  };

  // Xử lý gửi email
  const handleSendEmailClick = () => {
    setIsEmailModalVisible(true);
  };

  const handleEmailCancel = () => {
    setIsEmailModalVisible(false);
  };

  const handleEmailConfirm = async () => {
    try {
      const response = await sendEmailToSubscribers(id, token);
      console.log(response)
      if (response.code === 200) {
        message.success({
          message: "Gửi email thành công",
          description: "Email đã được gửi đến tất cả người theo dõi!"
        });
      } else {
        message.error({
          message: response.message || "Gửi email thất bại!",
          description: "Không thể gửi email. Vui lòng thử lại!"
        });
      }
    } catch (error) {
      message.error({
        message: "Gửi email thất bại!",
        description: error.response?.data?.message || "Không thể gửi email!"
      });
    }
    setIsEmailModalVisible(false);
  };

  const isEditable = isEmployee && (hasScope(userScopes, "ROLE_EMPLOYER") || hasScope(userScopes, "ROLE_ADMIN"));

  return (
    <>
      {contextHolder}
      <div className="job-detail-container-1">
        <Card
          className="job-header-card-1"
          title={<h2 className="job-title-1">{job.title}</h2>}
          extra={
            isEditable && (
              <Row gutter={[8, 0]}>
                <Col>
                  <Button onClick={showEditModal} type="default" size="large">
                    Edit Job
                  </Button>
                </Col>
                <Col>
                  <Button onClick={handleSendEmailClick} type="default" size="large" icon={<MailOutlined />}>
                    Send Email
                  </Button>
                </Col>
              </Row>
            )
          }
        >
          <Row gutter={[16, 16]} align="middle">
            <Col xs={24} md={16}>
              <div className="company-name-1">{job.company?.companyName}</div>
              <div className="location-1">
                <EnvironmentOutlined /> {job.location}
              </div>
            </Col>
            <Col xs={24} md={8} className="apply-button-col-1">
              <Row gutter={[8, 8]}>
                <Col xs={12}>
                  <Button
                    onClick={handleClick}
                    type={isJobExpired() ? "default" : "primary"} // Đổi màu nếu hết hạn
                    size="large"
                    block
                    disabled={isJobExpired()} // Vô hiệu hóa nếu hết hạn
                  >
                    {isJobExpired() ? "Đã hết hạn" : "Apply Now"}
                  </Button>
                </Col>
                <Col xs={12}>
                  <Button onClick={handleSubscribeClick} type="default" size="large" block icon={<EyeOutlined />}>
                    Subscribe
                  </Button>
                </Col>
              </Row>
            </Col>
          </Row>
        </Card>

        <Modal
          title={`Ứng tuyển ${job.title}`}
          visible={isModalVisible}
          onCancel={handleCancel}
          footer={null}
          width={800}
        >
          <ModelApply props={job.id} />
        </Modal>

        <Modal
          title="Theo dõi công việc"
          visible={isSubscribeModalVisible}
          onCancel={handleSubscribeCancel}
          footer={null}
        >
          <Form
            form={form}
            onFinish={handleSubscribeFinish}
            layout="vertical"
          >
            <Form.Item
              name="name"
              label="Họ và tên"
              rules={[{ required: true, message: 'Vui lòng nhập họ và tên!' }]}
            >
              <Input prefix={<UserOutlined />} />
            </Form.Item>

            <Form.Item
              name="email"
              label="Email"
              rules={[
                { required: true, message: 'Vui lòng nhập email!' },
                { type: 'email', message: 'Email không hợp lệ!' }
              ]}
            >
              <Input prefix={<MailOutlined />} />
            </Form.Item>

            <Form.Item
              name="phone"
              label="Số điện thoại"
              rules={[
                { required: true, message: 'Vui lòng nhập số điện thoại!' },
                { pattern: /^[0-9]{10}$/, message: 'Số điện thoại phải là 10 chữ số!' }
              ]}
            >
              <Input prefix={<PhoneOutlined />} />
            </Form.Item>

            <Form.Item
              name="updateSkills"
              label="Kỹ năng"
            >
              <Select
                mode="tags"
                placeholder="Nhập kỹ năng của bạn"
                style={{ width: '100%' }}
              />
            </Form.Item>

            <Form.Item>
              <Button type="primary" htmlType="submit">
                Đăng ký theo dõi
              </Button>
              <Button onClick={handleSubscribeCancel} style={{ marginLeft: 8 }}>
                Hủy
              </Button>
            </Form.Item>
          </Form>
        </Modal>

        <Modal
          title="Xác nhận gửi email"
          visible={isEmailModalVisible}
          onOk={handleEmailConfirm}
          onCancel={handleEmailCancel}
          okText="Gửi"
          cancelText="Hủy"
        >
          <p>Bạn có chắc chắn muốn gửi email đến tất cả người theo dõi công việc này không?</p>
        </Modal>

        <EditJobModal
          visible={isEditModalVisible}
          onCancel={handleEditCancel}
          onFinish={handleEditFinish}
          job={job}
        />

        <Row gutter={[24, 24]} className="job-content">
          <Col xs={24} lg={16}>
            <Card title="Job Description" className="job-description-card">
              <p>{job.description}</p>
            </Card>

            <Card title="Required Skills" className="skills-card">
              <div className="skills-list">
                {job.requiredSkills &&
                  job.requiredSkills
                    .filter((skill) => skill && skill.name)
                    .map((skill) => (
                      <Tag key={skill.id} color="blue" className="skill-tag">
                        {skill.name}
                      </Tag>
                    ))}
              </div>
            </Card>
          </Col>

          <Col xs={24} lg={8}>
            <Card className="job-info-card-1">
              <div className="info-item-1">
                <span className="info-label-1">
                  <DollarOutlined /> Salary
                </span>
                <span className="info-value-1">{formatSalary(job.salary)}</span>
              </div>
              <div className="info-item-1">
                <span className="info-label-1">
                  <TeamOutlined /> Job Type
                </span>
                <span className="info-value-1">{job.jobType}</span>
              </div>
              <div className="info-item-1">
                <span className="info-label-1">
                  <BarsOutlined /> Job Level
                </span>
                <span className="info-value-1">{job.jobLevel || "N/A"}</span>
              </div>
              <div className="info-item-1">
                <span className="info-label-1">
                  <CalendarOutlined /> Start Date
                </span>
                <span className="info-value-1">{formatDate(job.startDate)}</span>
              </div>
              <div className="info-item-1">
                <span className="info-label-1">
                  <CalendarOutlined /> End Date
                </span>
                <span className="info-value-1">{job.endDate ? formatDate(job.endDate) : "N/A"}</span>
              </div>
              <div className="info-item-1">
                <span className="info-label-1">Quantity</span>
                <span className="info-value-1">{job.quantity} positions</span>
              </div>
              <div className="info-item-1">
                <span className="info-label-1">Applications</span>
                <span className="info-value-1">{job.numberOfJobApplications}</span>
              </div>
              <div className="info-item-1">
                <span className="info-label-1">Subscribers</span>
                <span className="info-value-1">{job.numberOfSubscribers}</span>
              </div>
            </Card>

            <Card
              title="Company Information"
              className="company-card-1"
              extra={
                <Button type="link">
                  <NavLink to={`/companies/${job.company?.id}`}>Xem chi tiết công ty</NavLink>
                </Button>
              }
            >
              <div className="company-info-1">
                {job.company?.logoUrl && (
                  <img src={job.company.logoUrl} alt="Company Logo" className="company-logo-1" />
                )}
                <h3>{job.company?.companyName}</h3>
              </div>
            </Card>
          </Col>
        </Row>
      </div>
    </>
  );
}

export default JobDetail;