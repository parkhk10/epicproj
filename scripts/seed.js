// creating a table called "task" and a table called "step" (unjoined). Joined table is called "tasks."
const sqlite3 = require('sqlite3').verbose();
const db = new sqlite3.Database('./bite');

db.run("CREATE TABLE task (id INTEGER PRIMARY KEY AUTOINCREMENT, name TEXT, deadline TEXT, done BOOLEAN)", function(err) {
	if (err) {
		throw new Error(err);
	}
	console.log('Success!')
}); // name of col type, repeat; types
db.run(`
	CREATE TABLE step (
		id INTEGER PRIMARY KEY AUTOINCREMENT,
		step TEXT,
		done BOOLEAN,
		task_id INT,
		in_progress BOOLEAN,
		FOREIGN KEY(task_id) REFERENCES task(id)
	)
`) // step is a weak entity aka it cannot exist without its parent entity which is steps

db.close();
