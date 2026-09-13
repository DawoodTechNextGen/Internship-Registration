-- Hackathon events (title, schedule, registration rules)
CREATE TABLE IF NOT EXISTS `hackathons` (
  `id` INT UNSIGNED NOT NULL AUTO_INCREMENT,
  `slug` VARCHAR(120) NOT NULL,
  `title` VARCHAR(150) NOT NULL,
  `description` TEXT NULL,
  `mode` ENUM('online','onsite','hybrid') NOT NULL DEFAULT 'online',
  `status` ENUM('draft','upcoming','open','closed','completed') NOT NULL DEFAULT 'draft',
  `allow_individual` TINYINT(1) NOT NULL DEFAULT 1,
  `allow_team` TINYINT(1) NOT NULL DEFAULT 1,
  `min_team_size` TINYINT UNSIGNED NOT NULL DEFAULT 1,
  `max_team_size` TINYINT UNSIGNED NOT NULL DEFAULT 4,
  `registration_start` DATETIME NULL,
  `registration_end` DATETIME NULL,
  `event_start` DATETIME NULL,
  `event_end` DATETIME NULL,
  `venue` VARCHAR(150) NULL,
  `banner_url` VARCHAR(255) NULL,
  `created_at` TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  UNIQUE KEY `uniq_hackathons_slug` (`slug`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
