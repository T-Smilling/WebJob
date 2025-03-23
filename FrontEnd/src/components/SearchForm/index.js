import { Col, Form, Row, Select, Button,Input } from "antd";
import { useEffect, useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { getListCity } from "../../services/jobService";
import { useDispatch } from "react-redux";
import { checkSearch } from "../../actions/search"; 
import "./SearchForm.css";

function SearchForm() {
    const navigate = useNavigate();
    const [city,setCity] = useState();
    const [searchParam] = useSearchParams();
    const dispatch = useDispatch();
    const [form] = Form.useForm();

    const locationFromUrl = searchParam.get('location') || '';
    const titleFromUrl = searchParam.get('title') || '';

    useEffect(()=>{
        const fetchApi = async () =>{
            const response = await getListCity();
            if (response){
                const arrays = ["Tất cả thành phố",...response.result]
                const citiesObject = arrays.reduce((acc, city, index) => {
                    acc[index] = city;
                    return acc;
                }, {});

                const cityOptions = Object.entries(citiesObject).map(([key, value]) => ({
                    value: value,
                    label: value 
                }));
                setCity(cityOptions);
            }
        };
        fetchApi();

    },[]);

    useEffect(() => {
        form.setFieldsValue({
            city: locationFromUrl || "Tất cả thành phố", 
            title: titleFromUrl || '',
        });
    }, [form, locationFromUrl, titleFromUrl]);

    const handleFinish = (values) => {
        let city = values.city || "";
        city = values.city === "Tất cả thành phố" ? "" : city;
        dispatch(checkSearch(true));
        navigate(`/jobs/search?location=${city}&title=${values.title || ""}`);
    }
    return(
        <>
            <Form form={form} onFinish={handleFinish} className="search-form">
                <Row gutter={[12,12]} align='middle'>
                    <Col xxl={6} xl={6} lg={6}>
                        <Form.Item name="city">
                            <Select options={city} placeholder="Chọn thành phố" listHeight={200}/>
                        </Form.Item>
                    </Col>
                    <Col xxl={15} xl={15} lg={15}>
                        <Form.Item name="title">
                            <Input placeholder="Vị trí tuyển dụng..."/>
                        </Form.Item>
                    </Col>
                    <Col xxl={3} xl={3} lg={3}>
                        <Form.Item>
                            <Button type="primary" htmlType="submit">Tìm kiếm</Button>
                        </Form.Item>
                    </Col>
                </Row>
            </Form>
        </>
    );
}

export default SearchForm;