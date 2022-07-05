USE `mydb`;

CREATE DEFINER=`root`@`%` PROCEDURE `update_can_edit`(
	IN p_user_id CHAR(9), 
    IN p_can_edit BOOLEAN
)
BEGIN
	DECLARE EXIT HANDLER FOR SQLEXCEPTION, SQLWARNING
	BEGIN
		ROLLBACK;
		RESIGNAL;
	END;
    START TRANSACTION;

    UPDATE `users` SET `can_edit` = p_can_edit WHERE `user_id` = p_user_id;
    SELECT `can_edit` FROM `users` WHERE `user_id` = p_user_id;
    
    COMMIT;
END