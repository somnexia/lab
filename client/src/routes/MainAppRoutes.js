import React from "react";
import { Routes, Route, Navigate } from "react-router-dom";

import DashboardPage from "../pages/DashboardPage";
import Inventory from "../pages/Inventory";
import Equipment from "../pages/Equipment";
import Projects from "../pages/Projects";

import WarehouseList from "../components/WarehouseList";
import StorageTree from "../components/StorageTree";
import StorageUnitList from "../components/StorageUnitList";
import DropdownHierarchy from "../components/DropdownHierarchy";
import ParentStorageUnits from "../components/ParentStorageUnits";
import Cart from "../components/Cart";
import InventoryOverview from "../components/InventoryOverview";
import Profile from "../components/Profile";
import ResearchList from "../components/ResearchList";
import AddResearch from "../components/AddResearch";
import ParticipantList from "../components/ParticipantList";
import AdminLogsPage from "../components/AdminLogsPage";
import TaskList from "../components/TaskList";
import TaskCreate from "../components/TaskCreate";

/**
 * Все маршруты основного layout (Header + Aside + Main).
 * Порядок: домашний дашборд → инвентарь → проекты → оборудование → клиент → команды → админка.
 * Вложенные пути только там, где родитель рендерит <Outlet /> (сейчас — Inventory).
 */
const MainAppRoutes = () => (
    <Routes>
        {/* ---------- Главная: дашборд ---------- */}
        <Route path="/" element={<DashboardPage />} />

        {/* ---------- Инвентарь ---------- */}
        <Route path="/inventory" element={<Inventory />}>
            <Route index element={<InventoryOverview />} />
            <Route path="overview" element={<InventoryOverview />} />
            <Route path="list" element={<InventoryOverview fullPage />} />
            <Route path="warehouses" element={<WarehouseList />} />
            <Route path="storage-units" element={<StorageUnitList />} />
            <Route path="ladder" element={<StorageTree />} />
            <Route path="dropdown" element={<DropdownHierarchy />} />
            <Route path="location" element={<ParentStorageUnits />} />
        </Route>

        {/* ---------- Проекты, исследования, задачи ---------- */}
        <Route path="/projects" element={<Projects />} />
        <Route path="/projects/overview" element={<Navigate to="/projects" replace />} />
        <Route path="/projects/research-list" element={<ResearchList />} />
        <Route path="/projects/research-create" element={<AddResearch />} />
        <Route path="/projects/task-list" element={<TaskList />} />
        <Route path="/projects/task-create" element={<TaskCreate />} />
        <Route path="/projects/tasks" element={<Navigate to="/projects/task-list" replace />} />

        {/* ---------- Оборудование ---------- */}
        <Route path="/equipment" element={<Equipment />} />

        {/* ---------- Клиент (корзина, профиль) ---------- */}
        <Route path="/customer/cart" element={<Cart />} />
        <Route path="/customer/profile" element={<Profile />} />

        {/* ---------- Команды ---------- */}
        <Route path="/teams/participants" element={<ParticipantList />} />

        {/* ---------- Администрирование ---------- */}
        <Route path="/management/userlog" element={<AdminLogsPage />} />
    </Routes>
);

export default MainAppRoutes;
