USE `mydb`;

CREATE DEFINER=`root`@`%` PROCEDURE `update_page`(
	IN p_id CHAR(9), 
    IN p_title CHAR(30), 
    IN p_content TEXT, 
    IN p_freeze_page BOOLEAN
)
BEGIN
	DECLARE EXIT HANDLER FOR SQLEXCEPTION, SQLWARNING
	BEGIN
		ROLLBACK;
		RESIGNAL;
	END;
    START TRANSACTION;
    IF p_id IS NULL THEN
		SIGNAL SQLSTATE '45000' SET MESSAGE_TEXT = 'NullID:page_id.';
	END IF;
    
    IF NOT EXISTS(SELECT * FROM `pages` WHERE `page_id` = p_id) THEN
		SIGNAL SQLSTATE '45000' SET MESSAGE_TEXT = 'ResourceDNE:page';
	END IF;
    
    IF p_title IS NOT NULL THEN
		UPDATE `pages` SET `title` = p_title WHERE `page_id` = p_id;
	END IF;
    IF p_content IS NOT NULL THEN
		UPDATE `pages` SET `content` = p_content WHERE `page_id` = p_id;
	END IF;
    IF p_freeze_page IS NOT NULL THEN
		UPDATE `pages` SET `freeze_page` = p_freeze_page WHERE `page_id` = p_id;
	END IF;
    CALL read_page(p_id);
    COMMIT;
END