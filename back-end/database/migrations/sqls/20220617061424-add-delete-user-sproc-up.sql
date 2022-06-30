USE `mydb`;

CREATE DEFINER=`root`@`%` PROCEDURE `delete_user`(IN p_id CHAR(9))
BEGIN
	DECLARE v_strict BOOLEAN;
	IF p_id IS NULL THEN
		SIGNAL SQLSTATE '45000' SET MESSAGE_TEXT = 'NullID:user_id';
	END IF;
    IF NOT EXISTS(SELECT * FROM `users` WHERE `user_id` = p_id) THEN
		SIGNAL SQLSTATE '45000' SET MESSAGE_TEXT = 'ResourceDNE:user';
	ELSE
		SET v_strict = 0;
		CALL read_user(p_id, v_strict);
		DELETE FROM `users` WHERE `user_id` = p_id;
	END IF;
END