USE `mydb`;

CREATE DEFINER=`root`@`%` PROCEDURE `create_user` 
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
END