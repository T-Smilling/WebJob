import { Card, Row, Col, Typography } from "antd";
import { UserOutlined, TeamOutlined, FileTextOutlined } from "@ant-design/icons";
import { PieChart, Pie, Cell, BarChart, Bar, XAxis, YAxis, Tooltip, Legend, ResponsiveContainer } from "recharts";
import "./Dashboard.css";
import { useEffect, useState } from "react";
import { getAllUser } from "../../services/userService";
import Cookies from "js-cookie";
import { getAllCompany } from "../../services/companyService";
import { getAllJob } from "../../services/jobService";

const { Title, Text } = Typography;

const COLORS = ["#0088FE", "#00C49F", "#FFBB28"];

function Dashboard() {
  const token = Cookies.get("token");
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true); // Thêm state loading để xử lý khi dữ liệu chưa sẵn sàng

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        const responseUser = await getAllUser(0, 2, token);
        const responseCompany = await getAllCompany(0, 2);
        const responseJob = await getAllJob(0, 2);
        console.log(responseUser)
        console.log(responseCompany)
        console.log(responseJob)
        setData([
          { name: "Người dùng", value: responseUser.result.totalElements },
          { name: "Công ty", value: responseCompany.result.totalElements },
          { name: "Việc làm", value: responseJob.result.totalElements },
        ]);
      } catch (error) {
        console.error("Failed to fetch data:", error);
        setData([
          { name: "Người dùng", value: 0 },
          { name: "Công ty", value: 0 },
          { name: "Việc làm", value: 0 },
        ]);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [token]);

  // Lấy giá trị từ data để hiển thị trong các Card
  const totalUsers = data.find(item => item.name === "Người dùng")?.value || 0;
  const totalCompanies = data.find(item => item.name === "Công ty")?.value || 0;
  const totalJobs = data.find(item => item.name === "Việc làm")?.value || 0;

  return (
    <div className="dashboard-container">
      <Title level={2}>Dashboard</Title>

      {/* Cards hiển thị số liệu */}
      <Row gutter={[16, 16]} style={{ marginBottom: 24 }}>
        <Col xs={24} sm={12} md={8}>
          <Card
            className="dashboard-card"
            title={
              <div className="card-title">
                <UserOutlined style={{ color: "#0088FE", marginRight: 8 }} />
                Tổng số người dùng
              </div>
            }
            bordered={false}
            loading={loading} // Hiển thị loading khi dữ liệu chưa sẵn sàng
          >
            <Text strong style={{ fontSize: 24 }}>
              {totalUsers.toLocaleString()} {/* Hiển thị dữ liệu động */}
            </Text>
          </Card>
        </Col>
        <Col xs={24} sm={12} md={8}>
          <Card
            className="dashboard-card"
            title={
              <div className="card-title">
                <TeamOutlined style={{ color: "#00C49F", marginRight: 8 }} />
                Tổng số công ty
              </div>
            }
            bordered={false}
            loading={loading}
          >
            <Text strong style={{ fontSize: 24 }}>
              {totalCompanies.toLocaleString()} {/* Hiển thị dữ liệu động */}
            </Text>
          </Card>
        </Col>
        <Col xs={24} sm={12} md={8}>
          <Card
            className="dashboard-card"
            title={
              <div className="card-title">
                <FileTextOutlined style={{ color: "#FFBB28", marginRight: 8 }} />
                Tổng số việc làm
              </div>
            }
            bordered={false}
            loading={loading}
          >
            <Text strong style={{ fontSize: 24 }}>
              {totalJobs.toLocaleString()} {/* Hiển thị dữ liệu động */}
            </Text>
          </Card>
        </Col>
      </Row>

      {/* Biểu đồ */}
      <Row gutter={[16, 16]}>
        {/* Biểu đồ tròn */}
        <Col xs={24} md={12}>
          <Card title="Tỷ lệ phân bố" className="dashboard-card" bordered={false}>
            <ResponsiveContainer width="100%" height={300}>
              <PieChart>
                <Pie
                  data={data}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  outerRadius={80}
                  fill="#8884d8"
                  dataKey="value"
                  label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                >
                  {data.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip />
                <Legend />
              </PieChart>
            </ResponsiveContainer>
          </Card>
        </Col>

        {/* Biểu đồ cột */}
        <Col xs={24} md={12}>
          <Card title="So sánh số liệu" className="dashboard-card" bordered={false}>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={data}>
                <XAxis dataKey="name" />
                <YAxis />
                <Tooltip />
                <Legend />
                <Bar dataKey="value" fill="#8884d8">
                  {data.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </Card>
        </Col>
      </Row>
    </div>
  );
}

export default Dashboard;