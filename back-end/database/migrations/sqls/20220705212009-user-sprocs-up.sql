-- User Table Stored Procedures

CREATE PROCEDURE `create_user` 
(	
	IN p_user_id CHAR(9), 
    IN p_username VARCHAR(20), 
    IN p_password_hash CHAR(60), 
    IN p_email VARCHAR(320),
	IN p_role VARCHAR(10),
	IN p_can_edit BOOLEAN
)
BEGIN
	DECLARE v_strict BOOLEAN;
	DECLARE EXIT HANDLER FOR SQLEXCEPTION, SQLWARNING
	BEGIN
		ROLLBACK;
		RESIGNAL;
	END;
    START TRANSACTION;
	INSERT INTO `users`
    VALUES (p_user_id, p_username, p_password_hash, p_email, p_role, p_can_edit);
    COMMIT;

	SELECT `user_id`, `username`, `email`, `role`, `can_edit` FROM `users` WHERE `user_id` = p_user_id;
END;

CREATE PROCEDURE `read_user_info` 
(
    IN p_username VARCHAR(20)
)
BEGIN
	IF NOT EXISTS(SELECT * FROM `users` WHERE `username` = p_username) THEN
		SIGNAL SQLSTATE '45000' SET MESSAGE_TEXT = 'ResourceDNE:user';
	END IF;

    SELECT `user_id`, `username`, `email`, `role`, `can_edit` FROM `users` WHERE `username` = p_username;
END;

CREATE PROCEDURE `read_user_info_with_matching_username` 
(
    IN p_username VARCHAR(20)
)
BEGIN
    SELECT * 
	FROM `users` 
	WHERE BINARY `username` = p_username;
END;

CREATE PROCEDURE `read_user_info_with_matching_email` 
(
    IN p_email VARCHAR(320)
)
BEGIN
    SELECT * 
	FROM `users` 
	WHERE BINARY `email` = p_email;
END;

CREATE PROCEDURE `read_user_password_hash` 
(
    IN p_user_id CHAR(9)
)
BEGIN
	IF NOT EXISTS(SELECT * FROM `users` WHERE `user_id` = p_user_id) THEN
		SIGNAL SQLSTATE '45000' SET MESSAGE_TEXT = 'ResourceDNE:user';
	END IF;

    SELECT `password_hash` FROM `users` WHERE `user_id` = p_user_id;
END;

CREATE PROCEDURE `read_all_users_info` 
(
	IN p_offset INT, 
	IN p_limit INT
)
BEGIN
    SELECT `user_id`, `username`, `email`, `role`, `can_edit` 
	FROM `users`
	ORDER BY `role` ASC, `username` ASC
	LIMIT p_offset, p_limit;
END;

CREATE PROCEDURE `update_username`
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

    UPDATE `users` SET `username` = p_username WHERE `user_id` = p_user_id;
    SELECT `username` FROM `users` WHERE `user_id` = p_user_id;
    
    COMMIT;
END;

CREATE PROCEDURE `update_password_hash`
(
	IN p_user_id CHAR(9), 
    IN p_password_hash CHAR(60)
)
BEGIN
	DECLARE EXIT HANDLER FOR SQLEXCEPTION, SQLWARNING
	BEGIN
		ROLLBACK;
		RESIGNAL;
	END;
    START TRANSACTION;

    UPDATE `users` SET `password_hash` = p_password_hash WHERE `user_id` = p_user_id;
    SELECT `password_hash` FROM `users` WHERE `user_id` = p_user_id;
    
    COMMIT;
END;

CREATE PROCEDURE `update_email`
(
	IN p_user_id CHAR(9), 
    IN p_email VARCHAR(320)
)
BEGIN
	DECLARE EXIT HANDLER FOR SQLEXCEPTION, SQLWARNING
	BEGIN
		ROLLBACK;
		RESIGNAL;
	END;
    START TRANSACTION;

    UPDATE `users` SET `email` = p_email WHERE `user_id` = p_user_id;
    SELECT `email` FROM `users` WHERE `user_id` = p_user_id;
    
    COMMIT;
END;

CREATE PROCEDURE `update_role`
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

    UPDATE `users` SET `role` = p_role WHERE `user_id` = p_user_id;
    SELECT `role` FROM `users` WHERE `user_id` = p_user_id;
    
    COMMIT;
END;

CREATE PROCEDURE `update_can_edit`
(
	IN p_user_id CHAR(9), 
    IN p_can_edit BOOLEAN
)
BEGIN
	DECLARE EXIT HANDLER FOR SQLEXCEPTION, SQLWARNING
	BEGIN
		ROLLBACK;
		RESIGNAL;
	END;
    START TRANSACTION;

    UPDATE `users` SET `can_edit` = p_can_edit WHERE `user_id` = p_user_id;
    SELECT `can_edit` FROM `users` WHERE `user_id` = p_user_id;
    
    COMMIT;
END;

CREATE PROCEDURE `delete_user`
(
	IN p_username VARCHAR(20)
)
BEGIN
    IF NOT EXISTS(SELECT * FROM `users` WHERE `username` = p_username) THEN
		SIGNAL SQLSTATE '45000' SET MESSAGE_TEXT = 'ResourceDNE:user';
	ELSE
		DELETE FROM `users` 
		WHERE `username` = p_username;
	END IF;
END;