USE `mydb`;

CREATE DEFINER=`root`@`%` PROCEDURE `update_username`(
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
END