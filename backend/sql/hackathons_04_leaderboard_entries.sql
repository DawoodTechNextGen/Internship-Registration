-- Hackathon results / leaderboard entries (free-text display_name so admins
-- can enter winners that did not necessarily register through this system)
CREATE TABLE IF NOT EXISTS `hackathon_leaderboard_entries` (
  `id` INT UNSIGNED NOT NULL AUTO_INCREMENT,
  `hackathon_id` INT UNSIGNED NOT NULL,
  `rank` SMALLINT UNSIGNED NOT NULL,
  `display_name` VARCHAR(150) NOT NULL,
  `project_title` VARCHAR(150) NULL,
  `score` DECIMAL(6,2) NULL,
  `prize` VARCHAR(100) NULL,
  `registration_id` INT UNSIGNED NULL,
  `created_at` TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  UNIQUE KEY `uniq_leaderboard_hackathon_rank` (`hackathon_id`, `rank`),
  KEY `idx_leaderboard_hackathon` (`hackathon_id`),
  CONSTRAINT `fk_leaderboard_hackathon` FOREIGN KEY (`hackathon_id`) REFERENCES `hackathons` (`id`) ON DELETE CASCADE,
  CONSTRAINT `fk_leaderboard_registration` FOREIGN KEY (`registration_id`) REFERENCES `hackathon_registrations` (`id`) ON DELETE SET NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
