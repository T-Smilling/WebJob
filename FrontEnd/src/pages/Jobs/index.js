import { useEffect } from "react";
import { useParams, useLocation } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import AllJob from "../../components/Job";
import { checkSearch } from "../../actions/search";
import Search from "../Search";
import JobDetail from "./JobDetail";

function Job() {
    const { id } = useParams();
    const location = useLocation();
    const dispatch = useDispatch();
    const isSearch = useSelector((state) => state.searchReducer);

    useEffect(() => {
        console.log("location.pathname:", location.pathname);
        console.log("isSearch:", isSearch);
        if (location.pathname === "/jobs/search") {
            dispatch(checkSearch(true));
        } else {
            dispatch(checkSearch(false));
        }
    }, [location.pathname, id, dispatch]);

    return (
        <>
            {id ? (
                <JobDetail />
            ) : isSearch ? (
                <Search />
            ) : (
                <AllJob />
            )}
        </>
    );
}

export default Job;