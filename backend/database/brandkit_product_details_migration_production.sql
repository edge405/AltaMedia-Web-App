-- BrandKit Questionnaire Product Details Migration (Production Safe)
-- This migration safely adds new fields for product details to the brandkit_questionnaire_forms table
-- It checks for existing columns before adding them to avoid errors

-- Function to safely add column if it doesn't exist
DELIMITER $$
CREATE PROCEDURE AddColumnIfNotExists(
    IN tableName VARCHAR(64),
    IN columnName VARCHAR(64),
    IN columnDefinition TEXT
)
BEGIN
    DECLARE columnExists INT DEFAULT 0;
    
    SELECT COUNT(*) INTO columnExists
    FROM INFORMATION_SCHEMA.COLUMNS 
    WHERE TABLE_SCHEMA = DATABASE() 
    AND TABLE_NAME = tableName 
    AND COLUMN_NAME = columnName;
    
    IF columnExists = 0 THEN
        SET @sql = CONCAT('ALTER TABLE `', tableName, '` ADD COLUMN `', columnName, '` ', columnDefinition);
        PREPARE stmt FROM @sql;
        EXECUTE stmt;
        DEALLOCATE PREPARE stmt;
        SELECT CONCAT('Added column: ', columnName) as result;
    ELSE
        SELECT CONCAT('Column already exists: ', columnName) as result;
    END IF;
END$$
DELIMITER ;

-- Safely add new product detail fields
CALL AddColumnIfNotExists('brandkit_questionnaire_forms', 'offering_type', 'VARCHAR(50) DEFAULT NULL COMMENT ''Primary offering type (product, service, both, etc.)''');
CALL AddColumnIfNotExists('brandkit_questionnaire_forms', 'product_industry', 'VARCHAR(100) DEFAULT NULL COMMENT ''Industry or category of the product/service''');
CALL AddColumnIfNotExists('brandkit_questionnaire_forms', 'product_industry_other', 'VARCHAR(255) DEFAULT NULL COMMENT ''Custom industry specification when "other" is selected''');
CALL AddColumnIfNotExists('brandkit_questionnaire_forms', 'product_type', 'LONGTEXT CHARACTER SET utf8mb4 COLLATE utf8mb4_bin DEFAULT NULL COMMENT ''Type of product/service offerings''');
CALL AddColumnIfNotExists('brandkit_questionnaire_forms', 'product_features', 'TEXT DEFAULT NULL COMMENT ''Key features and benefits of the product/service''');
CALL AddColumnIfNotExists('brandkit_questionnaire_forms', 'product_pricing', 'VARCHAR(50) DEFAULT NULL COMMENT ''Pricing tier of the product/service''');
CALL AddColumnIfNotExists('brandkit_questionnaire_forms', 'product_stage', 'VARCHAR(50) DEFAULT NULL COMMENT ''Current stage of the product/service''');
CALL AddColumnIfNotExists('brandkit_questionnaire_forms', 'product_materials', 'TEXT DEFAULT NULL COMMENT ''Existing product photos or materials''');

-- Function to safely add index if it doesn't exist
DELIMITER $$
CREATE PROCEDURE AddIndexIfNotExists(
    IN tableName VARCHAR(64),
    IN indexName VARCHAR(64),
    IN columnName VARCHAR(64)
)
BEGIN
    DECLARE indexExists INT DEFAULT 0;
    
    SELECT COUNT(*) INTO indexExists
    FROM INFORMATION_SCHEMA.STATISTICS 
    WHERE TABLE_SCHEMA = DATABASE() 
    AND TABLE_NAME = tableName 
    AND INDEX_NAME = indexName;
    
    IF indexExists = 0 THEN
        SET @sql = CONCAT('ALTER TABLE `', tableName, '` ADD INDEX `', indexName, '` (`', columnName, '`)');
        PREPARE stmt FROM @sql;
        EXECUTE stmt;
        DEALLOCATE PREPARE stmt;
        SELECT CONCAT('Added index: ', indexName) as result;
    ELSE
        SELECT CONCAT('Index already exists: ', indexName) as result;
    END IF;
END$$
DELIMITER ;

-- Safely add indexes
CALL AddIndexIfNotExists('brandkit_questionnaire_forms', 'idx_offering_type', 'offering_type');
CALL AddIndexIfNotExists('brandkit_questionnaire_forms', 'idx_product_industry', 'product_industry');
CALL AddIndexIfNotExists('brandkit_questionnaire_forms', 'idx_product_pricing', 'product_pricing');
CALL AddIndexIfNotExists('brandkit_questionnaire_forms', 'idx_product_stage', 'product_stage');

-- Update triggers safely
DELIMITER $$
DROP TRIGGER IF EXISTS `calculate_brandkit_questionnaire_progress`$$
CREATE TRIGGER `calculate_brandkit_questionnaire_progress` BEFORE INSERT ON `brandkit_questionnaire_forms` FOR EACH ROW 
BEGIN
    -- Calculate progress based on current step (9 total steps)
    SET NEW.progress_percentage = LEAST((NEW.current_step * 100) / 9, 100);
    
    -- Mark as completed if on final step
    IF NEW.current_step >= 9 THEN
        SET NEW.is_completed = TRUE;
    END IF;
END$$
DELIMITER ;

DELIMITER $$
DROP TRIGGER IF EXISTS `calculate_brandkit_questionnaire_progress_update`$$
CREATE TRIGGER `calculate_brandkit_questionnaire_progress_update` BEFORE UPDATE ON `brandkit_questionnaire_forms` FOR EACH ROW 
BEGIN
    -- Calculate progress based on current step (9 total steps)
    SET NEW.progress_percentage = LEAST((NEW.current_step * 100) / 9, 100);
    
    -- Mark as completed if on final step
    IF NEW.current_step >= 9 THEN
        SET NEW.is_completed = TRUE;
    END IF;
END$$
DELIMITER ;

-- Clean up procedures
DROP PROCEDURE IF EXISTS AddColumnIfNotExists;
DROP PROCEDURE IF EXISTS AddIndexIfNotExists;

-- Final verification
SELECT 'Production migration completed successfully!' as status;
