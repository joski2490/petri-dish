
class Bacteria {

	constructor(centerX, centerY){
		this.centerX = centerX;
		this.centerY = centerY;
		this.radius = this.assignRadius();
		
		this.direction = null;
		this.moveCounter = 0;

		this.color = "#FF00FF";
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


// --- Getters

function getX(bacteria){
	return bacteria.centerX;
}

function getY(bacteria){
	return bacteria.centerY;
}

function getMouse(e){
	const rect = canvas.getBoundingClientRect()
    const x = e.clientX - rect.left
    const y = e.clientY - rect.top

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
	context.clearRect(0, 0, canvas.width, canvas.height);
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

function startGame(){
	canvas.removeEventListener("click", spawnBacteria);
	canvas.addEventListener("click", killBacteria);
}

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


function drawCircle(x, y, r, color){

	context.fillStyle = color;
	context.beginPath();
	context.arc(x, y, r, 0, 2 * Math.PI);
	context.fill();
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

	clearCircle(bacteria.centerX, bacteria.centerY, bacteria.radius);
    drawCircle(bacteria.centerX + dx, bacteria.centerY + dy, bacteria.radius, bacteria.color);
	bacteria.centerX += dx;
	bacteria.centerY += dy;

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

function killBacteria(e){

	const coords = getMouse(e);
	const cursorX = coords[0];
	const cursorY = coords[1];

	for (i = 0; i < bacterias.length; i++){
		
		if (isOnBacteria(bacterias[i], cursorX, cursorY)){
			clearCircle(bacterias[i].centerX, bacterias[i].centerY, bacterias[i].radius);
			bacterias.splice(i, 1);
		}
	}

}


const directions = [
					[1, 1],
					[1, 0],
					[0, 1],
					[-1, -1],
					[-1, 0],
					[0, -1],
				   ];

let bacterias = [];

let isPause = false;

let canvas = document.querySelector("canvas");
canvas.height = 700;
canvas.width = 900;

let context = canvas.getContext("2d");

const moveSize = 3;
const refreshRate = 17;

canvas.addEventListener("click", spawnBacteria);
document.querySelector("#pause_button").addEventListener("click", stopPlay);
document.querySelector("#reset_button").addEventListener("click", reset);
document.querySelector("#start_button").addEventListener("click", startGame);

let intervalId = setInterval(drawBacterias, refreshRate);
