-- Database Updates for Alta Web App
-- Complete schema updates for all new features
-- Run these ALTER TABLE statements to update your database schema

USE sieijjdi_alta_web;

-- 1. Add collaboration fields to brandkit_questionnaire_forms table
-- These fields were added for the Collaboration & Wrap-Up section in BrandKitQuestionnaire
ALTER TABLE `brandkit_questionnaire_forms` 
ADD COLUMN `main_contact` varchar(255) DEFAULT NULL AFTER `want_web_page`,
ADD COLUMN `additional_info` text DEFAULT NULL AFTER `main_contact`,
ADD COLUMN `collaboration_references` text DEFAULT NULL AFTER `additional_info`;

-- 2. Add main_contact field to company_brand_kit_forms table  
-- This field was added for the main point of contact in KnowingYouForm Step 10
ALTER TABLE `company_brand_kit_forms` 
ADD COLUMN `main_contact` varchar(255) DEFAULT NULL AFTER `approver`;

-- 3. Add social media fields to brandkit_questionnaire_forms table
-- These fields were added for the Social Media Presence section in BrandKitQuestionnaire Step 8
ALTER TABLE `brandkit_questionnaire_forms` 
ADD COLUMN `has_social_media` varchar(10) DEFAULT NULL AFTER `brand_vibe`,
ADD COLUMN `social_media_platforms` longtext DEFAULT NULL AFTER `has_social_media`,
ADD COLUMN `facebook_url` varchar(500) DEFAULT NULL AFTER `social_media_platforms`,
ADD COLUMN `instagram_url` varchar(500) DEFAULT NULL AFTER `facebook_url`,
ADD COLUMN `twitter_url` varchar(500) DEFAULT NULL AFTER `instagram_url`,
ADD COLUMN `linkedin_url` varchar(500) DEFAULT NULL AFTER `twitter_url`,
ADD COLUMN `tiktok_url` varchar(500) DEFAULT NULL AFTER `linkedin_url`,
ADD COLUMN `youtube_url` varchar(500) DEFAULT NULL AFTER `tiktok_url`,
ADD COLUMN `pinterest_url` varchar(500) DEFAULT NULL AFTER `youtube_url`,
ADD COLUMN `snapchat_username` varchar(255) DEFAULT NULL AFTER `pinterest_url`,
ADD COLUMN `other_social_media_urls` text DEFAULT NULL AFTER `snapchat_username`,
ADD COLUMN `want_to_create_social_media` varchar(255) DEFAULT NULL AFTER `other_social_media_urls`,
ADD COLUMN `desired_social_media_platforms` longtext DEFAULT NULL AFTER `want_to_create_social_media`;

-- Verify the changes
SELECT 'brandkit_questionnaire_forms table structure:' as info;
DESCRIBE `brandkit_questionnaire_forms`;

SELECT 'company_brand_kit_forms table structure:' as info;
DESCRIBE `company_brand_kit_forms`;

-- Show the new columns that were added
SELECT 
    TABLE_NAME,
    COLUMN_NAME,
    DATA_TYPE,
    IS_NULLABLE,
    COLUMN_DEFAULT
FROM INFORMATION_SCHEMA.COLUMNS 
WHERE TABLE_SCHEMA = 'sieijjdi_alta_web' 
AND TABLE_NAME IN ('brandkit_questionnaire_forms', 'company_brand_kit_forms')
AND COLUMN_NAME IN (
    'main_contact', 'additional_info', 'collaboration_references',
    'has_social_media', 'social_media_platforms', 'facebook_url', 'instagram_url', 'twitter_url', 'linkedin_url',
    'tiktok_url', 'youtube_url', 'pinterest_url', 'snapchat_username', 'other_social_media_urls',
    'want_to_create_social_media', 'desired_social_media_platforms'
)
ORDER BY TABLE_NAME, COLUMN_NAME;
