-- Page Table Stored Procedures

CREATE PROCEDURE `create_page`
(
	IN p_page_id CHAR(9),
    IN p_title VARCHAR(32),
    IN p_username VARCHAR(20),
    IN p_user_id CHAR(9),
    IN p_image_url VARCHAR(2048),
    IN p_lead VARCHAR(65000),
    IN p_body VARCHAR(65000) 
)
BEGIN
	DECLARE EXIT HANDLER FOR SQLEXCEPTION, SQLWARNING
	BEGIN
		ROLLBACK;
		RESIGNAL;
	END;
    START TRANSACTION;

	INSERT INTO `pages` 
    (
        `page_id`, 
        `page_version`, 
        `username`, 
        `user_id`,
        `freeze_page`,
        `title`, 
        `image_url`, 
        `lead`, 
        `body` 
    )
    VALUES 
    (
        p_page_id, 
        1,
        p_username,
        p_user_id,
        0,
        p_title, 
        p_image_url, 
        p_lead, 
        p_body 
    );

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

CREATE PROCEDURE `read_pages_based_on_search_string`
(
    IN search_string VARCHAR(50)
)
BEGIN
    SELECT `page_id`, `page_version`, `timestamp`, `username`, `user_id`, `title`, `lead`
    FROM `pages`
    WHERE 
        (`title` LIKE CONCAT('%', search_string, '%')) OR 
        (`lead` LIKE CONCAT('%', search_string, '%')) OR
        (`body` LIKE CONCAT('%', search_string, '%'));
END;

CREATE PROCEDURE `update_content`
(
	IN p_page_id CHAR(9),
    IN p_username VARCHAR(20),
    IN p_user_id CHAR(9),
    IN p_title VARCHAR(32),
    IN p_image_url VARCHAR(2048),
    IN p_lead VARCHAR(65000),
    IN p_body VARCHAR(65000)
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
        `username` = p_username,
        `user_id` = p_user_id,
        `title` = p_title,
        `image_url` = p_image_url,
        `lead` = p_lead,
        `body` = p_body,
        `page_version` = `page_version` + 1
    WHERE `page_id` = p_page_id;

    SELECT `title`, `image_url`, `lead`, `body` 
    FROM `pages` 
    WHERE `page_id` = p_page_id;
    
    COMMIT;
END;

CREATE PROCEDURE `update_freeze_page`(
	IN p_page_id CHAR(9),
    IN p_username VARCHAR(20),
    IN p_user_id CHAR(9),
    IN p_freeze_page BOOLEAN
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
        `username` = p_username,
        `user_id` = p_user_id,
        `freeze_page` = p_freeze_page,
        `page_version` = `page_version` + 1
    WHERE `page_id` = p_page_id;
    SELECT `freeze_page` FROM `pages` WHERE `page_id` = p_page_id;
    
    COMMIT;
END;

CREATE PROCEDURE `update_username_in_pages`
(
    p_user_id CHAR(9),
    p_username VARCHAR(20)
)
BEGIN
    DECLARE EXIT HANDLER FOR SQLEXCEPTION, SQLWARNING
	BEGIN
		ROLLBACK;
		RESIGNAL;
	END;
    START TRANSACTION;

    UPDATE `pages` 
    SET `username` = p_username 
    WHERE `user_id` = p_user_id;
    
    COMMIT;

    SELECT p_username;
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