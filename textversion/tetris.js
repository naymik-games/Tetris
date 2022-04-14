 //Define 10x20 grid as the board
var grid = [
[0,0,0,0,0,0,0,0,0,0],
[0,0,0,0,0,0,0,0,0,0],
[0,0,0,0,0,0,0,0,0,0],
[0,0,0,0,0,0,0,0,0,0],
[0,0,0,0,0,0,0,0,0,0],
[0,0,0,0,0,0,0,0,0,0],
[0,0,0,0,0,0,0,0,0,0],
[0,0,0,0,0,0,0,0,0,0],
[0,0,0,0,0,0,0,0,0,0],
[0,0,0,0,0,0,0,0,0,0],
[0,0,0,0,0,0,0,0,0,0],
[0,0,0,0,0,0,0,0,0,0],
[0,0,0,0,0,0,0,0,0,0],
[0,0,0,0,0,0,0,0,0,0],
[0,0,0,0,0,0,0,0,0,0],
[0,0,0,0,0,0,0,0,0,0],
[0,0,0,0,0,0,0,0,0,0],
[0,0,0,0,0,0,0,0,0,0],
[0,0,0,0,0,0,0,0,0,0],
[0,0,0,0,0,0,0,0,0,0],
];

//Block shapes
var shapes = {
	I: [[0,0,0,0], [1,1,1,1], [0,0,0,0], [0,0,0,0]],
	J: [[2,0,0], [2,2,2], [0,0,0]],
	L: [[0,0,3], [3,3,3], [0,0,0]],
	O: [[4,4], [4,4]],
	S: [[0,5,5], [5,5,0], [0,0,0]],
	T: [[0,6,0], [6,6,6], [0,0,0]],
	Z: [[7,7,0], [0,7,7], [0,0,0]]
};

//Block colors
var colors = ["F92338", "C973FF", "1C76BC", "FEE356", "53D504", "36E0FF", "F8931D"];

//Used to help create a seeded generated random number for choosing shapes. makes results deterministic (reproducible) for debugging
var rndSeed = 1;

//BLOCK SHAPES
//coordinates and shape parameter of current block we can update
var currentShape = {x: 0, y: 0, shape: undefined};
//store shape of upcoming block
var upcomingShape;
//stores shapes
var bag = [];
//index for shapes in the bag
var bagIndex = 0;

//GAME VALUES
//Game score
var score = 0;
// game speed
var speed = 500;
// boolean for changing game speed
var changeSpeed = false;
//for storing current state, we can load later
var saveState;
//stores current game state
var roundState;
//list of available game speeds
var speeds = [500,100,1,0];
//inded in game speed array
var speedIndex = 0;

//drawing game vs updating algorithms
var draw = true;






//main function, called on load
function initialize() {
	
	//get the next available shape from the bag
	nextShape();
	//applies the shape to the grid
	applyShape();
	//set both save state and current state from the game
	saveState = getState();
	roundState = getState();
	//create an initial population of genomes
	//createInitialPopulation();
	//the game loop
	var loop = function(){
		//boolean for changing game speed
		if (changeSpeed) {
			//restart the clock
			//stop time
			clearInterval(interval);
			//set time, like a digital watch
			interval = setInterval(loop, speed);
			//and don't change it
			changeInterval = false;
		}
		if (speed === 0) {
			//no need to draw on screen elements
			draw = false;
			//updates the game (update fitness, make a move, evaluate next move)
			update();
			update();
			update();
		} else {
			//draw the elements
			draw = true;
		}
		//update regardless
		update();
		if (speed === 0) {
			//now draw elements
			draw = true;
			//now update the score
			updateScore();
		}
	};
	//timer interval
	var interval = setInterval(loop, speed);
}
document.onLoad = initialize();


//key options
window.onkeydown = function (event) {

	var characterPressed = String.fromCharCode(event.keyCode);
	if (event.keyCode == 38) {
		rotateShape();
	} else if (event.keyCode == 40) {
		moveDown();
	} else if (event.keyCode == 37) {
		moveLeft();
	} else if (event.keyCode == 39) {
		moveRight();
	} else if (shapes[characterPressed.toUpperCase()] !== undefined) {
		removeShape();
		currentShape.shape = shapes[characterPressed.toUpperCase()];
		applyShape();
	} else if (characterPressed.toUpperCase() == "Q") {
		saveState = getState();
	} else if (characterPressed.toUpperCase() == "W") {
		loadState(saveState);
	} else if (characterPressed.toUpperCase() == "D") {
		//slow down
		speedIndex--;
		if (speedIndex < 0) {
			speedIndex = speeds.length - 1;
		}
		speed = speeds[speedIndex];
		changeSpeed = true;
	} else if (characterPressed.toUpperCase() == "E") {
		//speed up
		speedIndex++;
		if (speedIndex >= speeds.length) {
			speedIndex = 0;
		}
		//adjust speed index
		speed = speeds[speedIndex];
		changeSpeed = true;
		
	} else {
		return true;
	}
	//outputs game state to the screen (post key press)
	output();
	return false;
};



