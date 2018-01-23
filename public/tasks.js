$(document).ready(function() {
	$('#save-button').click(function() {
		var $newTaskForm = $('#new-task-form');
		var newTask = $newTaskForm.serialize();
		$.post('/task', newTask)
			.done(function(res) {
				$newTaskForm.trigger('reset')
				console.log(res)
				location.reload();
			})
			.fail(function(err) {
				console.log(err)
			});
	})

	$.get('/step')
		.done(function(steps) {
			console.log(steps)
			var $list = $('<ol/>');
			$('#in-progress-steps').append($list);
			for (var i = 0; i < steps.length; i++) {
				var $item = $('<li/>');
				$item.text(steps[i].step);
				$list.append($item);
			}
		})

	$.get('/task') // send request, get responses
		.done(function(tasks) {
			console.log(tasks)
			var i = 0;
			for (taskId in tasks) {
				var task = tasks[taskId]
				// choose the color based on which column you're on
				// (based on index of the column)
				var $panel = $('<div/>');
				if (i % 3 == 0) {
					var panelColor = 'blue-background'
				}
				else if (i % 3 == 1) {
					var panelColor = 'red-background';
				}
				else {
					var panelColor = 'green-background';
				}
				// create panels using the specified color
				$panel.addClass('panel');
				$panel.addClass(panelColor);
				// create the project box at the top with the project name from tasks array
				var $projectBox = $('<div/>');
				$projectBox.addClass('project-box top-box');
				$projectBox.text(task.name);
				$panel.append($projectBox);
				// create the first line and the circle that corresponds to it
				var $line = $('<div/>');
				$line.addClass('line');

				var $firstCircle = $('<div/>');
				$firstCircle.addClass('circle');
				$line.append($firstCircle);
				$panel.append($line);


				// rendering the steps that exist for each task
				for (var j = 0; j < task.steps.length; j++) {
					if (task.steps[j].in_progress == 1) {continue};
					// create line
					var $lineNoMargin = $('<div/>');
					$lineNoMargin.addClass('line-no-margin');
					// create circle
					var $circle = $('<div/>');
					var currentStep = task.steps[j].id;
					$circle.addClass('circle');
					$circle.attr('id', currentStep);
					// create the input
					var $inputTextNext = $('<input/>');
					// set the color of the input of to match the panel colors
					$inputTextNext.addClass(panelColor);
					$inputTextNext.attr('placeholder', task.steps[j].step);
					$inputTextNext.attr('type', 'text');
					$inputTextNext.attr('disabled', 'true');
					$inputTextNext.addClass('step-input');
					$inputTextNext.attr('id', currentStep);
					// TODO for each step add click handler to change in_progress to 1 (true).... you need to make a new PUT request
					//      handler that will update in_progress to true
					//      $inputTextNext.click(function( $.put(...) ))
					// LEFT OFF HEREEEEEEEEEEE
					var step = task.steps[j]

					$circle.click(function markTaskInProgress() {
						$.post('/update/' + this.id)
						 	.done(function(res) {
								console.log(res);
								location.reload()
							})
							.fail(function(err) {
								console.log(err)
							})
					})
					// $circle.click(function(){
					// 	console.log(task.steps);
					// 	// stepInProgress should be the value of the input field that has the same class as the clicked button
					// 	// get the step of the task that matches the circleId
					// 	console.log(this)
          //
					// 		// i think this should be step_id ... look up doc for .put
					// })

					// add the circle then the input to the line div
					$lineNoMargin.append($circle);
					$lineNoMargin.append($inputTextNext);
					// add the line div to the entire panel
					$panel.append($lineNoMargin);
				};

				// Input box for new step

				var $inputText = $('<input/>');
				// set the bg of the input to match the panel color
				$inputText.addClass(panelColor);
				$inputText.attr('placeholder', 'Text');
				$inputText.attr('type', 'text');
				$inputText.attr('id', task.task_id);
				$inputText.addClass('step-input');

				//TODO: Add keypress handler for new steps that checks if enter is pressed on form and sends POST request
				// 			a new route that crates a new steps.. see line 76 in index.js
				//      $inputText.keypress(function(e) { if e.keyCode == whatever the code is for enter { $.post(...) }})
				$inputText.keypress(function(e) {
					if(e.which == 13) {
						var userInputStep = $(this).val();
						var userinputTaskId = $(this).attr('id');
						$.post('/task/' + userinputTaskId + '/step', {name: userInputStep})
						.done(function(res){
							location.reload();
							// next: add something here... render the frontend here.
						})
					}
				});

				$line.append($inputText);
				// POST to "/tasks/taskId/steps"  on enter



				// the last line is quirky because it doesn't have inputs or circles.
				var $lineNoMargin2 = $('<div/>');
				$lineNoMargin2.addClass('line-no-margin');
				$panel.append($lineNoMargin2);

				// create the deadline div box and input the actual deadline from tasks array.
				var $deadline = $('<div/>');
				$deadline.addClass('project-box bottom-box');
				$deadline.text(task.deadline);
				$panel.append($deadline);

				$('#tasks').append($panel); // javascript object that represents html "querying for something in html that already has these things" --aaron leon 2017

				++i;
			}
		})
		.fail(function(err) {
			alert('Something went wrong...')
		})
});
