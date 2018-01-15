const sqlite3 = require('sqlite3').verbose();
const db = new sqlite3.Database('./bite');

db.all("SELECT * FROM step", function(err, rows) {
	if (err) {
		throw new Error(err);
	}
	console.log(rows)
}); // name of col type, repeat; types

db.close();
