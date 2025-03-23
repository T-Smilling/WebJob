import { Modal, message } from "antd";

const ConfirmDeleteModal = ({ visible, onCancel, onConfirm, company }) => {
  return (
    <Modal
      title="Xác nhận xóa công ty"
      visible={visible}
      onOk={onConfirm}
      onCancel={onCancel}
      okText="Xóa"
      cancelText="Hủy"
      okButtonProps={{ danger: true }}
    >
      <p>
        Bạn có chắc chắn muốn xóa công ty{" "}
        <strong>{company?.companyName}</strong> không?
      </p>
    </Modal>
  );
};

export default ConfirmDeleteModal;