import { FacebookOutlined, LinkedinOutlined, GithubOutlined } from "@ant-design/icons"
import "./LayoutDefault.css"
import { Link } from "react-router-dom"

function Footer() {
  return (
    <div className="footer-container">
      <div className="footer-row">
        <div className="footer-col">
          <h5 className="footer-title">Về chúng tôi</h5>
          <p className="footer-text">
            Nền tảng kết nối nhà tuyển dụng và ứng viên IT hàng đầu tại Việt Nam. Chúng tôi cung cấp cơ hội việc làm chất lượng và kết nối giữa ứng viên và doanh nghiệp.
          </p>
        </div>
        <div className="footer-col">
          <h5 className="footer-title">Thông tin</h5>
          <div className="footer-links">
            <Link to="/" className="footer-text">Trang chủ</Link>
            <Link to="/jobs" className="footer-text">Việc làm</Link>
            <Link to="/companies/all-company" className="footer-text">Công ty</Link>
          </div>
        </div>
        <div className="footer-col">
          <h5 className="footer-title">Liên hệ</h5>
          <p className="footer-text">Email: chuthanglsz@gmail.com</p>
          <p className="footer-text">Hotline: 0976-483-519</p>
        </div>
        <div className="footer-col">
          <h5 className="footer-title">Theo dõi</h5>
          <div className="footer-social">
            <Link to="https://www.facebook.com/">
              <FacebookOutlined className="footer-icons" />
            </Link>
            <Link to="https://www.linkedin.com/in/chu-ngoc-thang-0194a1328/">
              <LinkedinOutlined className="footer-icons" />
            </Link>
            <Link to="https://github.com/T-Smilling">
              <GithubOutlined className="footer-icons" />
            </Link>
          </div>
        </div>
      </div>
      <p className="footer-bottom">© 2025 IT Job Portal. All rights reserved.</p>
    </div>
  )
}

export default Footer