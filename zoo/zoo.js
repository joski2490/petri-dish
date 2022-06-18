
class Animal{

	constructor(name, race){
		this.name = name;
		this.race = race;
	}

}

class Sector{

	constructor(name){
		this.name = name;
		this.animals = [];
	}

	add_animal(animal){
		this.animals.push(animal);
	}
}

class Zoo{

	constructor(sectors){
		this.sectors = sectors;
	}

	add_sector(sector){
		this.sectors.push(sector);
	}
}


function print_status(msg){
	document.querySelector("#status_bar").textContent = msg;
}

function show_sector(sector){
	return sector.name;
}

function show_race(race){
	return race;
}

function add_animal(){
	
	let name = document.querySelector("#name_input").value;
	let race = document.querySelector("#races").value;
	let sector = document.querySelector("#sectors").value;

	let animal = new Animal(name, race);

	for (i = 0; i < zoo.sectors.length; i += 1){

		if (zoo.sectors[i].name == sector){
			zoo.sectors[i].add_animal(animal);

			print_status("Successfully added!");
			return;
		}
	}

	print_status("Error occured!");

}

function add_options(options, parent, show_func){
	for (i = 0; i < options.length; i += 1){

		const option = document.createElement("option");
		const text = document.createTextNode(show_func(options[i]));
		option.appendChild(text)
		parent.appendChild(option);

	}
}


let races = ["Tiger", "Lion", "Zebra"];

let terrarium = new Sector("Terrarium");
let sectors = [terrarium];

let zoo = new Zoo(sectors);

add_options(races, document.querySelector("#races"), show_race);
add_options(sectors, document.querySelector("#sectors"), show_sector);

document.querySelector("#add_button").addEventListener("click", add_animal);
