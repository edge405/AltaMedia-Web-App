-- phpMyAdmin SQL Dump
-- version 5.2.1
-- https://www.phpmyadmin.net/
--
-- Host: 127.0.0.1
-- Generation Time: Aug 26, 2025 at 09:31 AM
-- Server version: 10.4.32-MariaDB
-- PHP Version: 8.2.12

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
START TRANSACTION;
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

--
-- Database: `alta_web`
--

-- --------------------------------------------------------

--
-- Table structure for table `addons`
--

CREATE TABLE `addons` (
  `id` int(11) NOT NULL,
  `name` varchar(255) NOT NULL,
  `description` text DEFAULT NULL,
  `price_type` varchar(50) NOT NULL,
  `base_price` decimal(10,2) NOT NULL CHECK (`base_price` >= 0),
  `is_active` tinyint(1) DEFAULT 1,
  `created_at` datetime DEFAULT current_timestamp(),
  `updated_at` datetime DEFAULT current_timestamp() ON UPDATE current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- Table structure for table `addon_features`
--

CREATE TABLE `addon_features` (
  `id` int(11) NOT NULL,
  `addon_id` int(11) NOT NULL,
  `feature_name` varchar(255) NOT NULL,
  `feature_description` text DEFAULT NULL,
  `is_active` tinyint(1) DEFAULT 1,
  `created_at` datetime DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- Table structure for table `brandkit_questionnaire_forms`
--

CREATE TABLE `brandkit_questionnaire_forms` (
  `id` varchar(36) NOT NULL DEFAULT uuid(),
  `user_id` bigint(20) NOT NULL,
  `brand_name` varchar(255) DEFAULT NULL,
  `brand_description` text DEFAULT NULL,
  `primary_customers` text DEFAULT NULL,
  `desired_emotion` varchar(50) DEFAULT NULL,
  `unfair_advantage` text DEFAULT NULL,
  `customer_miss` text DEFAULT NULL,
  `problem_solved` text DEFAULT NULL,
  `competitors` longtext CHARACTER SET utf8mb4 COLLATE utf8mb4_bin DEFAULT NULL CHECK (json_valid(`competitors`)),
  `competitor_likes` text DEFAULT NULL,
  `competitor_dislikes` text DEFAULT NULL,
  `brand_differentiation` text DEFAULT NULL,
  `brand_kit_use` longtext CHARACTER SET utf8mb4 COLLATE utf8mb4_bin DEFAULT NULL CHECK (json_valid(`brand_kit_use`)),
  `templates` longtext CHARACTER SET utf8mb4 COLLATE utf8mb4_bin DEFAULT NULL CHECK (json_valid(`templates`)),
  `internal_assets` longtext CHARACTER SET utf8mb4 COLLATE utf8mb4_bin DEFAULT NULL CHECK (json_valid(`internal_assets`)),
  `file_formats` longtext CHARACTER SET utf8mb4 COLLATE utf8mb4_bin DEFAULT NULL CHECK (json_valid(`file_formats`)),
  `cultural_adaptation` varchar(20) DEFAULT NULL,
  `brand_voice` longtext CHARACTER SET utf8mb4 COLLATE utf8mb4_bin DEFAULT NULL CHECK (json_valid(`brand_voice`)),
  `admired_brands` text DEFAULT NULL,
  `inspiration_brand` varchar(255) DEFAULT NULL,
  `communication_perception` longtext CHARACTER SET utf8mb4 COLLATE utf8mb4_bin DEFAULT NULL CHECK (json_valid(`communication_perception`)),
  `brand_logo` text DEFAULT NULL,
  `logo_redesign` varchar(20) DEFAULT NULL,
  `has_existing_colors` varchar(10) DEFAULT NULL,
  `existing_colors` longtext CHARACTER SET utf8mb4 COLLATE utf8mb4_bin DEFAULT NULL CHECK (json_valid(`existing_colors`)),
  `preferred_colors` longtext CHARACTER SET utf8mb4 COLLATE utf8mb4_bin DEFAULT NULL CHECK (json_valid(`preferred_colors`)),
  `colors_to_avoid` longtext CHARACTER SET utf8mb4 COLLATE utf8mb4_bin DEFAULT NULL CHECK (json_valid(`colors_to_avoid`)),
  `imagery_style` longtext CHARACTER SET utf8mb4 COLLATE utf8mb4_bin DEFAULT NULL CHECK (json_valid(`imagery_style`)),
  `font_types` longtext CHARACTER SET utf8mb4 COLLATE utf8mb4_bin DEFAULT NULL CHECK (json_valid(`font_types`)),
  `font_styles` longtext CHARACTER SET utf8mb4 COLLATE utf8mb4_bin DEFAULT NULL CHECK (json_valid(`font_styles`)),
  `legal_considerations` text DEFAULT NULL,
  `source_files` longtext CHARACTER SET utf8mb4 COLLATE utf8mb4_bin DEFAULT NULL CHECK (json_valid(`source_files`)),
  `required_formats` longtext CHARACTER SET utf8mb4 COLLATE utf8mb4_bin DEFAULT NULL CHECK (json_valid(`required_formats`)),
  `reference_materials` text DEFAULT NULL,
  `inspiration_brands` text DEFAULT NULL,
  `brand_vibe` longtext CHARACTER SET utf8mb4 COLLATE utf8mb4_bin DEFAULT NULL CHECK (json_valid(`brand_vibe`)),
  `brand_words` longtext CHARACTER SET utf8mb4 COLLATE utf8mb4_bin DEFAULT NULL CHECK (json_valid(`brand_words`)),
  `brand_avoid_words` longtext CHARACTER SET utf8mb4 COLLATE utf8mb4_bin DEFAULT NULL CHECK (json_valid(`brand_avoid_words`)),
  `tagline` varchar(255) DEFAULT NULL,
  `mission` text DEFAULT NULL,
  `vision` text DEFAULT NULL,
  `core_values` longtext CHARACTER SET utf8mb4 COLLATE utf8mb4_bin DEFAULT NULL CHECK (json_valid(`core_values`)),
  `has_web_page` varchar(10) DEFAULT NULL,
  `web_page_upload` text DEFAULT NULL,
  `want_web_page` varchar(50) DEFAULT NULL,
  `current_step` int(11) DEFAULT 1,
  `progress_percentage` int(11) DEFAULT 0,
  `is_completed` tinyint(1) DEFAULT 0,
  `created_at` timestamp NOT NULL DEFAULT current_timestamp(),
  `updated_at` timestamp NOT NULL DEFAULT current_timestamp() ON UPDATE current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `brandkit_questionnaire_forms`
--

INSERT INTO `brandkit_questionnaire_forms` (`id`, `user_id`, `brand_name`, `brand_description`, `primary_customers`, `desired_emotion`, `unfair_advantage`, `customer_miss`, `problem_solved`, `competitors`, `competitor_likes`, `competitor_dislikes`, `brand_differentiation`, `brand_kit_use`, `templates`, `internal_assets`, `file_formats`, `cultural_adaptation`, `brand_voice`, `admired_brands`, `inspiration_brand`, `communication_perception`, `brand_logo`, `logo_redesign`, `has_existing_colors`, `existing_colors`, `preferred_colors`, `colors_to_avoid`, `imagery_style`, `font_types`, `font_styles`, `legal_considerations`, `source_files`, `required_formats`, `reference_materials`, `inspiration_brands`, `brand_vibe`, `brand_words`, `brand_avoid_words`, `tagline`, `mission`, `vision`, `core_values`, `has_web_page`, `web_page_upload`, `want_web_page`, `current_step`, `progress_percentage`, `is_completed`, `created_at`, `updated_at`) VALUES
('048be546-2cb9-45a6-945a-de73e84fc76b', 8, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, 9, 100, 1, '2025-08-26 03:41:28', '2025-08-26 03:41:48'),
('5cc21164-51a7-4ce4-9c03-086f7892cbab', 5, 'Water Bottle', 'sample', 'sample', 'energized', 'sample', 'sample', 'sample', '[\"Google\",\"Microsoft\"]', 'sample', 'sample', 'sample', '[\"Website\",\"Social Media\",\"Packaging\",\"Presentations\",\"Merchandise\",\"Business Cards\",\"Email Marketing\",\"Print Materials\"]', '[\"Social Posts\",\"Business Cards\",\"Email Signatures\",\"Pitch Decks\",\"Letterhead\",\"Social Media Templates\"]', '[\"Recruitment Materials\",\"Pitch Decks\",\"HR Handbooks\",\"Internal Communications\",\"Training Materials\"]', '[\"PNG\",\"JPG\",\"PDF\",\"AI\",\"EPS\",\"SVG\",\"Figma\",\"PSD\"]', 'yes', '[\"Formal\",\"Casual\",\"Witty\",\"Professional\",\"Playful\",\"Authoritative\",\"Friendly\",\"Sophisticated\"]', 'sample', 'sample', '[\"Authoritative\",\"Friendly\",\"Quirky\",\"Luxurious\",\"Approachable\",\"Professional\",\"Innovative\",\"Trustworthy\"]', NULL, NULL, 'yes', '[\"#e3d21c\"]', NULL, '[\"#e91616\"]', '[\"Minimalist\",\"Vibrant\"]', '[\"Serif\",\"Sans-serif\",\"Script\",\"Display\",\"Monospace\"]', '[\"Modern\",\"Classic\",\"Playful\",\"Professional\",\"Elegant\"]', 'sample', '[\"AI\",\"PSD\",\"Figma\",\"Sketch\",\"XD\"]', '[\"PNG\",\"SVG\",\"PDF\",\"JPG\",\"EPS\",\"TIFF\"]', NULL, 'sample', '[\"Eco-friendly\",\"Luxury\"]', '[\"Innovative\",\"Trustworthy\"]', '[\"Cheap\",\"Unreliable\"]', 'sample', 'sample', 'sample', '[\"Innovation\",\"Integrity\"]', 'yes', NULL, NULL, 5, 56, 1, '2025-08-25 10:04:55', '2025-08-26 02:48:03'),
('d582ecde-de0c-4624-babd-aba05d8fdd30', 9, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, 9, 100, 1, '2025-08-26 03:34:21', '2025-08-26 03:34:37'),
('df64ae4f-6f90-4e8e-8a0b-2ad260338d6a', 1, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, 9, 100, 1, '2025-08-26 05:37:04', '2025-08-26 05:37:21');

--
-- Triggers `brandkit_questionnaire_forms`
--
DELIMITER $$
CREATE TRIGGER `calculate_brandkit_questionnaire_progress` BEFORE INSERT ON `brandkit_questionnaire_forms` FOR EACH ROW BEGIN
        -- Calculate progress based on current step (9 total steps)
        SET NEW.progress_percentage = LEAST((NEW.current_step * 100) / 9, 100);
        
        -- Mark as completed if on final step
        IF NEW.current_step >= 9 THEN
            SET NEW.is_completed = TRUE;
        END IF;
    END
$$
DELIMITER ;
DELIMITER $$
CREATE TRIGGER `calculate_brandkit_questionnaire_progress_update` BEFORE UPDATE ON `brandkit_questionnaire_forms` FOR EACH ROW BEGIN
        -- Calculate progress based on current step (9 total steps)
        SET NEW.progress_percentage = LEAST((NEW.current_step * 100) / 9, 100);
        
        -- Mark as completed if on final step
        IF NEW.current_step >= 9 THEN
            SET NEW.is_completed = TRUE;
        END IF;
    END
$$
DELIMITER ;

-- --------------------------------------------------------

--
-- Table structure for table `company_brand_kit_forms`
--

CREATE TABLE `company_brand_kit_forms` (
  `id` char(36) NOT NULL,
  `user_id` bigint(20) DEFAULT NULL,
  `building_type` varchar(255) DEFAULT NULL,
  `business_email` varchar(255) DEFAULT NULL,
  `has_proventous_id` varchar(255) DEFAULT NULL,
  `proventous_id` varchar(255) DEFAULT NULL,
  `business_name` varchar(255) DEFAULT NULL,
  `contact_number` varchar(50) DEFAULT NULL,
  `preferred_contact` varchar(50) DEFAULT NULL,
  `industry` longtext CHARACTER SET utf8mb4 COLLATE utf8mb4_bin DEFAULT NULL CHECK (json_valid(`industry`)),
  `year_started` int(11) DEFAULT NULL,
  `primary_location` varchar(255) DEFAULT NULL,
  `behind_brand` text DEFAULT NULL,
  `current_customers` longtext CHARACTER SET utf8mb4 COLLATE utf8mb4_bin DEFAULT NULL CHECK (json_valid(`current_customers`)),
  `want_to_attract` text DEFAULT NULL,
  `team_description` text DEFAULT NULL,
  `desired_emotion` varchar(255) DEFAULT NULL,
  `target_professions` longtext CHARACTER SET utf8mb4 COLLATE utf8mb4_bin DEFAULT NULL CHECK (json_valid(`target_professions`)),
  `reach_locations` longtext CHARACTER SET utf8mb4 COLLATE utf8mb4_bin DEFAULT NULL CHECK (json_valid(`reach_locations`)),
  `age_groups` longtext CHARACTER SET utf8mb4 COLLATE utf8mb4_bin DEFAULT NULL CHECK (json_valid(`age_groups`)),
  `spending_habits` longtext CHARACTER SET utf8mb4 COLLATE utf8mb4_bin DEFAULT NULL CHECK (json_valid(`spending_habits`)),
  `interaction_methods` longtext CHARACTER SET utf8mb4 COLLATE utf8mb4_bin DEFAULT NULL CHECK (json_valid(`interaction_methods`)),
  `customer_challenges` text DEFAULT NULL,
  `customer_motivation` text DEFAULT NULL,
  `audience_behavior` longtext CHARACTER SET utf8mb4 COLLATE utf8mb4_bin DEFAULT NULL CHECK (json_valid(`audience_behavior`)),
  `customer_choice` text DEFAULT NULL,
  `culture_words` longtext CHARACTER SET utf8mb4 COLLATE utf8mb4_bin DEFAULT NULL CHECK (json_valid(`culture_words`)),
  `team_traditions` text DEFAULT NULL,
  `team_highlights` text DEFAULT NULL,
  `reason1` varchar(255) DEFAULT NULL,
  `reason2` varchar(255) DEFAULT NULL,
  `reason3` varchar(255) DEFAULT NULL,
  `brand_soul` varchar(255) DEFAULT NULL,
  `brand_tone` longtext CHARACTER SET utf8mb4 COLLATE utf8mb4_bin DEFAULT NULL CHECK (json_valid(`brand_tone`)),
  `brand1` text DEFAULT NULL,
  `brand2` text DEFAULT NULL,
  `brand3` text DEFAULT NULL,
  `brand_avoid` text DEFAULT NULL,
  `mission_statement` text DEFAULT NULL,
  `long_term_vision` text DEFAULT NULL,
  `core_values` longtext CHARACTER SET utf8mb4 COLLATE utf8mb4_bin DEFAULT NULL CHECK (json_valid(`core_values`)),
  `brand_personality` longtext CHARACTER SET utf8mb4 COLLATE utf8mb4_bin DEFAULT NULL CHECK (json_valid(`brand_personality`)),
  `has_logo` varchar(255) DEFAULT NULL,
  `logo_action` longtext CHARACTER SET utf8mb4 COLLATE utf8mb4_bin DEFAULT NULL CHECK (json_valid(`logo_action`)),
  `preferred_colors` longtext CHARACTER SET utf8mb4 COLLATE utf8mb4_bin DEFAULT NULL CHECK (json_valid(`preferred_colors`)),
  `colors_to_avoid` longtext CHARACTER SET utf8mb4 COLLATE utf8mb4_bin DEFAULT NULL CHECK (json_valid(`colors_to_avoid`)),
  `font_styles` longtext CHARACTER SET utf8mb4 COLLATE utf8mb4_bin DEFAULT NULL CHECK (json_valid(`font_styles`)),
  `design_style` longtext CHARACTER SET utf8mb4 COLLATE utf8mb4_bin DEFAULT NULL CHECK (json_valid(`design_style`)),
  `logo_type` longtext CHARACTER SET utf8mb4 COLLATE utf8mb4_bin DEFAULT NULL CHECK (json_valid(`logo_type`)),
  `imagery_style` longtext CHARACTER SET utf8mb4 COLLATE utf8mb4_bin DEFAULT NULL CHECK (json_valid(`imagery_style`)),
  `inspiration_links` text DEFAULT NULL,
  `brand_kit_use` longtext CHARACTER SET utf8mb4 COLLATE utf8mb4_bin DEFAULT NULL CHECK (json_valid(`brand_kit_use`)),
  `brand_elements` longtext CHARACTER SET utf8mb4 COLLATE utf8mb4_bin DEFAULT NULL CHECK (json_valid(`brand_elements`)),
  `file_formats` longtext CHARACTER SET utf8mb4 COLLATE utf8mb4_bin DEFAULT NULL CHECK (json_valid(`file_formats`)),
  `primary_goal` text DEFAULT NULL,
  `short_term_goals` text DEFAULT NULL,
  `mid_term_goals` text DEFAULT NULL,
  `long_term_goal` text DEFAULT NULL,
  `big_picture_vision` text DEFAULT NULL,
  `success_metrics` longtext CHARACTER SET utf8mb4 COLLATE utf8mb4_bin DEFAULT NULL CHECK (json_valid(`success_metrics`)),
  `business_description` text DEFAULT NULL,
  `inspiration` text DEFAULT NULL,
  `target_interests` longtext CHARACTER SET utf8mb4 COLLATE utf8mb4_bin DEFAULT NULL CHECK (json_valid(`target_interests`)),
  `current_interests` longtext CHARACTER SET utf8mb4 COLLATE utf8mb4_bin DEFAULT NULL CHECK (json_valid(`current_interests`)),
  `special_notes` text DEFAULT NULL,
  `timeline` varchar(255) DEFAULT NULL,
  `approver` varchar(255) DEFAULT NULL,
  `reference_materials` text DEFAULT NULL,
  `current_step` int(11) DEFAULT 1,
  `progress_percentage` int(11) DEFAULT 0,
  `is_completed` tinyint(1) DEFAULT 0,
  `completed_at` datetime DEFAULT NULL,
  `created_at` datetime DEFAULT current_timestamp(),
  `updated_at` datetime DEFAULT current_timestamp() ON UPDATE current_timestamp(),
  `spending_type` varchar(255) DEFAULT NULL,
  `secondary_audience` text DEFAULT NULL,
  `emotional_goal` varchar(255) DEFAULT NULL,
  `culture_description` text DEFAULT NULL,
  `business_stage` varchar(255) DEFAULT NULL,
  `purchase_motivators` text DEFAULT NULL,
  `has_social_media` varchar(255) DEFAULT NULL,
  `social_media_platforms` longtext CHARACTER SET utf8mb4 COLLATE utf8mb4_bin DEFAULT NULL CHECK (json_valid(`social_media_platforms`)),
  `facebook_url` varchar(500) DEFAULT NULL,
  `instagram_url` varchar(500) DEFAULT NULL,
  `twitter_url` varchar(500) DEFAULT NULL,
  `linkedin_url` varchar(500) DEFAULT NULL,
  `tiktok_url` varchar(500) DEFAULT NULL,
  `youtube_url` varchar(500) DEFAULT NULL,
  `pinterest_url` varchar(500) DEFAULT NULL,
  `snapchat_username` varchar(255) DEFAULT NULL,
  `other_social_media_urls` text DEFAULT NULL,
  `want_to_create_social_media` varchar(255) DEFAULT NULL,
  `desired_social_media_platforms` longtext CHARACTER SET utf8mb4 COLLATE utf8mb4_bin DEFAULT NULL CHECK (json_valid(`desired_social_media_platforms`))
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `company_brand_kit_forms`
--

INSERT INTO `company_brand_kit_forms` (`id`, `user_id`, `building_type`, `business_email`, `has_proventous_id`, `proventous_id`, `business_name`, `contact_number`, `preferred_contact`, `industry`, `year_started`, `primary_location`, `behind_brand`, `current_customers`, `want_to_attract`, `team_description`, `desired_emotion`, `target_professions`, `reach_locations`, `age_groups`, `spending_habits`, `interaction_methods`, `customer_challenges`, `customer_motivation`, `audience_behavior`, `customer_choice`, `culture_words`, `team_traditions`, `team_highlights`, `reason1`, `reason2`, `reason3`, `brand_soul`, `brand_tone`, `brand1`, `brand2`, `brand3`, `brand_avoid`, `mission_statement`, `long_term_vision`, `core_values`, `brand_personality`, `has_logo`, `logo_action`, `preferred_colors`, `colors_to_avoid`, `font_styles`, `design_style`, `logo_type`, `imagery_style`, `inspiration_links`, `brand_kit_use`, `brand_elements`, `file_formats`, `primary_goal`, `short_term_goals`, `mid_term_goals`, `long_term_goal`, `big_picture_vision`, `success_metrics`, `business_description`, `inspiration`, `target_interests`, `current_interests`, `special_notes`, `timeline`, `approver`, `reference_materials`, `current_step`, `progress_percentage`, `is_completed`, `completed_at`, `created_at`, `updated_at`, `spending_type`, `secondary_audience`, `emotional_goal`, `culture_description`, `business_stage`, `purchase_motivators`, `has_social_media`, `social_media_platforms`, `facebook_url`, `instagram_url`, `twitter_url`, `linkedin_url`, `tiktok_url`, `youtube_url`, `pinterest_url`, `snapchat_username`, `other_social_media_urls`, `want_to_create_social_media`, `desired_social_media_platforms`) VALUES
('6fe163d8-148a-4e61-888c-a6b8ed867f32', 1, 'business', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, 11, 100, 0, NULL, '2025-08-26 13:36:38', '2025-08-26 13:37:01', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL),
('8d8d8f83-2aa6-48e5-b1f3-f4b8049ffb04', 5, 'business', 'Hubo@business.com', 'no', NULL, 'Hubo Moto', '09123456789', 'phone', '[\"Technology\",\"Healthcare\"]', 2021, NULL, 'Carlo Hubo', '[\"Male\",\"Female\",\"Everyone\"]', 'Anyone', NULL, 'fulfilled', '[\"Entrepreneurs\",\"Managers\",\"Professionals\"]', '[\"Social Media\"]', '[\"Teens (13–19)\",\"Young Adults (20–29)\",\"Adults (30–39)\",\"Mature Adults (40–59)\",\"Seniors (60+)\"]', '[\"Value-focused\",\"Luxury\"]', '[\"Website\",\"Social Media\",\"Phone\",\"Email\",\"In-person\",\"Mobile App\"]', 'Lack of information', NULL, '[\"Technology\",\"Social media active\"]', NULL, '[\"Innovative\",\"Growth\",\"Professional\"]', '---', NULL, NULL, NULL, NULL, NULL, '[\"Professional\",\"Casual\",\"Friendly\",\"Authoritative\",\"Playful\",\"Sophisticated\"]', NULL, NULL, NULL, NULL, NULL, NULL, NULL, '[\"Innovative\",\"Passionate\",\"Inclusive\",\"Value\"]', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, '[\"uploads\\\\forms\\\\form_1755847032798_wxvkrf0np_Acer_Wallpaper_01_3840x2400.jpg\",\"uploads\\\\forms\\\\form_1755847032845_b63bxp3cq_Acer_Wallpaper_01_5000x2814.jpg\"]', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, '\"Hubo Moto revolutionizes healthcare through innovative technology, making life-saving solutions accessible and efficient to all.\"', 'At the heart of Hubo Moto is a story of passion and innovation. Carlo Hubo, the visionary behind this dynamic enterprise, embarked on this journey in 2021. Driven by his love for technology and determination to make a difference in the healthcare industry, Carlo envisioned a business that would disrupt the status quo and bring about a positive change.\n\nCarlo was inspired by the belief that technology has the potential to not just improve lives, but to transform them. He saw an untapped opportunity in the confluence of healthcare and technology, and thus, Hubo Moto was born. The name itself, \'Hubo Moto\', is a testament to the relentless drive that fuels this enterprise. \'Hubo\', meaning \'creation\' and \'Moto\', representing \'motion\', collectively symbolize the continuous evolution and innovation at the core of this brand.\n\nBased in the bustling heart of Iloilo City, Philippines, Hubo Moto serves a diverse clientele. The company\'s products and services are designed for anyone and everyone, reflecting its inclusive philosophy. Despite its growth, Hubo Moto remains committed to providing value and ensuring its customers feel fulfilled.\n\nHubo Moto\'s inspiration is not just about harnessing the power of technology. It\'s about using that power to create a healthier, brighter future for all. As the brand continues to grow and evolve, the initial spark of inspiration that led to its creation remains at its core, guiding its journey towards achieving its long-term goals.\n\nTo witness the journey of Hub', '[\"Technology Enthusiasts\",\"Healthcare Professionals\",\"Moto Lovers\",\"Early Adopters\",\"Value Seekers\",\"Modern Lifestyle\",\"Digital Savvy\",\"Wellness Advocate\",\"Tech Innovators\",\"Health Conscious\",\"Active Lifestyle\",\"Personal Growth\",\"Trend Followers\",\"Gadget Lovers\",\"Self\"]', '[\"Technology Enthusiasts\",\"Healthcare Innovations\",\"Early Adopters\",\"Value Seekers\",\"Tech\"]', NULL, NULL, NULL, '[\"uploads\\\\forms\\\\form_1755847032570_la5l1uqtj_Acer_Wallpaper_01_3840x2400.jpg\",\"uploads\\\\forms\\\\form_1755847032654_1byjxjk64_Acer_Wallpaper_01_5000x2814.jpg\",\"uploads\\\\forms\\\\form_1755847032723_albs5w64g_Acer_Wallpaper_02_3840x2400.jpg\"]', 11, 100, 0, NULL, '2025-08-22 14:23:51', '2025-08-22 15:17:12', 'value-seeking', 'None', 'inspired', 'Productive', 'growing', 'At Hubo Moto, what truly motivates our customers to choose us over our competitors is our unique blend of technology and healthcare solutions. We understand that in this day and age, these two sectors are intertwined more than ever and play a critical role in our daily lives. \n\nBegun in 2021, we are a young, ambitious, and growing company, constantly seeking to innovate and provide value-driven solutions. We believe in creating a sense of fulfillment for our customers, regardless of their demographic. \n\nLocated in the heart of Iloilo City, Philippines, we are at the epicenter of the city\'s tech and health scene. We offer state-of-the-art solutions without compromising on the personal touch. Despite being relatively new, our commitment to customer satisfaction and continuous improvement has helped us make a mark in our industry.\n\nOur primary goal is not just to provide products or services, but to create an experience that leaves our customers feeling satisfied and cared for. Whether it\'s through our product offerings or customer service, we strive to make a positive impact on every individual who comes into contact with our brand.\n\nBy choosing Hubo Moto, our customers are not just investing in a product or service, they are becoming a part of a community that values innovation, health, and most importantly, people. We look forward to growing and evolving with our customers, always striving to meet and exceed their expectations.', 'no', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, 'no', NULL),
('d56e5229-14bc-4e2e-a385-a43f9ac8b156', 8, 'business', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, 11, 0, 0, NULL, '2025-08-25 14:53:46', '2025-08-25 17:51:34', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL),
('e23964b1-218e-45b7-9800-f3cced8c3a90', 9, 'business', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, 11, 100, 0, NULL, '2025-08-26 11:33:57', '2025-08-26 11:34:18', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL);

-- --------------------------------------------------------

--
-- Table structure for table `deliverables`
--

CREATE TABLE `deliverables` (
  `id` int(11) NOT NULL,
  `purchase_id` int(11) NOT NULL,
  `feature_name` varchar(255) NOT NULL,
  `file_path` varchar(500) NOT NULL,
  `uploaded_by` bigint(20) NOT NULL,
  `status` enum('pending','approved','revision_requested') DEFAULT 'pending',
  `admin_notes` text DEFAULT NULL,
  `uploaded_at` datetime DEFAULT current_timestamp(),
  `updated_at` datetime DEFAULT current_timestamp() ON UPDATE current_timestamp(),
  `version_number` int(11) DEFAULT 1,
  `deliverable_link` text DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `deliverables`
--

INSERT INTO `deliverables` (`id`, `purchase_id`, `feature_name`, `file_path`, `uploaded_by`, `status`, `admin_notes`, `uploaded_at`, `updated_at`, `version_number`, `deliverable_link`) VALUES
(1, 1, 'Social Media Marketing Package', 'uploads\\deliverables\\deliverable_1755671539831_biszsdeab_erd.png', 7, 'approved', 'Initial version of the social media marketing package', '2025-08-20 14:32:19', '2025-08-26 14:49:24', 1, NULL),
(2, 5, 'Layout Graphics for Posting Ads', 'uploads\\deliverables\\deliverable_1755685928078_ixa8qhdhd_Acer_Wallpaper_01_3840x2400.jpg', 7, 'revision_requested', 'Updated version with improvements', '2025-08-20 14:44:30', '2025-08-20 18:32:08', 1, NULL),
(4, 5, 'Layout Graphics for Posting and Ads', 'uploads\\deliverables\\deliverable_1755849943733_vcytqcrds_Acer_Wallpaper_02_3840x2400.jpg', 7, 'revision_requested', 'Here\'s your the layout graphics', '2025-08-22 16:05:43', '2025-08-22 17:10:05', 1, NULL),
(6, 6, 'Layout Graphics for Posting and Ads', 'uploads\\deliverables\\deliverable_1756016959039_h8hpp13tp_Planet9_Wallpaper_5000x2813.jpg', 7, 'revision_requested', 'Graphics for posting ads', '2025-08-24 14:29:19', '2025-08-24 14:42:10', 1, NULL),
(7, 5, 'Layout Graphics for Posting Ads', 'uploads\\deliverables\\deliverable_1756020201617_w5gur5pku_Planet9_Wallpaper_5000x2813.jpg', 7, 'approved', 'Got it', '2025-08-24 15:23:21', '2025-08-26 14:49:31', 2, NULL),
(8, 5, 'Layout Graphics for Posting and Ads', 'uploads\\deliverables\\deliverable_1756020415282_6p7ngd0ey_Acer_Wallpaper_03_5000x2814.jpg', 7, 'pending', 'Here\'s the logo with your color request', '2025-08-24 15:26:55', '2025-08-24 15:26:55', 2, NULL),
(9, 5, 'Layout Graphics for Posting and Ads', 'uploads\\deliverables\\deliverable_1756176606082_bwil8d4d4_Acer_Wallpaper_01_3840x2400.jpg', 7, 'pending', NULL, '2025-08-26 10:50:06', '2025-08-26 10:50:06', 3, NULL),
(10, 6, 'Layout Graphics for Posting and Ads', 'uploads\\deliverables\\deliverable_1756179794432_7mgcbtcl1_Acer_Wallpaper_05_3840x2400.jpg', 7, 'revision_requested', 'here\'s your revision', '2025-08-26 11:43:14', '2025-08-26 11:43:55', 2, NULL),
(11, 5, 'Layout Graphics for Posting and Ads', 'uploads\\deliverables\\deliverable_1756186489482_wthin32vx_Acer_Wallpaper_01_3840x2400.jpg', 7, 'approved', NULL, '2025-08-26 13:34:49', '2025-08-26 14:49:43', 4, NULL),
(12, 6, 'Layout Graphics for Posting and Ads', 'uploads\\deliverables\\deliverable_1756187430958_6i5dnks2r_Acer_Wallpaper_01_5000x2814.jpg', 7, 'approved', 'Here\'s the new layout', '2025-08-26 13:50:31', '2025-08-26 13:51:15', 3, NULL),
(13, 6, 'Layout Graphics for Posting and Ads', 'uploads\\deliverables\\deliverable_1756192137647_xz9we3dc1_Acer_Wallpaper_01_5000x2814.jpg', 7, 'revision_requested', 'sample', '2025-08-26 15:08:57', '2025-08-26 15:10:02', 4, NULL);

-- --------------------------------------------------------

--
-- Table structure for table `organization_forms`
--

CREATE TABLE `organization_forms` (
  `id` char(36) NOT NULL,
  `user_id` bigint(20) DEFAULT NULL,
  `building_type` varchar(255) NOT NULL DEFAULT 'organization',
  `organization_name` varchar(255) DEFAULT NULL,
  `social_media_goals` text DEFAULT NULL,
  `brand_uniqueness` text DEFAULT NULL,
  `desired_emotion` varchar(255) DEFAULT NULL,
  `target_platforms` longtext CHARACTER SET utf8mb4 COLLATE utf8mb4_bin DEFAULT NULL CHECK (json_valid(`target_platforms`)),
  `content_types` longtext CHARACTER SET utf8mb4 COLLATE utf8mb4_bin DEFAULT NULL CHECK (json_valid(`content_types`)),
  `deliverables` longtext CHARACTER SET utf8mb4 COLLATE utf8mb4_bin DEFAULT NULL CHECK (json_valid(`deliverables`)),
  `timeline` varchar(255) DEFAULT NULL,
  `main_contact` varchar(255) DEFAULT NULL,
  `additional_info` text DEFAULT NULL,
  `reference_materials` text DEFAULT NULL,
  `current_step` int(11) DEFAULT 1,
  `progress_percentage` int(11) DEFAULT 0,
  `is_completed` tinyint(1) DEFAULT 0,
  `completed_at` datetime DEFAULT NULL,
  `created_at` datetime DEFAULT current_timestamp(),
  `updated_at` datetime DEFAULT current_timestamp() ON UPDATE current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `organization_forms`
--

INSERT INTO `organization_forms` (`id`, `user_id`, `building_type`, `organization_name`, `social_media_goals`, `brand_uniqueness`, `desired_emotion`, `target_platforms`, `content_types`, `deliverables`, `timeline`, `main_contact`, `additional_info`, `reference_materials`, `current_step`, `progress_percentage`, `is_completed`, `completed_at`, `created_at`, `updated_at`) VALUES
('048eab2b-c9e9-4d87-9586-c922447875e0', 1, 'organization', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, '[]', 4, 100, 0, NULL, '2025-08-26 13:37:23', '2025-08-26 13:37:27'),
('8240ea29-ece1-4d98-983b-f75388670e52', 8, 'organization', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, '[]', 4, 100, 0, NULL, '2025-08-25 15:17:44', '2025-08-26 11:41:50'),
('a55e48d3-e299-4ca7-81e6-114a922a79ad', 9, 'organization', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, '[]', 4, 100, 0, NULL, '2025-08-26 11:34:38', '2025-08-26 11:34:42'),
('a72ea1f8-4225-4c3f-9316-4c1f0ab2340a', 5, 'organization', 'Hubo', NULL, NULL, NULL, '[\"Facebook\",\"Instagram\",\"TikTok\",\"YouTube\",\"LinkedIn\"]', '[\"Short Videos/Reels\",\"Static Graphics\",\"Carousel Posts\",\"Motion Graphics\",\"Long-Form Videos\"]', '[\"Social Media Calendar\",\"Ad Creatives\",\"Caption Writing + Hashtags\",\"Video Editing\",\"Graphics Design\",\"Platform Setup/Optimization\",\"Performance Reports\"]', NULL, 'sample', 'sample', '[]', 4, 100, 0, NULL, '2025-08-22 14:18:54', '2025-08-25 18:44:19');

-- --------------------------------------------------------

--
-- Table structure for table `packages`
--

CREATE TABLE `packages` (
  `id` int(11) NOT NULL,
  `name` varchar(255) NOT NULL,
  `description` text DEFAULT NULL,
  `price` decimal(10,2) NOT NULL CHECK (`price` >= 0),
  `duration_days` int(11) NOT NULL CHECK (`duration_days` > 0),
  `is_active` tinyint(1) DEFAULT 1,
  `created_at` datetime DEFAULT current_timestamp(),
  `updated_at` datetime DEFAULT current_timestamp() ON UPDATE current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- Table structure for table `package_features`
--

CREATE TABLE `package_features` (
  `id` int(11) NOT NULL,
  `package_id` int(11) NOT NULL,
  `feature_name` varchar(255) NOT NULL,
  `feature_description` text DEFAULT NULL,
  `is_active` tinyint(1) DEFAULT 1,
  `created_at` datetime DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- Table structure for table `package_feature_comments`
--

CREATE TABLE `package_feature_comments` (
  `id` int(11) NOT NULL,
  `package_feature_id` int(11) NOT NULL,
  `user_id` bigint(20) NOT NULL,
  `comment_text` text NOT NULL,
  `created_at` datetime DEFAULT current_timestamp(),
  `updated_at` datetime DEFAULT current_timestamp() ON UPDATE current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- Table structure for table `package_purchases`
--

CREATE TABLE `package_purchases` (
  `id` int(11) NOT NULL,
  `user_id` bigint(20) NOT NULL,
  `package_id` int(11) NOT NULL,
  `purchase_date` datetime DEFAULT current_timestamp(),
  `expiration_date` date NOT NULL,
  `status` enum('active','expired','cancelled') DEFAULT 'active',
  `total_amount` decimal(10,2) NOT NULL,
  `features` longtext CHARACTER SET utf8mb4 COLLATE utf8mb4_bin DEFAULT NULL CHECK (json_valid(`features`)),
  `created_at` datetime DEFAULT current_timestamp(),
  `updated_at` datetime DEFAULT current_timestamp() ON UPDATE current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- Table structure for table `product_service_forms`
--

CREATE TABLE `product_service_forms` (
  `id` char(36) NOT NULL,
  `user_id` bigint(20) DEFAULT NULL,
  `building_type` varchar(255) DEFAULT 'product',
  `product_name` varchar(255) DEFAULT NULL,
  `product_description` text DEFAULT NULL,
  `industry` longtext CHARACTER SET utf8mb4 COLLATE utf8mb4_bin DEFAULT NULL CHECK (json_valid(`industry`)),
  `want_to_attract` text DEFAULT NULL,
  `mission_story` text DEFAULT NULL,
  `desired_emotion` varchar(255) DEFAULT NULL,
  `brand_tone` varchar(255) DEFAULT NULL,
  `target_audience_profile` text DEFAULT NULL,
  `reach_locations` longtext CHARACTER SET utf8mb4 COLLATE utf8mb4_bin DEFAULT NULL CHECK (json_valid(`reach_locations`)),
  `brand_personality` longtext CHARACTER SET utf8mb4 COLLATE utf8mb4_bin DEFAULT NULL CHECK (json_valid(`brand_personality`)),
  `design_style` longtext CHARACTER SET utf8mb4 COLLATE utf8mb4_bin DEFAULT NULL CHECK (json_valid(`design_style`)),
  `preferred_colors` longtext CHARACTER SET utf8mb4 COLLATE utf8mb4_bin DEFAULT NULL CHECK (json_valid(`preferred_colors`)),
  `colors_to_avoid` longtext CHARACTER SET utf8mb4 COLLATE utf8mb4_bin DEFAULT NULL CHECK (json_valid(`colors_to_avoid`)),
  `competitors` text DEFAULT NULL,
  `brand_kit_use` longtext CHARACTER SET utf8mb4 COLLATE utf8mb4_bin DEFAULT NULL CHECK (json_valid(`brand_kit_use`)),
  `brand_elements` longtext CHARACTER SET utf8mb4 COLLATE utf8mb4_bin DEFAULT NULL CHECK (json_valid(`brand_elements`)),
  `file_formats` longtext CHARACTER SET utf8mb4 COLLATE utf8mb4_bin DEFAULT NULL CHECK (json_valid(`file_formats`)),
  `platform_support` longtext CHARACTER SET utf8mb4 COLLATE utf8mb4_bin DEFAULT NULL CHECK (json_valid(`platform_support`)),
  `timeline` varchar(255) DEFAULT NULL,
  `primary_location` varchar(255) DEFAULT NULL,
  `preferred_contact` varchar(255) DEFAULT NULL,
  `approver` varchar(255) DEFAULT NULL,
  `special_notes` text DEFAULT NULL,
  `reference_materials` text DEFAULT NULL,
  `current_step` int(11) DEFAULT 1,
  `progress_percentage` int(11) DEFAULT 0,
  `is_completed` tinyint(1) DEFAULT 0,
  `completed_at` datetime DEFAULT NULL,
  `created_at` datetime DEFAULT current_timestamp(),
  `updated_at` datetime DEFAULT current_timestamp() ON UPDATE current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `product_service_forms`
--

INSERT INTO `product_service_forms` (`id`, `user_id`, `building_type`, `product_name`, `product_description`, `industry`, `want_to_attract`, `mission_story`, `desired_emotion`, `brand_tone`, `target_audience_profile`, `reach_locations`, `brand_personality`, `design_style`, `preferred_colors`, `colors_to_avoid`, `competitors`, `brand_kit_use`, `brand_elements`, `file_formats`, `platform_support`, `timeline`, `primary_location`, `preferred_contact`, `approver`, `special_notes`, `reference_materials`, `current_step`, `progress_percentage`, `is_completed`, `completed_at`, `created_at`, `updated_at`) VALUES
('7a3c9d13-2a22-469d-b496-b75037b135bf', 5, 'product', 'Water Bottle', '\"Discover our durable, eco-friendly water bottle, designed for the active and health-conscious individual, offering hydration on-the-go with a unique style that reflects your commitment to a sustainable lifestyle.\"', '[\"Technology\",\"Health & Wellness\"]', 'Everyone', 'In an era where health consciousness and environmental responsibility are at the forefront, we noticed a significant gap in the market. People were striving to stay hydrated, yet the tools at their disposal were either environmentally detrimental or lacked the durability for an active lifestyle. That\'s when we were inspired to create our eco-friendly water bottle. We wanted to provide a solution that not just quenches thirst but also aligns with the consumers\' commitment to a sustainable lifestyle. The idea was conceived out of a personal pain point - the frustration of not finding a water bottle that was robust, stylish, and environmentally friendly all at once. Our inspiration came from a simple, yet profound realization - that taking care of our health and our planet shouldn\'t be mutually exclusive, but rather, they should go hand in hand.', 'energized', 'bold', 'Students, Professionals', '[\"Social Media\",\"Google\",\"LinkedIn\"]', '[\"Eco\",\"Innovative\",\"Reliable\"]', '[\"Minimalist\",\"Eco\"]', '[]', '[]', NULL, '[\"Website\",\"Social Media\",\"Packaging\",\"Ads\",\"Email\"]', '[\"Logo\",\"Labels\",\"Mockups\",\"Product Sheet\",\"Presentation\"]', '[\"PDF\",\"PNG\",\"SVG\",\"AI\"]', '[\"GHL CRM\",\"Automation Setup\",\"Landing Page\",\"Email Setup\"]', '1–2-months', NULL, 'use-my-email-above', NULL, NULL, '[\"uploads\\\\forms\\\\form_1755841683261_rzvbptw6i_Acer_Wallpaper_01_3840x2400.jpg\"]', 5, 100, 0, NULL, '2025-08-22 13:07:04', '2025-08-22 13:48:03'),
('c5521569-c791-4465-b842-004104f6c759', 8, 'product', NULL, NULL, '[]', NULL, NULL, NULL, NULL, NULL, '[]', '[]', '[]', '[]', '[]', NULL, '[]', '[]', '[]', '[]', NULL, NULL, NULL, NULL, NULL, '[]', 5, 100, 0, NULL, '2025-08-25 15:15:16', '2025-08-25 15:18:21');

-- --------------------------------------------------------

--
-- Table structure for table `purchased_addons`
--

CREATE TABLE `purchased_addons` (
  `id` int(11) NOT NULL,
  `user_id` bigint(20) NOT NULL,
  `addon_id` int(11) NOT NULL,
  `purchase_date` datetime DEFAULT current_timestamp(),
  `base_price` decimal(10,2) NOT NULL,
  `status` varchar(50) DEFAULT 'active',
  `duration` int(11) DEFAULT NULL,
  `price_type` varchar(50) DEFAULT 'one-time',
  `created_at` datetime DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- Table structure for table `purchased_package_with_features`
--

CREATE TABLE `purchased_package_with_features` (
  `id` int(11) NOT NULL,
  `user_id` bigint(20) NOT NULL,
  `purchase_date` datetime DEFAULT current_timestamp(),
  `expiration_date` date NOT NULL,
  `status` varchar(50) DEFAULT 'active',
  `total_amount` decimal(10,2) NOT NULL,
  `features` longtext CHARACTER SET utf8mb4 COLLATE utf8mb4_bin NOT NULL CHECK (json_valid(`features`)),
  `package_name` varchar(255) NOT NULL DEFAULT '',
  `created_at` datetime DEFAULT current_timestamp(),
  `updated_at` datetime DEFAULT current_timestamp() ON UPDATE current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `purchased_package_with_features`
--

INSERT INTO `purchased_package_with_features` (`id`, `user_id`, `purchase_date`, `expiration_date`, `status`, `total_amount`, `features`, `package_name`, `created_at`, `updated_at`) VALUES
(1, 1, '2025-08-19 15:17:23', '2025-12-31', 'active', 6999.00, '[{\"feature_id\":1,\"feature_name\":\"Social Media Marketing Package\",\"status\":\"pending\",\"progress\":0,\"description\":\"Complete social media marketing management and strategy\"},{\"feature_id\":2,\"feature_name\":\"Layout Graphics for Posting and Ads\",\"status\":\"pending\",\"progress\":0,\"description\":\"Up to 8 layout graphics for posting and ads\"},{\"feature_id\":3,\"feature_name\":\"Reels Creation\",\"status\":\"pending\",\"progress\":0,\"description\":\"Up to 2 reels (30 sec max - edit only)\"},{\"feature_id\":4,\"feature_name\":\"Page Optimization and Audit\",\"status\":\"pending\",\"progress\":0,\"description\":\"Complete Facebook page optimization and performance audit\",\"name\":\"Page Optimization and Audit\"},{\"feature_id\":5,\"feature_name\":\"Facebook Ads Setup\",\"status\":\"pending\",\"progress\":0,\"description\":\"Complete Facebook advertising account setup and configuration\"},{\"feature_id\":6,\"feature_name\":\"Campaign Management\",\"status\":\"pending\",\"progress\":0,\"description\":\"Up to 2 campaigns\"},{\"feature_id\":7,\"feature_name\":\"Ad Sets Management\",\"status\":\"pending\",\"progress\":0,\"description\":\"Up to 3 ad sets\"},{\"feature_id\":8,\"feature_name\":\"Ad Creation\",\"status\":\"pending\",\"progress\":0,\"description\":\"Up to 6 ads\"},{\"feature_id\":9,\"feature_name\":\"Analytics Monitoring\",\"status\":\"pending\",\"progress\":0,\"description\":\"Regular analytics monitoring and reporting\"},{\"feature_id\":10,\"feature_name\":\"Ads Budget Management\",\"status\":\"pending\",\"progress\":0,\"description\":\"Management of ads budget (Up to ₱20,000.00)\"}]', 'META Marketing Package Basic', '2025-08-19 15:17:23', '2025-08-19 15:17:23'),
(5, 5, '2025-08-19 15:35:52', '2025-12-31', 'active', 6999.00, '[{\"feature_id\":1,\"feature_name\":\"Social Media Marketing Package\",\"status\":\"pending\",\"progress\":0,\"description\":\"Complete social media marketing management and strategy\"},{\"feature_id\":2,\"feature_name\":\"Layout Graphics for Posting and Ads\",\"status\":\"pending\",\"progress\":0,\"description\":\"Up to 8 layout graphics for posting and ads\"},{\"feature_id\":3,\"feature_name\":\"Reels Creation\",\"status\":\"pending\",\"progress\":0,\"description\":\"Up to 2 reels (30 sec max - edit only)\"},{\"feature_id\":4,\"feature_name\":\"Page Optimization and Audit\",\"status\":\"pending\",\"progress\":0,\"description\":\"Complete Facebook page optimization and performance audit\",\"name\":\"Page Optimization and Audit\"},{\"feature_id\":5,\"feature_name\":\"Facebook Ads Setup\",\"status\":\"pending\",\"progress\":0,\"description\":\"Complete Facebook advertising account setup and configuration\"},{\"feature_id\":6,\"feature_name\":\"Campaign Management\",\"status\":\"pending\",\"progress\":0,\"description\":\"Up to 2 campaigns\"},{\"feature_id\":7,\"feature_name\":\"Ad Sets Management\",\"status\":\"pending\",\"progress\":0,\"description\":\"Up to 3 ad sets\"},{\"feature_id\":8,\"feature_name\":\"Ad Creation\",\"status\":\"pending\",\"progress\":0,\"description\":\"Up to 6 ads\"},{\"feature_id\":9,\"feature_name\":\"Analytics Monitoring\",\"status\":\"pending\",\"progress\":0,\"description\":\"Regular analytics monitoring and reporting\"},{\"feature_id\":10,\"feature_name\":\"Ads Budget Management\",\"status\":\"pending\",\"progress\":0,\"description\":\"Management of ads budget (Up to ₱20,000.00)\"}]', 'META Marketing Package Basic', '2025-08-19 15:35:52', '2025-08-19 15:35:52'),
(6, 8, '2025-08-23 18:31:21', '2025-12-31', 'active', 6999.00, '[{\"feature_id\":1,\"feature_name\":\"Layout Graphics for Posting and Ads\",\"status\":\"pending\",\"progress\":0,\"description\":\"Up to 8 layout graphics for posting and ads\"}]', 'META Marketing Package Basic', '2025-08-23 18:31:21', '2025-08-23 18:31:21');

-- --------------------------------------------------------

--
-- Table structure for table `revision_requests`
--

CREATE TABLE `revision_requests` (
  `id` int(11) NOT NULL,
  `deliverable_id` int(11) NOT NULL,
  `user_id` bigint(20) NOT NULL,
  `request_reason` text NOT NULL,
  `status` enum('pending','in_progress','completed') DEFAULT 'pending',
  `admin_response` text DEFAULT NULL,
  `requested_at` datetime DEFAULT current_timestamp(),
  `updated_at` datetime DEFAULT current_timestamp() ON UPDATE current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `revision_requests`
--

INSERT INTO `revision_requests` (`id`, `deliverable_id`, `user_id`, `request_reason`, `status`, `admin_response`, `requested_at`, `updated_at`) VALUES
(2, 4, 5, 'I don\'t like the color', 'completed', 'Here\'s the logo with your color request', '2025-08-22 17:10:05', '2025-08-24 15:26:55'),
(3, 6, 8, 'I want to change the color\n', 'completed', 'here\'s your revision', '2025-08-24 14:42:10', '2025-08-26 11:43:14'),
(4, 10, 8, 'pangit\n', 'completed', 'Here\'s the new layout', '2025-08-26 11:43:55', '2025-08-26 13:50:31'),
(5, 13, 8, 'rty', 'pending', NULL, '2025-08-26 15:10:02', '2025-08-26 15:10:02');

-- --------------------------------------------------------

--
-- Table structure for table `client_requests`
--

CREATE TABLE `client_requests` (
  `id` int(11) NOT NULL,
  `user_id` bigint(20) NOT NULL,
  `subject` varchar(255) NOT NULL,
  `message` text NOT NULL,
  `category` enum('general','technical','billing','feature_request','bug_report','other') DEFAULT 'general',
  `priority` enum('low','medium','high','urgent') DEFAULT 'medium',
  `status` enum('pending','in_progress','resolved','closed') DEFAULT 'pending',
  `admin_response` text DEFAULT NULL,
  `resolved_at` datetime DEFAULT NULL,
  `created_at` datetime DEFAULT current_timestamp(),
  `updated_at` datetime DEFAULT current_timestamp() ON UPDATE current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- Table structure for table `users`
--

CREATE TABLE `users` (
  `id` bigint(20) NOT NULL,
  `email` varchar(255) NOT NULL,
  `password` varchar(255) NOT NULL,
  `email_verified_at` datetime DEFAULT NULL,
  `created_at` datetime DEFAULT current_timestamp(),
  `updated_at` datetime DEFAULT current_timestamp() ON UPDATE current_timestamp(),
  `fullname` varchar(255) DEFAULT NULL,
  `phone_number` varchar(50) DEFAULT NULL,
  `address` text DEFAULT NULL,
  `role` varchar(50) NOT NULL DEFAULT 'user'
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `users`
--

INSERT INTO `users` (`id`, `email`, `password`, `email_verified_at`, `created_at`, `updated_at`, `fullname`, `phone_number`, `address`, `role`) VALUES
(1, 'edjay.lindayao@students.isatu.edu.ph', '$2a$10$2gC8k162dVLFWoGcLe7adechR2v1bPH6XXmynwRTwXSRxctxZ2nXS', NULL, '2025-08-19 15:17:23', '2025-08-19 15:17:23', 'Edjay Lindayao', '+639123456789', NULL, 'user'),
(5, 'edjaycanterolindayao@gmail.com', '$2a$10$L4j62ipKKYY5vhrFNJ7BcOTHN4bdOQzxIzp8EQWux2IcMpKGi1yLa', NULL, '2025-08-19 15:35:52', '2025-08-19 16:42:58', 'Edjay Lindayao', '+639123456789', NULL, 'user'),
(7, 'admin@altamedia.com', '$2a$10$J/SHJUevNkq3sd3nmJFgzOs2LLxNOlVrei485cNAL5yQuH7eoGg2O', NULL, '2025-08-20 14:25:05', '2025-08-20 14:25:05', 'Admin', '', '', 'admin'),
(8, 'ejlindayao@gmail.com', '$2a$10$3IRIDUgE6KKAuTCEP2j5L.9AV.TFuwnFBAZD9qpdTRiFoEz3cZlW6', NULL, '2025-08-23 18:31:21', '2025-08-25 14:36:12', 'Yogie Cantero', '+639123456789', NULL, 'user'),
(9, 'sample@mail.com', '$2a$10$uJmHxX/mvT5T8wj/l2G2a.SUpVqSDXKFuPIwNi6b56yMMoNvz4R5y', NULL, '2025-08-26 11:01:50', '2025-08-26 11:01:50', 'Sample', '', '', 'user');

--
-- Indexes for dumped tables
--

--
-- Indexes for table `addons`
--
ALTER TABLE `addons`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `addon_features`
--
ALTER TABLE `addon_features`
  ADD PRIMARY KEY (`id`),
  ADD KEY `addon_id` (`addon_id`);

--
-- Indexes for table `brandkit_questionnaire_forms`
--
ALTER TABLE `brandkit_questionnaire_forms`
  ADD PRIMARY KEY (`id`),
  ADD KEY `idx_brandkit_questionnaire_user_id` (`user_id`),
  ADD KEY `idx_brandkit_questionnaire_created_at` (`created_at`),
  ADD KEY `idx_brandkit_questionnaire_completed` (`is_completed`);

--
-- Indexes for table `company_brand_kit_forms`
--
ALTER TABLE `company_brand_kit_forms`
  ADD PRIMARY KEY (`id`),
  ADD KEY `user_id` (`user_id`);

--
-- Indexes for table `deliverables`
--
ALTER TABLE `deliverables`
  ADD PRIMARY KEY (`id`),
  ADD KEY `purchase_id` (`purchase_id`),
  ADD KEY `uploaded_by` (`uploaded_by`);

--
-- Indexes for table `organization_forms`
--
ALTER TABLE `organization_forms`
  ADD PRIMARY KEY (`id`),
  ADD KEY `user_id` (`user_id`);

--
-- Indexes for table `packages`
--
ALTER TABLE `packages`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `name` (`name`);

--
-- Indexes for table `package_features`
--
ALTER TABLE `package_features`
  ADD PRIMARY KEY (`id`),
  ADD KEY `package_id` (`package_id`);

--
-- Indexes for table `package_feature_comments`
--
ALTER TABLE `package_feature_comments`
  ADD PRIMARY KEY (`id`),
  ADD KEY `user_id` (`user_id`),
  ADD KEY `package_feature_id` (`package_feature_id`);

--
-- Indexes for table `package_purchases`
--
ALTER TABLE `package_purchases`
  ADD PRIMARY KEY (`id`),
  ADD KEY `user_id` (`user_id`),
  ADD KEY `package_id` (`package_id`);

--
-- Indexes for table `product_service_forms`
--
ALTER TABLE `product_service_forms`
  ADD PRIMARY KEY (`id`),
  ADD KEY `user_id` (`user_id`);

--
-- Indexes for table `purchased_addons`
--
ALTER TABLE `purchased_addons`
  ADD PRIMARY KEY (`id`),
  ADD KEY `user_id` (`user_id`),
  ADD KEY `addon_id` (`addon_id`);

--
-- Indexes for table `purchased_package_with_features`
--
ALTER TABLE `purchased_package_with_features`
  ADD PRIMARY KEY (`id`),
  ADD KEY `purchased_package_with_features_ibfk_1` (`user_id`);

--
-- Indexes for table `revision_requests`
--
ALTER TABLE `revision_requests`
  ADD PRIMARY KEY (`id`),
  ADD KEY `deliverable_id` (`deliverable_id`),
  ADD KEY `user_id` (`user_id`);

--
-- Indexes for table `client_requests`
--
ALTER TABLE `client_requests`
  ADD PRIMARY KEY (`id`),
  ADD KEY `user_id` (`user_id`);

--
-- Indexes for table `users`
--
ALTER TABLE `users`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `email` (`email`);

--
-- AUTO_INCREMENT for dumped tables
--

--
-- AUTO_INCREMENT for table `addons`
--
ALTER TABLE `addons`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `addon_features`
--
ALTER TABLE `addon_features`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `deliverables`
--
ALTER TABLE `deliverables`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=14;

--
-- AUTO_INCREMENT for table `packages`
--
ALTER TABLE `packages`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `package_features`
--
ALTER TABLE `package_features`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `package_feature_comments`
--
ALTER TABLE `package_feature_comments`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `package_purchases`
--
ALTER TABLE `package_purchases`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `purchased_addons`
--
ALTER TABLE `purchased_addons`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `purchased_package_with_features`
--
ALTER TABLE `purchased_package_with_features`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=7;

--
-- AUTO_INCREMENT for table `revision_requests`
--
ALTER TABLE `revision_requests`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=6;

--
-- AUTO_INCREMENT for table `client_requests`
--
ALTER TABLE `client_requests`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `users`
--
ALTER TABLE `users`
  MODIFY `id` bigint(20) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=10;

--
-- Constraints for dumped tables
--

--
-- Constraints for table `addon_features`
--
ALTER TABLE `addon_features`
  ADD CONSTRAINT `addon_features_ibfk_1` FOREIGN KEY (`addon_id`) REFERENCES `addons` (`id`);

--
-- Constraints for table `brandkit_questionnaire_forms`
--
ALTER TABLE `brandkit_questionnaire_forms`
  ADD CONSTRAINT `brandkit_questionnaire_forms_ibfk_1` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`) ON DELETE CASCADE;

--
-- Constraints for table `company_brand_kit_forms`
--
ALTER TABLE `company_brand_kit_forms`
  ADD CONSTRAINT `company_brand_kit_forms_ibfk_1` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`);

--
-- Constraints for table `deliverables`
--
ALTER TABLE `deliverables`
  ADD CONSTRAINT `deliverables_ibfk_1` FOREIGN KEY (`purchase_id`) REFERENCES `purchased_package_with_features` (`id`) ON DELETE CASCADE,
  ADD CONSTRAINT `deliverables_ibfk_2` FOREIGN KEY (`uploaded_by`) REFERENCES `users` (`id`) ON DELETE CASCADE;

--
-- Constraints for table `organization_forms`
--
ALTER TABLE `organization_forms`
  ADD CONSTRAINT `organization_forms_ibfk_1` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`);

--
-- Constraints for table `package_features`
--
ALTER TABLE `package_features`
  ADD CONSTRAINT `package_features_ibfk_1` FOREIGN KEY (`package_id`) REFERENCES `packages` (`id`);

--
-- Constraints for table `package_feature_comments`
--
ALTER TABLE `package_feature_comments`
  ADD CONSTRAINT `package_feature_comments_ibfk_1` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`),
  ADD CONSTRAINT `package_feature_comments_ibfk_2` FOREIGN KEY (`package_feature_id`) REFERENCES `package_features` (`id`);

--
-- Constraints for table `package_purchases`
--
ALTER TABLE `package_purchases`
  ADD CONSTRAINT `package_purchases_ibfk_1` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`),
  ADD CONSTRAINT `package_purchases_ibfk_2` FOREIGN KEY (`package_id`) REFERENCES `packages` (`id`);

--
-- Constraints for table `product_service_forms`
--
ALTER TABLE `product_service_forms`
  ADD CONSTRAINT `product_service_forms_ibfk_1` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`);

--
-- Constraints for table `purchased_addons`
--
ALTER TABLE `purchased_addons`
  ADD CONSTRAINT `purchased_addons_ibfk_1` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`),
  ADD CONSTRAINT `purchased_addons_ibfk_2` FOREIGN KEY (`addon_id`) REFERENCES `addons` (`id`);

--
-- Constraints for table `purchased_package_with_features`
--
ALTER TABLE `purchased_package_with_features`
  ADD CONSTRAINT `purchased_package_with_features_ibfk_1` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`) ON DELETE CASCADE;

--
-- Constraints for table `revision_requests`
--
ALTER TABLE `revision_requests`
  ADD CONSTRAINT `revision_requests_ibfk_1` FOREIGN KEY (`deliverable_id`) REFERENCES `deliverables` (`id`) ON DELETE CASCADE,
  ADD CONSTRAINT `revision_requests_ibfk_2` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`) ON DELETE CASCADE;

--
-- Constraints for table `client_requests`
--
ALTER TABLE `client_requests`
  ADD CONSTRAINT `client_requests_ibfk_1` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`);
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
