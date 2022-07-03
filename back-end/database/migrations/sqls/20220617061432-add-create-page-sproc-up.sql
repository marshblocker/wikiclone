USE `mydb`;

CREATE DEFINER=`root`@`%` PROCEDURE `create_page`
(
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

	INSERT INTO `pages`
    VALUES (p_page_id, p_title, p_image_url, p_lead, p_body, 0);

    COMMIT;

    SELECT * 
    FROM `pages` 
    WHERE `page_id` = p_page_id;
END