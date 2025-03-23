import { Row, Col, Button, Card, Statistic, Carousel } from "antd"
import {
  UserOutlined,
  BulbOutlined,
  RocketOutlined,
  LaptopOutlined,
  TeamOutlined,
  FileSearchOutlined,
  CheckCircleOutlined,
} from "@ant-design/icons"
import { Link } from "react-router-dom"
import "./LandingPage.css"
import HomeJob from "./HomeJob"

function LandingPage() {
  const testimonials = [
    {
      id: 1,
      name: "Nguyễn Văn A",
      position: "Senior Developer",
      company: "Tech Solutions",
      content:
        "IT Job Portal đã giúp tôi tìm được công việc mơ ước chỉ trong vòng 2 tuần. Giao diện dễ sử dụng và nhiều cơ hội việc làm chất lượng.",
      avatarColor: "#0078ff",
    },
    {
      id: 2,
      name: "Trần Thị B",
      position: "UX/UI Designer",
      company: "Creative Studio",
      content:
        "Tôi đã tìm được nhiều cơ hội việc làm hấp dẫn thông qua IT Job Portal. Đây thực sự là nền tảng tuyệt vời cho các chuyên gia IT.",
      avatarColor: "#00a854",
    },
    {
      id: 3,
      name: "Lê Văn C",
      position: "Product Manager",
      company: "Fintech Inc",
      content:
        "Là nhà tuyển dụng, tôi đánh giá cao chất lượng ứng viên từ IT Job Portal. Chúng tôi đã tuyển được nhiều nhân tài xuất sắc.",
      avatarColor: "#722ed1",
    },
  ]

  return (
    <div className="landing-container">
      {/* Hero Section */}
      <section className="hero-section-main">
        <div className="hero-overlay"></div>
        <div className="hero-content">
          <h1 className="hero-title">Khám Phá Cơ Hội Nghề Nghiệp IT Tại Việt Nam</h1>
          <p className="hero-subtitle">
            Kết nối với hàng ngàn nhà tuyển dụng hàng đầu và tìm kiếm công việc IT mơ ước của bạn
          </p>
          <div className="hero-buttons">
            <Link to="/jobs/search">
              <Button type="primary" size="large" className="hero-button">
                Tìm Việc Ngay
              </Button>
            </Link>
            <Link to="/register">
              <Button size="large" className="hero-button hero-button-outline">
                Đăng Ký Miễn Phí
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="stats-section">
        <Row gutter={[32, 32]} justify="center">
          <Col xs={12} sm={12} md={6}>
            <Card className="stat-card">
              <Statistic title="Việc Làm" value={5000} prefix={<FileSearchOutlined />} suffix="+" />
            </Card>
          </Col>
          <Col xs={12} sm={12} md={6}>
            <Card className="stat-card">
              <Statistic title="Công Ty" value={1200} prefix={<TeamOutlined />} suffix="+" />
            </Card>
          </Col>
          <Col xs={12} sm={12} md={6}>
            <Card className="stat-card">
              <Statistic title="Ứng Viên" value={25000} prefix={<UserOutlined />} suffix="+" />
            </Card>
          </Col>
          <Col xs={12} sm={12} md={6}>
            <Card className="stat-card">
              <Statistic title="Tuyển Dụng Thành Công" value={3500} prefix={<CheckCircleOutlined />} suffix="+" />
            </Card>
          </Col>
        </Row>
      </section>
      <HomeJob/>
      {/* Features Section - Updated with two separate rows for better spacing */}
      <section className="features-section">
        <h2 className="section-title">Tại Sao Chọn IT Job Portal?</h2>
        <div className="section-divider"></div>

        {/* First row of features */}
        <Row gutter={[32, 32]} className="features-row feature-row-gap">
          <Col xs={24} sm={12} lg={8}>
            <div className="feature-card">
              <div className="feature-icon">
                <LaptopOutlined />
              </div>
              <h3>Việc Làm Chất Lượng</h3>
              <p>Hàng ngàn cơ hội việc làm IT chất lượng cao từ các công ty hàng đầu tại Việt Nam.</p>
            </div>
          </Col>
          <Col xs={24} sm={12} lg={8}>
            <div className="feature-card">
              <div className="feature-icon">
                <BulbOutlined />
              </div>
              <h3>Công Nghệ Hiện Đại</h3>
              <p>Cập nhật các công nghệ mới nhất và xu hướng nghề nghiệp trong lĩnh vực IT.</p>
            </div>
          </Col>
          <Col xs={24} sm={12} lg={8}>
            <div className="feature-card">
              <div className="feature-icon">
                <RocketOutlined />
              </div>
              <h3>Phát Triển Sự Nghiệp</h3>
              <p>Cơ hội phát triển sự nghiệp với mức lương cạnh tranh và môi trường làm việc chuyên nghiệp.</p>
            </div>
          </Col>
        </Row>        
      </section>

      {/* Testimonials Section */}
      <section className="testimonials-section">
        <h2 className="section-title">Nhận Xét Từ Người Dùng</h2>
        <div className="section-divider"></div>
        <Carousel autoplay className="testimonial-carousel">
          {testimonials.map((testimonial) => (
            <div key={testimonial.id}>
              <div className="testimonial-card">
                <div className="testimonial-content">
                  <p>"{testimonial.content}"</p>
                </div>
                <div className="testimonial-author">
                  <div
                    className="testimonial-avatar"
                    style={{
                      backgroundColor: testimonial.avatarColor,
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      color: "#fff",
                      fontSize: "24px",
                    }}
                  >
                    {testimonial.name.charAt(0)}
                  </div>
                  <div className="testimonial-info">
                    <h4>{testimonial.name}</h4>
                    <p>
                      {testimonial.position} tại {testimonial.company}
                    </p>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </Carousel>
      </section>
    </div>
  )
}

export default LandingPage

