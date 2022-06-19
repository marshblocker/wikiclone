USE `mydb`;

CREATE TABLE `users` (
 `user_id` CHAR(9) NOT NULL UNIQUE,
 `username` VARCHAR(20) NOT NULL UNIQUE,
 `password` CHAR(40) NOT NULL,
 `email` VARCHAR(320) NOT NULL UNIQUE,
 `role` VARCHAR(10) NOT NULL,
 `can_edit` BOOLEAN NOT NULL,
 PRIMARY KEY (`user_id`)
);

INSERT INTO `users`
VALUES ('WG-g52obz', 'grep', '3A31C82929DB391B0E0BD7424E0B4275E6EB1BD6', 'grep@gmail.com', 'user', 1),
       ('ri7dUmhoe', 'optimus', '1F1D3772887289D67B355B0CB11AD98554ACBF5F', 'optimus@gmail.com', 'admin', 1),
       ('dNyUCv4an', 'prime', 'EA756C3AD19A39CFCC25922FF018BA8F797C88C3', 'prime@gmail.com', 'superadmin', 1);

CREATE TABLE `pages` (
 `page_id` CHAR(9) NOT NULL UNIQUE,
 `title` VARCHAR(32) NOT NULL UNIQUE,
 `content` TEXT NOT NULL,
 `freeze_page` BOOLEAN NOT NULL,
 PRIMARY KEY (`page_id`)
);

INSERT INTO `pages`
VALUES ('bAtxxvMLY', 'Philippines', 'Country in South-East Asia.', 0),
       ('K5ktjgIEi', 'Gun', 'To shoot stuff.', '1');