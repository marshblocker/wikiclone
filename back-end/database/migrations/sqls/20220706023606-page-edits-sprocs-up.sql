-- Page Edits Stored Procedures

CREATE PROCEDURE `create_page_edit`
(
    p_page_edit_id CHAR(9),
    p_page_version INT,
    p_timestamp DATETIME,
    p_edit_summary VARCHAR(500),
    p_user_id CHAR(9),
    p_username VARCHAR(20),
    p_role VARCHAR(10),
    p_page_id CHAR(9),
    p_title VARCHAR(32),
    p_image_url VARCHAR(2048),
    p_lead TEXT,
    p_body TEXT
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
        p_title,
        p_image_url,
        p_lead,
        p_body,
    );

    COMMIT;

    SELECT *
    FROM `page_edits`
    WHERE `page_edit_id` = p_page_edit_id;
END;

CREATE PROCEDURE `read_page_edit`
(
    p_page_edit_id CHAR(9)
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

CREATE PROCEDURE `read_all_page_edits`()
BEGIN
    SELECT * FROM `page_edits`;
END;

CREATE PROCEDURE `update_edit_summary`
(
    p_page_edit_id CHAR(9),
    p_edit_summary VARCHAR(500)
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

    UPDATE `page_edits` 
    SET `username` = p_username 
    WHERE `user_id` = p_user_id;
    
    COMMIT;

    SELECT p_username;
END;

CREATE PROCEDURE `update_role_in_page_edits`
(
    p_user_id CHAR(9),
    p_role VARCHAR(10)
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

CREATE PROCEDURE `delete_page_edit`
(
    p_page_edit_id CHAR(9)
)
BEGIN
    IF NOT EXISTS(SELECT * FROM `page_edits` WHERE `page_edit_id` = p_page_edit_id) THEN
		SIGNAL SQLSTATE '45000' SET MESSAGE_TEXT = 'ResourceDNE:page_edit';
	ELSE
		DELETE FROM `page_edits` 
		WHERE `page_edit_id` = p_page_edit_id;
	END IF;
END;