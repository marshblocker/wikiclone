USE `mydb`;

CREATE DEFINER=`root`@`%` PROCEDURE `create_user` 
(	
	IN p_id CHAR(9), 
    IN p_username CHAR(16), 
    IN p_password CHAR(40), 
    IN p_email VARCHAR(320),
	IN p_role VARCHAR(10),
	IN p_canEdit BOOLEAN
)
BEGIN
	DECLARE v_strict BOOLEAN;
	DECLARE EXIT HANDLER FOR SQLEXCEPTION, SQLWARNING
	BEGIN
		ROLLBACK;
		RESIGNAL;
	END;
    START TRANSACTION;
	INSERT INTO `users`
    VALUES (p_id, p_username, p_password, p_email, p_role, p_canEdit);
    COMMIT;

	SET v_strict = 0;
    CALL read_user(p_id, v_strict);
END