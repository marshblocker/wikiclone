USE `mydb`;

CREATE DEFINER=`root`@`%` PROCEDURE `read_user` (IN p_id CHAR(9), IN p_strict BOOLEAN)
BEGIN
	IF p_id IS NULL THEN
		SIGNAL SQLSTATE '45000' SET MESSAGE_TEXT = 'NullID:user_id.';
	END IF;

	IF NOT EXISTS(SELECT * FROM `users` WHERE `id` = p_id) THEN
		SIGNAL SQLSTATE '45000' SET MESSAGE_TEXT = 'ResourceDNE:user';
	END IF;

	IF p_strict <> 0 THEN
		SELECT `id`, `username`, `email`, `role`, `can_edit` FROM `users` WHERE `id` = p_id;
	ELSE
		SELECT * FROM `users` WHERE `id` = p_id;
	END IF;
END