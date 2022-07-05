-- Page Table Stored Procedures

CREATE PROCEDURE `create_page`
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
    VALUES (p_page_id, 1, p_title, p_image_url, p_lead, p_body, 0);

    COMMIT;

    SELECT * 
    FROM `pages` 
    WHERE `page_id` = p_page_id;
END;

CREATE PROCEDURE `read_page`
(
	IN p_page_id CHAR(9)
)
BEGIN
	IF NOT EXISTS(SELECT * FROM `pages` WHERE `page_id` = p_page_id) THEN
		SIGNAL SQLSTATE '45000' SET MESSAGE_TEXT = 'ResourceDNE:page';
	ELSE
		SELECT * FROM `pages` WHERE `page_id` = p_page_id;
	END IF;
END;

CREATE PROCEDURE `read_all_pages`()
BEGIN
	SELECT * FROM `pages`;
END;

CREATE PROCEDURE `update_freeze_page`(
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
END;

CREATE PROCEDURE `update_content`(
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
END;

CREATE PROCEDURE `delete_page`
(
	IN p_page_id CHAR(9)
)
BEGIN
    IF NOT EXISTS(SELECT * FROM `pages` WHERE `page_id` = p_page_id) THEN
		SIGNAL SQLSTATE '45000' SET MESSAGE_TEXT = 'ResourceDNE:page';
	ELSE
		DELETE FROM `pages` 
		WHERE `page_id` = p_page_id;
	END IF;
END;