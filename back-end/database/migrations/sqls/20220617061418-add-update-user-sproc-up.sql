USE `mydb`;

CREATE DEFINER=`root`@`%` PROCEDURE `update_user`(
	IN p_id CHAR(9),
    IN p_username CHAR(16), 
    IN p_password CHAR(40), 
    IN p_email VARCHAR(320),
	IN p_role VARCHAR(10),
	IN p_canEdit BOOLEAN
)
BEGIN
	DECLARE v_strict BOOLEAN;
	DECLARE EXIT HANDLER FOR SQLEXCEPTION, SQLWARNING
	BEGIN
		ROLLBACK;
		RESIGNAL;
	END;
    START TRANSACTION;
	SET v_strict = 1;
    IF p_id IS NULL THEN
		SIGNAL SQLSTATE '45000' SET MESSAGE_TEXT = 'NullID:user_id';
	END IF;
    
    IF NOT EXISTS(SELECT * FROM `users` WHERE `user_id` = p_id) THEN
		SIGNAL SQLSTATE '45000' SET MESSAGE_TEXT = 'ResourceDNE:user';
	END IF;
    
	IF p_username IS NOT NULL THEN
		UPDATE `users` SET `username` = p_username WHERE `user_id` = p_id;
	END IF;
    IF p_password IS NOT NULL THEN
		SET v_strict = 0;
		UPDATE `users` SET `password` = p_password WHERE `user_id` = p_id;
	END IF;
    IF p_email IS NOT NULL THEN
		UPDATE `users` SET `email` = p_email WHERE `user_id` = p_id;
	END IF;
    IF p_role IS NOT NULL THEN
		UPDATE `users` SET `role` = p_role WHERE `user_id` = p_id;
	END IF;
    IF p_canEdit IS NOT NULL THEN
		UPDATE `users` SET `can_edit` = p_canEdit WHERE `user_id` = p_id;
	END IF;
    CALL read_user(p_id, v_strict);
    COMMIT;
END