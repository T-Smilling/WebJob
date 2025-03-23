import SearchResult from "../../components/SearchResult";
import { useEffect,useState } from "react";
import { useSearchParams } from "react-router-dom";
import { searchJob } from "../../services/jobService";
import "./Search.css";
import { Tag,Row,Col } from "antd";
import SearchForm from "../../components/SearchForm";
import SearchFilter from "../../components/SearchFilter";
import CustomPagination from "../../components/Pagination";

function Search () {
    const [searchParam] = useSearchParams();
    const [data, setData] = useState([]);

    const [searchParams,setSearchParams] = useSearchParams();
    const [totalItems, setTotalItems] = useState(0);

    const page = parseInt(searchParams.get("page") || "1", 10);
    const size = 9;
    
    const location = searchParam.get("location") || "";
    const title = searchParam.get("title") || "";
    const jobType = searchParams.get("jobType") || "";
    const jobLevel = searchParams.get("jobLevel") || "";
    const minSalary = searchParams.get("minSalary") || "";
    const maxSalary = searchParams.get("maxSalary") || "";
    const skill = searchParams.get("skill") || "";

    const handleFilterChange = (filters) => {
      setSearchParams({
        location,
        title,
        jobType: filters.jobType || "",
        jobLevel: filters.jobLevel || "",
        minSalary: filters.minSalary || "",
        maxSalary: filters.maxSalary || "",
        skill: filters.skill || "",
        page: "1",
      });
    };
    
    useEffect(() => { 
      const fetchData = async () => {
        const response = await searchJob(
          location,
          title,
          page - 1,
          size,
          jobType,
          jobLevel,
          minSalary,
          maxSalary,
          skill
        );
        setTotalItems(response.result.totalElements);
        setData(response.result.content.reverse()); 
      };

      fetchData();
    }, [location, title,page,searchParams]);

  return (
    <>
    <SearchForm/>
    <div className="search-page">
      <Row gutter={[16, 16]}>
        <Col xs={24} md={6}>
         <SearchFilter onFilterChange={handleFilterChange} />
        </Col>
        <Col xs={24} md={18}>
          <div>
            <strong className="result-find">Kết quả tìm kiếm: </strong>
            {location && <Tag color="cyan" className="tag">{location}</Tag>}
            {title && <Tag color="cyan"className="tag">{title}</Tag>}
          </div>
          {data && <SearchResult data={data} />}
          {data.length > 0 && <CustomPagination totalItems={totalItems}/>}
        </Col>
      </Row>
    </div>
    </>
  );
}

export default Search;