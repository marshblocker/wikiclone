USE `mydb`;

CREATE DEFINER=`root`@`%` PROCEDURE `create_page`(
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
	INSERT INTO `pages`
    VALUES (p_id, p_title, p_content, p_freeze_page);
    COMMIT;
    CALL read_page(p_id);
END