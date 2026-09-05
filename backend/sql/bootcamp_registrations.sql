-- Bootcamp enrollment table (internship `registrations` se bilkul alag)
CREATE TABLE IF NOT EXISTS `bootcamp_registrations` (
  `id` INT UNSIGNED NOT NULL AUTO_INCREMENT,
  `name` VARCHAR(50) NOT NULL,
  `email` VARCHAR(100) NOT NULL,
  `mbl_number` VARCHAR(20) NOT NULL,
  `province` VARCHAR(50) NOT NULL,
  `city` VARCHAR(50) NOT NULL,
  `cnic` VARCHAR(15) NOT NULL,
  `created_at` TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  UNIQUE KEY `uniq_bootcamp_email` (`email`),
  UNIQUE KEY `uniq_bootcamp_mbl_number` (`mbl_number`),
  UNIQUE KEY `uniq_bootcamp_cnic` (`cnic`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
