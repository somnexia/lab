import React from "react";
import { Routes, Route, Navigate } from "react-router-dom";

import DashboardPage from "../pages/DashboardPage";
import StorageLocations from "../pages/StorageLocations";
import Equipment from "../pages/Equipment";
import Projects from "../pages/Projects";

import WarehouseList from "../components/WarehouseList";
import StorageTree from "../components/StorageTree";
import StorageUnitList from "../components/StorageUnitList";
import DropdownHierarchy from "../components/DropdownHierarchy";
import ParentStorageUnits from "../components/ParentStorageUnits";
import Cart from "../components/Cart";
import InventoryStockOverview from "../components/InventoryStockOverview";
import ReagentCatalogPage from "../pages/ReagentCatalogPage";
import Profile from "../components/Profile";
import ResearchList from "../components/ResearchList";
import AddResearch from "../components/AddResearch";
import ParticipantList from "../components/ParticipantList";
import MembersTeamsPlaceholder from "../pages/MembersTeamsPlaceholder";
import ResearchTeamsPage from "../pages/ResearchTeamsPage";
import AdminLogsPage from "../components/AdminLogsPage";
import TaskList from "../components/TaskList";
import TaskCreate from "../components/TaskCreate";
import StorageLocationsOverview from "../pages/StorageLocationsOverview";
import InventoryLotsPage from "../pages/InventoryLotsPage";
import RegisterInventoryLotPage from "../pages/RegisterInventoryLotPage";
import LabEquipmentPlaceholder from "../pages/LabEquipmentPlaceholder";
import InventoryMaterialsPlaceholder from "../pages/InventoryMaterialsPlaceholder";

const LEGACY_STORAGE_INVENTORY_PATHS = ["warehouses", "storage-units", "ladder", "dropdown", "location"];

/**
 * Все маршруты основного layout (Header + Aside + Main).
 */
const MainAppRoutes = () => (
    <Routes>
        <Route path="/" element={<DashboardPage />} />

        {/* ---------- Materials inventory (what) ---------- */}
        <Route path="/inventory" element={<Navigate to="/inventory/overview" replace />} />
        <Route path="/inventory/overview" element={<InventoryStockOverview />} />
        <Route path="/inventory/list" element={<Navigate to="/inventory/lots" replace />} />
        <Route path="/inventory/lots" element={<InventoryLotsPage />} />
        <Route path="/inventory/lots/register" element={<RegisterInventoryLotPage />} />
        <Route path="/inventory/chemicals" element={<ReagentCatalogPage />} />
        <Route path="/inventory/samples-specimens" element={<InventoryMaterialsPlaceholder />} />
        <Route path="/inventory/consumables" element={<InventoryMaterialsPlaceholder />} />
        <Route path="/inventory/labware" element={<InventoryMaterialsPlaceholder />} />
        {LEGACY_STORAGE_INVENTORY_PATHS.map((segment) => (
            <Route
                key={segment}
                path={`/inventory/${segment}`}
                element={<Navigate to={`/storage-locations/${segment}`} replace />}
            />
        ))}

        {/* ---------- Storage & locations (where) ---------- */}
        <Route path="/storage-locations" element={<StorageLocations />}>
            <Route index element={<Navigate to="overview" replace />} />
            <Route path="overview" element={<StorageLocationsOverview />} />
            <Route path="warehouses" element={<WarehouseList />} />
            <Route path="storage-units" element={<StorageUnitList />} />
            <Route path="ladder" element={<StorageTree />} />
            <Route path="dropdown" element={<DropdownHierarchy />} />
            <Route path="location" element={<ParentStorageUnits />} />
        </Route>

        {/* ---------- Projects ---------- */}
        <Route path="/projects" element={<Projects />} />
        <Route path="/projects/overview" element={<Navigate to="/projects" replace />} />
        <Route path="/projects/research-list" element={<ResearchList />} />
        <Route path="/projects/research-create" element={<AddResearch />} />
        <Route path="/projects/task-list" element={<TaskList />} />
        <Route path="/projects/task-create" element={<TaskCreate />} />
        <Route path="/projects/tasks" element={<Navigate to="/projects/task-list" replace />} />

        {/* ---------- Laboratory equipment ---------- */}
        <Route path="/equipment" element={<Navigate to="/lab-equipment" replace />} />
        <Route path="/lab-equipment" element={<Equipment />} />
        <Route path="/lab-equipment/maintenance" element={<LabEquipmentPlaceholder />} />
        <Route path="/lab-equipment/calibration" element={<LabEquipmentPlaceholder />} />
        <Route path="/lab-equipment/reservations" element={<LabEquipmentPlaceholder />} />
        <Route path="/lab-equipment/usage-tracking" element={<LabEquipmentPlaceholder />} />

        {/* ---------- Customer ---------- */}
        <Route path="/customer/cart" element={<Cart />} />
        <Route path="/customer/profile" element={<Profile />} />

        {/* ---------- Members & Teams ---------- */}
        <Route path="/members-teams" element={<Navigate to="/members-teams/members" replace />} />
        <Route path="/members-teams/participants" element={<Navigate to="/members-teams/members" replace />} />
        <Route path="/members-teams/members" element={<ParticipantList />} />
        <Route path="/members-teams/research-teams" element={<ResearchTeamsPage />} />
        <Route path="/members-teams/assignments" element={<MembersTeamsPlaceholder />} />
        <Route path="/members-teams/roles" element={<MembersTeamsPlaceholder />} />
        <Route path="/members-teams/activity-log" element={<MembersTeamsPlaceholder />} />
        <Route path="/members-teams/invitations" element={<MembersTeamsPlaceholder />} />

        {/* ---------- Management ---------- */}
        <Route path="/management/userlog" element={<AdminLogsPage />} />
    </Routes>
);

export default MainAppRoutes;
