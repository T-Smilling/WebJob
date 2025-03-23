import { useState,useEffect } from 'react';
import { Card, Radio, Button,notification } from 'antd';
import { useNavigate } from 'react-router-dom'; 
import Cookies from 'js-cookie';
import { getLastCv } from '../../services/resumeService';
import { getInfoUser } from '../../services/userService';
import { applyJob } from '../../services/applicationService'
import { extractFilename } from '../../utils/extractFilename';
function ModelApply (props) {
    const jobId = props;
    const token = Cookies.get('token')
    const [cvData, setCvData] = useState();
    const [infoUser, setInfoUser] = useState({});
    const [selectedCV, setSelectedCV] = useState("exist");
    const [message, contextHolder] = notification.useNotification();
    const navigate = useNavigate();

    useEffect(() => {
        const fetchData = async () => {
            const responseCv = await getLastCv(token)
            setCvData(responseCv.result.resumeUrl)
            const responseUser = await getInfoUser(token)
            setInfoUser(responseUser.result)
        }
        fetchData()
      }, []);
    
    const handleCVChange = (e) => {
        setSelectedCV(e.target.value);
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
        try {
            const response = await applyJob(jobId.props,token)
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

    return (
        <>
        {contextHolder}
        <Card title="Chọn CV để ứng tuyển">
            <Radio.Group value={selectedCV} onChange={handleCVChange}>
            <Radio style={{ display: 'block', height: '30px', lineHeight: '30px' }} value="exist">
                CV ứng tuyển gần nhất: 
                {cvData && (
                    <a href={cvData} target="_blank" rel="noopener noreferrer">
                    <span style={{ paddingLeft: '10px' }}>{extractFilename(cvData)}</span>
                    </a>
            )}
            </Radio>
            <Radio style={{ display: 'block', height: '30px', lineHeight: '30px' }} value="upload">
                Tải CV mới lên
            </Radio>
            </Radio.Group>
            {selectedCV === "exist" && (
            <div style={{ marginTop: '10px' }}>
                <p><strong>Họ và tên:</strong> {infoUser.fullName}</p>
                <p><strong>Email:</strong> {infoUser.email}</p>
                <p><strong>Số điện thoại:</strong> {infoUser.phone}</p>
            </div>
            )}
            {selectedCV === 'upload' && (
            <Button type="primary" onClick={handleUploadClick}>
                Tải CV mới lên
            </Button>
            )}
            <div style={{ marginTop: '20px', textAlign: 'right' }}>
                <Button type="primary" onClick={handleSubmit}>
                    Nộp hồ sơ ứng tuyển
                </Button>
            </div>
        </Card>
        </>
    );
};

export default ModelApply;