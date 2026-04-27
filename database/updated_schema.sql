/*This should only be used as a reference.*/

CREATE DATABASE  IF NOT EXISTS `TrumanHallDesk` /*!40100 DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci */ /*!80016 DEFAULT ENCRYPTION='N' */;
USE `TrumanHallDesk`;
-- MySQL dump 10.13  Distrib 8.0.43, for macos15 (arm64)
--
-- Host: trumanhalldesk-dev.c7oac486er75.us-east-2.rds.amazonaws.com    Database: TrumanHallDesk
-- ------------------------------------------------------
-- Server version	8.4.7

/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!50503 SET NAMES utf8 */;
/*!40103 SET @OLD_TIME_ZONE=@@TIME_ZONE */;
/*!40103 SET TIME_ZONE='+00:00' */;
/*!40014 SET @OLD_UNIQUE_CHECKS=@@UNIQUE_CHECKS, UNIQUE_CHECKS=0 */;
/*!40014 SET @OLD_FOREIGN_KEY_CHECKS=@@FOREIGN_KEY_CHECKS, FOREIGN_KEY_CHECKS=0 */;
/*!40101 SET @OLD_SQL_MODE=@@SQL_MODE, SQL_MODE='NO_AUTO_VALUE_ON_ZERO' */;
/*!40111 SET @OLD_SQL_NOTES=@@SQL_NOTES, SQL_NOTES=0 */;
SET @MYSQLDUMP_TEMP_LOG_BIN = @@SESSION.SQL_LOG_BIN;
SET @@SESSION.SQL_LOG_BIN= 0;

--
-- GTID state at the beginning of the backup
--

SET @@GLOBAL.GTID_PURGED=/*!80000 '+'*/ '';

--
-- Table structure for table `administrator`
--

