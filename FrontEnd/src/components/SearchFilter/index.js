import './SearchFilter.css';
import { useState,useEffect } from "react";
import { Radio, InputNumber, Select } from "antd";
import { FilterOutlined } from "@ant-design/icons";
import { getAllSkill } from '../../services/jobService';
import { useDispatch } from "react-redux";
import { checkSearch } from '../../actions/search';

const { Option } = Select;

function SearchFilter({ onFilterChange }){

  const [filters, setFilters] = useState({
    jobType: "",
    jobLevel: "",
    minSalary: null,
    maxSalary: null,
    skill: "",
  });

  const [salaryRange, setSalaryRange] = useState("custom");
  const [skills,setSkills] = useState([])
  const dispatch = useDispatch();

  useEffect(() => {
    const fetchData = async () =>{
      try {
        const response = await getAllSkill();
        setSkills(response.result);
        dispatch(checkSearch(true));
      } catch (error) {
        console.error('Fail to fetch data:', error);
      }
    }
    
    fetchData();
  },[])

  const handleFilterChange = (field, value) => {
    const updatedFilters = { ...filters, [field]: value };
    setFilters(updatedFilters);
    if (onFilterChange) {
      onFilterChange(updatedFilters);
    }
  };

  const handleSalaryRangeChange = (e) => {
    const value = e.target.value;
    setSalaryRange(value);
    if (value !== "custom") {
      const [min, max] = value.split("-").map(Number);
      const updatedFilters = {
        ...filters,
        minSalary: min * 1000000 || null,
        maxSalary: max * 1000000 || null,
      };
      setFilters(updatedFilters);
      if (onFilterChange) {
        onFilterChange(updatedFilters);
      }
    }
  };

  return (
    <div className="filter-container">
      <h2><FilterOutlined /> Lọc nâng cao</h2>

      <div className="filter-section">
        <label>Loại công việc:</label>
        <Radio.Group
          onChange={(e) => handleFilterChange("jobType", e.target.value)}
          value={filters.jobType}>
          <div>
            <Radio value="">Tất cả</Radio>
          </div>
          <div>
            <Radio value="FULL_TIME">Full-time</Radio>
          </div>
          <div>
            <Radio value="PART_TIME">Part-time</Radio>
          </div>
          <div>
            <Radio value="REMOTE">Remote</Radio>
          </div>
        </Radio.Group>
      </div>

      <div className="filter-section">
        <label>Cấp bậc:</label>
        <Radio.Group
          onChange={(e) => handleFilterChange("jobLevel", e.target.value)}
          value={filters.jobLevel}
        >
          <div>
            <Radio value="">Tất cả</Radio>
          </div>
          <div>
            <Radio value="INTERN">Thực tập sinh</Radio>
          </div>
          <div>
            <Radio value="JUNIOR">Junior</Radio>
          </div>
          <div>
            <Radio value="MID">Middle</Radio>
          </div>
          <div>
            <Radio value="SENIOR">Senior</Radio>
          </div>
          <div>
            <Radio value="LEADER">Tech lead</Radio>
          </div>
        </Radio.Group>
      </div>

      <div className="filter-section">
        <label>Mức lương:</label>
        <Radio.Group
          onChange={handleSalaryRangeChange}
          value={salaryRange}
        >
          <div>
            <Radio value="">Tất cả</Radio>
          </div>
          <div>
            <Radio value="0-10">Dưới 10 triệu</Radio>
          </div>
          <div>
            <Radio value="10-20">10 - 20 triệu</Radio>
          </div>
          <div>
            <Radio value="20-30">20 - 30 triệu</Radio>
          </div>
          <div>
            <Radio value="30-50">30 - 50 triệu</Radio>
          </div>
          <div>
            <Radio value="50">Trên 50 triệu</Radio>
          </div>
          <div>
            <Radio value="custom">Thoả thuận</Radio>
          </div>
        </Radio.Group>

        {salaryRange === "custom" && (
          <div className="salary-custom-container">
            <InputNumber
              value={filters.minSalary}
              onChange={(value) => handleFilterChange("minSalary", value)}
              placeholder="Từ"
              className="salary-input"
              min={0}
            /> -
            <InputNumber
              value={filters.maxSalary}
              onChange={(value) => handleFilterChange("maxSalary", value)}
              placeholder="Đến"
              className="salary-input"
              min={0}
            />
            <span> triệu</span>
          </div>
        )}
      </div>

      <div className="filter-section">
        <label>Kỹ năng:</label>
        <Select
          value={filters.skill}
          onChange={(value) => handleFilterChange("skill", value)}
          style={{ width: "100%", marginBottom: 10 }}
        >
          <Option value="">Tất cả</Option>
          {skills.map((skill) => (
            <Option key={skill.id} value={skill.name}>
              {skill.name}
            </Option>
          ))}
        </Select>
      </div>
    </div>
  );
}

export default SearchFilter;