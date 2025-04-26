import { useState, useEffect } from "react"
import { Card, Button, Avatar, Switch, message, Row, Col, Modal } from "antd"
import "./AllResume.css"
import { NavLink } from "react-router-dom"
import { deleteResume, getAllCVByUser } from "../../services/resumeService"
import Cookies from "js-cookie"
import { getInfoUser } from "../../services/userService"
import { formatDate } from "../../utils/formatdate"
import { extractFilename } from "../../utils/extractFilename"
import CustomPagination from "../../components/Pagination"
import { FileOutlined, ExclamationCircleOutlined } from "@ant-design/icons"

const { confirm } = Modal

const AllResume = () => {
  const [resumes, setResumes] = useState([])
  const [totalItems, setTotalItems] = useState(0)
  const [currentPage, setCurrentPage] = useState(1)
  const [pageSize] = useState(3)
  const token = Cookies.get("token")
  const [user, setUser] = useState({})

  useEffect(() => {
    const fetchData = async () => {
      try {
        const responseCV = await getAllCVByUser(token, currentPage - 1, pageSize)
        const responseUser = await getInfoUser(token)
        setResumes(responseCV.result.content)
        setTotalItems(responseCV.result.totalElements || responseCV.result.content.length)
        setUser(responseUser.result)
      } catch (error) {
        message.error("Không thể tải dữ liệu")
      }
    }
    fetchData()
  }, [currentPage, pageSize, token])

  const handleDeleteResume = async (resumeId) => {
    try {
      const response = await deleteResume(resumeId, token)
      console.log(response);
      if (response.code === 200) {
        message.success(response.result)
        const updatedResumes = resumes.filter((resume) => resume.id !== resumeId)
        setResumes(updatedResumes)
        setTotalItems(updatedResumes.length)
        window.location.reload()
      } else {
        message.error(response.message)
      }
    } catch (error) {
      message.error("Không thể xóa CV vì đã được sử dụng trong đơn ứng tuyển")
    }
  }

  const showDeleteConfirm = (resumeId, resumeName) => {
    confirm({
      title: "Xác nhận xóa CV",
      icon: <ExclamationCircleOutlined />,
      content: `Bạn có chắc chắn muốn xóa CV "${resumeName}" khỏi tài khoản?`,
      okText: "Xóa",
      okType: "danger",
      cancelText: "Hủy",
      onOk() {
        handleDeleteResume(resumeId)
      },
    })
  }

  const handleAllowSearch = (checked) => {
    message.success(`Cho phép NTD tìm kiếm hồ sơ: ${checked ? "Bật" : "Tắt"}`)
  }

  const handleToggleJobSearch = (checked) => {
    message.success(`Trạng thái tìm việc: ${checked ? "Bật" : "Tắt"}`)
  }

  const handlePageChange = (page) => {
    setCurrentPage(page)
  }

  if (!user) {
    return <div>Đang tải dữ liệu...</div>
  }

  return (
    <div className="resume-manager">
      <Row gutter={16}>
        <Col xs={24} md={16} className="resume-list">
          <Card
            title="CV đã tải lên web"
            extra={
              <Button>
                <NavLink to="/resume/upload">↑ Tải CV lên</NavLink>
              </Button>
            }
          >
            {resumes.length > 0 ? (
              <>
                <div className="uploaded-resumes">
                  {resumes.map((resume) => (
                    <div key={resume.id} className="resume-item">
                      <div className="resume-icon">
                        <Avatar shape="square" size={80} icon={<FileOutlined />} />
                      </div>
                      <div className="resume-info">
                        <div className="resume-name">{extractFilename(resume.resumeUrl)}</div>
                        <div className="resume-date">Cập nhật lần cuối: {formatDate(resume.updatedAt)}</div>
                      </div>
                      <Button
                        type="primary"
                        onClick={() => showDeleteConfirm(resume.id, extractFilename(resume.resumeUrl))}
                      >
                        Xóa CV khỏi tài khoản
                      </Button>
                    </div>
                  ))}
                </div>
                <CustomPagination totalItems={totalItems} pageSize={pageSize} onPageChange={handlePageChange} />
              </>
            ) : (
              <div className="empty-resume">Bạn chưa tải CV nào lên</div>
            )}
          </Card>
        </Col>

        <Col xs={24} md={8} className="user-info">
          <Card>
            <div className="user-header">
              <Avatar size={64} src={user.avatarUrl} />
              <div className="user-details">
                <div className="user-name">{user.fullName}</div>
                <div className="user-verified">
                  {user.emailVerified ? (
                    <span className="verified-icon">VERIFIED</span>
                  ) : (
                    <span className="unverified-icon">UNVERIFIED</span>
                  )}
                  Tài khoản {user.emailVerified ? "đã xác thực" : "chưa xác thực"}
                </div>
                <Button type="link" size="small">
                  <NavLink to="/employee/register">• Nâng cấp tài khoản</NavLink>
                </Button>
              </div>
            </div>

            <div className="user-status">
              <div className="status-label">Bạn đang tìm việc</div>
            </div>
            <div className="status-note">
              Hồ sơ của bạn sẽ được hiển thị với các Nhà tuyển dụng (NTD) đang tìm kiếm ứng viên phù hợp, giúp bạn gia tăng cơ hội tiếp cận công việc mơ ước. <br/>
            </div>

            <div className="allow-search">
              <div className="allow-search-label">Cho phép NTD tìm kiếm hồ sơ</div>
            </div>
            <div className="allow-search-note">
              Khi có cơ hội việc làm phù hợp. Bạn sẽ nhận được liên hệ từ NTD qua: <br />
              <ul>
                <li>Email đã đăng ký: Kiểm tra hộp thư thường xuyên, bao gồm thư mục Spam hoặc Quảng cáo.</li>
                <li>Mạng xã hội và số điện thoại: Đảm bảo thông tin liên hệ trong hồ sơ của bạn là chính xác để NTD có thể dễ dàng trao đổi.</li>
              </ul>
              <strong>Mẹo:</strong> Cập nhật đầy đủ kỹ năng, kinh nghiệm và mục tiêu nghề nghiệp trong hồ sơ để tăng cơ hội được chú ý.
            </div>
          </Card>
        </Col>
      </Row>
    </div>
  )
}

export default AllResume

