import { Pagination } from "antd";
import { useSearchParams } from "react-router-dom";
import './Pagination.css';

function CustomPagination({ totalItems, pageSize = 9, onPageChange }) {
  const [searchParams, setSearchParams] = useSearchParams();
  const currentPage = parseInt(searchParams.get("page") || "1", 10);
  const handlePageChange = (page) => {
    setSearchParams({
      ...Object.fromEntries(searchParams),
      page: page.toString(),

    });
    if (onPageChange) {
      onPageChange(page);
    }
  };
  setTimeout(() => {
    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  }, 0);
  return (
    <div className="pagination-container">  
      <Pagination
        current={currentPage}
        total={totalItems}
        pageSize={pageSize}
        onChange={handlePageChange}
        showSizeChanger={false}
        showQuickJumper
        showLessItems
      />
    </div>
  );
}

export default CustomPagination;