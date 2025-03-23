import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { notification } from "antd";
import { confirmAccount } from "../../services/userService";

function ConfirmAccount() {
    const { code } = useParams();
    const navigate = useNavigate();
    const [message, contextHolder] = notification.useNotification();
    const [data, setData] = useState(null);

    useEffect(() => {
        const confirm = async () => {
            try {
                const response = await confirmAccount(code);
                console.log(response)
                if (response.code === 200) {
                    setData(response.result);
                } else {
                    message.error({
                        message: "Xác nhận thất bại",
                        description: response.message || "Có lỗi xảy ra.",
                        duration: 3,
                    });
                }
            } catch (error) {
                message.error({
                    message: "Lỗi hệ thống",
                    description: "Không thể kết nối đến server.",
                    duration: 3,
                });
            }
        };

        confirm();
    }, [code, navigate, message]);

    return (
        <>
            {contextHolder}
            <div style={{ textAlign: "center", padding: "50px" }}>
                <h2>Xác nhận tài khoản</h2>
                {data ? (
                    <>
                        <p>{JSON.stringify(data)}</p>
                        <p>Vui lòng đăng nhập để sử dụng hệ thống.</p>
                    </>
                ) : (
                    <p>Đang xử lý xác nhận...</p>
                )}
            </div>
        </>
    );
}

export default ConfirmAccount;