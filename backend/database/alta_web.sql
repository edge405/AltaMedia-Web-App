-- phpMyAdmin SQL Dump
-- version 5.2.1
-- https://www.phpmyadmin.net/
--
-- Host: 127.0.0.1
-- Generation Time: Sep 03, 2025 at 10:29 AM
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
-- Database: `sieijjdi_alta_web`
--

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
('232f2786-c4d8-4d2e-8381-9d9b68b51f65', 8, 'Water Bottle', '\"Water Bottle: Your sustainable partner in hydration, designed for the eco-conscious, offering premium, reusable water bottles that combine style, durability and a commitment to a healthier planet.\"', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, 8, 89, 1, '2025-08-28 04:32:59', '2025-09-03 08:28:33'),
('48e4a226-10dd-4628-9659-6a3373c7a953', 12, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, 9, 100, 1, '2025-09-03 05:09:18', '2025-09-03 05:09:34'),
('8e88405d-f07e-4a7f-81c0-aa232433d396', 5, 'Water Bottle', '\"Water Bottle: Your stylish partner in hydration, empowering sustainable living with high-quality, innovative solutions that blend environmental consciousness with unparalleled elegance.\"', NULL, NULL, NULL, NULL, 'Water Bottle, as a lifestyle brand, addresses a significant problem that resonates with many of today\'s consumers - the need for sustainable, high-quality hydration solutions that don\'t compromise on style. In an era where single-use plastics are contributing significantly to environmental degradation, there\'s a growing demand for durable, eco-friendly alternatives.\n\nCustomers are increasingly aware and concerned about the environmental impact of their purchasing decisions. However, they often find it challenging to find products that align with their sustainability values without sacrificing quality or aesthetics. This is the pain point that Water Bottle effectively addresses.\n\nBy offering durable and stylish hydration solutions, Water Bottle allows customers to make environmentally-conscious choices that don\'t compromise on quality or personal style. The brand\'s products are not only practical and eco-friendly, but they also exude a simplicity and elegance that appeals to the modern consumer.\n\nSo, in essence, Water Bottle solves the problem of finding a hydration solution that is sustainable, high-quality, and stylish - a combination that today\'s discerning consumers are actively seeking but often struggle to find.', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, '[\"Sustainable\",\"Stylish\",\"Quality\"]', '[\"Cheap\",\"Disposable\",\"Harmful\"]', '\"Water Bottle: Sip Sustainability, Style, and Quality.\"', '\"Water Bottle exists to champion eco-conscious living through our innovative and stylish hydration solutions. We are committed to nurturing a sustainable world, one sip at a time, by empowering individuals to make environmentally responsible choices without compromising on quality, aesthetics, or their personal style. Our mission is to redefine hydration by intertwining sustainability, quality, and style, fostering a healthier planet and a more conscious community.\"', '\"Embracing a future where hydration and sustainability merge seamlessly, Water Bottle envisions a world where quality, style, and environmental consciousness are not mutually exclusive. We aspire to lead the revolution towards eco-friendly lifestyle choices, fostering a global community that values sustainable living without compromising on elegance or quality. In our envisioned future, every sip taken from a Water Bottle is a testament to a consumer\'s commitment to preserving our planet, promoting a lifestyle that is as stylish as it is sustainable.\"', '[\"Sustainability\",\"Quality\",\"Innovation\",\"Style\",\"Conscious Living\"]', NULL, NULL, NULL, 2, 22, 1, '2025-08-27 05:40:36', '2025-08-31 16:39:40'),
('d582ecde-de0c-4624-babd-aba05d8fdd30', 9, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, 9, 100, 1, '2025-08-26 03:34:21', '2025-08-26 03:34:37');

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

--
-- Dumping data for table `client_requests`
--

INSERT INTO `client_requests` (`id`, `user_id`, `subject`, `message`, `category`, `priority`, `status`, `admin_response`, `resolved_at`, `created_at`, `updated_at`) VALUES
(1, 5, 'sample', 'sample', 'billing', 'urgent', 'in_progress', '', NULL, '2025-08-27 10:54:34', '2025-08-28 10:47:49'),
(2, 5, 'sample', 'sample', 'technical', 'urgent', 'closed', 'resolved', '2025-08-27 17:14:59', '2025-08-27 10:58:47', '2025-08-27 17:14:59'),
(3, 5, 'Billing', 'Where can I pay?', 'billing', 'medium', 'resolved', 'at our altamedia store', '2025-08-28 10:57:50', '2025-08-28 10:55:04', '2025-08-28 10:57:50');

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
  `desired_social_media_platforms` longtext CHARACTER SET utf8mb4 COLLATE utf8mb4_bin DEFAULT NULL CHECK (json_valid(`desired_social_media_platforms`)),
  `has_website` varchar(10) DEFAULT NULL COMMENT 'Whether the brand has a website (yes/no)',
  `website_files` text DEFAULT NULL COMMENT 'Uploaded website files paths',
  `website_url` varchar(500) DEFAULT NULL COMMENT 'Website URL if applicable',
  `want_website` varchar(50) DEFAULT NULL COMMENT 'Future website needs (yes/sales-funnel/both/no/maybe)'
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `company_brand_kit_forms`
--

