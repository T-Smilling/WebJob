import { Table, Button, message } from "antd";
import { useState, useEffect } from "react";
import { useSearchParams } from "react-router-dom";
import CustomPagination from "../../components/Pagination";
import { getAllJob, updateJob, deleteJob } from "../../services/jobService";
import Cookies from "js-cookie";
import EditJobPostModal from "./JobPost/EditJobPostModal";
import ConfirmDeleteModal from "./JobPost/ConfirmDeleteModal";
import { EditOutlined, DeleteOutlined } from "@ant-design/icons";
import "./JobPostManagement.css";
import dayjs from "dayjs";

function JobPostManagement() {
  const [searchParams, setSearchParams] = useSearchParams();
  const [currentPage, setCurrentPage] = useState(parseInt(searchParams.get("page") || "1", 10));
  const [pageSize, setPageSize] = useState(parseInt(searchParams.get("size") || "9", 10));
  const [totalItems, setTotalItems] = useState(0);
  const [jobPosts, setJobPosts] = useState([]);
  const [loading, setLoading] = useState(false);
  const [editModalVisible, setEditModalVisible] = useState(false);
  const [deleteModalVisible, setDeleteModalVisible] = useState(false);
  const [selectedJobPost, setSelectedJobPost] = useState(null);
  const token = Cookies.get("token");

  useEffect(() => {
    const fetchJobPosts = async () => {
      setLoading(true);
      try {
        const response = await getAllJob(currentPage - 1, pageSize);
        setJobPosts(response.result.content);
        setTotalItems(response.result.totalElements);
      } catch (error) {
        console.error("Failed to fetch job posts:", error);
        setJobPosts([]);
        setTotalItems(0);
      } finally {
        setLoading(false);
      }
    };

    fetchJobPosts();
  }, [currentPage, pageSize, token]);

  const handleEdit = (jobPost) => {
    setSelectedJobPost(jobPost);
    setEditModalVisible(true);
  };

  const handleDelete = (jobPost) => {
    setSelectedJobPost(jobPost);
    setDeleteModalVisible(true);
  };

  const handleUpdateJobPost = async (values) => {
    try {
      const responseCheck = await updateJob(selectedJobPost.id, values, token);
      if (responseCheck.code === 200) {
        message.success("Cập nhật việc làm thành công");
        const response = await getAllJob(currentPage - 1, pageSize, token);
        setJobPosts(response.result.content);
        setTotalItems(response.result.totalElements);
      } else {
        message.error("Cập nhật việc làm thất bại");
      }
    } catch (error) {
      console.error("Failed to update job post:", error);
      message.error("Cập nhật việc làm thất bại");
    } finally {
      setEditModalVisible(false);
      setSelectedJobPost(null);
    }
  };

  const handleConfirmDelete = async () => {
    try {
      const responseCheck = await deleteJob(selectedJobPost.id, token);
      if (responseCheck.code === 200) {
        message.success("Xóa việc làm thành công");
        const response = await getAllJob(currentPage - 1, pageSize, token);
        setJobPosts(response.result.content);
        setTotalItems(response.result.totalElements);
      } else {
        message.error("Xóa việc làm thất bại");
      }
    } catch (error) {
      console.error("Failed to delete job post:", error);
      message.error("Xóa việc làm thất bại");
    } finally {
      setDeleteModalVisible(false);
      setSelectedJobPost(null);
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
      title: "Tiêu đề",
      dataIndex: "title",
      key: "title",
      width: 150,
    },
    {
      title: "Địa điểm",
      dataIndex: "location",
      key: "location",
      width: 150,
    },
    {
      title: "Lương",
      dataIndex: "salary",
      key: "salary",
      width: 120,
      render: (salary) => (salary ? `${salary.toLocaleString()} VNĐ` : "Thỏa thuận"),
    },
    {
      title: "Loại công việc",
      dataIndex: "jobType",
      key: "jobType",
      width: 120,
      render: (jobType) => {
        const typeMap = {
          FULL_TIME: "Toàn thời gian",
          PART_TIME: "Bán thời gian",
          REMOTE: "Từ xa",
        };
        return typeMap[jobType] || "Không xác định";
      },
    },
    {
      title: "Số lượng",
      dataIndex: "quantity",
      key: "quantity",
      width: 100,
      render: (quantity) => quantity || "0",
    },
    {
      title: "Ngày bắt đầu",
      dataIndex: "startDate",
      key: "startDate",
      width: 120,
      render: (startDate) => (startDate ? dayjs(startDate).format("DD/MM/YYYY") : "N/A"),
    },
    {
      title: "Công ty",
      dataIndex: "company",
      key: "company",
      width: 150,
      render: (company) => company?.companyName || "Không xác định",
    },
    {
      title: "Đơn ứng tuyển",
      dataIndex: "numberOfJobApplications",
      key: "numberOfJobApplications",
      width: 120,
      render: (number) => number || "0",
    },
    {
      title: "Theo dõi",
      dataIndex: "NumberOfSubscribers",
      key: "NumberOfSubscribers",
      width: 120,
      render: (number) => number || "0",
    },
    {
      title: "Kỹ năng",
      dataIndex: "requiredSkills",
      key: "requiredSkills",
      width: 150,
      render: (skills) =>
        skills?.length > 0 ? skills.map(skill => skill.name).join(", ") : "Không có",
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
            size="small"
          >
            Sửa
          </Button>
          <Button
            type="primary"
            danger
            icon={<DeleteOutlined />}
            onClick={() => handleDelete(record)}
            className="delete-button"
            size="small"
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
      <h2>Quản lý việc làm</h2>
      <Table
        columns={columns}
        dataSource={jobPosts}
        rowKey="id"
        pagination={false}
        scroll={{ x: 1100 }}
        loading={loading}
      />
      <CustomPagination
        totalItems={totalItems}
        pageSize={pageSize}
        onPageChange={handlePageChange}
      />
      <EditJobPostModal
        visible={editModalVisible}
        onClose={() => setEditModalVisible(false)}
        onSubmit={handleUpdateJobPost}
        initialValues={selectedJobPost}
      />
      <ConfirmDeleteModal
        visible={deleteModalVisible}
        onCancel={() => setDeleteModalVisible(false)}
        onConfirm={handleConfirmDelete}
        jobPost={selectedJobPost}
      />
    </div>
  );
}

export default JobPostManagement;