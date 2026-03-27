USE habitstracker;

CREATE TABLE users(userid INT PRIMARY KEY auto_increment, username VARCHAR(40) NOT NULL UNIQUE, pass varchar(255), acc_created DATETIME DEFAULT CURRENT_TIMESTAMP);

CREATE TABLE habits(habitid INT PRIMARY KEY auto_increment, habit VARCHAR(30) NOT NULL, userid INT NOT NULL, FOREIGN KEY(userid) REFERENCES users(userid) ON DELETE CASCADE);

CREATE TABLE habits_completed(completedid INT PRIMARY KEY auto_increment, habitid INT NOT NULL, date_completed DATE NOT NULL, UNIQUE(habitid, date_completed),FOREIGN KEY(habitid) REFERENCES habits(habitid) ON DELETE CASCADE);

-- INSERT INTO users(username, pass, acc_created) VALUES("test", "test", NOW());

DESCRIBE users;
DESCRIBE habits;
DESCRIBE habits_completed;


INSERT INTO users(username, pass, acc_created) VALUES("test", "test", NOW());

SELECT id, habit FROM habits JOIN users ON habits.userid = users.userid WHERE users.username = 'test';



SELECT users.username, habits.habit, habits_completed.date_completed FROM habits_completed JOIN habits ON habits_completed.habitid = habits.habitid JOIN users ON habits.userid = users.userid;

SET FOREIGN_KEY_CHECKS = 1;
DROP TABLE habits_completed;

--@block