USE `mydb`;

CREATE PROCEDURE `populate_pages_table`
(
    IN p_N INT
)
BEGIN
    DECLARE i INT;
    DECLARE random_title VARCHAR(32);
    DECLARE random_user VARCHAR(20);
    SET i = 1;
    START TRANSACTION;
    WHILE i <= p_N DO
        SET random_title = CONCAT('Title ', i);
        SET random_user = CONCAT('user', i);
        INSERT INTO `pages` (`page_id`, `page_version`, `username`, `user_id`, `freeze_page`, `current_title`, `title`, `image_url`, `lead`, `body`) 
        VALUES (i, 1, random_user, i, 0, random_title, random_title, '', '{\"time\":1657831754741,\"blocks\":[{\"id\":\"TM_z3YaGF0\",\"type\":\"paragraph\",\"data\":{\"text\":\"Lorem ipsum dolor sit amet, consectetur adipiscing elit. Donec a lacus feugiat ligula placerat placerat. Vivamus massa tortor, tempus quis magna ut, tempus porttitor tortor.\"}}],\"version\":\"2.25.0\"}', '{\"time\":1657831754741,\"blocks\":[],\"version\":\"2.25.0\"}');
        SET i = i + 1;
    END WHILE;
END;

CREATE PROCEDURE `populate_users_table`
(
    IN p_N INT
)
BEGIN
    DECLARE i INT;
    DECLARE random_username VARCHAR(20);
    SET i = 1;
    START TRANSACTION;
    WHILE i <= p_N DO
        SET random_username = CONCAT('user', i);
        INSERT INTO `users` (`username`, `user_id`, `password_hash`, `email`, `role`, `can_edit`) 
        VALUES (random_username, i, 'password', CONCAT('user', i, '@gmail.com'), 'user', 1);
        SET i = i + 1;
    END WHILE;
END;

