USE `mydb`;

CREATE DEFINER=`root`@`%` PROCEDURE `read_all_users` (IN p_strict BOOLEAN)
BEGIN
	IF p_strict <> 0 THEN
		SELECT `id`, `username`, `email`, `role`, `can_edit` FROM `users`;
	ELSE
		SELECT * FROM `users`;
	END IF;
END