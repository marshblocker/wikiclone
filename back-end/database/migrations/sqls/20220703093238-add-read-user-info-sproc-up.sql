USE `mydb`;

CREATE DEFINER=`root`@`%` PROCEDURE `read_user_info` 
(
    IN p_user_id CHAR(9)
)
BEGIN
	IF NOT EXISTS(SELECT * FROM `users` WHERE `user_id` = p_user_id) THEN
		SIGNAL SQLSTATE '45000' SET MESSAGE_TEXT = 'ResourceDNE:user';
	END IF;

    SELECT `user_id`, `username`, `email`, `role`, `can_edit` FROM `users` WHERE `user_id` = p_user_id;
END