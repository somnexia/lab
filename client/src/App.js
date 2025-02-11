// import logo from './logo.svg'
import "./App.scss"
import './App.css';
import React from 'react';
import ChemElementList from './components/ChemElementList';
import Home from "./pages/Home";
import { BrowserRouter as Router, Route, Routes, useLocation } from "react-router-dom";
import Header from './partials/Header';
import Footer from './partials/Footer';
import Aside from './partials/Aside';
import Main from './partials/Main';
import Settings from "./components/Settings";
import Account from "./components/Account";
import StorageUnitList from "./components/StorageUnitС";
import Inventory from "./pages/Inventory";
import StorageUnit from "./components/StorageUnit";
import CartOffcanvas from "./components/CartOffcanvas";
import SignIn from "./components/SignIn";
import SignUp from "./components/SignUp";
import SignOut from "./components/SignOut";
import { ThemeProvider } from "./context/ThemeContext";









function App() {
    return (
        <ThemeProvider>
            <Router>
                <PageWrapper />
            </Router>
        </ThemeProvider>
    );
}

const PageWrapper = () => {
    const location = useLocation();

    // Список путей, где не отображаются общие компоненты
    const noCommonComponentsPaths = ["/management/signin", "/management/signup", "/management/signout"];
    const isSpecialPage = noCommonComponentsPaths.includes(location.pathname);

    return (
        <div className="page-wrapper">
            {/* Показываем общие компоненты, если это не специальная страница */}
            {!isSpecialPage && (
                <>
                    <Header />
                    <Aside />
                    <Settings />
                    <Account />
                    <CartOffcanvas />
                </>
            )}

            {/* Основной контент */}
            <Routes>
                {/* Специальные страницы */}
                <Route path="/management/signin" element={<SignIn />} />
                <Route path="/management/signup" element={<SignUp />} />
                <Route path="/management/signout" element={<SignOut />} /> 

                {/* Все остальные страницы */}
                <Route path="*" element={<Main />} />
            </Routes>
        </div>
    );
};

export default App;
