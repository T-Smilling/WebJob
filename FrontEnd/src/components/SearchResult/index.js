import { Row, Col } from "antd";
import JobItem from "../Job/JobItem";
import "./SearchResult.css";

function SearchResult(props) {
  const { data = [] } = props;
  console.log("SearchResult nhận dữ liệu:", data);
  return (
    <>
      {data.length > 0 ? (
        <div className="search-container">
          <Row gutter={[20, 20]} className="job-list-container">
            {data.map((item) => (
              <Col xs={24} md={24} key={item.id}>
                <JobItem data={item} />
              </Col>
            ))}
          </Row>
        </div>
      ) : (
        <div className="no-results">Không tìm thấy công việc nào</div>
      )}
    </>
  );
}

export default SearchResult;