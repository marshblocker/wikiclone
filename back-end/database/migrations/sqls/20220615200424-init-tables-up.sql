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
       ('dNyUCv4an', 'alien', 'F9965239005F50B3EEE8D3C472B9ECF014EA8588', 'alien@gmail.com', 'user', 1),
       ('HmPoFyj3y', 'cloud', '000E793DB70C59309FA6F0F36D0046D110F3BE3C', 'cloud@gmail.com', 'user', 1),
       ('7toCz2QqA', 'prime', 'EA756C3AD19A39CFCC25922FF018BA8F797C88C3', 'prime@gmail.com', 'superadmin', 1);

CREATE TABLE `pages` (
 `page_id` CHAR(9) NOT NULL UNIQUE,
 `title` VARCHAR(32) NOT NULL UNIQUE,
 `image_url` VARCHAR(2048),
 `lead` TEXT NOT NULL,
 `body` TEXT NOT NULL,
 `freeze_page` BOOLEAN NOT NULL,
 PRIMARY KEY (`page_id`)
);

-- INSERT INTO `pages`
-- VALUES ('bAtxxvMLY', 'Philippines', 'Country in South-East Asia.', 0),
--        ('K5ktjgIEi', 'Gun', 'To shoot stuff.', '0'),
--        ('iW0M66d6V', 'Star', 'Made of gas.', '1'),
--        ('Mhjsq3Col', 'Boomerang', 'It returns!', '1'),
--        ('ndOI20J82', 'Zebra', 'A black-striped animal.', '1');