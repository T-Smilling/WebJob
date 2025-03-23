import Header from "./HeaderLayout";
import Footer from "./FooterLayout";
import Main from "./Main";

function LayoutDefault(){
    return(
        <>
            <div className="layout-default">
                <Header/>
                <Main/>
                <Footer/>
            </div>  
        </>
    )
}

export default LayoutDefault;