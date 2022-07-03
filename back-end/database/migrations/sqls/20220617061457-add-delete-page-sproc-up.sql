USE `mydb`;

CREATE DEFINER=`root`@`%` PROCEDURE `delete_page`
(
	IN p_page_id CHAR(9)
)
BEGIN
    IF NOT EXISTS(SELECT * FROM `pages` WHERE `page_id` = p_page_id) THEN
		SIGNAL SQLSTATE '45000' SET MESSAGE_TEXT = 'ResourceDNE:page';
	ELSE
		SELECT * 
		FROM `pages` 
		WHERE `page_id` = p_page_id;

		DELETE FROM `pages` 
		WHERE `page_id` = p_id;
	END IF;
END