/**
 * Updates the game.
 */
 function update() {
 
        //else just move down
 		moveDown();
 	
 	//output the state to the screen
 	output();
 	//and update the score
 	updateScore();
 }

/**
 * Moves the current shape down if possible.
 * @return {Object} The results of the movement of the piece.
 */
 function moveDown() {
 	//array of possibilities
 	var result = {lose: false, moved: true, rowsCleared: 0};
 	//remove the shape, because we will draw a new one
 	removeShape();
 	//move it down the y axis
 	currentShape.y++;
 	//if it collides with the grid
 	if (collides(grid, currentShape)) {
 		//update its position
 		currentShape.y--;
 		//apply (stick) it to the grid 
 		applyShape();
 		//move on to the next shape in the bag
 		nextShape();
 		//clear rows and get number of rows cleared
 		result.rowsCleared = clearRows();
 		//check again if this shape collides with our grid
 		if (collides(grid, currentShape)) {
 			//reset
 			result.lose = true;
 			if (ai) {
 			} else {
 				reset();
 			}
 		}
 		result.moved = false;
 	}
 	//apply shape, update the score and output the state to the screen
 	applyShape();
 	score++;
 	updateScore();
 	output();
 	return result;
 }

/**
 * Moves the current shape to the left if possible.
 */
 function moveLeft() {
 	//remove current shape, slide it over, if it collides though, slide it back
 	removeShape();
 	currentShape.x--;
 	if (collides(grid, currentShape)) {
 		currentShape.x++;
 	}
 	//apply the new shape
 	applyShape();
 }

/**
 * Moves the current shape to the right if possible.
 */
 //same deal
 function moveRight() {
 	removeShape();
 	currentShape.x++;
 	if (collides(grid, currentShape)) {
 		currentShape.x--;
 	}
 	applyShape();
 }

/**
 * Rotates the current shape clockwise if possible.
 */
 //slide it if we can, else return to original rotation
 function rotateShape() {
 	removeShape();
 	currentShape.shape = rotate(currentShape.shape, 1);
 	if (collides(grid, currentShape)) {
 		currentShape.shape = rotate(currentShape.shape, 3);
 	}
 	applyShape();
 }

/**
 * Clears any rows that are completely filled.
 */
 function clearRows() {
 	//empty array for rows to clear
 	var rowsToClear = [];
 	//for each row in the grid
 	for (var row = 0; row < grid.length; row++) {
 		var containsEmptySpace = false;
 		//for each column
 		for (var col = 0; col < grid[row].length; col++) {
 			//if its empty
 			if (grid[row][col] === 0) {
 				//set this value to true
 				containsEmptySpace = true;
 			}
 		}
 		//if none of the columns in the row were empty
 		if (!containsEmptySpace) {
 			//add the row to our list, it's completely filled!
 			rowsToClear.push(row);
 		}
 	}
 	//increase score for up to 4 rows. it maxes out at 12000
 	if (rowsToClear.length == 1) {
 		score += 400;
 	} else if (rowsToClear.length == 2) {
 		score += 1000;
 	} else if (rowsToClear.length == 3) {
 		score += 3000;
 	} else if (rowsToClear.length >= 4) {
 		score += 12000;
 	}
 	//new array for cleared rows
 	var rowsCleared = clone(rowsToClear.length);
 	//for each value
 	for (var toClear = rowsToClear.length - 1; toClear >= 0; toClear--) {
 		//remove the row from the grid
 		grid.splice(rowsToClear[toClear], 1);
 	}
 	//shift the other rows
 	while (grid.length < 20) {
 		grid.unshift([0,0,0,0,0,0,0,0,0,0]);
 	}
 	//return the rows cleared
 	return rowsCleared;
 }

/**
 * Applies the current shape to the grid.
 */
 function applyShape() {
 	//for each value in the current shape (row x column)
 	for (var row = 0; row < currentShape.shape.length; row++) {
 		for (var col = 0; col < currentShape.shape[row].length; col++) {
 			//if its non-empty
 			if (currentShape.shape[row][col] !== 0) {
 				//set the value in the grid to its value. Stick the shape in the grid!
 				grid[currentShape.y + row][currentShape.x + col] = currentShape.shape[row][col];
 			}
 		}
 	}
 }

/**
 * Removes the current shape from the grid.
 */
 //same deal but reverse
 function removeShape() {
 	for (var row = 0; row < currentShape.shape.length; row++) {
 		for (var col = 0; col < currentShape.shape[row].length; col++) {
 			if (currentShape.shape[row][col] !== 0) {
 				grid[currentShape.y + row][currentShape.x + col] = 0;
 			}
 		}
 	}
 }

