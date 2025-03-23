import { Modal } from "antd";

const ConfirmDeleteModal = ({ visible, onCancel, onConfirm, user }) => {
  return (
    <Modal
      title="Xác nhận xóa"
      visible={visible}
      onOk={onConfirm}
      onCancel={onCancel}
      okText="Xóa"
      cancelText="Hủy"
      okButtonProps={{ danger: true }}
    >
      <p>
        Bạn có chắc chắn muốn xóa người dùng{" "}
        <strong>{user?.username}</strong> không?
      </p>
    </Modal>
  );
};

export default ConfirmDeleteModal;