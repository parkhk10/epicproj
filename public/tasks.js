function sendForm(){
	
}

$(document).ready(function() {
	$.get('/task') // send request, get responses
		.done(function(tasks) {
			console.log(tasks)
			var i = 0;
			for (taskId in tasks) {
				var task = tasks[taskId];
				console.log('its working!');
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

				var $line = $('<div/>');
				$line.addClass('line');

				var $firstCircle = $('<div/>');
				$firstCircle.addClass('circle');
				$line.append($firstCircle);
				$panel.append($line);


				// don't we have to customize this for each panel? cuz diff # of tasks
				for (var j = 0; j < task.steps.length; j++) {
					// create line
					var $lineNoMargin = $('<div/>');
					$lineNoMargin.addClass('line-no-margin');
					// create circle
					var $circle = $('<div/>');
					$circle.addClass('circle');
					// create the input
					var $inputTextNext = $('<input/>');
					// set the color of the input of to match the panel colors
					$inputTextNext.addClass(panelColor);
					$inputTextNext.attr('placeholder', task.steps[j].step);
					$inputTextNext.attr('type', 'text');
					// add the circle then the input to the line div
					$lineNoMargin.append($circle);
					$lineNoMargin.append($inputTextNext);
					// add the line div to the entire panel
					$panel.append($lineNoMargin);
				};

				var $inputText = $('<input/>');
				// set the bg of the input to match the panel color
				$inputText.addClass(panelColor);
				$inputText.attr('placeholder', 'Text');
				$inputText.attr('type', 'text');
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
			}

			++i;
		})
		.fail(function(err) {
			alert('Something went wrong...')
		})
});
