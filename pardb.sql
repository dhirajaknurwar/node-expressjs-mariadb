-- --------------------------------------------------------
-- Host:                         localhost
-- Server version:               10.3.13-MariaDB - mariadb.org binary distribution
-- Server OS:                    Win64
-- HeidiSQL Version:             10.1.0.5464
-- --------------------------------------------------------

/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET NAMES utf8 */;
/*!50503 SET NAMES utf8mb4 */;
/*!40014 SET @OLD_FOREIGN_KEY_CHECKS=@@FOREIGN_KEY_CHECKS, FOREIGN_KEY_CHECKS=0 */;
/*!40101 SET @OLD_SQL_MODE=@@SQL_MODE, SQL_MODE='NO_AUTO_VALUE_ON_ZERO' */;


-- Dumping database structure for dhirajdb
DROP DATABASE IF EXISTS `dhirajdb`;
CREATE DATABASE IF NOT EXISTS `dhirajdb` /*!40100 DEFAULT CHARACTER SET latin1 */;
USE `dhirajdb`;

-- Dumping structure for table dhirajdb.address
DROP TABLE IF EXISTS `address`;
CREATE TABLE IF NOT EXISTS `address` (
  `address_id` int(11) NOT NULL AUTO_INCREMENT,
  `address` varchar(100) NOT NULL,
  `landmark` varchar(100) NOT NULL,
  `houseno` varchar(15) NOT NULL,
  `buildingname` varchar(200) NOT NULL,
  `customer_id` int(11) NOT NULL,
  PRIMARY KEY (`address_id`),
  KEY `fk_customer` (`customer_id`),
  CONSTRAINT `fk_customer` FOREIGN KEY (`customer_id`) REFERENCES `customer` (`customer_id`) ON UPDATE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=1000 DEFAULT CHARSET=latin1;

-- Data exporting was unselected.
-- Dumping structure for table dhirajdb.customer
DROP TABLE IF EXISTS `customer`;
CREATE TABLE IF NOT EXISTS `customer` (
  `customer_id` int(11) NOT NULL AUTO_INCREMENT,
  `name` varchar(100) NOT NULL,
  `sex` varchar(5) DEFAULT '',
  `mobile` varchar(15) NOT NULL,
  `idproofurl` varchar(200) DEFAULT '',
  `addressproofurl` varchar(200) DEFAULT '',
  `email` varchar(100) DEFAULT '',
  `password` varchar(200) DEFAULT '',
  `otp` varchar(4) NOT NULL,
  `device_token` varchar(200) NOT NULL,
  `device_type` varchar(200) NOT NULL,
  PRIMARY KEY (`customer_id`)
) ENGINE=InnoDB AUTO_INCREMENT=1006 DEFAULT CHARSET=latin1;

-- Data exporting was unselected.
-- Dumping structure for table dhirajdb.orders
DROP TABLE IF EXISTS `orders`;
CREATE TABLE IF NOT EXISTS `orders` (
  `order_id` int(11) NOT NULL AUTO_INCREMENT,
  `address` varchar(200) NOT NULL,
  `landmark` varchar(100) NOT NULL,
  `houseno` varchar(15) NOT NULL,
  `building_name` varchar(200) NOT NULL,
  `lat` float(10,6) NOT NULL,
  `lng` float(10,6) NOT NULL,
  `customer_id` int(11) NOT NULL,
  `owner_id` int(11) NOT NULL,
  `order_amount` int(6) NOT NULL,
  `order_date` varchar(50) NOT NULL,
  `parking_type` varchar(15) NOT NULL,
  `noofdays` int(2) NOT NULL,
  `transaction_id` varchar(15) NOT NULL,
  `payment_mode` varchar(15) NOT NULL,
  `start_timestamp` int(15) NOT NULL,
  `end_timestamp` int(15) NOT NULL,
  `parking_id` int(11),
  `is_confirm` int(1),
  `status` int(4) unsigned zerofill DEFAULT NULL,
  PRIMARY KEY (`order_id`),
  KEY `FK1_customer` (`customer_id`),
  KEY `FK2_owner` (`owner_id`),
  CONSTRAINT `FK1_customer` FOREIGN KEY (`customer_id`) REFERENCES `customer` (`customer_id`),
  CONSTRAINT `FK2_owner` FOREIGN KEY (`owner_id`) REFERENCES `owner` (`owner_id`)
) ENGINE=InnoDB AUTO_INCREMENT=1014 DEFAULT CHARSET=latin1;

-- Data exporting was unselected.
-- Dumping structure for table dhirajdb.owner
DROP TABLE IF EXISTS `owner`;
CREATE TABLE IF NOT EXISTS `owner` (
  `owner_id` int(11) NOT NULL AUTO_INCREMENT,
  `mobile` varchar(15) NOT NULL,
  `email` varchar(100) NOT NULL,
  `name` varchar(100) NOT NULL,
  `address` varchar(200) NOT NULL,
  `otp` varchar(4) NOT NULL,
  `device_token` varchar(200) NOT NULL,
  `device_type` varchar(50) NOT NULL,
  PRIMARY KEY (`owner_id`)
) ENGINE=InnoDB AUTO_INCREMENT=1001 DEFAULT CHARSET=latin1;

-- Data exporting was unselected.
-- Dumping structure for table dhirajdb.parkings
DROP TABLE IF EXISTS `parkings`;
CREATE TABLE IF NOT EXISTS `parkings` (
  `parking_id` int(11) NOT NULL AUTO_INCREMENT,
  `address` varchar(200) NOT NULL,
  `landmark` varchar(100) NOT NULL,
  `houseno` varchar(15) NOT NULL,
  `building_name` varchar(200) NOT NULL,
  `lat` float(10,6) NOT NULL,
  `lng` float(10,6) NOT NULL,
  `owner_id` int(11) NOT NULL,
  `rate_per_hour` int(6) NOT NULL,
  `is_available` int(1) NOT NULL,
  `parking_type` int(1) NOT NULL,
  PRIMARY KEY (`parking_id`),
  KEY `FK1_owner` (`owner_id`),
  CONSTRAINT `FK1_owner` FOREIGN KEY (`owner_id`) REFERENCES `owner` (`owner_id`)
) ENGINE=InnoDB AUTO_INCREMENT=1002 DEFAULT CHARSET=latin1;

-- Data exporting was unselected.
-- Dumping structure for procedure dhirajdb.sp_getall_customer
DROP PROCEDURE IF EXISTS `sp_getall_customer`;
DELIMITER //
CREATE DEFINER=`root`@`localhost` PROCEDURE `sp_getall_customer`()
BEGIN
  SELECT * FROM customer;
END//
DELIMITER ;

-- Dumping structure for table dhirajdb.users
DROP TABLE IF EXISTS `users`;
CREATE TABLE IF NOT EXISTS `users` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `name` varchar(100) NOT NULL,
  `age` int(3) NOT NULL,
  `email` varchar(100) NOT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=3 DEFAULT CHARSET=latin1;

-- Data exporting was unselected.
/*!40101 SET SQL_MODE=IFNULL(@OLD_SQL_MODE, '') */;
/*!40014 SET FOREIGN_KEY_CHECKS=IF(@OLD_FOREIGN_KEY_CHECKS IS NULL, 1, @OLD_FOREIGN_KEY_CHECKS) */;
/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
