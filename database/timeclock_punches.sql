CREATE TABLE `timeclock_punches` (
  `id` varchar(36) NOT NULL,
  `bannerId` varchar(20) NOT NULL,
  `action` enum('in','out') NOT NULL,
  `at` datetime NOT NULL,
  PRIMARY KEY (`id`),
  KEY `bannerId` (`bannerId`),
  KEY `at` (`at`)
);