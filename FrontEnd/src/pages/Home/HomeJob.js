import { Card, Row, Col, Tag, Button, notification } from "antd";
import { Link, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import {
    EnvironmentOutlined,
    DollarOutlined,
    TeamOutlined,
    CalendarOutlined,
    UserOutlined, 
} from "@ant-design/icons";
import "./Home.css";
import { formatDate } from "../../utils/formatdate";
import { getHomeJob } from "../../services/jobService";
import { formatSalary } from "../../utils/formatsalary";
import { calculatePostedTime } from "../../utils/calculatePostedTime";

function HomeJob() {
    const [jobList, setJobList] = useState([]);
    const [message, contextHolder] = notification.useNotification();
    const navigate = useNavigate();

    useEffect(() => {
        const fetchData = async () => {
            const response = await getHomeJob();
            try {
                setJobList(response.result);
            } catch (error) {
                message.error({
                    message: "Get job detail failed",
                    duration: 1.5,
                });
            }
        };

        fetchData();
    }, []);
    return (
        <>
            {contextHolder}
            <div className="home-container">
                <h1 className="home-title">Danh sách việc làm nổi bật</h1>
                <Row gutter={[16, 16]}>
                    <Col span={24}>
                        <Card className="job-list-card">
                            {jobList.map((job) => (
                                <div key={job.id} className="job-item">
                                    <div className="job-info">
                                        <h3 className="job-title">
                                            <Link to={`/jobs/${job.id}`}>{job.title}</Link>
                                        </h3>
                                        <p className="job-company">{job.company?.companyName}</p>
                                        <div className="job-meta">
                                            <span>
                                                <EnvironmentOutlined /> {job.location}
                                            </span>
                                            <span>
                                                <DollarOutlined /> {formatSalary(job.salary)}
                                            </span>
                                            <span>
                                                <TeamOutlined /> {job.jobType}
                                            </span>
                                            <span>
                                                <UserOutlined /> {job.jobLevel} {/* Thay TeamOutlined bằng UserOutlined */}
                                            </span>
                                            <span>
                                                <CalendarOutlined /> {formatDate(job.startDate)}
                                            </span>
                                            <span className="createdAt">
                                                <CalendarOutlined /> <strong>Đăng: </strong>{calculatePostedTime(job.createAt)}
                                            </span>
                                        </div>
                                        <div className="job-skills">
                                            {job.requiredSkills &&
                                                job.requiredSkills.map((skill) => (
                                                    <Tag key={skill.id} color="blue" className="skill-tag">
                                                        {skill.name}
                                                    </Tag>
                                                ))}
                                        </div>
                                    </div>
                                    <Button type="primary" className="view-detail-btn">
                                        <Link to={`/jobs/${job.id}`}>Xem chi tiết</Link>
                                    </Button>
                                </div>
                            ))}
                        </Card>
                    </Col>
                </Row>
            </div>
        </>
    );
}

export default HomeJob;