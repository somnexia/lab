import React from "react";
import { Routes, Route } from "react-router-dom";
import Home from "../pages/Home";
import Inventory from "../pages/Inventory";
import WarehouseList from "../components/WarehouseList";
import Breadcrumb from "../components/Breadcrumb";
import StorageUnitC from "../components/StorageUnitС";
import StorageUnitList from "../components/StorageUnitList";
import StorageUnit from "../components/StorageUnit";
import DropdownHierarchy from "../components/DropdownHierarchy";
import ParentStorageUnits from "../components/ParentStorageUnits";
import Footer from "./Footer";
import EquipmentCategory from "../components/EquipmentCategory";
import Equipment from "../pages/Equipment";
import EquipmentTable from "../components/EquipmentTable";
import Cart from "../components/Cart";
import InventoryOverview from "../components/InventoryOverview";
import Profile from "../components/Profile";
import ResearchList from "../components/ResearchList";
import AddResearch from "../components/AddResearch";
import ParticipantList from "../components/ParticipantList";

const Main = () => {
    return (
        <main>
            <div className="content">
                <Breadcrumb />
                <Routes>

                    {/* Главная страница */}
                    <Route path="/" element={<Home />} />

                    {/* Инвентарь с вложенными маршрутами */}
                    <Route path="/inventory" element={<Inventory />}>
                        <Route path="overview" element={<InventoryOverview />} />
                        <Route path="warehouses" element={<WarehouseList />} />
                        <Route path="storage-units" element={<StorageUnitList />} />
                        <Route path="ladder" element={<StorageUnitC />} />
                        <Route path="dropdown" element={< DropdownHierarchy />} />
                        <Route path="location" element={<ParentStorageUnits />} />
                    </Route>



                    <Route path="/equipment" element={<Equipment />}>
                        <Route path="table/:category" element={<EquipmentTable />} />
                    </Route>

                    <Route path="/customer">
                        <Route path="cart" element={<Cart />} />
                        <Route path="profile" element={<Profile />} />

                    </Route>
                    <Route path="/teams/participants" element={<ParticipantList />} />
                    
                    <Route path="projects/research-list" element={<ResearchList />} />
                    <Route path="projects/research-create" element={<AddResearch />} />


                </Routes>
                <Footer />

            </div>
        </main>
    );
};

export default Main;
