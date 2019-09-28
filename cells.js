var canvas = document.querySelector('canvas');

canvas.width = window.innerWidth;
canvas.height = window.innerHeight;
console.log('Screen Size: ' + innerWidth + ", " + innerHeight);

// c stands for context in canvas. It's a magic variable :)
var c = canvas.getContext('2d');
c.globalAlpha = 1.0;

// -------------------------OPTIONS------------------------- //
var cellSize = 5;
var colorChangeRate = 5;
var bgColor = 'rgba(123, 123, 123, 1)';

// -------------------------SPACE------------------------- //
var space = [];
var spaceWidth = innerWidth;
var spaceHeight = innerHeight;
// Get spaceWidth
while (spaceWidth % cellSize != 0)
{
	console.log(spaceWidth % cellSize);
	spaceWidth -= 1;
}
// Get spaceHeight
while (spaceHeight % cellSize != 0)
{
	console.log("Adjusting height " + spaceHeight % cellSize);
	spaceHeight -= 1;
}
spaceHeight /= cellSize;
spaceWidth /= cellSize;
console.log('Space Size: ' + spaceWidth + ", " + spaceHeight);
// Create Space
for (var y = 0; y < spaceHeight; y++) {
	var row = [];
	for (var x = 0; x < spaceWidth; x++) {
		row.push(null);
	}
	space.push(row);
}
var livingCells = [];
var alphaCells = [];

// -------------------------FUNCTIONS------------------------- //
function shuffle(array)
{
	array.sort(() => Math.random() - 0.5);
}
function random(mn, mx, zero=true)
{
	if (mn == 0 && mx == 0)  // Prevent forever loop
	{
		zero = true;
	}
	if (zero == false)
	{
		var i = Math.round(Math.random() * (mx - mn) + mn);
		while (i == 0)
		{
			i = Math.round(Math.random() * (mx - mn) + mn);
		}
		return i;
	}
	else
	{
		return Math.round(Math.random() * (mx - mn) + mn);
	}
}

function randomSpaceCoords()
{
	return [random(0, spaceWidth - 1), random(0, spaceHeight - 1)];
}

function randomColor(mn=0, mx=255, alpha=false)
{
	return [random(mn, mx), random(mn, mx), random(mn, mx)]
}

function validColor(color)
{
	var r = color[0];
	var g = color[1];
	var b = color[2];

	if (r > 255) r = 255;
	else if (r < 0) r = 0;
	if (g > 255) g = 255;
	else if (g < 0) g = 0;
	if (b > 255) b = 255;
	else if (b < 0) b = 0;

	return [r, g, b];
}

function similarColor(color, variation)
{
	var r = color[0];
	var g = color[1];
	var b = color[2];

	r += random(-variation, variation, zero=false);
	g += random(-variation, variation, zero=false);
	b += random(-variation, variation, zero=false);

	return validColor([r, g, b]);
}

function spawnAlphaCells(amount)
{
	for (var i = 0; i < amount; i++)
	{
		if (i > spaceWidth * spaceHeight / 2) break;
		var newLocation = randomSpaceCoords();
		while (space[newLocation[1]][newLocation[0]] !== null) newLocation = randomSpaceCoords();
		new Cell(newLocation, 'alpha', race=i, color=randomColor(mn=50));
		console.log("New alpha with index: " + i);
	}
}

function multiplyCells() {
	for (var i = 0; i < alphaCells.length; i++) {
		alphaCells[i].food += 1;
	}
	var cellsWithFood = [];
	for (var i = 0; i < livingCells.length; i++) {
		// If cell's parent is dead, then die.
		// if (livingCells[i].parent === null) livingCells[i].die();
		// If cell has food, add to a list (that won't be continuously updated)
		if (livingCells[i].food > 0) cellsWithFood.push(livingCells[i]);
	}
	for (var i = 0; i < cellsWithFood.length; i++) {
		cellsWithFood[i].transferFood();
	}
}

