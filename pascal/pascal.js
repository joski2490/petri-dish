
function factorial(n){

	let result = 1;

	for (i = 1; i <= n; i += 1){
		result *= i
	}

	return result;

}

function get_combination_number(n, k){

	return factorial(n) / (factorial(k) * factorial(n - k))
}

function pascal_line(n){

	let numbers = [];

	for (k = 0; k <= n; k += 1){
		numbers.push(get_combination_number(n, k));
	}

	return numbers;

}

function show_line(){

	const p = document.createElement("p");
	const text = document.createTextNode(pascal_line(n).join(" "));
	p.appendChild(text);

	const element = document.querySelector("html");
	element.appendChild(p);

	n += 1;

}

let n = 0;

document.querySelector("html").addEventListener("click", show_line);
