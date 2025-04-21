import { Tag, Button, Row, Col } from "antd";
import { Link } from "react-router-dom";
import { EnvironmentOutlined, DollarOutlined, ClockCircleOutlined } from "@ant-design/icons";
import { useNavigate } from "react-router-dom";
import { formatSalary } from "../../utils/formatsalary";
import {calculatePostedTime} from "../../utils/calculatePostedTime"
import "./JobItem.css";

function JobItem(props) {
  const { data } = props;
  const formattedEndDate = new Date(data.endDate).toLocaleDateString("vi-VN");
  const isExpired = data.endDate && new Date(data.endDate) < new Date();
  const navigate = useNavigate();

  const handleApply = () => {
    navigate(`/jobs/${data.id}`);
  };

  return (
    <div className="job-item">
      <Row className="job-item-content" align="middle" gutter={[16, 16]}>
        <Col xs={24} md={20} className="job-item-main">
          <h3 className="job-item-title">
            <Link to={`/jobs/${data.id}`}>{data.title}</Link>
          </h3>
          <div className="job-item-details">
            <span>
              <EnvironmentOutlined /> {data.location}
            </span>
            <span>
              <DollarOutlined /> {formatSalary(data.salary)}
            </span>
            <span>
              <strong>Hình thức:</strong> <Tag color="green">{data.jobType}</Tag>
            </span>
            <span>
              <strong>Trình độ:</strong> <Tag color="blue">{data.jobLevel}</Tag>
            </span>
            <span>
              <ClockCircleOutlined /> {formattedEndDate}
            </span>
          </div>
          <div className="job-item-skills">
            {data.requiredSkills &&
              data.requiredSkills.map((skill, index) => (
                <Tag color="blue" key={index}>
                  {skill.name}
                </Tag>
              ))}
          </div>
          <div className="job-item-company">
              <div>
                <strong>Công ty:</strong> {data.company.companyName}
              </div>
              <div className="createdAt">
                <strong>Đăng:</strong> {calculatePostedTime(data.createAt)}
              </div>
          </div>
        </Col>
        <Col xs={24} md={4} className="job-item-button">
          <Button
            type="primary"
            onClick={handleApply}
            className="apply-button"
            block
          >
            {isExpired ? "Đã hết hạn" : "Apply Now"}
          </Button>
        </Col>
      </Row>
    </div>
  );
}

export default JobItem;