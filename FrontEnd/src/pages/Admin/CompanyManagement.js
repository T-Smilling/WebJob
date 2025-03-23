import { Table, Button, Avatar, message } from "antd";
import { useState, useEffect } from "react";
import { useSearchParams } from "react-router-dom";
import CustomPagination from "../../components/Pagination";
import { getAllCompany, createCompany, updateCompany, deleteCompany } from "../../services/companyService";
import Cookies from "js-cookie";
import EditCompanyModal from "./Company/EditCompanyModal";
import CreateCompanyModal from "./Company/CreateCompanyModal";
import ConfirmDeleteModal from "./Company/ConfirmDeleteModal";
import { EditOutlined, DeleteOutlined, PlusOutlined } from "@ant-design/icons";
import "./CompanyManagement.css";

function CompanyManagement() {
  const [searchParams, setSearchParams] = useSearchParams();
  const [currentPage, setCurrentPage] = useState(parseInt(searchParams.get("page") || "1", 10));
  const [pageSize, setPageSize] = useState(parseInt(searchParams.get("size") || "9", 10));
  const [totalItems, setTotalItems] = useState(0);
  const [companies, setCompanies] = useState([]);
  const [loading, setLoading] = useState(false);
  const [editModalVisible, setEditModalVisible] = useState(false);
  const [createModalVisible, setCreateModalVisible] = useState(false);
  const [deleteModalVisible, setDeleteModalVisible] = useState(false);
  const [selectedCompany, setSelectedCompany] = useState(null);
  const token = Cookies.get("token");

  useEffect(() => {
    const fetchCompanies = async () => {
      setLoading(true);
      try {
        const response = await getAllCompany(currentPage - 1, pageSize);
        setCompanies(response.result.content);
        setTotalItems(response.result.totalElements);
      } catch (error) {
        console.error("Failed to fetch companies:", error);
        setCompanies([]);
        setTotalItems(0);
      } finally {
        setLoading(false);
      }
    };

    fetchCompanies();
  }, [currentPage, pageSize, token]);

  const handleEdit = (company) => {
    setSelectedCompany(company);
    setEditModalVisible(true);
  };

  const handleCreate = () => {
    setCreateModalVisible(true);
  };

  const handleDelete = (company) => {
    setSelectedCompany(company);
    setDeleteModalVisible(true);
  };

  const handleCreateCompany = async (values) => {
    try {
      const formData = new FormData();
      formData.append("companyName", values.companyName || "");
      formData.append("description", values.description || "");
      formData.append("website", values.website || "");
      formData.append("address", values.address || "");
      if (values.logoUrl) {
        formData.append("logoUrl", values.logoUrl);
      }

      const responseCheck = await createCompany(formData, token);
      if (responseCheck.code === 200) {
        message.success("Tạo công ty thành công");
        const response = await getAllCompany(currentPage - 1, pageSize, token);
        setCompanies(response.result.content);
        setTotalItems(response.result.totalElements);
      } else {
        message.error(responseCheck.message || "Tạo công ty thất bại");
      }
    } catch (error) {
      console.error("Failed to create company:", error);
      message.error(error.response?.data?.message || "Tạo công ty thất bại");
    } finally {
      setCreateModalVisible(false);
    }
  };

  const handleUpdateCompany = async (values) => {
    try {
      const formData = new FormData();
      formData.append("companyName", values.companyName || "");
      formData.append("description", values.description || "");
      formData.append("website", values.website || "");
      formData.append("address", values.address || "");
      if (values.logoUrl) {
        formData.append("logoUrl", values.logoUrl);
      }

      const responseCheck = await updateCompany(selectedCompany.id, formData, token);
      if (responseCheck.code === 200) {
        message.success("Cập nhật công ty thành công");
        const response = await getAllCompany(currentPage - 1, pageSize, token);
        setCompanies(response.result.content);
        setTotalItems(response.result.totalElements);
      } else {
        message.error("Cập nhật công ty thất bại");
      }
    } catch (error) {
      console.error("Failed to update company:", error);
      message.error("Cập nhật công ty thất bại");
    } finally {
      setEditModalVisible(false);
      setSelectedCompany(null);
    }
  };

  const handleConfirmDelete = async () => {
    try {
      const responseCheck = await deleteCompany(selectedCompany.id, token);
      if (responseCheck.code === 200) {
        message.success("Xóa công ty thành công");
        const response = await getAllCompany(currentPage - 1, pageSize, token);
        setCompanies(response.result.content);
        setTotalItems(response.result.totalElements);
      } else {
        message.error("Xóa công ty thất bại");
      }
    } catch (error) {
      console.error("Failed to delete company:", error);
      message.error("Xóa công ty thất bại");
    } finally {
      setDeleteModalVisible(false);
      setSelectedCompany(null);
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
      title: "Logo",
      dataIndex: "logoUrl",
      key: "logoUrl",
      render: (logoUrl) => <Avatar src={logoUrl} />,
      width: 80,
      responsive: ["md"],
    },
    {
      title: "Tên công ty",
      dataIndex: "companyName",
      key: "companyName",
      width: 150,
    },
    {
      title: "Mô tả",
      dataIndex: "description",
      key: "description",
      width: 200,
      render: (description) => (
        <div style={{ whiteSpace: "pre-wrap" }}>{description || "Không có mô tả"}</div>
      ),
    },
    {
      title: "Website",
      dataIndex: "website",
      key: "website",
      width: 150,
      render: (website) => (
        <a href={website} target="_blank" rel="noopener noreferrer">
          {website || "Không có website"}
        </a>
      ),
    },
    {
      title: "Địa chỉ",
      dataIndex: "address",
      key: "address",
      width: 150,
    },
    {
      title: "Số lượng nhân viên",
      dataIndex: "numberOfEmployees",
      key: "numberOfEmployees",
      width: 120,
      render: (number) => number || "0",
    },
    {
      title: "Lượng việc đang tuyển",
      dataIndex: "jobPosts",
      key: "jobPosts",
      width: 120,
      render: (jobPosts) => jobPosts?.content?.length || "0",
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
        <h2>Quản lý công ty</h2>
        <Button
          type="primary"
          icon={<PlusOutlined />}
          onClick={handleCreate}
          style={{ backgroundColor: "#52c41a", borderColor: "#52c41a" }}
        >
          Thêm mới công ty
        </Button>
      </div>
      <Table
        columns={columns}
        dataSource={companies}
        rowKey="id"
        pagination={false}
        scroll={{ x: 800 }}
        loading={loading}
      />
      <CustomPagination
        totalItems={totalItems}
        pageSize={pageSize}
        onPageChange={handlePageChange}
      />
      <EditCompanyModal
        visible={editModalVisible}
        onClose={() => setEditModalVisible(false)}
        onSubmit={handleUpdateCompany}
        initialValues={selectedCompany}
      />
      <CreateCompanyModal
        visible={createModalVisible}
        onClose={() => setCreateModalVisible(false)}
        onSubmit={handleCreateCompany}
      />
      <ConfirmDeleteModal
        visible={deleteModalVisible}
        onCancel={() => setDeleteModalVisible(false)}
        onConfirm={handleConfirmDelete}
        company={selectedCompany}
      />
    </div>
  );
}

export default CompanyManagement;