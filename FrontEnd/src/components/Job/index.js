import SearchFilter from "../SearchFilter";
import SearchForm from "../SearchForm";
import './JobPage.css';
import { Row, Col, notification } from "antd";
import { useSearchParams } from "react-router-dom";
import { useEffect, useState } from "react";
import SearchResult from "../SearchResult";
import { getAllJob } from "../../services/jobService";
import CustomPagination from "../Pagination";

function AllJob() {
    const [data, setData] = useState([]);
    const [message, contextHolder] = notification.useNotification();
    const [searchParams] = useSearchParams();
    const [totalItems, setTotalItems] = useState(0);
    const [loading, setLoading] = useState(true);

    const page = parseInt(searchParams.get("page") || "1", 10);
    const size = 9;

    useEffect(() => {
        const fetchData = async () => {
            try {
                setLoading(true);
                const response = await getAllJob(page - 1, size);
                console.log("Dữ liệu từ getAllJob:", response.result.content);
                setData(response.result.content || []);
                setTotalItems(response.result.totalElements || 0);
            } catch (error) {
                console.error("Error fetching getAllJob:", error);
                message.error({
                    message: 'Get job detail failed',
                    duration: 1.5
                });
                setData([]);
                setTotalItems(0);
            } finally {
                setLoading(false);
            }
        };

        fetchData();
    }, [page, message]);

    return (
        <>
            {contextHolder}
            <SearchForm />
            <div className="job-page">
                <Row gutter={[15, 15]}>
                    <Col xs={24} md={6}>
                        <SearchFilter />
                    </Col>
                    <Col xs={24} md={18}>
                        {loading ? (
                            <div>Đang tải dữ liệu...</div>
                        ) : data.length > 0 ? (
                            <SearchResult data={data} />
                        ) : (
                            <div>Không có dữ liệu công việc</div>
                        )}
                        <CustomPagination totalItems={totalItems} pageSize={size} />
                    </Col>
                </Row>
            </div>
        </>
    );
}

export default AllJob;