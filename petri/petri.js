
// --- Getters

function get_x(bacteria){
	return bacteria[0];
}

function get_y(bacteria){
	return bacteria[1];
}

function getMouse(e){
	const rect = canvas.getBoundingClientRect()
    const x = e.clientX - rect.left
    const y = e.clientY - rect.top

    return [x, y];
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

// ---

// --- Button funtions

function reset(){
	eraseCanvas;
	bacterias = [];
}


function stopPlay(){
	isPause = !isPause;
}

// ---


// --- Drawing

function drawLine(x, y, x2, y2){
	context.save();
    context.beginPath();
	context.moveTo(x, y);
	context.lineTo(x2, y2);
	context.stroke();
	context.restore();
}


function drawCircle(x, y, r){

	context.fillStyle = "#000000";
	context.beginPath();
	context.arc(x, y, r, 0, 2 * Math.PI);
	context.fill();
	context.stroke();

}


function drawWeb(){

	for (i = 0; i < bacterias.length; i += 1){
		for (j = 0; j < bacterias.length; j += 1){
			drawLine(get_x(bacterias[i]), get_y(bacterias[i]),
				     get_x(bacterias[j]), get_y(bacterias[j])
				    );
		}
	}
}



function drawBacterias(e){

	if (isPause){
		return;
	}

	eraseCanvas();

	for (i = 0; i < bacterias.length; i += 1){

		let bacteria = bacterias[i];
		const new_coords = moveBacteria(bacteria[0], bacteria[1]);
		bacterias[i] = new_coords;

	}

	drawWeb();

}


function moveBacteria(center_x, center_y){

 	let dx = 0;
 	let dy = 0;

 	const pressed = keys[Math.floor(Math.random() * 4)];

    if (pressed == 37) {
      dx -= moveSize;
    }

    if (pressed == 39) {
      dx += moveSize;
    }
 
    if (pressed == 38) {
      dy -= moveSize;
    }
 
    if (pressed == 40) {
      dy += moveSize;
    }
 
	clearCircle(center_x, center_y, bacteriaRadius);

    drawCircle(center_x + dx, center_y + dy, bacteriaRadius)
	center_x += dx;
	center_y += dy;

	return [center_x, center_y];

}

// ---

function spawnBacteria(e){

	const coords = getMouse(e);
	const cursorX = coords[0];
	const cursorY = coords[1];

    drawCircle(cursorX, cursorY, bacteriaRadius);
    bacterias.push([cursorX, cursorY]);

}


let canvas = document.querySelector("canvas");
canvas.height = 700;
canvas.width = 700;

let context = canvas.getContext("2d");

const moveSize = 5;
const bacteriaRadius = 20;
const refreshRate = 20;

const keys = [37, 38, 39, 40];
let bacterias = [];

let isPause = false;

canvas.addEventListener("click", spawnBacteria);
document.querySelector("#pause_button").addEventListener("click", stopPlay);
document.querySelector("#reset_button").addEventListener("click", reset);

let intervalId = setInterval(drawBacterias, refreshRate);