INSERT INTO `company_brand_kit_forms` (`id`, `user_id`, `building_type`, `business_email`, `has_proventous_id`, `proventous_id`, `business_name`, `contact_number`, `preferred_contact`, `industry`, `year_started`, `primary_location`, `behind_brand`, `current_customers`, `want_to_attract`, `team_description`, `desired_emotion`, `target_professions`, `reach_locations`, `age_groups`, `spending_habits`, `interaction_methods`, `customer_challenges`, `customer_motivation`, `audience_behavior`, `customer_choice`, `culture_words`, `team_traditions`, `team_highlights`, `reason1`, `reason2`, `reason3`, `brand_soul`, `brand_tone`, `brand1`, `brand2`, `brand3`, `brand_avoid`, `mission_statement`, `long_term_vision`, `core_values`, `brand_personality`, `has_logo`, `logo_action`, `preferred_colors`, `colors_to_avoid`, `font_styles`, `design_style`, `logo_type`, `imagery_style`, `inspiration_links`, `brand_kit_use`, `brand_elements`, `file_formats`, `primary_goal`, `short_term_goals`, `mid_term_goals`, `long_term_goal`, `big_picture_vision`, `success_metrics`, `business_description`, `inspiration`, `target_interests`, `current_interests`, `special_notes`, `timeline`, `approver`, `reference_materials`, `current_step`, `progress_percentage`, `is_completed`, `completed_at`, `created_at`, `updated_at`, `spending_type`, `secondary_audience`, `emotional_goal`, `culture_description`, `business_stage`, `purchase_motivators`, `has_social_media`, `social_media_platforms`, `facebook_url`, `instagram_url`, `twitter_url`, `linkedin_url`, `tiktok_url`, `youtube_url`, `pinterest_url`, `snapchat_username`, `other_social_media_urls`, `want_to_create_social_media`, `desired_social_media_platforms`, `has_website`, `website_files`, `website_url`, `want_website`) VALUES
('3ea93de3-32f4-49eb-ae22-b56284f88d37', 8, 'business', 'hubomoto21@gmail.com', 'no', NULL, 'Hubomoto Corporation', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, 11, 100, 0, NULL, '2025-08-26 16:17:35', '2025-08-28 12:32:57', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL),
('4a2f7e01-fd7b-4f9c-bf58-fd37ae7e5ea9', 12, 'business', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, 11, 100, 0, NULL, '2025-09-03 13:08:52', '2025-09-03 13:09:16', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL),
('8d8d8f83-2aa6-48e5-b1f3-f4b8049ffb04', 5, 'business', 'ejlindayao@gmail.com', 'no', NULL, 'Hubo Moto', '09123456789', 'phone', '[\"Technology\",\"Healthcare\"]', 2020, NULL, 'Carlo Hubo', '[\"Male\",\"Female\",\"Everyone\"]', 'Anyone', NULL, 'fulfilled', '[\"Entrepreneurs\",\"Managers\",\"Professionals\"]', '[\"Social Media\"]', '[\"Teens (13–19)\",\"Young Adults (20–29)\",\"Adults (30–39)\",\"Mature Adults (40–59)\",\"Seniors (60+)\"]', '[\"Value-focused\",\"Luxury\"]', '[\"Website\",\"Social Media\",\"Phone\",\"Email\",\"In-person\",\"Mobile App\"]', 'Lack of information', NULL, '[\"Technology\",\"Social media active\"]', NULL, '[\"Innovative\",\"Growth\",\"Professional\"]', '---', NULL, NULL, NULL, NULL, '\"Transformative Innovation\"', '[\"Professional\",\"Casual\",\"Friendly\",\"Authoritative\",\"Playful\",\"Sophisticated\"]', 'Brand Name: The name \"Hubo Moto\" beautifully captures the essence of the brand. It combines the concepts of creation and motion, symbolizing the continuous evolution and innovation that define the brand. This unique name sets the brand apart in the technology and healthcare industries.\n\nVisual Identity Approach: The visual identity of Hubo Moto reflects its innovative, passionate, and inclusive personality. The brand uses cutting-edge designs that embody futurism, mirroring the brand\'s dedication to harnessing the power of emerging technologies. The preferred colors, inspired by the vibrant hues of Iloilo City, are intended to evoke feelings of energy, passion, and optimism. These colors also resonate with the brand\'s vision of creating a brighter, healthier future for all.\n\nPersonality Traits: Hubo Moto is innovative, passionate, inclusive, and value-driven. It\'s a brand that sees beyond the conventional, perceives possibilities others cannot imagine, and dares to disrupt the status quo. It tirelessly seeks to improve, evolve, and push the boundaries in its quest to transform lives through technology.\n\nMessaging Strategy: Hubo Moto\'s messaging strategy is rooted in its core values of innovation, passion, inclusivity, value, and continuous evolution. The brand communicates its mission and vision in a professional yet friendly tone that resonates with its diverse clientele. Every message is designed to inspire, engage, and convey the brand\'s commitment to driving positive change in the healthcare industry.\n\nWhy This Concept is Effective: This brand concept is highly effective because it is aligned with both the business goals and the needs of the target audience. By focusing on innovation and continuous evolution, Hubo Moto positions itself as a leader in the intersection of technology and healthcare. Its commitment to inclusivity and value ensures its products and services are accessible and beneficial to everyone.\n\nThe brand\'s unique name and visual identity make it stand out in a competitive market, while its clear messaging strategy helps to build a strong connection with its customers. This concept does not just reflect who Hubo Moto is, but also where it aims to go - towards a future where technology creates a healthier, brighter world for all. \n\nMarket Positioning: Hubo Moto positions itself as a revolutionary force in the healthcare technology industry. It appeals to value-seeking customers who are not just looking for products or services but for solutions that can improve their quality of life. In a market dominated by impersonal tech giants, Hubo Moto differentiates itself with its passionate, inclusive approach and commitment to continuous evolution and innovation.\n\nIn conclusion, Hubo Moto is a brand with a vision. It sees beyond tomorrow, imagines possibilities that others cannot, and dares to disrupt the status quo. With its innovative solutions, passionate service, and inclusive approach, Hubo Moto is not just a business; it\'s a movement. A movement that strives for a healthier, brighter future for all.', NULL, NULL, NULL, 'Hubo Moto exists to harness the transformative power of technology and create a healthier, brighter future for all. Our mission is to innovate relentlessly, breaking barriers in the healthcare sector, and to fuel an inclusive evolution that brings value and fulfillment to everyone. We believe in the power of passion and the strength of continuous evolution, and it\'s these core principles that drive us to make a meaningful difference, every day.', 'Hubo Moto envisions a future where technology and healthcare are seamlessly integrated to create a world where everyone, regardless of their location, background, or circumstances, has access to quality, personalized healthcare solutions. We aspire to be the global leader in technological innovation within the healthcare industry, continuously evolving and pushing boundaries to improve lives and transform societies. We aim to not only respond to the changes in our environment but also to be the catalysts of those changes, driving the new era of health and wellness. Our long-term vision is to create a healthier, brighter future for all, where technology is the key to unlocking unprecedented potential in healthcare and beyond.', '[\"Innovation\",\"Passion\",\"Inclusivity\",\"Value\",\"Continuous Evolution\"]', '[\"Innovative\",\"Passionate\",\"Inclusive\",\"Value\"]', NULL, NULL, NULL, NULL, '[\"Roboto\",\"Comic Sans\"]', NULL, NULL, NULL, '[\"uploads\\\\forms\\\\form_1756673585489_m39pjao83_Nicole CV.pdf\",\"uploads\\\\forms\\\\form_1756673585494_4a2vyq6dr_0000002008_2597.pdf\"]', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, 'Hubo Moto revolutionizes healthcare through innovative technology, making life-saving solutions accessible and efficient to all.', 'At the heart of Hubo Moto is a story of passion and innovation. Carlo Hubo, the visionary behind this dynamic enterprise, embarked on this journey in 2021. Driven by his love for technology and determination to make a difference in the healthcare industry, Carlo envisioned a business that would disrupt the status quo and bring about a positive change.\n\nCarlo was inspired by the belief that technology has the potential to not just improve lives, but to transform them. He saw an untapped opportunity in the confluence of healthcare and technology, and thus, Hubo Moto was born. The name itself, \'Hubo Moto\', is a testament to the relentless drive that fuels this enterprise. \'Hubo\', meaning \'creation\' and \'Moto\', representing \'motion\', collectively symbolize the continuous evolution and innovation at the core of this brand.\n\nBased in the bustling heart of Iloilo City, Philippines, Hubo Moto serves a diverse clientele. The company\'s products and services are designed for anyone and everyone, reflecting its inclusive philosophy. Despite its growth, Hubo Moto remains committed to providing value and ensuring its customers feel fulfilled.\n\nHubo Moto\'s inspiration is not just about harnessing the power of technology. It\'s about using that power to create a healthier, brighter future for all. As the brand continues to grow and evolve, the initial spark of inspiration that led to its creation remains at its core, guiding its journey towards achieving its long-term goals.', '[\"Technology Enthusiasts\",\"Healthcare Professionals\",\"Moto Lovers\",\"Early Adopters\",\"Value Seekers\",\"Modern Lifestyle\",\"Digital Savvy\",\"Wellness Advocate\",\"Tech Innovators\",\"Health Conscious\",\"Active Lifestyle\",\"Personal Growth\",\"Trend Followers\",\"Gadget Lovers\",\"Self\"]', '[\"Technology Enthusiasts\",\"Healthcare Innovations\",\"Early Adopters\",\"Value Seekers\",\"Tech\"]', '', '1–2 months', 'Carlo Hubo', '[\"uploads\\\\forms\\\\form_1756708078298_4ajjcwwmb_Acer_Wallpaper_01_3840x2400.jpg\"]', 5, 45, 0, NULL, '2025-08-22 14:23:51', '2025-09-02 15:06:14', 'value-seeking', 'None', 'inspired', 'Productive', 'growing', 'At Hubo Moto, what truly motivates our customers to choose us over our competitors is our unique blend of technology and healthcare solutions. We understand that in this day and age, these two sectors are intertwined more than ever and play a critical role in our daily lives. \n\nBegun in 2021, we are a young, ambitious, and growing company, constantly seeking to innovate and provide value-driven solutions. We believe in creating a sense of fulfillment for our customers, regardless of their demographic. \n\nLocated in the heart of Iloilo City, Philippines, we are at the epicenter of the city\'s tech and health scene. We offer state-of-the-art solutions without compromising on the personal touch. Despite being relatively new, our commitment to customer satisfaction and continuous improvement has helped us make a mark in our industry.\n\nOur primary goal is not just to provide products or services, but to create an experience that leaves our customers feeling satisfied and cared for. Whether it\'s through our product offerings or customer service, we strive to make a positive impact on every individual who comes into contact with our brand.\n\nBy choosing Hubo Moto, our customers are not just investing in a product or service, they are becoming a part of a community that values innovation, health, and most importantly, people. We look forward to growing and evolving with our customers, always striving to meet and exceed their expectations.', 'no', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, 'no', '[\"Facebook\"]', 'yes', '[\"uploads\\\\forms\\\\form_1756699060350_1uuyoohaa_Acer_Wallpaper_01_3840x2400.jpg\",\"uploads\\\\forms\\\\form_1756699060373_4arch22bp_Edgee - MoU.pdf\"]', 'http://edjay.life/', NULL),
('e23964b1-218e-45b7-9800-f3cced8c3a90', 9, 'business', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, 11, 100, 0, NULL, '2025-08-26 11:33:57', '2025-08-26 11:34:18', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL);

