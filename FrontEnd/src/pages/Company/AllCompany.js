import { useState, useEffect } from 'react';
import { Card, Col, Row, Typography, Avatar, List, Space, Button } from 'antd';
import { EnvironmentOutlined, TeamOutlined, GlobalOutlined, PlusOutlined } from '@ant-design/icons';
import './AllCompany.css';
import { NavLink, useNavigate, useSearchParams } from 'react-router-dom';
import { getAllCompany } from '../../services/companyService';
import { getUserScopes, hasScope } from "../../utils/authUtils";
import CustomPagination from '../../components/Pagination';

const { Title, Text } = Typography;

const AllCompany = () => {
  const [data, setData] = useState([]);
  const navigate = useNavigate();
  const [userScopes, setUserScopes] = useState([]);
  const [searchParams] = useSearchParams();
  const [totalItems, setTotalItems] = useState(0);

  const page = parseInt(searchParams.get("page") || "1", 10);
  const size = 9;

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await getAllCompany(page - 1, size);
        setData(response.result.content);
        setTotalItems(response.result.totalElements);
      } catch (error) {
        console.log(error.message);
      }
    };

    fetchData();
    const scopes = getUserScopes();
    setUserScopes(scopes);
  }, [searchParams, page]);

  const handleAddCompany = () => {
    navigate("/companies/create");
  };

  return (
    <div className="all-company-list-container">
      <div className="all-company-header">
        <Title level={2} className="all-company-list-title">
          Danh Sách Công Ty
        </Title>
        {hasScope(userScopes, "ROLE_ADMIN") && (
          <Button
            type="primary"
            icon={<PlusOutlined />}
            onClick={handleAddCompany}
            className="add-company-button"
          >
            Thêm Công Ty
          </Button>
        )}
      </div>
      <Row gutter={[24, 24]}>
        {data.map((company) => (
          <Col xs={24} sm={12} md={8} lg={8} key={company.id}>
            <Card
              className="all-company-card"
              hoverable
              cover={
                <div className="all-company-logo-container">
                  <Avatar
                    size={120}
                    src={company.logoUrl}
                    className="all-company-logo"
                  />
                </div>
              }
            >
              <Card.Meta
                title={
                  <NavLink to={`/companies/${company.id}`}>
                    <Button type="link" className="all-company-name-button">
                      {company.companyName}
                    </Button>
                  </NavLink>
                }
                description={
                  <div className="all-company-info">
                    <Space direction="vertical" size="small" style={{ width: '100%' }}>
                      <div className="info-item">
                        <GlobalOutlined className="info-icon" />
                        <a href={company.website} target="_blank" rel="noopener noreferrer">
                          {company.website}
                        </a>
                      </div>
                      <div className="info-item">
                        <EnvironmentOutlined className="info-icon" />
                        <Text>{company.address}</Text>
                      </div>
                      <div className="info-item">
                        <TeamOutlined className="info-icon" />
                        <Text>{company.numberOfEmployees} nhân viên</Text>
                      </div>
                    </Space>
                    <div className="all-job-posts-section">
                      <Text strong>Công việc đang tuyển:</Text>
                      <List
                        dataSource={company.jobPosts?.content?.slice(0, 3) || []}
                        renderItem={(job) => (
                          <List.Item className="job-post-item">
                            <Text>- {job.title}</Text>
                          </List.Item>
                        )}
                        locale={{ emptyText: <Text className="no-data">No data</Text> }}
                      />
                    </div>
                  </div>
                }
              />
            </Card>
          </Col>
        ))}
      </Row>
      <CustomPagination totalItems={totalItems} />
    </div>
  );
};

export default AllCompany;