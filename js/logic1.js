var toChild = function(size, cell) {
	var x = cell[0];
	var y = cell[1];

	return size * y + x;
}

function Grid(size) {
	this.render = function() {
		for(i = 0; i < size * size; i++) {
			var $pixel = $('<div class="pixel"></div>');
			$pixel.appendTo('#container');
		}
	}

	this.render();
}

function Snake(size) {
	this.head = [Math.floor(size / 2), Math.floor(size / 2)];
	this.direction = 39;		// 37:left; 38:up; 39:right; 40:down;
	this.cells = [this.head];

	this.cellToChild = function() {
		return this.cells.map(cell => toChild(size, cell));
	}

	this.move = function() {
		this.advanceHead();
		this.retractTail();
		this.renderSnake();
	}

	this.renderSnake = function() {
		var snake = this.cellToChild();
		for (i = 0; i < snake.length; i++) {
			$('.pixel').eq(snake[i]).html("O");
		}
	}

	this.advanceHead = function() {
		h = this.head;
		switch(this.direction) {
			case 37: this.head = [h[0] - 1, h[1]]; break;
			case 38: this.head = [h[0], h[1] - 1]; break;
			case 39: this.head = [h[0] + 1, h[1]]; break;
			case 40: this.head = [h[0], h[1] + 1]; break;
		}

		this.cells.unshift(this.head);
	}

	this.retractTail = function() {
		var tail = toChild(size, snake.cells.pop());
		$('.pixel').eq(tail).html("");
	}

	$('body').on('keydown', function(event) {
		snake.steer(event.which);
	});

	this.steer = function(newDirection) {
		if ((this.direction + newDirection) % 2 === 1)
			this.direction = newDirection;
	}

	this.eatsFood = function(size) {
		return toChild(size, snake.head) === toChild(size, food.position);
	}

	this.grow = function() {
		var newCell = undefined;
		var oldTail = this.cells.slice(-1)[0];

		switch(this.direction) {
			case 37: newCell = [oldTail[0] + 1, h[1]]; break;
			case 38: newCell = [oldTail[0], h[1] + 1]; break;
			case 39: newCell = [oldTail[0] - 1, h[1]]; break;
			case 40: newCell = [oldTail[0], h[1] - 1]; break;
		}

		this.cells.push(newCell);
	}

	this.hitsWall = function(size) {
		var h = this.head;
		return h[0] === size || h[1] === size || h[0] < 0 || h[1] < 0;
	}

	this.hitsSelf = function() {
		// use a for loop if performance lacking.
		return this.cells.filter(x => toChild(size, x) === toChild(size, this.head)).length > 1;
	}
}

function Food(size) {
	this.position = [Math.floor(Math.random() * (size - 2) + 1), Math.floor(Math.random() * (size - 2) + 1)];
	this.childPosition = toChild(size, this.position);
	this.value = 100;

	this.color = [];
	for (i = 0; i < 3; i++) {
		this.color.push(Math.ceil(Math.random() * 150));
	}

	this.scoreIcon = function() {
		$('<div class="foodValue"></div>').prependTo('.score')
										  .animate({ 'top': '0'}, 300, 'linear');
	}

	this.addToScore = function() {
		$('.foodValue').removeClass('foodValue')
					   .addClass('eaten')
					   .animate({ 'top': '300' }, 1000, function() { $(this).remove(); })
	}

	$('.foodValue').html(this.value);
	$('.pixel').eq(this.childPosition).addClass("food")
									  .css({ 'background': 'red',//'rgb('+ this.color[0] + ',' + this.color[1] + ',' + this.color[2] + ')',
									   		 'border-radius': this.color[0] / 3 + '%'
									  		})//addClass("food");

	this.scoreIcon();
}

function Game() {
	this.points = 0;
	this.speed = 1000;

	$('#points').html(this.points);

	$('#instructions').on('click', function() {
		$('#instructions p, button').slideToggle();
	});
}

var size = 40;
var grid = new Grid(size);
var snake = new Snake(size);
var food = new Food(size);
var game = new Game();
///////////////////////////////////////////////////
var gameOver = function() {
	$('#game_over').show();
	$('body').animate({'marginLeft': "+=30px"}, 10)
			 .animate({'marginLeft': "-=30px"}, 10)
			 .animate({'marginTop': "+=30px"}, 10)
			 .animate({'marginTop': "-=30px"}, 10);
	clearInterval(interval);
}

var speed = prompt("Set speed, (300: easy, 200: medium, 100: hard)") || 200;

var interval = setInterval(function(){
	snake.move();

	if (snake.eatsFood(size)) {
		snake.grow();
		$('.pixel').eq(food.childPosition).removeClass("food").css('background', '#9f5'); //remove eaten food from grid
		food.addToScore();
		$('#points').html(game.points += food.value)	// enlarge new score. add into fuction after instantiating other objects in Game.
					.animate({'font-size': '80px'})
					.animate({'font-size': '50px'});
		food = new Food(size);

		console.log('food position =' + food.position[0] + ', ' + food.position[1]);
	}

	if (snake.hitsWall(size))
		gameOver();

	if(snake.hitsSelf())
		gameOver();

	food.value = food.value === 5 ? 5 : food.value - 1;
	$('.foodValue').html(food.value);

	for (i = 0; i < snake.cells.length; i++) {
		console.log(snake.cells[i][0], snake.cells[i][1]);
	}
	console.log("***");
}, speed);

////////////////////////////////////////////////////