/**
 * Cycles to the next shape in the bag.
 */
 function nextShape() {
 	//increment the bag index
 	bagIndex += 1;
 	//if we're at the start or end of the bag
 	if (bag.length === 0 || bagIndex == bag.length) {
 		//generate a new bag of genomes
 		generateBag();
 	}
 	//if almost at end of bag
 	if (bagIndex == bag.length - 1) {
 		//store previous seed
 		var prevSeed = rndSeed;
 		//generate upcoming shape
 		upcomingShape = randomProperty(shapes);
 		//set random seed
 		rndSeed = prevSeed;
 	} else {
 		//get the next shape from our bag
 		upcomingShape = shapes[bag[bagIndex + 1]];
 	}
 	//get our current shape from the bag
 	currentShape.shape = shapes[bag[bagIndex]];
 	//define its position
 	currentShape.x = Math.floor(grid[0].length / 2) - Math.ceil(currentShape.shape[0].length / 2);
 	currentShape.y = 0;
 }

/**
 * Generates the bag of shapes.
 */
 function generateBag() {
 	bag = [];
 	var contents = "";
 	//7 shapes
 	for (var i = 0; i < 7; i++) {
 		//generate shape randomly
 		var shape = randomKey(shapes);
 		while(contents.indexOf(shape) != -1) {
 			shape = randomKey(shapes);
 		}
 		//update bag with generated shape
 		bag[i] = shape;
 		contents += shape;
 	}
 	//reset bag index
 	bagIndex = 0;
 }

/**
 * Resets the game.
 */
 function reset() {
 	score = 0;
 	grid = [[0,0,0,0,0,0,0,0,0,0],
 	[0,0,0,0,0,0,0,0,0,0],
 	[0,0,0,0,0,0,0,0,0,0],
 	[0,0,0,0,0,0,0,0,0,0],
 	[0,0,0,0,0,0,0,0,0,0],
 	[0,0,0,0,0,0,0,0,0,0],
 	[0,0,0,0,0,0,0,0,0,0],
 	[0,0,0,0,0,0,0,0,0,0],
 	[0,0,0,0,0,0,0,0,0,0],
 	[0,0,0,0,0,0,0,0,0,0],
 	[0,0,0,0,0,0,0,0,0,0],
 	[0,0,0,0,0,0,0,0,0,0],
 	[0,0,0,0,0,0,0,0,0,0],
 	[0,0,0,0,0,0,0,0,0,0],
 	[0,0,0,0,0,0,0,0,0,0],
 	[0,0,0,0,0,0,0,0,0,0],
 	[0,0,0,0,0,0,0,0,0,0],
 	[0,0,0,0,0,0,0,0,0,0],
 	[0,0,0,0,0,0,0,0,0,0],
 	[0,0,0,0,0,0,0,0,0,0],
 	];
 	moves = 0;
 	generateBag();
 	nextShape();
 }

/**
 * Determines if the given grid and shape collide with one another.
 * @param  {Grid} scene  The grid to check.
 * @param  {Shape} object The shape to check.
 * @return {Boolean} Whether the shape and grid collide.
 */
 function collides(scene, object) {
 	//for the size of the shape (row x column)
 	for (var row = 0; row < object.shape.length; row++) {
 		for (var col = 0; col < object.shape[row].length; col++) {
 			//if its not empty
 			if (object.shape[row][col] !== 0) {
 				//if it collides, return true
 				if (scene[object.y + row] === undefined || scene[object.y + row][object.x + col] === undefined || scene[object.y + row][object.x + col] !== 0) {
 					return true;
 				}
 			}
 		}
 	}
 	return false;
 }

//for rotating a shape, how many times should we rotate
 function rotate(matrix, times) {
 	//for each time
 	for (var t = 0; t < times; t++) {
 		//flip the shape matrix
 		matrix = transpose(matrix);
 		//and for the length of the matrix, reverse each column
 		for (var i = 0; i < matrix.length; i++) {
 			matrix[i].reverse();
 		}
 	}
 	return matrix;
 }
//flip row x column to column x row
 function transpose(array) {
 	return array[0].map(function(col, i) {
 		return array.map(function(row) {
 			return row[i];
 		});
 	});
 }

