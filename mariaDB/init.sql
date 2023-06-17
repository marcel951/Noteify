CREATE TABLE users (
    user_id serial PRIMARY KEY,
    username varchar(255),
    email varchar(255),
    pass varchar(255)
);

CREATE TABLE notes (
    note_id BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
    user_id BIGINT UNSIGNED,
    isPrivate BOOLEAN,
    content VARCHAR(255),
    titel VARCHAR(50),
    FOREIGN KEY (user_id) REFERENCES `users` (user_id)
);

--GRANT ALL PRIVILEGES ON *.* TO 'admin'@'db_notes';