-- Hackathon team members, one row per member including the leader (is_leader = 1)
CREATE TABLE IF NOT EXISTS `hackathon_team_members` (
  `id` INT UNSIGNED NOT NULL AUTO_INCREMENT,
  `registration_id` INT UNSIGNED NOT NULL,
  `name` VARCHAR(50) NOT NULL,
  `email` VARCHAR(100) NOT NULL,
  `is_leader` TINYINT(1) NOT NULL DEFAULT 0,
  `created_at` TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  UNIQUE KEY `uniq_team_member_reg_email` (`registration_id`, `email`),
  KEY `idx_team_member_registration` (`registration_id`),
  CONSTRAINT `fk_team_member_registration` FOREIGN KEY (`registration_id`) REFERENCES `hackathon_registrations` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
