import React, { useEffect, useState } from 'react';
import { useNavigate, useParams, useSearchParams } from 'react-router-dom';
import { Typography, Space, List, Row, Col, Button, Modal, message, Tabs } from 'antd';
import { EnvironmentOutlined, TeamOutlined, GlobalOutlined, PlusOutlined, EditOutlined, DeleteOutlined, FileTextOutlined } from '@ant-design/icons'; // Thêm icon FileTextOutlined
import './CompanyDetail.css';
import { deleteCompany, getCompanyById, updateCompany } from '../../services/companyService';
import { getUserScopes, hasScope } from "../../utils/authUtils";
import CreateJob from '../Jobs/CreateJob';
import Cookies from 'js-cookie';
import { checkEmployee, deleteEmployee, getEmployerInCompany, updateEmployee } from '../../services/employeeService';
import EditCompanyForm from '../../components/Company/EditCompanyForm';
import AddEmployeeModal from '../Employee/AddEmployeeModal';
import EditEmployeeModal from '../Employee/EditEmployeeModal';
import CustomPagination from '../../components/Pagination';
import { deleteJob } from '../../services/jobService';

const { Title, Text } = Typography;
const { TabPane } = Tabs;

const CompanyDetail = () => {
  const token = Cookies.get("token");
  const { id } = useParams();
  const [company, setCompany] = useState(null);
  const [userScopes, setUserScopes] = useState([]);
  const [employees, setEmployees] = useState({ data: [], totalItems: 0 });
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [isEditModalVisible, setIsEditModalVisible] = useState(false);
  const [isDeleteModalVisible, setIsDeleteModalVisible] = useState(false);
  const [isAddEmployeeModalVisible, setIsAddEmployeeModalVisible] = useState(false);
  const [isEditEmployeeModalVisible, setIsEditEmployeeModalVisible] = useState(false);
  const [isDeleteEmployeeModalVisible, setIsDeleteEmployeeModalVisible] = useState(false);
  const [isEmployee, setIsEmployee] = useState(false);
  const [selectedEmployee, setSelectedEmployee] = useState(null);
  const [isDeleteJobModalVisible, setIsDeleteJobModalVisible] = useState(false);
  const [selectedJobId, setSelectedJobId] = useState(null);
  const [selectedJobTitle, setSelectedJobTitle] = useState("");

  const [searchParams] = useSearchParams();
  const currentJobPage = parseInt(searchParams.get("page") || "1", 10);
  const currentEmployeePage = parseInt(searchParams.get("page") || "1", 10);
  const size = 4;

  const navigate = useNavigate();

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await getCompanyById(id, currentJobPage - 1, size);
        const responseEmployee = await checkEmployee(id, token);
        setCompany(response.result);
        setIsEmployee(responseEmployee.result.isEmployee);
      } catch (error) {
        console.log(error.message);
      }
    };
    fetchData();
    
    const scopes = getUserScopes();
    setUserScopes(scopes);
  }, [id, currentJobPage, token]);
  useEffect(() => {
    const fetchEmployeesData = async () => {
      if (isEmployee && (hasScope(userScopes, "ROLE_EMPLOYER") || hasScope(userScopes, "ROLE_ADMIN"))) {
        try {
          const employeeResponse = await getEmployerInCompany(id, currentEmployeePage - 1, size, token);
          setEmployees({
            data: employeeResponse.result.content || [],
            totalItems: employeeResponse.result.totalElements || 0
          });
        } catch (error) {
          console.log(error.message);
        }
      }
    };
    fetchEmployeesData();
  }, [currentEmployeePage, id, isEmployee, userScopes, token]);

  if (!company) {
    return (
      <div className="one-company-detail-container" style={{ textAlign: 'center', padding: '50px' }}>
        <Text>Loading company details...</Text>
      </div>
    );
  }

  const handleClick = (e) => {
    navigate(`/jobs/${e}`);
  };

  // Thêm hàm xử lý chuyển hướng đến trang danh sách ứng tuyển
  const handleViewApplications = (jobId) => {
    navigate(`/application/jobs/${jobId}`);
  };

  const handleAddJob = () => {
    setIsModalVisible(true);
  };

  const handleModalClose = () => {
    setIsModalVisible(false);
  };

  const handleJobCreated = (jobId) => {
    setIsModalVisible(false);
    navigate(`/jobs/${jobId}`);
  };

  const handleEdit = () => {
    setIsEditModalVisible(true);
  };

  const handleEditModalClose = () => {
    setIsEditModalVisible(false);
  };

  const handleEditSubmit = async (values) => {
    try {
      const updatedCompany = await updateCompany(id, values, token);
      if (updatedCompany.code === 200) {
        setCompany(updatedCompany.result);
        message.success("Company updated successfully!");
        setIsEditModalVisible(false);
      }
    } catch (error) {
      message.error("Failed to update company. Please try again!");
    }
  };

  const handleDelete = () => {
    setIsDeleteModalVisible(true);
  };

  const handleDeleteModalClose = () => {
    setIsDeleteModalVisible(false);
  };

  const handleDeleteConfirm = async () => {
    try {
      const response = await deleteCompany(id, token);
      if (response.code === 200) {
        message.success("Company deleted successfully!");
        setIsDeleteModalVisible(false);
        navigate('/companies/all-company');
      }
    } catch (error) {
      message.error("Failed to delete company. Please try again!");
    }
  };

  const showDeleteJobModal = (jobId, jobTitle) => {
    setSelectedJobId(jobId);
    setSelectedJobTitle(jobTitle);
    setIsDeleteJobModalVisible(true);
  };

  const handleDeleteJobModalClose = () => {
    setIsDeleteJobModalVisible(false);
    setSelectedJobId(null);
    setSelectedJobTitle("");
  };

  const handleDeleteJobConfirm = async () => {
    try {
      const response = await deleteJob(id, selectedJobId, token);
      if (response.code === 200) {
        message.success("Xóa công việc thành công!");
        setCompany((prev) => ({
          ...prev,
          jobPosts: {
            ...prev.jobPosts,
            content: prev.jobPosts.content.filter((job) => job.id !== selectedJobId),
            totalElements: prev.jobPosts.totalElements - 1,
          },
        }));
        setIsDeleteJobModalVisible(false);
        setSelectedJobId(null);
        setSelectedJobTitle("");
      } else {
        message.error(response.message || "Xóa công việc thất bại!");
      }
    } catch (error) {
      message.error("Không thể xóa công việc. Vui lòng thử lại!");
      console.log(error.message);
    }
  };

  const handleEditEmployee = (employee) => {
    setSelectedEmployee(employee);
    setIsEditEmployeeModalVisible(true);
  };

  const handleEditEmployeeModalClose = () => {
    setIsEditEmployeeModalVisible(false);
    setSelectedEmployee(null);
  };

  const handleEditEmployeeSubmit = async (values) => {
    try {
      const updatedEmployee = await updateEmployee(id, selectedEmployee.id, values, token);
      if (updatedEmployee.code === 200) {
        if (!Array.isArray(employees.data)) {
          setEmployees({ ...employees, data: [] });
        }
        setEmployees(prev => ({
          ...prev,
          data: prev.data.map(emp =>
            emp.id === selectedEmployee.id ? updatedEmployee.result : emp
          ),
        }));
        message.success("Cập nhật nhân viên thành công!");
        setIsEditEmployeeModalVisible(false);
        setSelectedEmployee(null);
      }
    } catch (error) {
      message.error("Không thể cập nhật nhân viên. Vui lòng thử lại!");
      console.log(error.message);
    }
  };

  const handleDeleteEmployee = (employee) => {
    setSelectedEmployee(employee);
    setIsDeleteEmployeeModalVisible(true);
  };

  const handleDeleteEmployeeModalClose = () => {
    setIsDeleteEmployeeModalVisible(false);
    setSelectedEmployee(null);
  };

  const handleDeleteEmployeeConfirm = async () => {
    try {
      const response = await deleteEmployee(id, selectedEmployee.id, token);
      if (response.code === 200) {
        if (!Array.isArray(employees.data)) {
          setEmployees({ ...employees, data: [] });
          return;
        }

        const updatedData = employees.data.filter(emp => emp.id !== selectedEmployee.id);
        setEmployees({
          ...employees,
          data: updatedData,
          totalItems: updatedData.length
        });
  
        message.success("Xóa nhân viên thành công!");
        setIsDeleteEmployeeModalVisible(false);
        setSelectedEmployee(null);
      } else {
        message.error(response.message || "Xóa nhân viên thất bại!");
      }
    } catch (error) {
      message.error("Không thể xóa nhân viên. Vui lòng thử lại!");
      console.log(error.message);
    }
  };

  return (
    <div className="one-company-detail-container">
      <Row gutter={[24, 24]} className="one-company-header">
        <Col xs={24} md={6} className="one-company-logo-col">
          <div className="logo-wrapper">
            <img
              src={company.logoUrl}
              alt={company.companyName}
              className="one-company-logo"
            />
          </div>
        </Col>
        <Col xs={24} md={12}>
          <Title level={2} className="one-company-name">{company.companyName}</Title>
          <Text className="one-company-description">{company.description}</Text>
          <Space direction="vertical" size="middle" className="one-company-meta">
            <div>
              <GlobalOutlined className="meta-icon" />
              <a href={company.website} target="_blank" rel="noopener noreferrer">
                {company.website}
              </a>
            </div>
            <div>
              <EnvironmentOutlined className="meta-icon" />
              <Text>{company.address}</Text>
            </div>
            <div>
              <TeamOutlined className="meta-icon" />
              <Text>{company.numberOfEmployees} nhân viên</Text>
            </div>
          </Space>
        </Col>
        <Col xs={24} md={6} style={{ textAlign: "right", alignSelf: "center" }}>
          {((hasScope(userScopes, "ROLE_EMPLOYER") && isEmployee) || (hasScope(userScopes, "ROLE_ADMIN"))) && (
            <Button
              type="primary"
              icon={<PlusOutlined />}
              onClick={() => setIsAddEmployeeModalVisible(true)}
            >
              Thêm Nhân Viên
            </Button>
          )}
        </Col>
      </Row>

      <div className="one-job-posts-header">
        {((hasScope(userScopes, "ROLE_EMPLOYER") && isEmployee) || (hasScope(userScopes, "ROLE_ADMIN"))) && (
          <Space style={{ marginBottom: 16 }}>
            <Button
              type="primary"
              icon={<PlusOutlined />}
              onClick={handleAddJob}
              className="one-add-job-button"
            >
              Thêm mới việc làm
            </Button>
            <Button
              icon={<EditOutlined />}
              onClick={handleEdit}
              className="one-edit-button"
            >
              Chỉnh sửa
            </Button>
            <Button
              danger
              icon={<DeleteOutlined />}
              onClick={handleDelete}
              className="one-delete-button"
            >
              Xóa
            </Button>
          </Space>
        )}
      </div>

      <Tabs defaultActiveKey="1">
        <TabPane tab="Công việc đang tuyển" key="1">
          {company.jobPosts?.content?.length > 0 ? (
            <>
              <List
                className="one-job-list"
                dataSource={company.jobPosts.content}
                renderItem={(job) => (
                  <List.Item>
                    <List.Item.Meta
                      title={<Text strong>{job.title}</Text>}
                      description={<Text>{job.description}</Text>}
                    />
                    <div style={{ display: "flex", gap: 8 }}>
                      <Button onClick={() => handleClick(job.id)} type="primary" size="small">
                        Xem chi tiết
                      </Button>
                      {((hasScope(userScopes, "ROLE_EMPLOYER") && isEmployee) || hasScope(userScopes, "ROLE_ADMIN")) && (
                        <>
                          <Button
                            type="default"
                            icon={<FileTextOutlined />}
                            onClick={() => handleViewApplications(job.id)}
                            size="small"
                          >
                            Xem ứng tuyển
                          </Button>
                          <Button
                            danger
                            icon={<DeleteOutlined />}
                            onClick={() => showDeleteJobModal(job.id, job.title)}
                            size="small"
                          >
                            Xóa
                          </Button>
                        </>
                      )}
                    </div>
                  </List.Item>
                )}
              />
              <CustomPagination
                totalItems={company.jobPosts.totalElements}
                pageSize={size}
              />
            </>
          ) : (
            <Text className="no-data">Không có công việc nào đang tuyển.</Text>
          )}
        </TabPane>

        {(isEmployee && (hasScope(userScopes, "ROLE_EMPLOYER") || hasScope(userScopes, "ROLE_ADMIN"))) && (
          <TabPane tab="Danh sách nhân viên" key="2">
            {employees.data.length > 0 ? (
              <>
                <List
                  className="one-employee-list"
                  dataSource={employees.data}
                  renderItem={(employee) => (
                    <List.Item
                      actions={[
                        <Button
                          icon={<EditOutlined />}
                          onClick={() => handleEditEmployee(employee)}
                          size="small"
                        >
                          Sửa
                        </Button>,
                        <Button
                          danger
                          icon={<DeleteOutlined />}
                          onClick={() => handleDeleteEmployee(employee)}
                          size="small"
                        >
                          Xóa
                        </Button>,
                      ]}
                    >
                      <List.Item.Meta
                        title={<Text strong>{employee.fullName}</Text>}
                        description={
                          <>
                            <Text>Email: {employee.email}</Text><br />
                          </>
                        }
                      />
                    </List.Item>
                  )}
                />
                <CustomPagination
                  totalItems={employees.totalItems}
                  pageSize={size}
                />
              </>
            ) : (
              <Text className="no-data">Không có nhân viên nào.</Text>
            )}
          </TabPane>
        )}
      </Tabs>

      <Modal
        title={<strong><h2>Thêm tin tuyển dụng</h2></strong>}
        open={isModalVisible}
        onCancel={handleModalClose}
        footer={null}
        width={800}
      >
        <CreateJob companyId={id} onClose={handleModalClose} onJobCreated={handleJobCreated} />
      </Modal>

      <Modal
        title={<strong><h2>Chỉnh sửa công ty</h2></strong>}
        open={isEditModalVisible}
        onCancel={handleEditModalClose}
        footer={null}
        width={800}
      >
        <EditCompanyForm company={company} onSubmit={handleEditSubmit} onCancel={handleEditModalClose} />
      </Modal>

      <Modal
        title={`Xác định xóa công ty ${company.companyName} không?`}
        open={isDeleteModalVisible}
        onCancel={handleDeleteModalClose}
        footer={[
          <Button key="cancel" onClick={handleDeleteModalClose}>
            Hủy
          </Button>,
          <Button key="delete" type="primary" danger onClick={handleDeleteConfirm}>
            Xóa
          </Button>,
        ]}
      >
        <Text>Bạn có chắc chắn muốn xóa công ty này? Hành động này không thể hoàn tác.</Text>
      </Modal>

      <Modal
        title={`Xác nhận xóa công việc ${selectedJobTitle}?`}
        open={isDeleteJobModalVisible}
        onCancel={handleDeleteJobModalClose}
        footer={[
          <Button key="cancel" onClick={handleDeleteJobModalClose}>
            Hủy
          </Button>,
          <Button key="delete" type="primary" danger onClick={handleDeleteJobConfirm}>
            Xóa
          </Button>,
        ]}
      >
        <Text>Bạn có chắc chắn muốn xóa công việc này? Hành động này không thể hoàn tác.</Text>
      </Modal>

      <Modal
        title={<strong><h2>Chỉnh sửa nhân viên</h2></strong>}
        open={isEditEmployeeModalVisible}
        onCancel={handleEditEmployeeModalClose}
        footer={null}
        width={600}
      >
        <EditEmployeeModal
          employee={selectedEmployee}
          onSubmit={handleEditEmployeeSubmit}
          onCancel={handleEditEmployeeModalClose}
        />
      </Modal>

      <Modal
        title={`Xác nhận xóa nhân viên ${selectedEmployee?.name}?`}
        open={isDeleteEmployeeModalVisible}
        onCancel={handleDeleteEmployeeModalClose}
        footer={[
          <Button key="cancel" onClick={handleDeleteEmployeeModalClose}>
            Hủy
          </Button>,
          <Button key="delete" type="primary" danger onClick={handleDeleteEmployeeConfirm}>
            Xóa
          </Button>,
        ]}
      >
        <Text>Bạn có chắc chắn muốn xóa nhân viên này? Hành động này không thể hoàn tác.</Text>
      </Modal>

      <AddEmployeeModal
        companyId={id}
        visible={isAddEmployeeModalVisible}
        onClose={() => setIsAddEmployeeModalVisible(false)}
      />
    </div>
  );
};

export default CompanyDetail;