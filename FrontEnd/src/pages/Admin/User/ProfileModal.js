import { Modal, Avatar, Descriptions, Tag } from "antd";
import { UserOutlined } from "@ant-design/icons";

function ProfileModal({ visible, onClose, user }) {
  return (
    <Modal
      title="Thông tin cá nhân"
      visible={visible}
      onCancel={onClose}
      footer={null}
      width={600}
    >
      {user ? (
        <div style={{ display: "flex", gap: 24 }}>
          <Avatar
            src={user.avatarUrl}
            icon={<UserOutlined />}
            size={100}
            style={{ flexShrink: 0 }}
          />
          <Descriptions column={1} bordered>
            <Descriptions.Item label="ID">{user.id}</Descriptions.Item>
            <Descriptions.Item label="Tên người dùng">{user.username}</Descriptions.Item>
            <Descriptions.Item label="Họ tên">{user.fullName || "Chưa cập nhật"}</Descriptions.Item>
            <Descriptions.Item label="Email">{user.email}</Descriptions.Item>
            <Descriptions.Item label="Xác thực Email">
              <Tag color={user.emailVerified ? "green" : "red"}>
                {user.emailVerified ? "Đã xác thực" : "Chưa xác thực"}
              </Tag>
            </Descriptions.Item>
            <Descriptions.Item label="Số điện thoại">{user.phone || "Chưa cập nhật"}</Descriptions.Item>
            <Descriptions.Item label="Trạng thái">
              <Tag color={user.status === "active" ? "green" : "red"}>
                {user.status === "active" ? "Hoạt động" : "Không hoạt động"}
              </Tag>
            </Descriptions.Item>
          </Descriptions>
        </div>
      ) : (
        <p>Đang tải thông tin...</p>
      )}
    </Modal>
  );
}

export default ProfileModal;