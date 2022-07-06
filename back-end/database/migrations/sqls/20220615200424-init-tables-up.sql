USE `mydb`;

CREATE TABLE `users` (
 `user_id` CHAR(9) NOT NULL UNIQUE,
 `username` VARCHAR(20) NOT NULL UNIQUE,
 `password_hash` CHAR(60) NOT NULL,
 `email` VARCHAR(320) NOT NULL UNIQUE,
 `role` VARCHAR(10) NOT NULL,
 `can_edit` BOOLEAN NOT NULL,
 PRIMARY KEY (`user_id`)
);

CREATE TABLE `pages` (
 `page_id` CHAR(9) NOT NULL UNIQUE,
 `page_version` INT NOT NULL,
 `timestamp` DATETIME NOT NULL,
 `username` VARCHAR(20) NOT NULL UNIQUE,
 `title` VARCHAR(32) NOT NULL UNIQUE,
 `image_url` VARCHAR(2048),
 `lead` VARCHAR(65000) NOT NULL,
 `body` VARCHAR(65000) NOT NULL,
 `freeze_page` BOOLEAN NOT NULL,
 PRIMARY KEY (`page_id`),
 INDEX filter_index(`title`)
);

CREATE TABLE `page_edits` (
 `page_edit_id` CHAR(9) NOT NULL UNIQUE,
 `page_version` INT NOT NULL,
 `timestamp` DATETIME NOT NULL,
 `edit_summary` VARCHAR(500) NOT NULL,
 `user_id` CHAR(9) NOT NULL UNIQUE,
 `username` VARCHAR(20) NOT NULL UNIQUE,
 `role` VARCHAR(10) NOT NULL,
 `page_id` CHAR(9) NOT NULL UNIQUE,
 `title` VARCHAR(32) NOT NULL UNIQUE,
 `image_url` VARCHAR(2048),
 `lead` VARCHAR(65000) NOT NULL,
 `body` VARCHAR(65000) NOT NULL,
 PRIMARY KEY (`page_edit_id`)
);