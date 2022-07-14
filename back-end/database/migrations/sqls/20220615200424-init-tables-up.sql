USE `mydb`;

CREATE TABLE `users` (
 `user_id` CHAR(9) NOT NULL UNIQUE,
 `username` VARCHAR(20) NOT NULL UNIQUE,
 `password_hash` CHAR(60) NOT NULL,
 `email` VARCHAR(320) NOT NULL UNIQUE,
 `role` VARCHAR(10) NOT NULL,
 `can_edit` BOOLEAN NOT NULL,
 PRIMARY KEY (`user_id`),
 INDEX search_users_index(`username`, `email`)
);

INSERT INTO `users`
VALUES ('xdZWspFv2', 'admin', '$2b$10$qBIq2TyD/Il//nJw8s1tU.q.oKjXmTKOVSsmUqe8PO8xBq1SDkvQq', 'admin@gmail.com', 'admin', 1),
       ('L_254KKf5', 'max', '$2b$10$wTuS0iRGlqYUTJ9AxEkV4u3Upn35hJz4JJo29KnLhWReBg0yWzyLW', 'max@gmail.com', 'user', 1);


CREATE TABLE `pages` (
 -- Meta-content 
 `page_id` CHAR(9) NOT NULL UNIQUE,
 `page_version` INT NOT NULL,
 `timestamp` DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
 `username` VARCHAR(20) NOT NULL,
 `user_id` CHAR(9) NOT NULL,
 `freeze_page` BOOLEAN NOT NULL,
 `current_title` VARCHAR(32) NOT NULL,

 -- Content  
 `title` VARCHAR(32) NOT NULL UNIQUE,
 `image_url` VARCHAR(2048),
 `lead` VARCHAR(3000) NOT NULL,
 `body` TEXT NOT NULL,

 PRIMARY KEY (`page_id`),
 INDEX search_pages_index (`title`, `lead`)
);

CREATE TABLE `page_edits` (
 `page_edit_id` CHAR(9) NOT NULL UNIQUE,
 `page_version` INT NOT NULL,
 `timestamp` DATETIME NOT NULL,
 `edit_summary` VARCHAR(500) NOT NULL,

 `user_id` CHAR(9) NOT NULL,
 `username` VARCHAR(20) NOT NULL,
 `role` VARCHAR(10) NOT NULL,

 `page_id` CHAR(9) NOT NULL,
 `freeze_page` BOOLEAN NOT NULL,
 `current_title` VARCHAR(32) NOT NULL,
 `title` VARCHAR(32) NOT NULL,
 `image_url` VARCHAR(2048),
 `lead` VARCHAR(3000) NOT NULL,
 `body` TEXT NOT NULL,
 PRIMARY KEY (`page_edit_id`),
 INDEX search_page_edits_index(`username`, `current_title`)
);