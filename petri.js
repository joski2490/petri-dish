
class Bacteria {

	constructor(centerX, centerY){
		this.centerX = centerX;
		this.centerY = centerY;
		this.radius = this.assignRadius();
		
		this.direction = null;
		this.moveCounter = 0;

		this.color = bacteriaColor;
		this.outline = bacteriaOutline;

		this.absorbedPoison = 0;
	}

	assignRadius(){

		let maxBoundX = Math.min(canvas.width - this.centerX, this.centerX);
		let maxBoundY = Math.min(canvas.height - this.centerY, this.centerY);

		let maxBound = Math.min(maxBoundX, maxBoundY);

		let minBound = 0;
		if (maxBound < 10){
			return; // ... too small
		}
		else {
			minBound = 10;
		}

		if (maxBound > 50){
			maxBound = 50;
		}

		return getRandomBetween(minBound, maxBound);

	}
}


function showStatus(text){
	document.querySelector("#status_bar").textContent = text;
}

function removeFromArray(array, index){
	array.splice(index, 1);
}

// --- Getters

function getX(bacteria){
	return bacteria.centerX;
}

function getY(bacteria){
	return bacteria.centerY;
}

function getMouse(e){
	const rect = canvas.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;

    return [x, y];
}


function getRandomBetween(a, b){
	
	const diff = b - a + 1;
	let res = Math.floor(Math.random() * diff);
	res += a;
	return res;
}


//

// --- Clearing funtions

function eraseCanvas(){
	drawRect(0, 0, canvas.width, canvas.height, bgColor);
}


function clearCircle(x, y, r){
    context.save();
    context.globalCompositeOperation = 'destination-out';
    context.beginPath();
    context.arc(x, y, r + 1, 0, 2 * Math.PI, false);
    context.fill();
    context.restore();
}

function clearStatus(){
	document.querySelector("#status_bar").textContent = "";
}
// ---

// --- Button funtions

function reset(){
	eraseCanvas();
	bacterias = [];
}


function stopPlay(){
	isPause = !isPause;
}

// ---


// --- Drawing

function drawLine(x, y, x2, y2){
    context.beginPath();
	context.moveTo(x, y);
	context.lineTo(x2, y2);
	context.stroke();
}


function drawCircle(x, y, r, color, outline){

	context.fillStyle = color;
	context.beginPath();
	context.arc(x, y, r, 0, 2 * Math.PI);
	context.fill();
	context.strokeStyle = outline;
	context.stroke();

}


function drawRect(x, y, w, h, color){

	context.fillStyle = color;
	context.beginPath();
	context.fillRect(x, y, w, h);
	context.stroke();
}

function drawWeb(){

	for (i = 0; i < bacterias.length; i++){
		for (j = 0; j < bacterias.length; j++){
			drawLine(getX(bacterias[i]), getY(bacterias[i]),
				     getX(bacterias[j]), getY(bacterias[j])
				    );
		}
	}
}


function checkPoison(bacteria){

	for (i = 0; i < poisonDrops.length; i++){

		let drop = poisonDrops[i];

		if (isOnBacteria(bacteria, drop[0], drop[1])) {

			removeFromArray(poisonDrops, i);
			drawCircle(drop[0], drop[1], poisonRadius + 1, bgColor, bgColor);
			bacteria.absorbedPoison++;

		}
	}
}


function drawBacterias(e){

	if (isPause){
		return;
	}

	//eraseCanvas();

	for (i = 0; i < bacterias.length; i++){

		moveBacteria(bacterias[i]);

	}

	//drawWeb();

}


function assignDirection(bacteria){
	bacteria.direction = directions[getRandomBetween(0, 5)];
	bacteria.moveCounter = getRandomBetween(0, 50);
}


function checkBounds(bacteria, dx, dy){

	if (bacteria.centerX + dx - bacteria.radius < 0){
		return false;
	}

	if (bacteria.centerX + dx + bacteria.radius > canvas.width){
		return false;
	}

	if (bacteria.centerY + dy - bacteria.radius < 0){
		return false;
	}

	if (bacteria.centerY + dy + bacteria.radius > canvas.height){
		return false;
	}

	return true;
}


