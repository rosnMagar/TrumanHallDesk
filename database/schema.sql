-- ============================================================
-- TrumanHallDesk Database Schema (Updated to reflect current DB state)
-- ============================================================

CREATE DATABASE IF NOT EXISTS TrumanHallDesk;
USE TrumanHallDesk;

-- ============================================================
-- User: base identity for Residents, Desk Workers, and Admins
-- ============================================================
CREATE TABLE `user` (
    bannerID      VARCHAR(20)  NOT NULL,
    firstName     VARCHAR(50)  NOT NULL,
    lastName      VARCHAR(50)  NOT NULL,
    homeAddress   VARCHAR(255),
    idPicture     VARCHAR(255),          -- S3 object URL
    phoneNumber   VARCHAR(20),
    email         VARCHAR(100),
    PRIMARY KEY (bannerID)
);

-- ============================================================
-- Buildings
-- ============================================================
CREATE TABLE buildings (
    buildingID    VARCHAR(10)  NOT NULL,
    streetAddress VARCHAR(255),
    PRIMARY KEY (buildingID)
);

-- ============================================================
-- Rooms  (RoomID = Building + RoomNumber composite, stored as one PK string)
-- ============================================================
CREATE TABLE rooms (
    roomID        VARCHAR(20)  NOT NULL,  -- e.g. 'McClain101'
    buildingID    VARCHAR(10)  NOT NULL,
    keyCode       VARCHAR(50),
    PRIMARY KEY (roomID),
    FOREIGN KEY (buildingID) REFERENCES buildings(buildingID)
        ON UPDATE CASCADE ON DELETE RESTRICT
);

-- ============================================================
-- Resident
-- ============================================================
CREATE TABLE resident (
    residentID    VARCHAR(20)  NOT NULL,  -- Banner ID
    dateCreated   DATE,
    roomID        VARCHAR(20),            -- FK -> rooms.roomID
    building      VARCHAR(10),            -- FK -> buildings.buildingID
    PRIMARY KEY (residentID),
    FOREIGN KEY (residentID)   REFERENCES `user`(bannerID)
        ON UPDATE CASCADE ON DELETE RESTRICT,
    FOREIGN KEY (roomID)   REFERENCES rooms(roomID)
        ON UPDATE CASCADE ON DELETE SET NULL,
    FOREIGN KEY (building) REFERENCES buildings(buildingID)
        ON UPDATE CASCADE ON DELETE SET NULL
);

-- ============================================================
-- Desk Worker
-- ============================================================
CREATE TABLE deskWorker (
    workerID          VARCHAR(20)  NOT NULL,  -- Banner ID
    assignedBuilding  VARCHAR(10),            -- FK -> buildings.buildingID
    PRIMARY KEY (workerID),
    FOREIGN KEY (workerID)           REFERENCES `user`(bannerID)
        ON UPDATE CASCADE ON DELETE RESTRICT,
    FOREIGN KEY (assignedBuilding) REFERENCES buildings(buildingID)
        ON UPDATE CASCADE ON DELETE SET NULL
);

-- ============================================================
-- Administrator
-- ============================================================
CREATE TABLE administrator (
    adminID           VARCHAR(20)  NOT NULL,  -- Banner ID
    assignedBuilding  VARCHAR(10),            -- FK -> buildings.buildingID
    officeNumber      VARCHAR(20),
    notes             TEXT,
    PRIMARY KEY (adminID),
    FOREIGN KEY (adminID)            REFERENCES `user`(bannerID)
        ON UPDATE CASCADE ON DELETE RESTRICT,
    FOREIGN KEY (assignedBuilding) REFERENCES buildings(buildingID)
        ON UPDATE CASCADE ON DELETE SET NULL
);

-- ============================================================
-- Works_For: Desk Worker works under Administrator (1:M)
-- ============================================================
CREATE TABLE worksFor (
    workerID  VARCHAR(20) NOT NULL,
    adminID   VARCHAR(20) NOT NULL,
    PRIMARY KEY (workerID, adminID),
    FOREIGN KEY (workerID) REFERENCES deskWorker(workerID)
        ON UPDATE CASCADE ON DELETE CASCADE,
    FOREIGN KEY (adminID)  REFERENCES administrator(adminID)
        ON UPDATE CASCADE ON DELETE CASCADE
);

-- ============================================================
-- Equipment
-- ============================================================
CREATE TABLE `equipment` (
  `equipmentID` int NOT NULL AUTO_INCREMENT,
  `currentOwner` varchar(20) DEFAULT NULL,
  `type` varchar(100) DEFAULT NULL,
  `checkoutTime` datetime DEFAULT NULL,
  `checkoutStaff` varchar(20) DEFAULT NULL,
  `description` text,
  `checkedOut` varchar(1) DEFAULT 'N',
  PRIMARY KEY (`equipmentID`),
  KEY `equipment_ibfk_1` (`currentOwner`),
  KEY `equipment_ibfk_2` (`checkoutStaff`),
  CONSTRAINT `equipment_ibfk_1` FOREIGN KEY (`currentOwner`) REFERENCES `resident` (`residentID`) ON DELETE SET NULL ON UPDATE CASCADE,
  CONSTRAINT `equipment_ibfk_2` FOREIGN KEY (`checkoutStaff`) REFERENCES `deskWorker` (`workerID`) ON DELETE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=132 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

-- ============================================================
-- Packages
-- ============================================================
CREATE TABLE packages (
    uniqueID           INT          NOT NULL AUTO_INCREMENT,
    `owner`            VARCHAR(20),        -- FK -> resident.residentID
    trackingID         VARCHAR(100),
    receivedDate       DATE,
    emailSent          TINYINT(1)   DEFAULT 0,
    pickedUp           TINYINT(1)   DEFAULT 0,
    `type`             VARCHAR(50),
    requiresForwarding TINYINT(1)   DEFAULT 0,
    PRIMARY KEY (uniqueID),
    FOREIGN KEY (`owner`) REFERENCES resident(residentID)
        ON UPDATE CASCADE ON DELETE SET NULL
);
