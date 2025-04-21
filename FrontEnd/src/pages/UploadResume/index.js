import React, { useState } from 'react';
import { Upload, Button, notification, Row, Col } from 'antd';
import { UploadOutlined, DownloadOutlined, BarChartOutlined, MailOutlined, MessageOutlined } from '@ant-design/icons';
import './UploadResume.css';
import { uploadResume } from '../../services/resumeService';
import Cookies from 'js-cookie';

function UploadResume() {
  const [fileList, setFileList] = useState([]);
  const [message, contextHolder] = notification.useNotification();
  const token = Cookies.get('token')

  const handleFileChange = (info) => {
    const { _ , fileList: newFileList } = info;
    setFileList(newFileList);
  };

  const handleUpload = async () => {
    if (fileList.length === 0) {
      message.error('Vui lòng chọn file trước!');
      return;
    }

    const formData = new FormData();
    formData.append('file', fileList[0].originFileObj);

    try {
      const response = await uploadResume(formData,token)
      if (response.code === 200){
        message.success({
          message: response.message,
          description: "Tải CV thành công!",
          duration: 1.5
        })
      } else{
        message.error({
          message: response.message,
          description: "Tải CV lên thất bại"
        })
      }
    } catch (error) {
      message.error('Đã xảy ra lỗi trong quá trình tải lên.');
      console.error(error);
    }
  };

  const handleReplaceFile = () => {
    setFileList([]);
  };

  return (
    <>        
    {contextHolder}
    <div className="upload-resume-container">
      <div className="header">
        <h2>Upload CV để các công việc tìm đến bạn</h2>
        <p>Giảm đến 50% thời gian tìm kiếm việc làm với công việc phù hợp</p>
      </div>
      <div className="content">
        <p className="description">
          Bạn đã có sẵn CV của mình, chỉ cần tải CV lên, hệ thống sẽ tự động đề xuất CV của bạn đến những nhà tuyển dụng uy tín. Tiết kiệm thời gian, tìm việc thông minh, nâng cao cơ hội làm việc với hàng trăm công việc phù hợp.
        </p>
        <div className="upload-section">
          <Upload
            beforeUpload={() => false}
            onChange={handleFileChange}
            accept=".pdf"
            maxCount={1}
            fileList={fileList}
            showUploadList={false}
          >
            <div className="upload-content">
              {fileList.length === 0 ? (
                <>
                  <UploadOutlined style={{ fontSize: 24, color: '#888', marginBottom: 8 }} />
                  <p>Tải lên CV từ máy tính</p>
                  <p style={{ fontSize: 12, color: '#888' }}>
                    Hỗ trợ định dạng .pdf có kích thước dưới 5MB
                  </p>
                </>
              ) : (
                <>
                  <UploadOutlined style={{ fontSize: 24, color: '#00a65c', marginBottom: 8 }} />
                  <p style={{ color: '#00a65c', marginBottom: 4 }}>{fileList[0].name}</p>
                  <Button type="link" onClick={handleReplaceFile} style={{ padding: 0 }}>
                    Chọn tệp khác
                  </Button>
                </>
              )}
            </div>
          </Upload>
        </div>
      <div className="button-container">
        <Button
          type="primary"
          onClick={handleUpload}
          className="upload-button"
          disabled={fileList.length === 0}
        >
          Tải CV lên
        </Button>
      </div>
        <div className="card-container">
          <Row gutter={[32, 64]}>
            <Col xs={24} sm={12} md={12}>
              <div className="card">
                <div className="card-icon-wrapper">
                  <DownloadOutlined className="card-icon" style={{ color: '#52c41a' }} />
                </div>
                <h3>Nhận việc dễ hơn</h3>
                <p>
                  Nhận việc dễ hơn với hệ thống tự động đề xuất CV của bạn đến nhà tuyển dụng phù hợp. Nhanh chóng, thông minh và tăng cơ hội nhận việc.
                </p>
              </div>
            </Col>
            <Col xs={24} sm={12} md={12}>
              <div className="card">
                <div className="card-icon-wrapper">
                  <BarChartOutlined className="card-icon" style={{ color: '#fa8c16' }} />
                </div>
                <h3>Theo dõi hồ sơ, tối ưu CV</h3>
                <p>
                  Theo dõi số lượt xem CV. Bắt kịp xu hướng CV và tối ưu hóa CV để nâng cao khả năng tìm việc.
                </p>
              </div>
            </Col>
            <Col xs={24} sm={12} md={12}>
              <div className="card">
                <div className="card-icon-wrapper">
                  <MailOutlined className="card-icon" style={{ color: '#1890ff' }} />
                </div>
                <h3>Chia sẻ CV bất cứ nơi đâu</h3>
                <p>Upload mẫu CV của bạn thông qua link để dễ dàng chia sẻ với nhà tuyển dụng.</p>
              </div>
            </Col>
            <Col xs={24} sm={12} md={12}>
              <div className="card">
                <div className="card-icon-wrapper">
                  <MessageOutlined className="card-icon" style={{ color: '#f5222d' }} />
                </div>
                <h3>Kết nối nhanh với nhà tuyển dụng</h3>
                <p>Đăng ký kết nối với các nhà tuyển dụng qua email và tăng cơ hội tìm việc.</p>
              </div>
            </Col>
          </Row>
        </div>
      </div>
    </div>
    </>
  );
}

export default UploadResume;