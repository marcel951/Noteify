CREATE TABLE users (
    user_id serial PRIMARY KEY,
    username varchar(255),
    email varchar(255),
    pass varchar(255)
);

CREATE TABLE notes (
    note_id UUID PRIMARY KEY,
    user_id BIGINT UNSIGNED,
    isPrivate BOOLEAN,
    content TEXT,
    titel VARCHAR(50),
    youtube VARCHAR(100),
    created DATETIME,
    lastChanged DATETIME,
    FOREIGN KEY (user_id) REFERENCES `users` (user_id)
);

--GRANT ALL PRIVILEGES ON *.* TO 'admin'@'db_notes';