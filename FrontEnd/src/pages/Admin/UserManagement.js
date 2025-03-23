import { Table, Button, Avatar, Tag, message } from "antd";
import { useState, useEffect } from "react";
import { useSearchParams } from "react-router-dom";
import CustomPagination from "../../components/Pagination";
import { getAllUser, updateUser, deleteUser, register } from "../../services/userService";
import Cookies from "js-cookie";
import EditUserModal from "./User/EditUserModal";
import CreateUserModal from "./User/CreateUserModal";
import ConfirmDeleteModal from "./User/ConfirmDeleteModel";
import { EditOutlined, DeleteOutlined, PlusOutlined } from "@ant-design/icons";
import "./UserManagement.css";

function UserManagement() {
  const [searchParams, setSearchParams] = useSearchParams();
  const [currentPage, setCurrentPage] = useState(parseInt(searchParams.get("page") || "1", 10));
  const [pageSize, setPageSize] = useState(parseInt(searchParams.get("size") || "9", 10));
  const [totalItems, setTotalItems] = useState(0);
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(false);
  const [editModalVisible, setEditModalVisible] = useState(false);
  const [createModalVisible, setCreateModalVisible] = useState(false);
  const [deleteModalVisible, setDeleteModalVisible] = useState(false);
  const [selectedUser, setSelectedUser] = useState(null);
  const token = Cookies.get("token");

  useEffect(() => {
    const fetchUsers = async () => {
      setLoading(true);
      try {
        const response = await getAllUser(currentPage - 1, pageSize, token);
        setUsers(response.result.content);
        setTotalItems(response.result.totalElements);
      } catch (error) {
        console.error("Failed to fetch users:", error);
        setUsers([]);
        setTotalItems(0);
      } finally {
        setLoading(false);
      }
    };

    fetchUsers();
  }, [currentPage, pageSize, token]);

  const handleEdit = (user) => {
    setSelectedUser(user);
    setEditModalVisible(true);
  };

  const handleCreate = () => {
    setCreateModalVisible(true);
  };

  const handleDelete = (user) => {
    setSelectedUser(user);
    setDeleteModalVisible(true);
  };

  const handleCreateUser = async (values) => {
    try {
      const responseCheck = await register(values, token);
      if (responseCheck.code === 200) {
        message.success("Tạo tài khoản thành công");
        const response = await getAllUser(currentPage - 1, pageSize, token);
        setUsers(response.result.content);
        setTotalItems(response.result.totalElements);
      } else {
        message.error(responseCheck.message || "Tạo tài khoản thất bại");
      }
    } catch (error) {
      console.error("Failed to create user:", error);
      message.error(error.response?.data?.message || "Tạo tài khoản thất bại");
    } finally {
      setCreateModalVisible(false);
    }
  };

  const handleUpdateUser = async (values) => {
    try {
      const formData = new FormData();
      formData.append("password", values.password || "");
      formData.append("fullName", values.fullName || "");
      formData.append("phone", values.phone || "");
      if (values.avatarUrl) {
        formData.append("avatarUrl", values.avatarUrl);
      }
      console.log("FormData content:");
      for (let [key, value] of formData.entries()) {
        console.log(`${key}:`, value);
      }
      const responseCheck = await updateUser(selectedUser.id, formData, token);
      if (responseCheck.code === 200) {
        message.success("Cập nhật người dùng thành công");
        const response = await getAllUser(currentPage - 1, pageSize, token);
        setUsers(response.result.content);
        setTotalItems(response.result.totalElements);
      } else {
        message.error("Cập nhật người dùng thất bại");
      }
    } catch (error) {
      console.error("Failed to update user:", error);
      message.error("Cập nhật người dùng thất bại");
    } finally {
      setEditModalVisible(false);
      setSelectedUser(null);
    }
  };

  const handleConfirmDelete = async () => {
    try {
      const responseCheck = await deleteUser(selectedUser.id, token);
      console.log(responseCheck);
      if (responseCheck.code === 200) {
        message.success("Xóa người dùng thành công");
        const response = await getAllUser(currentPage - 1, pageSize, token);
        setUsers(response.result.content);
        setTotalItems(response.result.totalElements);
      } else {
        message.error("Xóa người dùng thất bại");
      }
    } catch (error) {
      console.error("Failed to delete user:", error);
      message.error("Xóa người dùng thất bại");
    } finally {
      setDeleteModalVisible(false);
      setSelectedUser(null);
    }
  };

  const columns = [
    {
      title: "STT",
      key: "stt",
      align: "center",
      width: 60,
      render: (text, record, index) => {
        return (currentPage - 1) * pageSize + index + 1;
      },
    },
    {
      title: "Avatar",
      dataIndex: "avatarUrl",
      key: "avatarUrl",
      render: (avatarUrl) => <Avatar src={avatarUrl} />,
      width: 80,
      responsive: ["md"],
    },
    {
      title: "Tên người dùng",
      dataIndex: "username",
      key: "username",
      width: 150,
    },
    {
      title: "Họ tên",
      dataIndex: "fullName",
      key: "fullName",
      width: 150,
    },
    {
      title: "Email",
      dataIndex: "email",
      key: "email",
      width: 200,
    },
    {
      title: "Xác thực Email",
      dataIndex: "emailVerified",
      key: "emailVerified",
      render: (verified) => (
        <Tag color={verified ? "green" : "red"}>{verified ? "Đã xác thực" : "Chưa xác thực"}</Tag>
      ),
      width: 120,
      responsive: ["sm"],
    },
    {
      title: "Số điện thoại",
      dataIndex: "phone",
      key: "phone",
      width: 150,
      responsive: ["md"],
    },
    {
      title: "Trạng thái",
      dataIndex: "status",
      key: "status",
      render: (status) => (
        <Tag color={status === "active" ? "green" : "red"}>
          {status === "active" ? "Hoạt động" : "Không hoạt động"}
        </Tag>
      ),
      width: 120,
      responsive: ["sm"],
    },
    {
      title: "Hành động",
      key: "action",
      render: (_, record) => (
        <div className="action-buttons">
          <Button
            type="primary"
            icon={<EditOutlined />}
            onClick={() => handleEdit(record)}
            className="edit-button"
          >
            Sửa
          </Button>
          <Button
            type="primary"
            danger
            icon={<DeleteOutlined />}
            onClick={() => handleDelete(record)}
            className="delete-button"
          >
            Xóa
          </Button>
        </div>
      ),
      width: 150,
    },
  ];

  const handlePageChange = (page) => {
    setCurrentPage(page);
    setSearchParams({
      page: page.toString(),
      size: pageSize.toString(),
    });
  };

  return (
    <div>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 16 }}>
        <h2>Quản lý tài khoản</h2>
        <Button
          type="primary"
          icon={<PlusOutlined />}
          onClick={handleCreate}
          style={{ backgroundColor: "#52c41a", borderColor: "#52c41a" }}
        >
          Thêm mới tài khoản
        </Button>
      </div>
      <Table
        columns={columns}
        dataSource={users}
        rowKey="id"
        pagination={false}
        scroll={{ x: 860 }} // Tăng scroll.x để chứa cột STT mới
        loading={loading}
      />
      <CustomPagination
        totalItems={totalItems}
        pageSize={pageSize}
        onPageChange={handlePageChange}
      />
      <EditUserModal
        visible={editModalVisible}
        onClose={() => setEditModalVisible(false)}
        onSubmit={handleUpdateUser}
        initialValues={selectedUser}
      />
      <CreateUserModal
        visible={createModalVisible}
        onClose={() => setCreateModalVisible(false)}
        onSubmit={handleCreateUser}
      />
      <ConfirmDeleteModal
        visible={deleteModalVisible}
        onCancel={() => setDeleteModalVisible(false)}
        onConfirm={handleConfirmDelete}
        user={selectedUser}
      />
    </div>
  );
}

export default UserManagement;