-- ============================================================
-- TrumanHallDesk Database Schema
-- Generated from ERD
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
    residentID    INT          NOT NULL AUTO_INCREMENT,
    `user`        VARCHAR(20)  NOT NULL,  -- FK -> user.bannerID
    dateCreated   DATE,
    roomID        VARCHAR(20),            -- FK -> rooms.roomID
    building      VARCHAR(10),            -- FK -> buildings.buildingID
    PRIMARY KEY (residentID),
    FOREIGN KEY (`user`)   REFERENCES `user`(bannerID)
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
    workerID          INT          NOT NULL AUTO_INCREMENT,
    `user`            VARCHAR(20)  NOT NULL,  -- FK -> user.bannerID
    assignedBuilding  VARCHAR(10),            -- FK -> buildings.buildingID
    PRIMARY KEY (workerID),
    FOREIGN KEY (`user`)             REFERENCES `user`(bannerID)
        ON UPDATE CASCADE ON DELETE RESTRICT,
    FOREIGN KEY (assignedBuilding) REFERENCES buildings(buildingID)
        ON UPDATE CASCADE ON DELETE SET NULL
);

-- ============================================================
-- Administrator
-- ============================================================
CREATE TABLE administrator (
    adminID           INT          NOT NULL AUTO_INCREMENT,
    `user`            VARCHAR(20)  NOT NULL,  -- FK -> user.bannerID
    assignedBuilding  VARCHAR(10),            -- FK -> buildings.buildingID
    officeNumber      VARCHAR(20),
    notes             TEXT,                   -- "Row 3" from ERD (extra notes field)
    PRIMARY KEY (adminID),
    FOREIGN KEY (`user`)             REFERENCES `user`(bannerID)
        ON UPDATE CASCADE ON DELETE RESTRICT,
    FOREIGN KEY (assignedBuilding) REFERENCES buildings(buildingID)
        ON UPDATE CASCADE ON DELETE SET NULL
);

-- ============================================================
-- Works_For: Desk Worker works under Administrator (1:M)
-- ============================================================
CREATE TABLE worksFor (
    workerID  INT NOT NULL,
    adminID   INT NOT NULL,
    PRIMARY KEY (workerID, adminID),
    FOREIGN KEY (workerID) REFERENCES deskWorker(workerID)
        ON UPDATE CASCADE ON DELETE CASCADE,
    FOREIGN KEY (adminID)  REFERENCES administrator(adminID)
        ON UPDATE CASCADE ON DELETE CASCADE
);

-- ============================================================
-- Equipment
--   Checked_Out: CurrentOwner -> Resident (who currently has the item)
--   Liable:      CheckoutStaff -> DeskWorker (who processed the checkout)
-- ============================================================
CREATE TABLE equipment (
    equipmentID   INT          NOT NULL AUTO_INCREMENT,
    currentOwner  INT,                    -- FK -> resident.residentID  (Checked_Out)
    `type`        VARCHAR(100),
    checkoutTime  DATETIME,
    checkoutStaff INT,                    -- FK -> deskWorker.workerID  (Liable)
    `description` TEXT,
    PRIMARY KEY (equipmentID),
    FOREIGN KEY (currentOwner)  REFERENCES resident(residentID)
        ON UPDATE CASCADE ON DELETE SET NULL,
    FOREIGN KEY (checkoutStaff) REFERENCES deskWorker(workerID)
        ON UPDATE CASCADE ON DELETE SET NULL
);

-- ============================================================
-- Packages
--   Recipient: linked to Resident (1 Resident : M Packages)
-- ============================================================
CREATE TABLE packages (
    uniqueID           INT          NOT NULL AUTO_INCREMENT,
    `owner`            INT,                -- FK -> resident.residentID  (Recipient)
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
