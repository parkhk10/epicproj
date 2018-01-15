// all back-end changes happen here

const express = require('express'); // returns a constructor
const bodyParser = require('body-parser');
const app = express();

const sqlite3 = require('sqlite3').verbose();
const db = new sqlite3.Database('./bite'); // tries to connect to db bite, if there isn't one, create the file and connect to it

app.use(express.static(__dirname+'/public')); //getting the stuff from the public folder
app.use('/node_modules', express.static(__dirname + '/node_modules'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({
  extended: true
}));

app.get('/', function(req, res) { //when you get the / request, respond with the following
	res.sendFile('index.html');
})

app.get('/task', function(req, res) { //what you do when you get a request from a client & response
	db.all("SELECT * FROM task t JOIN step s ON t.id = s.task_id", function(err, tasks) {
		if (err) {
			console.log(err);
			return res.status(500).json({ message: 'could not retrieve tasks' })
		}
		var results = {};
		for (i=0; i<tasks.length; i++) {
			var task = tasks[i];
			if (!(task.task_id in results)) {
				results[task.task_id] = {
					task_id: task.task_id,
					name: task.name,
					deadline: task.deadline,
					done: task.done,
					steps: []
				}
			}
			// add the step
			results[task.task_id].steps.push({id: task.id, step: task.step, in_progress: task.in_progress, done: task.done});
		}
		res.json(results);
	});
})

app.post('/task', function(req, res) {
	const task = req.body;
	db.run('INSERT INTO task(name, deadline, done) VALUES($name, $deadline, 0);', {
		$name: task.name,
		$deadline: task.deadline
	}, function(err) {
		if (err) {
			console.error(err);
			return res.status(500).json({ message: 'Error! Could not create task' });
		} // `Error! Could not create task ${task.name}` back tick not working for some reason :(
		console.log('It worked');
		res.status(200).json(task) // anything not 200 is bad. like 404 page error { message: 'Successfully created new task' }
	});
})

app.post('/task/:id/step', function(req, res) {
	const step = req.body;
	db.run('INSERT INTO step(step, done, task_id, in_progress) VALUES($step, $done, $task_id, $in_progress);', {
		$step: step.name,
		$done: false,
		$task_id: req.params.id,
		$in_progress: false
	}, function(err) {
		if (err) {
			console.error(err);
			return res.status(500).json({ message: 'Error! Could not create step' });
		} // `Error! Could not create task ${task.name}` back tick not working for some reason :(
		console.log('It worked')
		res.status(200).json({ message: 'Successfully created new step' }) // anything not 200 is bad. like 404 page error
	});
})

app.listen(3000, function(){
	console.log('we\'re listening!');
}); //picks what port, "listen" to port 3000, waiting for incoming requset on that port

//
