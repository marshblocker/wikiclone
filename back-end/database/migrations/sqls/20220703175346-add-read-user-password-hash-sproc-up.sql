USE `mydb`;

CREATE DEFINER=`root`@`%` PROCEDURE `read_user_password_hash` 
(
    IN p_user_id CHAR(9)
)
BEGIN
	IF NOT EXISTS(SELECT * FROM `users` WHERE `user_id` = p_user_id) THEN
		SIGNAL SQLSTATE '45000' SET MESSAGE_TEXT = 'ResourceDNE:user';
	END IF;

    SELECT `password_hash` FROM `users` WHERE `user_id` = p_user_id;
END