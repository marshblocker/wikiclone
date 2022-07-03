USE `mydb`;

CREATE DEFINER=`root`@`%` PROCEDURE `update_freeze_page`(
	IN p_page_id CHAR(9), 
    IN p_freeze_page BOOLEAN
)
BEGIN
	DECLARE EXIT HANDLER FOR SQLEXCEPTION, SQLWARNING
	BEGIN
		ROLLBACK;
		RESIGNAL;
	END;
    START TRANSACTION;

    UPDATE `pages` SET `freeze_page` = p_freeze_page WHERE `page_id` = p_page_id;
    SELECT `freeze_page` FROM `pages` WHERE `page_id` = p_page_id;
    
    COMMIT;
END