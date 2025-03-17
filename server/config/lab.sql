-- phpMyAdmin SQL Dump
-- version 5.2.1
-- https://www.phpmyadmin.net/
--
-- Хост: 127.0.0.1
-- Время создания: Мар 17 2025 г., 14:16
-- Версия сервера: 10.4.32-MariaDB
-- Версия PHP: 8.1.25

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
START TRANSACTION;
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

--
-- База данных: `lab`
--

-- --------------------------------------------------------

--
-- Структура таблицы `carts`
--

CREATE TABLE `carts` (
  `id` int(11) NOT NULL,
  `user_id` int(11) NOT NULL,
  `item_id` int(11) NOT NULL,
  `item_name` varchar(255) NOT NULL,
  `substance_amount` float DEFAULT NULL,
  `unit_measure` varchar(255) DEFAULT NULL,
  `supplier` varchar(255) DEFAULT NULL,
  `status` enum('available','in use','reserved','unavailable') NOT NULL DEFAULT 'available',
  `quantity` int(11) NOT NULL DEFAULT 1,
  `createdAt` datetime NOT NULL,
  `updatedAt` datetime NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- Структура таблицы `chemcompounds`
--

CREATE TABLE `chemcompounds` (
  `id` int(11) NOT NULL,
  `cas_id` varchar(50) NOT NULL,
  `parent_id` int(11) DEFAULT NULL,
  `name` varchar(50) NOT NULL,
  `formula` varchar(50) NOT NULL,
  `molecular_weight` decimal(10,4) DEFAULT NULL,
  `description` text DEFAULT NULL,
  `aggregate_state` varchar(50) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Дамп данных таблицы `chemcompounds`
--

INSERT INTO `chemcompounds` (`id`, `cas_id`, `parent_id`, `name`, `formula`, `molecular_weight`, `description`, `aggregate_state`) VALUES
(1, '7732-18-5', NULL, 'Water', 'H2O', 18.0150, 'Water is a transparent, tasteless, odorless, and nearly colorless chemical substance, which is the main constituent of Earth\'s streams, lakes, and oceans.', 'liquid'),
(2, '124-38-9', NULL, 'Carbon Dioxide', 'CO2', 44.0100, 'Carbon dioxide is a colorless gas with a density about 60% higher than that of dry air.', 'gas'),
(3, '7647-14-5', NULL, 'Sodium Chloride', 'NaCl', 58.4400, 'Sodium chloride, commonly known as salt, is an ionic compound with the chemical formula NaCl, representing a 1:1 ratio of sodium and chloride ions.', 'solid'),
(4, '7664-41-7', NULL, 'Ammonia', 'NH3', 17.0310, 'Ammonia is a compound of nitrogen and hydrogen with the formula NH3.', 'gas'),
(5, '630-08-0', NULL, 'Carbon Monoxide', 'CO', 28.0100, 'Carbon monoxide is a colorless, odorless, and tasteless gas that is slightly less dense than air.', 'gas'),
(6, '67-56-1', NULL, 'Methanol', 'CH3OH', 32.0400, 'Methanol, also known as methyl alcohol amongst other names, is a chemical with the formula CH3OH.', 'liquid'),
(7, '64-19-7', NULL, 'Acetic Acid', 'CH3COOH', 60.0520, 'Acetic acid, systematically named ethanoic acid, is a colorless liquid organic compound with the chemical formula CH3COOH.', 'liquid'),
(8, '50-99-7', NULL, 'Glucose', 'C6H12O6', 180.1560, 'Glucose is a simple sugar with the molecular formula C6H12O6.', 'solid'),
(9, '7647-01-0', NULL, 'Hydrochloric Acid', 'HCl', 36.4610, 'Hydrochloric acid is a colorless inorganic chemical system with the formula HCl', 'liquid'),
(10, '64-17-5', NULL, 'Ethanol', 'C2H6O', 46.0700, 'Ethanol, also called ethyl alcohol, grain alcohol, or alcohol, is a chemical compound', 'liquid'),
(11, '7664-93-9', NULL, 'Sulfuric Acid', 'H2SO4', 98.0790, 'Sulfuric acid is a strong mineral acid with the molecular formula H2SO4', 'liquid'),
(12, '7697-37-2', NULL, 'Nitric Acid', 'HNO3', 63.0120, 'Nitric acid is a mineral acid also known as aqua fortis and spirit of niter.', 'liquid'),
(13, '67-64-1', NULL, 'Acetone', 'C3H6O', 58.0800, 'Acetone is a colorless, volatile, flammable liquid used as a solvent and in nail polish removers.', 'liquid'),
(14, '1336-21-6', NULL, 'Ammonium Hydroxide', 'NH4OH', 35.0500, 'Ammonium hydroxide, also known as ammonia water, ammonia solution, or aqueous ammonia.', 'liquid'),
(15, '7664-38-2', NULL, 'Phosphoric Acid', 'H3PO4', 97.9940, 'Phosphoric acid is a weak acid with the chemical formula H3PO4.', 'liquid'),
(16, '107-21-1', NULL, 'Ethylene Glycol', 'C2H6O2', 62.0700, 'Ethylene glycol is an organic compound with the formula (CH2OH)2.', 'liquid');

-- --------------------------------------------------------

--
-- Структура таблицы `chemelements`
--

CREATE TABLE `chemelements` (
  `id` int(11) NOT NULL,
  `cas_id` varchar(50) NOT NULL,
  `parent_id` int(11) DEFAULT NULL,
  `symbol` varchar(2) NOT NULL,
  `name` varchar(50) NOT NULL,
  `atomic_number` int(11) NOT NULL,
  `atomic_weight` decimal(10,4) DEFAULT NULL,
  `chemical_group` varchar(50) NOT NULL,
  `aggregate_state` varchar(100) DEFAULT NULL,
  `description` text DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Дамп данных таблицы `chemelements`
--

INSERT INTO `chemelements` (`id`, `cas_id`, `parent_id`, `symbol`, `name`, `atomic_number`, `atomic_weight`, `chemical_group`, `aggregate_state`, `description`) VALUES
(1, '1333-74-0', NULL, 'H', 'Hydrogen', 1, 1.0080, 'Nonmetal', 'Gas', 'Hydrogen is a chemical element with symbol H and atomic number 1. It is the lightest element in the periodic table.'),
(2, '7440-59-7', NULL, 'He', 'Helium', 2, 4.0026, 'Noble gas', 'Gas', 'Helium is a chemical element with symbol He and atomic number 2. It is a colorless, odorless, tasteless, non-toxic, inert, monatomic gas.'),
(3, '7439-93-2', NULL, 'Li', 'Lithium', 3, 6.9400, 'Alkali metal', 'Solid', 'Lithium is a chemical element with symbol Li and atomic number 3. It is a soft, silvery-white alkali metal.'),
(4, '7440-41-7', NULL, 'Be', 'Beryllium', 4, 9.0122, 'Alkaline earth metal', 'Solid', 'Beryllium is a chemical element with symbol Be and atomic number 4. It is a relatively rare element in the universe, usually occurring as a product of the spallation of larger atomic nuclei.'),
(5, '7440-42-8', NULL, 'B', 'Boron', 5, 10.8100, 'Metalloid', 'Solid', 'Boron is a chemical element with symbol B and atomic number 5. It is a low-abundance element in the Earth\'s crust and is primarily produced by the mining of borate minerals.'),
(6, '7440-44-0', NULL, 'C', 'Carbon', 6, 12.0110, 'Nonmetal', 'Solid', 'Carbon is a chemical element with symbol C and atomic number 6. It is nonmetallic and tetravalent—making four electrons available to form covalent chemical bonds.'),
(7, '7727-37-9', NULL, 'N', 'Nitrogen', 7, 14.0070, 'Nonmetal', 'Gas', 'Nitrogen is a chemical element with symbol N and atomic number 7. It is a nonmetal with properties that are intermediate between the elements above and below in the periodic table.'),
(8, '7782-44-7', NULL, 'O', 'Oxygen', 8, 15.9990, 'Nonmetal', 'Gas', 'Oxygen is a chemical element with symbol O and atomic number 8. It is a member of the chalcogen group in the periodic table, a highly reactive nonmetal, and an oxidizing agent that readily forms oxides with most elements.'),
(9, '7782-41-4', NULL, 'F', 'Fluorine', 9, 18.9980, 'Halogen', 'Gas', 'Fluorine is a chemical element with symbol F and atomic number 9. It is the lightest halogen and exists as a highly toxic pale yellow diatomic gas at standard conditions.'),
(10, '7440-01-9', NULL, 'Ne', 'Neon', 10, 20.1800, 'Noble gas', 'Gas', 'Neon is a chemical element with symbol Ne and atomic number 10.'),
(11, '7440-23-5', NULL, 'Na', 'Sodium', 11, 22.9900, 'Alkali metal', 'Solid', 'Sodium is a chemical element with symbol Na and atomic number 11.'),
(12, '7439-95-4', NULL, 'Mg', 'Magnesium', 12, 24.3050, 'Alkaline earth metal', 'Solid', 'Magnesium is a chemical element with symbol Mg and atomic number 12.'),
(13, '7429-90-5', NULL, 'Al', 'Aluminum', 13, 26.9820, 'Metal', 'Solid', 'Aluminum is a chemical element with symbol Al and atomic number 13.'),
(14, '7440-21-3', NULL, 'Si', 'Silicon', 14, 28.0855, 'Metalloid', 'Solid', 'Silicon is a chemical element with symbol Si and atomic number 14.'),
(15, '7723-14-0', NULL, 'P', 'Phosphorus', 15, 30.9738, 'Nonmetal', 'Solid', 'Phosphorus is a chemical element with symbol P and atomic number 15.'),
(16, '7704-34-9', NULL, 'S', 'Sulfur', 16, 32.0650, 'Nonmetal', 'Solid', 'Sulfur is a chemical element with symbol S and atomic number 16.'),
(17, '7782-50-5', NULL, 'Cl', 'Chlorine', 17, 35.4530, 'Halogen', 'Gas', 'Chlorine is a chemical element with symbol Cl and atomic number 17.'),
(18, '7440-37-1', NULL, 'Ar', 'Argon', 18, 39.9480, 'Noble gas', 'Gas', 'Argon is a chemical element with symbol Ar and atomic number 18.'),
(19, '7440-09-7', NULL, 'K', 'Potassium', 19, 39.0983, 'Alkali metal', 'Solid', 'Potassium is a chemical element with symbol K and atomic number 19.'),
(20, '7440-70-2', NULL, 'Ca', 'Calcium', 20, 40.0780, 'Alkaline earth metal', 'Solid', 'Calcium is a chemical element with symbol Ca and atomic number 20.'),
(21, '7440-20-2', NULL, 'Sc', 'Scandium', 21, 44.9559, 'Transition metal', 'Solid', 'Scandium is a chemical element with symbol Sc and atomic number 21.'),
(22, '7440-32-6', NULL, 'Ti', 'Titanium', 22, 47.8670, 'Transition metal', 'Solid', 'Titanium is a chemical element with symbol Ti and atomic number 22.'),
(23, '7440-62-2', NULL, 'V', 'Vanadium', 23, 50.9415, 'Transition metal', 'Solid', 'Vanadium is a chemical element with symbol V and atomic number 23.'),
(24, '7440-47-3', NULL, 'Cr', 'Chromium', 24, 51.9961, 'Transition metal', 'Solid', 'Chromium is a chemical element with symbol Cr and atomic number 24.');

-- --------------------------------------------------------

--
-- Структура таблицы `chemequipments`
--

CREATE TABLE `chemequipments` (
  `id` int(11) NOT NULL,
  `unique_id` varchar(50) NOT NULL,
  `parent_id` int(11) DEFAULT NULL,
  `name` varchar(50) NOT NULL,
  `description` text DEFAULT NULL,
  `manufacturer` varchar(50) DEFAULT NULL,
  `model` varchar(50) DEFAULT NULL,
  `material` varchar(50) DEFAULT NULL,
  `category` enum('general','specialized','measuring','analytical','testing') NOT NULL,
  `group` varchar(50) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Дамп данных таблицы `chemequipments`
--

INSERT INTO `chemequipments` (`id`, `unique_id`, `parent_id`, `name`, `description`, `manufacturer`, `model`, `material`, `category`, `group`) VALUES
(1, 'EQ0001', NULL, 'Beaker', 'Glass beaker for storage and transfer of liquid samples.', 'Glassware Co.', 'B-100', 'Glass', 'general', 'Laboratory Glassware'),
(2, 'EQ0002', NULL, 'Distillation Flask', 'Glass flask for conducting the distillation process.', 'GlassTech', 'DistilLab-500', 'Glass', 'general', 'Laboratory Glassware'),
(3, 'EQ0003', NULL, 'Chemical Funnel', 'Glass funnel for separating liquid phases and filtering solutions.', 'LabSupplies Ltd.', 'FunnelTech-200', 'Glass', 'general', 'Laboratory Glassware'),
(4, 'EQ0004', NULL, 'Flat-Bottom Flask', 'Glass flask with a flat bottom for conducting various chemical reactions.', 'GlassTech', 'FlatFlask-100', 'Glass', 'general', 'Laboratory Glassware'),
(5, 'EQ0005', NULL, 'Magnetic Stirrer', 'Laboratory device used to create a rotating magnetic field for stirring liquids.', 'LabTech Inc.', 'MagStir-3000', 'Metal', 'specialized', 'Stirring Equipment'),
(6, 'EQ0006', NULL, 'Burette', 'Glass tube with a valve at the bottom, used for precise dispensing of liquids.', 'Glassware Co.', 'Burette-200', 'Glass', 'measuring', 'Volumetric Instruments'),
(7, 'EQ0007', NULL, 'Desiccator', 'Airtight container used to store substances in a dry environment.', 'DryTech Solutions', 'DesiDry-400', 'Plastic', 'specialized', 'Storage Equipment'),
(8, 'EQ0008', NULL, 'Heating Mantle', 'Electrically heated device used to heat round-bottom flasks during chemical reactions.', 'HeaterTech Ltd.', 'HeatMantle-500', 'Metal', 'specialized', 'Heating Equipment'),
(9, 'EQ0009', NULL, 'Chemical Reactor', 'Professional chemical reactor for conducting various chemical reactions.', 'ABC Chemicals', 'RX-1000', 'Glass', 'specialized', 'Reaction Equipment'),
(10, 'EQ0010', NULL, 'Gas Scrubber', 'Device for removing gases and vapors from chemical reactors.', 'XYZ Lab Equipment', 'GH-500', 'Stainless Steel', 'analytical', 'Gas Analysis Equipment'),
(11, 'EQ0011', NULL, 'Chromatograph', 'Highly efficient chromatograph for analyzing components of mixtures.', 'LabTech Inc.', 'ChroMate-2000', 'Metal', 'analytical', 'Chromatography Equipment'),
(12, 'EQ0012', NULL, 'Spectrophotometer', 'Device for measuring the optical density of solutions in various spectral regions.', 'Sigma Analytical', 'SpecTec-300', 'Plastic', 'analytical', 'Spectroscopic Equipment');

-- --------------------------------------------------------

--
-- Структура таблицы `chemmixtures`
--

CREATE TABLE `chemmixtures` (
  `id` int(11) NOT NULL,
  `cas_id` varchar(50) NOT NULL,
  `parent_id` int(11) DEFAULT NULL,
  `name` varchar(255) NOT NULL,
  `composition` text NOT NULL,
  `physical_properties` text DEFAULT NULL,
  `chemical_properties` text DEFAULT NULL,
  `mixture_type` varchar(100) DEFAULT NULL,
  `aggregate_state` varchar(100) DEFAULT NULL,
  `description` text DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Дамп данных таблицы `chemmixtures`
--

INSERT INTO `chemmixtures` (`id`, `cas_id`, `parent_id`, `name`, `composition`, `physical_properties`, `chemical_properties`, `mixture_type`, `aggregate_state`, `description`) VALUES
(1, '7647-14-5', NULL, 'Water - Sodium Chloride Solution', 'Water, Sodium Chloride', 'Clear liquid', 'Salt dissolved in water', 'Homogeneous', 'Liquid', 'Used for medical and laboratory purposes.'),
(2, '50-99-7', NULL, 'Glucose Solution', 'Water, Glucose', 'Clear liquid', 'Sugar dissolved in water', 'Homogeneous', 'Liquid', 'Used as a solvent in various applications.'),
(3, '7647-14-5', NULL, 'Diluted Sodium Chloride Solution', 'Water, Sodium Chloride', 'Clear liquid', 'Higher concentration of salt in water', 'Homogeneous', 'Liquid', 'Used for medical purposes.'),
(4, '7664-41-7', NULL, 'Ammonia Solution', 'Water, Ammonia', 'Clear liquid with a pungent smell', 'Ammonia dissolved in water', 'Homogeneous', 'Liquid', 'Used in cleaning agents and as a solvent.'),
(5, '630-08-0', NULL, 'Carbon Monoxide', 'Carbon Monoxide', 'Gas', 'Toxic gas', 'Homogeneous', 'Gas', 'Used in various industrial processes.'),
(20, '107-21-1', NULL, 'Ethylene Glycol and Nitric Acid Mixture', 'Ethylene Glycol, Nitric Acid', 'Viscous liquid', 'Corrosive and toxic', 'Heterogeneous', 'Liquid', 'CAS-2: 7697-37-2. Used as antifreeze and in industrial applications.');

-- --------------------------------------------------------

--
-- Структура таблицы `chemstorages`
--

CREATE TABLE `chemstorages` (
  `id` int(11) NOT NULL,
  `storage_name` varchar(50) NOT NULL,
  `description` text DEFAULT NULL,
  `capacity` decimal(10,2) NOT NULL,
  `current_utilization` decimal(10,2) DEFAULT 0.00,
  `laboratory_id` int(11) NOT NULL,
  `storage_type` varchar(50) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Дамп данных таблицы `chemstorages`
--

INSERT INTO `chemstorages` (`id`, `storage_name`, `description`, `capacity`, `current_utilization`, `laboratory_id`, `storage_type`) VALUES
(1, 'ChemSafe A', 'Storage for chemical equipment and reagents.', 1000.00, 600.00, 1, 'Chemical Storage'),
(2, 'LabGuard B', 'Secure storage for laboratory equipment and chemical substances.', 1500.00, 850.00, 1, 'Biochemical Warehouse'),
(3, 'SecureChem C', 'Warehouse for storing chemical reagents and test tubes.', 2000.00, 1200.00, 1, 'Chemical Stockroom'),
(4, 'ChemStock D', 'Storage for laboratory equipment and chemical preparations.', 1800.00, 1000.00, 1, 'Analytical Storage');

-- --------------------------------------------------------

--
-- Структура таблицы `employees`
--

CREATE TABLE `employees` (
  `id` int(11) NOT NULL,
  `name` varchar(255) NOT NULL,
  `surname` varchar(255) NOT NULL,
  `position` varchar(255) DEFAULT NULL,
  `department` varchar(255) DEFAULT NULL,
  `specialization` varchar(255) DEFAULT NULL,
  `lab_id` int(11) DEFAULT NULL,
  `createdAt` datetime NOT NULL,
  `updatedAt` datetime NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Дамп данных таблицы `employees`
--

INSERT INTO `employees` (`id`, `name`, `surname`, `position`, `department`, `specialization`, `lab_id`, `createdAt`, `updatedAt`) VALUES
(1, 'John', 'Doe', 'Research Scientist', 'Chemistry', 'Organic Chemistry', 1, '2025-03-17 12:24:30', '2025-03-17 12:24:30'),
(2, 'Alice', 'Smith', 'Lab Technician', 'Biology', 'Microbiology', 2, '2025-03-17 12:24:30', '2025-03-17 12:24:30'),
(3, 'David', 'Johnson', 'Data Analyst', 'Physics', 'Astrophysics', 3, '2025-03-17 12:24:30', '2025-03-17 12:24:30'),
(4, 'Emily', 'Brown', 'Lab Assistant', 'Materials Science', 'Nanotechnology', 4, '2025-03-17 12:24:30', '2025-03-17 12:24:30'),
(5, 'Michael', 'Williams', 'Lab Manager', 'Chemistry', 'Analytical Chemistry', 1, '2025-03-17 12:24:30', '2025-03-17 12:24:30'),
(6, 'Sarah', 'Davis', 'Lab Assistant', 'Biology', 'Genetics', 2, '2025-03-17 12:24:30', '2025-03-17 12:24:30'),
(7, 'Christopher', 'Wilson', 'Data Scientist', 'Physics', 'Particle Physics', 3, '2025-03-17 12:24:30', '2025-03-17 12:24:30'),
(8, 'Jessica', 'Miller', 'Lab Technician', 'Materials Science', 'Metallurgy', 4, '2025-03-17 12:24:30', '2025-03-17 12:24:30');

-- --------------------------------------------------------

--
-- Структура таблицы `experimentexpenses`
--

CREATE TABLE `experimentexpenses` (
  `id` int(11) NOT NULL,
  `experiment_id` int(11) DEFAULT NULL,
  `orderdetails_id` int(11) DEFAULT NULL,
  `unique_id` varchar(50) DEFAULT NULL,
  `quantity_used` int(11) DEFAULT NULL,
  `unit_measure` varchar(10) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Дамп данных таблицы `experimentexpenses`
--

INSERT INTO `experimentexpenses` (`id`, `experiment_id`, `orderdetails_id`, `unique_id`, `quantity_used`, `unit_measure`) VALUES
(1, 1, 10, NULL, 60, 'ml'),
(2, 1, 10, NULL, 60, 'ml'),
(3, 1, 10, NULL, 80, 'ml');

-- --------------------------------------------------------

--
-- Структура таблицы `experimentresults`
--

CREATE TABLE `experimentresults` (
  `id` int(11) NOT NULL,
  `experiment_id` int(11) NOT NULL,
  `result_item_name` varchar(100) NOT NULL,
  `result_item_type` enum('element','compound','mixture','equipment') NOT NULL,
  `quantity` decimal(10,2) NOT NULL,
  `unit_measure` varchar(10) NOT NULL,
  `receipt_date` datetime DEFAULT NULL,
  `description` text DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Дамп данных таблицы `experimentresults`
--

INSERT INTO `experimentresults` (`id`, `experiment_id`, `result_item_name`, `result_item_type`, `quantity`, `unit_measure`, `receipt_date`, `description`) VALUES
(1, 1, 'Water', 'compound', 100.00, 'ml', '2024-06-03 00:00:00', 'Water is a transparent, tasteless, odorless, and nearly colorless chemical substance, which is the main constituent of Earth\'s streams, lakes, and oceans.'),
(2, 1, 'Salt', 'element', 20.00, 'g', '2024-06-03 00:00:00', 'Sodium chloride, commonly known as salt, is an ionic compound with the chemical formula NaCl, representing a 1:1 ratio of sodium and chloride ions.'),
(3, 2, 'Ethanol', 'compound', 60.00, 'ml', '2024-06-04 00:00:00', 'Ethanol, also called ethyl alcohol, grain alcohol, or alcohol, is a chemical compound.');

-- --------------------------------------------------------

--
-- Структура таблицы `experiments`
--

CREATE TABLE `experiments` (
  `id` int(11) NOT NULL,
  `research_id` int(11) DEFAULT NULL,
  `name` varchar(255) NOT NULL,
  `laboratory_id` int(11) DEFAULT NULL,
  `description` text DEFAULT NULL,
  `start_date` datetime DEFAULT NULL,
  `end_date` datetime DEFAULT NULL,
  `status` enum('Completed','Ongoing','Pending') NOT NULL DEFAULT 'Pending'
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Дамп данных таблицы `experiments`
--

INSERT INTO `experiments` (`id`, `research_id`, `name`, `laboratory_id`, `description`, `start_date`, `end_date`, `status`) VALUES
(1, 1, 'Hypertension Medication Trial', NULL, 'Testing the efficacy of a new hypertension medication', '2023-05-10 00:00:00', '2024-05-10 00:00:00', 'Ongoing'),
(2, 2, 'Urban Bird Migration Observation', NULL, 'Observing bird migration patterns in urban areas', '2023-03-15 00:00:00', '2023-08-15 00:00:00', 'Completed'),
(3, 1, 'Stock Market Prediction Model Development', NULL, 'Developing a mathematical model for predicting stock market trends', '2023-07-01 00:00:00', '2024-07-01 00:00:00', 'Pending');

-- --------------------------------------------------------

--
-- Структура таблицы `inventories`
--

CREATE TABLE `inventories` (
  `id` int(11) NOT NULL,
  `reference_id` int(11) NOT NULL COMMENT 'ID ссылки на запись в одной из связанных таблиц',
  `item_name` varchar(100) DEFAULT NULL,
  `item_type` enum('element','compound','mixture','equipment') DEFAULT NULL COMMENT 'Тип связанной записи("element","equipment","compound","mixture")',
  `total_quantity` int(11) DEFAULT NULL,
  `substance_amount` decimal(10,2) DEFAULT NULL,
  `unit_measure` varchar(50) DEFAULT NULL,
  `storage_id` int(11) NOT NULL,
  `receipt_date` datetime DEFAULT current_timestamp(),
  `expiration_date` datetime DEFAULT NULL,
  `supplier` varchar(255) DEFAULT NULL,
  `last_updated` datetime NOT NULL DEFAULT current_timestamp(),
  `status` enum('available','reserved','in use','out of stock') DEFAULT 'out of stock',
  `description` text DEFAULT NULL,
  `safety_info` text DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Дамп данных таблицы `inventories`
--

INSERT INTO `inventories` (`id`, `reference_id`, `item_name`, `item_type`, `total_quantity`, `substance_amount`, `unit_measure`, `storage_id`, `receipt_date`, `expiration_date`, `supplier`, `last_updated`, `status`, `description`, `safety_info`) VALUES
(1, 1, 'Beaker', 'equipment', 10, NULL, NULL, 1, '2024-01-01 00:00:00', NULL, 'Glassware Co.', '2024-05-31 15:09:24', 'available', 'Glass beaker for storage and transfer of liquid samples.', 'Handle with care, fragile.'),
(2, 2, 'Distillation Flask', 'equipment', 5, NULL, NULL, 1, '2024-01-01 00:00:00', NULL, 'GlassTech', '2024-05-31 15:09:24', 'available', 'Glass flask for conducting the distillation process.', 'Handle with care, fragile.'),
(3, 3, 'Chemical Funnel', 'equipment', 20, NULL, NULL, 1, '2024-01-01 00:00:00', NULL, 'LabSupplies Ltd.', '2024-05-31 15:09:24', 'available', 'Glass funnel for separating liquid phases and filtering solutions.', 'Handle with care, fragile.'),
(4, 4, 'Flat-Bottom Flask', 'equipment', 15, NULL, NULL, 1, '2024-01-01 00:00:00', NULL, 'GlassTech', '2024-05-31 15:09:24', 'available', 'Glass flask with a flat bottom for conducting various chemical reactions.', 'Handle with care, fragile.'),
(5, 5, 'Magnetic Stirrer', 'equipment', 5, NULL, NULL, 1, '2024-01-01 00:00:00', NULL, 'LabTech Inc.', '2024-05-31 15:09:24', 'available', 'Laboratory device used to create a rotating magnetic field for stirring liquids.', 'Handle with care, electric equipment.'),
(6, 6, 'Burette', 'equipment', 12, NULL, NULL, 1, '2024-01-01 00:00:00', NULL, 'Glassware Co.', '2024-05-31 15:09:24', 'available', 'Glass tube with a valve at the bottom, used for precise dispensing of liquids.', 'Handle with care, fragile.'),
(7, 7, 'Desiccator', 'equipment', 8, NULL, NULL, 1, '2024-01-01 00:00:00', NULL, 'DryTech Solutions', '2024-05-31 15:09:24', 'available', 'Airtight container used to store substances in a dry environment.', 'Handle with care, fragile.'),
(8, 8, 'Heating Mantle', 'equipment', 3, NULL, NULL, 1, '2024-01-01 00:00:00', NULL, 'HeaterTech Ltd.', '2024-05-31 15:09:24', 'available', 'Electrically heated device used to heat round-bottom flasks during chemical reactions.', 'Handle with care, electric equipment.'),
(9, 9, 'Chemical Reactor', 'equipment', 2, NULL, NULL, 1, '2024-01-01 00:00:00', NULL, 'ABC Chemicals', '2024-05-31 15:09:24', 'available', 'Professional chemical reactor for conducting various chemical reactions.', 'Handle with care, fragile.'),
(10, 10, 'Gas Scrubber', 'equipment', 2, NULL, NULL, 1, '2024-01-01 00:00:00', NULL, 'XYZ Lab Equipment', '2024-05-31 15:09:24', 'available', 'Device for removing gases and vapors from chemical reactors.', 'Handle with care, chemical equipment.'),
(11, 11, 'Chromatograph', 'equipment', 1, NULL, NULL, 1, '2024-01-01 00:00:00', NULL, 'LabTech Inc.', '2024-05-31 15:09:24', 'available', 'Highly efficient chromatograph for analyzing components of mixtures.', 'Handle with care, precision equipment.'),
(12, 12, 'Spectrophotometer', 'equipment', 1, NULL, NULL, 1, '2024-01-01 00:00:00', NULL, 'Sigma Analytical', '2024-05-31 15:09:24', 'available', 'Device for measuring the optical density of solutions in various spectral regions.', 'Handle with care, precision equipment.'),
(13, 5, 'Boron', 'element', 1, 1000.00, 'g', 1, '2024-01-01 00:00:00', '2026-01-01 00:00:00', 'Chemical Supplier Inc.', '2024-05-31 15:09:24', 'available', 'Boron is a chemical element with symbol B and atomic number 5. It is a low-abundance element in the Earth\'s crust and is primarily produced by the mining of borate minerals.', 'Handle with care, avoid contact with skin.'),
(14, 9, 'Fluorine', 'element', 100, 100.00, 'mg', 1, '2024-01-01 00:00:00', '2025-01-01 00:00:00', 'Chemical Co.', '2024-05-31 15:09:24', 'available', 'Fluorine is a chemical element with symbol F and atomic number 9. It is the lightest halogen and exists as a highly toxic pale yellow diatomic gas at standard conditions.', 'Highly reactive, handle with caution.'),
(15, 0, 'Calcium', 'element', 500, 500.00, 'mg', 1, '2024-01-01 00:00:00', '2026-01-01 00:00:00', 'Chemical Products Ltd.', '2024-05-31 15:09:24', 'available', 'Calcium is a chemical element with symbol Ca and atomic number 20. It is an essential constituent of the bones and teeth and is the most abundant mineral in the human body.', 'Store in a cool, dry place.'),
(16, 5, 'Manganese', 'element', 50, 50.00, 'mg', 1, '2024-01-01 00:00:00', '2025-01-01 00:00:00', 'Chemical Supplier Inc.', '2024-05-31 15:09:24', 'available', 'Manganese is a chemical element with symbol Mn and atomic number 25. It is essential to iron and steel production by virtue of its sulfur-fixing, deoxidizing, and alloying properties.', 'Wear gloves when handling.'),
(17, 1, 'Hydrogen', 'element', 25, 50.00, 'L', 1, '2024-01-01 00:00:00', '2025-01-01 00:00:00', 'Gas Supplier', '2024-05-31 15:09:24', 'available', 'Hydrogen is a chemical element with symbol H and atomic number 1. It is the lightest element and the most abundant chemical substance in the universe.', 'Highly flammable, store away from heat sources.'),
(18, 2, 'Helium', 'element', 15, 30.00, 'L', 1, '2024-01-01 00:00:00', '2025-01-01 00:00:00', 'Gas Supplier Inc.', '2024-05-31 15:09:24', 'available', 'Helium is a chemical element with symbol He and atomic number 2. It is a colorless, odorless, tasteless, non-toxic, inert, monatomic gas.', 'Inert gas, non-flammable.'),
(19, 3, 'Lithium', 'element', 3, 6.00, 'kg', 1, '2024-01-01 00:00:00', '2026-01-01 00:00:00', 'Metal Supplier Inc.', '2024-05-31 15:09:24', 'available', 'Lithium is a chemical element with symbol Li and atomic number 3. It is a soft, silvery-white alkali metal.', 'Store in a cool, dry place.'),
(20, 4, 'Beryllium', 'element', NULL, 2.00, 'kg', 1, '2024-01-01 00:00:00', '2026-01-01 00:00:00', 'Metal Supplier Inc.', '2024-05-31 15:09:24', 'available', 'Beryllium is a chemical element with symbol Be and atomic number 4. It is a relatively rare element in the universe, usually occurring as a product of the spallation of larger atomic nuclei.', 'Toxic, handle with gloves.'),
(21, 1, 'Water - Sodium Chloride Solution', 'mixture', 10, 100.00, 'L', 1, '2024-01-01 00:00:00', '2024-12-31 00:00:00', 'Chemical Supplier Inc.', '2024-05-31 15:09:24', 'available', 'Water - Sodium Chloride Solution is used for medical and laboratory purposes.', 'Handle with care, avoid contact with skin.'),
(22, 2, 'Glucose Solution', 'mixture', 5, 200.00, 'ml', 1, '2024-01-01 00:00:00', '2024-12-31 00:00:00', 'Chemical Co.', '2024-06-03 18:22:30', 'available', 'Glucose Solution is used as a solvent in various applications.', 'Handle with caution.'),
(23, 3, 'Diluted Sodium Chloride Solution', 'mixture', 20, 150.00, 'L', 1, '2024-01-01 00:00:00', '2024-12-31 00:00:00', 'Chemical Supplier Inc.', '2024-05-31 15:09:24', 'available', 'Diluted Sodium Chloride Solution is used for medical purposes.', 'Handle with care, avoid contact with skin.'),
(24, 4, 'Ammonia Solution', 'mixture', 15, 180.00, 'L', 1, '2024-01-01 00:00:00', '2024-12-31 00:00:00', 'Chemical Products Ltd.', '2024-05-31 15:09:24', 'available', 'Ammonia Solution is used in cleaning agents and as a solvent.', 'Use in well-ventilated areas.'),
(25, 5, 'Carbon Monoxide', 'mixture', 1, 5.00, 'm3', 1, '2024-01-01 00:00:00', NULL, 'Gas Supplier', '2024-05-31 15:09:24', 'available', 'Carbon Monoxide is used in various industrial processes.', 'Toxic gas, handle with extreme caution.'),
(26, 6, 'Ethanol Solution', 'mixture', 8, 300.00, 'L', 1, '2024-01-01 00:00:00', '2024-12-31 00:00:00', 'Chemical Co.', '2024-05-31 15:09:24', 'available', 'Ethanol Solution is used in alcoholic beverages and as a solvent.', 'Flammable, store away from heat sources.'),
(27, 7, 'Acetic Acid Solution', 'mixture', 12, 250.00, 'L', 1, '2024-01-01 00:00:00', '2024-12-31 00:00:00', 'Chemical Products Ltd.', '2024-05-31 15:09:24', 'available', 'Acetic Acid Solution is used in cooking and cleaning products.', 'Corrosive, handle with gloves.'),
(28, 8, 'Carbon Dioxide Solution', 'mixture', 5, 80.00, 'L', 1, '2024-01-01 00:00:00', '2024-12-31 00:00:00', 'Gas Supplier', '2024-05-31 15:09:24', 'available', 'Carbon Dioxide Solution is used as a beverage.', 'Use in well-ventilated areas.'),
(29, 9, 'Phosphoric Acid Solution', 'mixture', 10, 120.00, 'L', 1, '2024-01-01 00:00:00', '2024-12-31 00:00:00', 'Chemical Co.', '2024-05-31 15:09:24', 'available', 'Phosphoric Acid Solution is used in food and beverage industries.', 'Corrosive, handle with gloves.'),
(31, 1, 'Nitric Acid Solution', 'mixture', 8, 200.00, 'L', 1, '2024-01-01 00:00:00', '2024-12-31 00:00:00', 'Chemical Co.', '2024-05-31 12:09:24', 'available', 'Nitric Acid Solution is used in the production of fertilizers and explosives.', 'Corrosive, handle with gloves and eye protection.'),
(32, 1, 'Water', 'compound', 50, 50.00, 'L', 1, '2024-05-31 00:00:00', NULL, 'Chemical Co.', '2024-05-31 12:09:24', 'available', 'Water is a transparent, tasteless, odorless, and nearly colorless chemical substance, which is the main constituent of Earth\'s streams, lakes, and oceans.', 'Handle with care, avoid contact with skin.'),
(33, 2, 'Carbon Dioxide', 'compound', 30, 30.00, 'L', 1, '2024-05-31 00:00:00', NULL, 'Gas Supplier', '2024-05-31 12:09:24', 'available', 'Carbon dioxide is a colorless gas with a density about 60% higher than that of dry air.', 'Use in well-ventilated areas.'),
(34, 3, 'Sodium Chloride', 'compound', 40, 40.00, 'kg', 1, '2024-05-31 00:00:00', NULL, 'Chemical Products Ltd.', '2024-05-31 12:09:24', 'available', 'Sodium chloride, commonly known as salt, is an ionic compound with the chemical formula NaCl, representing a 1:1 ratio of sodium and chloride ions.', 'Store in a dry place.'),
(35, 4, 'Ammonia', 'compound', 20, 20.00, 'L', 1, '2024-05-31 00:00:00', NULL, 'Chemical Supplier Inc.', '2024-05-31 12:09:24', 'available', 'Ammonia is a compound of nitrogen and hydrogen with the formula NH3.', 'Use in well-ventilated areas.'),
(36, 5, 'Carbon Monoxide', 'compound', 5, 5.00, 'm3', 1, '2024-05-31 00:00:00', NULL, 'Gas Supplier', '2024-05-31 12:09:24', 'available', 'Carbon monoxide is a colorless, odorless, and tasteless gas that is slightly less dense than air.', 'Toxic gas, handle with extreme caution.'),
(37, 6, 'Methanol', 'compound', 25, 25.00, 'L', 1, '2024-05-31 00:00:00', NULL, 'Chemical Co.', '2024-05-31 12:09:24', 'available', 'Methanol, also known as methyl alcohol amongst other names, is a chemical with the formula CH3OH.', 'Flammable, store away from heat sources.'),
(38, 7, 'Acetic Acid', 'compound', 15, 15.00, 'L', 1, '2024-05-31 00:00:00', NULL, 'Chemical Products Ltd.', '2024-05-31 12:09:24', 'available', 'Acetic acid, systematically named ethanoic acid, is a colorless liquid organic compound with the chemical formula CH3COOH.', 'Corrosive, handle with gloves.'),
(39, 8, 'Glucose', 'compound', 60, 60.00, 'kg', 1, '2024-05-31 00:00:00', NULL, 'Chemical Co.', '2024-05-31 12:09:24', 'available', 'Glucose is a simple sugar with the molecular formula C6H12O6.', 'Store in a cool, dry place.'),
(40, 9, 'Hydrochloric Acid', 'compound', 10, 10.00, 'L', 1, '2024-05-31 00:00:00', NULL, 'Chemical Products Ltd.', '2024-05-31 12:09:24', 'available', 'Hydrochloric acid is a colorless inorganic chemical system with the formula HCl.', 'Corrosive, handle with gloves.'),
(41, 0, 'Ethanol', 'compound', 35, 35.00, 'L', 1, '2024-05-31 00:00:00', NULL, 'Chemical Co.', '2024-05-31 12:09:24', 'available', 'Ethanol, also called ethyl alcohol, grain alcohol, or alcohol, is a chemical compound.', 'Flammable, store away from heat sources.'),
(42, 1, 'Sulfuric Acid', 'compound', 8, 8.00, 'L', 1, '2024-05-31 00:00:00', NULL, 'Chemical Products Ltd.', '2024-05-31 12:09:24', 'available', 'Sulfuric acid is a strong mineral acid with the molecular formula H2SO4.', 'Corrosive, handle with gloves and eye protection.'),
(43, 2, 'Nitric Acid', 'compound', 12, 12.00, 'L', 1, '2024-05-31 00:00:00', NULL, 'Chemical Co.', '2024-05-31 12:09:24', 'available', 'Nitric acid is a mineral acid also known as aqua fortis and spirit of niter.', 'Corrosive, handle with gloves and eye protection.'),
(44, 3, 'Acetone', 'compound', 30, 30.00, 'L', 1, '2024-05-31 00:00:00', NULL, 'Chemical Supplier Inc.', '2024-05-31 12:09:24', 'available', 'Acetone is a colorless, volatile, flammable liquid used as a solvent and in nail polish removers.', 'Flammable, store in a cool, well-ventilated place.'),
(45, 4, 'Ammonium Hydroxide', 'compound', 20, 20.00, 'L', 1, '2024-05-31 00:00:00', NULL, 'Chemical Co.', '2024-05-31 12:09:24', 'available', 'Ammonium hydroxide, also known as ammonia water, ammonia solution, or aqueous ammonia.', 'Basic solution, handle with care.'),
(46, 5, 'Phosphoric Acid', 'compound', 10, 10.00, 'L', 1, '2024-05-31 00:00:00', NULL, 'Chemical Products Ltd.', '2024-05-31 12:09:24', 'available', 'Phosphoric acid is a weak acid with the chemical formula H3PO4.', 'Corrosive, handle with gloves.');

-- --------------------------------------------------------

--
-- Структура таблицы `inventorystorageunits`
--

CREATE TABLE `inventorystorageunits` (
  `id` int(11) NOT NULL,
  `inventory_id` int(11) NOT NULL,
  `storageunit_id` int(11) NOT NULL,
  `quantity` int(11) NOT NULL DEFAULT 0,
  `createdAt` datetime NOT NULL,
  `updatedAt` datetime NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Дамп данных таблицы `inventorystorageunits`
--

INSERT INTO `inventorystorageunits` (`id`, `inventory_id`, `storageunit_id`, `quantity`, `createdAt`, `updatedAt`) VALUES
(1, 1, 2, 50, '2025-03-17 12:24:30', '2025-03-17 12:24:30'),
(2, 1, 3, 20, '2025-03-17 12:24:30', '2025-03-17 12:24:30'),
(3, 2, 1, 30, '2025-03-17 12:24:30', '2025-03-17 12:24:30'),
(4, 3, 4, 10, '2025-03-17 12:24:30', '2025-03-17 12:24:30'),
(5, 6, 3, 1, '2025-03-17 12:24:30', '2025-03-17 12:24:30'),
(6, 19, 3, 1, '2025-03-17 12:24:30', '2025-03-17 12:24:30'),
(7, 2, 15, 1, '2025-03-17 12:24:30', '2025-03-17 12:24:30'),
(8, 18, 3, 2, '2025-03-17 12:24:30', '2025-03-17 12:24:30'),
(9, 21, 14, 1, '2025-03-17 12:24:30', '2025-03-17 12:24:30'),
(10, 17, 13, 1, '2025-03-17 12:24:30', '2025-03-17 12:24:30'),
(11, 20, 11, 1, '2025-03-17 12:24:30', '2025-03-17 12:24:30'),
(12, 25, 13, 1, '2025-03-17 12:24:30', '2025-03-17 12:24:30'),
(13, 20, 14, 1, '2025-03-17 12:24:30', '2025-03-17 12:24:30'),
(14, 21, 14, 3, '2025-03-17 12:24:30', '2025-03-17 12:24:30'),
(15, 22, 14, 3, '2025-03-17 12:24:30', '2025-03-17 12:24:30'),
(16, 22, 14, 3, '2025-03-17 12:24:30', '2025-03-17 12:24:30'),
(17, 34, 15, 3, '2025-03-17 12:24:30', '2025-03-17 12:24:30'),
(18, 44, 15, 3, '2025-03-17 12:24:30', '2025-03-17 12:24:30');

-- --------------------------------------------------------

--
-- Структура таблицы `laboratories`
--

CREATE TABLE `laboratories` (
  `id` int(11) NOT NULL,
  `lab_name` varchar(50) NOT NULL,
  `location` varchar(100) NOT NULL,
  `address` varchar(255) DEFAULT NULL,
  `description` text DEFAULT NULL,
  `specialization` varchar(50) DEFAULT NULL,
  `lab_type` varchar(50) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Дамп данных таблицы `laboratories`
--

INSERT INTO `laboratories` (`id`, `lab_name`, `location`, `address`, `description`, `specialization`, `lab_type`) VALUES
(1, 'Chemistry Lab', 'Building A, Room 101', '123 Main Street, Cityville, State, ZIP', 'A laboratory for conducting experiments in chemistry.', 'Chemistry', 'Research'),
(2, 'Biology Lab', 'Building B, Room 202', '456 Elm Street, Townville, State, ZIP', 'A laboratory for studying biological organisms and processes.', 'Biology', 'Research'),
(3, 'Physics Lab', 'Building C, Room 303', '789 Oak Street, Villageton, State, ZIP', 'A laboratory for conducting experiments in physics.', 'Physics', 'Research'),
(4, 'Clinical Lab', 'Building L, Room 1212', '101 Hospital Avenue, Citytown, State, ZIP', 'A laboratory for conducting medical tests and analyzing patient samples.', 'Medicine', 'Clinical'),
(5, 'Environmental Lab', 'Building M, Room 1313', '202 Environmental Street, Greencity, State, ZIP', 'A laboratory for studying environmental samples and monitoring environmental factors.', 'Environmental Science', 'Research'),
(6, 'Materials Science Lab', 'Building N, Room 1414', '303 Science Boulevard, Techville, State, ZIP', 'A laboratory for studying the properties and behavior of materials.', 'Materials Science', 'Research'),
(7, 'Forensic Lab', 'Building O, Room 1515', '404 Justice Lane, Crimetown, State, ZIP', 'A laboratory for analyzing evidence related to criminal investigations.', 'Forensic Science', 'Analytical'),
(8, 'Organic Chemistry Lab', 'Building H, Room 808', '505 Main Street, Chemicaltown, State, ZIP', 'A laboratory for conducting experiments in organic chemistry.', 'Chemistry', 'Research'),
(9, 'Bioinformatics Lab', 'Building I, Room 909', '606 Elm Street, Biocity, State, ZIP', 'A laboratory for analyzing biological data using computational methods.', 'Biology', 'Computational'),
(10, 'Astrophysics Lab', 'Building J, Room 1010', '707 Oak Street, Astrotown, State, ZIP', 'A laboratory for studying astronomical phenomena and conducting experiments in astrophysics.', 'Physics', 'Research'),
(11, 'Food Science Lab', 'Building K, Room 1111', '808 Pine Street, Foodville, State, ZIP', 'A laboratory for analyzing food samples and studying food properties.', 'Chemistry', 'Analytical');

-- --------------------------------------------------------

--
-- Структура таблицы `orderdetails`
--

CREATE TABLE `orderdetails` (
  `id` int(11) NOT NULL,
  `order_id` int(11) NOT NULL,
  `inventory_id` int(11) NOT NULL,
  `unique_id` varchar(50) DEFAULT NULL,
  `reserved_quantity` int(11) NOT NULL,
  `reservation_date` datetime NOT NULL,
  `return_date` datetime DEFAULT NULL,
  `status` enum('reserved','returned','in use') DEFAULT 'reserved',
  `last_updated` datetime NOT NULL DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Дамп данных таблицы `orderdetails`
--

INSERT INTO `orderdetails` (`id`, `order_id`, `inventory_id`, `unique_id`, `reserved_quantity`, `reservation_date`, `return_date`, `status`, `last_updated`) VALUES
(1, 1, 1, 'EQ0001', 5, '2024-05-01 00:00:00', NULL, 'reserved', '2024-06-03 13:12:44'),
(2, 2, 2, 'EQ0002', 10, '2024-05-15 00:00:00', NULL, 'returned', '2024-06-03 13:40:45'),
(3, 2, 3, 'EQ0003', 7, '2024-05-20 00:00:00', '2024-06-03 16:13:51', 'returned', '2024-06-03 13:13:51'),
(4, 1, 4, 'EQ0004', 3, '2024-05-25 00:00:00', '2024-06-03 00:00:00', 'returned', '2024-06-03 11:56:44'),
(5, 3, 5, 'EQ0005', 12, '2024-05-30 00:00:00', '2024-06-03 16:11:31', 'returned', '2024-06-03 13:11:31'),
(6, 4, 13, 'E0005', 1, '2024-06-05 00:00:00', '2024-06-10 00:00:00', 'returned', '2024-06-02 14:14:56'),
(7, 5, 14, 'E0009', 2, '2024-06-10 00:00:00', '2024-06-20 00:00:00', 'returned', '2024-06-02 14:14:56'),
(8, 6, 15, 'E0020', 3, '2024-06-15 00:00:00', NULL, 'returned', '2024-06-02 14:39:10'),
(9, 6, 16, 'E0025', 1, '2024-06-20 00:00:00', '2024-06-03 15:01:29', 'returned', '2024-06-03 12:01:29'),
(10, 1, 17, 'E0001', 2, '2024-06-25 00:00:00', NULL, 'in use', '2024-06-03 12:53:58'),
(11, 7, 18, 'E0002', 1, '2024-06-30 00:00:00', NULL, 'reserved', '2024-06-02 14:14:56');

-- --------------------------------------------------------

--
-- Структура таблицы `orders`
--

CREATE TABLE `orders` (
  `id` int(11) NOT NULL,
  `order_number` varchar(10) NOT NULL,
  `research_id` int(11) NOT NULL,
  `order_date` datetime NOT NULL,
  `comment` text DEFAULT NULL,
  `employee_id` int(11) NOT NULL,
  `last_updated` datetime NOT NULL DEFAULT current_timestamp(),
  `status` enum('active','completed','canceled') NOT NULL DEFAULT 'active'
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Дамп данных таблицы `orders`
--

INSERT INTO `orders` (`id`, `order_number`, `research_id`, `order_date`, `comment`, `employee_id`, `last_updated`, `status`) VALUES
(1, 'ORD001', 1, '2024-05-01 00:00:00', 'Order for experiment A', 2, '2024-06-03 16:11:55', 'active'),
(2, 'ORD002', 3, '2024-05-15 00:00:00', 'Preparation for research B', 3, '2024-06-03 16:53:20', 'active'),
(3, 'ORD003', 2, '2024-05-20 00:00:00', 'Order for experiment C', 1, '2024-06-03 16:13:51', 'completed'),
(4, 'ORD004', 4, '2024-05-25 00:00:00', 'Current project D', 4, '2024-06-03 16:12:08', 'active'),
(5, 'ORD005', 1, '2024-05-30 00:00:00', 'Upcoming experiment E', 2, '2024-06-03 16:12:12', 'active'),
(6, 'ORD006', 1, '2024-06-05 00:00:00', 'Order for experiment A', 2, '2024-06-03 16:48:05', 'completed'),
(7, 'ORD007', 2, '2024-06-10 00:00:00', 'Order for research B', 3, '2024-06-03 16:12:20', 'active'),
(8, 'ORD008', 3, '2024-06-15 00:00:00', 'Current project C', 4, '2024-06-15 14:00:00', 'active');

-- --------------------------------------------------------

--
-- Структура таблицы `researchemployees`
--

CREATE TABLE `researchemployees` (
  `id` int(11) NOT NULL,
  `research_id` int(11) DEFAULT NULL,
  `employee_id` int(11) DEFAULT NULL,
  `role` varchar(100) DEFAULT NULL,
  `createdAt` datetime NOT NULL,
  `updatedAt` datetime NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Дамп данных таблицы `researchemployees`
--

INSERT INTO `researchemployees` (`id`, `research_id`, `employee_id`, `role`, `createdAt`, `updatedAt`) VALUES
(1, 1, 1, 'Principal Investigator', '2025-03-17 12:24:30', '2025-03-17 12:24:30'),
(2, 1, 2, 'Research Assistant', '2025-03-17 12:24:30', '2025-03-17 12:24:30'),
(3, 1, 3, 'Research Assistant', '2025-03-17 12:24:30', '2025-03-17 12:24:30'),
(4, 1, 4, 'Technical Staff', '2025-03-17 12:24:30', '2025-03-17 12:24:30'),
(5, 1, 5, 'Intern', '2025-03-17 12:24:30', '2025-03-17 12:24:30'),
(6, 2, 6, 'Collaborator', '2025-03-17 12:24:30', '2025-03-17 12:24:30'),
(7, 2, 7, 'Co-Investigator', '2025-03-17 12:24:30', '2025-03-17 12:24:30'),
(8, 2, 8, 'Principal Investigator', '2025-03-17 12:24:30', '2025-03-17 12:24:30'),
(9, 2, 1, 'Research Assistant', '2025-03-17 12:24:30', '2025-03-17 12:24:30'),
(10, 2, 2, 'Co-Investigator', '2025-03-17 12:24:30', '2025-03-17 12:24:30'),
(11, 2, 5, 'Research Assistant', '2025-03-17 12:24:30', '2025-03-17 12:24:30'),
(12, 2, 1, 'Research Assistant', '2025-03-17 12:24:30', '2025-03-17 12:24:30');

-- --------------------------------------------------------

--
-- Структура таблицы `researches`
--

CREATE TABLE `researches` (
  `id` int(11) NOT NULL,
  `title` varchar(100) NOT NULL,
  `type` varchar(100) NOT NULL,
  `goal` text NOT NULL,
  `scope` varchar(100) NOT NULL,
  `research_object` varchar(100) NOT NULL,
  `funding_source` varchar(100) NOT NULL,
  `start_date` datetime NOT NULL,
  `end_date` datetime DEFAULT NULL,
  `status` enum('Completed','Ongoing','Pending') NOT NULL DEFAULT 'Pending'
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Дамп данных таблицы `researches`
--

INSERT INTO `researches` (`id`, `title`, `type`, `goal`, `scope`, `research_object`, `funding_source`, `start_date`, `end_date`, `status`) VALUES
(1, 'Effects of New Drug on Hypertension Patients', 'Experimental', 'To investigate the effects of a new drug on hypertension patients.', 'Clinical trial', 'Hypertension patients', 'National Institute of Health', '2023-05-10 00:00:00', '2024-05-10 00:00:00', 'Ongoing'),
(2, 'Bird Migration Patterns in Urban Environments', 'Observational', 'To analyze the migration patterns of birds in urban environments.', 'Ecological study', 'Urban bird populations', 'National Audubon Society', '2023-03-15 00:00:00', '2023-08-15 00:00:00', 'Completed'),
(3, 'Mathematical Model for Stock Market Trends', 'Theoretical', 'To develop a mathematical model for predicting stock market trends.', 'Mathematical modeling', 'Stock market data', 'University Grant', '2023-07-01 00:00:00', '2024-07-01 00:00:00', 'Pending');

-- --------------------------------------------------------

--
-- Структура таблицы `researchreports`
--

CREATE TABLE `researchreports` (
  `id` int(11) NOT NULL,
  `research_id` int(11) NOT NULL,
  `summary` text DEFAULT NULL,
  `total_experiments` int(11) DEFAULT 0,
  `aggregate_results` longtext CHARACTER SET utf8mb4 COLLATE utf8mb4_bin DEFAULT NULL CHECK (json_valid(`aggregate_results`)),
  `conclusions` text DEFAULT NULL,
  `recommendations` text DEFAULT NULL,
  `publication_ready` tinyint(1) NOT NULL DEFAULT 0,
  `createdAt` datetime NOT NULL,
  `updatedAt` datetime NOT NULL,
  `status` enum('Draft','Under Review','Published') NOT NULL DEFAULT 'Draft',
  `aggregate_expenses` longtext CHARACTER SET utf8mb4 COLLATE utf8mb4_bin DEFAULT NULL CHECK (json_valid(`aggregate_expenses`))
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Дамп данных таблицы `researchreports`
--

INSERT INTO `researchreports` (`id`, `research_id`, `summary`, `total_experiments`, `aggregate_results`, `conclusions`, `recommendations`, `publication_ready`, `createdAt`, `updatedAt`, `status`, `aggregate_expenses`) VALUES
(21, 1, 'Отчет по исследованию химической устойчивости компаундов.', 5, '[{\"experiment\":\"Опыт 1\",\"result\":\"Устойчивость до 90%\"},{\"experiment\":\"Опыт 2\",\"result\":\"Устойчивость до 75%\"}]', 'Композиты показали отличные результаты устойчивости при разных условиях.', 'Рекомендации: Использовать в условиях повышенной влажности с ограниченным воздействием солнечного света.', 0, '2024-11-03 12:52:25', '2024-11-03 12:52:25', 'Under Review', '[{\"item\":\"Соляная кислота\",\"quantity\":500,\"unit\":\"мл\"},{\"item\":\"Хлорид натрия\",\"quantity\":300,\"unit\":\"г\"}]');

-- --------------------------------------------------------

--
-- Структура таблицы `sequelizemeta`
--

CREATE TABLE `sequelizemeta` (
  `name` varchar(255) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COLLATE=utf8_unicode_ci;

--
-- Дамп данных таблицы `sequelizemeta`
--

INSERT INTO `sequelizemeta` (`name`) VALUES
('20241029155513-create-chemelement.js'),
('20241029160816-create-chemcompound.js'),
('20241029161616-create-chemequipment.js'),
('20241029162327-create-laboratory.js'),
('20241029162543-create-employee.js'),
('20241029162825-create-research.js'),
('20241029165440-create-chemstorage.js'),
('20241029165718-create-chemmixture.js'),
('20241029170111-create-researchemployee.js'),
('20241029171413-create-order.js'),
('20241029173643-create-storageunit.js'),
('20241029173644-create-inventory.js'),
('20241030105252-create-orderdetails.js'),
('20241030182131-create-experiment.js'),
('20241030190743-create-experimentexpenses.js'),
('20241030200515-create-experimentresults.js'),
('20241031102423-create-researchreports.js'),
('20241103124411-add-status-and-aggregate-expenses-to-researchreports.js'),
('20241106155802-create-inventorystorageunit.js'),
('20241122175346-add-category-to-chemquipments.js'),
('20241122183652-add-group-to-chemequipments.js'),
('20241225185905-create-users.js'),
('20250115150037-create-cart.js'),
('20250226132715-create-task.js'),
('20250226132731-create-taskfiles.js');

-- --------------------------------------------------------

--
-- Структура таблицы `storageunits`
--

CREATE TABLE `storageunits` (
  `id` int(11) NOT NULL,
  `storage_id` int(11) DEFAULT NULL,
  `parent_id` int(11) DEFAULT NULL,
  `unit_type` enum('storage_laboratory','storage_room','freezer','refrigerator','cabinet','vented_cabinet','safety_cabinet','fume_hood','desiccator','glove_box','incubator','shelf','drawer','rack','tray','bin','container','bottle','jar','flask','tube','canister','vessel','ampoule','tank','cylinder','carboy','dewar_flask') NOT NULL,
  `unit_name` varchar(100) DEFAULT NULL,
  `capacity` decimal(10,2) DEFAULT NULL,
  `current_utilization` decimal(10,2) DEFAULT 0.00,
  `temperature` decimal(5,2) DEFAULT NULL,
  `humidity` decimal(5,2) DEFAULT NULL,
  `pressure` decimal(6,2) DEFAULT NULL,
  `material` varchar(50) DEFAULT NULL,
  `is_locked` tinyint(1) DEFAULT 0,
  `safety_rating` varchar(20) DEFAULT NULL,
  `last_maintenance_date` datetime DEFAULT NULL,
  `next_maintenance_date` datetime DEFAULT NULL,
  `alarm_threshold` decimal(5,2) DEFAULT NULL,
  `location_description` text DEFAULT NULL,
  `expiration_date_check` tinyint(1) DEFAULT 0,
  `description` text DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Дамп данных таблицы `storageunits`
--

INSERT INTO `storageunits` (`id`, `storage_id`, `parent_id`, `unit_type`, `unit_name`, `capacity`, `current_utilization`, `temperature`, `humidity`, `pressure`, `material`, `is_locked`, `safety_rating`, `last_maintenance_date`, `next_maintenance_date`, `alarm_threshold`, `location_description`, `expiration_date_check`, `description`) VALUES
(1, 1, NULL, 'refrigerator', 'Main Refrigerator', 100.00, 50.00, 4.00, 60.00, NULL, 'Stainless Steel', 1, 'A', '2024-01-01 00:00:00', '2024-07-01 00:00:00', 2.00, 'North wing of the lab', 1, 'Used for storing temperature-sensitive chemicals'),
(2, NULL, 1, 'shelf', 'Top Shelf', 20.00, 5.00, 4.00, 60.00, NULL, 'Plastic', 0, 'B', '2024-02-01 00:00:00', '2024-08-01 00:00:00', 1.00, 'Inside Main Refrigerator', 0, 'Shelf designated for samples'),
(3, 1, NULL, 'cabinet', 'Chemical Storage Cabinet', 500.00, 200.00, NULL, NULL, NULL, 'Metal', 1, 'A+', '2024-01-15 00:00:00', '2024-07-15 00:00:00', NULL, 'East side of the lab', 1, 'Secure cabinet for hazardous chemicals'),
(4, NULL, 3, 'drawer', 'Hazardous Material Drawer', 50.00, 10.00, NULL, NULL, NULL, 'Metal', 1, 'A', '2024-03-01 00:00:00', '2024-09-01 00:00:00', NULL, 'Inside Chemical Storage Cabinet', 1, 'Drawer for hazardous substances requiring special handling'),
(5, 2, NULL, 'freezer', 'Main Freezer', 200.00, 80.00, -20.00, NULL, NULL, 'Stainless Steel', 1, 'A+', '2024-01-10 00:00:00', '2024-07-10 00:00:00', -18.00, 'Cold storage room', 1, 'Freezer for biological samples'),
(6, NULL, 5, 'rack', 'Rack 1', 50.00, 20.00, -20.00, NULL, NULL, 'Aluminum', 0, 'B+', '2024-02-15 00:00:00', '2024-08-15 00:00:00', NULL, 'Inside Main Freezer', 0, 'Rack for storing cryovials'),
(7, 3, NULL, 'safety_cabinet', 'Flammable Materials Cabinet', 300.00, 150.00, NULL, NULL, NULL, 'Fire-resistant Steel', 1, 'A+', '2024-01-20 00:00:00', '2024-07-20 00:00:00', NULL, 'South corner of the lab', 1, 'Special cabinet for flammable chemicals'),
(8, NULL, 7, 'drawer', 'Top Drawer', 25.00, 10.00, NULL, NULL, NULL, 'Fire-resistant Steel', 1, 'A', '2024-02-05 00:00:00', '2024-08-05 00:00:00', NULL, 'Inside Flammable Materials Cabinet', 1, 'Drawer for flammable solids'),
(9, 4, NULL, 'shelf', 'Chemical Shelf', 150.00, 70.00, NULL, NULL, NULL, 'Wood', 0, 'B', '2024-03-01 00:00:00', '2024-09-01 00:00:00', NULL, 'Central area of the lab', 1, 'General storage for non-hazardous chemicals'),
(10, NULL, 9, 'bin', 'Sample Bin', 30.00, 15.00, NULL, NULL, NULL, 'Plastic', 0, 'B', '2024-02-25 00:00:00', '2024-08-25 00:00:00', NULL, 'On Chemical Shelf', 0, 'Bin for quick-access samples'),
(11, NULL, 1, 'shelf', '1st Middle Shelf', 20.00, 5.00, 4.00, 60.00, NULL, 'Plastic', 0, 'B', '2024-02-01 00:00:00', '2024-08-01 00:00:00', 1.00, 'Inside Main Refrigerator', 0, 'Shelf designated for samples'),
(12, NULL, 1, 'shelf', '2nd Middle Shelf', 20.00, 5.00, 4.00, 60.00, NULL, 'Plastic', 0, 'B', '2024-02-01 00:00:00', '2024-08-01 00:00:00', 1.00, 'Inside Main Refrigerator', 0, 'Shelf designated for samples'),
(13, NULL, 1, 'shelf', '3nd Middle Shelf', 20.00, 5.00, 4.00, 60.00, NULL, 'Plastic', 0, 'B', '2024-02-01 00:00:00', '2024-08-01 00:00:00', 1.00, 'Inside Main Refrigerator', 0, 'Shelf designated for samples'),
(14, NULL, 1, 'shelf', 'Bottom Shelf', 20.00, 5.00, 4.00, 60.00, NULL, 'Plastic', 0, 'B', '2024-02-01 00:00:00', '2024-08-01 00:00:00', 1.00, 'Inside Bottom Shelf > Main Refrigerator', 0, 'Shelf designated for samples'),
(15, NULL, 14, 'container', 'container №1', 5.00, 1.00, 4.00, 60.00, NULL, 'Metal', 1, 'C', '2024-02-01 00:00:00', '2024-08-01 00:00:00', 1.00, 'Inside Main Refrigerator', 0, 'Container designated for samples'),
(16, 1, NULL, 'refrigerator', 'Secondary Refrigerator', 80.00, 50.00, 4.00, 60.00, NULL, 'Stainless Steel', 1, 'A', '2024-01-01 00:00:00', '2024-07-01 00:00:00', 2.00, 'North wing of the lab', 1, 'Used for storing temperature-sensitive chemicals'),
(17, NULL, 15, 'container', 'container №3', 5.00, 1.00, 4.00, 60.00, NULL, 'Metal', 1, 'C', '2024-02-01 00:00:00', '2024-08-01 00:00:00', 1.00, 'Inside Main Refrigerator', 0, 'Container designated for samples');

-- --------------------------------------------------------

--
-- Структура таблицы `tasks`
--

CREATE TABLE `tasks` (
  `id` int(11) NOT NULL,
  `research_id` int(11) NOT NULL,
  `title` varchar(100) NOT NULL,
  `description` text NOT NULL,
  `subtasks` text DEFAULT NULL COMMENT 'Список подзадач, разделенных '';''',
  `reminder` time DEFAULT NULL,
  `start_date` datetime NOT NULL,
  `due_date` datetime DEFAULT NULL,
  `status` enum('Completed','Ongoing','Pending','Draft','Canceled','Critical') NOT NULL DEFAULT 'Pending'
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Дамп данных таблицы `tasks`
--

INSERT INTO `tasks` (`id`, `research_id`, `title`, `description`, `subtasks`, `reminder`, `start_date`, `due_date`, `status`) VALUES
(1, 1, 'Analysis of water samples', 'Perform chemical analysis of water for heavy metals.', 'Sample collection;Analysis in the laboratory;Report preparation', '12:00:00', '2025-03-17 12:24:30', '2025-03-24 12:24:30', 'Ongoing'),
(2, 2, 'Chemical Reagent Testing', 'Test the performance of reagents under different conditions.', 'Preparation of solutions;Conducting tests;Recording results', '15:30:00', '2025-03-17 12:24:30', '2025-03-27 12:24:30', 'Pending');

-- --------------------------------------------------------

--
-- Структура таблицы `task_files`
--

CREATE TABLE `task_files` (
  `id` int(11) NOT NULL,
  `task_id` int(11) NOT NULL,
  `file_path` varchar(255) NOT NULL COMMENT 'Путь к файлу',
  `file_type` varchar(50) NOT NULL COMMENT 'Тип файла (image, zip, text, etc.)',
  `updatedAt` datetime NOT NULL COMMENT 'Дата загрузки файла',
  `uploaded_by` int(11) NOT NULL,
  `file_size` float NOT NULL COMMENT 'Размер файла в MB'
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Дамп данных таблицы `task_files`
--

INSERT INTO `task_files` (`id`, `task_id`, `file_path`, `file_type`, `updatedAt`, `uploaded_by`, `file_size`) VALUES
(1, 1, 'uploads/reports/water_analysis.pdf', 'pdf', '2025-03-17 12:24:30', 1, 3000),
(2, 1, 'uploads/images/sample1.jpg', 'image', '2025-03-17 12:24:30', 1, 1000),
(3, 2, 'uploads/docs/reagent_test_results.zip', 'zip', '2025-03-17 12:24:30', 1, 2000);

-- --------------------------------------------------------

--
-- Структура таблицы `users`
--

CREATE TABLE `users` (
  `id` int(11) NOT NULL,
  `name` varchar(255) NOT NULL,
  `email` varchar(255) NOT NULL,
  `password` varchar(255) NOT NULL,
  `employee_id` int(11) DEFAULT NULL,
  `createdAt` datetime NOT NULL,
  `updatedAt` datetime NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Дамп данных таблицы `users`
--

INSERT INTO `users` (`id`, `name`, `email`, `password`, `employee_id`, `createdAt`, `updatedAt`) VALUES
(1, 'John Doe', 'john.doe@example.com', '1234', NULL, '0000-00-00 00:00:00', '0000-00-00 00:00:00'),
(2, 'Jane Smith', 'jane.smith@example.com', '1234', 1, '0000-00-00 00:00:00', '0000-00-00 00:00:00'),
(3, 'ggg', 'georgiigiblov@gmail.com', '$2b$10$lBXn0WnFRo8neGX00e4Y1.B/VmkYzX0AH2ldnwW3OKP6tlUlBezGi', 2, '2025-03-17 12:38:45', '2025-03-17 13:04:06'),
(4, 'fff', 'giblov@gmail.com', '$2b$10$yWtEJ2xVW.kQS2fGQEYVnedgAniNAeWVSwcx/NT1pbT7PiEa8JQYi', 3, '2025-03-17 12:41:20', '2025-03-17 13:06:28');

--
-- Индексы сохранённых таблиц
--

--
-- Индексы таблицы `carts`
--
ALTER TABLE `carts`
  ADD PRIMARY KEY (`id`),
  ADD KEY `user_id` (`user_id`),
  ADD KEY `item_id` (`item_id`);

--
-- Индексы таблицы `chemcompounds`
--
ALTER TABLE `chemcompounds`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `cas_id` (`cas_id`),
  ADD KEY `parent_id` (`parent_id`);

--
-- Индексы таблицы `chemelements`
--
ALTER TABLE `chemelements`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `cas_id` (`cas_id`),
  ADD KEY `parent_id` (`parent_id`);

--
-- Индексы таблицы `chemequipments`
--
ALTER TABLE `chemequipments`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `unique_id` (`unique_id`),
  ADD KEY `parent_id` (`parent_id`);

--
-- Индексы таблицы `chemmixtures`
--
ALTER TABLE `chemmixtures`
  ADD PRIMARY KEY (`id`),
  ADD KEY `parent_id` (`parent_id`);

--
-- Индексы таблицы `chemstorages`
--
ALTER TABLE `chemstorages`
  ADD PRIMARY KEY (`id`),
  ADD KEY `laboratory_id` (`laboratory_id`);

--
-- Индексы таблицы `employees`
--
ALTER TABLE `employees`
  ADD PRIMARY KEY (`id`),
  ADD KEY `lab_id` (`lab_id`);

--
-- Индексы таблицы `experimentexpenses`
--
ALTER TABLE `experimentexpenses`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `unique_id` (`unique_id`),
  ADD KEY `experiment_id` (`experiment_id`),
  ADD KEY `orderdetails_id` (`orderdetails_id`);

--
-- Индексы таблицы `experimentresults`
--
ALTER TABLE `experimentresults`
  ADD PRIMARY KEY (`id`),
  ADD KEY `experiment_id` (`experiment_id`);

--
-- Индексы таблицы `experiments`
--
ALTER TABLE `experiments`
  ADD PRIMARY KEY (`id`),
  ADD KEY `research_id` (`research_id`),
  ADD KEY `laboratory_id` (`laboratory_id`);

--
-- Индексы таблицы `inventories`
--
ALTER TABLE `inventories`
  ADD PRIMARY KEY (`id`),
  ADD KEY `storage_id` (`storage_id`),
  ADD KEY `inventories_reference_id_item_type` (`reference_id`,`item_type`);

--
-- Индексы таблицы `inventorystorageunits`
--
ALTER TABLE `inventorystorageunits`
  ADD PRIMARY KEY (`id`),
  ADD KEY `inventory_id` (`inventory_id`),
  ADD KEY `storageunit_id` (`storageunit_id`);

--
-- Индексы таблицы `laboratories`
--
ALTER TABLE `laboratories`
  ADD PRIMARY KEY (`id`);

--
-- Индексы таблицы `orderdetails`
--
ALTER TABLE `orderdetails`
  ADD PRIMARY KEY (`id`),
  ADD KEY `order_id` (`order_id`),
  ADD KEY `inventory_id` (`inventory_id`);

--
-- Индексы таблицы `orders`
--
ALTER TABLE `orders`
  ADD PRIMARY KEY (`id`);

--
-- Индексы таблицы `researchemployees`
--
ALTER TABLE `researchemployees`
  ADD PRIMARY KEY (`id`),
  ADD KEY `research_id` (`research_id`),
  ADD KEY `employee_id` (`employee_id`);

--
-- Индексы таблицы `researches`
--
ALTER TABLE `researches`
  ADD PRIMARY KEY (`id`);

--
-- Индексы таблицы `researchreports`
--
ALTER TABLE `researchreports`
  ADD PRIMARY KEY (`id`),
  ADD KEY `research_id` (`research_id`);

--
-- Индексы таблицы `sequelizemeta`
--
ALTER TABLE `sequelizemeta`
  ADD PRIMARY KEY (`name`),
  ADD UNIQUE KEY `name` (`name`);

--
-- Индексы таблицы `storageunits`
--
ALTER TABLE `storageunits`
  ADD PRIMARY KEY (`id`),
  ADD KEY `storage_id` (`storage_id`),
  ADD KEY `parent_id` (`parent_id`);

--
-- Индексы таблицы `tasks`
--
ALTER TABLE `tasks`
  ADD PRIMARY KEY (`id`),
  ADD KEY `research_id` (`research_id`);

--
-- Индексы таблицы `task_files`
--
ALTER TABLE `task_files`
  ADD PRIMARY KEY (`id`),
  ADD KEY `task_id` (`task_id`),
  ADD KEY `uploaded_by` (`uploaded_by`);

--
-- Индексы таблицы `users`
--
ALTER TABLE `users`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `email` (`email`),
  ADD KEY `employee_id` (`employee_id`);

--
-- AUTO_INCREMENT для сохранённых таблиц
--

--
-- AUTO_INCREMENT для таблицы `carts`
--
ALTER TABLE `carts`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT для таблицы `chemcompounds`
--
ALTER TABLE `chemcompounds`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=17;

--
-- AUTO_INCREMENT для таблицы `chemelements`
--
ALTER TABLE `chemelements`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=25;

--
-- AUTO_INCREMENT для таблицы `chemequipments`
--
ALTER TABLE `chemequipments`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=13;

--
-- AUTO_INCREMENT для таблицы `chemmixtures`
--
ALTER TABLE `chemmixtures`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=21;

--
-- AUTO_INCREMENT для таблицы `chemstorages`
--
ALTER TABLE `chemstorages`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=5;

--
-- AUTO_INCREMENT для таблицы `employees`
--
ALTER TABLE `employees`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=9;

--
-- AUTO_INCREMENT для таблицы `experimentexpenses`
--
ALTER TABLE `experimentexpenses`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=4;

--
-- AUTO_INCREMENT для таблицы `experimentresults`
--
ALTER TABLE `experimentresults`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=4;

--
-- AUTO_INCREMENT для таблицы `experiments`
--
ALTER TABLE `experiments`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=4;

--
-- AUTO_INCREMENT для таблицы `inventories`
--
ALTER TABLE `inventories`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=47;

--
-- AUTO_INCREMENT для таблицы `inventorystorageunits`
--
ALTER TABLE `inventorystorageunits`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=19;

--
-- AUTO_INCREMENT для таблицы `laboratories`
--
ALTER TABLE `laboratories`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=12;

--
-- AUTO_INCREMENT для таблицы `orderdetails`
--
ALTER TABLE `orderdetails`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=12;

--
-- AUTO_INCREMENT для таблицы `orders`
--
ALTER TABLE `orders`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=9;

--
-- AUTO_INCREMENT для таблицы `researchemployees`
--
ALTER TABLE `researchemployees`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=13;

--
-- AUTO_INCREMENT для таблицы `researches`
--
ALTER TABLE `researches`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=4;

--
-- AUTO_INCREMENT для таблицы `researchreports`
--
ALTER TABLE `researchreports`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=22;

--
-- AUTO_INCREMENT для таблицы `storageunits`
--
ALTER TABLE `storageunits`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=18;

--
-- AUTO_INCREMENT для таблицы `tasks`
--
ALTER TABLE `tasks`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=3;

--
-- AUTO_INCREMENT для таблицы `task_files`
--
ALTER TABLE `task_files`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=4;

--
-- AUTO_INCREMENT для таблицы `users`
--
ALTER TABLE `users`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=5;

--
-- Ограничения внешнего ключа сохраненных таблиц
--

--
-- Ограничения внешнего ключа таблицы `carts`
--
ALTER TABLE `carts`
  ADD CONSTRAINT `carts_ibfk_1` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`) ON DELETE CASCADE,
  ADD CONSTRAINT `carts_ibfk_2` FOREIGN KEY (`item_id`) REFERENCES `inventories` (`id`) ON DELETE CASCADE;

--
-- Ограничения внешнего ключа таблицы `chemcompounds`
--
ALTER TABLE `chemcompounds`
  ADD CONSTRAINT `chemcompounds_ibfk_1` FOREIGN KEY (`parent_id`) REFERENCES `chemcompounds` (`id`) ON DELETE SET NULL ON UPDATE CASCADE;

--
-- Ограничения внешнего ключа таблицы `chemelements`
--
ALTER TABLE `chemelements`
  ADD CONSTRAINT `chemelements_ibfk_1` FOREIGN KEY (`parent_id`) REFERENCES `chemelements` (`id`) ON DELETE SET NULL ON UPDATE CASCADE;

--
-- Ограничения внешнего ключа таблицы `chemequipments`
--
ALTER TABLE `chemequipments`
  ADD CONSTRAINT `chemequipments_ibfk_1` FOREIGN KEY (`parent_id`) REFERENCES `chemequipments` (`id`) ON DELETE SET NULL ON UPDATE CASCADE;

--
-- Ограничения внешнего ключа таблицы `chemmixtures`
--
ALTER TABLE `chemmixtures`
  ADD CONSTRAINT `chemmixtures_ibfk_1` FOREIGN KEY (`parent_id`) REFERENCES `chemmixtures` (`id`) ON DELETE SET NULL ON UPDATE CASCADE;

--
-- Ограничения внешнего ключа таблицы `chemstorages`
--
ALTER TABLE `chemstorages`
  ADD CONSTRAINT `chemstorages_ibfk_1` FOREIGN KEY (`laboratory_id`) REFERENCES `laboratories` (`id`) ON DELETE CASCADE ON UPDATE CASCADE;

--
-- Ограничения внешнего ключа таблицы `employees`
--
ALTER TABLE `employees`
  ADD CONSTRAINT `employees_ibfk_1` FOREIGN KEY (`lab_id`) REFERENCES `laboratories` (`id`) ON DELETE SET NULL ON UPDATE CASCADE;

--
-- Ограничения внешнего ключа таблицы `experimentexpenses`
--
ALTER TABLE `experimentexpenses`
  ADD CONSTRAINT `experimentexpenses_ibfk_1` FOREIGN KEY (`experiment_id`) REFERENCES `experiments` (`id`) ON DELETE SET NULL ON UPDATE CASCADE,
  ADD CONSTRAINT `experimentexpenses_ibfk_2` FOREIGN KEY (`orderdetails_id`) REFERENCES `orderdetails` (`id`) ON DELETE SET NULL ON UPDATE CASCADE;

--
-- Ограничения внешнего ключа таблицы `experimentresults`
--
ALTER TABLE `experimentresults`
  ADD CONSTRAINT `experimentresults_ibfk_1` FOREIGN KEY (`experiment_id`) REFERENCES `experiments` (`id`) ON DELETE CASCADE ON UPDATE CASCADE;

--
-- Ограничения внешнего ключа таблицы `experiments`
--
ALTER TABLE `experiments`
  ADD CONSTRAINT `experiments_ibfk_1` FOREIGN KEY (`research_id`) REFERENCES `researches` (`id`) ON DELETE SET NULL ON UPDATE CASCADE,
  ADD CONSTRAINT `experiments_ibfk_2` FOREIGN KEY (`laboratory_id`) REFERENCES `laboratories` (`id`) ON DELETE SET NULL ON UPDATE CASCADE;

--
-- Ограничения внешнего ключа таблицы `inventories`
--
ALTER TABLE `inventories`
  ADD CONSTRAINT `inventories_ibfk_1` FOREIGN KEY (`storage_id`) REFERENCES `chemstorages` (`id`) ON DELETE CASCADE ON UPDATE CASCADE;

--
-- Ограничения внешнего ключа таблицы `inventorystorageunits`
--
ALTER TABLE `inventorystorageunits`
  ADD CONSTRAINT `inventorystorageunits_ibfk_1` FOREIGN KEY (`inventory_id`) REFERENCES `inventories` (`id`) ON DELETE CASCADE ON UPDATE CASCADE,
  ADD CONSTRAINT `inventorystorageunits_ibfk_2` FOREIGN KEY (`storageunit_id`) REFERENCES `storageunits` (`id`) ON DELETE CASCADE ON UPDATE CASCADE;

--
-- Ограничения внешнего ключа таблицы `orderdetails`
--
ALTER TABLE `orderdetails`
  ADD CONSTRAINT `orderdetails_ibfk_1` FOREIGN KEY (`order_id`) REFERENCES `orders` (`id`) ON DELETE CASCADE ON UPDATE CASCADE,
  ADD CONSTRAINT `orderdetails_ibfk_2` FOREIGN KEY (`inventory_id`) REFERENCES `inventories` (`id`) ON DELETE CASCADE ON UPDATE CASCADE;

--
-- Ограничения внешнего ключа таблицы `researchemployees`
--
ALTER TABLE `researchemployees`
  ADD CONSTRAINT `researchemployees_ibfk_1` FOREIGN KEY (`research_id`) REFERENCES `researches` (`id`) ON DELETE SET NULL ON UPDATE CASCADE,
  ADD CONSTRAINT `researchemployees_ibfk_2` FOREIGN KEY (`employee_id`) REFERENCES `employees` (`id`) ON DELETE SET NULL ON UPDATE CASCADE;

--
-- Ограничения внешнего ключа таблицы `researchreports`
--
ALTER TABLE `researchreports`
  ADD CONSTRAINT `researchreports_ibfk_1` FOREIGN KEY (`research_id`) REFERENCES `researches` (`id`) ON DELETE CASCADE ON UPDATE CASCADE;

--
-- Ограничения внешнего ключа таблицы `storageunits`
--
ALTER TABLE `storageunits`
  ADD CONSTRAINT `storageunits_ibfk_1` FOREIGN KEY (`storage_id`) REFERENCES `chemstorages` (`id`) ON DELETE CASCADE ON UPDATE CASCADE,
  ADD CONSTRAINT `storageunits_ibfk_2` FOREIGN KEY (`parent_id`) REFERENCES `storageunits` (`id`) ON DELETE SET NULL ON UPDATE CASCADE;

--
-- Ограничения внешнего ключа таблицы `tasks`
--
ALTER TABLE `tasks`
  ADD CONSTRAINT `tasks_ibfk_1` FOREIGN KEY (`research_id`) REFERENCES `researches` (`id`) ON DELETE CASCADE ON UPDATE CASCADE;

--
-- Ограничения внешнего ключа таблицы `task_files`
--
ALTER TABLE `task_files`
  ADD CONSTRAINT `task_files_ibfk_1` FOREIGN KEY (`task_id`) REFERENCES `tasks` (`id`) ON DELETE CASCADE ON UPDATE CASCADE,
  ADD CONSTRAINT `task_files_ibfk_2` FOREIGN KEY (`uploaded_by`) REFERENCES `users` (`id`) ON DELETE CASCADE ON UPDATE CASCADE;

--
-- Ограничения внешнего ключа таблицы `users`
--
ALTER TABLE `users`
  ADD CONSTRAINT `users_ibfk_1` FOREIGN KEY (`employee_id`) REFERENCES `employees` (`id`) ON DELETE SET NULL ON UPDATE CASCADE;
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
