USE `mydb`;

CREATE DEFINER=`root`@`%` PROCEDURE `update_email`(
	IN p_user_id CHAR(9), 
    IN p_email VARCHAR(320)
)
BEGIN
	DECLARE EXIT HANDLER FOR SQLEXCEPTION, SQLWARNING
	BEGIN
		ROLLBACK;
		RESIGNAL;
	END;
    START TRANSACTION;

    UPDATE `users` SET `email` = p_email WHERE `user_id` = p_user_id;
    SELECT `email` FROM `users` WHERE `user_id` = p_user_id;
    
    COMMIT;
END