CREATE PROCEDURE `populate_page_edits_table`
(
    IN p_N INT
)
BEGIN
    DECLARE i INT;
    SET i = 3;
    START TRANSACTION;
    WHILE i <= p_N DO
        INSERT INTO `page_edits` 
        VALUES (i, i, '2022-07-14 07:52:54', CONCAT('Update to version', i), 'xdZWspFv2', 'admin', 'admin', 'JhuMGNgn4', 0, 'Cat', 'Cat', 'https://icatcare.org/app/uploads/2018/07/Thinking-of-getting-a-cat.png', '{\"time\":1657783117639,\"blocks\":[{\"id\":\"poldP-1IgU\",\"type\":\"paragraph\",\"data\":{\"text\":\"&nbsp; The&nbsp;<b>cat</b>&nbsp;(<i>Felis catus</i>) is a&nbsp;<a href=\\\"https://en.wikipedia.org/wiki/Domestication\\\">domestic</a><a href=\\\"https://en.wikipedia.org/wiki/Species\\\">species</a>&nbsp;of small&nbsp;<a href=\\\"https://en.wikipedia.org/wiki/Carnivorous\\\">carnivorous</a><a href=\\\"https://en.wikipedia.org/wiki/Mammal\\\">mammal</a>.<a href=\\\"https://en.wikipedia.org/wiki/Cat#cite_note-Linnaeus1758-1\\\">[1]</a><a href=\\\"https://en.wikipedia.org/wiki/Cat#cite_note-MSW3fc-2\\\">[2]</a>&nbsp;It is the only domesticated species in the family&nbsp;<a href=\\\"https://en.wikipedia.org/wiki/Felidae\\\">Felidae</a>&nbsp;and is often referred to as the&nbsp;<b>domestic cat</b>&nbsp;to distinguish it from the wild members of the family.<a href=\\\"https://en.wikipedia.org/wiki/Cat#cite_note-Clutton-Brock1999-4\\\">[4]</a>&nbsp;A cat can either be a&nbsp;<b>house cat</b>, a&nbsp;<b><a href=\\\"https://en.wikipedia.org/wiki/Farm_cat\\\">farm cat</a></b>&nbsp;or a&nbsp;<b><a href=\\\"https://en.wikipedia.org/wiki/Feral_cat\\\">feral cat</a></b>; the latter ranges freely and avoids human contact.<a href=\\\"https://en.wikipedia.org/wiki/Cat#cite_note-Liberg_al2014-5\\\">[5]</a>&nbsp;Domestic cats are valued by humans for companionship and their ability to kill&nbsp;<a href=\\\"https://en.wikipedia.org/wiki/Rodent\\\">rodents</a>. About 60&nbsp;<a href=\\\"https://en.wikipedia.org/wiki/Cat_breeds\\\">cat breeds</a>&nbsp;are recognized by various&nbsp;<a href=\\\"https://en.wikipedia.org/wiki/Cat_registries\\\">cat registries</a>.<a href=\\\"https://en.wikipedia.org/wiki/Cat#cite_note-Driscoll_al2009-6\\\">[6]</a>\"}}],\"version\":\"2.25.0\"}', '{\"time\":1657783117640,\"blocks\":[{\"id\":\"pO8FTvLflt\",\"type\":\"header\",\"data\":{\"text\":\"Taxonomy\",\"level\":2}},{\"id\":\"Xf38MppkNe\",\"type\":\"paragraph\",\"data\":{\"text\":\"The&nbsp;<a href=\\\"https://en.wikipedia.org/wiki/Scientific_name\\\">scientific name</a>&nbsp;<i>Felis catus</i>&nbsp;was proposed by&nbsp;<a href=\\\"https://en.wikipedia.org/wiki/Carl_Linnaeus\\\">Carl Linnaeus</a>&nbsp;in 1758 for a domestic cat.<a href=\\\"https://en.wikipedia.org/wiki/Cat#cite_note-Linnaeus1758-1\\\">[1]</a><a href=\\\"https://en.wikipedia.org/wiki/Cat#cite_note-MSW3fc-2\\\">[2]</a>&nbsp;<i>Felis catus domesticus</i>&nbsp;was proposed by&nbsp;<a href=\\\"https://en.wikipedia.org/wiki/Johann_Christian_Polycarp_Erxleben\\\">Johann Christian Polycarp Erxleben</a>&nbsp;in 1777.<a href=\\\"https://en.wikipedia.org/wiki/Cat#cite_note-Erxleben-3\\\">[3]</a>&nbsp;<i>Felis daemon</i>&nbsp;proposed by&nbsp;<a href=\\\"https://en.wikipedia.org/wiki/Konstantin_Alekseevich_Satunin\\\">Konstantin Alekseevich Satunin</a>&nbsp;in 1904 was a black cat from the&nbsp;<a href=\\\"https://en.wikipedia.org/wiki/Transcaucasus\\\">Transcaucasus</a>, later identified as a domestic cat.<a href=\\\"https://en.wikipedia.org/wiki/Cat#cite_note-35\\\">[35]</a><a href=\\\"https://en.wikipedia.org/wiki/Cat#cite_note-36\\\">[36]</a>\"}},{\"id\":\"WXIcRwhv90\",\"type\":\"paragraph\",\"data\":{\"text\":\"In 2003, the&nbsp;<a href=\\\"https://en.wikipedia.org/wiki/International_Commission_on_Zoological_Nomenclature\\\">International Commission on Zoological Nomenclature</a>&nbsp;ruled that the domestic cat is a distinct species, namely&nbsp;<i>Felis catus</i>.<a href=\\\"https://en.wikipedia.org/wiki/Cat#cite_note-ICZN-37\\\">[37]</a><a href=\\\"https://en.wikipedia.org/wiki/Cat#cite_note-38\\\">[38]</a>&nbsp;In 2007, it was considered a&nbsp;<a href=\\\"https://en.wikipedia.org/wiki/Subspecies\\\">subspecies</a>,&nbsp;<i>F. silvestris catus</i>, of the&nbsp;<a href=\\\"https://en.wikipedia.org/wiki/European_wildcat\\\">European wildcat</a>&nbsp;(<i>F. silvestris</i>) following results of&nbsp;<a href=\\\"https://en.wikipedia.org/wiki/Phylogenetic\\\">phylogenetic</a>&nbsp;research.<a href=\\\"https://en.wikipedia.org/wiki/Cat#cite_note-Driscoll-39\\\">[39]</a><a href=\\\"https://en.wikipedia.org/wiki/Cat#cite_note-MSW3fs-40\\\">[40]</a>&nbsp;In 2017, the IUCN Cat Classification Taskforce followed the recommendation of the ICZN in regarding the domestic cat as a distinct species,&nbsp;<i>Felis catus</i>.<a href=\\\"https://en.wikipedia.org/wiki/Cat#cite_note-41\\\">[41]</a>\"}}],\"version\":\"2.25.0\"}');
        SET i = i + 1;
    END WHILE;
END;

INSERT INTO `users`
VALUES ('xdZWspFv2', 'admin', '$2b$10$qBIq2TyD/Il//nJw8s1tU.q.oKjXmTKOVSsmUqe8PO8xBq1SDkvQq', 'admin@gmail.com', 'admin', 1),
       ('L_254KKf5', 'max', '$2b$10$wTuS0iRGlqYUTJ9AxEkV4u3Upn35hJz4JJo29KnLhWReBg0yWzyLW', 'max@gmail.com', 'user', 1),
       ('30CRduVQm', 'jules', '$2b$10$nNAsmxviXW8PFNA4Av2UWOKyS1Ycy9MULDgYPlsi9Irp5BZwoTPba', 'jules@gmail.com', 'user', '1');