-- --------------------------------------------------------

--
-- Table structure for table `deliverables`
--

CREATE TABLE `deliverables` (
  `id` int(11) NOT NULL,
  `purchase_id` int(11) NOT NULL,
  `feature_name` varchar(255) NOT NULL,
  `file_path` varchar(500) DEFAULT NULL,
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
(2, 5, 'Layout Graphics for Posting Ads', 'uploads\\deliverables\\deliverable_1755685928078_ixa8qhdhd_Acer_Wallpaper_01_3840x2400.jpg', 7, 'revision_requested', 'Updated version with improvements', '2025-08-20 14:44:30', '2025-08-20 18:32:08', 1, NULL),
(4, 5, 'Layout Graphics for Posting and Ads', 'uploads\\deliverables\\deliverable_1755849943733_vcytqcrds_Acer_Wallpaper_02_3840x2400.jpg', 7, 'revision_requested', 'Here\'s your the layout graphics', '2025-08-22 16:05:43', '2025-08-22 17:10:05', 1, NULL),
(6, 6, 'Layout Graphics for Posting and Ads', 'uploads\\deliverables\\deliverable_1756016959039_h8hpp13tp_Planet9_Wallpaper_5000x2813.jpg', 7, 'revision_requested', 'Graphics for posting ads', '2025-08-24 14:29:19', '2025-08-24 14:42:10', 1, NULL),
(7, 5, 'Layout Graphics for Posting Ads', 'uploads\\deliverables\\deliverable_1756020201617_w5gur5pku_Planet9_Wallpaper_5000x2813.jpg', 7, 'approved', 'Got it', '2025-08-24 15:23:21', '2025-08-26 14:49:31', 2, NULL),
(8, 5, 'Layout Graphics for Posting and Ads', 'uploads\\deliverables\\deliverable_1756020415282_6p7ngd0ey_Acer_Wallpaper_03_5000x2814.jpg', 7, 'pending', 'Here\'s the logo with your color request', '2025-08-24 15:26:55', '2025-08-24 15:26:55', 2, NULL),
(9, 5, 'Layout Graphics for Posting and Ads', 'uploads\\deliverables\\deliverable_1756176606082_bwil8d4d4_Acer_Wallpaper_01_3840x2400.jpg', 7, 'pending', NULL, '2025-08-26 10:50:06', '2025-08-26 10:50:06', 3, NULL),
(10, 6, 'Layout Graphics for Posting and Ads', 'uploads\\deliverables\\deliverable_1756179794432_7mgcbtcl1_Acer_Wallpaper_05_3840x2400.jpg', 7, 'revision_requested', 'here\'s your revision', '2025-08-26 11:43:14', '2025-08-26 11:43:55', 2, NULL),
(11, 5, 'Layout Graphics for Posting and Ads', 'uploads\\deliverables\\deliverable_1756186489482_wthin32vx_Acer_Wallpaper_01_3840x2400.jpg', 7, 'approved', NULL, '2025-08-26 13:34:49', '2025-08-26 14:49:43', 4, NULL),
(13, 6, 'Layout Graphics for Posting and Ads', 'uploads\\deliverables\\deliverable_1756192137647_xz9we3dc1_Acer_Wallpaper_01_5000x2814.jpg', 7, 'revision_requested', 'sample', '2025-08-26 15:08:57', '2025-08-26 15:10:02', 4, NULL),
(14, 6, 'Layout Graphics for Posting and Ads', 'uploads\\deliverables\\deliverable_1756193977762_ef8ocl393_Acer_Wallpaper_01_3840x2400.jpg', 7, 'pending', 'sample', '2025-08-26 15:39:37', '2025-08-26 15:39:37', 5, NULL),
(15, 5, 'Reels Creation', NULL, 7, 'revision_requested', 'sample', '2025-08-26 15:45:12', '2025-08-26 15:56:40', 1, 'https://www.facebook.com/'),
(18, 6, 'Layout Graphics for Posting and Ads', 'uploads\\deliverables\\deliverable_1756348869323_k20h5a06j_Acer_Wallpaper_01_5000x2814.jpg', 7, 'pending', 'Sample', '2025-08-28 10:41:09', '2025-08-28 10:41:09', 6, NULL),
(19, 8, 'Layout Graphics for Posting and Ads', '', 7, 'pending', 'sample', '2025-08-28 10:42:54', '2025-08-28 10:42:54', 1, 'https://mail.google.com/mail/u/0/#inbox'),
(20, 6, 'Layout Graphics for Posting and Ads', 'uploads\\deliverables\\deliverable_1756355523127_m6dn4dkqa_Acer_Wallpaper_04_3840x2400.jpg', 7, 'approved', 'Here\'s new design', '2025-08-28 12:32:03', '2025-08-28 12:33:38', 7, NULL),
(25, 5, 'Reels Creation', '', 7, 'approved', 'check out this new link', '2025-08-28 13:28:01', '2025-08-28 13:28:25', 2, 'http://localhost/phpmyadmin/index.php?route=/sql&pos=0&db=alta_web&table=deliverables'),
(26, 5, 'Social Media Marketing Package', 'uploads\\deliverables\\deliverable_1756359713208_dyxr97dbe_Acer_Wallpaper_05_3840x2400.jpg', 7, 'pending', 'sample', '2025-08-28 13:41:53', '2025-08-28 13:45:48', 1, NULL),
(27, 5, 'Social Media Marketing Package', 'uploads\\deliverables\\deliverable_1756359786359_0l5qdhrs6_Planet9_Wallpaper_5000x2813.jpg', 7, 'approved', 'here\'s the new design', '2025-08-28 13:43:06', '2025-08-28 13:44:58', 2, NULL),
(28, 5, 'Ad Sets Management', 'uploads\\deliverables\\deliverable_1756360548278_0chkj6v28_Planet9_Wallpaper_5000x2813.jpg', 7, 'revision_requested', 'Here\'s new design', '2025-08-28 13:55:48', '2025-08-28 13:56:33', 1, NULL),
(29, 5, 'Ad Sets Management', 'uploads\\deliverables\\deliverable_1756361364528_65inxqoqu_Acer_Wallpaper_02_3840x2400.jpg', 7, 'revision_requested', 'New Design', '2025-08-28 14:09:24', '2025-08-28 14:12:32', 2, NULL),
(30, 5, 'Ad Sets Management', 'uploads\\deliverables\\deliverable_1756361581993_zqdc4zjfk_Acer_Wallpaper_03_5000x2814.jpg', 7, 'approved', 'How about this ', '2025-08-28 14:13:02', '2025-08-28 14:13:21', 3, NULL),
(31, 6, 'Layout Graphics for Posting and Ads', 'uploads\\deliverables\\deliverable_1756449297517_97l0m8s7y_Acer_Wallpaper_01_3840x2400.jpg', 7, 'pending', 'sample', '2025-08-29 14:34:57', '2025-08-29 14:34:57', 8, NULL),
(32, 6, 'Layout Graphics for Posting and Ads', 'uploads\\deliverables\\deliverable_1756460675187_06oji46g5_Acer_Wallpaper_05_3840x2400.jpg', 7, 'pending', NULL, '2025-08-29 17:44:35', '2025-08-29 17:44:35', 9, NULL);

-- --------------------------------------------------------

--
-- Table structure for table `email_verifications`
--

CREATE TABLE `email_verifications` (
  `id` bigint(20) NOT NULL,
  `email` varchar(255) NOT NULL,
  `verification_code` varchar(6) NOT NULL,
  `verification_token` varchar(64) NOT NULL,
  `is_verified` tinyint(1) DEFAULT 0,
  `expires_at` timestamp NOT NULL DEFAULT current_timestamp() ON UPDATE current_timestamp(),
  `verified_at` timestamp NULL DEFAULT NULL,
  `created_at` timestamp NOT NULL DEFAULT current_timestamp(),
  `updated_at` timestamp NOT NULL DEFAULT current_timestamp() ON UPDATE current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `email_verifications`
--

INSERT INTO `email_verifications` (`id`, `email`, `verification_code`, `verification_token`, `is_verified`, `expires_at`, `verified_at`, `created_at`, `updated_at`) VALUES
(2, 'ejlindayao@gmail.com', '309682', '0be017c453bfd18d2823568582c09e63c7d46911566d4c11829b8675855173ea', 1, '2025-09-02 06:22:33', '2025-09-02 06:22:33', '2025-09-02 06:21:17', '2025-09-02 06:22:33'),
(4, 'test@example.com', '719445', '733c39f18220617bca8ca8998bb883f085815d1152cac9511af2a3b91ba9f6f5', 0, '2025-09-01 22:19:55', NULL, '2025-09-02 06:09:55', '2025-09-02 06:09:55'),
(9, 'edjay.lindayao@students.isatu.edu.ph', '419852', '0bc2f3676f7d0ce391f4d6b4f22ad78fc7ccaa206d30aeb58b915209d9d19ba6', 1, '2025-09-02 06:25:37', '2025-09-02 06:25:37', '2025-09-02 06:25:12', '2025-09-02 06:25:37'),
(10, 'edjaycanterolindayao@gmail.com', '536895', '6deb069a016bdd359d603bc96431ed84cdc3ffc1977b60ae1d4a3463c6049389', 1, '2025-09-02 13:09:02', '2025-09-02 13:09:02', '2025-09-02 13:08:28', '2025-09-02 13:09:02');

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
('3a6e7ed4-e30f-49dd-ad20-b7a0c0308938', 12, 'organization', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, '[]', 4, 100, 0, NULL, '2025-09-03 13:09:37', '2025-09-03 13:09:42'),
('998b6c23-41d2-4717-b458-2024b1245f73', 8, 'organization', NULL, NULL, NULL, NULL, NULL, NULL, '[\"Social Media Calendar\",\"Ad Creatives\",\"Caption Writing + Hashtags\",\"Video Editing\",\"Graphics Design\",\"Platform Setup/Optimization\",\"Performance Reports\"]', NULL, NULL, NULL, '[]', 4, 100, 0, NULL, '2025-08-28 12:33:17', '2025-08-30 14:41:46'),
('a55e48d3-e299-4ca7-81e6-114a922a79ad', 9, 'organization', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, '[]', 4, 100, 0, NULL, '2025-08-26 11:34:38', '2025-08-26 11:34:42'),
('a72ea1f8-4225-4c3f-9316-4c1f0ab2340a', 5, 'organization', 'Hubo', NULL, NULL, NULL, '[\"Facebook\",\"Instagram\",\"TikTok\",\"YouTube\",\"LinkedIn\"]', '[\"Short Videos/Reels\",\"Static Graphics\",\"Carousel Posts\",\"Motion Graphics\",\"Long-Form Videos\"]', '[\"Social Media Calendar\",\"Ad Creatives\",\"Caption Writing + Hashtags\",\"Video Editing\",\"Graphics Design\",\"Platform Setup/Optimization\",\"Performance Reports\"]', NULL, 'sample', 'sample', '[]', 4, 100, 0, NULL, '2025-08-22 14:18:54', '2025-08-27 13:43:40');

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
(5, 5, '2025-08-19 15:35:52', '2025-12-31', 'expired', 6999.00, '[{\"feature_id\":1,\"feature_name\":\"Social Media Marketing Package\",\"status\":\"pending\",\"progress\":0,\"description\":\"Complete social media marketing management and strategy\"},{\"feature_id\":2,\"feature_name\":\"Layout Graphics for Posting and Ads\",\"status\":\"pending\",\"progress\":0,\"description\":\"Up to 8 layout graphics for posting and ads\"},{\"feature_id\":3,\"feature_name\":\"Reels Creation\",\"status\":\"pending\",\"progress\":0,\"description\":\"Up to 2 reels (30 sec max - edit only)\"},{\"feature_id\":4,\"feature_name\":\"Page Optimization and Audit\",\"status\":\"pending\",\"progress\":0,\"description\":\"Complete Facebook page optimization and performance audit\",\"name\":\"Page Optimization and Audit\"},{\"feature_id\":5,\"feature_name\":\"Facebook Ads Setup\",\"status\":\"pending\",\"progress\":0,\"description\":\"Complete Facebook advertising account setup and configuration\"},{\"feature_id\":6,\"feature_name\":\"Campaign Management\",\"status\":\"pending\",\"progress\":0,\"description\":\"Up to 2 campaigns\"},{\"feature_id\":7,\"feature_name\":\"Ad Sets Management\",\"status\":\"pending\",\"progress\":0,\"description\":\"Up to 3 ad sets\"},{\"feature_id\":8,\"feature_name\":\"Ad Creation\",\"status\":\"pending\",\"progress\":0,\"description\":\"Up to 6 ads\"},{\"feature_id\":9,\"feature_name\":\"Analytics Monitoring\",\"status\":\"pending\",\"progress\":0,\"description\":\"Regular analytics monitoring and reporting\"},{\"feature_id\":10,\"feature_name\":\"Ads Budget Management\",\"status\":\"pending\",\"progress\":0,\"description\":\"Management of ads budget (Up to ₱20,000.00)\"}]', 'META Marketing Package Basic', '2025-08-19 15:35:52', '2025-09-01 15:51:26'),
(6, 8, '2025-08-23 18:31:21', '2025-12-31', 'active', 6999.00, '[{\"feature_id\":1,\"feature_name\":\"Layout Graphics for Posting and Ads\",\"status\":\"pending\",\"progress\":0,\"description\":\"Up to 8 layout graphics for posting and ads\"}]', 'META Marketing Package Basic', '2025-08-23 18:31:21', '2025-08-23 18:31:21'),
(8, 5, '2025-08-26 17:28:50', '2025-12-31', 'active', 8999.00, '[{\"feature_id\":1,\"feature_name\":\"Layout Graphics for Posting and Ads\",\"status\":\"pending\",\"progress\":0,\"description\":\"Up to 8 layout graphics for posting and ads\"}]', 'META Marketing Package Premium', '2025-08-26 17:28:50', '2025-09-01 15:55:14'),
(10, 11, '2025-08-28 15:35:55', '2025-12-31', 'active', 9999.00, '[{\"feature_id\":1,\"feature_name\":\"Layout Graphics for Posting and Ads\",\"status\":\"pending\",\"progress\":0,\"description\":\"Up to 8 layout graphics for posting and ads\"}]', 'META Marketing Package Basic', '2025-08-28 15:35:55', '2025-08-28 15:35:55'),
(11, 11, '2025-09-02 17:31:33', '2026-09-02', 'active', 0.00, '[{\"feature_id\":1,\"feature_name\":\"Basic Package Feature\",\"status\":\"pending\",\"progress\":0,\"description\":\"Default feature for the package\"}]', 'META Marketing Package Basic', '2025-09-02 17:31:33', '2025-09-02 17:31:33'),
(12, 11, '2025-09-02 17:36:21', '2026-09-02', 'active', 0.00, '[{\"feature_id\":1,\"feature_name\":\"Basic Package Feature\",\"status\":\"pending\",\"progress\":0,\"description\":\"Default feature for the package\"}]', 'META Marketing Package Basic', '2025-09-02 17:36:21', '2025-09-02 17:36:21'),
(13, 11, '2025-09-02 18:13:32', '2026-09-02', 'active', 0.00, '[{\"feature_id\":1,\"feature_name\":\"Basic Package Feature\",\"status\":\"pending\",\"progress\":0,\"description\":\"Default feature for the package\"}]', 'META Marketing Package Basic', '2025-09-02 18:13:32', '2025-09-02 18:13:32'),
(14, 11, '2025-09-02 18:18:48', '2026-09-02', 'active', 0.00, '[{\"feature_id\":1,\"feature_name\":\"Basic Package Feature\",\"status\":\"pending\",\"progress\":0,\"description\":\"Default feature for the package\"}]', 'META Marketing Package Basic', '2025-09-02 18:18:48', '2025-09-02 18:18:48'),
(15, 11, '2025-09-02 18:23:20', '2026-09-02', 'active', 0.00, '[{\"feature_id\":1,\"feature_name\":\"Basic Package Feature\",\"status\":\"pending\",\"progress\":0,\"description\":\"Default feature for the package\"}]', 'META Marketing Package Basic', '2025-09-02 18:23:20', '2025-09-02 18:23:20');

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
(5, 13, 8, 'rty', 'completed', 'Here\'s new design', '2025-08-26 15:10:02', '2025-08-28 12:47:53'),
(6, 15, 5, 'link is not accessible', 'completed', 'check out this new link', '2025-08-26 15:56:40', '2025-08-28 13:28:01'),
(8, 26, 5, 'revise, I don\'t like the color\n', 'completed', 'here\'s the new design', '2025-08-28 13:42:36', '2025-08-28 13:43:06'),
(9, 28, 5, 'I don\'t like the design, it\'s not applicable to our color', 'completed', 'New Design', '2025-08-28 13:56:33', '2025-08-28 14:09:24'),
(10, 29, 5, 'I don\'t like again', 'completed', 'How about this ', '2025-08-28 14:12:32', '2025-08-28 14:13:02');

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
(5, 'edjaycanterolindayao@gmail.com', '$2a$10$L4j62ipKKYY5vhrFNJ7BcOTHN4bdOQzxIzp8EQWux2IcMpKGi1yLa', NULL, '2025-08-19 15:35:52', '2025-08-19 16:42:58', 'Edjay Lindayao', '+639123456789', NULL, 'user'),
(7, 'admin@altamedia.com', '$2a$10$J/SHJUevNkq3sd3nmJFgzOs2LLxNOlVrei485cNAL5yQuH7eoGg2O', NULL, '2025-08-20 14:25:05', '2025-08-20 14:25:05', 'Admin', '', '', 'admin'),
(8, 'ejlindayao@gmail.com', '$2a$10$3IRIDUgE6KKAuTCEP2j5L.9AV.TFuwnFBAZD9qpdTRiFoEz3cZlW6', NULL, '2025-08-23 18:31:21', '2025-08-25 14:36:12', 'Yogie Cantero', '+639123456789', NULL, 'user'),
(9, 'sample@mail.com', '$2a$10$uJmHxX/mvT5T8wj/l2G2a.SUpVqSDXKFuPIwNi6b56yMMoNvz4R5y', NULL, '2025-08-26 11:01:50', '2025-08-26 11:01:50', 'Sample', '', '', 'user'),
(11, 'edjay.lindayao@students.isatu.edu.ph', '$2a$10$z48b2/WN3PsYmCa.v3k/XOGHEsD7R3i8F.EJQ27gILLEDUCxOkW1y', NULL, '2025-08-28 15:35:55', '2025-08-28 15:35:55', 'Edj Lindayao', '+639123456789', NULL, 'user'),
(12, 'sample@gmail.com', '$2a$10$bh/DiEsLkEXn8lT3/U7W/.qhjJfnbuwNSTYVoKR2KbczwP8qiPzAm', NULL, '2025-09-03 13:08:34', '2025-09-03 13:08:34', 'Sample', '091234567890', '', 'user');

--
-- Indexes for dumped tables
--

--
-- Indexes for table `brandkit_questionnaire_forms`
--
ALTER TABLE `brandkit_questionnaire_forms`
  ADD PRIMARY KEY (`id`),
  ADD KEY `idx_brandkit_questionnaire_user_id` (`user_id`),
  ADD KEY `idx_brandkit_questionnaire_created_at` (`created_at`),
  ADD KEY `idx_brandkit_questionnaire_completed` (`is_completed`);

--
-- Indexes for table `client_requests`
--
ALTER TABLE `client_requests`
  ADD PRIMARY KEY (`id`),
  ADD KEY `user_id` (`user_id`);

--
-- Indexes for table `company_brand_kit_forms`
--
ALTER TABLE `company_brand_kit_forms`
  ADD PRIMARY KEY (`id`),
  ADD KEY `user_id` (`user_id`),
  ADD KEY `idx_has_website` (`has_website`),
  ADD KEY `idx_want_website` (`want_website`);

--
-- Indexes for table `deliverables`
--
ALTER TABLE `deliverables`
  ADD PRIMARY KEY (`id`),
  ADD KEY `purchase_id` (`purchase_id`),
  ADD KEY `uploaded_by` (`uploaded_by`);

--
-- Indexes for table `email_verifications`
--
ALTER TABLE `email_verifications`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `email` (`email`),
  ADD KEY `verification_token` (`verification_token`),
  ADD KEY `expires_at` (`expires_at`);

--
-- Indexes for table `organization_forms`
--
ALTER TABLE `organization_forms`
  ADD PRIMARY KEY (`id`),
  ADD KEY `user_id` (`user_id`);

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
-- Indexes for table `users`
--
ALTER TABLE `users`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `email` (`email`);

--
-- AUTO_INCREMENT for dumped tables
--

--
-- AUTO_INCREMENT for table `client_requests`
--
ALTER TABLE `client_requests`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=4;

--
-- AUTO_INCREMENT for table `deliverables`
--
ALTER TABLE `deliverables`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=33;

--
-- AUTO_INCREMENT for table `email_verifications`
--
ALTER TABLE `email_verifications`
  MODIFY `id` bigint(20) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=11;

--
-- AUTO_INCREMENT for table `purchased_package_with_features`
--
ALTER TABLE `purchased_package_with_features`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=16;

--
-- AUTO_INCREMENT for table `revision_requests`
--
ALTER TABLE `revision_requests`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=11;

--
-- AUTO_INCREMENT for table `users`
--
ALTER TABLE `users`
  MODIFY `id` bigint(20) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=13;

--
-- Constraints for dumped tables
--

--
-- Constraints for table `brandkit_questionnaire_forms`
--
ALTER TABLE `brandkit_questionnaire_forms`
  ADD CONSTRAINT `brandkit_questionnaire_forms_ibfk_1` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`) ON DELETE CASCADE;

--
-- Constraints for table `client_requests`
--
ALTER TABLE `client_requests`
  ADD CONSTRAINT `client_requests_ibfk_1` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`);

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
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
