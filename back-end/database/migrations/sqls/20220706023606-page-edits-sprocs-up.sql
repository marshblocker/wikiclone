-- Page Edits Stored Procedures

CREATE PROCEDURE `create_page_edit`
(
    IN p_page_edit_id CHAR(9),
    IN p_page_version INT,
    IN p_timestamp DATETIME,
    IN p_edit_summary VARCHAR(500),
    IN p_user_id CHAR(9),
    IN p_username VARCHAR(20),
    IN p_role VARCHAR(10),
    IN p_page_id CHAR(9),
    IN p_freeze_page BOOLEAN,
    IN p_current_title VARCHAR(32),
    IN p_title VARCHAR(32),
    IN p_image_url VARCHAR(2048),
    IN p_lead VARCHAR(3000),
    IN p_body TEXT
)
BEGIN
    DECLARE EXIT HANDLER FOR SQLEXCEPTION, SQLWARNING
	BEGIN
		ROLLBACK;
		RESIGNAL;
	END;
    START TRANSACTION;
    
    INSERT INTO `page_edits` 
    (
        `page_edit_id`,
        `page_version`,
        `timestamp`,
        `edit_summary`,
        `user_id`,
        `username`,
        `role`,
        `page_id`,
        `freeze_page`,
        `current_title`,
        `title`,
        `image_url`,
        `lead`,
        `body`
    )
    VALUES 
    (
        p_page_edit_id,
        p_page_version,
        p_timestamp,
        p_edit_summary,
        p_user_id,
        p_username,
        p_role,
        p_page_id,
        p_freeze_page,
        p_current_title,
        p_title,
        p_image_url,
        p_lead,
        p_body
    );

    COMMIT;

    SELECT *
    FROM `page_edits`
    WHERE `page_edit_id` = p_page_edit_id;
END;

CREATE PROCEDURE `read_page_edit`
(
    IN p_page_edit_id CHAR(9)
)
BEGIN
    IF NOT EXISTS(SELECT * FROM `page_edits` WHERE `page_edit_id` = p_page_edit_id) THEN
		SIGNAL SQLSTATE '45000' SET MESSAGE_TEXT = 'ResourceDNE:page_edit';
	ELSE
		SELECT * 
        FROM `page_edits` 
        WHERE `page_edit_id` = p_page_edit_id;
	END IF;
END;

CREATE PROCEDURE `read_page_edit_by_page_title_and_page_version`
(
    IN p_current_title VARCHAR(32),
    IN p_page_version INT
)
BEGIN
    SELECT *
    FROM `page_edits`
    WHERE (`current_title` = p_current_title) AND 
          (`page_version` = p_page_version);
END;

CREATE PROCEDURE `read_page_edits_by_page_title`
(
    IN p_title VARCHAR(32),
    IN p_offset INT,
    IN p_limit INT
)
BEGIN
    SELECT *
    FROM `page_edits`
    WHERE `current_title` = p_title
    ORDER BY `page_version` DESC
    LIMIT p_offset, p_limit;
END;

CREATE PROCEDURE `read_page_edits_by_page_id`
(
    IN p_page_id CHAR(9)
)
BEGIN
    SELECT *
    FROM `page_edits`
    WHERE `page_id` = p_page_id
    ORDER BY `page_version` DESC;
END;

CREATE PROCEDURE `read_user_page_edits`
(
    IN p_username VARCHAR(20),
    IN p_offset INT,
    IN p_limit INT
)
BEGIN
    SELECT *
    FROM `page_edits`
    WHERE `username` = p_username
    ORDER BY `timestamp` DESC
    LIMIT p_offset, p_limit;
END;

CREATE PROCEDURE `read_all_page_edits`()
BEGIN
    SELECT * FROM `page_edits`;
END;

CREATE PROCEDURE `read_latest_version_per_pages`()
BEGIN
    SELECT `current_title`, MAX(`page_version`) AS `latest_version`
    FROM `page_edits`
    GROUP BY `current_title`;
END;

CREATE PROCEDURE `update_edit_summary`
(
    IN p_page_edit_id CHAR(9),
    IN p_edit_summary VARCHAR(500)
)
BEGIN
    DECLARE EXIT HANDLER FOR SQLEXCEPTION, SQLWARNING
	BEGIN
		ROLLBACK;
		RESIGNAL;
	END;
    START TRANSACTION;

    UPDATE `page_edits` 
    SET `edit_summary` = p_edit_summary 
    WHERE `page_edit_id` = p_page_edit_id;
    
    COMMIT;

    SELECT `edit_summary` 
    FROM `page_edits` 
    WHERE `page_edit_id` = p_page_edit_id;
END;

CREATE PROCEDURE `update_username_in_page_edits`
(
    IN p_user_id CHAR(9),
    IN p_username VARCHAR(20)
)
BEGIN
    DECLARE EXIT HANDLER FOR SQLEXCEPTION, SQLWARNING
	BEGIN
		ROLLBACK;
		RESIGNAL;
	END;
    START TRANSACTION;

    UPDATE `page_edits` 
    SET `username` = p_username 
    WHERE `user_id` = p_user_id;
    
    COMMIT;

    SELECT p_username;
END;

CREATE PROCEDURE `update_role_in_page_edits`
(
    IN p_user_id CHAR(9),
    IN p_role VARCHAR(10)
)
BEGIN
    DECLARE EXIT HANDLER FOR SQLEXCEPTION, SQLWARNING
	BEGIN
		ROLLBACK;
		RESIGNAL;
	END;
    START TRANSACTION;

    UPDATE `page_edits` 
    SET `username` = p_role 
    WHERE `user_id` = p_user_id;
    
    COMMIT;

    SELECT p_role;
END;

CREATE PROCEDURE `update_current_title_in_page_edits`
(
    IN p_page_id CHAR(9),
    IN p_current_title VARCHAR(32)
)
BEGIN
    DECLARE EXIT HANDLER FOR SQLEXCEPTION, SQLWARNING
	BEGIN
		ROLLBACK;
		RESIGNAL;
	END;
    START TRANSACTION;

    UPDATE `page_edits` 
    SET `current_title` = p_current_title 
    WHERE `page_id` = p_page_id;
    
    COMMIT;

    SELECT p_current_title;
END;

CREATE PROCEDURE `delete_page_edit`
(
    IN p_page_edit_id CHAR(9)
)
BEGIN
    IF NOT EXISTS(SELECT * FROM `page_edits` WHERE `page_edit_id` = p_page_edit_id) THEN
		SIGNAL SQLSTATE '45000' SET MESSAGE_TEXT = 'ResourceDNE:page_edit';
	ELSE
		DELETE FROM `page_edits` 
		WHERE `page_edit_id` = p_page_edit_id;
	END IF;
END;

CREATE PROCEDURE `delete_page_edits_of_deleted_page`
(
    IN p_page_id CHAR(9)
)
BEGIN
    DELETE FROM `page_edits`
    WHERE `page_id` = p_page_id;
END;