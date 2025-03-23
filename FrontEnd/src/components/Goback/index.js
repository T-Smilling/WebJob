import { Button } from "antd";
import { useNavigate } from "react-router-dom";

const Goback = () => {
    const navigate = useNavigate();
    
    return (
        <Button type="default" onClick={() => navigate(-1)}>
            Quay lại
        </Button>
    );
};

export default Goback;
