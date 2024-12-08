// import logo from './logo.svg'
import "./App.scss"
import './App.css';
import React from 'react';
import ChemElementList from './components/ChemElementList';
import Home from "./pages/Home";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
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








function App() {
    return (

        <Router>
            <div className="page-wrapper">
                <Header />
                <Aside />
                <Settings />
                <Account />
                <CartOffcanvas />
                <Main />

            </div>
        </Router>


    );
}

export default App;
