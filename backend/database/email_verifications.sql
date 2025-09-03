-- Email Verifications Table
-- This table stores email verification codes and tokens for user registration

CREATE TABLE IF NOT EXISTS email_verifications (
  id bigint(20) NOT NULL AUTO_INCREMENT,
  email varchar(255) NOT NULL,
  verification_code varchar(6) NOT NULL,
  verification_token varchar(64) NOT NULL,
  is_verified tinyint(1) DEFAULT 0,
  expires_at timestamp NOT NULL,
  verified_at timestamp NULL DEFAULT NULL,
  created_at timestamp NOT NULL DEFAULT current_timestamp(),
  updated_at timestamp NOT NULL DEFAULT current_timestamp() ON UPDATE current_timestamp(),
  PRIMARY KEY (id),
  UNIQUE KEY email (email),
  KEY verification_token (verification_token),
  KEY expires_at (expires_at)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;



