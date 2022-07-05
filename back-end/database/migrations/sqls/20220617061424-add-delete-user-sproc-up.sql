USE `mydb`;

CREATE DEFINER=`root`@`%` PROCEDURE `delete_user`
(
	IN p_user_id CHAR(9)
)
BEGIN
    IF NOT EXISTS(SELECT * FROM `users` WHERE `user_id` = p_user_id) THEN
		SIGNAL SQLSTATE '45000' SET MESSAGE_TEXT = 'ResourceDNE:user';
	ELSE
		DELETE FROM `users` 
		WHERE `user_id` = p_user_id;
	END IF;
END