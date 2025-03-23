import { useRoutes } from "react-router-dom";
import { routers } from "../../routers";

function AllRoute(){
    const element = useRoutes(routers);
    return element;
}

export default AllRoute;