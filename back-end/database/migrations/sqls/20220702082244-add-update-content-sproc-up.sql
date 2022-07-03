USE `mydb`;

CREATE DEFINER=`root`@`%` PROCEDURE `update_content`(
	IN p_page_id CHAR(9),
    IN p_title VARCHAR(32),
    IN p_image_url VARCHAR(2048),
    IN p_lead TEXT,
    IN p_body TEXT
)
BEGIN
	DECLARE EXIT HANDLER FOR SQLEXCEPTION, SQLWARNING
	BEGIN
		ROLLBACK;
		RESIGNAL;
	END;
    START TRANSACTION;

    UPDATE `pages` 
    SET 
        `title` = p_title,
        `image_url` = p_image_url,
        `lead` = p_lead,
        `body` = p_body
    WHERE `page_id` = p_page_id;

    SELECT `title`, `image_url`, `lead`, `body` 
    FROM `pages` 
    WHERE `page_id` = p_page_id;
    
    COMMIT;
END