function moveBacteria(bacteria){

	if (bacteria.moveCounter == 0){
		assignDirection(bacteria);
	}

	let dx = bacteria.direction[0] * moveSize;
	let dy = bacteria.direction[1] * moveSize;

	if (!checkBounds(bacteria, dx, dy)){
		assignDirection(bacteria);
		dx = 0;
		dy = 0;
	}

	drawCircle(bacteria.centerX, bacteria.centerY, bacteria.radius + 1, bgColor, bgColor);
    drawCircle(bacteria.centerX + dx, bacteria.centerY + dy, bacteria.radius, bacteria.color, bacteria.outline);
	bacteria.centerX += dx;
	bacteria.centerY += dy;

	setTimeout(checkPoison, 1, bacteria);

	bacteria.moveCounter -= 1;

}

// ---

function spawnBacteria(e){

	const coords = getMouse(e);
	const cursorX = coords[0];
	const cursorY = coords[1];

    bacterias.push(new Bacteria(cursorX, cursorY));

    showStatus("Bacteria spawned successfully!");

}


function isOnBacteria(bacteria, x, y){

	if ( (Math.abs(bacteria.centerX - x) <= bacteria.radius) &&
		 (Math.abs(bacteria.centerY - y) <= bacteria.radius) )
	{
		return true;
	}

	return false;
}


function startEvent(e){

	const picked = document.querySelector('input[name="to-draw"]:checked');

	if (picked == null){
		showStatus("Pick something to draw!");
		return;
	}

	if (picked.value == "poison") {
		startSprinkle(e, "poison");
	}
	else if (picked.value == "food"){
		startSprinkle(e, "food");
	}
	else if (picked.value == "bacteria") {
		spawnBacteria(e);
	}

}


function stopEvent(e){

	const picked = document.querySelector('input[name="to-draw"]:checked');

	if (picked == null){
		return;
	}

	if (picked.value == "poison"){
		stopSprinkle(e, "poison");
	}
	else if (picked.value == "food"){
		stopSprinkle(e, "food");
	}
}


function startSprinkle(e, type){

	if (type == "food"){
		canvas.addEventListener("mousemove", setFood);
	}
	else if (type == "poison"){
		canvas.addEventListener("mousemove", setPoison);
	}
	
}


function stopSprinkle(e, type){

	if (type == "food"){
		canvas.removeEventListener("mousemove", setFood);
	}
	else if (type == "poison"){
		canvas.removeEventListener("mousemove", setPoison);
	}
	
}


function setPoison(e){

	const coords = getMouse(e);
	const x = coords[0];
	const y = coords[1];

	drawCircle(x, y, poisonRadius, poisonColor, poisonOutline);
	poisonDrops.push([x, y]);

	showStatus("Poison set successfully!");

}

function setFood(e){

	const coords = getMouse(e);
	const x = coords[0];
	const y = coords[1];

	drawCircle(x, y, poisonRadius, foodColor, foodOutline);
	foodDrops.push([x, y]);

	showStatus("Food set successfully!");

}


const directions = [
					[1, 1],
					[1, 0],
					[0, 1],
					[-1, -1],
					[-1, 0],
					[0, -1],
				   ];

let bacterias   = [];
let poisonDrops = [];
let foodDrops   = [];

const poisonColor     = "#00FF00";
const poisonOutline   = "#00FFFF";
const foodColor       = "#b5884e";
const foodOutline     = "#b5884e";
const bgColor         = "#000000";
const bacteriaColor   = "#174f16";
const bacteriaOutline = "#174f16";

let isPause = false;
let poisonTimerId = -1;

let canvas = document.querySelector("canvas");
canvas.width = 900;
canvas.height = 700;
let context = canvas.getContext("2d");
drawRect(0, 0, canvas.width, canvas.height, bgColor);

const moveSize = 3;
const refreshRate = 17;

const poisonRadius = 3;

canvas.addEventListener("mousedown", startEvent);
canvas.addEventListener("mouseup", stopEvent);

document.querySelector("#pause_button").addEventListener("click", stopPlay);
document.querySelector("#reset_button").addEventListener("click", reset);

let intervalId = setInterval(drawBacterias, refreshRate);