/**
 * Outputs the state to the screen.
 */
 function output() {
 	if (draw) {
 		var output = document.getElementById("output");
 		var html = "<h1>TetNet</h1><h5>Evolutionary approach to Tetris AI</h5>var grid = [";
 		var space = "&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;";
 		for (var i = 0; i < grid.length; i++) {
 			if (i === 0) {
 				html += "[" + grid[i] + "]";
 			} else {
 				html += "<br />" + space + "[" + grid[i] + "]";
 			}
 		}
 		html += "];";
 		for (var c = 0; c < colors.length; c++) {
 			html = replaceAll(html, "," + (c + 1), ",<font color=\"" + colors[c] + "\">" + (c + 1) + "</font>");
 			html = replaceAll(html, (c + 1) + ",", "<font color=\"" + colors[c] + "\">" + (c + 1) + "</font>,");
 		}
 		output.innerHTML = html;
 	}
 }

/**
 * Updates the side information.
 */
 function updateScore() {
 	if (draw) {
 		var scoreDetails = document.getElementById("score");
 		var html = "<br /><br /><h2>&nbsp;</h2><h2>Score: " + score + "</h2>";
 		html += "<br /><b>--Upcoming--</b>";
 		for (var i = 0; i < upcomingShape.length; i++) {
 			var next =replaceAll((upcomingShape[i] + ""), "0", "&nbsp;");
 			html += "<br />&nbsp;&nbsp;&nbsp;&nbsp;" + next;
 		}
 		for (var l = 0; l < 4 - upcomingShape.length; l++) {
 			html += "<br />";
 		}
 		for (var c = 0; c < colors.length; c++) {
 			html = replaceAll(html, "," + (c + 1), ",<font color=\"" + colors[c] + "\">" + (c + 1) + "</font>");
 			html = replaceAll(html, (c + 1) + ",", "<font color=\"" + colors[c] + "\">" + (c + 1) + "</font>,");
 		}
 		html += "<br />Speed: " + speed;
 		
 		html = replaceAll(replaceAll(replaceAll(html, "&nbsp;,", "&nbsp;&nbsp;"), ",&nbsp;", "&nbsp;&nbsp;"), ",", "&nbsp;");
 		scoreDetails.innerHTML = html;
 	}
 }

/**
 * Returns the current game state in an object.
 * @return {State} The current game state.
 */
 function getState() {
 	var state = {
 		grid: clone(grid),
 		currentShape: clone(currentShape),
 		upcomingShape: clone(upcomingShape),
 		bag: clone(bag),
 		bagIndex: clone(bagIndex),
 		rndSeed: clone(rndSeed),
 		score: clone(score)
 	};
 	return state;
 }

/**
 * Loads the game state from the given state object.
 * @param  {State} state The state to load.
 */
 function loadState(state) {
 	grid = clone(state.grid);
 	currentShape = clone(state.currentShape);
 	upcomingShape = clone(state.upcomingShape);
 	bag = clone(state.bag);
 	bagIndex = clone(state.bagIndex);
 	rndSeed = clone(state.rndSeed);
 	score = clone(state.score);
 	output();
 	updateScore();
 }



/**
 * Clones an object.
 * @param  {Object} obj The object to clone.
 * @return {Object}     The cloned object.
 */
 function clone(obj) {
 	return JSON.parse(JSON.stringify(obj));
 }

/**
 * Returns a random property from the given object.
 * @param  {Object} obj The object to select a property from.
 * @return {Property}     A random property.
 */
 function randomProperty(obj) {
 	return(obj[randomKey(obj)]);
 }

/**
 * Returns a random property key from the given object.
 * @param  {Object} obj The object to select a property key from.
 * @return {Property}     A random property key.
 */
 function randomKey(obj) {
 	var keys = Object.keys(obj);
 	var i = seededRandom(0, keys.length);
 	return keys[i];
 }

 function replaceAll(target, search, replacement) {
 	return target.replace(new RegExp(search, 'g'), replacement);
 }

/**
 * Returns a random number that is determined from a seeded random number generator.
 * @param  {Number} min The minimum number, inclusive.
 * @param  {Number} max The maximum number, exclusive.
 * @return {Number}     The generated random number.
 */
 function seededRandom(min, max) {
 	max = max || 1;
 	min = min || 0;

 	rndSeed = (rndSeed * 9301 + 49297) % 233280;
 	var rnd = rndSeed / 233280;

 	return Math.floor(min + rnd * (max - min));
 }

 function randomNumBetween(min, max) {
 	return Math.floor(Math.random() * (max - min + 1) + min);
 }

 function randomWeightedNumBetween(min, max) {
 	return Math.floor(Math.pow(Math.random(), 2) * (max - min + 1) + min);
 }

 function randomChoice(propOne, propTwo) {
 	if (Math.round(Math.random()) === 0) {
 		return clone(propOne);
 	} else {
 		return clone(propTwo);
 	}
 }

 function contains(a, obj) {
 	var i = a.length;
 	while (i--) {
 		if (a[i] === obj) {
 			return true;
 		}
 	}
 	return false;
 }





function log(text) {
	console.log(text);
}