USE `mydb`;

CREATE DEFINER=`root`@`%` PROCEDURE `read_all_pages`()
BEGIN
	SELECT * FROM `pages`;
END