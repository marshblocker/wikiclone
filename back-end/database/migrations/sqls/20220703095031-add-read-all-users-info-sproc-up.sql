USE `mydb`;

CREATE DEFINER=`root`@`%` PROCEDURE `read_all_users_info` ()
BEGIN
    SELECT `user_id`, `username`, `email`, `role`, `can_edit` FROM `users`;
END