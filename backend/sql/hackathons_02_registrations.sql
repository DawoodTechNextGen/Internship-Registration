-- Hackathon registrations (leader/primary registrant row for both individual and team entries)
CREATE TABLE IF NOT EXISTS `hackathon_registrations` (
  `id` INT UNSIGNED NOT NULL AUTO_INCREMENT,
  `hackathon_id` INT UNSIGNED NOT NULL,
  `registration_type` ENUM('individual','team') NOT NULL,
  `team_name` VARCHAR(100) NULL,
  `name` VARCHAR(50) NOT NULL,
  `email` VARCHAR(100) NOT NULL,
  `mbl_number` VARCHAR(20) NOT NULL,
  `city` VARCHAR(50) NULL,
  `technology_id` INT UNSIGNED NULL,
  `project_idea` TEXT NULL,
  `created_at` TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  UNIQUE KEY `uniq_hackathon_reg_email` (`hackathon_id`, `email`),
  UNIQUE KEY `uniq_hackathon_reg_mbl` (`hackathon_id`, `mbl_number`),
  KEY `idx_hackathon_reg_hackathon` (`hackathon_id`),
  KEY `idx_hackathon_reg_technology` (`technology_id`),
  CONSTRAINT `fk_hackathon_reg_hackathon` FOREIGN KEY (`hackathon_id`) REFERENCES `hackathons` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
