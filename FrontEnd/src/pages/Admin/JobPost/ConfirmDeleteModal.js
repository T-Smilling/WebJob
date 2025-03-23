import { Modal, message } from "antd";

const ConfirmDeleteModal = ({ visible, onCancel, onConfirm, jobPost }) => {
  return (
    <Modal
      title="Xác nhận xóa việc làm"
      visible={visible}
      onOk={onConfirm}
      onCancel={onCancel}
      okText="Xóa"
      cancelText="Hủy"
      okButtonProps={{ danger: true }}
    >
      <p>
        Bạn có chắc chắn muốn xóa việc làm{" "}
        <strong>{jobPost?.title}</strong> không?
      </p>
    </Modal>
  );
};

export default ConfirmDeleteModal;