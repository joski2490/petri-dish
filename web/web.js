
function getRandomColor(){

	const r = Math.floor(Math.random() * 256);
	const g = Math.floor(Math.random() * 256);
	const b = Math.floor(Math.random() * 256);

	const hexR = r.toString(16);
	const hexG = g.toString(16);
	const hexB = b.toString(16);

	return "#" + hexR + hexG + hexB;
}

function drawCircle(x, y, r){

	context.fillStyle = getRandomColor();
	context.beginPath();
	context.arc(x, y, r, 0, 2 * Math.PI);
	context.fill();
	context.stroke();

}

function drawLine(x, y, x2, y2){
    context.beginPath();
	context.moveTo(x, y);
	context.lineTo(x2, y2);
	context.stroke();
}

function drawWeb(e){

	let cursorX = e.pageX;
    let cursorY = e.pageY;

	for (i = 0; i < nodes.length; i += 1){
		drawLine(cursorX, cursorY, nodes[i][0], nodes[i][1]);
	}

    nodes.push([cursorX, cursorY]);
	drawCircle(cursorX, cursorY, 10);

}

let canvas = document.querySelector("canvas");
canvas.width = window.innerWidth;
canvas.height = window.innerHeight;

let context = canvas.getContext("2d");

let nodes = [];

document.querySelector("html").addEventListener("click", drawWeb);