DROP TABLE IF EXISTS `administrator`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `administrator` (
  `adminID` int NOT NULL AUTO_INCREMENT,
  `user` varchar(20) NOT NULL,
  `assignedBuilding` varchar(10) DEFAULT NULL,
  `officeNumber` varchar(20) DEFAULT NULL,
  `notes` text,
  PRIMARY KEY (`adminID`),
  KEY `user` (`user`),
  KEY `assignedBuilding` (`assignedBuilding`),
  CONSTRAINT `administrator_ibfk_1` FOREIGN KEY (`user`) REFERENCES `user` (`bannerID`) ON DELETE RESTRICT ON UPDATE CASCADE,
  CONSTRAINT `administrator_ibfk_2` FOREIGN KEY (`assignedBuilding`) REFERENCES `buildings` (`buildingID`) ON DELETE SET NULL ON UPDATE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=16 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Table structure for table `buildings`
--

DROP TABLE IF EXISTS `buildings`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `buildings` (
  `buildingID` varchar(10) NOT NULL,
  `streetAddress` varchar(255) DEFAULT NULL,
  `name` varchar(50) DEFAULT NULL,
  PRIMARY KEY (`buildingID`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Table structure for table `deskWorker`
--

DROP TABLE IF EXISTS `deskWorker`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `deskWorker` (
  `workerID` varchar(20) NOT NULL,
  `assignedBuilding` varchar(10) DEFAULT NULL,
  `clockIn` varchar(20) DEFAULT NULL,
  `clockOut` varchar(20) DEFAULT NULL,
  PRIMARY KEY (`workerID`),
  KEY `assignedBuilding` (`assignedBuilding`),
  CONSTRAINT `deskWorker_ibfk_1` FOREIGN KEY (`workerID`) REFERENCES `user` (`bannerID`) ON DELETE RESTRICT ON UPDATE CASCADE,
  CONSTRAINT `deskWorker_ibfk_2` FOREIGN KEY (`assignedBuilding`) REFERENCES `buildings` (`buildingID`) ON DELETE SET NULL ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Table structure for table `equipment`
--

DROP TABLE IF EXISTS `equipment`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `equipment` (
  `equipmentID` int NOT NULL AUTO_INCREMENT,
  `currentOwner` varchar(20) DEFAULT NULL,
  `type` varchar(100) DEFAULT NULL,
  `checkoutTime` datetime DEFAULT NULL,
  `checkoutStaff` varchar(20) DEFAULT NULL,
  `description` text,
  `checkedOut` varchar(1) DEFAULT NULL,
  PRIMARY KEY (`equipmentID`),
  KEY `equipment_ibfk_1` (`currentOwner`),
  KEY `equipment_ibfk_2` (`checkoutStaff`),
  CONSTRAINT `equipment_ibfk_1` FOREIGN KEY (`currentOwner`) REFERENCES `resident` (`residentID`) ON DELETE SET NULL ON UPDATE CASCADE,
  CONSTRAINT `equipment_ibfk_2` FOREIGN KEY (`checkoutStaff`) REFERENCES `deskWorker` (`workerID`) ON DELETE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=136 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Table structure for table `packages`
--

DROP TABLE IF EXISTS `packages`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `packages` (
  `uniqueID` int NOT NULL AUTO_INCREMENT,
  `owner` int DEFAULT NULL,
  `trackingID` varchar(100) DEFAULT NULL,
  `receivedDate` date DEFAULT NULL,
  `emailSent` tinyint(1) DEFAULT '0',
  `pickedUp` tinyint(1) DEFAULT '0',
  `type` varchar(50) DEFAULT NULL,
  `requiresForwarding` tinyint(1) DEFAULT '0',
  PRIMARY KEY (`uniqueID`),
  KEY `owner` (`owner`)
) ENGINE=InnoDB AUTO_INCREMENT=27 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Table structure for table `resident`
--

DROP TABLE IF EXISTS `resident`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `resident` (
  `residentID` varchar(20) NOT NULL,
  `dateCreated` date DEFAULT NULL,
  `roomID` varchar(20) DEFAULT NULL,
  `building` varchar(10) DEFAULT NULL,
  PRIMARY KEY (`residentID`),
  KEY `roomID` (`roomID`),
  KEY `building` (`building`),
  CONSTRAINT `resident_ibfk_1` FOREIGN KEY (`residentID`) REFERENCES `user` (`bannerID`) ON DELETE RESTRICT ON UPDATE CASCADE,
  CONSTRAINT `resident_ibfk_2` FOREIGN KEY (`roomID`) REFERENCES `rooms` (`roomID`) ON DELETE SET NULL ON UPDATE CASCADE,
  CONSTRAINT `resident_ibfk_3` FOREIGN KEY (`building`) REFERENCES `buildings` (`buildingID`) ON DELETE SET NULL ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Table structure for table `rooms`
--

DROP TABLE IF EXISTS `rooms`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `rooms` (
  `roomID` varchar(20) NOT NULL,
  `buildingID` varchar(10) NOT NULL,
  `keyCode` varchar(50) DEFAULT NULL,
  PRIMARY KEY (`roomID`),
  KEY `buildingID` (`buildingID`),
  CONSTRAINT `rooms_ibfk_1` FOREIGN KEY (`buildingID`) REFERENCES `buildings` (`buildingID`) ON DELETE RESTRICT ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Table structure for table `user`
--

DROP TABLE IF EXISTS `user`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `user` (
  `bannerID` varchar(20) NOT NULL,
  `firstName` varchar(50) NOT NULL,
  `lastName` varchar(50) NOT NULL,
  `homeAddress` varchar(255) DEFAULT NULL,
  `idPicture` varchar(255) DEFAULT NULL,
  `phoneNumber` varchar(20) DEFAULT NULL,
  `email` varchar(100) DEFAULT NULL,
  PRIMARY KEY (`bannerID`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Table structure for table `userToBanner`
--

DROP TABLE IF EXISTS `userToBanner`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `userToBanner` (
  `userID` varchar(50) NOT NULL,
  `bannerID` varchar(20) NOT NULL,
  PRIMARY KEY (`userID`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Table structure for table `worksFor`
--

DROP TABLE IF EXISTS `worksFor`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `worksFor` (
  `workerID` varchar(20) NOT NULL,
  `adminID` int NOT NULL,
  PRIMARY KEY (`workerID`,`adminID`),
  KEY `adminID` (`adminID`),
  CONSTRAINT `worksFor_ibfk_1` FOREIGN KEY (`workerID`) REFERENCES `deskWorker` (`workerID`) ON DELETE CASCADE,
  CONSTRAINT `worksFor_ibfk_2` FOREIGN KEY (`adminID`) REFERENCES `administrator` (`adminID`) ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;
SET @@SESSION.SQL_LOG_BIN = @MYSQLDUMP_TEMP_LOG_BIN;
/*!40103 SET TIME_ZONE=@OLD_TIME_ZONE */;

/*!40101 SET SQL_MODE=@OLD_SQL_MODE */;
/*!40014 SET FOREIGN_KEY_CHECKS=@OLD_FOREIGN_KEY_CHECKS */;
/*!40014 SET UNIQUE_CHECKS=@OLD_UNIQUE_CHECKS */;
/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
/*!40111 SET SQL_NOTES=@OLD_SQL_NOTES */;

-- Dump completed on 2026-04-27 14:52:50
