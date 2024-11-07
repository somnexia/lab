-- phpMyAdmin SQL Dump
-- version 5.2.1
-- https://www.phpmyadmin.net/
--
-- Хост: 127.0.0.1
-- Время создания: Окт 28 2024 г., 16:46
-- Версия сервера: 10.4.25-MariaDB
-- Версия PHP: 8.1.10

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
START TRANSACTION;
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

--
-- База данных: `laboratory`
--

DELIMITER $$
--
-- Процедуры
--
CREATE DEFINER=`root`@`localhost` PROCEDURE `AddToInventory` (IN `experimentResultID` INT, IN `storage_id` INT, IN `expiration_date` DATE)   BEGIN
    DECLARE lab_name VARCHAR(50); -- добавленная переменная для хранения названия лаборатории

    -- Получение названия лаборатории по ее ID
    SELECT laboratory.lab_name INTO lab_name
    FROM laboratory
    WHERE laboratory.id =(SELECT laboratory_id FROM experiment_results WHERE id = experimentResultID);

    -- Вставка новых данных в таблицу inventory
    INSERT INTO inventory (
        unique_id, 
        item_name, 
        item_type, 
        quantity, 
        substance_quantity, 
        measurement_unit, 
        storage_id, 
        receipt_date, 
        expiration_date, 
        supplier, 
        status, 
        last_updated
    )
    SELECT 
        CONCAT('EXP-', id), -- unique_id
        result_substance, 
        substance_type, 
        1, -- количество единиц
        quantity, 
        unit_measure, 
        storage_id, 
        receipt_date, 
        expiration_date, 
        lab_name, -- использование названия лаборатории в качестве поставщика
        'available', 
        NOW()
    FROM 
        experiment_results
    WHERE
        experiment_results.id = experimentResultID;
END$$

DELIMITER ;

-- --------------------------------------------------------

--
-- Структура таблицы `chemcompound`
--