function directionsTypeChange(i){
	directionsDict = {'R': [1, 0], 'L': [-1, 0], 'T': [0, -1], 'B': [0, 1]};
	if (typeof i == 'string') return directionsDict[i];
	else {
		if (i == [1, 0]) return 'R';
		else if (i == [-1, 0]) return 'L';
		else if (i == [0, -1]) return 'T';
		else if (i == [0, 1]) return 'B';
		else console.log("Error in function: directionsTypeChange()");
	}
}

function inBounds(direction, location) {
	if (typeof direction == "object") direction = directionsTypeChange(direction);
	if (direction == 'L') {
		if (location[0] > 0) return true;
		else return false;
	}
	else if (direction == 'R') {
		if (location[0] < spaceWidth - 1) return true;
		else return false;
	}
	else if (direction == 'T') {
		if (location[1] > 0) return true;
		else return false;
	}
	else if (direction == 'B') {
		if (location[1] < spaceHeight - 1) return true;
		else return false;
	}
}


// // Rectangle
// c.fillStyle = 'rgba(255, 0, 0, 0.5)'  // Color next Rect to red
// c.fillRect(100, 100, 50, 50);  // draw
// c.fillStyle = 'rgba(0, 255, 0, 0.5)'  // Color next Rect to green
// c.fillRect(100, 200, 50, 50);  // draw
// c.fillStyle = 'rgba(0, 0, 255, 0.5)'  // Color next Rect to blue
// c.fillRect(200, 100, 50, 50);  // draw
// c.fillStyle = 'rgba(0, 0, 0, 0.5)'  // Color next Rect to black
// c.fillRect(200, 200, 50, 50);  // draw
// console.log(canvas);

// // Line
// c.beginPath();
// c.moveTo(125, 125);  // Initialize
// c.lineTo(175, 150);  // Draw Line
// c.lineTo(225, 125);  // Draw
// c.lineTo(200, 175);  // Draw
// c.lineTo(225, 225);  // Draw
// c.lineTo(175, 200);  // Draw
// c.lineTo(125, 225);  // Draw
// c.lineTo(150, 175);  // Draw
// c.lineTo(125, 125);  // Draw
// c.strokeStyle = "rgba(255, 255, 255, 1)";  // Set color of Line
// c.stroke();  // Display line

// // Arc / Circle
// c.beginPath();  // Is still at last line location: Reset
// c.arc(175, 175, 50, 0, Math.PI * 2, false);
// c.strokeStyle = "black";  // Set color of Arc
// c.stroke();

// var colorChoices = ["red", "green", "blue"];

// for (var i = 0; i < 1000; i++)
// {
// 	var x = Math.random() * window.innerWidth;
// 	var y = Math.random() * window.innerHeight;

// 	console.log((i % 3).toString());
// 	tempColor = colorChoices[i % 3];

// 	c.beginPath();  // Is still at last line location: Reset
// 	c.arc(x, y, 50, 0, Math.PI * 2, false);
// 	c.strokeStyle = tempColor;  // Set color of Arc
// 	c.stroke();
// }

// Conclusion
// ------------
// with a canvas you can draw:
//	- Rectangles
//		- c.fillStyle = "" -- Any: rgba(), text color value, hexadecimal value #fa34a3 -- Works for all proceeding rectangles
//		- c.fillRect(x, y, width, height)  -- Draws Rectangle
//
//	- Lines
//		- c.beginPath() -- (Re)Initialize
//		- c.moveTo(x, y) -- Set position 0
//		- c.lineTo(x, y) -- Draw line from last point to new point
//		- c.strokeStyle = "" -- Any: rgba(), text color value, hexadecimal value #fa34a3
//		- c.stroke() -- Make Lines visible
//
//		- c.strokeStyle
//	- Arcs (circles)
//		- c.beginPath();  -- (Re)Initilize
//		- c.arc(x: int, y: int, r: int, startAngle: float (rad), endAngle: float (rad), drawCounterClockwise: Bool)
//		- c.strokeStyle = "" -- Any: rgba(), text color value, hexadecimal value #fa34a3
//		- c.stroke() -- Make Arc visible
//	- Bezier curves
//	- Images
//	- Text

