import { useState, useEffect } from 'react';
import { Card, Radio, Button, notification, Space, Spin, Divider, Typography, List, Avatar } from 'antd';
import { useNavigate } from 'react-router-dom'; 
import Cookies from 'js-cookie';
import { getLastCv, getAllCVByUser } from '../../services/resumeService';
import { getInfoUser } from '../../services/userService';
import { applyJob } from '../../services/applicationService';
import { extractFilename } from '../../utils/extractFilename';
import { FilePdfOutlined, UserOutlined, UploadOutlined, SendOutlined, CheckCircleOutlined } from '@ant-design/icons';

const { Title, Text } = Typography;

function ModelApply (props) {
    const jobId = props;
    const token = Cookies.get('token')
    const [cvData, setCvData] = useState();
    const [allCvs, setAllCvs] = useState([]);
    const [infoUser, setInfoUser] = useState({});
    const [selectedCV, setSelectedCV] = useState("exist");
    const [selectedCvFromList, setSelectedCvFromList] = useState(null);
    const [currentPage, setCurrentPage] = useState(1);
    const [pageSize, setPageSize] = useState(10);
    const [loading, setLoading] = useState(true);
    const [message, contextHolder] = notification.useNotification();
    const navigate = useNavigate();

    useEffect(() => {
        const fetchData = async () => {
            setLoading(true);
            try {
                const responseCv = await getLastCv(token)
                setCvData(responseCv.result.resumeUrl)
                const responseUser = await getInfoUser(token)
                setInfoUser(responseUser.result)
                
                // Fetch all CVs
                const responseAllCVs = await getAllCVByUser(token, currentPage - 1, pageSize)
                setAllCvs(responseAllCVs.result.content || [])
            } catch (error) {
                message.error({
                    message: 'Không thể tải dữ liệu',
                    description: 'Vui lòng thử lại sau',
                    duration: 2
                });
            } finally {
                setLoading(false);
            }
        }
        fetchData()
    }, [currentPage, pageSize]);
    
    const handleCVChange = (e) => {
        setSelectedCV(e.target.value);
        // Reset selected CV from list when changing radio options
        if (e.target.value !== "list") {
            setSelectedCvFromList(null);
        }
    };

    const handleCvFromListChange = (e) => {
        setSelectedCvFromList(e.target.value);
    };

    const handleUploadClick = () => {
        navigate('/resume/upload');
    };

    const handleSubmit = async () => {
        if (!selectedCV) {
            message.error({
                message: 'Vui lòng chọn CV để ứng tuyển.',
                duration: 1.5
            })
            return;
        }
        
        if (selectedCV === "list" && !selectedCvFromList) {
            message.error({
                message: 'Vui lòng chọn một CV từ danh sách.',
                duration: 1.5
            })
            return;
        }
        
        try {
            const response = await applyJob(jobId.props, token)
            if (response.code === 200){
                message.success({
                    message: response.result.message,
                    description: "Congratulations! You have successfully applied for this job",
                    duration: 1.5
                })
                setTimeout(() => {
                    navigate("/");
                }, 2000);
            }
            else{
                message.error({
                    message: 'Apply failed.',
                    duration: 1.5
                })
            }
        } catch (error) {
            message.error({
                message: 'Apply failed.',
                duration: 1.5
            })
        }
    };

    const userInfoDisplay = (
        <div className="user-info-container" style={{ 
            marginTop: '15px', 
            background: '#f5f5f5', 
            padding: '15px', 
            borderRadius: '8px',
            boxShadow: '0 1px 2px rgba(0,0,0,0.05)'
        }}>
            <Title level={5} style={{ margin: '0 0 10px 0' }}>Thông tin ứng viên</Title>
            <div style={{ display: 'flex', alignItems: 'center', marginBottom: '10px' }}>
                <UserOutlined style={{ fontSize: '16px', marginRight: '10px', color: '#1890ff' }} />
                <Text strong>Họ và tên:</Text>
                <Text style={{ marginLeft: '5px' }}>{infoUser.fullName}</Text>
            </div>
            <div style={{ display: 'flex', alignItems: 'center', marginBottom: '10px' }}>
                <i className="fas fa-envelope" style={{ fontSize: '16px', marginRight: '10px', color: '#1890ff' }}></i>
                <Text strong>Email:</Text>
                <Text style={{ marginLeft: '5px' }}>{infoUser.email}</Text>
            </div>
            <div style={{ display: 'flex', alignItems: 'center' }}>
                <i className="fas fa-phone" style={{ fontSize: '16px', marginRight: '10px', color: '#1890ff' }}></i>
                <Text strong>Số điện thoại:</Text>
                <Text style={{ marginLeft: '5px' }}>{infoUser.phone}</Text>
            </div>
        </div>
    );

    return (
        <>
        {contextHolder}
        <Card 
            title={
                <div style={{ display: 'flex', alignItems: 'center' }}>
                    <FilePdfOutlined style={{ fontSize: '20px', marginRight: '10px', color: '#1890ff' }} />
                    <span>Chọn CV để ứng tuyển</span>
                </div>
            } 
            style={{ 
                borderRadius: '10px',
                boxShadow: '0 4px 12px rgba(0,0,0,0.1)',
                maxWidth: '800px',
                margin: '0 auto'
            }}
            headStyle={{ 
                backgroundColor: '#f0f5ff', 
                borderBottom: '1px solid #d9e6ff',
                borderTopLeftRadius: '10px',
                borderTopRightRadius: '10px',
                fontSize: '18px'
            }}
            bodyStyle={{ padding: '24px' }}
        >
            {loading ? (
                <div style={{ display: 'flex', justifyContent: 'center', padding: '40px' }}>
                    <Spin size="large" />
                </div>
            ) : (
                <>
                    <Radio.Group 
                        value={selectedCV} 
                        onChange={handleCVChange}
                        style={{ width: '100%' }}
                    >
                        <div className="cv-option" style={{ 
                            padding: '15px', 
                            marginBottom: '10px',
                            border: selectedCV === "exist" ? '1px solid #1890ff' : '1px solid #d9d9d9',
                            borderRadius: '8px',
                            transition: 'all 0.3s',
                            backgroundColor: selectedCV === "exist" ? '#e6f7ff' : 'white'
                        }}>
                            <Radio value="exist" style={{ fontSize: '16px' }}>
                                <span style={{ fontWeight: '500' }}>CV tải lên gần nhất</span>
                            </Radio>
                            {cvData && (
                                <div style={{ marginLeft: '22px', marginTop: '5px' }}>
                                    <a 
                                        href={cvData} 
                                        target="_blank" 
                                        rel="noopener noreferrer"
                                        style={{
                                            display: 'flex',
                                            alignItems: 'center',
                                            color: '#1890ff',
                                            textDecoration: 'none'
                                        }}
                                    >
                                        <FilePdfOutlined style={{ marginRight: '5px' }} />
                                        <span>{extractFilename(cvData)}</span>
                                    </a>
                                </div>
                            )}
                        </div>

                        <div className="cv-option" style={{ 
                            padding: '15px', 
                            marginBottom: '10px',
                            border: selectedCV === "list" ? '1px solid #1890ff' : '1px solid #d9d9d9',
                            borderRadius: '8px',
                            transition: 'all 0.3s',
                            backgroundColor: selectedCV === "list" ? '#e6f7ff' : 'white'
                        }}>
                            <Radio value="list" style={{ fontSize: '16px' }}>
                                <span style={{ fontWeight: '500' }}>Chọn từ danh sách CV của bạn</span>
                            </Radio>
                        </div>

                        <div className="cv-option" style={{ 
                            padding: '15px', 
                            marginBottom: '10px',
                            border: selectedCV === "upload" ? '1px solid #1890ff' : '1px solid #d9d9d9',
                            borderRadius: '8px',
                            transition: 'all 0.3s',
                            backgroundColor: selectedCV === "upload" ? '#e6f7ff' : 'white'
                        }}>
                            <Radio value="upload" style={{ fontSize: '16px' }}>
                                <span style={{ fontWeight: '500' }}>Tải CV mới lên</span>
                            </Radio>
                        </div>
                    </Radio.Group>
                    
                    <Divider style={{ margin: '20px 0' }} />
                    
                    {selectedCV === "exist" && userInfoDisplay}
                    
                    {selectedCV === "list" && (
                        <div style={{ marginTop: '15px' }}>
                            {allCvs.length > 0 ? (
                                <List
                                    bordered
                                    style={{ 
                                        backgroundColor: 'white', 
                                        borderRadius: '8px',
                                        boxShadow: '0 1px 2px rgba(0,0,0,0.05)'
                                    }}
                                    dataSource={allCvs}
                                    renderItem={(cv, index) => (
                                        <List.Item
                                            style={{
                                                padding: '10px 15px',
                                                backgroundColor: selectedCvFromList === cv.resumeUrl ? '#e6f7ff' : 'transparent',
                                                transition: 'all 0.3s',
                                                cursor: 'pointer'
                                            }}
                                            onClick={() => setSelectedCvFromList(cv.resumeUrl)}
                                        >
                                            <Radio 
                                                value={cv.resumeUrl} 
                                                checked={selectedCvFromList === cv.resumeUrl}
                                                onChange={handleCvFromListChange}
                                            >
                                                <Space>
                                                    <Avatar 
                                                        icon={<FilePdfOutlined />} 
                                                        style={{ 
                                                            backgroundColor: '#f56a00', 
                                                            verticalAlign: 'middle' 
                                                        }} 
                                                    />
                                                    <a
                                                        href={cv.resumeUrl} 
                                                        target="_blank" 
                                                        rel="noopener noreferrer"
                                                        onClick={(e) => e.stopPropagation()}
                                                        style={{ marginLeft: '8px' }}
                                                    >
                                                        {extractFilename(cv.resumeUrl)}
                                                    </a>
                                                    {selectedCvFromList === cv.resumeUrl && (
                                                        <CheckCircleOutlined style={{ color: '#52c41a', marginLeft: '8px' }} />
                                                    )}
                                                </Space>
                                            </Radio>
                                        </List.Item>
                                    )}
                                />
                            ) : (
                                <div style={{ textAlign: 'center', padding: '20px', color: '#999' }}>
                                    Không có CV nào được tìm thấy
                                </div>
                            )}
                            
                            {selectedCvFromList && userInfoDisplay}
                        </div>
                    )}
                    
                    {selectedCV === 'upload' && (
                        <div style={{ marginTop: '15px', textAlign: 'center' }}>
                            <Button 
                                type="primary" 
                                size="large"
                                icon={<UploadOutlined />} 
                                onClick={handleUploadClick}
                                style={{ 
                                    borderRadius: '6px',
                                    height: '46px',
                                    boxShadow: '0 2px 0 rgba(0,0,0,0.045)'
                                }}
                            >
                                Tải CV mới lên
                            </Button>
                        </div>
                    )}
                    
                    <div style={{ marginTop: '30px', textAlign: 'right' }}>
                        <Button 
                            type="primary" 
                            size="large"
                            icon={<SendOutlined />}
                            onClick={handleSubmit}
                            style={{ 
                                borderRadius: '6px',
                                height: '46px',
                                padding: '0 25px',
                                boxShadow: '0 2px 0 rgba(0,0,0,0.045)',
                                background: 'linear-gradient(to right, #1890ff, #40a9ff)'
                            }}
                        >
                            Nộp hồ sơ ứng tuyển
                        </Button>
                    </div>
                </>
            )}
        </Card>
        </>
    );
};

export default ModelApply;