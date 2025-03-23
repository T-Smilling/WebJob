import SearchFilter from "../SearchFilter";
import SearchForm from "../SearchForm";
import './JobPage.css'
import { Row, Col, notification } from "antd";
import { useSearchParams } from "react-router-dom";
import { useEffect,useState } from "react";
import SearchResult from "../SearchResult";
import { getAllJob } from "../../services/jobService";
import CustomPagination from "../Pagination";

function AllJob () {
    const [data, setData] = useState([]);
    const [message, contextHolder] = notification.useNotification();
    const [searchParams] = useSearchParams();
    const [totalItems, setTotalItems] = useState(0);

    const page = parseInt(searchParams.get("page") || "1", 10);
    const size = 9;

    useEffect(() => {
        const fetchData = async () => {
            const response = await getAllJob(page - 1, size);
            try {
                setData(response.result.content);
                setTotalItems(response.result.totalElements);
            } catch (error) {
                message.error({
                    message: 'Get job detail failed',
                    duration: 1.5
                })
            }
        };

        fetchData();
    }, [page]);

    return (
        <>
        {contextHolder}
        <SearchForm/>
        <div className="job-page">
            <Row gutter={[15, 15]}>
                <Col xs={24} md={6}>
                    <SearchFilter/>
                </Col>
                <Col xs={24} md={18}>
                {data && <SearchResult data={data} />}
                </Col>
                <CustomPagination totalItems={totalItems} pageSize={size} />
            </Row>
        </div>
        </> 
    );
}

export default AllJob;