USE `mydb`;

CREATE DEFINER=`root`@`%` PROCEDURE `update_password_hash`(
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
END