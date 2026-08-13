// import logo from './logo.svg'
import "./App.scss";
import './App.css';
import React from 'react';
import { BrowserRouter as Router, Route, Routes, useLocation } from "react-router-dom";
import Header from './partials/Header';
import Aside from './partials/Aside';
import Main from './partials/Main';
import Settings from "./components/Settings";
import Account from "./components/Account";
import CartDrawer from "./components/CartDrawer";
import SignIn from "./components/SignIn";
import SignUp from "./components/SignUp";
import SignOut from "./components/SignOut";
import ProtectedRoute from "./components/ProtectedRoute";
import { ThemeProvider } from "./context/ThemeContext";
import { PanelProvider, usePanel } from "./context/PanelContext";
import { AsideLayoutProvider, useAsideLayout } from "./context/AsideLayoutContext";
//








function App() {
    return (
        <ThemeProvider>
            <Router>
                <PanelProvider>
                    <AsideLayoutProvider>
                        <PageWrapper />
                    </AsideLayoutProvider>
                </PanelProvider>
            </Router>
        </ThemeProvider>
    );
}

const PageWrapper = () => {
    const location = useLocation();
    const { activePanel, closePanel } = usePanel();
    const { asideCollapsed } = useAsideLayout();

    // Список путей, где не отображаются общие компоненты
    const noCommonComponentsPaths = ["/management/signin", "/management/signup", "/management/signout"];
    const isSpecialPage = noCommonComponentsPaths.includes(location.pathname);

    const pageWrapperClass = `page-wrapper${asideCollapsed ? " page-wrapper--aside-collapsed" : ""}`;

    return (
        <div className={pageWrapperClass}>
            {activePanel && !isSpecialPage ? (
                <button
                    type="button"
                    className="lab-panel-backdrop"
                    aria-label="Close panel"
                    onClick={closePanel}
                />
            ) : null}
            {/* Показываем общие компоненты, если это не специальная страница */}
            {!isSpecialPage && (
                <>
                    <Header />
                    <Aside />
                    <Settings />
                    <Account />
                    <CartDrawer />
                </>
            )}

            {/* Основной контент */}
            <Routes>
                {/* Специальные страницы */}
                <Route path="/management/signin" element={<SignIn />} />
                <Route path="/management/signup" element={<SignUp />} />
                <Route path="/management/signout" element={<SignOut />} /> 

                {/* Все остальные страницы — только для авторизованных */}
                <Route
                    path="*"
                    element={
                        <ProtectedRoute>
                            <Main />
                        </ProtectedRoute>
                    }
                />
            </Routes>
        </div>
    );
};

export default App;