function Cell(location, parent, race=null, color=null)  // Upper case the first letter of an object / class
{
	this.parent = parent;
	this.children = [];
	this.location = location;
	this.race = race;
	this.color = color;
	if (parent != "alpha") {
		this.color = similarColor(parent.color, 1);
		this.race = parent.race;
	}
	else {  // Parent == "alpha"
		alphaCells.push(this);
	}
	this.food = 0;

	space[location[1]][location[0]] = this;
	livingCells.push(this);

	this.draw = function()
	{
		var alpha = 1;
		c.fillStyle = `rgba(${this.color[0]}, ${this.color[1]}, ${this.color[2]}, ${alpha})`;
		c.fillRect(this.location[0] * cellSize, this.location[1] * cellSize, cellSize, cellSize);
		// If I have food, draw it.
		if (this.food > 0) {
			if (cellSize % 2 == 0) { // If it's even, then draw an even-sized food dot
				c.fillStyle = 'black';
				c.fillRect(this.location[0] * cellSize + Math.floor(cellSize/2-1), this.location[1] * cellSize + Math.floor(cellSize/2-1), 2, 2);
			}
			else { // If it's odd, then draw an odd-sized food dot
				c.fillStyle = 'black';
				c.fillRect(this.location[0] * cellSize + Math.floor(cellSize/2), this.location[1] * cellSize + Math.floor(cellSize/2), 1, 1);
			}
		}
	}
	this.multiply = function() {
		var dirArray = ['T', 'B', 'L', 'R'];
		shuffle(dirArray);
		var multiplied = false;
		for (var i = 0; i < dirArray.length; i++) {
			var x = directionsTypeChange(dirArray[i])[0];
			var y = directionsTypeChange(dirArray[i])[1];
			if (inBounds(dirArray[i], this.location) && space[this.location[1] + y][this.location[0] + x] === null) {
				var child = new Cell([this.location[0] + x, this.location[1] + y], this);
				multiplied = true;
				this.children.push(child);
				break
			}
		}
		if (multiplied == true) this.food -= 1;
	}
	this.transferFood = function() {
		// Find children without food
		var childrenWithoutFoodIndexArray = [];
		for (var i = 0; i < this.children.length; i++) {
			if (this.children[i].food == 0) childrenWithoutFoodIndexArray.push(i);
		}
		// If you're the alpha and can multiply, then multiply
		if (this.parent === "alpha" && this.children.length < 4) this.multiply();
		// If you have children...
		else if (childrenWithoutFoodIndexArray.length > 0) {
			shuffle(childrenWithoutFoodIndexArray);
			console.log(this.children);
			if (random(0, 200) == 2) this.multiply();
			else if (this.food > 0) {
				this.children[childrenWithoutFoodIndexArray[0]].food += 1;
				this.food -= 1;
			}
		}
		else if (childrenWithoutFoodIndexArray.length == 0) this.multiply();

	}
	this.die = function()
	{
		this.parent = null;
		c.fillStyle = bgColor;
		c.fillRect(this.location[0] * cellSize, this.location[1] * cellSize, cellSize, cellSize);
	}
	this.draw();
}

// Spawn Alpha Cells
spawnAlphaCells(10);

// Loop function
function animate()
{
	requestAnimationFrame(animate);  // Is going to create a loop for us
	//var key = k.key();
	//console.log(key);
	//c.fillStyle = 'rgba(123, 123, 123, .01)';
	//c.fillRect(0, 0, innerWidth, innerHeight);

	c.clearRect(0, 0, innerWidth, innerHeight);  // Clear the screen
	multiplyCells();
	for (var i = 0; i < livingCells.length; i++)
	{
		livingCells[i].draw();
	}
}
//c.fillStyle = bgColor;
//c.fillRect(0, 0, innerWidth, innerHeight);
animate();
