const express = require("express");
const cors = require("cors");
const db = require("./db");


const app = express();
const PORT = 5000;

//server static files from dist
// app.use(express.static(path.join(__dirname, "dist")));

app.use(cors());
app.use(express.json());

app.post("/login", (req, res) => {
    
	const { username, password } = req.body;
    const query = "SELECT * FROM users WHERE username = ?";
    db.query(query, [username], (err, results) => {

		if (err) {
			return res.status(500).json({ message: 'Server error' });
        }

		//USER DOES NOT EXIST:
		if (results.length == 0) {
			return res.status(401).json({ message: 'User not found' });
        }

		//USER EXISTS (FIRST RESULT)
		const user = results[0];

		//PASSWORD IS INCORRECT
		if (user.pass !== password) {
			return res.status(401).json({ message: 'Incorrect password' });
		}

		//SUCCESS
		return res.json({
			message: 'Login successfull!' ,
			username: user.username,
			userid: user.userid
		});
		
	});
});

app.get("/habits/:username", (req, res) => {
	
	const username = req.params.username;

	const query = "SELECT habit, habitid FROM habits JOIN users ON habits.userid = users.userid WHERE users.username = ?";

	db.query(query, [username], (err, results) => { 
		if (err) { 
			console.log(err);
			return res.status(500).json({ message: "Server error" });
		}
		return res.json(results);
	})
});

app.delete("/habits/:id", (req, res) => {

	const habitId = req.params.id;
	const query = "DELETE FROM habits WHERE habits.habitid = ?";

	db.query(query, [habitId], (err, results) => { 
		
		if (err) { 
			return res.status(500).json({ message: 'Error in deleting habit:', err });	
		}
		
		return res.json({ message: 'Habit deleted' });
	});
});

app.put('/habits/:id', (req, res) => {

	const habitId = req.params.id;
	const habit  = req.body;

	if (!habit)
		return res.status(400).json({ message: "Habit must have a name" });
	
	const query = "UPDATE habits SET habit = ? WHERE habitid = ?";

	db.query(query, [habit, habitId], (err, results) => {

		if (err) { 
			return res.status(500).json({ message: "Database update failed" });	
		}

		//Check for affected rows in case the habit doesn't exist
		if (results.affectedRows === 0) { 
			return res.status(404).json({ message: "Habit does not exist" });
		}

		return res.json({ message: "Updated succefully" });

	});
});

app.post('/habits', (req, res) => {

	const username = req.body.username;
	const newHabit = req.body.newHabit;

	// console.log('username received:', username);

	const query = 'INSERT INTO habits(habit, userid) SELECT ?, userid FROM users WHERE username=?';
	db.query(query, [newHabit, username], (err, results) => {

		if (err) {
			return res.status(500).json({ message: "Server error" });
		}

		if (results.affectedRows === 0) {
			return res.status(400).json({ message: 'User not found'});
		}

		return res.json({
			message: "Habit added successfully",
			newHabit: {
				habitid: results.insertId,
				habit: newHabit
			}
		});
	});
}); 

app.post('/habits/completed', (req, res) => {

	const habitId = req.body.habitId;
	const completed = req.body.dateCompleted;

	const query = 'INSERT INTO habits_completed(habitid, date_completed) VALUES (?, ?)';

	db.query(query, [habitId, completed], (err, results) => {
		if (err) {
			return res.status(500).json({ message: 'Server error' });
		}

		if (results.affectedRows === 0) {
			return res.status(400).json({ message: 'Habit not found' });
		}

		return res.json({ message: "Habit updated successfully" });
	});
});

app.delete('/habits/completed/:id/:dateOfCompletion', (req, res) => {

	const habitId = req.params.id;
	const dateCompleted = req.params.dateOfCompletion;

	query = 'DELETE FROM habits_completed WHERE habitid=? AND date_completed=?';

	db.query(query, [habitId, dateCompleted], (err, results) => {
		if (err) {
			return res.status(500).json({ message: 'Server error' });
		}

		if (results.affectedRows === 0) {
			return res.status(400).json({ message: 'Habit not found' });
		}

		return res.json({ message: 'Habit updated successfully' });
	});
});

app.get('/habits/completed/:userid', (req, res) => {
	const userid = req.params.userid;
	const month = req.query.month;
	const year = req.query.year;

	//here we are extracting only the day since it already filters by month and year so we send the day to frontend for map lookup in completed days
	const query = 'SELECT habits_completed.habitid, DAY(habits_completed.date_completed) AS day FROM habits_completed JOIN habits ON habits.habitid = habits_completed.habitid WHERE habits.userid = ? AND YEAR(date_completed) = ? AND MONTH(date_completed) = ?';
	db.query(query, [userid, year, month], (err, results) => {
		if (err) {
			return res.status(500).json({ message: 'Server error' });
		}

		else {
			return res.json(results);
		}
	});
});

app.listen(PORT, () => {
    console.log("Server running on port 5000")
});