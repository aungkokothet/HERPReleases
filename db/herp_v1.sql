-- phpMyAdmin SQL Dump
-- version 5.0.2
-- https://www.phpmyadmin.net/
--
-- Host: 127.0.0.1
-- Generation Time: Sep 11, 2020 at 04:48 PM
-- Server version: 10.4.11-MariaDB
-- PHP Version: 7.4.5

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
START TRANSACTION;
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

--
-- Database: `herp`
--

-- --------------------------------------------------------

--
-- Table structure for table `accounts_payable`
--

CREATE TABLE `accounts_payable` (
  `id` bigint(20) NOT NULL,
  `supplier_id` bigint(20) NOT NULL,
  `balance` float NOT NULL,
  `created_user_id` bigint(20) NOT NULL,
  `created_time` timestamp NOT NULL DEFAULT current_timestamp(),
  `updated_user_id` bigint(20) NOT NULL,
  `updated_time` timestamp NOT NULL DEFAULT current_timestamp() ON UPDATE current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- --------------------------------------------------------

--
-- Table structure for table `accounts_receivable`
--

CREATE TABLE `accounts_receivable` (
  `id` bigint(20) NOT NULL,
  `patient_id` bigint(20) NOT NULL,
  `balance` float NOT NULL,
  `created_user_id` bigint(20) NOT NULL,
  `created_time` timestamp NOT NULL DEFAULT current_timestamp(),
  `updated_user_id` bigint(20) NOT NULL,
  `updated_time` timestamp NOT NULL DEFAULT current_timestamp() ON UPDATE current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- --------------------------------------------------------

--
-- Table structure for table `appointment`
--

CREATE TABLE `appointment` (
  `id` bigint(20) NOT NULL,
  `patient_id` bigint(20) NOT NULL,
  `doctor_id` bigint(20) NOT NULL,
  `opd_room_id` bigint(20) NOT NULL,
  `appointment_time` datetime NOT NULL,
  `status` int(1) NOT NULL,
  `appointment_type` enum('Outpatient','Inpatient') NOT NULL,
  `source` enum('Phone Call','Walk In','Online') NOT NULL,
  `created_time` timestamp NOT NULL DEFAULT current_timestamp(),
  `create_user_id` int(11) NOT NULL,
  `created_user_login_id` bigint(20) NOT NULL,
  `updated_time` timestamp NOT NULL DEFAULT current_timestamp() ON UPDATE current_timestamp(),
  `updated_user_login_id` int(11) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- --------------------------------------------------------

--
-- Table structure for table `assets_purchase`
--

CREATE TABLE `assets_purchase` (
  `id` bigint(20) NOT NULL,
  `date` datetime NOT NULL,
  `supplier_id` bigint(20) NOT NULL,
  `total_amount` float DEFAULT NULL,
  `discount` float DEFAULT NULL,
  `status` int(1) NOT NULL,
  `created_user_id` bigint(20) NOT NULL,
  `created_time` timestamp NOT NULL DEFAULT current_timestamp(),
  `updated_user_id` bigint(20) NOT NULL,
  `updated_time` timestamp NOT NULL DEFAULT current_timestamp() ON UPDATE current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- --------------------------------------------------------

--
-- Table structure for table `assets_purchase_item`
--

CREATE TABLE `assets_purchase_item` (
  `id` bigint(20) NOT NULL,
  `assets_purchase_id` bigint(20) NOT NULL,
  `description` text NOT NULL,
  `quantity` float NOT NULL,
  `purchase_price` float NOT NULL,
  `amount` float NOT NULL,
  `created_user_id` bigint(20) NOT NULL,
  `created_time` timestamp NOT NULL DEFAULT current_timestamp(),
  `updated_user_id` bigint(20) NOT NULL,
  `updated_time` timestamp NOT NULL DEFAULT current_timestamp() ON UPDATE current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- --------------------------------------------------------

--
-- Table structure for table `attendance`
--

CREATE TABLE `attendance` (
  `id` bigint(20) NOT NULL,
  `employee_id` int(11) NOT NULL,
  `time_in` datetime DEFAULT NULL,
  `time_out` datetime DEFAULT NULL,
  `created_user_id` bigint(20) NOT NULL,
  `created_time` timestamp NOT NULL DEFAULT current_timestamp(),
  `updated_user_id` bigint(20) NOT NULL,
  `updated_time` timestamp NOT NULL DEFAULT current_timestamp() ON UPDATE current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- --------------------------------------------------------

--
-- Table structure for table `bill`
--

CREATE TABLE `bill` (
  `id` bigint(20) NOT NULL,
  `patient_id` bigint(20) NOT NULL,
  `patient_type` enum('Outpatient','Inpatient','Emergency') NOT NULL,
  `inpatient_care_id` bigint(20) DEFAULT NULL,
  `outpatient_care_id` bigint(20) DEFAULT NULL,
  `emergency_care_id` bigint(20) DEFAULT NULL,
  `appointment_id` bigint(20) DEFAULT NULL,
  `bill_date_time` datetime DEFAULT NULL,
  `discount` float DEFAULT 0,
  `tax_amount` float DEFAULT 0,
  `discharge_date_time` datetime DEFAULT NULL,
  `status` int(1) NOT NULL DEFAULT 0 COMMENT '0 = Unpaid, 1 = Paid',
  `created_user_id` bigint(20) NOT NULL,
  `created_time` timestamp NOT NULL DEFAULT current_timestamp(),
  `updated_user_id` bigint(20) NOT NULL,
  `updated_time` timestamp NOT NULL DEFAULT current_timestamp() ON UPDATE current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- --------------------------------------------------------

--
-- Table structure for table `bill_service_item`
--

CREATE TABLE `bill_service_item` (
  `id` bigint(20) NOT NULL,
  `bill_id` bigint(20) NOT NULL,
  `service_item_id` bigint(20) NOT NULL,
  `charge` float NOT NULL,
  `charge_type` enum('Service','Consultant') DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- --------------------------------------------------------

--
-- Table structure for table `department`
--

CREATE TABLE `department` (
  `id` bigint(20) NOT NULL,
  `name` varchar(255) NOT NULL,
  `description` text NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- --------------------------------------------------------

--
-- Table structure for table `doctor`
--

CREATE TABLE `doctor` (
  `id` bigint(20) NOT NULL,
  `name` varchar(255) NOT NULL,
  `phone` varchar(25) DEFAULT NULL,
  `department_id` bigint(20) NOT NULL,
  `employee_id` bigint(20) NOT NULL,
  `consultation_charge` float NOT NULL,
  `created_time` timestamp NOT NULL DEFAULT current_timestamp(),
  `updated_time` timestamp NOT NULL DEFAULT current_timestamp() ON UPDATE current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- --------------------------------------------------------

--
-- Table structure for table `doctor_charge`
--

CREATE TABLE `doctor_charge` (
  `id` bigint(20) NOT NULL,
  `doctor_id` bigint(20) NOT NULL,
  `opd_charge` float NOT NULL,
  `ipd_charge` float NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- --------------------------------------------------------

--
-- Table structure for table `emergency_care`
--

CREATE TABLE `emergency_care` (
  `id` bigint(20) NOT NULL,
  `patient_id` bigint(20) NOT NULL,
  `date` datetime NOT NULL,
  `doctor_id` bigint(20) NOT NULL,
  `status` int(1) DEFAULT NULL,
  `created_user_id` bigint(20) NOT NULL,
  `created_time` timestamp NOT NULL DEFAULT current_timestamp(),
  `updated_user_id` bigint(20) NOT NULL,
  `updated_time` timestamp NOT NULL DEFAULT current_timestamp() ON UPDATE current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- --------------------------------------------------------

--
-- Table structure for table `employee`
--

CREATE TABLE `employee` (
  `id` bigint(20) NOT NULL,
  `employee_identification_number` varchar(255) DEFAULT NULL,
  `name` varchar(255) NOT NULL,
  `gender` varchar(12) DEFAULT NULL,
  `education` text DEFAULT NULL,
  `join_date` date DEFAULT NULL,
  `permanent_date` date DEFAULT NULL,
  `marital_status` enum('Single','Married','Divorced') DEFAULT NULL,
  `number_of_children` int(1) NOT NULL DEFAULT 0,
  `live_with_parent` enum('Yes','No') NOT NULL DEFAULT 'No',
  `live_with_spouse_parent` enum('Yes','No') NOT NULL DEFAULT 'No',
  `phone_number` varchar(25) DEFAULT NULL,
  `emergency_contact_hone` varchar(25) DEFAULT NULL,
  `date_of_birth` date DEFAULT NULL,
  `nrc_number` varchar(50) DEFAULT NULL,
  `bank_account_number` varchar(50) DEFAULT NULL,
  `tax_id` varchar(50) NOT NULL,
  `passport_number` varchar(50) NOT NULL,
  `address` text DEFAULT NULL,
  `profile_image` longtext DEFAULT NULL,
  `position_id` bigint(20) NOT NULL,
  `department_id` bigint(20) NOT NULL,
  `status` int(1) NOT NULL DEFAULT 1 COMMENT '0 = Resigned, 1 = Probation, 2 = Permanent',
  `created_user_login_id` bigint(20) DEFAULT NULL,
  `updated_user_login_id` bigint(20) DEFAULT NULL,
  `created_time` timestamp NOT NULL DEFAULT current_timestamp(),
  `updated_time` timestamp NOT NULL DEFAULT current_timestamp() ON UPDATE current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- --------------------------------------------------------

--
-- Table structure for table `general_ledger_account`
--

CREATE TABLE `general_ledger_account` (
  `id` bigint(20) NOT NULL,
  `account_code` varchar(50) NOT NULL,
  `account_name` varchar(255) NOT NULL,
  `opening_balance` float NOT NULL DEFAULT 0,
  `closing_balance` float NOT NULL DEFAULT 0,
  `created_user_id` bigint(20) NOT NULL,
  `created_time` timestamp NOT NULL DEFAULT current_timestamp(),
  `updated_user_id` bigint(20) NOT NULL,
  `updated_time` timestamp NOT NULL DEFAULT current_timestamp() ON UPDATE current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- --------------------------------------------------------

--
-- Table structure for table `general_ledger_in`
--

CREATE TABLE `general_ledger_in` (
  `id` bigint(20) NOT NULL,
  `general_ledger_account_id` bigint(20) NOT NULL,
  `date` datetime DEFAULT NULL,
  `description` text DEFAULT NULL,
  `amount` float NOT NULL,
  `created_user_id` bigint(20) NOT NULL,
  `created_time` timestamp NOT NULL DEFAULT current_timestamp(),
  `updated_user_id` bigint(20) NOT NULL,
  `updated_time` timestamp NOT NULL DEFAULT current_timestamp() ON UPDATE current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- --------------------------------------------------------

--
-- Table structure for table `general_ledger_out`
--

CREATE TABLE `general_ledger_out` (
  `id` bigint(20) NOT NULL,
  `general_ledger_account_id` bigint(20) NOT NULL,
  `date` datetime NOT NULL,
  `description` text NOT NULL,
  `amount` float NOT NULL,
  `created_user_id` bigint(20) NOT NULL,
  `created_time` timestamp NOT NULL DEFAULT current_timestamp(),
  `updated_user_id` bigint(20) NOT NULL,
  `updated_time` timestamp NOT NULL DEFAULT current_timestamp() ON UPDATE current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- --------------------------------------------------------

--
-- Table structure for table `inpatient_care`
--

CREATE TABLE `inpatient_care` (
  `id` bigint(20) NOT NULL,
  `patient_id` bigint(20) NOT NULL,
  `admission_date` datetime NOT NULL,
  `doctor_id` bigint(20) NOT NULL,
  `discharge_date` datetime NOT NULL,
  `ipd_bed_id` bigint(20) NOT NULL,
  `created_user_id` bigint(20) NOT NULL,
  `created_time` timestamp NOT NULL DEFAULT current_timestamp(),
  `updated_user_id` bigint(20) NOT NULL,
  `updated_time` timestamp NOT NULL DEFAULT current_timestamp() ON UPDATE current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- --------------------------------------------------------

--
-- Table structure for table `ipd_bed`
--

CREATE TABLE `ipd_bed` (
  `id` bigint(20) NOT NULL,
  `name` varchar(255) NOT NULL,
  `location` varchar(255) DEFAULT NULL,
  `type` varchar(255) DEFAULT NULL,
  `charge_amount` float DEFAULT NULL,
  `created_user_id` bigint(20) NOT NULL,
  `created_time` timestamp NULL DEFAULT current_timestamp(),
  `updated_user_id` bigint(20) NOT NULL,
  `updated_time` timestamp NOT NULL DEFAULT current_timestamp() ON UPDATE current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- --------------------------------------------------------

--
-- Table structure for table `lab_report`
--

CREATE TABLE `lab_report` (
  `id` bigint(20) NOT NULL,
  `lab_request_id` bigint(20) NOT NULL,
  `date` datetime DEFAULT NULL,
  `doctor_id` bigint(20) NOT NULL COMMENT 'this doctor_id is the id of pathologist who make report',
  `notes` text DEFAULT NULL,
  `created_user_id` bigint(20) NOT NULL,
  `created_time` timestamp NOT NULL DEFAULT current_timestamp(),
  `updated_user_id` bigint(20) NOT NULL,
  `updated_time` timestamp NOT NULL DEFAULT current_timestamp() ON UPDATE current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- --------------------------------------------------------

--
-- Table structure for table `lab_report_item`
--

CREATE TABLE `lab_report_item` (
  `id` bigint(20) NOT NULL,
  `lab_report_id` bigint(20) NOT NULL,
  `lab_test_id` bigint(20) NOT NULL,
  `result` varchar(255) DEFAULT NULL,
  `reference_range` varchar(255) DEFAULT NULL,
  `unit` varchar(50) DEFAULT NULL,
  `remark` text DEFAULT NULL,
  `file_attachment` text DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- --------------------------------------------------------

--
-- Table structure for table `lab_request`
--

CREATE TABLE `lab_request` (
  `id` bigint(20) NOT NULL,
  `patient_id` bigint(20) NOT NULL,
  `date` datetime NOT NULL,
  `doctor_id` bigint(20) NOT NULL,
  `status` varchar(25) NOT NULL COMMENT 'URGENT or REGULAR',
  `notes` text NOT NULL,
  `created_user_id` bigint(20) NOT NULL,
  `created_time` datetime NOT NULL DEFAULT current_timestamp(),
  `updated_user_id` bigint(20) NOT NULL,
  `updated_time` datetime NOT NULL DEFAULT current_timestamp() ON UPDATE current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- --------------------------------------------------------

--
-- Table structure for table `lab_request_item`
--

CREATE TABLE `lab_request_item` (
  `id` bigint(20) NOT NULL,
  `lab_request_id` bigint(20) NOT NULL,
  `lab_test_id` bigint(20) NOT NULL,
  `charge` float DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- --------------------------------------------------------

--
-- Table structure for table `lab_test`
--

CREATE TABLE `lab_test` (
  `id` bigint(20) NOT NULL,
  `name` varchar(255) NOT NULL,
  `lab_test_category_id` bigint(20) NOT NULL,
  `reference_range` varchar(255) NOT NULL,
  `unit` varchar(50) NOT NULL,
  `charge` float DEFAULT NULL,
  `created_user_id` bigint(20) NOT NULL,
  `created_time` timestamp NOT NULL DEFAULT current_timestamp(),
  `updated_user_id` bigint(20) NOT NULL,
  `updated_time` timestamp NOT NULL DEFAULT current_timestamp() ON UPDATE current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- --------------------------------------------------------

--
-- Table structure for table `lab_test_category`
--

CREATE TABLE `lab_test_category` (
  `id` bigint(20) NOT NULL,
  `name` int(11) NOT NULL,
  `created_user_id` bigint(20) NOT NULL,
  `created_time` datetime NOT NULL DEFAULT current_timestamp(),
  `updated_user_id` bigint(20) NOT NULL,
  `updated_time` timestamp NOT NULL DEFAULT current_timestamp() ON UPDATE current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- --------------------------------------------------------

--
-- Table structure for table `leave_request`
--

CREATE TABLE `leave_request` (
  `id` bigint(20) NOT NULL,
  `employee_id` bigint(20) NOT NULL,
  `leave_type_id` bigint(20) NOT NULL,
  `leave_date` date NOT NULL,
  `comment` text NOT NULL,
  `day_period` enum('Full','Half') NOT NULL,
  `created_user_id` bigint(20) NOT NULL,
  `created_time` timestamp NOT NULL DEFAULT current_timestamp(),
  `updated_user_id` bigint(20) NOT NULL,
  `updated_time` timestamp NOT NULL DEFAULT current_timestamp() ON UPDATE current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- --------------------------------------------------------

--
-- Table structure for table `leave_type`
--

CREATE TABLE `leave_type` (
  `id` bigint(20) NOT NULL,
  `name` varchar(255) NOT NULL,
  `allowance_days_per_year` int(2) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- --------------------------------------------------------

--
-- Table structure for table `opd_room`
--

CREATE TABLE `opd_room` (
  `id` bigint(20) NOT NULL,
  `name` varchar(255) NOT NULL,
  `location` varchar(255) DEFAULT NULL,
  `current_doctor_id` bigint(20) DEFAULT NULL,
  `current_queue_token` varchar(255) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- --------------------------------------------------------

--
-- Table structure for table `outpatient_care`
--

CREATE TABLE `outpatient_care` (
  `id` bigint(20) NOT NULL,
  `appointment_id` bigint(20) NOT NULL,
  `patient_id` bigint(20) NOT NULL,
  `date` datetime NOT NULL,
  `doctor_id` bigint(20) NOT NULL,
  `status` int(1) NOT NULL,
  `created_user_id` bigint(20) NOT NULL,
  `created_time` timestamp NOT NULL DEFAULT current_timestamp(),
  `updated_user_id` bigint(20) NOT NULL,
  `updated_time` timestamp NOT NULL DEFAULT current_timestamp() ON UPDATE current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- --------------------------------------------------------

--
-- Table structure for table `patient`
--

CREATE TABLE `patient` (
  `id` bigint(20) NOT NULL,
  `name` varchar(255) NOT NULL,
  `phone` varchar(50) NOT NULL,
  `date_of_birth` date NOT NULL,
  `address` text DEFAULT NULL,
  `township` text DEFAULT NULL,
  `region` text DEFAULT NULL,
  `blood_group` varchar(12) DEFAULT NULL,
  `gender` enum('Male','Female') NOT NULL,
  `status` int(11) DEFAULT NULL,
  `created_time` timestamp NOT NULL DEFAULT current_timestamp(),
  `updated_time` timestamp NOT NULL DEFAULT current_timestamp() ON UPDATE current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- --------------------------------------------------------

--
-- Table structure for table `payroll`
--

CREATE TABLE `payroll` (
  `id` bigint(20) NOT NULL,
  `employee_id` bigint(20) NOT NULL,
  `basic_salary` float NOT NULL,
  `overtime_fee` float NOT NULL,
  `bonus` float NOT NULL,
  `tax` float NOT NULL,
  `deduction` float DEFAULT NULL,
  `month` int(2) NOT NULL,
  `year` int(4) NOT NULL,
  `notes` text NOT NULL,
  `created_user_id` bigint(20) NOT NULL,
  `created_time` timestamp NOT NULL DEFAULT current_timestamp(),
  `updated_user_id` bigint(20) NOT NULL,
  `updated_time` timestamp NOT NULL DEFAULT current_timestamp() ON UPDATE current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- --------------------------------------------------------

--
-- Table structure for table `pharmacy_category`
--

CREATE TABLE `pharmacy_category` (
  `id` bigint(20) NOT NULL,
  `name` varchar(255) NOT NULL,
  `created_user_id` bigint(20) NOT NULL,
  `created_time` timestamp NOT NULL DEFAULT current_timestamp(),
  `updated_user_id` bigint(20) NOT NULL,
  `updated_time` timestamp NOT NULL DEFAULT current_timestamp() ON UPDATE current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- --------------------------------------------------------

--
-- Table structure for table `pharmacy_inventory`
--

CREATE TABLE `pharmacy_inventory` (
  `id` bigint(20) NOT NULL,
  `pharmacy_item_id` bigint(20) NOT NULL,
  `pharmacy_warehouse_id` bigint(20) NOT NULL,
  `opening_balance` float NOT NULL,
  `closing_balance` float NOT NULL,
  `economic_order_quantity` float NOT NULL,
  `reorder_level` float NOT NULL,
  `minimum` float NOT NULL,
  `maximum` float NOT NULL,
  `batch` varchar(50) DEFAULT NULL,
  `expired_date` date DEFAULT NULL,
  `created_user_id` bigint(20) NOT NULL,
  `created_time` timestamp NOT NULL DEFAULT current_timestamp(),
  `updated_user_id` bigint(20) NOT NULL,
  `updated_time` timestamp NOT NULL DEFAULT current_timestamp() ON UPDATE current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- --------------------------------------------------------

--
-- Table structure for table `pharmacy_issue`
--

CREATE TABLE `pharmacy_issue` (
  `id` bigint(20) NOT NULL,
  `date` datetime NOT NULL,
  `issue_to` text NOT NULL,
  `total_amount` float NOT NULL,
  `created_user_id` bigint(20) NOT NULL,
  `created_time` timestamp NOT NULL DEFAULT current_timestamp(),
  `updated_user_id` bigint(20) NOT NULL,
  `updated_time` timestamp NOT NULL DEFAULT current_timestamp() ON UPDATE current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- --------------------------------------------------------

--
-- Table structure for table `pharmacy_issue_item`
--

CREATE TABLE `pharmacy_issue_item` (
  `id` bigint(20) NOT NULL,
  `pharmacy_issue_id` bigint(20) NOT NULL,
  `pharmacy_item_id` bigint(20) NOT NULL,
  `quantity` float NOT NULL,
  `sale_price` float NOT NULL,
  `amount` float NOT NULL,
  `created_user_id` bigint(20) NOT NULL,
  `created_time` timestamp NOT NULL DEFAULT current_timestamp(),
  `updated_user_id` bigint(20) NOT NULL,
  `updated_time` timestamp NOT NULL DEFAULT current_timestamp() ON UPDATE current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- --------------------------------------------------------

--
-- Table structure for table `pharmacy_item`
--

CREATE TABLE `pharmacy_item` (
  `id` bigint(20) NOT NULL,
  `name` varchar(255) NOT NULL,
  `pharmacy_category_id` bigint(20) NOT NULL,
  `universal_product_code` varchar(50) DEFAULT NULL COMMENT 'Barcode',
  `sale_price` float NOT NULL,
  `purchase_price` float NOT NULL,
  `supplier_id` bigint(20) NOT NULL,
  `created_user_id` bigint(20) NOT NULL,
  `created_time` timestamp NOT NULL DEFAULT current_timestamp(),
  `updated_user_id` bigint(20) NOT NULL,
  `updated_time` timestamp NOT NULL DEFAULT current_timestamp() ON UPDATE current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- --------------------------------------------------------

--
-- Table structure for table `pharmacy_purchase`
--

CREATE TABLE `pharmacy_purchase` (
  `id` bigint(20) NOT NULL,
  `date` datetime NOT NULL,
  `supplier_id` bigint(20) NOT NULL,
  `total_amount` float NOT NULL,
  `discount` float NOT NULL,
  `status` int(1) DEFAULT NULL,
  `created_user_id` bigint(20) NOT NULL,
  `created_time` timestamp NOT NULL DEFAULT current_timestamp(),
  `updated_user_id` bigint(20) NOT NULL,
  `updated_time` timestamp NOT NULL DEFAULT current_timestamp() ON UPDATE current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- --------------------------------------------------------

--
-- Table structure for table `pharmacy_purchase_item`
--

CREATE TABLE `pharmacy_purchase_item` (
  `id` bigint(20) NOT NULL,
  `pharmacy_purchase_id` bigint(20) NOT NULL,
  `pharmacy_item_id` bigint(20) NOT NULL,
  `quantity` float NOT NULL,
  `purchase_price` float NOT NULL,
  `amount` float NOT NULL,
  `created_user_id` bigint(20) NOT NULL,
  `created_time` timestamp NOT NULL DEFAULT current_timestamp(),
  `updated_user_id` bigint(20) NOT NULL,
  `updated_time` timestamp NOT NULL DEFAULT current_timestamp() ON UPDATE current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- --------------------------------------------------------

--
-- Table structure for table `pharmacy_purchase_payment`
--

CREATE TABLE `pharmacy_purchase_payment` (
  `id` bigint(20) NOT NULL,
  `pharmacy_purchase_id` bigint(20) NOT NULL,
  `date` datetime NOT NULL,
  `amount` float NOT NULL,
  `status` int(1) NOT NULL,
  `created_user_id` bigint(20) NOT NULL,
  `created_time` timestamp NOT NULL DEFAULT current_timestamp(),
  `updated_user_id` bigint(20) NOT NULL,
  `updated_time` timestamp NOT NULL DEFAULT current_timestamp() ON UPDATE current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- --------------------------------------------------------

--
-- Table structure for table `pharmacy_sale`
--

CREATE TABLE `pharmacy_sale` (
  `id` bigint(20) NOT NULL,
  `date` datetime NOT NULL,
  `patient_id` bigint(20) NOT NULL,
  `total_amount` float NOT NULL,
  `discount` float NOT NULL,
  `remark` text NOT NULL,
  `status` int(1) DEFAULT NULL,
  `created_user_id` bigint(20) NOT NULL,
  `created_time` timestamp NOT NULL DEFAULT current_timestamp(),
  `updated_user_id` bigint(20) NOT NULL,
  `updated_time` timestamp NOT NULL DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- --------------------------------------------------------

--
-- Table structure for table `pharmacy_sale_item`
--

CREATE TABLE `pharmacy_sale_item` (
  `id` bigint(20) NOT NULL,
  `pharmacy_sale_id` bigint(20) NOT NULL,
  `pharmacy_item_id` bigint(20) NOT NULL,
  `quantity` float NOT NULL,
  `sale_price` float NOT NULL,
  `amount` float NOT NULL,
  `created_user_id` bigint(20) NOT NULL,
  `created_time` timestamp NOT NULL DEFAULT current_timestamp(),
  `updated_user_id` bigint(20) NOT NULL,
  `updated_time` timestamp NOT NULL DEFAULT current_timestamp() ON UPDATE current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- --------------------------------------------------------

--
-- Table structure for table `pharmacy_warehouse`
--

CREATE TABLE `pharmacy_warehouse` (
  `id` bigint(20) NOT NULL,
  `name` varchar(255) NOT NULL,
  `phone` varchar(50) DEFAULT NULL,
  `address` text DEFAULT NULL,
  `created_user_id` bigint(20) DEFAULT NULL,
  `created_time` timestamp NOT NULL DEFAULT current_timestamp(),
  `updated_user_id` bigint(20) NOT NULL,
  `updated_time` timestamp NOT NULL DEFAULT current_timestamp() ON UPDATE current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- --------------------------------------------------------

--
-- Table structure for table `position`
--

CREATE TABLE `position` (
  `id` bigint(20) NOT NULL,
  `name` varchar(255) NOT NULL,
  `description` text DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- --------------------------------------------------------

--
-- Table structure for table `radiology_report`
--

CREATE TABLE `radiology_report` (
  `id` bigint(20) NOT NULL,
  `radiology_request_id` bigint(20) NOT NULL,
  `date` datetime DEFAULT NULL,
  `doctor_id` bigint(20) NOT NULL COMMENT 'this doctor_id is the id of pathologist who make report',
  `notes` text DEFAULT NULL,
  `created_user_id` bigint(20) NOT NULL,
  `created_time` timestamp NOT NULL DEFAULT current_timestamp(),
  `updated_user_id` bigint(20) NOT NULL,
  `updated_time` timestamp NOT NULL DEFAULT current_timestamp() ON UPDATE current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- --------------------------------------------------------

--
-- Table structure for table `radiology_report_item`
--

CREATE TABLE `radiology_report_item` (
  `id` bigint(20) NOT NULL,
  `radiology_report_id` bigint(20) NOT NULL,
  `radiology_test_id` bigint(20) NOT NULL,
  `result` text DEFAULT NULL,
  `remark` text DEFAULT NULL,
  `file_attachment` text DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- --------------------------------------------------------

--
-- Table structure for table `radiology_request`
--

CREATE TABLE `radiology_request` (
  `id` bigint(20) NOT NULL,
  `patient_id` bigint(20) NOT NULL,
  `date` datetime NOT NULL,
  `doctor_id` bigint(20) NOT NULL,
  `status` varchar(25) NOT NULL COMMENT 'URGENT or REGULAR',
  `notes` text NOT NULL,
  `created_user_id` bigint(20) NOT NULL,
  `created_time` datetime NOT NULL DEFAULT current_timestamp(),
  `updated_user_id` bigint(20) NOT NULL,
  `updated_time` datetime NOT NULL DEFAULT current_timestamp() ON UPDATE current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- --------------------------------------------------------

--
-- Table structure for table `radiology_request_item`
--

CREATE TABLE `radiology_request_item` (
  `id` bigint(20) NOT NULL,
  `radiology_request_id` bigint(20) NOT NULL,
  `radiology_test_id` bigint(20) NOT NULL,
  `charge` float DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- --------------------------------------------------------

--
-- Table structure for table `radiology_test`
--

CREATE TABLE `radiology_test` (
  `id` bigint(20) NOT NULL,
  `name` varchar(255) NOT NULL,
  `radiology_test_category_id` bigint(20) NOT NULL,
  `charge` float DEFAULT NULL,
  `created_user_id` bigint(20) NOT NULL,
  `created_time` timestamp NOT NULL DEFAULT current_timestamp(),
  `updated_user_id` bigint(20) NOT NULL,
  `updated_time` timestamp NOT NULL DEFAULT current_timestamp() ON UPDATE current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- --------------------------------------------------------

--
-- Table structure for table `radiology_test_category`
--

CREATE TABLE `radiology_test_category` (
  `id` bigint(20) NOT NULL,
  `name` int(11) NOT NULL,
  `created_user_id` bigint(20) NOT NULL,
  `created_time` datetime NOT NULL DEFAULT current_timestamp(),
  `updated_user_id` bigint(20) NOT NULL,
  `updated_time` timestamp NOT NULL DEFAULT current_timestamp() ON UPDATE current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- --------------------------------------------------------

--
-- Table structure for table `role`
--

CREATE TABLE `role` (
  `id` bigint(20) NOT NULL,
  `name` int(11) DEFAULT NULL,
  `description` text DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- --------------------------------------------------------

--
-- Table structure for table `salary`
--

CREATE TABLE `salary` (
  `id` bigint(20) NOT NULL,
  `employee_id` bigint(20) NOT NULL,
  `basic_monthly_rate` float NOT NULL,
  `overtime_hourly_rate` float DEFAULT NULL,
  `created_user_id` bigint(20) NOT NULL,
  `created_time` timestamp NOT NULL DEFAULT current_timestamp(),
  `updated_user_id` bigint(20) NOT NULL,
  `updated_time` timestamp NOT NULL DEFAULT current_timestamp() ON UPDATE current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- --------------------------------------------------------

--
-- Table structure for table `service_category`
--

CREATE TABLE `service_category` (
  `id` bigint(20) NOT NULL,
  `name` varchar(255) NOT NULL,
  `description` text DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- --------------------------------------------------------

--
-- Table structure for table `service_item`
--

CREATE TABLE `service_item` (
  `id` bigint(20) NOT NULL,
  `service_category_id` bigint(20) NOT NULL,
  `name` varchar(255) NOT NULL,
  `description` text DEFAULT NULL,
  `charge_type` enum('Service','Consultant') NOT NULL COMMENT 'if charge_type is Consultant, charge value will be retrieved from doctor_charge table, otherwise value is standard_charge.\r\nrelated doctor id is get from patient bill_head',
  `standard_charge` float NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- --------------------------------------------------------

--
-- Table structure for table `session`
--

CREATE TABLE `session` (
  `id` bigint(20) NOT NULL,
  `user_id` bigint(20) NOT NULL,
  `access_token` varchar(100) CHARACTER SET utf8 COLLATE utf8_bin NOT NULL,
  `access_token_expiry` datetime NOT NULL,
  `refresh_token` varchar(100) CHARACTER SET utf8 COLLATE utf8_bin NOT NULL,
  `refresh_token_expiry` datetime NOT NULL,
  `login_ip_address` varchar(255) DEFAULT NULL,
  `created_time` timestamp NOT NULL DEFAULT current_timestamp(),
  `updated_user_id` bigint(20) DEFAULT NULL,
  `updated_time` timestamp NOT NULL DEFAULT current_timestamp() ON UPDATE current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

--
-- Dumping data for table `session`
--

INSERT INTO `session` (`id`, `user_id`, `access_token`, `access_token_expiry`, `refresh_token`, `refresh_token_expiry`, `login_ip_address`, `created_time`, `updated_user_id`, `updated_time`) VALUES
(3, 4, 'NGU0M2M3MDlkNmJmMzkwZGI1ODM2MzE1YTc1MGU0NTI3M2Y5MTA2YjY3N2IxY2NiMTU5OTc5ODQ4Ng==', '2020-09-12 10:58:06', 'MzNhZjc1YjUyYjAxZGI4YjhmNDI1ZGFhMTMyMTg2NWM4MTRjNTg4YjU2NGZjNDE1MTU5OTc5ODQ4Ng==', '2020-09-14 10:58:06', '::1', '2020-09-11 04:28:06', NULL, '2020-09-11 04:28:06'),
(32, 5, 'NzBhZjQwODk3MDBkYjhlOGZjMmY5OTY2ODZhYTg5YzU4NWJlZDE2MjFkMzNiYzcwMTU5OTgzNDY5OA==', '2020-09-12 21:01:38', 'YWIwMTEyYWYwZjg5MTVmNzUzNzYxM2ViY2VjZDczYmZlMjI3NTI2YzZlOWZjNjJjMTU5OTgzNDY5OA==', '2020-09-14 21:01:38', '::1', '2020-09-11 14:31:38', NULL, '2020-09-11 14:31:38');

-- --------------------------------------------------------

--
-- Table structure for table `supplier`
--

CREATE TABLE `supplier` (
  `id` bigint(20) NOT NULL,
  `name` varchar(255) NOT NULL,
  `phone` varchar(50) DEFAULT NULL,
  `address` text DEFAULT NULL,
  `created_user_id` bigint(20) NOT NULL,
  `created_time` timestamp NOT NULL DEFAULT current_timestamp(),
  `updated_user_id` bigint(20) NOT NULL,
  `updated_time` timestamp NOT NULL DEFAULT current_timestamp() ON UPDATE current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- --------------------------------------------------------

--
-- Table structure for table `user`
--

CREATE TABLE `user` (
  `id` bigint(20) NOT NULL,
  `username` varchar(255) NOT NULL,
  `password` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_bin NOT NULL,
  `fullname` varchar(255) DEFAULT NULL,
  `level` int(1) NOT NULL DEFAULT 0,
  `status` int(1) NOT NULL DEFAULT 0,
  `login_attempt` int(1) NOT NULL DEFAULT 0,
  `created_user_id` bigint(20) NOT NULL,
  `created_time` timestamp NOT NULL DEFAULT current_timestamp(),
  `updated_user_id` bigint(20) NOT NULL,
  `updated_time` timestamp NOT NULL DEFAULT current_timestamp() ON UPDATE current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COMMENT='User Authentication';

--
-- Dumping data for table `user`
--

INSERT INTO `user` (`id`, `username`, `password`, `fullname`, `level`, `status`, `login_attempt`, `created_user_id`, `created_time`, `updated_user_id`, `updated_time`) VALUES
(1, 'admin', '$2y$10$vKy0FpV94fF.qCp/lYSvpej3esblLtHRWBzs6ana.HVOf0LfSCG0i', 'Administrator', 6, 1, 0, 0, '2020-09-10 09:29:59', 0, '2020-09-10 09:31:02'),
(5, 'akm', '$2y$10$4lvFdqm3vCKZrRcthJGlcekMdBdiHe5RKAYckjsEywEuD9ZllKxtO', 'Aung Kyaw Minn', 6, 1, 0, 1, '2020-09-11 04:45:27', 1, '2020-09-11 14:28:08'),
(6, 'user', '$2y$10$lwJJDf68J24cpXeVyC1ZbeNl41GgH2vQN3TzEmUCpcml9Ff7o7S9a', 'User Test Test', 6, 1, 0, 1, '2020-09-11 08:55:34', 1, '2020-09-11 14:28:17');

-- --------------------------------------------------------

--
-- Table structure for table `user_employee`
--

CREATE TABLE `user_employee` (
  `id` bigint(20) NOT NULL,
  `user_id` bigint(20) NOT NULL COMMENT 'this field connect to user_login.id',
  `employee_id` bigint(20) NOT NULL,
  `role_id` bigint(20) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- --------------------------------------------------------

--
-- Stand-in structure for view `view_session`
-- (See below for the actual view)
--
CREATE TABLE `view_session` (
`id` bigint(20)
,`user_id` bigint(20)
,`username` varchar(255)
,`fullname` varchar(255)
,`level` int(1)
,`refresh_token_expiry` datetime
,`login_ip_address` varchar(255)
);

-- --------------------------------------------------------

--
-- Structure for view `view_session`
--
DROP TABLE IF EXISTS `view_session`;

CREATE ALGORITHM=UNDEFINED DEFINER=`root`@`localhost` SQL SECURITY DEFINER VIEW `view_session`  AS  select `session`.`id` AS `id`,`session`.`user_id` AS `user_id`,`user`.`username` AS `username`,`user`.`fullname` AS `fullname`,`user`.`level` AS `level`,`session`.`refresh_token_expiry` AS `refresh_token_expiry`,`session`.`login_ip_address` AS `login_ip_address` from (`session` join `user` on(`session`.`user_id` = `user`.`id`)) ;

--
-- Indexes for dumped tables
--

--
-- Indexes for table `accounts_payable`
--
ALTER TABLE `accounts_payable`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `accounts_receivable`
--
ALTER TABLE `accounts_receivable`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `appointment`
--
ALTER TABLE `appointment`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `assets_purchase`
--
ALTER TABLE `assets_purchase`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `assets_purchase_item`
--
ALTER TABLE `assets_purchase_item`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `attendance`
--
ALTER TABLE `attendance`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `bill`
--
ALTER TABLE `bill`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `bill_service_item`
--
ALTER TABLE `bill_service_item`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `department`
--
ALTER TABLE `department`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `doctor`
--
ALTER TABLE `doctor`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `doctor_charge`
--
ALTER TABLE `doctor_charge`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `emergency_care`
--
ALTER TABLE `emergency_care`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `employee`
--
ALTER TABLE `employee`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `general_ledger_account`
--
ALTER TABLE `general_ledger_account`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `general_ledger_in`
--
ALTER TABLE `general_ledger_in`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `general_ledger_out`
--
ALTER TABLE `general_ledger_out`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `inpatient_care`
--
ALTER TABLE `inpatient_care`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `ipd_bed`
--
ALTER TABLE `ipd_bed`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `lab_report`
--
ALTER TABLE `lab_report`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `lab_report_item`
--
ALTER TABLE `lab_report_item`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `lab_request`
--
ALTER TABLE `lab_request`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `lab_request_item`
--
ALTER TABLE `lab_request_item`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `lab_test`
--
ALTER TABLE `lab_test`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `lab_test_category`
--
ALTER TABLE `lab_test_category`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `leave_request`
--
ALTER TABLE `leave_request`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `leave_type`
--
ALTER TABLE `leave_type`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `opd_room`
--
ALTER TABLE `opd_room`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `outpatient_care`
--
ALTER TABLE `outpatient_care`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `patient`
--
ALTER TABLE `patient`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `payroll`
--
ALTER TABLE `payroll`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `pharmacy_category`
--
ALTER TABLE `pharmacy_category`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `pharmacy_inventory`
--
ALTER TABLE `pharmacy_inventory`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `pharmacy_issue`
--
ALTER TABLE `pharmacy_issue`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `pharmacy_issue_item`
--
ALTER TABLE `pharmacy_issue_item`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `pharmacy_item`
--
ALTER TABLE `pharmacy_item`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `pharmacy_purchase`
--
ALTER TABLE `pharmacy_purchase`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `pharmacy_purchase_item`
--
ALTER TABLE `pharmacy_purchase_item`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `pharmacy_purchase_payment`
--
ALTER TABLE `pharmacy_purchase_payment`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `pharmacy_sale`
--
ALTER TABLE `pharmacy_sale`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `pharmacy_sale_item`
--
ALTER TABLE `pharmacy_sale_item`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `pharmacy_warehouse`
--
ALTER TABLE `pharmacy_warehouse`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `position`
--
ALTER TABLE `position`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `radiology_report`
--
ALTER TABLE `radiology_report`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `radiology_report_item`
--
ALTER TABLE `radiology_report_item`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `radiology_request`
--
ALTER TABLE `radiology_request`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `radiology_request_item`
--
ALTER TABLE `radiology_request_item`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `radiology_test`
--
ALTER TABLE `radiology_test`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `radiology_test_category`
--
ALTER TABLE `radiology_test_category`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `role`
--
ALTER TABLE `role`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `salary`
--
ALTER TABLE `salary`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `service_category`
--
ALTER TABLE `service_category`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `service_item`
--
ALTER TABLE `service_item`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `session`
--
ALTER TABLE `session`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `accesstoken` (`access_token`),
  ADD UNIQUE KEY `refreshtoken` (`refresh_token`),
  ADD KEY `sessionuserid_fk` (`user_id`);

--
-- Indexes for table `supplier`
--
ALTER TABLE `supplier`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `user`
--
ALTER TABLE `user`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `user_employee`
--
ALTER TABLE `user_employee`
  ADD PRIMARY KEY (`id`);

--
-- AUTO_INCREMENT for dumped tables
--

--
-- AUTO_INCREMENT for table `accounts_payable`
--
ALTER TABLE `accounts_payable`
  MODIFY `id` bigint(20) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `accounts_receivable`
--
ALTER TABLE `accounts_receivable`
  MODIFY `id` bigint(20) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `appointment`
--
ALTER TABLE `appointment`
  MODIFY `id` bigint(20) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `assets_purchase`
--
ALTER TABLE `assets_purchase`
  MODIFY `id` bigint(20) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `assets_purchase_item`
--
ALTER TABLE `assets_purchase_item`
  MODIFY `id` bigint(20) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `attendance`
--
ALTER TABLE `attendance`
  MODIFY `id` bigint(20) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `bill`
--
ALTER TABLE `bill`
  MODIFY `id` bigint(20) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `bill_service_item`
--
ALTER TABLE `bill_service_item`
  MODIFY `id` bigint(20) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `department`
--
ALTER TABLE `department`
  MODIFY `id` bigint(20) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `doctor`
--
ALTER TABLE `doctor`
  MODIFY `id` bigint(20) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `doctor_charge`
--
ALTER TABLE `doctor_charge`
  MODIFY `id` bigint(20) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `emergency_care`
--
ALTER TABLE `emergency_care`
  MODIFY `id` bigint(20) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `employee`
--
ALTER TABLE `employee`
  MODIFY `id` bigint(20) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `general_ledger_account`
--
ALTER TABLE `general_ledger_account`
  MODIFY `id` bigint(20) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `general_ledger_in`
--
ALTER TABLE `general_ledger_in`
  MODIFY `id` bigint(20) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `general_ledger_out`
--
ALTER TABLE `general_ledger_out`
  MODIFY `id` bigint(20) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `inpatient_care`
--
ALTER TABLE `inpatient_care`
  MODIFY `id` bigint(20) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `ipd_bed`
--
ALTER TABLE `ipd_bed`
  MODIFY `id` bigint(20) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `lab_report`
--
ALTER TABLE `lab_report`
  MODIFY `id` bigint(20) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `lab_report_item`
--
ALTER TABLE `lab_report_item`
  MODIFY `id` bigint(20) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `lab_request`
--
ALTER TABLE `lab_request`
  MODIFY `id` bigint(20) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `lab_request_item`
--
ALTER TABLE `lab_request_item`
  MODIFY `id` bigint(20) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `lab_test`
--
ALTER TABLE `lab_test`
  MODIFY `id` bigint(20) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `lab_test_category`
--
ALTER TABLE `lab_test_category`
  MODIFY `id` bigint(20) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `leave_request`
--
ALTER TABLE `leave_request`
  MODIFY `id` bigint(20) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `leave_type`
--
ALTER TABLE `leave_type`
  MODIFY `id` bigint(20) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `opd_room`
--
ALTER TABLE `opd_room`
  MODIFY `id` bigint(20) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `outpatient_care`
--
ALTER TABLE `outpatient_care`
  MODIFY `id` bigint(20) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `patient`
--
ALTER TABLE `patient`
  MODIFY `id` bigint(20) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `payroll`
--
ALTER TABLE `payroll`
  MODIFY `id` bigint(20) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `pharmacy_category`
--
ALTER TABLE `pharmacy_category`
  MODIFY `id` bigint(20) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `pharmacy_inventory`
--
ALTER TABLE `pharmacy_inventory`
  MODIFY `id` bigint(20) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `pharmacy_issue`
--
ALTER TABLE `pharmacy_issue`
  MODIFY `id` bigint(20) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `pharmacy_issue_item`
--
ALTER TABLE `pharmacy_issue_item`
  MODIFY `id` bigint(20) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `pharmacy_item`
--
ALTER TABLE `pharmacy_item`
  MODIFY `id` bigint(20) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `pharmacy_purchase`
--
ALTER TABLE `pharmacy_purchase`
  MODIFY `id` bigint(20) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `pharmacy_purchase_item`
--
ALTER TABLE `pharmacy_purchase_item`
  MODIFY `id` bigint(20) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `pharmacy_purchase_payment`
--
ALTER TABLE `pharmacy_purchase_payment`
  MODIFY `id` bigint(20) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `pharmacy_sale`
--
ALTER TABLE `pharmacy_sale`
  MODIFY `id` bigint(20) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `pharmacy_sale_item`
--
ALTER TABLE `pharmacy_sale_item`
  MODIFY `id` bigint(20) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `pharmacy_warehouse`
--
ALTER TABLE `pharmacy_warehouse`
  MODIFY `id` bigint(20) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `position`
--
ALTER TABLE `position`
  MODIFY `id` bigint(20) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `radiology_report`
--
ALTER TABLE `radiology_report`
  MODIFY `id` bigint(20) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `radiology_report_item`
--
ALTER TABLE `radiology_report_item`
  MODIFY `id` bigint(20) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `radiology_request`
--
ALTER TABLE `radiology_request`
  MODIFY `id` bigint(20) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `radiology_request_item`
--
ALTER TABLE `radiology_request_item`
  MODIFY `id` bigint(20) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `radiology_test`
--
ALTER TABLE `radiology_test`
  MODIFY `id` bigint(20) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `radiology_test_category`
--
ALTER TABLE `radiology_test_category`
  MODIFY `id` bigint(20) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `role`
--
ALTER TABLE `role`
  MODIFY `id` bigint(20) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `salary`
--
ALTER TABLE `salary`
  MODIFY `id` bigint(20) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `service_category`
--
ALTER TABLE `service_category`
  MODIFY `id` bigint(20) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `service_item`
--
ALTER TABLE `service_item`
  MODIFY `id` bigint(20) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `session`
--
ALTER TABLE `session`
  MODIFY `id` bigint(20) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=33;

--
-- AUTO_INCREMENT for table `supplier`
--
ALTER TABLE `supplier`
  MODIFY `id` bigint(20) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `user`
--
ALTER TABLE `user`
  MODIFY `id` bigint(20) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=7;

--
-- AUTO_INCREMENT for table `user_employee`
--
ALTER TABLE `user_employee`
  MODIFY `id` bigint(20) NOT NULL AUTO_INCREMENT;
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
