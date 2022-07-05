USE `mydb`;

CREATE DEFINER=`root`@`%` PROCEDURE `update_role`(
	IN p_user_id CHAR(9), 
    IN p_role VARCHAR(10)
)
BEGIN
	DECLARE EXIT HANDLER FOR SQLEXCEPTION, SQLWARNING
	BEGIN
		ROLLBACK;
		RESIGNAL;
	END;
    START TRANSACTION;

    UPDATE `users` SET `role` = p_role WHERE `user_id` = p_user_id;
    SELECT `role` FROM `users` WHERE `user_id` = p_user_id;
    
    COMMIT;
END