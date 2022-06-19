USE `mydb`;

CREATE DEFINER=`root`@`%` PROCEDURE `delete_page`(IN p_id CHAR(9))
BEGIN
	IF p_id IS NULL THEN
		SIGNAL SQLSTATE '45000' SET MESSAGE_TEXT = 'NullID:page_id';
	END IF;
    IF NOT EXISTS(SELECT * FROM `pages` WHERE `id` = p_id) THEN
		SIGNAL SQLSTATE '45000' SET MESSAGE_TEXT = 'ResourceDNE:page';
	ELSE
		CALL read_page(p_id);
		DELETE FROM `pages` WHERE `id` = p_id;
	END IF;
END