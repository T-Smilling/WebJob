import { useEffect, useState } from 'react';
import { useParams, useSearchParams } from 'react-router-dom';
import { List, Typography, Tag, Collapse, Button, Space, message, Select, Modal } from 'antd';
import { UserOutlined, FileOutlined, CalendarOutlined, EditOutlined, DeleteOutlined, PlusOutlined } from '@ant-design/icons';
import CustomPagination from '../../components/Pagination';
import './JobApplications.css';
import { getApplicationsByJobPost, updateApplicationStatus } from '../../services/applicationService';
import Cookies from 'js-cookie';
import { extractFilename } from '../../utils/extractFilename';
import { getUserScopes, hasScope } from '../../utils/authUtils';
import { checkCreateBy } from '../../services/jobService';
import CreateInterviewModal from '../../components/Interview/CreateInterviewModal';
import EditInterviewModal from '../../components/Interview/EditInterviewModal';
import { deleteInterview } from '../../services/interviewService';

const { Title, Text } = Typography;
const { Panel } = Collapse;
const { Option } = Select;

const JobApplications = () => {
  const { jobId } = useParams();
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
  const [isEmployee, setIsEmployee] = useState(false);
  const [userScopes, setUserScopes] = useState([]);
  const [selectedApplication, setSelectedApplication] = useState(null);
  const [isStatusModalVisible, setIsStatusModalVisible] = useState(false);
  const [isCreateInterviewModalVisible, setIsCreateInterviewModalVisible] = useState(false);
  const [isEditInterviewModalVisible, setIsEditInterviewModalVisible] = useState(false);
  const [isDeleteInterviewModalVisible, setIsDeleteInterviewModalVisible] = useState(false);
  const [selectedInterview, setSelectedInterview] = useState(null);
  const [currentApplicationId, setCurrentApplicationId] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const responseEmployee = await checkCreateBy(jobId, token);
        setIsEmployee(responseEmployee.result.isEmployee);
        const response = await getApplicationsByJobPost(jobId, currentPage - 1, pageSize, token);
        setJobApplications({
          content: response.result.content || [],
          page: response.result.page || 0,
          size: response.result.size || pageSize,
          totalElements: response.result.totalElements || 0,
          totalPages: response.result.totalPages || 0,
        });
      } catch (error) {
        message.error("Không thể tải danh sách ứng tuyển. Vui lòng thử lại!");
        console.log(error.message);
      }
    };
    fetchData();
    const scopes = getUserScopes();
    setUserScopes(scopes);
  }, [jobId, currentPage, token]);

  const handleStatusChange = async (value) => {
    if (selectedApplication) {
      try {
        const response = await updateApplicationStatus(jobId, selectedApplication.id, { statusResume: value }, token);
        if (response.code === 200) {
          message.success("Cập nhật trạng thái thành công!");
          setJobApplications(prev => ({
            ...prev,
            content: prev.content.map(app =>
              app.id === selectedApplication.id ? { ...app, statusResume: value } : app
            ),
          }));
          if (value === 'APPROVED') {
            setCurrentApplicationId(selectedApplication.id);
            setIsCreateInterviewModalVisible(true); // Tự động mở modal khi APPROVED
          }
          setIsStatusModalVisible(false);
          setSelectedApplication(null);
        } else {
          message.error(response.message || "Cập nhật trạng thái thất bại!");
        }
      } catch (error) {
        message.error("Không thể cập nhật trạng thái. Vui lòng thử lại!");
        console.log(error.message);
      }
    }
  };

  const showStatusModal = (application) => {
    setSelectedApplication(application);
    setIsStatusModalVisible(true);
  };

  const handleStatusModalClose = () => {
    setIsStatusModalVisible(false);
    setSelectedApplication(null);
  };

  const handleCreateInterviewSuccess = (newInterview) => {
    setJobApplications(prev => ({
      ...prev,
      content: prev.content.map(app =>
        app.id === currentApplicationId
          ? { ...app, interviews: [...(app.interviews || []), newInterview] }
          : app
      ),
    }));
    setIsCreateInterviewModalVisible(false);
    setCurrentApplicationId(null);
  };

  const handleEditInterview = (interview, applicationId) => {
    setSelectedInterview(interview);
    setCurrentApplicationId(applicationId);
    setIsEditInterviewModalVisible(true);
  };

  const handleEditInterviewSuccess = (updatedInterview) => {
    setJobApplications(prev => ({
      ...prev,
      content: prev.content.map(app =>
        app.id === currentApplicationId
          ? {
              ...app,
              interviews: app.interviews.map(int =>
                int.id === updatedInterview.id ? updatedInterview : int
              ),
            }
          : app
      ),
    }));
    setIsEditInterviewModalVisible(false);
    setSelectedInterview(null);
    setCurrentApplicationId(null);
  };

  const showDeleteInterviewModal = (interview, applicationId) => {
    setSelectedInterview(interview);
    setCurrentApplicationId(applicationId);
    setIsDeleteInterviewModalVisible(true);
  };

  const handleDeleteInterviewConfirm = async () => {
    try {
      const response = await deleteInterview(currentApplicationId,selectedInterview.id,token)
      if (response.code === 200) {
        message.success("Xóa cuộc phỏng vấn thành công!");
        setJobApplications(prev => ({
          ...prev,
          content: prev.content.map(app =>
            app.id === currentApplicationId
              ? {
                  ...app,
                  interviews: app.interviews.filter(int => int.id !== selectedInterview.id),
                }
              : app
          ),
        }));
        setIsDeleteInterviewModalVisible(false);
        setSelectedInterview(null);
        setCurrentApplicationId(null);
      } else {
        message.error(response.message || "Xóa cuộc phỏng vấn thất bại!");
      }
    } catch (error) {
      message.error("Không thể xóa cuộc phỏng vấn. Vui lòng thử lại!");
      console.log(error.message);
    }
  };

  const handleDeleteInterviewModalClose = () => {
    setIsDeleteInterviewModalVisible(false);
    setSelectedInterview(null);
    setCurrentApplicationId(null);
  };

  const showCreateInterviewModal = (applicationId) => {
    setCurrentApplicationId(applicationId);
    setIsCreateInterviewModalVisible(true);
  };

  return (
    <div className="job-applications-container">
      <Title level={2}>Danh sách ứng tuyển</Title>
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
                                    <Space>
                                      <Button
                                        size="small"
                                        icon={<EditOutlined />}
                                        onClick={() => handleEditInterview(interview, application.id)}
                                      >
                                        Sửa
                                      </Button>
                                      <Button
                                        size="small"
                                        danger
                                        icon={<DeleteOutlined />}
                                        onClick={() => showDeleteInterviewModal(interview, application.id)}
                                      >
                                        Xóa
                                      </Button>
                                    </Space>
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
                <div style={{ display: 'flex', justifyContent: 'flex-end', alignItems: 'center', gap: '8px' }}>
                  {((hasScope(userScopes, "ROLE_EMPLOYER") && isEmployee) || hasScope(userScopes, "ROLE_ADMIN")) && (
                    <>
                      <Button
                        icon={<EditOutlined />}
                        onClick={() => showStatusModal(application)}
                        size="small"
                      >
                        Sửa trạng thái
                      </Button>
                      {application.statusResume === 'APPROVED' && (
                        <Button
                          icon={<PlusOutlined />}
                          onClick={() => showCreateInterviewModal(application.id)}
                          size="small"
                        >
                          Tạo phỏng vấn
                        </Button>
                      )}
                    </>
                  )}
                </div>
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
      <Modal
        title="Cập nhật trạng thái"
        open={isStatusModalVisible}
        onCancel={handleStatusModalClose}
        footer={null}
      >
        <Select
          defaultValue={selectedApplication?.statusResume}
          onChange={handleStatusChange}
          style={{ width: '100%', marginBottom: 16 }}
        >
          <Option value="PENDING">PENDING</Option>
          <Option value="REVIEWING">REVIEWING</Option>
          <Option value="APPROVED">APPROVED</Option>
          <Option value="REJECTED">REJECTED</Option>
        </Select>
        <Button type="primary" onClick={handleStatusModalClose}>
          Đóng
        </Button>
      </Modal>
      <CreateInterviewModal
        visible={isCreateInterviewModalVisible}
        onClose={() => setIsCreateInterviewModalVisible(false)}
        jobApplicationId={currentApplicationId}
        onSuccess={handleCreateInterviewSuccess}
      />
      <EditInterviewModal
        visible={isEditInterviewModalVisible}
        onClose={() => setIsEditInterviewModalVisible(false)}
        interview={selectedInterview}
        jobApplicationId={currentApplicationId}
        onSuccess={handleEditInterviewSuccess}
      />
      <Modal
        title="Xác nhận xóa cuộc phỏng vấn"
        open={isDeleteInterviewModalVisible}
        onOk={handleDeleteInterviewConfirm}
        onCancel={handleDeleteInterviewModalClose}
        okText="Xóa"
        cancelText="Hủy"
      >
        <Text>Bạn có chắc chắn muốn xóa cuộc phỏng vấn này? Hành động này không thể hoàn tác.</Text>
      </Modal>
    </div>
  );
};

export default JobApplications;