INSERT INTO `pages`
VALUES ('JhuMGNgn4', '100000', '2022-07-14 07:52:54', 'max', 'L_254KKf5', '0', 'Cat', 'Cat', 'https://icatcare.org/app/uploads/2018/07/Thinking-of-getting-a-cat.png', '{\"time\":1657783117639,\"blocks\":[{\"id\":\"poldP-1IgU\",\"type\":\"paragraph\",\"data\":{\"text\":\"&nbsp; The&nbsp;<b>cat</b>&nbsp;(<i>Felis catus</i>) is a&nbsp;<a href=\\\"https://en.wikipedia.org/wiki/Domestication\\\">domestic</a><a href=\\\"https://en.wikipedia.org/wiki/Species\\\">species</a>&nbsp;of small&nbsp;<a href=\\\"https://en.wikipedia.org/wiki/Carnivorous\\\">carnivorous</a><a href=\\\"https://en.wikipedia.org/wiki/Mammal\\\">mammal</a>.<a href=\\\"https://en.wikipedia.org/wiki/Cat#cite_note-Linnaeus1758-1\\\">[1]</a><a href=\\\"https://en.wikipedia.org/wiki/Cat#cite_note-MSW3fc-2\\\">[2]</a>&nbsp;It is the only domesticated species in the family&nbsp;<a href=\\\"https://en.wikipedia.org/wiki/Felidae\\\">Felidae</a>&nbsp;and is often referred to as the&nbsp;<b>domestic cat</b>&nbsp;to distinguish it from the wild members of the family.<a href=\\\"https://en.wikipedia.org/wiki/Cat#cite_note-Clutton-Brock1999-4\\\">[4]</a>&nbsp;A cat can either be a&nbsp;<b>house cat</b>, a&nbsp;<b><a href=\\\"https://en.wikipedia.org/wiki/Farm_cat\\\">farm cat</a></b>&nbsp;or a&nbsp;<b><a href=\\\"https://en.wikipedia.org/wiki/Feral_cat\\\">feral cat</a></b>; the latter ranges freely and avoids human contact.<a href=\\\"https://en.wikipedia.org/wiki/Cat#cite_note-Liberg_al2014-5\\\">[5]</a>&nbsp;Domestic cats are valued by humans for companionship and their ability to kill&nbsp;<a href=\\\"https://en.wikipedia.org/wiki/Rodent\\\">rodents</a>. About 60&nbsp;<a href=\\\"https://en.wikipedia.org/wiki/Cat_breeds\\\">cat breeds</a>&nbsp;are recognized by various&nbsp;<a href=\\\"https://en.wikipedia.org/wiki/Cat_registries\\\">cat registries</a>.<a href=\\\"https://en.wikipedia.org/wiki/Cat#cite_note-Driscoll_al2009-6\\\">[6]</a>\"}}],\"version\":\"2.25.0\"}', '{\"time\":1657783117640,\"blocks\":[{\"id\":\"pO8FTvLflt\",\"type\":\"header\",\"data\":{\"text\":\"Taxonomy\",\"level\":2}},{\"id\":\"Xf38MppkNe\",\"type\":\"paragraph\",\"data\":{\"text\":\"The&nbsp;<a href=\\\"https://en.wikipedia.org/wiki/Scientific_name\\\">scientific name</a>&nbsp;<i>Felis catus</i>&nbsp;was proposed by&nbsp;<a href=\\\"https://en.wikipedia.org/wiki/Carl_Linnaeus\\\">Carl Linnaeus</a>&nbsp;in 1758 for a domestic cat.<a href=\\\"https://en.wikipedia.org/wiki/Cat#cite_note-Linnaeus1758-1\\\">[1]</a><a href=\\\"https://en.wikipedia.org/wiki/Cat#cite_note-MSW3fc-2\\\">[2]</a>&nbsp;<i>Felis catus domesticus</i>&nbsp;was proposed by&nbsp;<a href=\\\"https://en.wikipedia.org/wiki/Johann_Christian_Polycarp_Erxleben\\\">Johann Christian Polycarp Erxleben</a>&nbsp;in 1777.<a href=\\\"https://en.wikipedia.org/wiki/Cat#cite_note-Erxleben-3\\\">[3]</a>&nbsp;<i>Felis daemon</i>&nbsp;proposed by&nbsp;<a href=\\\"https://en.wikipedia.org/wiki/Konstantin_Alekseevich_Satunin\\\">Konstantin Alekseevich Satunin</a>&nbsp;in 1904 was a black cat from the&nbsp;<a href=\\\"https://en.wikipedia.org/wiki/Transcaucasus\\\">Transcaucasus</a>, later identified as a domestic cat.<a href=\\\"https://en.wikipedia.org/wiki/Cat#cite_note-35\\\">[35]</a><a href=\\\"https://en.wikipedia.org/wiki/Cat#cite_note-36\\\">[36]</a>\"}},{\"id\":\"WXIcRwhv90\",\"type\":\"paragraph\",\"data\":{\"text\":\"In 2003, the&nbsp;<a href=\\\"https://en.wikipedia.org/wiki/International_Commission_on_Zoological_Nomenclature\\\">International Commission on Zoological Nomenclature</a>&nbsp;ruled that the domestic cat is a distinct species, namely&nbsp;<i>Felis catus</i>.<a href=\\\"https://en.wikipedia.org/wiki/Cat#cite_note-ICZN-37\\\">[37]</a><a href=\\\"https://en.wikipedia.org/wiki/Cat#cite_note-38\\\">[38]</a>&nbsp;In 2007, it was considered a&nbsp;<a href=\\\"https://en.wikipedia.org/wiki/Subspecies\\\">subspecies</a>,&nbsp;<i>F. silvestris catus</i>, of the&nbsp;<a href=\\\"https://en.wikipedia.org/wiki/European_wildcat\\\">European wildcat</a>&nbsp;(<i>F. silvestris</i>) following results of&nbsp;<a href=\\\"https://en.wikipedia.org/wiki/Phylogenetic\\\">phylogenetic</a>&nbsp;research.<a href=\\\"https://en.wikipedia.org/wiki/Cat#cite_note-Driscoll-39\\\">[39]</a><a href=\\\"https://en.wikipedia.org/wiki/Cat#cite_note-MSW3fs-40\\\">[40]</a>&nbsp;In 2017, the IUCN Cat Classification Taskforce followed the recommendation of the ICZN in regarding the domestic cat as a distinct species,&nbsp;<i>Felis catus</i>.<a href=\\\"https://en.wikipedia.org/wiki/Cat#cite_note-41\\\">[41]</a>\"}}],\"version\":\"2.25.0\"}'),
       ('s7C7EMw4z', '1', '2022-07-14 08:43:41', 'jules', '30CRduVQm', '0', 'Vacation', 'Vacation', 'https://upload.wikimedia.org/wikipedia/commons/thumb/6/6f/Joss_Bay%2C_Broadstairs%2C_England_-_Aug_2008.jpg/1920px-Joss_Bay%2C_Broadstairs%2C_England_-_Aug_2008.jpg', '{\"time\":1657788221461,\"blocks\":[{\"id\":\"eSZTKUVyQ_\",\"type\":\"paragraph\",\"data\":{\"text\":\"&nbsp; A&nbsp;<b>vacation</b>&nbsp;(<a href=\\\"https://en.wikipedia.org/wiki/American_English\\\">American English</a>) or&nbsp;<b>holiday</b>&nbsp;(<a href=\\\"https://en.wikipedia.org/wiki/British_English\\\">British English</a>) is either a&nbsp;<a href=\\\"https://en.wikipedia.org/wiki/Leave_of_absence\\\">leave of absence</a>&nbsp;from a regular job or an instance of leisure travel away from home. People often take a vacation during specific&nbsp;<a href=\\\"https://en.wikipedia.org/wiki/Holiday\\\">holiday</a>&nbsp;observances or for specific&nbsp;<a href=\\\"https://en.wikipedia.org/wiki/Festival\\\">festivals</a>&nbsp;or celebrations. Vacations are often spent with&nbsp;<a href=\\\"https://en.wikipedia.org/wiki/Friendship\\\">friends</a>&nbsp;or&nbsp;<a href=\\\"https://en.wikipedia.org/wiki/Family\\\">family</a>.<a href=\\\"https://en.wikipedia.org/wiki/Vacation#cite_note-1\\\">[1]</a>&nbsp;Vacations may include a specific trip or journey, usually for the purpose of&nbsp;<a href=\\\"https://en.wikipedia.org/wiki/Recreation\\\">recreation</a>&nbsp;or&nbsp;<a href=\\\"https://en.wikipedia.org/wiki/Tourism\\\">tourism</a>.&nbsp;&nbsp;\"}}],\"version\":\"2.25.0\"}', '{\"time\":1657788221462,\"blocks\":[{\"id\":\"qwtSNtYn31\",\"type\":\"header\",\"data\":{\"text\":\"Etymology\",\"level\":2}},{\"id\":\"q9OHPKfvau\",\"type\":\"paragraph\",\"data\":{\"text\":\"&nbsp; In the&nbsp;<a href=\\\"https://en.wikipedia.org/wiki/United_Kingdom\\\">United Kingdom</a>,&nbsp;<i>vacation</i>&nbsp;once specifically referred to the long summer break taken by the&nbsp;<a href=\\\"https://en.wikipedia.org/wiki/Court\\\">law courts</a>&nbsp;and then later the term was applied to universities.<a href=\\\"https://en.wikipedia.org/wiki/Vacation#cite_note-3\\\">[3]</a>&nbsp;The custom was introduced by&nbsp;<a href=\\\"https://en.wikipedia.org/wiki/William_the_Conqueror\\\">William the Conqueror</a>&nbsp;from&nbsp;<a href=\\\"https://en.wikipedia.org/wiki/Normandy\\\">Normandy</a>&nbsp;where it facilitated the grape harvest. In the past, many&nbsp;<a href=\\\"https://en.wikipedia.org/wiki/Upper-class\\\">upper-class</a>&nbsp;families moved to a&nbsp;<a href=\\\"https://en.wikipedia.org/wiki/Summer_home\\\">summer home</a>&nbsp;for part of the year, leaving their usual home vacant.\"}},{\"id\":\"X6L30euGLA\",\"type\":\"header\",\"data\":{\"text\":\"Family vacation\",\"level\":2}},{\"id\":\"0179wY_YUY\",\"type\":\"paragraph\",\"data\":{\"text\":\"&nbsp; Family vacation refers to recreation taken together by the family. Family vacation can be ritual—for example, annually around the same time—or it can be a one-time event. It can involve travel to a far-flung spot or, for families on a tight budget, a stay-at-home staycation.<a href=\\\"https://en.wikipedia.org/wiki/Vacation#cite_note-4\\\">[4]</a>&nbsp;Some examples of favorite family vacations might include family cruises, trips to popular theme parks, ski vacations, beach vacations, food vacations<a href=\\\"https://en.wikipedia.org/wiki/Vacation#cite_note-5\\\">[5]</a>&nbsp;or similar types of family trips.\"}},{\"id\":\"-QU7osTVFy\",\"type\":\"header\",\"data\":{\"text\":\"Vacation research\",\"level\":2}},{\"id\":\"XQKmwwfPYk\",\"type\":\"paragraph\",\"data\":{\"text\":\"&nbsp; Research on the effects of vacations on health, well-being and work performance started in the 1990s. The first meta-analysis on the effects of vacations was published in 2009.<a href=\\\"https://en.wikipedia.org/wiki/Vacation#cite_note-6\\\">[6]</a>&nbsp;It showed that thus far only 7 studies had been conducted which investigated the effects of vacationing on health and well-being of employees. A literature review on the health and wellness benefits of travel experiences revealed beneficial effects of vacationing.<a href=\\\"https://en.wikipedia.org/wiki/Vacation#cite_note-7\\\">[7]</a>\"}}],\"version\":\"2.25.0\"}');

