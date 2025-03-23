import { useEffect, useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import { List, Typography, Tag, Space, Collapse } from 'antd';
import { FileOutlined, CalendarOutlined ,UserOutlined } from '@ant-design/icons';
import CustomPagination from '../../components/Pagination';
import '../Application/JobApplications.css';
import { getApplicationsByUser } from '../../services/applicationService';
import Cookies from 'js-cookie';
import { extractFilename } from '../../utils/extractFilename';

const { Title, Text } = Typography;
const { Panel } = Collapse;

function ApplicationByUser() {
  const token = Cookies.get('token');
  const [searchParams, setSearchParams] = useSearchParams();
  const currentPage = parseInt(searchParams.get("page") || "1", 10);
  const pageSize = 9;
  const [jobApplications, setJobApplications] = useState({
    content: [],
    page: 0,
    size: pageSize,
    totalElements: 0,
    totalPages: 0,
  });

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await getApplicationsByUser(currentPage - 1, pageSize, token);
        setJobApplications({
          content: response.result.content || [],
          page: response.result.page || 0,
          size: response.result.size || pageSize,
          totalElements: response.result.totalElements || 0,
          totalPages: response.result.totalPages || 0,
        });
      } catch (error) {
        console.log(error.message);
      }
    };
    fetchData();
  }, [currentPage, token]);

  return (
    <div className="job-applications-container">
      <Title level={2}>Danh sách ứng tuyển của người dùng</Title>
      {jobApplications.content.length > 0 ? (
        <>
          <List
            className="job-applications-list"
            dataSource={jobApplications.content}
            renderItem={(application) => (
              <List.Item>
                <List.Item.Meta
                  title={
                    <Space>
                      {application.user?.avatarUrl ? (
                        <img
                          src={application.user.avatarUrl}
                          alt="Avatar"
                          style={{ width: '30px', height: '30px', borderRadius: '50%' }}
                        />
                      ) : (
                        <UserOutlined/>
                      )}
                      <Text strong>{application.user?.fullName || "N/A"}</Text>
                      <Tag
                        color={
                          application.statusResume === 'APPROVED' ? 'green' :
                          application.statusResume === 'REJECTED' ? 'red' :
                          application.statusResume === 'REVIEWING' ? 'blue' : 'orange'
                        }
                      >
                        {application.statusResume}
                      </Tag>
                    </Space>
                  }
                  description={
                    <div>
                      <Space direction="vertical">
                        <Text>Email: {application.user?.email || "N/A"}</Text>
                        <Text>Phone: {application.user?.phone || "N/A"}</Text>
                        <div>
                          <FileOutlined />{' '}
                          <Text>
                            Resume:{' '}
                            {application.resume?.resumeUrl ? (
                              <a href={application.resume.resumeUrl} target="_blank" rel="noopener noreferrer">
                                <span style={{ paddingLeft: '10px' }}>{extractFilename(application.resume.resumeUrl)}</span>
                              </a>
                            ) : (
                              <span style={{ paddingLeft: '10px' }}>Xem CV</span>
                            )}
                          </Text>
                        </div>
                        {application.statusResume === 'APPROVED' && application.interviews?.length > 0 && (
                          <Collapse bordered={false}>
                            <Panel header="Lịch phỏng vấn" key="1">
                              {application.interviews.map((interview) => (
                                <div key={interview.id} className="interview-item">
                                  <Space direction="vertical">
                                    <Text>
                                      <CalendarOutlined />{' '}
                                      Ngày phỏng vấn: {new Date(interview.interviewDate).toLocaleString()}
                                    </Text>
                                    <Text>
                                      Loại: {interview.interviewType === 'Online' ? 'Online' : 'Offline'}
                                    </Text>
                                    {interview.interviewType === 'Online' && (
                                      <Text>
                                        Link họp:{' '}
                                        <a href={interview.meetingLink} target="_blank" rel="noopener noreferrer">
                                          {interview.meetingLink}
                                        </a>
                                      </Text>
                                    )}
                                    {interview.interviewType === 'Offline' && (
                                      <Text>Địa điểm: {interview.location}</Text>
                                    )}
                                    <Text>
                                      Trạng thái:{' '}
                                      <Tag
                                        color={
                                          interview.interviewStatus === 'Scheduled' ? 'blue' :
                                          interview.interviewStatus === 'Completed' ? 'green' : 'red'
                                        }
                                      >
                                        {interview.interviewStatus}
                                      </Tag>
                                    </Text>
                                    {interview.feedback && (
                                      <Text>Phản hồi: {interview.feedback}</Text>
                                    )}
                                  </Space>
                                </div>
                              ))}
                            </Panel>
                          </Collapse>
                        )}
                      </Space>
                    </div>
                  }
                />
              </List.Item>
            )}
          />
          <CustomPagination
            totalItems={jobApplications.totalElements}
            pageSize={pageSize}
          />
        </>
      ) : (
        <Text className="no-data-apply">Không có ứng tuyển nào cho công việc này.</Text>
      )}
    </div>
  );
}

export default ApplicationByUser;