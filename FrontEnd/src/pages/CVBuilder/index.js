import React, { useState } from 'react';
import { Form, Input, Button, Upload, message, Divider, Row, Col, Card, Typography, Select, DatePicker, Space, Modal } from 'antd';
import { UploadOutlined, PlusOutlined, MinusCircleOutlined, FilePdfOutlined, SaveOutlined, EyeOutlined } from '@ant-design/icons';
import { jsPDF } from 'jspdf';
import html2canvas from 'html2canvas';
import moment from 'moment';
import 'moment/locale/vi';
import locale from 'antd/es/date-picker/locale/vi_VN';

const { Title, Text } = Typography;
const { TextArea } = Input;
const { Option } = Select;
const { RangePicker } = DatePicker;

const CVBuilder = () => {
  const [form] = Form.useForm();
  const [avatar, setAvatar] = useState(null);
  const [previewOpen, setPreviewOpen] = useState(false);
  const [loading, setLoading] = useState(false);

  // State để lưu trữ preview data
  const [previewData, setPreviewData] = useState(null);

  const getBase64 = (file) => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = () => resolve(reader.result);
      reader.onerror = error => reject(error);
    });
  };

  const handleAvatarChange = async (info) => {
    if (info.file.status === 'done') {
      const base64Image = await getBase64(info.file.originFileObj);
      setAvatar(base64Image);
      message.success('Tải ảnh đại diện thành công!');
    } else if (info.file.status === 'error') {
      message.error('Tải ảnh đại diện thất bại.');
    }
  };

  const handlePreview = async () => {
    try {
      const values = await form.validateFields();
      setPreviewData({
        ...values,
        avatar
      });
      setPreviewOpen(true);
    } catch (errorInfo) {
      message.error('Vui lòng điền đầy đủ thông tin bắt buộc!');
    }
  };

  const handleExportPDF = async () => {
    try {
      await form.validateFields();
      setLoading(true);
      
      const cvElement = document.getElementById('cv-preview');
      
      // Đợi một chút để đảm bảo CV đã được render đầy đủ
      setTimeout(async () => {
        try {
          const canvas = await html2canvas(cvElement, { 
            scale: 2,
            useCORS: true,
            allowTaint: true,
            logging: false
          });
          
          const imgData = canvas.toDataURL('image/png');
          const pdf = new jsPDF('p', 'mm', 'a4');
          const imgProps = pdf.getImageProperties(imgData);
          const pdfWidth = pdf.internal.pageSize.getWidth();
          const pdfHeight = (imgProps.height * pdfWidth) / imgProps.width;
          
          pdf.addImage(imgData, 'PNG', 0, 0, pdfWidth, pdfHeight);
          pdf.save('CV_' + form.getFieldValue('fullName').replace(/\s+/g, '_') + '.pdf');
          
          message.success('Xuất CV thành công!');
        } catch (error) {
          console.error('Export PDF error:', error);
          message.error('Có lỗi xảy ra khi xuất PDF. Vui lòng thử lại!');
        } finally {
          setLoading(false);
        }
      }, 500);
    } catch (errorInfo) {
      message.error('Vui lòng điền đầy đủ thông tin bắt buộc!');
    }
  };

  const handleClose = () => {
    setPreviewOpen(false);
  };

  // Component CV Preview
  const CVPreview = ({ data }) => {
    if (!data) return null;

    return (
      <div id="cv-preview" style={{ width: '210mm', backgroundColor: 'white', boxShadow: '0 0 10px rgba(0,0,0,0.1)', padding: '20mm', fontFamily: 'Arial, sans-serif' }}>
        {/* Header với thông tin cá nhân */}
        <div style={{ display: 'flex', marginBottom: '20px' }}>
          {data.avatar && (
            <div style={{ marginRight: '20px' }}>
              <img src={data.avatar} alt="Avatar" style={{ width: '120px', height: '120px', objectFit: 'cover', borderRadius: '5px' }} />
            </div>
          )}
          <div style={{ flex: 1 }}>
            <h1 style={{ fontSize: '24px', fontWeight: 'bold', color: '#2a3f54', marginBottom: '5px' }}>{data.fullName}</h1>
            <h2 style={{ fontSize: '18px', color: '#5a738e', marginBottom: '10px' }}>{data.position}</h2>
            <div style={{ display: 'flex', flexWrap: 'wrap' }}>
              <div style={{ marginRight: '20px', marginBottom: '5px' }}>
                <strong>Ngày sinh:</strong> {data.birthday && moment(data.birthday).format('DD/MM/YYYY')}
              </div>
              <div style={{ marginRight: '20px', marginBottom: '5px' }}>
                <strong>Giới tính:</strong> {data.gender}
              </div>
              <div style={{ marginRight: '20px', marginBottom: '5px' }}>
                <strong>Điện thoại:</strong> {data.phone}
              </div>
              <div style={{ marginRight: '20px', marginBottom: '5px' }}>
                <strong>Email:</strong> {data.email}
              </div>
              <div style={{ marginBottom: '5px' }}>
                <strong>Địa chỉ:</strong> {data.address}
              </div>
            </div>
          </div>
        </div>

        {/* Mục tiêu nghề nghiệp */}
        <div style={{ marginBottom: '20px' }}>
          <h3 style={{ fontSize: '16px', backgroundColor: '#2a3f54', color: 'white', padding: '5px 10px', marginBottom: '10px' }}>MỤC TIÊU NGHỀ NGHIỆP</h3>
          <div style={{ textAlign: 'justify' }}>{data.careerGoals}</div>
        </div>

        {/* Học vấn */}
        <div style={{ marginBottom: '20px' }}>
          <h3 style={{ fontSize: '16px', backgroundColor: '#2a3f54', color: 'white', padding: '5px 10px', marginBottom: '10px' }}>HỌC VẤN</h3>
          {data.education && data.education.map((edu, index) => (
            <div key={index} style={{ marginBottom: '10px' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                <strong>{edu.schoolName}</strong>
                <span>{edu.timeRange && edu.timeRange[0] && edu.timeRange[1] ? 
                  `${moment(edu.timeRange[0]).format('MM/YYYY')} - ${moment(edu.timeRange[1]).format('MM/YYYY')}` : 
                  ''}
                </span>
              </div>
              <div>{edu.major}</div>
              <div>{edu.description}</div>
            </div>
          ))}
        </div>

        {/* Kinh nghiệm làm việc */}
        <div style={{ marginBottom: '20px' }}>
          <h3 style={{ fontSize: '16px', backgroundColor: '#2a3f54', color: 'white', padding: '5px 10px', marginBottom: '10px' }}>KINH NGHIỆM LÀM VIỆC</h3>
          {data.experience && data.experience.map((exp, index) => (
            <div key={index} style={{ marginBottom: '10px' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                <strong>{exp.companyName}</strong>
                <span>{exp.timeRange && exp.timeRange[0] && exp.timeRange[1] ? 
                  `${moment(exp.timeRange[0]).format('MM/YYYY')} - ${exp.currentJob ? 'Hiện tại' : moment(exp.timeRange[1]).format('MM/YYYY')}` : 
                  ''}
                </span>
              </div>
              <div><i>{exp.position}</i></div>
              <div style={{ textAlign: 'justify' }}>{exp.description}</div>
            </div>
          ))}
        </div>

        {/* Kỹ năng */}
        <div style={{ marginBottom: '20px' }}>
          <h3 style={{ fontSize: '16px', backgroundColor: '#2a3f54', color: 'white', padding: '5px 10px', marginBottom: '10px' }}>KỸ NĂNG</h3>
          {data.skills && data.skills.map((skill, index) => (
            <div key={index} style={{ marginBottom: '5px' }}>
              <strong>{skill.skillName}:</strong> {skill.description}
            </div>
          ))}
        </div>

        {/* Chứng chỉ */}
        {data.certificates && data.certificates.length > 0 && (
          <div style={{ marginBottom: '20px' }}>
            <h3 style={{ fontSize: '16px', backgroundColor: '#2a3f54', color: 'white', padding: '5px 10px', marginBottom: '10px' }}>CHỨNG CHỈ</h3>
            {data.certificates.map((cert, index) => (
              <div key={index} style={{ marginBottom: '5px' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                  <strong>{cert.certificateName}</strong>
                  <span>{cert.timeReceived && moment(cert.timeReceived).format('MM/YYYY')}</span>
                </div>
                <div>{cert.issuer}</div>
              </div>
            ))}
          </div>
        )}
      </div>
    );
  };

  return (
    <div style={{ padding: '20px', backgroundColor: '#f0f2f5', minHeight: '100vh' }}>
      <Row gutter={[16, 16]} justify="center">
        <Col xs={24} lg={20} xl={18}>
          <Card
            title={
              <div style={{ display: 'flex', alignItems: 'center' }}>
                <FilePdfOutlined style={{ fontSize: '24px', marginRight: '10px', color: '#1890ff' }} />
                <span style={{ fontSize: '20px' }}>TẠO CV CHUYÊN NGHIỆP</span>
              </div>
            }
            style={{ borderRadius: '8px' }}
          >
            <Form
              form={form}
              layout="vertical"
              initialValues={{
                education: [{}],
                experience: [{}],
                skills: [{}],
                certificates: [{}]
              }}
            >
              {/* Thông tin cá nhân */}
              <Title level={4}>Thông tin cá nhân</Title>
              <Divider />
              
              <Row gutter={[16, 0]}>
                <Col xs={24} md={6}>
                  <Form.Item label="Ảnh đại diện">
                    <Upload
                      name="avatar"
                      listType="picture-card"
                      className="avatar-uploader"
                      showUploadList={false}
                      action="https://www.mocky.io/v2/5cc8019d300000980a055e76"
                      onChange={handleAvatarChange}
                    >
                      {avatar ? (
                        <img src={avatar} alt="avatar" style={{ width: '100%' }} />
                      ) : (
                        <div>
                          <UploadOutlined />
                          <div style={{ marginTop: 8 }}>Tải ảnh</div>
                        </div>
                      )}
                    </Upload>
                  </Form.Item>
                </Col>
                
                <Col xs={24} md={18}>
                  <Row gutter={[16, 0]}>
                    <Col xs={24} md={12}>
                      <Form.Item
                        label="Họ và tên"
                        name="fullName"
                        rules={[{ required: true, message: 'Vui lòng nhập họ và tên!' }]}
                      >
                        <Input placeholder="Nguyễn Văn A" />
                      </Form.Item>
                    </Col>
                    
                    <Col xs={24} md={12}>
                      <Form.Item
                        label="Vị trí ứng tuyển"
                        name="position"
                        rules={[{ required: true, message: 'Vui lòng nhập vị trí ứng tuyển!' }]}
                      >
                        <Input placeholder="Nhân viên kinh doanh" />
                      </Form.Item>
                    </Col>
                    
                    <Col xs={24} md={8}>
                      <Form.Item
                        label="Email"
                        name="email"
                        rules={[
                          { required: true, message: 'Vui lòng nhập email!' },
                          { type: 'email', message: 'Email không hợp lệ!' }
                        ]}
                      >
                        <Input placeholder="example@gmail.com" />
                      </Form.Item>
                    </Col>
                    
                    <Col xs={24} md={8}>
                      <Form.Item
                        label="Số điện thoại"
                        name="phone"
                        rules={[{ required: true, message: 'Vui lòng nhập số điện thoại!' }]}
                      >
                        <Input placeholder="0901234567" />
                      </Form.Item>
                    </Col>
                    
                    <Col xs={24} md={8}>
                      <Form.Item
                        label="Ngày sinh"
                        name="birthday"
                        rules={[{ required: true, message: 'Vui lòng chọn ngày sinh!' }]}
                      >
                        <DatePicker locale={locale} style={{ width: '100%' }} format="DD/MM/YYYY" />
                      </Form.Item>
                    </Col>
                    
                    <Col xs={24} md={8}>
                      <Form.Item
                        label="Giới tính"
                        name="gender"
                        rules={[{ required: true, message: 'Vui lòng chọn giới tính!' }]}
                      >
                        <Select placeholder="Chọn giới tính">
                          <Option value="Nam">Nam</Option>
                          <Option value="Nữ">Nữ</Option>
                          <Option value="Khác">Khác</Option>
                        </Select>
                      </Form.Item>
                    </Col>
                    
                    <Col xs={24} md={16}>
                      <Form.Item
                        label="Địa chỉ"
                        name="address"
                        rules={[{ required: true, message: 'Vui lòng nhập địa chỉ!' }]}
                      >
                        <Input placeholder="Số nhà, đường, phường/xã, quận/huyện, tỉnh/thành phố" />
                      </Form.Item>
                    </Col>
                  </Row>
                </Col>
              </Row>

              {/* Mục tiêu nghề nghiệp */}
              <Title level={4} style={{ marginTop: '20px' }}>Mục tiêu nghề nghiệp</Title>
              <Divider />
              
              <Form.Item
                name="careerGoals"
                rules={[{ required: true, message: 'Vui lòng nhập mục tiêu nghề nghiệp!' }]}
              >
                <TextArea
                  placeholder="Mô tả mục tiêu nghề nghiệp của bạn trong ngắn hạn và dài hạn..."
                  autoSize={{ minRows: 3, maxRows: 6 }}
                />
              </Form.Item>

              {/* Học vấn */}
              <Title level={4} style={{ marginTop: '20px' }}>Học vấn</Title>
              <Divider />
              
              <Form.List name="education">
                {(fields, { add, remove }) => (
                  <>
                    {fields.map(({ key, name, ...restField }) => (
                      <Card
                        key={key}
                        style={{ marginBottom: '16px' }}
                        type="inner"
                        title={`Học vấn ${name + 1}`}
                        extra={
                          fields.length > 1 ? (
                            <MinusCircleOutlined onClick={() => remove(name)} />
                          ) : null
                        }
                      >
                        <Row gutter={[16, 0]}>
                          <Col xs={24} md={12}>
                            <Form.Item
                              {...restField}
                              name={[name, 'schoolName']}
                              label="Tên trường"
                              rules={[{ required: true, message: 'Vui lòng nhập tên trường!' }]}
                            >
                              <Input placeholder="Đại học ABC" />
                            </Form.Item>
                          </Col>
                          
                          <Col xs={24} md={12}>
                            <Form.Item
                              {...restField}
                              name={[name, 'timeRange']}
                              label="Thời gian"
                              rules={[{ required: true, message: 'Vui lòng chọn thời gian học!' }]}
                            >
                              <RangePicker
                                locale={locale}
                                style={{ width: '100%' }}
                                picker="month"
                                format="MM/YYYY"
                              />
                            </Form.Item>
                          </Col>
                          
                          <Col xs={24}>
                            <Form.Item
                              {...restField}
                              name={[name, 'major']}
                              label="Chuyên ngành"
                              rules={[{ required: true, message: 'Vui lòng nhập chuyên ngành!' }]}
                            >
                              <Input placeholder="Quản trị kinh doanh, CNTT,..." />
                            </Form.Item>
                          </Col>
                          
                          <Col xs={24}>
                            <Form.Item
                              {...restField}
                              name={[name, 'description']}
                              label="Mô tả"
                            >
                              <TextArea
                                placeholder="Mô tả thành tích học tập, các hoạt động tham gia..."
                                autoSize={{ minRows: 2, maxRows: 4 }}
                              />
                            </Form.Item>
                          </Col>
                        </Row>
                      </Card>
                    ))}
                    
                    <Form.Item>
                      <Button
                        type="dashed"
                        onClick={() => add()}
                        block
                        icon={<PlusOutlined />}
                      >
                        Thêm học vấn
                      </Button>
                    </Form.Item>
                  </>
                )}
              </Form.List>

              {/* Kinh nghiệm làm việc */}
              <Title level={4} style={{ marginTop: '20px' }}>Kinh nghiệm làm việc</Title>
              <Divider />
              
              <Form.List name="experience">
                {(fields, { add, remove }) => (
                  <>
                    {fields.map(({ key, name, ...restField }) => (
                      <Card
                        key={key}
                        style={{ marginBottom: '16px' }}
                        type="inner"
                        title={`Kinh nghiệm ${name + 1}`}
                        extra={
                          fields.length > 1 ? (
                            <MinusCircleOutlined onClick={() => remove(name)} />
                          ) : null
                        }
                      >
                        <Row gutter={[16, 0]}>
                          <Col xs={24} md={12}>
                            <Form.Item
                              {...restField}
                              name={[name, 'companyName']}
                              label="Tên công ty"
                              rules={[{ required: true, message: 'Vui lòng nhập tên công ty!' }]}
                            >
                              <Input placeholder="Công ty XYZ" />
                            </Form.Item>
                          </Col>
                          
                          <Col xs={24} md={12}>
                            <Row gutter={8}>
                              <Col span={18}>
                                <Form.Item
                                  {...restField}
                                  name={[name, 'timeRange']}
                                  label="Thời gian"
                                  rules={[{ required: true, message: 'Vui lòng chọn thời gian làm việc!' }]}
                                >
                                  <RangePicker
                                    locale={locale}
                                    style={{ width: '100%' }}
                                    picker="month"
                                    format="MM/YYYY"
                                  />
                                </Form.Item>
                              </Col>
                              <Col span={6}>
                                <Form.Item
                                  {...restField}
                                  name={[name, 'currentJob']}
                                  label="Công việc hiện tại"
                                  valuePropName="checked"
                                >
                                  <Select placeholder="Chọn">
                                    <Option value={true}>Đang làm</Option>
                                    <Option value={false}>Đã nghỉ</Option>
                                  </Select>
                                </Form.Item>
                              </Col>
                            </Row>
                          </Col>
                          
                          <Col xs={24}>
                            <Form.Item
                              {...restField}
                              name={[name, 'position']}
                              label="Vị trí công việc"
                              rules={[{ required: true, message: 'Vui lòng nhập vị trí công việc!' }]}
                            >
                              <Input placeholder="Nhân viên kinh doanh, Trưởng nhóm,..." />
                            </Form.Item>
                          </Col>
                          
                          <Col xs={24}>
                            <Form.Item
                              {...restField}
                              name={[name, 'description']}
                              label="Mô tả công việc"
                              rules={[{ required: true, message: 'Vui lòng mô tả công việc!' }]}
                            >
                              <TextArea
                                placeholder="Mô tả chi tiết về trách nhiệm, thành tích, dự án đã tham gia..."
                                autoSize={{ minRows: 3, maxRows: 6 }}
                              />
                            </Form.Item>
                          </Col>
                        </Row>
                      </Card>
                    ))}
                    
                    <Form.Item>
                      <Button
                        type="dashed"
                        onClick={() => add()}
                        block
                        icon={<PlusOutlined />}
                      >
                        Thêm kinh nghiệm làm việc
                      </Button>
                    </Form.Item>
                  </>
                )}
              </Form.List>

              {/* Kỹ năng */}
              <Title level={4} style={{ marginTop: '20px' }}>Kỹ năng</Title>
              <Divider />
              
              <Form.List name="skills">
                {(fields, { add, remove }) => (
                  <>
                    {fields.map(({ key, name, ...restField }) => (
                      <Space key={key} style={{ display: 'flex', marginBottom: 8 }} align="baseline">
                        <Form.Item
                          {...restField}
                          name={[name, 'skillName']}
                          rules={[{ required: true, message: 'Vui lòng nhập tên kỹ năng!' }]}
                        >
                          <Input placeholder="Tên kỹ năng" style={{ width: '200px' }} />
                        </Form.Item>
                        
                        <Form.Item
                          {...restField}
                          name={[name, 'description']}
                          rules={[{ required: true, message: 'Vui lòng mô tả kỹ năng!' }]}
                        >
                          <Input placeholder="Mô tả chi tiết kỹ năng" style={{ width: '400px' }} />
                        </Form.Item>
                        
                        {fields.length > 1 ? (
                          <MinusCircleOutlined onClick={() => remove(name)} />
                        ) : null}
                      </Space>
                    ))}
                    
                    <Form.Item>
                      <Button
                        type="dashed"
                        onClick={() => add()}
                        block
                        icon={<PlusOutlined />}
                      >
                        Thêm kỹ năng
                      </Button>
                    </Form.Item>
                  </>
                )}
              </Form.List>

              {/* Chứng chỉ */}
              <Title level={4} style={{ marginTop: '20px' }}>Chứng chỉ</Title>
              <Divider />
              
              <Form.List name="certificates">
                {(fields, { add, remove }) => (
                  <>
                    {fields.map(({ key, name, ...restField }) => (
                      <Space key={key} style={{ display: 'flex', marginBottom: 8 }} align="baseline">
                        <Form.Item
                          {...restField}
                          name={[name, 'certificateName']}
                        >
                          <Input placeholder="Tên chứng chỉ" style={{ width: '200px' }} />
                        </Form.Item>
                        
                        <Form.Item
                          {...restField}
                          name={[name, 'issuer']}
                        >
                          <Input placeholder="Đơn vị cấp" style={{ width: '200px' }} />
                        </Form.Item>
                        
                        <Form.Item
                          {...restField}
                          name={[name, 'timeReceived']}
                        >
                          <DatePicker locale={locale} picker="month" format="MM/YYYY" placeholder="Thời gian nhận" />
                        </Form.Item>
                        
                        {fields.length > 1 ? (
                          <MinusCircleOutlined onClick={() => remove(name)} />
                        ) : null}
                      </Space>
                    ))}
                    
                    <Form.Item>
                      <Button
                        type="dashed"
                        onClick={() => add()}
                        block
                        icon={<PlusOutlined />}
                      >
                        Thêm chứng chỉ
                      </Button>
                    </Form.Item>
                  </>
                )}
              </Form.List>

              {/* Nút hành động */}
              <Divider />
              <Form.Item>
                <Space size="middle" style={{ display: 'flex', justifyContent: 'center' }}>
                  <Button
                    type="primary"
                    icon={<EyeOutlined />}
                    onClick={handlePreview}
                    style={{ backgroundColor: '#1890ff' }}
                  >
                    Xem trước CV
                  </Button>
                  
                  <Button
                    type="primary"
                    icon={<SaveOutlined />}
                    onClick={handleExportPDF}
                    loading={loading}
                    style={{ backgroundColor: '#52c41a' }}
                  >
                    Xuất PDF
                  </Button>
                </Space>
              </Form.Item>
            </Form>
          </Card>
        </Col>
      </Row>

      {/* Modal xem trước CV */}
      <Modal
        title="Xem trước CV"
        open={previewOpen}
        onCancel={handleClose}
        width={900}
        footer={[
          <Button key="back" onClick={handleClose}>
            Đóng
          </Button>,
          <Button key="export" type="primary" icon={<SaveOutlined />} onClick={handleExportPDF} loading={loading}>
            Xuất PDF
          </Button>
        ]}
      >
        <div style={{ display: 'flex', justifyContent: 'center', padding: '20px' }}>
          <CVPreview data={previewData} />
        </div>
      </Modal>
    </div>
  );
};

export default CVBuilder;