CREATE TABLE `chemcompound` (
  `id` int(11) NOT NULL,
  `unique_id` varchar(50) NOT NULL,
  `name` varchar(50) NOT NULL,
  `formula` varchar(50) NOT NULL,
  `molecular_weight` decimal(10,4) DEFAULT NULL,
  `description` text DEFAULT NULL,
  `aggregate_state` varchar(50) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

--
-- Дамп данных таблицы `chemcompound`
--

INSERT INTO `chemcompound` (`id`, `unique_id`, `name`, `formula`, `molecular_weight`, `description`, `aggregate_state`) VALUES
(1, 'C0001', 'Water', 'H2O', 18.0150, 'Water is a transparent, tasteless, odorless, and nearly colorless chemical substance, which is the main constituent of Earth\'s streams, lakes, and oceans.', 'liquid'),
(2, 'C0002', 'Carbon Dioxide', 'CO2', 44.0100, 'Carbon dioxide is a colorless gas with a density about 60% higher than that of dry air.', 'gas'),
(3, 'C0003', 'Sodium Chloride', 'NaCl', 58.4400, 'Sodium chloride, commonly known as salt, is an ionic compound with the chemical formula NaCl, representing a 1:1 ratio of sodium and chloride ions.', 'solid'),
(4, 'C0004', 'Ammonia', 'NH3', 17.0310, 'Ammonia is a compound of nitrogen and hydrogen with the formula NH3.', 'gas'),
(5, 'C0005', 'Carbon Monoxide', 'CO', 28.0100, 'Carbon monoxide is a colorless, odorless, and tasteless gas that is slightly less dense than air.', 'gas'),
(6, 'C0006', 'Methanol', 'CH3OH', 32.0400, 'Methanol, also known as methyl alcohol amongst other names, is a chemical with the formula CH3OH.', 'liquid'),
(7, 'C0007', 'Acetic Acid', 'CH3COOH', 60.0520, 'Acetic acid, systematically named ethanoic acid, is a colorless liquid organic compound with the chemical formula CH3COOH.', 'liquid'),
(8, 'C0008', 'Glucose', 'C6H12O6', 180.1560, 'Glucose is a simple sugar with the molecular formula C6H12O6.', 'solid'),
(9, 'C0009', 'Hydrochloric Acid', 'HCl', 36.4610, 'Hydrochloric acid is a colorless inorganic chemical system with the formula HCl', 'liquid'),
(10, 'C0010', 'Ethanol', 'C2H6O', 46.0700, 'Ethanol, also called ethyl alcohol, grain alcohol, or alcohol, is a chemical compound', 'liquid'),
(11, 'C0011', 'Sulfuric Acid', 'H2SO4', 98.0790, 'Sulfuric acid is a strong mineral acid with the molecular formula H2SO4', 'liquid'),
(12, 'C0012', 'Nitric Acid', 'HNO3', 63.0120, 'Nitric acid is a mineral acid also known as aqua fortis and spirit of niter.', 'liquid'),
(13, 'C0013', 'Acetone', 'C3H6O', 58.0800, 'Acetone is a colorless, volatile, flammable liquid used as a solvent and in nail polish removers.', 'liquid'),
(14, 'C0014', 'Ammonium Hydroxide', 'NH4OH', 35.0500, 'Ammonium hydroxide, also known as ammonia water, ammonia solution, or aqueous ammonia.', 'liquid'),
(15, 'C0015', 'Phosphoric Acid', 'H3PO4', 97.9940, 'Phosphoric acid is a weak acid with the chemical formula H3PO4.', 'liquid'),
(16, 'C0016', 'Ethylene Glycol', 'C2H6O2', 62.0700, 'Ethylene glycol is an organic compound with the formula (CH2OH)2.', 'liquid');

-- --------------------------------------------------------

--
-- Структура таблицы `chemelement`
--

CREATE TABLE `chemelement` (
  `id` int(11) NOT NULL,
  `unique_id` varchar(50) NOT NULL,
  `symbol` varchar(2) NOT NULL,
  `name` varchar(50) NOT NULL,
  `atomic_number` int(11) NOT NULL,
  `atomic_weight` decimal(10,4) DEFAULT NULL,
  `chemical_group` varchar(50) NOT NULL,
  `aggregate_state` varchar(100) DEFAULT NULL,
  `description` text DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

--
-- Дамп данных таблицы `chemelement`
--

INSERT INTO `chemelement` (`id`, `unique_id`, `symbol`, `name`, `atomic_number`, `atomic_weight`, `chemical_group`, `aggregate_state`, `description`) VALUES
(1, 'E0001', 'H', 'Hydrogen', 1, 1.0080, 'Nonmetal', 'Gas', 'Hydrogen is a chemical element with symbol H and atomic number 1. It is the lightest element in the periodic table.'),
(2, 'E0002', 'He', 'Helium', 2, 4.0026, 'Noble gas', 'Gas', 'Helium is a chemical element with symbol He and atomic number 2. It is a colorless, odorless, tasteless, non-toxic, inert, monatomic gas.'),
(3, 'E0003', 'Li', 'Lithium', 3, 6.9400, 'Alkali metal', 'Solid', 'Lithium is a chemical element with symbol Li and atomic number 3. It is a soft, silvery-white alkali metal.'),
(4, 'E0004', 'Be', 'Beryllium', 4, 9.0122, 'Alkaline earth metal', 'Solid', 'Beryllium is a chemical element with symbol Be and atomic number 4. It is a relatively rare element in the universe, usually occurring as a product of the spallation of larger atomic nuclei.'),
(5, 'E0005', 'B', 'Boron', 5, 10.8100, 'Metalloid', 'Solid', 'Boron is a chemical element with symbol B and atomic number 5. It is a low-abundance element in the Earth\'s crust and is primarily produced by the mining of borate minerals.'),
(6, 'E0006', 'C', 'Carbon', 6, 12.0110, 'Nonmetal', 'Solid', 'Carbon is a chemical element with symbol C and atomic number 6. It is nonmetallic and tetravalent—making four electrons available to form covalent chemical bonds.'),
(7, 'E0007', 'N', 'Nitrogen', 7, 14.0070, 'Nonmetal', 'Gas', 'Nitrogen is a chemical element with symbol N and atomic number 7. It is a nonmetal with properties that are intermediate between the elements above and below in the periodic table.'),
(8, 'E0008', 'O', 'Oxygen', 8, 15.9990, 'Nonmetal', 'Gas', 'Oxygen is a chemical element with symbol O and atomic number 8. It is a member of the chalcogen group in the periodic table, a highly reactive nonmetal, and an oxidizing agent that readily forms oxides with most elements.'),
(9, 'E0009', 'F', 'Fluorine', 9, 18.9980, 'Halogen', 'Gas', 'Fluorine is a chemical element with symbol F and atomic number 9. It is the lightest halogen and exists as a highly toxic pale yellow diatomic gas at standard conditions.'),
(10, 'E0010', 'Ne', 'Neon', 10, 20.1800, 'Noble gas', 'Gas', 'Neon is a chemical element with symbol Ne and atomic number 10.'),
(11, 'E0011', 'Na', 'Sodium', 11, 22.9900, 'Alkali metal', 'Solid', 'Sodium is a chemical element with symbol Na and atomic number 11.'),
(12, 'E0012', 'Mg', 'Magnesium', 12, 24.3050, 'Alkaline earth metal', 'Solid', 'Magnesium is a chemical element with symbol Mg and atomic number 12.'),
(13, 'E0013', 'Al', 'Aluminum', 13, 26.9820, 'Metal', 'Solid', 'Aluminum is a chemical element with symbol Al and atomic number 13.'),
(14, 'E0014', 'Si', 'Silicon', 14, 28.0855, 'Metalloid', 'Solid', 'Silicon is a chemical element with symbol Si and atomic number 14.'),
(15, 'E0015', 'P', 'Phosphorus', 15, 30.9738, 'Nonmetal', 'Solid', 'Phosphorus is a chemical element with symbol P and atomic number 15.'),
(16, 'E0016', 'S', 'Sulfur', 16, 32.0650, 'Nonmetal', 'Solid', 'Sulfur is a chemical element with symbol S and atomic number 16.'),
(17, 'E0017', 'Cl', 'Chlorine', 17, 35.4530, 'Halogen', 'Gas', 'Chlorine is a chemical element with symbol Cl and atomic number 17.'),
(18, 'E0018', 'Ar', 'Argon', 18, 39.9480, 'Noble gas', 'Gas', 'Argon is a chemical element with symbol Ar and atomic number 18.'),
(19, 'E0019', 'K', 'Potassium', 19, 39.0983, 'Alkali metal', 'Solid', 'Potassium is a chemical element with symbol K and atomic number 19.'),
(20, 'E0020', 'Ca', 'Calcium', 20, 40.0780, 'Alkaline earth metal', 'Solid', 'Calcium is a chemical element with symbol Ca and atomic number 20.'),
(21, 'E0021', 'Sc', 'Scandium', 21, 44.9559, 'Transition metal', 'Solid', 'Scandium is a chemical element with symbol Sc and atomic number 21.'),
(22, 'E0022', 'Ti', 'Titanium', 22, 47.8670, 'Transition metal', 'Solid', 'Titanium is a chemical element with symbol Ti and atomic number 22.'),
(23, 'E0023', 'V', 'Vanadium', 23, 50.9415, 'Transition metal', 'Solid', 'Vanadium is a chemical element with symbol V and atomic number 23.'),
(24, 'E0024', 'Cr', 'Chromium', 24, 51.9961, 'Transition metal', 'Solid', 'Chromium is a chemical element with symbol Cr and atomic number 24.'),
(25, 'E0025', 'Mn', 'Manganese', 25, 54.9380, 'Transition metal', 'Solid', 'Manganese is a chemical element with symbol Mn and atomic number 25.'),
(26, 'E0026', 'Fe', 'Iron', 26, 55.8450, 'Transition metal', 'Solid', 'Iron is a chemical element with symbol Fe and atomic number 26.');

-- --------------------------------------------------------

--
-- Структура таблицы `chemequipment`
--

CREATE TABLE `chemequipment` (
  `id` int(11) NOT NULL,
  `unique_id` varchar(50) NOT NULL,
  `name` varchar(50) NOT NULL,
  `description` text DEFAULT NULL,
  `manufacturer` varchar(50) DEFAULT NULL,
  `model` varchar(50) DEFAULT NULL,
  `storage_id` int(11) DEFAULT NULL,
  `material` varchar(50) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

--
-- Дамп данных таблицы `chemequipment`
--

INSERT INTO `chemequipment` (`id`, `unique_id`, `name`, `description`, `manufacturer`, `model`, `storage_id`, `material`) VALUES
(1, 'EQ0001', 'Beaker', 'Glass beaker for storage and transfer of liquid samples.', 'Glassware Co.', 'B-100', 1, 'Glass'),
(2, 'EQ0002', 'Distillation Flask', 'Glass flask for conducting the distillation process.', 'GlassTech', 'DistilLab-500', 1, 'Glass'),
(3, 'EQ0003', 'Chemical Funnel', 'Glass funnel for separating liquid phases and filtering solutions.', 'LabSupplies Ltd.', 'FunnelTech-200', 1, 'Glass'),
(4, 'EQ0004', 'Flat-Bottom Flask', 'Glass flask with a flat bottom for conducting various chemical reactions.', 'GlassTech', 'FlatFlask-100', 1, 'Glass'),
(5, 'EQ0005', 'Magnetic Stirrer', 'Laboratory device used to create a rotating magnetic field for stirring liquids.', 'LabTech Inc.', 'MagStir-3000', 1, 'Metal'),
(6, 'EQ0006', 'Burette', 'Glass tube with a valve at the bottom, used for precise dispensing of liquids.', 'Glassware Co.', 'Burette-200', 1, 'Glass'),
(7, 'EQ0007', 'Desiccator', 'Airtight container used to store substances in a dry environment.', 'DryTech Solutions', 'DesiDry-400', 1, 'Plastic'),
(8, 'EQ0008', 'Heating Mantle', 'Electrically heated device used to heat round-bottom flasks during chemical reactions.', 'HeaterTech Ltd.', 'HeatMantle-500', 1, 'Metal'),
(9, 'EQ0009', 'Chemical Reactor', 'Professional chemical reactor for conducting various chemical reactions.', 'ABC Chemicals', 'RX-1000', 1, 'Glass'),
(10, 'EQ0010', 'Gas Scrubber', 'Device for removing gases and vapors from chemical reactors.', 'XYZ Lab Equipment', 'GH-500', 1, 'Stainless Steel'),
(11, 'EQ0011', 'Chromatograph', 'Highly efficient chromatograph for analyzing components of mixtures.', 'LabTech Inc.', 'ChroMate-2000', 1, 'Metal'),
(12, 'EQ0012', 'Spectrophotometer', 'Device for measuring the optical density of solutions in various spectral regions.', 'Sigma Analytical', 'SpecTec-300', 1, 'Plastic');

-- --------------------------------------------------------

--
-- Структура таблицы `chemical_relationships`
--

CREATE TABLE `chemical_relationships` (
  `id` int(11) NOT NULL,
  `compound_id` int(11) NOT NULL,
  `element_id` int(11) NOT NULL,
  `quantity` int(11) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

--
-- Дамп данных таблицы `chemical_relationships`
--

INSERT INTO `chemical_relationships` (`id`, `compound_id`, `element_id`, `quantity`) VALUES
(1, 1, 1, 2),
(2, 1, 8, 1),
(3, 2, 6, 1),
(4, 2, 8, 2),
(5, 4, 7, 1),
(6, 4, 1, 3),
(7, 5, 6, 1),
(8, 5, 8, 1),
(9, 6, 6, 1),
(10, 6, 8, 1),
(11, 6, 1, 1),
(12, 7, 6, 2),
(13, 7, 8, 2),
(14, 7, 1, 1),
(15, 8, 6, 6),
(16, 8, 1, 12),
(17, 8, 8, 6),
(18, 9, 1, 1),
(19, 9, 17, 1),
(20, 10, 6, 2),
(21, 10, 1, 6),
(22, 10, 8, 1),
(23, 11, 1, 2),
(24, 11, 16, 1),
(25, 11, 8, 4),
(26, 12, 1, 1),
(27, 12, 7, 1),
(28, 12, 8, 3),
(29, 13, 6, 3),
(30, 13, 1, 6),
(31, 13, 8, 1),
(32, 14, 1, 1),
(33, 14, 7, 1),
(34, 14, 8, 1),
(35, 15, 1, 3),
(36, 15, 15, 1),
(37, 15, 8, 4),
(38, 16, 6, 2),
(39, 16, 1, 6),
(40, 16, 8, 2);

-- --------------------------------------------------------

--
-- Структура таблицы `chemical_storage`
--

CREATE TABLE `chemical_storage` (
  `id` int(11) NOT NULL,
  `storage_name` varchar(50) NOT NULL,
  `description` text DEFAULT NULL,
  `capacity` decimal(10,2) NOT NULL,
  `current_utilization` decimal(10,2) DEFAULT 0.00,
  `laboratory_id` int(11) NOT NULL,
  `storage_type` varchar(50) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

--
-- Дамп данных таблицы `chemical_storage`
--

INSERT INTO `chemical_storage` (`id`, `storage_name`, `description`, `capacity`, `current_utilization`, `laboratory_id`, `storage_type`) VALUES
(1, 'ChemSafe A', 'Storage for chemical equipment and reagents.', 1000.00, 600.00, 1, 'Chemical Storage'),
(2, 'LabGuard B', 'Secure storage for laboratory equipment and chemical substances.', 1500.00, 850.00, 1, 'Biochemical Warehouse'),
(3, 'SecureChem C', 'Warehouse for storing chemical reagents and test tubes.', 2000.00, 1200.00, 1, 'Chemical Stockroom'),
(4, 'ChemStock D', 'Storage for laboratory equipment and chemical preparations.', 1800.00, 1000.00, 1, 'Analytical Storage');

-- --------------------------------------------------------

--
-- Структура таблицы `chemmixture`
--

CREATE TABLE `chemmixture` (
  `id` int(11) NOT NULL,
  `unique_id` varchar(50) NOT NULL,
  `name` varchar(255) NOT NULL,
  `composition` text NOT NULL,
  `physical_properties` text DEFAULT NULL,
  `chemical_properties` text DEFAULT NULL,
  `mixture_type` varchar(100) DEFAULT NULL,
  `aggregate_state` varchar(100) DEFAULT NULL,
  `description` text DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

--
-- Дамп данных таблицы `chemmixture`
--

INSERT INTO `chemmixture` (`id`, `unique_id`, `name`, `composition`, `physical_properties`, `chemical_properties`, `mixture_type`, `aggregate_state`, `description`) VALUES
(1, 'M0001', 'Water - Sodium Chloride Solution', 'Water, Sodium Chloride', 'Clear liquid', 'Salt dissolved in water', 'Homogeneous', 'Liquid', 'Used for medical and laboratory purposes.'),
(2, 'M0002', 'Glucose Solution', 'Water, Glucose', 'Clear liquid', 'Sugar dissolved in water', 'Homogeneous', 'Liquid', 'Used as a solvent in various applications.'),
(3, 'M0003', 'Diluted Sodium Chloride Solution', 'Water, Sodium Chloride', 'Clear liquid', 'Higher concentration of salt in water', 'Homogeneous', 'Liquid', 'Used for medical purposes.'),
(4, 'M0004', 'Ammonia Solution', 'Water, Ammonia', 'Clear liquid with a pungent smell', 'Ammonia dissolved in water', 'Homogeneous', 'Liquid', 'Used in cleaning agents and as a solvent.'),
(5, 'M0005', 'Carbon Monoxide', 'Carbon Monoxide', 'Gas', 'Toxic gas', 'Homogeneous', 'Gas', 'Used in various industrial processes.'),
(6, 'M0006', 'Ethanol Solution', 'Water, Ethanol', 'Clear liquid', 'Alcohol dissolved in water', 'Homogeneous', 'Liquid', 'Used in alcoholic beverages and as a solvent.'),
(7, 'M0007', 'Acetic Acid Solution', 'Water, Acetic Acid', 'Clear liquid', 'Acidic solution', 'Homogeneous', 'Liquid', 'Used in cooking and cleaning products.'),
(8, 'M0008', 'Carbon Dioxide Solution', 'Water, Carbon Dioxide', 'Clear liquid', 'Carbonated water', 'Homogeneous', 'Liquid', 'Used as a beverage.'),
(9, 'M0009', 'Phosphoric Acid Solution', 'Water, Phosphoric Acid', 'Clear liquid', 'Acidic solution', 'Homogeneous', 'Liquid', 'Used in various industrial and food processing applications.'),
(10, 'M0010', 'Ammonium Hydroxide Solution', 'Water, Ammonium Hydroxide', 'Clear liquid', 'Basic solution', 'Homogeneous', 'Liquid', 'Used in various industrial processes.'),
(11, 'M0011', 'Nitric Acid Solution', 'Water, Nitric Acid', 'Clear liquid', 'Acidic solution', 'Homogeneous', 'Liquid', 'Used in the production of fertilizers and explosives.'),
(12, 'M0012', 'Acetone and Ammonium Hydroxide Mixture', 'Acetone, Ammonium Hydroxide, Phosphoric Acid', 'Clear liquid', 'Volatile and basic mixture', 'Heterogeneous', 'Liquid', 'Used in some industrial and laboratory processes.'),
(13, 'M0013', 'Ethylene Glycol Mixture', 'Ethylene Glycol, Water, Nitric Acid', 'Viscous liquid', 'Corrosive and toxic', 'Heterogeneous', 'Liquid', 'Used as antifreeze and in industrial applications.'),
(14, 'M0014', 'Example with Catalysts and Stabilizers', 'Water, Glucose, Acetone', 'Clear liquid', 'Catalysts and stabilizers present', 'Homogeneous', 'Liquid', 'Used as an example in chemistry experiments.'),
(15, 'M0015', 'Example with Buffers and Emulsifiers', 'Water, Acetic Acid, Phosphoric Acid', 'Clear liquid', 'Buffers and emulsifiers present', 'Homogeneous', 'Liquid', 'Used as an example in chemistry experiments.'),
(16, 'M0016', 'Hydrochloric Acid Solution', 'Water, Hydrochloric Acid', 'Clear liquid', 'Acidic solution', 'Homogeneous', 'Liquid', 'Used in various industrial processes and in the production of chemicals.'),
(17, 'M0017', 'Methanol Solution', 'Water, Methanol', 'Clear liquid', 'Volatile and flammable', 'Homogeneous', 'Liquid', 'Used as a solvent and fuel.'),
(18, 'M0018', 'Sulfuric Acid Solution', 'Water, Sulfuric Acid', 'Clear liquid', 'Acidic solution', 'Homogeneous', 'Liquid', 'Used in the production of fertilizers, chemicals, and explosives.'),
(19, 'M0019', 'Acetic Acid and Ammonium Hydroxide Mixture', 'Acetic Acid, Ammonium Hydroxide', 'Clear liquid', 'Acidic and basic mixture', 'Heterogeneous', 'Liquid', 'Used in some industrial and laboratory processes.'),
(20, 'M0020', 'Ethylene Glycol and Nitric Acid Mixture', 'Ethylene Glycol, Nitric Acid', 'Viscous liquid', 'Corrosive and toxic', 'Heterogeneous', 'Liquid', 'Used as antifreeze and in industrial applications.');

-- --------------------------------------------------------

--
-- Структура таблицы `employee`
--

CREATE TABLE `employee` (
  `id` int(11) NOT NULL,
  `name` varchar(255) NOT NULL,
  `surname` varchar(255) NOT NULL,
  `position` varchar(255) DEFAULT NULL,
  `department` varchar(255) DEFAULT NULL,
  `specialization` varchar(255) DEFAULT NULL,
  `lab_id` int(11) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

--
-- Дамп данных таблицы `employee`
--

INSERT INTO `employee` (`id`, `name`, `surname`, `position`, `department`, `specialization`, `lab_id`) VALUES
(1, 'John', 'Doe', 'Research Scientist', 'Chemistry', 'Organic Chemistry', 1),
(2, 'Alice', 'Smith', 'Lab Technician', 'Biology', 'Microbiology', 2),
(3, 'David', 'Johnson', 'Data Analyst', 'Physics', 'Astrophysics', 3),
(4, 'Emily', 'Brown', 'Lab Assistant', 'Materials Science', 'Nanotechnology', 4),
(5, 'Michael', 'Williams', 'Lab Manager', 'Chemistry', 'Analytical Chemistry', 1),
(6, 'Sarah', 'Davis', 'Lab Assistant', 'Biology', 'Genetics', 2),
(7, 'Christopher', 'Wilson', 'Data Scientist', 'Physics', 'Particle Physics', 3),
(8, 'Jessica', 'Miller', 'Lab Technician', 'Materials Science', 'Metallurgy', 4),
(9, 'William', 'Jones', 'Lab Technician', 'Chemistry', NULL, 1),
(10, 'Emma', 'Taylor', 'Research Scientist', 'Biology', NULL, 2),
(11, 'Oliver', 'Brown', 'Data Analyst', 'Physics', NULL, 3),
(12, 'Sophia', 'Wilson', 'Lab Assistant', 'Materials Science', NULL, 4);

-- --------------------------------------------------------

--
-- Структура таблицы `experiment`
--

CREATE TABLE `experiment` (
  `id` int(11) NOT NULL,
  `research_id` int(11) DEFAULT NULL,
  `name` varchar(255) NOT NULL,
  `description` text DEFAULT NULL,
  `start_date` date DEFAULT NULL,
  `end_date` date DEFAULT NULL,
  `status` enum('Completed','Ongoing','Pending') NOT NULL DEFAULT 'Pending'
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

--
-- Дамп данных таблицы `experiment`
--

INSERT INTO `experiment` (`id`, `research_id`, `name`, `description`, `start_date`, `end_date`, `status`) VALUES
(1, 1, 'Hypertension Medication Trial', 'Testing the efficacy of a new hypertension medication', '2023-05-10', '2024-05-10', 'Ongoing'),
(2, 2, 'Urban Bird Migration Observation', 'Observing bird migration patterns in urban areas', '2023-03-15', '2023-08-15', 'Completed'),
(3, 3, 'Stock Market Prediction Model Development', 'Developing a mathematical model for predicting stock market trends', '2023-07-01', '2024-07-01', 'Pending');

-- --------------------------------------------------------

--
-- Структура таблицы `experiment_expenses`
--

CREATE TABLE `experiment_expenses` (
  `id` int(11) NOT NULL,
  `experiment_id` int(11) DEFAULT NULL,
  `order_details_id` int(11) DEFAULT NULL,
  `inventory_id` int(11) DEFAULT NULL,
  `unique_id` varchar(50) DEFAULT NULL,
  `quantity_used` int(11) DEFAULT NULL,
  `unit_measure` varchar(10) DEFAULT NULL,
  `date_of_use` date DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

--
-- Дамп данных таблицы `experiment_expenses`
--

INSERT INTO `experiment_expenses` (`id`, `experiment_id`, `order_details_id`, `inventory_id`, `unique_id`, `quantity_used`, `unit_measure`, `date_of_use`) VALUES
(1, 1, 15, 22, 'M0002', 60, 'ml', '2024-05-01'),
(2, 1, 15, 22, 'M0002', 60, 'ml', '2024-05-05'),
(3, 1, 15, 22, 'M0002', 80, 'ml', '2024-05-10');

-- --------------------------------------------------------

--
-- Структура таблицы `experiment_results`
--

CREATE TABLE `experiment_results` (
  `id` int(11) NOT NULL,
  `experiment_id` int(11) NOT NULL,
  `result_substance` varchar(100) NOT NULL,
  `substance_type` enum('element','compound','mixture','equipment') NOT NULL,
  `quantity` decimal(10,2) NOT NULL,
  `unit_measure` varchar(10) NOT NULL,
  `laboratory_id` int(11) DEFAULT NULL,
  `receipt_date` date DEFAULT NULL,
  `description` text DEFAULT NULL,
  `safety_info` text DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

--
-- Дамп данных таблицы `experiment_results`
--

INSERT INTO `experiment_results` (`id`, `experiment_id`, `result_substance`, `substance_type`, `quantity`, `unit_measure`, `laboratory_id`, `receipt_date`, `description`, `safety_info`) VALUES
(1, 1, 'Water', 'compound', 100.00, 'ml', 1, '2024-06-03', 'Water is a transparent, tasteless, odorless, and nearly colorless chemical substance, which is the main constituent of Earth\'s streams, lakes, and oceans.', 'Handle with care, avoid contact with skin.'),
(2, 1, 'Salt', 'element', 20.00, 'g', 2, '2024-06-03', 'Sodium chloride, commonly known as salt, is an ionic compound with the chemical formula NaCl, representing a 1:1 ratio of sodium and chloride ions.', 'Store in a cool, dry place.'),
(3, 2, 'Ethanol', 'compound', 60.00, 'ml', 3, '2024-06-04', 'Ethanol, also called ethyl alcohol, grain alcohol, or alcohol, is a chemical compound', 'Flammable, store away from heat sources.');

-- --------------------------------------------------------

--
-- Структура таблицы `inventory`
--

CREATE TABLE `inventory` (
  `id` int(11) NOT NULL,
  `unique_id` varchar(50) NOT NULL,
  `item_name` varchar(100) DEFAULT NULL,
  `item_type` enum('element','compound','mixture','equipment') DEFAULT NULL,
  `quantity` int(11) DEFAULT NULL,
  `substance_quantity` decimal(10,2) DEFAULT NULL,
  `measurement_unit` varchar(50) DEFAULT NULL,
  `storage_id` int(11) DEFAULT NULL,
  `receipt_date` date DEFAULT current_timestamp(),
  `expiration_date` date DEFAULT NULL,
  `supplier` varchar(255) DEFAULT NULL,
  `last_updated` timestamp NOT NULL DEFAULT current_timestamp() ON UPDATE current_timestamp(),
  `status` enum('available','reserved','used') DEFAULT 'available',
  `description` text DEFAULT NULL,
  `safety_info` text DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

--
-- Дамп данных таблицы `inventory`
--

INSERT INTO `inventory` (`id`, `unique_id`, `item_name`, `item_type`, `quantity`, `substance_quantity`, `measurement_unit`, `storage_id`, `receipt_date`, `expiration_date`, `supplier`, `last_updated`, `status`, `description`, `safety_info`) VALUES
(1, 'EQ0001', 'Beaker', 'equipment', 10, NULL, NULL, 1, '2024-01-01', NULL, 'Glassware Co.', '2024-05-31 12:09:24', 'available', 'Glass beaker for storage and transfer of liquid samples.', 'Handle with care, fragile.'),
(2, 'EQ0002', 'Distillation Flask', 'equipment', 5, NULL, NULL, 1, '2024-01-01', NULL, 'GlassTech', '2024-05-31 12:09:24', 'available', 'Glass flask for conducting the distillation process.', 'Handle with care, fragile.'),
(3, 'EQ0003', 'Chemical Funnel', 'equipment', 20, NULL, NULL, 1, '2024-01-01', NULL, 'LabSupplies Ltd.', '2024-05-31 12:09:24', 'available', 'Glass funnel for separating liquid phases and filtering solutions.', 'Handle with care, fragile.'),
(4, 'EQ0004', 'Flat-Bottom Flask', 'equipment', 15, NULL, NULL, 1, '2024-01-01', NULL, 'GlassTech', '2024-05-31 12:09:24', 'available', 'Glass flask with a flat bottom for conducting various chemical reactions.', 'Handle with care, fragile.'),
(5, 'EQ0005', 'Magnetic Stirrer', 'equipment', 5, NULL, NULL, 1, '2024-01-01', NULL, 'LabTech Inc.', '2024-05-31 12:09:24', 'available', 'Laboratory device used to create a rotating magnetic field for stirring liquids.', 'Handle with care, electric equipment.'),
(6, 'EQ0006', 'Burette', 'equipment', 12, NULL, NULL, 1, '2024-01-01', NULL, 'Glassware Co.', '2024-05-31 12:09:24', 'available', 'Glass tube with a valve at the bottom, used for precise dispensing of liquids.', 'Handle with care, fragile.'),
(7, 'EQ0007', 'Desiccator', 'equipment', 8, NULL, NULL, 1, '2024-01-01', NULL, 'DryTech Solutions', '2024-05-31 12:09:24', 'available', 'Airtight container used to store substances in a dry environment.', 'Handle with care, fragile.'),
(8, 'EQ0008', 'Heating Mantle', 'equipment', 3, NULL, NULL, 1, '2024-01-01', NULL, 'HeaterTech Ltd.', '2024-05-31 12:09:24', 'available', 'Electrically heated device used to heat round-bottom flasks during chemical reactions.', 'Handle with care, electric equipment.'),
(9, 'EQ0009', 'Chemical Reactor', 'equipment', 2, NULL, NULL, 1, '2024-01-01', NULL, 'ABC Chemicals', '2024-05-31 12:09:24', 'available', 'Professional chemical reactor for conducting various chemical reactions.', 'Handle with care, fragile.'),
(10, 'EQ0010', 'Gas Scrubber', 'equipment', 2, NULL, NULL, 1, '2024-01-01', NULL, 'XYZ Lab Equipment', '2024-05-31 12:09:24', 'available', 'Device for removing gases and vapors from chemical reactors.', 'Handle with care, chemical equipment.'),
(11, 'EQ0011', 'Chromatograph', 'equipment', 1, NULL, NULL, 1, '2024-01-01', NULL, 'LabTech Inc.', '2024-05-31 12:09:24', 'available', 'Highly efficient chromatograph for analyzing components of mixtures.', 'Handle with care, precision equipment.'),
(12, 'EQ0012', 'Spectrophotometer', 'equipment', 1, NULL, NULL, 1, '2024-01-01', NULL, 'Sigma Analytical', '2024-05-31 12:09:24', 'available', 'Device for measuring the optical density of solutions in various spectral regions.', 'Handle with care, precision equipment.'),
(13, 'E0005', 'Boron', 'element', 1, 1000.00, 'g', 1, '2024-01-01', '2026-01-01', 'Chemical Supplier Inc.', '2024-05-31 12:09:24', 'available', 'Boron is a chemical element with symbol B and atomic number 5. It is a low-abundance element in the Earth\'s crust and is primarily produced by the mining of borate minerals.', 'Handle with care, avoid contact with skin.'),
(14, 'E0009', 'Fluorine', 'element', 100, 100.00, 'mg', 1, '2024-01-01', '2025-01-01', 'Chemical Co.', '2024-05-31 12:09:24', 'available', 'Fluorine is a chemical element with symbol F and atomic number 9. It is the lightest halogen and exists as a highly toxic pale yellow diatomic gas at standard conditions.', 'Highly reactive, handle with caution.'),
(15, 'E0020', 'Calcium', 'element', 500, 500.00, 'mg', 1, '2024-01-01', '2026-01-01', 'Chemical Products Ltd.', '2024-05-31 12:09:24', 'available', 'Calcium is a chemical element with symbol Ca and atomic number 20. It is an essential constituent of the bones and teeth and is the most abundant mineral in the human body.', 'Store in a cool, dry place.'),
(16, 'E0025', 'Manganese', 'element', 50, 50.00, 'mg', 1, '2024-01-01', '2025-01-01', 'Chemical Supplier Inc.', '2024-05-31 12:09:24', 'available', 'Manganese is a chemical element with symbol Mn and atomic number 25. It is essential to iron and steel production by virtue of its sulfur-fixing, deoxidizing, and alloying properties.', 'Wear gloves when handling.'),
(17, 'E0001', 'Hydrogen', 'element', 25, 50.00, 'L', 1, '2024-01-01', '2025-01-01', 'Gas Supplier Inc.', '2024-05-31 12:09:24', 'available', 'Hydrogen is a chemical element with symbol H and atomic number 1. It is the lightest element in the periodic table.', 'Flammable gas, handle with care.'),
(18, 'E0002', 'Helium', 'element', 15, 30.00, 'L', 1, '2024-01-01', '2025-01-01', 'Gas Supplier Inc.', '2024-05-31 12:09:24', 'available', 'Helium is a chemical element with symbol He and atomic number 2. It is a colorless, odorless, tasteless, non-toxic, inert, monatomic gas.', 'Inert gas, non-flammable.'),
(19, 'E0003', 'Lithium', 'element', 3, 6.00, 'kg', 1, '2024-01-01', '2026-01-01', 'Metal Supplier Inc.', '2024-05-31 12:09:24', 'available', 'Lithium is a chemical element with symbol Li and atomic number 3. It is a soft, silvery-white alkali metal.', 'Store in a cool, dry place.'),
(20, 'E0004', 'Beryllium', 'element', 1, 2.00, 'kg', 1, '2024-01-01', '2026-01-01', 'Metal Supplier Inc.', '2024-05-31 12:09:24', 'available', 'Beryllium is a chemical element with symbol Be and atomic number 4. It is a relatively rare element in the universe, usually occurring as a product of the spallation of larger atomic nuclei.', 'Toxic, handle with gloves.'),
(21, 'M0001', 'Water - Sodium Chloride Solution', 'mixture', 10, 100.00, 'L', 1, '2024-01-01', '2024-12-31', 'Chemical Supplier Inc.', '2024-05-31 12:09:24', 'available', 'Water - Sodium Chloride Solution is used for medical and laboratory purposes.', 'Handle with care, avoid contact with skin.'),
(22, 'M0002', 'Glucose Solution', 'mixture', 5, 200.00, 'ml', 1, '2024-01-01', '2024-12-31', 'Chemical Co.', '2024-06-03 15:22:30', 'available', 'Glucose Solution is used as a solvent in various applications.', 'Handle with caution.'),
(23, 'M0003', 'Diluted Sodium Chloride Solution', 'mixture', 20, 150.00, 'L', 1, '2024-01-01', '2024-12-31', 'Chemical Supplier Inc.', '2024-05-31 12:09:24', 'available', 'Diluted Sodium Chloride Solution is used for medical purposes.', 'Handle with care, avoid contact with skin.'),
(24, 'M0004', 'Ammonia Solution', 'mixture', 15, 180.00, 'L', 1, '2024-01-01', '2024-12-31', 'Chemical Products Ltd.', '2024-05-31 12:09:24', 'available', 'Ammonia Solution is used in cleaning agents and as a solvent.', 'Use in well-ventilated areas.'),
(25, 'M0005', 'Carbon Monoxide', 'mixture', 1, 5.00, 'm3', 1, '2024-01-01', NULL, 'Gas Supplier', '2024-05-31 12:09:24', 'available', 'Carbon Monoxide is used in various industrial processes.', 'Toxic gas, handle with extreme caution.'),
(26, 'M0006', 'Ethanol Solution', 'mixture', 8, 300.00, 'L', 1, '2024-01-01', '2024-12-31', 'Chemical Co.', '2024-05-31 12:09:24', 'available', 'Ethanol Solution is used in alcoholic beverages and as a solvent.', 'Flammable, store away from heat sources.'),
(27, 'M0007', 'Acetic Acid Solution', 'mixture', 12, 250.00, 'L', 1, '2024-01-01', '2024-12-31', 'Chemical Products Ltd.', '2024-05-31 12:09:24', 'available', 'Acetic Acid Solution is used in cooking and cleaning products.', 'Corrosive, handle with gloves.'),
(28, 'M0008', 'Carbon Dioxide Solution', 'mixture', 5, 80.00, 'L', 1, '2024-01-01', '2024-12-31', 'Gas Supplier', '2024-05-31 12:09:24', 'available', 'Carbon Dioxide Solution is used as a beverage.', 'Use in well-ventilated areas.'),
(29, 'M0009', 'Phosphoric Acid Solution', 'mixture', 10, 120.00, 'L', 1, '2024-01-01', '2024-12-31', 'Chemical Co.', '2024-05-31 12:09:24', 'available', 'Phosphoric Acid Solution is used in various industrial and food processing applications.', 'Corrosive, handle with gloves.'),
(30, 'M0010', 'Ammonium Hydroxide Solution', 'mixture', 5, 150.00, 'L', 1, '2024-01-01', '2024-12-31', 'Chemical Products Ltd.', '2024-05-31 12:09:24', 'available', 'Ammonium Hydroxide Solution is used in various industrial processes.', 'Basic solution, handle with care.'),
(31, 'M0011', 'Nitric Acid Solution', 'mixture', 8, 200.00, 'L', 1, '2024-01-01', '2024-12-31', 'Chemical Co.', '2024-05-31 12:09:24', 'available', 'Nitric Acid Solution is used in the production of fertilizers and explosives.', 'Corrosive, handle with gloves and eye protection.'),
(32, 'C0001', 'Water', 'compound', 50, 50.00, 'L', 1, '2024-05-31', NULL, 'Chemical Co.', '2024-05-31 12:09:24', 'available', 'Water is a transparent, tasteless, odorless, and nearly colorless chemical substance, which is the main constituent of Earth\'s streams, lakes, and oceans.', 'Handle with care, avoid contact with skin.'),
(33, 'C0002', 'Carbon Dioxide', 'compound', 30, 30.00, 'L', 1, '2024-05-31', NULL, 'Gas Supplier', '2024-05-31 12:09:24', 'available', 'Carbon dioxide is a colorless gas with a density about 60% higher than that of dry air.', 'Use in well-ventilated areas.'),
(34, 'C0003', 'Sodium Chloride', 'compound', 40, 40.00, 'kg', 1, '2024-05-31', NULL, 'Chemical Products Ltd.', '2024-05-31 12:09:24', 'available', 'Sodium chloride, commonly known as salt, is an ionic compound with the chemical formula NaCl, representing a 1:1 ratio of sodium and chloride ions.', 'Store in a dry place.'),
(35, 'C0004', 'Ammonia', 'compound', 20, 20.00, 'L', 1, '2024-05-31', NULL, 'Chemical Supplier Inc.', '2024-05-31 12:09:24', 'available', 'Ammonia is a compound of nitrogen and hydrogen with the formula NH3.', 'Use in well-ventilated areas.'),
(36, 'C0005', 'Carbon Monoxide', 'compound', 5, 5.00, 'm3', 1, '2024-05-31', NULL, 'Gas Supplier', '2024-05-31 12:09:24', 'available', 'Carbon monoxide is a colorless, odorless, and tasteless gas that is slightly less dense than air.', 'Toxic gas, handle with extreme caution.'),
(37, 'C0006', 'Methanol', 'compound', 25, 25.00, 'L', 1, '2024-05-31', NULL, 'Chemical Co.', '2024-05-31 12:09:24', 'available', 'Methanol, also known as methyl alcohol amongst other names, is a chemical with the formula CH3OH.', 'Flammable, store away from heat sources.'),
(38, 'C0007', 'Acetic Acid', 'compound', 15, 15.00, 'L', 1, '2024-05-31', NULL, 'Chemical Products Ltd.', '2024-05-31 12:09:24', 'available', 'Acetic acid, systematically named ethanoic acid, is a colorless liquid organic compound with the chemical formula CH3COOH.', 'Corrosive, handle with gloves.'),
(39, 'C0008', 'Glucose', 'compound', 60, 60.00, 'kg', 1, '2024-05-31', NULL, 'Chemical Co.', '2024-05-31 12:09:24', 'available', 'Glucose is a simple sugar with the molecular formula C6H12O6.', 'Store in a cool, dry place.'),
(40, 'C0009', 'Hydrochloric Acid', 'compound', 10, 10.00, 'L', 1, '2024-05-31', NULL, 'Chemical Products Ltd.', '2024-05-31 12:09:24', 'available', 'Hydrochloric acid is a colorless inorganic chemical system with the formula HCl', 'Corrosive, handle with gloves.'),
(41, 'C0010', 'Ethanol', 'compound', 35, 35.00, 'L', 1, '2024-05-31', NULL, 'Chemical Co.', '2024-05-31 12:09:24', 'available', 'Ethanol, also called ethyl alcohol, grain alcohol, or alcohol, is a chemical compound', 'Flammable, store away from heat sources.'),
(42, 'C0011', 'Sulfuric Acid', 'compound', 8, 8.00, 'L', 1, '2024-05-31', NULL, 'Chemical Products Ltd.', '2024-05-31 12:09:24', 'available', 'Sulfuric acid is a strong mineral acid with the molecular formula H2SO4', 'Corrosive, handle with gloves and eye protection.'),
(43, 'C0012', 'Nitric Acid', 'compound', 12, 12.00, 'L', 1, '2024-05-31', NULL, 'Chemical Co.', '2024-05-31 12:09:24', 'available', 'Nitric acid is a mineral acid also known as aqua fortis and spirit of niter.', 'Corrosive, handle with gloves and eye protection.'),
(44, 'C0013', 'Acetone', 'compound', 30, 30.00, 'L', 1, '2024-05-31', NULL, 'Chemical Supplier Inc.', '2024-05-31 12:09:24', 'available', 'Acetone is a colorless, volatile, flammable liquid used as a solvent and in nail polish removers.', 'Flammable, store in a cool, well-ventilated place.'),
(45, 'C0014', 'Ammonium Hydroxide', 'compound', 20, 20.00, 'L', 1, '2024-05-31', NULL, 'Chemical Co.', '2024-05-31 12:09:24', 'available', 'Ammonium hydroxide, also known as ammonia water, ammonia solution, or aqueous ammonia.', 'Basic solution, handle with care.'),
(46, 'C0015', 'Phosphoric Acid', 'compound', 10, 10.00, 'L', 1, '2024-05-31', NULL, 'Chemical Products Ltd.', '2024-05-31 12:09:24', 'available', 'Phosphoric acid is a weak acid with the chemical formula H3PO4.', 'Corrosive, handle with gloves.'),
(112, 'EXP-1', 'Water', 'compound', 1, 100.00, 'ml', 2, '2024-06-03', '2015-06-25', 'Chemistry Lab', '2024-06-04 20:41:02', 'available', NULL, NULL);

-- --------------------------------------------------------

--
-- Структура таблицы `laboratory`
--

CREATE TABLE `laboratory` (
  `id` int(11) NOT NULL,
  `lab_name` varchar(50) NOT NULL,
  `location` varchar(100) NOT NULL,
  `address` varchar(255) DEFAULT NULL,
  `description` text DEFAULT NULL,
  `specialization` varchar(50) DEFAULT NULL,
  `lab_type` varchar(50) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

--
-- Дамп данных таблицы `laboratory`
--

INSERT INTO `laboratory` (`id`, `lab_name`, `location`, `address`, `description`, `specialization`, `lab_type`) VALUES
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
-- Структура таблицы `mixture_composition`
--

CREATE TABLE `mixture_composition` (
  `id` int(11) NOT NULL,
  `mixture_id` int(11) NOT NULL,
  `compound_id` int(11) NOT NULL,
  `concentration` decimal(5,2) NOT NULL,
  `substance_amount` decimal(10,2) NOT NULL,
  `measurement_unit` varchar(10) NOT NULL,
  `substance_function` varchar(50) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

--
-- Дамп данных таблицы `mixture_composition`
--

INSERT INTO `mixture_composition` (`id`, `mixture_id`, `compound_id`, `concentration`, `substance_amount`, `measurement_unit`, `substance_function`) VALUES
(1, 1, 1, 90.00, 895.00, 'ml', 'Solvent'),
(2, 1, 3, 10.00, 105.00, 'g', 'Solute'),
(3, 2, 1, 80.00, 810.00, 'ml', 'Solvent'),
(4, 2, 8, 20.00, 190.00, 'g', 'Solute'),
(5, 3, 1, 70.00, 715.00, 'ml', 'Solvent'),
(6, 3, 3, 30.00, 285.00, 'g', 'Solute'),
(7, 4, 1, 95.00, 940.00, 'ml', 'Solvent'),
(8, 4, 4, 5.00, 45.00, 'g', 'Solute'),
(9, 5, 5, 100.00, 98.00, 'g', 'Primary Gas'),
(10, 6, 1, 70.00, 705.00, 'ml', 'Solvent'),
(11, 6, 10, 30.00, 295.00, 'ml', 'Solute'),
(12, 7, 1, 30.00, 310.00, 'ml', 'Solvent'),
(13, 7, 7, 70.00, 690.00, 'ml', 'Solute'),
(14, 8, 1, 90.00, 885.00, 'ml', 'Solvent'),
(15, 8, 2, 10.00, 115.00, 'g', 'Solute'),
(16, 9, 1, 50.00, 505.00, 'ml', 'Solvent'),
(17, 9, 15, 50.00, 495.00, 'ml', 'Solute'),
(18, 10, 1, 80.00, 795.00, 'ml', 'Solvent'),
(19, 10, 14, 20.00, 205.00, 'ml', 'Solute'),
(20, 11, 1, 60.00, 615.00, 'ml', 'Solvent'),
(21, 11, 12, 40.00, 385.00, 'ml', 'Solute'),
(22, 12, 13, 50.00, 510.00, 'ml', 'Solvent'),
(23, 12, 14, 30.00, 295.00, 'ml', 'Solute'),
(24, 12, 15, 20.00, 195.00, 'ml', 'Stabilizer'),
(25, 13, 16, 50.00, 520.00, 'ml', 'Antifreeze'),
(26, 13, 11, 30.00, 305.00, 'ml', 'Corrosive Agent'),
(27, 13, 1, 20.00, 175.00, 'ml', 'Solvent'),
(28, 14, 1, 85.00, 840.00, 'ml', 'Solvent'),
(29, 14, 8, 10.00, 95.00, 'g', 'Solute'),
(30, 14, 13, 5.00, 65.00, 'ml', 'Catalyst'),
(31, 15, 1, 50.00, 490.00, 'ml', 'Solvent'),
(32, 15, 7, 30.00, 305.00, 'ml', 'Solute'),
(33, 15, 15, 20.00, 205.00, 'ml', 'Buffer'),
(34, 16, 1, 80.00, 785.00, 'ml', 'Solvent'),
(35, 16, 9, 20.00, 195.00, 'ml', 'Solute'),
(36, 17, 1, 75.00, 735.00, 'ml', 'Solvent'),
(37, 17, 6, 25.00, 255.00, 'ml', 'Solute'),
(38, 18, 1, 60.00, 615.00, 'ml', 'Solvent'),
(39, 18, 11, 40.00, 395.00, 'ml', 'Anti-oxidant'),
(40, 19, 7, 70.00, 695.00, 'ml', 'Solvent'),
(41, 19, 14, 30.00, 310.00, 'ml', 'Solute'),
(42, 20, 16, 65.00, 640.00, 'ml', 'Antifreeze'),
(43, 20, 12, 35.00, 335.00, 'ml', 'Corrosive Agent');

-- --------------------------------------------------------

--
-- Структура таблицы `order`
--

CREATE TABLE `order` (
  `id` int(11) NOT NULL,
  `order_number` varchar(10) NOT NULL,
  `research_id` int(11) NOT NULL,
  `order_date` date NOT NULL,
  `comment` text NOT NULL,
  `employee_id` int(11) NOT NULL,
  `last_updated` timestamp NOT NULL DEFAULT current_timestamp() ON UPDATE current_timestamp(),
  `status` enum('active','completed','canceled') DEFAULT 'active'
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

--
-- Дамп данных таблицы `order`
--

INSERT INTO `order` (`id`, `order_number`, `research_id`, `order_date`, `comment`, `employee_id`, `last_updated`, `status`) VALUES
(1, 'ORD001', 1, '2024-05-01', 'Order for experiment A', 2, '2024-06-03 13:11:55', 'active'),
(2, 'ORD002', 3, '2024-05-15', 'Preparation for research B', 3, '2024-06-03 13:53:20', 'active'),
(3, 'ORD003', 2, '2024-05-20', 'Order for experiment C', 1, '2024-06-03 13:13:51', 'completed'),
(4, 'ORD004', 4, '2024-05-25', 'Current project D', 4, '2024-06-03 13:12:08', 'active'),
(5, 'ORD005', 1, '2024-05-30', 'Upcoming experiment E', 2, '2024-06-03 13:12:12', 'active'),
(6, 'ORD006', 1, '2024-06-05', 'Order for experiment A', 2, '2024-06-03 13:48:05', 'completed'),
(7, 'ORD007', 2, '2024-06-10', 'Order for research B', 3, '2024-06-03 13:12:20', 'active'),
(8, 'ORD008', 3, '2024-06-15', 'Current project C', 4, '2024-06-15 11:00:00', 'active'),
(9, 'ORD009', 4, '2024-06-20', 'Preparation for experiment D', 2, '2024-06-03 13:12:23', 'active'),
(10, 'ORD010', 1, '2024-06-25', 'Preparation for experiment E', 3, '2024-06-03 12:49:30', 'active'),
(11, 'ORD011', 6, '2024-06-30', 'Preparation for experiment F', 1, '2024-06-02 15:24:17', 'active'),
(12, 'ORD012', 7, '2024-07-05', 'Preparation for experiment G', 4, '2024-06-02 15:24:17', 'active'),
(13, 'ORD013', 8, '2024-07-10', 'Preparation for experiment H', 2, '2024-06-03 12:44:20', 'canceled'),
(14, 'ORD014', 9, '2024-07-15', 'Order for research I', 3, '2024-07-15 17:00:00', 'completed'),
(15, 'ORD015', 1, '2024-07-20', 'Order for experiment J', 1, '2024-07-20 18:00:00', 'completed'),
(16, 'ORD016', 1, '2024-07-25', 'Current project K', 4, '2024-07-25 19:00:00', 'active'),
(17, 'ORD017', 1, '2024-07-30', 'Preparation for experiment L', 2, '2024-06-02 15:24:17', 'active'),
(18, 'ORD018', 2, '2024-08-01', 'Preparation for experiment M', 3, '2024-06-02 15:24:17', 'active'),
(19, 'ORD019', 2, '2024-08-05', 'Preparation for experiment N', 1, '2024-06-02 15:24:17', 'active'),
(20, 'ORD020', 2, '2024-08-10', 'Preparation for experiment O', 4, '2024-06-02 15:24:17', 'active'),
(21, 'ORD021', 2, '2024-08-15', 'Preparation for experiment P', 2, '2024-06-02 15:24:17', 'active'),
(22, 'ORD022', 2, '2024-08-20', 'Preparation for experiment Q', 3, '2024-06-02 15:24:17', 'active'),
(23, 'ORD023', 10, '2024-08-25', 'Preparation for experiment R', 1, '2024-06-02 15:24:17', 'active'),
(24, 'ORD024', 1, '2024-08-30', 'Preparation for experiment S', 4, '2024-06-02 15:24:17', 'active'),
(25, 'ORD025', 1, '2024-09-01', 'Preparation for experiment T', 2, '2024-06-02 15:24:17', 'active'),
(26, 'ORD026', 4, '2024-09-05', 'Preparation for experiment U', 3, '2024-06-02 15:24:17', 'active'),
(27, 'ORD027', 4, '2024-09-10', 'Preparation for experiment V', 1, '2024-06-02 15:24:17', 'active'),
(28, 'ORD028', 4, '2024-09-15', 'Preparation for experiment W', 4, '2024-06-02 15:24:17', 'active'),
(29, 'ORD029', 4, '2024-09-20', 'Preparation for experiment X', 2, '2024-06-02 15:24:17', 'active'),
(30, 'ORD030', 5, '2024-09-25', 'Preparation for experiment Y', 3, '2024-06-02 15:24:17', 'active'),
(31, 'ORD031', 5, '2024-09-30', 'Preparation for experiment Z', 1, '2024-06-02 15:24:17', 'active'),
(32, 'ORD032', 5, '2024-10-01', 'Preparation for experiment AA', 4, '2024-06-02 15:24:17', 'active');

-- --------------------------------------------------------

--
-- Структура таблицы `order_details`
--

CREATE TABLE `order_details` (
  `id` int(11) NOT NULL,
  `inventory_id` int(11) NOT NULL,
  `unique_id` varchar(50) DEFAULT NULL,
  `reserved_quantity` int(11) NOT NULL,
  `reservation_date` datetime NOT NULL,
  `return_date` datetime DEFAULT NULL,
  `status` enum('reserved','returned','in use') DEFAULT 'reserved',
  `last_updated` timestamp NOT NULL DEFAULT current_timestamp() ON UPDATE current_timestamp(),
  `order_number` varchar(10) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

--
-- Дамп данных таблицы `order_details`
--

INSERT INTO `order_details` (`id`, `inventory_id`, `unique_id`, `reserved_quantity`, `reservation_date`, `return_date`, `status`, `last_updated`, `order_number`) VALUES
(1, 1, 'EQ0001', 5, '2024-05-01 00:00:00', NULL, 'reserved', '2024-06-03 13:12:44', 'ORD001'),
(2, 2, 'EQ0002', 10, '2024-05-15 00:00:00', NULL, 'returned', '2024-06-03 13:40:45', 'ORD002'),
(3, 3, 'EQ0003', 7, '2024-05-20 00:00:00', '2024-06-03 16:13:51', 'returned', '2024-06-03 13:13:51', 'ORD003'),
(4, 4, 'EQ0004', 3, '2024-05-25 00:00:00', '2024-06-03 00:00:00', 'returned', '2024-06-03 11:56:44', 'ORD004'),
(5, 5, 'EQ0005', 12, '2024-05-30 00:00:00', '2024-06-03 16:11:31', 'returned', '2024-06-03 13:11:31', 'ORD005'),
(6, 13, 'E0005', 1, '2024-06-05 00:00:00', '2024-06-10 00:00:00', 'returned', '2024-06-02 14:14:56', 'ORD006'),
(7, 14, 'E0009', 2, '2024-06-10 00:00:00', '2024-06-20 00:00:00', 'returned', '2024-06-02 14:14:56', 'ORD007'),
(8, 15, 'E0020', 3, '2024-06-15 00:00:00', NULL, 'returned', '2024-06-02 14:39:10', 'ORD008'),
(9, 16, 'E0025', 1, '2024-06-20 00:00:00', '2024-06-03 15:01:29', 'returned', '2024-06-03 12:01:29', 'ORD009'),
(10, 17, 'E0001', 2, '2024-06-25 00:00:00', NULL, 'in use', '2024-06-03 12:53:58', 'ORD010'),
(11, 18, 'E0002', 1, '2024-06-30 00:00:00', NULL, 'reserved', '2024-06-02 14:14:56', 'ORD011'),
(12, 19, 'E0003', 3, '2024-07-05 00:00:00', NULL, 'reserved', '2024-06-02 14:14:56', 'ORD012'),
(13, 20, 'E0004', 1, '2024-07-10 00:00:00', NULL, 'in use', '2024-06-03 12:46:22', 'ORD013'),
(14, 21, 'M0001', 2, '2024-07-15 00:00:00', NULL, 'reserved', '2024-06-03 13:13:06', 'ORD001'),
(15, 22, 'M0002', 1, '2024-07-20 00:00:00', NULL, 'reserved', '2024-06-03 13:13:03', 'ORD001'),
(16, 23, 'M0003', 3, '2024-07-25 00:00:00', '2024-06-03 16:11:31', 'returned', '2024-06-03 13:11:31', 'ORD005'),
(17, 24, 'M0004', 1, '2024-07-30 00:00:00', '2024-06-03 16:13:51', 'returned', '2024-06-03 13:13:51', 'ORD003'),
(18, 25, 'M0005', 2, '2024-08-01 00:00:00', '2024-06-03 16:48:05', 'returned', '2024-06-03 13:48:05', 'ORD006'),
(19, 26, 'M0006', 1, '2024-08-05 00:00:00', NULL, 'reserved', '2024-06-02 14:32:01', 'ORD011'),
(20, 27, 'M0007', 3, '2024-08-10 00:00:00', NULL, 'reserved', '2024-06-02 14:32:01', 'ORD008'),
(21, 28, 'M0008', 1, '2024-08-15 00:00:00', '2024-06-03 16:48:05', 'returned', '2024-06-03 13:48:05', 'ORD006'),
(22, 29, 'M0009', 2, '2024-08-20 00:00:00', NULL, 'reserved', '2024-06-03 13:12:49', 'ORD001'),
(23, 30, 'M0010', 1, '2024-08-25 00:00:00', NULL, 'reserved', '2024-06-03 13:53:20', 'ORD002'),
(24, 31, 'M0011', 3, '2024-08-30 00:00:00', NULL, 'reserved', '2024-06-02 14:32:01', 'ORD007'),
(25, 32, 'C0001', 1, '2024-09-01 00:00:00', '2024-06-03 00:00:00', 'returned', '2024-06-03 11:56:44', 'ORD004'),
(26, 33, 'C0002', 2, '2024-09-05 00:00:00', NULL, 'returned', '2024-06-03 13:40:50', 'ORD002'),
(27, 34, 'C0003', 1, '2024-09-10 00:00:00', NULL, 'returned', '2024-06-03 12:54:07', 'ORD010'),
(28, 35, 'C0004', 3, '2024-09-15 00:00:00', NULL, 'reserved', '2024-06-02 14:32:01', 'ORD008'),
(29, 36, 'C0005', 1, '2024-09-20 00:00:00', '2024-06-03 16:11:31', 'returned', '2024-06-03 13:11:31', 'ORD005'),
(30, 37, 'C0006', 2, '2024-09-25 00:00:00', NULL, 'returned', '2024-06-03 12:41:57', 'ORD013'),
(31, 38, 'C0007', 1, '2024-09-30 00:00:00', NULL, 'reserved', '2024-06-03 13:12:47', 'ORD001'),
(32, 39, 'C0008', 3, '2024-10-01 00:00:00', NULL, 'returned', '2024-06-03 12:42:03', 'ORD013');

--
-- Триггеры `order_details`
--
DELIMITER $$
CREATE TRIGGER `order_inventory_check_active` AFTER UPDATE ON `order_details` FOR EACH ROW BEGIN
    IF NEW.status = 'in use' or NEW.status = 'reserved' THEN
        -- Устанавливаем статус заказа как 'active'
        UPDATE `order`
        SET status = 'active'
        WHERE order_number = NEW.order_number;
    END IF;
END
$$
DELIMITER ;
DELIMITER $$
CREATE TRIGGER `order_inventory_check_completed` AFTER UPDATE ON `order_details` FOR EACH ROW BEGIN
    DECLARE all_returned BOOLEAN;

    -- Проверка, имеют ли все позиции заказа статус 'returned'
    SELECT COUNT(*) = 0 INTO all_returned
    FROM order_inventory
    WHERE order_number = NEW.order_number AND status != 'returned';

    -- Если все позиции имеют статус 'returned', обновляем статус заказа на 'completed'
    IF all_returned THEN
        UPDATE `order`
        SET status = 'completed'
        WHERE order_number = NEW.order_number;
    END IF;
END
$$
DELIMITER ;

-- --------------------------------------------------------

--
-- Структура таблицы `research`
--

CREATE TABLE `research` (
  `id` int(11) NOT NULL,
  `title` varchar(100) NOT NULL,
  `type` varchar(100) NOT NULL,
  `goal` text NOT NULL,
  `scope` varchar(100) NOT NULL,
  `research_object` varchar(100) NOT NULL,
  `funding_source` varchar(100) NOT NULL,
  `start_date` date NOT NULL,
  `end_date` date DEFAULT NULL,
  `status` enum('Completed','Ongoing','Pending') NOT NULL DEFAULT 'Pending'
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

--
-- Дамп данных таблицы `research`
--

INSERT INTO `research` (`id`, `title`, `type`, `goal`, `scope`, `research_object`, `funding_source`, `start_date`, `end_date`, `status`) VALUES
(1, 'Effects of New Drug on Hypertension Patients', 'Experimental', 'To investigate the effects of a new drug on hypertension patients.', 'Clinical trial', 'Hypertension patients', 'National Institute of Health', '2023-05-10', '2024-05-10', 'Ongoing'),
(2, 'Bird Migration Patterns in Urban Environments', 'Observational', 'To analyze the migration patterns of birds in urban environments.', 'Ecological study', 'Urban bird populations', 'National Audubon Society', '2023-03-15', '2023-08-15', 'Completed'),
(3, 'Mathematical Model for Stock Market Trends', 'Theoretical', 'To develop a mathematical model for predicting stock market trends.', 'Mathematical modeling', 'Stock market data', 'University Grant', '2023-07-01', '2024-07-01', 'Pending'),
(4, 'Effects of Climate Change on Coral Reefs', 'Experimental', 'To study the effects of climate change on coral reef ecosystems.', 'Ecological experiment', 'Coral reef ecosystems', 'National Science Foundation', '2023-06-20', NULL, 'Ongoing'),
(5, 'Behavior of Wild Chimpanzees', 'Observational', 'To observe the behavior of wild chimpanzees in their natural habitat.', 'Ethological study', 'Wild chimpanzees', 'Jane Goodall Institute', '2023-04-01', '2023-10-01', 'Completed'),
(6, 'Efficacy of New COVID-19 Vaccine', 'Experimental', 'To test the efficacy of a new vaccine for COVID-19.', 'Clinical trial', 'Human volunteers', 'World Health Organization', '2023-08-10', NULL, ''),
(7, 'Quantum Algorithm for Optimization Problems', 'Theoretical', 'To develop a quantum algorithm for solving optimization problems.', 'Quantum computing research', 'Quantum algorithms', 'Department of Defense', '2023-09-01', NULL, 'Ongoing'),
(8, 'Deforestation Effects on Amazon Biodiversity', 'Observational', 'To monitor the effects of deforestation on biodiversity in the Amazon rainforest.', 'Ecological study', 'Amazon rainforest', 'Environmental Protection Agency', '2023-07-15', NULL, 'Ongoing'),
(9, 'Impact of Fertilizer Types on Crop Yield', 'Experimental', 'To investigate the impact of fertilizer types on crop yield in agricultural fields.', 'Agricultural experiment', 'Crop fields', 'Agricultural Research Council', '2023-05-05', '2024-05-05', 'Completed'),
(10, 'New Theory of Dark Matter', 'Theoretical', 'To propose a new theory for the existence of dark matter in the universe.', 'Astrophysical theory', 'Dark matter', 'National Aeronautics and Space Administration', '2023-10-20', NULL, 'Pending');

-- --------------------------------------------------------

--
-- Структура таблицы `research_employee`
--

CREATE TABLE `research_employee` (
  `id` int(11) NOT NULL,
  `research_id` int(11) DEFAULT NULL,
  `employee_id` int(11) DEFAULT NULL,
  `role` varchar(100) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

--
-- Дамп данных таблицы `research_employee`
--

INSERT INTO `research_employee` (`id`, `research_id`, `employee_id`, `role`) VALUES
(1, 1, 1, 'Principal Investigator'),
(2, 1, 2, 'Research Assistant'),
(3, 1, 3, 'Research Assistant'),
(4, 1, 4, 'Technical Staff'),
(5, 1, 5, 'Intern'),
(6, 2, 6, 'Collaborator'),
(7, 2, 7, 'Co-Investigator'),
(8, 2, 8, 'Principal Investigator'),
(9, 2, 9, 'Research Assistant'),
(10, 2, 10, 'Co-Investigator'),
(11, 2, 11, 'Research Assistant'),
(12, 2, 12, 'Research Assistant');

--
-- Индексы сохранённых таблиц
--

--
-- Индексы таблицы `chemcompound`
--
ALTER TABLE `chemcompound`
  ADD PRIMARY KEY (`id`,`unique_id`) USING BTREE,
  ADD UNIQUE KEY `unique_id` (`unique_id`);

--
-- Индексы таблицы `chemelement`
--
ALTER TABLE `chemelement`
  ADD PRIMARY KEY (`id`,`unique_id`) USING BTREE,
  ADD UNIQUE KEY `unique_id` (`unique_id`);

--
-- Индексы таблицы `chemequipment`
--
ALTER TABLE `chemequipment`
  ADD PRIMARY KEY (`id`,`unique_id`) USING BTREE,
  ADD UNIQUE KEY `unique_id` (`unique_id`),
  ADD KEY `storage_id` (`storage_id`);

--
-- Индексы таблицы `chemical_relationships`
--
ALTER TABLE `chemical_relationships`
  ADD PRIMARY KEY (`id`),
  ADD KEY `chemelement` (`element_id`),
  ADD KEY `chemcompound` (`compound_id`);

--
-- Индексы таблицы `chemical_storage`
--
ALTER TABLE `chemical_storage`
  ADD PRIMARY KEY (`id`),
  ADD KEY `laboratory_id` (`laboratory_id`);

--
-- Индексы таблицы `chemmixture`
--
ALTER TABLE `chemmixture`
  ADD PRIMARY KEY (`id`,`unique_id`) USING BTREE,
  ADD UNIQUE KEY `unique_id` (`unique_id`);

--
-- Индексы таблицы `employee`
--
ALTER TABLE `employee`
  ADD PRIMARY KEY (`id`),
  ADD KEY `lab_id` (`lab_id`);

--
-- Индексы таблицы `experiment`
--
ALTER TABLE `experiment`
  ADD PRIMARY KEY (`id`),
  ADD KEY `research_id` (`research_id`);

--
-- Индексы таблицы `experiment_expenses`
--
ALTER TABLE `experiment_expenses`
  ADD PRIMARY KEY (`id`),
  ADD KEY `experiment_id` (`experiment_id`),
  ADD KEY `order_details_id` (`order_details_id`),
  ADD KEY `inventory_id` (`inventory_id`),
  ADD KEY `unique_id` (`unique_id`) USING BTREE;

--
-- Индексы таблицы `experiment_results`
--
ALTER TABLE `experiment_results`
  ADD PRIMARY KEY (`id`),
  ADD KEY `experiment_id` (`experiment_id`),
  ADD KEY `fk_laboratory_id` (`laboratory_id`);

--
-- Индексы таблицы `inventory`
--
ALTER TABLE `inventory`
  ADD PRIMARY KEY (`id`,`unique_id`) USING BTREE,
  ADD UNIQUE KEY `unique_id` (`unique_id`),
  ADD KEY `fk_storage_id` (`storage_id`);

--
-- Индексы таблицы `laboratory`
--
ALTER TABLE `laboratory`
  ADD PRIMARY KEY (`id`);

--
-- Индексы таблицы `mixture_composition`
--
ALTER TABLE `mixture_composition`
  ADD PRIMARY KEY (`id`),
  ADD KEY `mixture_id` (`mixture_id`),
  ADD KEY `compound_id` (`compound_id`);

--
-- Индексы таблицы `order`
--
ALTER TABLE `order`
  ADD PRIMARY KEY (`id`,`order_number`) USING BTREE,
  ADD UNIQUE KEY `order_number` (`order_number`),
  ADD KEY `fk_research_id` (`research_id`),
  ADD KEY `fk_employee_id` (`employee_id`);

--
-- Индексы таблицы `order_details`
--
ALTER TABLE `order_details`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `unique_id` (`unique_id`),
  ADD KEY `inventory_id` (`inventory_id`),
  ADD KEY `fk_order_number` (`order_number`);

--
-- Индексы таблицы `research`
--
ALTER TABLE `research`
  ADD PRIMARY KEY (`id`);

--
-- Индексы таблицы `research_employee`
--
ALTER TABLE `research_employee`
  ADD PRIMARY KEY (`id`),
  ADD KEY `employee_id` (`employee_id`),
  ADD KEY `research_id` (`research_id`);

--
-- AUTO_INCREMENT для сохранённых таблиц
--

--
-- AUTO_INCREMENT для таблицы `chemcompound`
--
ALTER TABLE `chemcompound`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=17;

--
-- AUTO_INCREMENT для таблицы `chemequipment`
--
ALTER TABLE `chemequipment`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=13;

--
-- AUTO_INCREMENT для таблицы `chemical_relationships`
--
ALTER TABLE `chemical_relationships`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=41;

--
-- AUTO_INCREMENT для таблицы `employee`
--
ALTER TABLE `employee`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=13;

--
-- AUTO_INCREMENT для таблицы `experiment`
--
ALTER TABLE `experiment`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=4;

--
-- AUTO_INCREMENT для таблицы `experiment_expenses`
--
ALTER TABLE `experiment_expenses`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=11;

--
-- AUTO_INCREMENT для таблицы `experiment_results`
--
ALTER TABLE `experiment_results`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=4;

--
-- AUTO_INCREMENT для таблицы `inventory`
--
ALTER TABLE `inventory`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=113;

--
-- AUTO_INCREMENT для таблицы `laboratory`
--
ALTER TABLE `laboratory`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=12;

--
-- AUTO_INCREMENT для таблицы `mixture_composition`
--
ALTER TABLE `mixture_composition`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=130;

--
-- AUTO_INCREMENT для таблицы `order`
--
ALTER TABLE `order`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=33;

--
-- AUTO_INCREMENT для таблицы `order_details`
--
ALTER TABLE `order_details`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=33;

--
-- AUTO_INCREMENT для таблицы `research`
--
ALTER TABLE `research`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=11;

--
-- AUTO_INCREMENT для таблицы `research_employee`
--
ALTER TABLE `research_employee`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=13;

--
-- Ограничения внешнего ключа сохраненных таблиц
--

--
-- Ограничения внешнего ключа таблицы `chemequipment`
--
ALTER TABLE `chemequipment`
  ADD CONSTRAINT `storage_id` FOREIGN KEY (`storage_id`) REFERENCES `chemical_storage` (`id`);

--
-- Ограничения внешнего ключа таблицы `chemical_relationships`
--
ALTER TABLE `chemical_relationships`
  ADD CONSTRAINT `chemcompound` FOREIGN KEY (`compound_id`) REFERENCES `chemcompound` (`id`),
  ADD CONSTRAINT `chemelement` FOREIGN KEY (`element_id`) REFERENCES `chemelement` (`id`);

--
-- Ограничения внешнего ключа таблицы `chemical_storage`
--
ALTER TABLE `chemical_storage`
  ADD CONSTRAINT `laboratory_id` FOREIGN KEY (`laboratory_id`) REFERENCES `laboratory` (`id`);

--
-- Ограничения внешнего ключа таблицы `employee`
--
ALTER TABLE `employee`
  ADD CONSTRAINT `employee_ibfk_1` FOREIGN KEY (`lab_id`) REFERENCES `laboratory` (`id`);

--
-- Ограничения внешнего ключа таблицы `experiment`
--
ALTER TABLE `experiment`
  ADD CONSTRAINT `experiment_ibfk_1` FOREIGN KEY (`research_id`) REFERENCES `research` (`id`);

--
-- Ограничения внешнего ключа таблицы `experiment_expenses`
--
ALTER TABLE `experiment_expenses`
  ADD CONSTRAINT `experiment_expenses_ibfk_1` FOREIGN KEY (`experiment_id`) REFERENCES `experiment` (`id`),
  ADD CONSTRAINT `experiment_expenses_ibfk_2` FOREIGN KEY (`order_details_id`) REFERENCES `order_details` (`id`),
  ADD CONSTRAINT `experiment_expenses_ibfk_3` FOREIGN KEY (`inventory_id`) REFERENCES `inventory` (`id`),
  ADD CONSTRAINT `experiment_expenses_ibfk_4` FOREIGN KEY (`unique_id`) REFERENCES `order_details` (`unique_id`);

--
-- Ограничения внешнего ключа таблицы `experiment_results`
--
ALTER TABLE `experiment_results`
  ADD CONSTRAINT `experiment_results_ibfk_1` FOREIGN KEY (`experiment_id`) REFERENCES `experiment` (`id`) ON DELETE CASCADE,
  ADD CONSTRAINT `fk_laboratory_id` FOREIGN KEY (`laboratory_id`) REFERENCES `laboratory` (`id`);

--
-- Ограничения внешнего ключа таблицы `inventory`
--
ALTER TABLE `inventory`
  ADD CONSTRAINT `fk_storage` FOREIGN KEY (`storage_id`) REFERENCES `chemical_storage` (`id`),
  ADD CONSTRAINT `fk_storage_id` FOREIGN KEY (`storage_id`) REFERENCES `chemical_storage` (`id`) ON DELETE CASCADE;

--
-- Ограничения внешнего ключа таблицы `mixture_composition`
--
ALTER TABLE `mixture_composition`
  ADD CONSTRAINT `mixture_composition_ibfk_1` FOREIGN KEY (`mixture_id`) REFERENCES `chemmixture` (`id`),
  ADD CONSTRAINT `mixture_composition_ibfk_2` FOREIGN KEY (`compound_id`) REFERENCES `chemcompound` (`id`);

--
-- Ограничения внешнего ключа таблицы `order`
--
ALTER TABLE `order`
  ADD CONSTRAINT `fk_employee_id` FOREIGN KEY (`employee_id`) REFERENCES `employee` (`id`),
  ADD CONSTRAINT `fk_research_id` FOREIGN KEY (`research_id`) REFERENCES `research` (`id`);

--
-- Ограничения внешнего ключа таблицы `order_details`
--
ALTER TABLE `order_details`
  ADD CONSTRAINT `fk_order_number` FOREIGN KEY (`order_number`) REFERENCES `order` (`order_number`),
  ADD CONSTRAINT `order_details_ibfk_1` FOREIGN KEY (`inventory_id`) REFERENCES `inventory` (`id`);

--
-- Ограничения внешнего ключа таблицы `research_employee`
--
ALTER TABLE `research_employee`
  ADD CONSTRAINT `research_employee_ibfk_1` FOREIGN KEY (`employee_id`) REFERENCES `employee` (`id`),
  ADD CONSTRAINT `research_employee_ibfk_2` FOREIGN KEY (`research_id`) REFERENCES `research` (`id`);
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
