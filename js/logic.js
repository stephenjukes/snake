

function Grid(size) {
	this.size = size;
	this.pixels = {};

	this.populate = function(size, ) {
		for (y = 1; y <= size; y++) {
			for (x = 1; x <= size; x++) {
				this.pixels[x + ":" + y] = "";
			}
		}
	}

	this.render = function() {
		for (var pixel in this.pixels) {
			var pixelSize = 500 / size  + 'px';
            var $pix = $('<div class="pixel">' + this.pixels[pixel] + '</div>');

            $pix.appendTo('#container');
            /*
			$('<div class="pixel">' + this.pixels[pixel] + '</div>')
				.css({
					'height': pixelSize,
					'width': pixelSize,
					'line-height': pixelSize,
					'font-size': pixelSize
				})
				.appendTo('#container');
            */
		}
	}

	this.populate(size);
	this.render();
}

function Snake() {
	this.position = [Math.ceil(size / 2), Math.ceil(size / 2)];
	this.direction = "r";
	this.snakeBody = [];

	this.move = function() {
		p = this.position;
		s = this.snakeBody;

		switch(this.direction) {
			case "l": this.position = ([p[0] - 1, p[1]]); break;
			case "u": this.position = ([p[0], p[1] - 1]); break;
			case "r": this.position = ([p[0] + 1, p[1]]); break;
			case "d": this.position = ([p[0], p[1] + 1]); break;
		}

		s.unshift(p);
		return p;
	}

	this.steer = function(direction) {
		switch(direction) {
			case 37: if (this.direction !== "r") this.direction = "l"; break;
			case 38: if (this.direction !== "d") this.direction = "u"; break;
			case 39: if (this.direction !== "l") this.direction = "r"; break;
			case 40: if (this.direction !== "u") this.direction = "d"; break;
		}
	}
}

function Food() {
	this.position =[Math.random() * size + 1, Math.random() * size + 1];
}

var size = 40;
var snake = new Snake();
var grid = new Grid(size);

$('body').on('keydown', function(event) {
	var newPosition = snake.steer(event.which);
});

var outOfBounds = function() {
	return (snake.position[0] > size || snake.position[1] > size);
}

var endSequence = function() {
	$('body').append('<h1>Game Over</h1>');
}

grid.pixels[snake.position[0] + ":" + snake.position[1]] = "O";
var interval = setInterval(function() {
	if (outOfBounds()) {
		endSequence();
		clearInterval(interval);
	}

	snake.move(snake.direction);

    grid.pixels[snake.position[0] + ":" + snake.position[1]] = "O";
    var tail = snake.snakeBody.pop()
	grid.pixels[tail[0] + ":" + tail[1]] = "";


	$('#container').empty();
	grid.render();
}, 1);
