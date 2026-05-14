import React from "react";
import Breadcrumb from "../components/Breadcrumb";
import Footer from "./Footer";
import MainAppRoutes from "../routes/MainAppRoutes";

const Main = () => {
    return (
        <main>
            <div className="content">
                <Breadcrumb />
                <MainAppRoutes />
                <Footer />
            </div>
        </main>
    );
};

export default Main;
