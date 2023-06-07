CREATE TABLE user (
    user_id serial PRIMARY KEY,
    username varchar(255),
    pass varchar(255)
)

CREATE TABLE notes(
    note_id serial PRiMARY KEY,
    user_id bigint unsigned, 
    content varchar,
    FOREIGN KEY (user_id)
        references user(user_id)
)

--GRANT ALL PRIVILEGES ON *.* TO 'admin'@'db_notes';