INSERT INTO `page_edits`
VALUES ('NZIDmIVWn', '1', '2022-07-14 07:18:37', 'First article edit.', 'xdZWspFv2', 'admin', 'admin', 'JhuMGNgn4', '0', 'Cat', 'Cat', 'https://upload.wikimedia.org/wikipedia/commons/0/0b/Cat_poster_1.jpg', '{\"time\":1657783117639,\"blocks\":[{\"id\":\"poldP-1IgU\",\"type\":\"paragraph\",\"data\":{\"text\":\"&nbsp; The&nbsp;<b>cat</b>&nbsp;(<i>Felis catus</i>) is a&nbsp;<a href=\\\"https://en.wikipedia.org/wiki/Domestication\\\">domestic</a><a href=\\\"https://en.wikipedia.org/wiki/Species\\\">species</a>&nbsp;of small&nbsp;<a href=\\\"https://en.wikipedia.org/wiki/Carnivorous\\\">carnivorous</a><a href=\\\"https://en.wikipedia.org/wiki/Mammal\\\">mammal</a>.<a href=\\\"https://en.wikipedia.org/wiki/Cat#cite_note-Linnaeus1758-1\\\">[1]</a><a href=\\\"https://en.wikipedia.org/wiki/Cat#cite_note-MSW3fc-2\\\">[2]</a>&nbsp;It is the only domesticated species in the family&nbsp;<a href=\\\"https://en.wikipedia.org/wiki/Felidae\\\">Felidae</a>&nbsp;and is often referred to as the&nbsp;<b>domestic cat</b>&nbsp;to distinguish it from the wild members of the family.<a href=\\\"https://en.wikipedia.org/wiki/Cat#cite_note-Clutton-Brock1999-4\\\">[4]</a>&nbsp;A cat can either be a&nbsp;<b>house cat</b>, a&nbsp;<b><a href=\\\"https://en.wikipedia.org/wiki/Farm_cat\\\">farm cat</a></b>&nbsp;or a&nbsp;<b><a href=\\\"https://en.wikipedia.org/wiki/Feral_cat\\\">feral cat</a></b>; the latter ranges freely and avoids human contact.<a href=\\\"https://en.wikipedia.org/wiki/Cat#cite_note-Liberg_al2014-5\\\">[5]</a>&nbsp;Domestic cats are valued by humans for companionship and their ability to kill&nbsp;<a href=\\\"https://en.wikipedia.org/wiki/Rodent\\\">rodents</a>. About 60&nbsp;<a href=\\\"https://en.wikipedia.org/wiki/Cat_breeds\\\">cat breeds</a>&nbsp;are recognized by various&nbsp;<a href=\\\"https://en.wikipedia.org/wiki/Cat_registries\\\">cat registries</a>.<a href=\\\"https://en.wikipedia.org/wiki/Cat#cite_note-Driscoll_al2009-6\\\">[6]</a>\"}}],\"version\":\"2.25.0\"}', '{\"time\":1657783117640,\"blocks\":[{\"id\":\"pO8FTvLflt\",\"type\":\"header\",\"data\":{\"text\":\"Taxonomy\",\"level\":2}},{\"id\":\"Xf38MppkNe\",\"type\":\"paragraph\",\"data\":{\"text\":\"The&nbsp;<a href=\\\"https://en.wikipedia.org/wiki/Scientific_name\\\">scientific name</a>&nbsp;<i>Felis catus</i>&nbsp;was proposed by&nbsp;<a href=\\\"https://en.wikipedia.org/wiki/Carl_Linnaeus\\\">Carl Linnaeus</a>&nbsp;in 1758 for a domestic cat.<a href=\\\"https://en.wikipedia.org/wiki/Cat#cite_note-Linnaeus1758-1\\\">[1]</a><a href=\\\"https://en.wikipedia.org/wiki/Cat#cite_note-MSW3fc-2\\\">[2]</a>&nbsp;<i>Felis catus domesticus</i>&nbsp;was proposed by&nbsp;<a href=\\\"https://en.wikipedia.org/wiki/Johann_Christian_Polycarp_Erxleben\\\">Johann Christian Polycarp Erxleben</a>&nbsp;in 1777.<a href=\\\"https://en.wikipedia.org/wiki/Cat#cite_note-Erxleben-3\\\">[3]</a>&nbsp;<i>Felis daemon</i>&nbsp;proposed by&nbsp;<a href=\\\"https://en.wikipedia.org/wiki/Konstantin_Alekseevich_Satunin\\\">Konstantin Alekseevich Satunin</a>&nbsp;in 1904 was a black cat from the&nbsp;<a href=\\\"https://en.wikipedia.org/wiki/Transcaucasus\\\">Transcaucasus</a>, later identified as a domestic cat.<a href=\\\"https://en.wikipedia.org/wiki/Cat#cite_note-35\\\">[35]</a><a href=\\\"https://en.wikipedia.org/wiki/Cat#cite_note-36\\\">[36]</a>\"}},{\"id\":\"WXIcRwhv90\",\"type\":\"paragraph\",\"data\":{\"text\":\"In 2003, the&nbsp;<a href=\\\"https://en.wikipedia.org/wiki/International_Commission_on_Zoological_Nomenclature\\\">International Commission on Zoological Nomenclature</a>&nbsp;ruled that the domestic cat is a distinct species, namely&nbsp;<i>Felis catus</i>.<a href=\\\"https://en.wikipedia.org/wiki/Cat#cite_note-ICZN-37\\\">[37]</a><a href=\\\"https://en.wikipedia.org/wiki/Cat#cite_note-38\\\">[38]</a>&nbsp;In 2007, it was considered a&nbsp;<a href=\\\"https://en.wikipedia.org/wiki/Subspecies\\\">subspecies</a>,&nbsp;<i>F. silvestris catus</i>, of the&nbsp;<a href=\\\"https://en.wikipedia.org/wiki/European_wildcat\\\">European wildcat</a>&nbsp;(<i>F. silvestris</i>) following results of&nbsp;<a href=\\\"https://en.wikipedia.org/wiki/Phylogenetic\\\">phylogenetic</a>&nbsp;research.<a href=\\\"https://en.wikipedia.org/wiki/Cat#cite_note-Driscoll-39\\\">[39]</a><a href=\\\"https://en.wikipedia.org/wiki/Cat#cite_note-MSW3fs-40\\\">[40]</a>&nbsp;In 2017, the IUCN Cat Classification Taskforce followed the recommendation of the ICZN in regarding the domestic cat as a distinct species,&nbsp;<i>Felis catus</i>.<a href=\\\"https://en.wikipedia.org/wiki/Cat#cite_note-41\\\">[41]</a>\"}}],\"version\":\"2.25.0\"}'),
       ('JdIbvgNPx', '2', '2022-07-14 07:52:54', 'Change image.', 'L_254KKf5', 'max', 'user', 'JhuMGNgn4', '0', 'Cat', 'Cat', 'https://icatcare.org/app/uploads/2018/07/Thinking-of-getting-a-cat.png', '{\"time\":1657785174654,\"blocks\":[{\"id\":\"poldP-1IgU\",\"type\":\"paragraph\",\"data\":{\"text\":\"&nbsp; The&nbsp;<b>cat</b>&nbsp;(<i>Felis catus</i>) is a&nbsp;<a href=\\\"https://en.wikipedia.org/wiki/Domestication\\\">domestic</a><a href=\\\"https://en.wikipedia.org/wiki/Species\\\">species</a>&nbsp;of small&nbsp;<a href=\\\"https://en.wikipedia.org/wiki/Carnivorous\\\">carnivorous</a><a href=\\\"https://en.wikipedia.org/wiki/Mammal\\\">mammal</a>.<a href=\\\"https://en.wikipedia.org/wiki/Cat#cite_note-Linnaeus1758-1\\\">[1]</a><a href=\\\"https://en.wikipedia.org/wiki/Cat#cite_note-MSW3fc-2\\\">[2]</a>&nbsp;It is the only domesticated species in the family&nbsp;<a href=\\\"https://en.wikipedia.org/wiki/Felidae\\\">Felidae</a>&nbsp;and is often referred to as the&nbsp;<b>domestic cat</b>&nbsp;to distinguish it from the wild members of the family.<a href=\\\"https://en.wikipedia.org/wiki/Cat#cite_note-Clutton-Brock1999-4\\\">[4]</a>&nbsp;A cat can either be a&nbsp;<b>house cat</b>, a&nbsp;<b><a href=\\\"https://en.wikipedia.org/wiki/Farm_cat\\\">farm cat</a></b>&nbsp;or a&nbsp;<b><a href=\\\"https://en.wikipedia.org/wiki/Feral_cat\\\">feral cat</a></b>; the latter ranges freely and avoids human contact.<a href=\\\"https://en.wikipedia.org/wiki/Cat#cite_note-Liberg_al2014-5\\\">[5]</a>&nbsp;Domestic cats are valued by humans for companionship and their ability to kill&nbsp;<a href=\\\"https://en.wikipedia.org/wiki/Rodent\\\">rodents</a>. About 60&nbsp;<a href=\\\"https://en.wikipedia.org/wiki/Cat_breeds\\\">cat breeds</a>&nbsp;are recognized by various&nbsp;<a href=\\\"https://en.wikipedia.org/wiki/Cat_registries\\\">cat registries</a>.<a href=\\\"https://en.wikipedia.org/wiki/Cat#cite_note-Driscoll_al2009-6\\\">[6]</a>\"}}],\"version\":\"2.25.0\"}', '{\"time\":1657785174655,\"blocks\":[{\"id\":\"pO8FTvLflt\",\"type\":\"header\",\"data\":{\"text\":\"Taxonomy\",\"level\":2}},{\"id\":\"Xf38MppkNe\",\"type\":\"paragraph\",\"data\":{\"text\":\"The&nbsp;<a href=\\\"https://en.wikipedia.org/wiki/Scientific_name\\\">scientific name</a>&nbsp;<i>Felis catus</i>&nbsp;was proposed by&nbsp;<a href=\\\"https://en.wikipedia.org/wiki/Carl_Linnaeus\\\">Carl Linnaeus</a>&nbsp;in 1758 for a domestic cat.<a href=\\\"https://en.wikipedia.org/wiki/Cat#cite_note-Linnaeus1758-1\\\">[1]</a><a href=\\\"https://en.wikipedia.org/wiki/Cat#cite_note-MSW3fc-2\\\">[2]</a>&nbsp;<i>Felis catus domesticus</i>&nbsp;was proposed by&nbsp;<a href=\\\"https://en.wikipedia.org/wiki/Johann_Christian_Polycarp_Erxleben\\\">Johann Christian Polycarp Erxleben</a>&nbsp;in 1777.<a href=\\\"https://en.wikipedia.org/wiki/Cat#cite_note-Erxleben-3\\\">[3]</a>&nbsp;<i>Felis daemon</i>&nbsp;proposed by&nbsp;<a href=\\\"https://en.wikipedia.org/wiki/Konstantin_Alekseevich_Satunin\\\">Konstantin Alekseevich Satunin</a>&nbsp;in 1904 was a black cat from the&nbsp;<a href=\\\"https://en.wikipedia.org/wiki/Transcaucasus\\\">Transcaucasus</a>, later identified as a domestic cat.<a href=\\\"https://en.wikipedia.org/wiki/Cat#cite_note-35\\\">[35]</a><a href=\\\"https://en.wikipedia.org/wiki/Cat#cite_note-36\\\">[36]</a>\"}},{\"id\":\"WXIcRwhv90\",\"type\":\"paragraph\",\"data\":{\"text\":\"In 2003, the&nbsp;<a href=\\\"https://en.wikipedia.org/wiki/International_Commission_on_Zoological_Nomenclature\\\">International Commission on Zoological Nomenclature</a>&nbsp;ruled that the domestic cat is a distinct species, namely&nbsp;<i>Felis catus</i>.<a href=\\\"https://en.wikipedia.org/wiki/Cat#cite_note-ICZN-37\\\">[37]</a><a href=\\\"https://en.wikipedia.org/wiki/Cat#cite_note-38\\\">[38]</a>&nbsp;In 2007, it was considered a&nbsp;<a href=\\\"https://en.wikipedia.org/wiki/Subspecies\\\">subspecies</a>,&nbsp;<i>F. silvestris catus</i>, of the&nbsp;<a href=\\\"https://en.wikipedia.org/wiki/European_wildcat\\\">European wildcat</a>&nbsp;(<i>F. silvestris</i>) following results of&nbsp;<a href=\\\"https://en.wikipedia.org/wiki/Phylogenetic\\\">phylogenetic</a>&nbsp;research.<a href=\\\"https://en.wikipedia.org/wiki/Cat#cite_note-Driscoll-39\\\">[39]</a><a href=\\\"https://en.wikipedia.org/wiki/Cat#cite_note-MSW3fs-40\\\">[40]</a>&nbsp;In 2017, the IUCN Cat Classification Taskforce followed the recommendation of the ICZN in regarding the domestic cat as a distinct species,&nbsp;<i>Felis catus</i>.<a href=\\\"https://en.wikipedia.org/wiki/Cat#cite_note-41\\\">[41]</a>\"}}],\"version\":\"2.25.0\"}'),
       ('NcNU1FZ1l', '1', '2022-07-14 08:43:41', 'First article edit.', '30CRduVQm', 'jules', 'user', 's7C7EMw4z', '0', 'Vacation', 'Vacation', 'https://upload.wikimedia.org/wikipedia/commons/thumb/6/6f/Joss_Bay%2C_Broadstairs%2C_England_-_Aug_2008.jpg/1920px-Joss_Bay%2C_Broadstairs%2C_England_-_Aug_2008.jpg', '{\"time\":1657788221461,\"blocks\":[{\"id\":\"eSZTKUVyQ_\",\"type\":\"paragraph\",\"data\":{\"text\":\"&nbsp; A&nbsp;<b>vacation</b>&nbsp;(<a href=\\\"https://en.wikipedia.org/wiki/American_English\\\">American English</a>) or&nbsp;<b>holiday</b>&nbsp;(<a href=\\\"https://en.wikipedia.org/wiki/British_English\\\">British English</a>) is either a&nbsp;<a href=\\\"https://en.wikipedia.org/wiki/Leave_of_absence\\\">leave of absence</a>&nbsp;from a regular job or an instance of leisure travel away from home. People often take a vacation during specific&nbsp;<a href=\\\"https://en.wikipedia.org/wiki/Holiday\\\">holiday</a>&nbsp;observances or for specific&nbsp;<a href=\\\"https://en.wikipedia.org/wiki/Festival\\\">festivals</a>&nbsp;or celebrations. Vacations are often spent with&nbsp;<a href=\\\"https://en.wikipedia.org/wiki/Friendship\\\">friends</a>&nbsp;or&nbsp;<a href=\\\"https://en.wikipedia.org/wiki/Family\\\">family</a>.<a href=\\\"https://en.wikipedia.org/wiki/Vacation#cite_note-1\\\">[1]</a>&nbsp;Vacations may include a specific trip or journey, usually for the purpose of&nbsp;<a href=\\\"https://en.wikipedia.org/wiki/Recreation\\\">recreation</a>&nbsp;or&nbsp;<a href=\\\"https://en.wikipedia.org/wiki/Tourism\\\">tourism</a>.&nbsp;&nbsp;\"}}],\"version\":\"2.25.0\"}', '{\"time\":1657788221462,\"blocks\":[{\"id\":\"qwtSNtYn31\",\"type\":\"header\",\"data\":{\"text\":\"Etymology\",\"level\":2}},{\"id\":\"q9OHPKfvau\",\"type\":\"paragraph\",\"data\":{\"text\":\"&nbsp; In the&nbsp;<a href=\\\"https://en.wikipedia.org/wiki/United_Kingdom\\\">United Kingdom</a>,&nbsp;<i>vacation</i>&nbsp;once specifically referred to the long summer break taken by the&nbsp;<a href=\\\"https://en.wikipedia.org/wiki/Court\\\">law courts</a>&nbsp;and then later the term was applied to universities.<a href=\\\"https://en.wikipedia.org/wiki/Vacation#cite_note-3\\\">[3]</a>&nbsp;The custom was introduced by&nbsp;<a href=\\\"https://en.wikipedia.org/wiki/William_the_Conqueror\\\">William the Conqueror</a>&nbsp;from&nbsp;<a href=\\\"https://en.wikipedia.org/wiki/Normandy\\\">Normandy</a>&nbsp;where it facilitated the grape harvest. In the past, many&nbsp;<a href=\\\"https://en.wikipedia.org/wiki/Upper-class\\\">upper-class</a>&nbsp;families moved to a&nbsp;<a href=\\\"https://en.wikipedia.org/wiki/Summer_home\\\">summer home</a>&nbsp;for part of the year, leaving their usual home vacant.\"}},{\"id\":\"X6L30euGLA\",\"type\":\"header\",\"data\":{\"text\":\"Family vacation\",\"level\":2}},{\"id\":\"0179wY_YUY\",\"type\":\"paragraph\",\"data\":{\"text\":\"&nbsp; Family vacation refers to recreation taken together by the family. Family vacation can be ritual—for example, annually around the same time—or it can be a one-time event. It can involve travel to a far-flung spot or, for families on a tight budget, a stay-at-home staycation.<a href=\\\"https://en.wikipedia.org/wiki/Vacation#cite_note-4\\\">[4]</a>&nbsp;Some examples of favorite family vacations might include family cruises, trips to popular theme parks, ski vacations, beach vacations, food vacations<a href=\\\"https://en.wikipedia.org/wiki/Vacation#cite_note-5\\\">[5]</a>&nbsp;or similar types of family trips.\"}},{\"id\":\"-QU7osTVFy\",\"type\":\"header\",\"data\":{\"text\":\"Vacation research\",\"level\":2}},{\"id\":\"XQKmwwfPYk\",\"type\":\"paragraph\",\"data\":{\"text\":\"&nbsp; Research on the effects of vacations on health, well-being and work performance started in the 1990s. The first meta-analysis on the effects of vacations was published in 2009.<a href=\\\"https://en.wikipedia.org/wiki/Vacation#cite_note-6\\\">[6]</a>&nbsp;It showed that thus far only 7 studies had been conducted which investigated the effects of vacationing on health and well-being of employees. A literature review on the health and wellness benefits of travel experiences revealed beneficial effects of vacationing.<a href=\\\"https://en.wikipedia.org/wiki/Vacation#cite_note-7\\\">[7]</a>\"}}],\"version\":\"2.25.0\"}');

CALL populate_users_table(100000);
CALL populate_pages_table(100000);
CALL populate_page_edits_table(100000);