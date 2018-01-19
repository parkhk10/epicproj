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
	db.all("SELECT t.id as task_id, name, deadline, t.done as task_done, s.id as step_id, step, in_progress, s.done as step_done FROM task t LEFT JOIN step s ON t.id = s.task_id;", function(err, tasks) {
    console.log(tasks)
		if (err) {
			console.log(err);
			return res.status(500).json({ message: 'could not retrieve tasks' })
		}
		var results = {};
		for (i=0; i<tasks.length; i++) {
			var task = tasks[i];
			if (!(task.task_id in results)) { // if task doesnt already exist
				results[task.task_id] = { // create new object for task
					task_id: task.task_id,
					name: task.name,
					deadline: task.deadline,
					done: task.task_done,
					steps: []
				}
      // else { // if it already exists, just append the step to the steps array
      //   if (task.step != null) {
      //     results[task.task_id].steps.push({id: task.id, step: task.step, in_progress: task.in_progress, done: task.done})
      //  }
      // }
			// add the step
			// results[task.task_id].steps.push({id: task.id, step: task.step, in_progress: task.in_progress, done: task.done});
		  }
      // for each row in the joined table, as long as the step id is not null, aka as long as it's valid, add it to the steps array of that task
      if (task.step_id != null) {
        results[task.task_id].steps.push({id: task.step_id, step: task.step, in_progress: task.in_progress, done: task.step_done})
      }
    }
    console.log(results)
	  res.json(results);
  })
});

app.post('/task', function(req, res) {
	const task = req.body;
  console.log(req.body);
	db.run('INSERT INTO task(name, deadline, done) VALUES($name, $deadline, 0);', {
		$name: task.name,
		$deadline: task.deadline
	}, function(err) {
		if (err) {
			console.error(err);
			return res.status(500).json({ message: 'Error! Could not create task' });
		} // `Error! Could not create task ${task.name}` back tick not working for some reason :(

    task.id = this.lastID
		res.status(200).json(task) // anything not 200 is bad. like 404 page error { message: 'Successfully created new task' }
	});
})

// post route for adding a step withint a task
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
		}
		console.log('It worked')
		res.status(200).json({ message: 'Successfully created new step' }) // anything not 200 is bad. like 404 page error
	});
})

// app.get('/step', function(req, res) {
//   db.run('SELECT * FROM step WHERE in_progress = 1);' , function(err, steps) {
//     if (err){
// 			console.error(err);
// 			return res.status(500).json({ message: 'Error! Could not create step' });
// 		}
//     res.status(200).json(steps); // all the steps where in_progress is 1
//   }
// })
//
// updateing in_progress to 1 for steps that have been clicked
app.put('/update/:id', function(req, res) {
  db.run('UPDATE step SET in_progress = 1 WHERE id = req.params.id);', function(err, steps) {
    console.log('put request')
    if (err) {
			console.error(err);
			return res.status(500).json({ message: 'Error! Could not create step' });
		}
    res.status(200).json({ message: 'Successfully updated step to in progress' });
  }
)
})



app.listen(3000, function(){
	console.log('we\'re listening!');
}); //picks what port, "listen" to port 3000, waiting for incoming requset on that port

//
