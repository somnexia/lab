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

                        <Route path="warehouses" element={<WarehouseList />} />
                        <Route path="storage-units" element={<StorageUnitList />} />
                        <Route path="ladder" element={<StorageUnitC />} />
                        <Route path="dropdown" element={< DropdownHierarchy />} />
                    </Route>
                    <Route path="/inventory">

                        <Route path="location" element={<ParentStorageUnits />} />

                    </Route>

                    <Route path="/equipment" element={<Equipment />}>
                        <Route path="table/:category" element={<EquipmentTable />} />
                    </Route>

                    <Route path="/customer">
                        <Route path="cart" element={<Cart/>} />
                    </Route>
                    



                    {/* Любой другой маршрут */}


                </Routes>
                <Footer />

            </div>
        </main>
    );
};

export default Main;
