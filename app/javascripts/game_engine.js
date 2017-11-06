/*!
    Project: Catch & Run 
	Date: 08/14/2017
    Author: Nicolas M. Pardo
*/

/*jshint esversion: 6 */



// REQUIRE MODULES
import html2canvas from 'html2canvas';
require('howler');

jQuery.noConflict();


// EMPTY GLOBAL VARIABLES
let container,
	soul_count,
	life_count,
	player_status,
	power_active,
	pause_game,
	reload_game,
	close_menu,
	pause_menu,
	menu_overlay,
	menu_container,
	power_up_text,
	main_menu,
	count_down,
	easy_level,
	normal_level,
	hardcore_level,
	game_over,
	restart_game,
	life_img,
	reload_window,
	danger_level,
	canvas,
	monster2,
	time_out,
	life,
	then,
	ctx,
	mouse_x,
	mouse_y,
	game_info,
	game_container;


//EMPTY GLOBAL OBJECTS
let keysDown = {};
let yellow = {};
let red = {};
let green = {};
let blue = {};
let white = {};
let empty = {};
let imp = {};
let revenant = {};
let baron = {};
let knight = {};
let cyberdemon = {};
let cacodemon = {};
let mancubus = {};
let spider = {};
let boss = {};
let m_empty = {};
let power_up = {};
let monster = {};



// GLOBAL OBJECTS
let game = {
	playable: false,
	development: false,
	difficulty: 'easy',
	lifes: 3,
	x0: 0,
	y0: 0,
	catches: 0,
	score: 0,
	modifier: 1,
	power_up: "",
	pause_sound: new Howl({
		src: ['./assets/sounds/pause.mp3'],
		volume: 0.3,
		loop: true
	}),
	play_sound: new Howl({
		src: ['./assets/sounds/play.mp3'],
		volume: 0.3,
		loop: true
	}),
	menu_sound: new Howl({
		src: ['./assets/sounds/menu.mp3'],
		volume: 0.3,
		autoplay: true
	}),
	loaded: false,
	monster_rules: {
		speed: 1,
		health: 1
	},
	projectile_rule: {
		name: "shoot",
		speed: 4,
		damage: 5,
		width: 5,
		height: 5,
		color: '#66BF38',
		sound: new Howl({
			src: ['./assets/sounds/shoot.wav'],
			volume: 0.2
		})
	}
};

let hero = {
	name: "marine",
	speed: 256,
	x: 0,
	y: 0,
	width: 38,
	height: 56,
	health: 400,
	killable: true,
	weapon_size: 20,
	x_pos: false,
	x_neg: false,
	y_pos: false,
	y_neg: false,
	projectiles: [],
	image: new Image(),
	sound: new Howl({
		src: ['./assets/sounds/marine.wav']
	})
};


let catchable = {
	name: "lost_soul",
	x: 0,
	y: 0,
	width: 40,
	height: 40,
	speed: hero.speed * 0.3 * game.modifier,
	x_pos: false,
	x_neg: false,
	y_pos: false,
	y_neg: false,
	image: new Image(),
	sound: new Howl({
		src: ['./assets/sounds/lost_soul.wav']
	})
};



//Constants
const BACK_URL = game.development ? 'http://localhost:3000' : 'http://game.api.dakio.co';


// Set Headers if the cookies exist
jQuery(document).ajaxSend((event, request) => {
	if (Cookies.get('device_token')) {
		request.setRequestHeader(
			'APP-DEVICE-TOKEN', Cookies.get('device_token')
		);
	}
	if (Cookies.get('token')) {
		request.setRequestHeader(
			'APP-TOKEN', Cookies.get('token')
		);
	}
});


//CONSTRUCTORS
function Monster(new_monster) {
	if (!new_monster) {
		new_monster = {};
	}
	let params = Object.create(new_monster);
	params.name = params.name;
	params.x = params.x;
	params.y = params.x;
	params.width = params.width;
	params.height = params.height;
	params.s_modifier = params.s_modifier;
	params.health = params.s_modifier * hero.health * game.modifier;
	params.x_pos = params.x_pos;
	params.x_neg = params.x_neg;
	params.y_pos = params.y_pos;
	params.y_neg = params.y_neg;
	params.image = new Image();
	params.sound = new Howl({
		src: [`./assets/sounds/${params.name}.wav`]
	});
	params.death = new Howl({
		src: [`./assets/sounds/${params.name}_death.wav`]
	});
	params.die = function () {
		this.death.play();
		power_up = empty;
		game.score += Math.floor(50 * game.catches * game.modifier);
		if (monster.health <= 0) {
			monster = m_empty;
		}
		if (monster2.health <= 0) {
			monster2 = m_empty;
		}
	};
	return params;
}


function PowerUp(new_power_up) {
	if (!new_power_up) {
		new_power_up = {};
	}
	let params = Object.create(new_power_up);

	params.name = params.name;
	params.x = params.x;
	params.y = params.y;
	params.width = 37;
	params.height = 33;
	params.explanation = params.explanation;
	params.do = params.do;
	params.image = new Image();
	params.sound = new Howl({
		src: ['./assets/sounds/power_up.wav']
	});

	return params;
}

function Projectile(new_projectile) {
	let params = Object.create(new_projectile);
	params.active = true;
	params.damage = game.projectile_rule.damage;
	params.velocity = game.projectile_rule.speed;
	params.width = game.projectile_rule.width;
	params.height = game.projectile_rule.height;
	params.color = game.projectile_rule.color;
	params.flag = mouseLocation();

	params.impact = new Howl({
		src: [`./assets/sounds/impact.wav`]
	});

	params.insideCanvas = function () {
		if (
			params.x >= 0 &&
			params.x <= canvas.width &&
			params.y >= 0 &&
			params.y <= canvas.height) {
			return true;
		} else {
			return false;
		}
	};

	params.draw = function () {
		ctx.fillStyle = this.color;
		ctx.fillRect(this.x, this.y, this.width, this.height);
	};

	params.update = function () {
		if (this.flag.y_pos && this.flag.x_pos) { //Top right
			params.x += params.velocity;
			params.y += params.velocity;
		} else if (this.flag.x_neg && this.flag.y_pos) { //Top left
			params.x -= params.velocity;
			params.y += params.velocity;
		} else if (this.flag.x_pos && this.flag.y_neg) { //Bottom right
			params.x += params.velocity;
			params.y -= params.velocity;
		} else if (this.flag.x_neg && this.flag.y_neg) { //Bottom left
			params.x -= params.velocity;
			params.y -= params.velocity;
		} else if (this.flag.x_pos && !this.flag.y_pos && !this.flag.y_neg && !this.flag.x_neg) { //Right
			params.x += params.velocity;
		} else if (this.flag.x_neg && !this.flag.y_pos && !this.flag.y_neg && !this.flag.x_pos) { //left
			params.x -= params.velocity;
		} else if (this.flag.y_pos && !this.flag.x_pos && !this.flag.x_neg && !this.flag.y_neg) { // Top
			params.y += params.velocity;
		} else { // Bottom
			params.y -= params.velocity;
		}
		params.active = params.active && params.insideCanvas();
	};

	params.explotion = function () {
		self = this;
		self.impact.play();
		self.damage = 0;
		self.velocity = 0;
		for (let i = 0; i < 5; i++) {
			setTimeout(function () {
				this.x -= ((this.width * 1.01) - this.width) / 2;
				this.y -= ((this.height * 1.01) - this.height) / 2;
				self.color = blendColors(self.color, '#b02626', i / 10);
				self.width *= 1.01;
				self.height *= 1.01;
			}, 50);
		}
		setTimeout(function () {
			self.active = false;
		}, 251);
	};
	return params;

}


// FUNCTIONS
function devLog(object) {
	if (game.development) {
		console.log(object);
	}
}

function renderError(string) {
	if (typeof (string) === Array) {
		string = string[0];
	}
	let div = document.createElement('div');
	div.classList = 'error';
	div.innerHTML = `Oops: ${string}`;
	document.body.appendChild(div);
	setTimeout(function () {
		document.body.removeChild(div);
	}, 3000);
}


function detectCollition(object_1, object_2) {
	if (
		object_1.x <= (object_2.x + object_2.width) &&
		object_2.x <= (object_1.x + object_1.width) &&
		object_1.y <= (object_2.y + object_2.height) &&
		object_2.y <= (object_1.y + object_1.height)
	) {
		return true;
	} else {
		return false;
	}
}

function ajaxStartGame() {
	let difficulty_game = game.difficulty;
	let user_id = document.querySelector("#global [data-user=id]").innerText;
	jQuery.ajax({
		type: "POST",
		url: `${BACK_URL}/users/${user_id}/games/`,
		data: {
			game: {
				"difficulty": difficulty_game
			}
		},
		success: (data, status, info) => {
			devLog('ajax start game');
			if (data.success) {
				renderGame(data.game);
			} else {
				renderError('Game won\'t be saved');
			}
		},
		error: (data, status, info) => {
			renderError('Game won\'t be saved');
		}
	});
}

function createCanvas(callback) {
	html2canvas(game_container, {
		width: game_container.clientWidth,
		height: game_container.clientHeight,
		onrendered: function (canvas) {
			callback(canvas.toDataURL('image/jpg'));
		}
	});
}

function renderGame(game) {
	game_info.forEach((elem) => {
		elem.innerText = game[elem.dataset.game];
	});
}

function ajaxEndGame(image_game) {
	devLog('ajax end game');
	let user_id = document.querySelector('#global [data-user=id]').innerText;
	let game_id = document.querySelector('#global [data-game=id]').innerText;
	let score_game = Number(soul_count.innerText);
	jQuery.ajax({
		type: "PATCH",
		url: `${BACK_URL}/users/${user_id}/games/${game_id}`,
		data: {
			game: {
				id: game_id,
				score: score_game,
				img_path: image_game
			}
		},
		success: (data, status, info) => {},
	});
}

function loadGame(modifier) {

	//Resources for loader
	let drawables = [imp, revenant, baron, knight, cyberdemon, cacodemon, mancubus, spider, boss, hero, catchable];
	let images = [];
	let images_url = [];
	let images_ready = 0;
	time_out = 3;

	game.menu_sound.stop();
	game.modifier = modifier;

	for (let i of drawables) {
		images_url.push("./assets/images/" + i.name + ".png");
		for (let j = 1; j < 9; j++) {
			images_url.push("./assets/images/" + i.name + "_" + j + ".png");
		}
	}

	dataLoader(startGame, images, images_ready, images_url);
}

function dataLoader(callback, images, images_ready, images_url) {
	devLog('load game');
	for (let i in images_url) {
		let img = new Image();
		images.push(img);
		img.onload = () => {
			images_ready++;
			main_menu.style.top = -images_ready / images_url.length * 110 + "%";
			if (images_ready >= images_url.length) {
				callback();
			}
		};
		img.src = images_url[i];
	}
}

function startGame() {
	reset();
	main();
	ajaxStartGame();
}


function newGame() {
	ctx.restore();
	monster = m_empty;
	game.catches = 0;
	game.score = 0;
	main_menu.style.visibility = 'visible';
	main_menu.style.top = 0;
	time_out = 3;
	game_over.style.visibility = 'hidden';
	devLog('new game');
}

//Random for various purposes
function getRandom(min, max) {
	return Math.random() * (max - min) + min;
}

//Create the second monster as needed
function getMonster() {
	danger_level = getRandom(0, 30);
	if (danger_level < 7) {
		return monster.name !== 'imp' ? Object.create(imp) : Object.create(revenant);
	} else if (danger_level < 13) {
		return monster.name !== 'revenant' ? Object.create(revenant) : Object.create(baron);
	} else if (danger_level < 18) {
		return monster.name !== 'baron' ? Object.create(baron) : Object.create(knight);
	} else if (danger_level < 22) {
		return monster.name !== 'knight' ? Object.create(knight) : Object.create(cyberdemon);
	} else if (danger_level < 25) {
		return monster.name !== 'cyberdemon' ? Object.create(cyberdemon) : Object.create(cacodemon);
	} else if (danger_level < 27) {
		return monster.name !== 'cacodemon' ? Object.create(cacodemon) : Object.create(mancubus);
	} else if (danger_level < 30) {
		return monster.name !== 'mancubus' ? Object.create(mancubus) : Object.create(spider);
	} else {
		return monster.name !== 'spider' ? Object.create(spider) : Object.create(imp);
	}
}

// Reset the game when the player catches a monster
function reset() {
	devLog('reseted game');

	//Clear values that might have been changing through the level
	monster2 = m_empty;
	hero.killable = true;
	game.playable = false;
	game.pause_sound.play();
	power_active.src = "";
	power_up_text.innerText = "";
	pause_menu.style.visibility = 'hidden';
	game_over.style.visibility = 'hidden';
	time_out = 3;
	hero.projectiles = [];
	drawLives();

	//Chose monster based on life count
	if (game.catches < 4) {
		monster = Object.create(imp);
	} else if (game.catches < 8) {
		monster = Object.create(revenant);

	} else if (game.catches < 12) {
		monster = Object.create(baron);

	} else if (game.catches < 15) {
		monster = Object.create(knight);

	} else if (game.catches < 17) {
		monster = Object.create(cyberdemon);

	} else if (game.catches < 21) {
		monster = Object.create(cacodemon);

	} else if (game.catches < 26) {
		monster = Object.create(mancubus);

	} else if (game.catches < 29) {
		monster = Object.create(spider);

	} else {
		monster = Object.create(boss);
	}

	//Hero Functions
	hero.shoot = () => {
		hero.projectiles.push(Projectile({
			speed: game.projectile_rule.speed,
			x: hero.x + hero.width / 2,
			y: hero.y + hero.height / 2
		}));

		game.projectile_rule.sound.play();
	};


	//Chances of getting a Power Up
	let fun_level = getRandom(0, 20);

	if (fun_level < 6) {
		power_up = empty;
	} else if (fun_level < 10) {
		power_up = yellow;
	} else if (fun_level < 14) {
		power_up = red;
	} else if (fun_level < 17) {
		power_up = green;
	} else if (fun_level < 18) {
		power_up = blue;
	} else if (fun_level < 19) {
		power_up = white;
	} else if (fun_level < 20) {
		power_up = life;
	}

	//Hero will start in the middle of the canvas
	hero.x = canvas.width / 2;
	hero.y = canvas.height / 2;


	// Throw the monster somewhere on the screen randomly
	monster.x = (monster.width / 2) + (Math.random() * (canvas.width - monster.width));
	monster.y = (monster.width / 2) + (Math.random() * (canvas.height - monster.width));

	//If the monster is too close, move it away
	if (
		monster.x > (canvas.width * 0.5 - canvas.width * game.safe_area) &&
		monster.x < (canvas.width * 0.5 + canvas.width * game.safe_area)
	) {
		monster.x -= canvas.width * game.safe_area;
	}

	if (
		monster.y > (canvas.height * 0.5 - canvas.height * game.safe_area) &&
		monster.y < (canvas.height * 0.5 + canvas.height * game.safe_area)
	) {
		monster.y -= canvas.height * game.safe_area;
	}

	// Throw the catchable somewhere on the screen randomly
	catchable.x = 32 + (Math.random() * (canvas.width - 64));
	catchable.y = 32 + (Math.random() * (canvas.height - 64));

	// Throw the powerup somewhere on the screen randomly
	if (fun_level > 6) {
		power_up.x = (power_up.width / 2) + (Math.random() * (canvas.width - power_up.width));
		power_up.y = (power_up.width / 2) + (Math.random() * (canvas.height - power_up.width));
	}

	game.playable = false;
	game.pause_sound.play();
	count_down.style.visibility = 'visible';
	count_down.style.opacity = 1;


	let x = 3;
	let interval = 700;

	for (let i = 0; i < x; i++) {
		setTimeout(() => {
			count_down.innerHTML = `<span>${time_out}</span>`;
			time_out--;
			count_down.style.opacity -= 0.25;
		}, i * interval);
	}
	setTimeout(function () {
		count_down.style.opacity = 0;
		count_down.style.visibility = 'hidden';
		game.playable = true;
		game.play_sound.play();
		time_out = 3;
	}, 2101);




}

document.onclick = () => {
	if (game.playable) {
		hero.shoot();
	}
};




function mouseLocation() {

	let flag = {
		x_pos: false,
		y_pos: false,
		x_neg: false,
		y_neg: false
	};

	if (mouse_x > hero.x) {
		flag.x_pos = true;
		flag.x_neg = false;
	}
	if (mouse_y > hero.y) {
		flag.y_pos = true;
		flag.y_neg = false;
	}
	if (mouse_x < hero.x) {
		flag.x_neg = true;
		flag.x_pos = false;
	}
	if (mouse_y < hero.y) {
		flag.y_neg = true;
		flag.y_pos = false;
	}

	if (mouse_y > hero.y && mouse_y < hero.y + hero.height) {
		flag.y_neg = false;
		flag.y_pos = false;
	}

	if (mouse_x > hero.x && mouse_x < hero.x + hero.width) {
		flag.x_neg = false;
		flag.x_pos = false;
	}

	return flag;

}


function canYouPlay() {
	return (
		game.playable &&
		pause_menu.style.visibility === 'hidden' &&
		game_over.style.visibility === 'hidden' &&
		count_down.style.visibility === 'hidden'
	);
}

function gameOver(key) {
	devLog('game over');
	if (key === 114) {
		newGame();
	}
	if (game.lifes > 0) {
		reset();
	} else {
		hero.sound.play();
		game_over.style.visibility = "visible";
		game.playable = false;
		game.pause_sound.play();
		createCanvas(ajaxEndGame);
	}
}

function blendColors(c0, c1, p) {
	let f = parseInt(c0.slice(1), 16),
		t = parseInt(c1.slice(1), 16),
		R1 = f >> 16,
		G1 = f >> 8 & 0x00FF,
		B1 = f & 0x0000FF,
		R2 = t >> 16,
		G2 = t >> 8 & 0x00FF,
		B2 = t & 0x0000FF;
	return "#" + (0x1000000 + (Math.round((R2 - R1) * p) + R1) * 0x10000 + (Math.round((G2 - G1) * p) + G1) * 0x100 + (Math.round((B2 - B1) * p) + B1)).toString(16).slice(1);
}

function update(modifier) {
	if (canYouPlay()) {
		//Move Bullets
		hero.projectiles.forEach(function (projectile) {
			projectile.update();
			if (detectCollition(projectile, monster)) {
				monster.health -= projectile.damage;
				projectile.explotion();
				if (monster.health <= 0) {
					monster2.die();
				}
			}
			if (detectCollition(projectile, monster2)) {
				monster2.health -= projectile.damage;
				projectile.explotion();
				if (monster2.health <= 0) {
					monster2.die();
				}
			}
		});

		//Only active bullets to avoid overloading the canvas
		hero.projectiles = hero.projectiles.filter(function (projectile) {
			return projectile.active;
		});

		//Move monster
		if (hero.x > monster.x) {
			monster.x += monster.speed * modifier;
			monster.x_pos = true;
			monster.x_neg = false;
			if (monster.x > canvas.width - monster.width) {
				monster.x = canvas.width - monster.width;
				monster.x_pos = false;
			}
		}
		if (hero.x < monster.x) {
			monster.x -= monster.speed * modifier;
			monster.x_neg = true;
			monster.x_pos = false;
			if (monster.x < 0) {
				monster.x = 0;
				monster.x_neg = false;
			}
		}
		if (hero.y > monster.y) {
			monster.y += monster.speed * modifier;
			monster.y_pos = true;
			monster.y_neg = false;
			if (monster.y > canvas.height - monster.height) {
				monster.y = canvas.height - monster.height;
				monster.y_pos = false;
			}
		}
		if (hero.y < monster.y) {
			monster.y -= monster.speed * modifier;
			monster.y_neg = true;
			monster.y_pos = false;
			if (monster.y < 0) {
				monster.y = 0;
				monster.y_neg = false;
			}
		}
		if (monster.x === hero.x) {
			monster.x_pos = false;
			monster.x_neg = false;
		}
		if (monster.y === hero.y) {
			monster.y_pos = false;
			monster.y_neg = false;
		}

		//Move second monster
		if (hero.x > monster2.x) {
			monster2.x += monster2.speed * modifier;
			monster2.x_pos = true;
			monster2.x_neg = false;
			if (monster2.x > canvas.width - monster2.width) {
				monster2.x = canvas.width - monster2.width;
				monster2.x_pos = false;
			}
		}
		if (hero.x < monster2.x) {
			monster2.x -= monster2.speed * modifier;
			monster2.x_neg = true;
			monster2.x_pos = false;
			if (monster2.x < 0) {
				monster2.x = 0;
				monster2.x_neg = false;
			}
		}

		if (hero.y > monster2.y) {
			monster2.y += monster2.speed * modifier;
			monster2.y_pos = true;
			monster2.y_neg = false;
			if (monster2.y > canvas.height - monster2.height) {
				monster2.y = canvas.height - monster2.height;
				monster2.y_pos = false;
			}
		}
		if (hero.y < monster2.y) {
			monster2.y -= monster2.speed * modifier;
			monster2.y_neg = true;
			monster2.y_pos = false;
			if (monster2.y < 0) {
				monster2.y = 0;
				monster2.y_neg = false;
			}
		}
		if (monster2.x === hero.x) {
			monster2.x_pos = false;
			monster2.x_neg = false;
		}
		if (monster2.y === hero.y) {
			monster2.y_pos = false;
			monster2.y_neg = false;
		}


		//Move catchable
		if (hero.x < catchable.x) {
			catchable.x += catchable.speed * modifier;
			catchable.x_pos = true;
			catchable.x_neg = false;
			if (catchable.x > canvas.width - catchable.width) {
				catchable.x = canvas.width - catchable.width;
				catchable.x_pos = false;
			}
		}
		if (hero.x > catchable.x) {
			catchable.x -= catchable.speed * modifier;
			catchable.x_neg = true;
			catchable.x_pos = false;
			if (catchable.x < 0) {
				catchable.x = 0;
				catchable.x_neg = false;
			}

		}
		if (hero.y < catchable.y) {
			catchable.y += catchable.speed * modifier;
			catchable.y_pos = true;
			catchable.y_neg = false;
			if (catchable.y > canvas.height - catchable.height) {
				catchable.y = canvas.height - catchable.height;
				catchable.y_pos = false;
			}
		}
		if (hero.y > catchable.y) {
			catchable.y -= catchable.speed * modifier;
			catchable.y_neg = true;
			catchable.y_pos = false;

			if (catchable.y < 0) {
				catchable.y = 0;
				catchable.y_neg = false;
			}
		}
		if (catchable.x === hero.x) {
			catchable.x_pos = false;
			catchable.x_neg = false;
		}
		if (catchable.y === hero.y) {
			catchable.y_pos = false;
			catchable.y_neg = false;
		}



		let elems = [monster, monster2, catchable];
		elems.forEach(function (elem, i) {
			if (elem.y_pos && elem.x_pos) {
				elem.image.src = "./assets/images/" + elem.name + "_2.png";
			} else if (elem.x_pos && elem.y_neg) {
				elem.image.src = "./assets/images/" + elem.name + "_4.png";
			} else if (elem.x_neg && elem.y_neg) {
				elem.image.src = "./assets/images/" + elem.name + "_6.png";
			} else if (elem.x_neg && elem.y_pos) {
				elem.image.src = "./assets/images/" + elem.name + "_8.png";
			} else if (elem.y_pos && !elem.x_pos && !elem.x_neg) {
				elem.image.src = "./assets/images/" + elem.name + "_1.png";
			} else if (elem.x_pos && !elem.y_pos && !elem.y_neg && !elem.x_neg) {
				elem.image.src = "./assets/images/" + elem.name + "_3.png";
			} else if (elem.x_neg && !elem.y_pos && !elem.y_neg && !elem.x_pos) {
				elem.image.src = "./assets/images/" + elem.name + "_7.png";
			} else if (elem.y_neg && !elem.x_pos && !elem.x_neg && !elem.y_pos) {
				elem.image.src = "./assets/images/" + elem.name + "_5.png";
			} else if (!elem.y_pos && !elem.y_neg && !elem.x_pos && !elem.x_neg) {
				elem.image.src = "./assets/images/" + elem.name + ".png";
			}
		});


		//Move user


		if (87 in keysDown) { // Player holding up
			hero.y -= hero.speed * modifier;
			hero.y_pos = true;
			hero.y_neg = false;
			if (hero.y < 0) {
				hero.y = 0;
			}
		}
		if (83 in keysDown) { // Player holding down
			hero.y += hero.speed * modifier;
			hero.y_neg = true;
			hero.y_pos = false;
			if (hero.y > canvas.height - hero.height) {
				hero.y = canvas.height - hero.height;
			}
		}
		if (65 in keysDown) { // Player holding left
			hero.x -= hero.speed * modifier;
			hero.x_neg = true;
			hero.x_pos = false;
			if (hero.x < 0) {
				hero.x = 0;
			}
		}
		if (68 in keysDown) { // Player holding right
			hero.x += hero.speed * modifier;
			hero.x_pos = true;
			hero.x_neg = false;
			if (hero.x > canvas.width - hero.width) {
				hero.x = canvas.width - hero.width;
			}
		}

		//Bind sprite to hero movement
		if (hero.y_pos && hero.x_pos) {
			hero.image.src = "./assets/images/" + hero.name + "_2.png";
		} else if (hero.x_pos && hero.y_neg) {
			hero.image.src = "./assets/images/" + hero.name + "_4.png";
		} else if (hero.x_neg && hero.y_neg) {
			hero.image.src = "./assets/images/" + hero.name + "_6.png";
		} else if (hero.x_neg && hero.y_pos) {
			hero.image.src = "./assets/images/" + hero.name + "_8.png";
		} else if (hero.y_pos && !hero.x_pos && !hero.x_neg) {
			hero.image.src = "./assets/images/" + hero.name + "_1.png";
		} else if (hero.x_pos && !hero.y_pos && !hero.y_neg && !hero.x_neg) {
			hero.image.src = "./assets/images/" + hero.name + "_3.png";
		} else if (hero.x_neg && !hero.y_pos && !hero.y_neg && !hero.x_pos) {
			hero.image.src = "./assets/images/" + hero.name + "_7.png";
		} else if (hero.y_neg && !hero.x_pos && !hero.x_neg && !hero.y_pos) {
			hero.image.src = "./assets/images/" + hero.name + "_5.png";
		} else {
			hero.image.src = "./assets/images/" + hero.name + ".png";
		}

		// If the hero touches the catchable
		if (
			detectCollition(hero, catchable)
		) {
			game.catches++;
			if (monster2 != m_empty) {
				game.score += 100 * game.modifier;
			}
			game.score += 100 * game.modifier;
			catchable.sound.play();
			hero.killable = true;

			reset();

		}

		// If the hero touches the monster            
		if (
			detectCollition(hero, monster)
		) {
			if (hero.killable) {
				monster.sound.play();
				game.lifes--;
				if (game.lifes >= 3) {
					player_status.src = `./assets/images/3_lifes.gif`;
				} else if (game.lifes > 0) {
					player_status.src = `./assets/images/${game.lifes}_lifes.gif`;
				}
				gameOver();
			} else {
				monster.health = 0;
				monster.die();
			}
		}

		// If the hero touches the second monster
		if (
			detectCollition(hero, monster2)
		) {
			if (hero.killable) {
				monster2.sound.play();
				game.lifes--;
				if (game.lifes < 1) {
					gameOver();
				} else {
					reset();
				}
				player_status.src = `./assets/images/${game.lifes}_lifes.gif`;
			} else {
				monster2.health = 0;
				monster2.die();
			}
		}


		//Allow user to catch the PowerUp
		if (
			detectCollition(hero, power_up)
		) {
			if (power_active.name === 'white' ||
				power_active.name === 'blue') {
				power_active.src = "./assets/images/" + power_up.name + ".png";
			}
			catchable.sound.play();
			power_up_text.classList.add(power_up.name);
			power_up.do();
			power_up_text.innerText = power_up.explanation(hero, monster, monster2);
			ctx.clearRect(power_up.x, power_up.y, power_up.width, power_up.height);
			power_up = empty;
		}



	}
}

//Check how many lives 
function drawLives() {
	life_count.innerHTML = "";
	if (game.lifes > 5) game.lifes = 5;
	for (let i = 0; i < game.lifes; i++) {
		let clone_img = life_img.cloneNode();
		life_count.appendChild(clone_img);
	}
}

// Draw everything
function render() {

	//Clear the canvas
	ctx.clearRect(0, 0, canvas.width, canvas.height);

	//Place the souls count
	soul_count.innerText = game.score < 10 ? '0' + game.score : game.score;


	// Hero rectangle
	if (game.development) {
		ctx.beginPath();
		ctx.lineWidth = "3";
		ctx.strokeStyle = "blue";
		ctx.rect(hero.x, hero.y, hero.width, hero.height);
		ctx.stroke();

		//Catchable Rectangle
		ctx.beginPath();
		ctx.lineWidth = "3";
		ctx.strokeStyle = "green";
		ctx.rect(catchable.x, catchable.y, catchable.width, catchable.height);
		ctx.stroke();

		//Monster Rectangle
		ctx.beginPath();
		ctx.lineWidth = "3";
		ctx.strokeStyle = "red";
		ctx.rect(monster.x, monster.y, monster.width, monster.height);
		ctx.stroke();
	}

	hero.projectiles.forEach(function (projectile) {
		projectile.draw();
	});

	//Draw hero and catchable
	ctx.drawImage(hero.image, hero.x, hero.y);
	ctx.drawImage(catchable.image, catchable.x, catchable.y);
	ctx.drawImage(monster.image, monster.x, monster.y);



	//Draw Power Up
	power_up.image.src = "./assets/images/" + power_up.name + ".png";
	ctx.drawImage(power_up.image, power_up.x, power_up.y);

	//Draw second monster
	if (monster2 !== m_empty) {
		ctx.drawImage(monster2.image, monster2.x, monster2.y);

		if (game.development) {
			//Monster Rectangle
			ctx.beginPath();
			ctx.lineWidth = "3";
			ctx.strokeStyle = "red";
			ctx.rect(monster2.x, monster2.y, monster2.width, monster2.height);
			ctx.stroke();
		}
	}

}

//Call initial functions
function main() {
	let now = Date.now();
	let delta = now - then;

	update(delta / 1000);
	render();

	then = now;

	// Request to do this again ASAP
	requestAnimationFrame(main);
}

function closeMenu() {
	pause_menu.style.visibility = 'hidden';
	game.playable = true;
	game.play_sound.play();
}

function openMenu() {
	pause_menu.style.visibility = 'visible';
	game.playable = false;
	game.pause_sound.play();
}


// Listen for mouse movement
document.onmousemove = function (e) {
	mouse_x = e.pageX - 64;
	mouse_y = e.pageY - 64;
};

// RESIZE CANVAS
window.onresize = function () {
	if (game.loaded) {
		canvas.width = container.clientWidth - 128;
		canvas.height = container.clientHeight - 128;
	}
};


// FUNCTION FOR LOADED PAGE
window.onload = function () {
	game.loaded = true;
	//Create monsters
	imp = Monster({
		name: "imp",
		width: 41,
		height: 57,
		s_modifier: 0.3,
		health: 300
	});


	revenant = Monster({
		name: "revenant",
		width: 49,
		height: 71,
		s_modifier: 0.35,
		h_modifier: 0.65
	});
	baron = Monster({
		name: "baron",
		width: 49,
		height: 74,
		s_modifier: 0.4,
		h_modifier: 0.8
	});
	knight = Monster({
		name: "knight",
		width: 52,
		height: 74,
		s_modifier: 0.45,
		h_modifier: 0.85
	});
	cyberdemon = Monster({
		name: "cyberdemon",
		width: 85,
		height: 109,
		s_modifier: 0.55,
		h_modifier: 0.9
	});
	cacodemon = Monster({
		name: "cacodemon",
		width: 63,
		height: 65,
		s_modifier: 0.65,
		h_modifier: 0.7
	});
	mancubus = Monster({
		name: "mancubus",
		width: 164,
		height: 140,
		s_modifier: 0.6,
		h_modifier: 1.4
	});
	spider = Monster({
		name: "spider",
		width: 194,
		height: 106,
		s_modifier: 0.7,
		h_modifier: 1.3
	});
	boss = Monster({
		name: "final_boss",
		width: 746,
		height: 310,
		s_modifier: 0.5,
		h_modifier: 3
	});
	m_empty = Monster({});
	monster2 = m_empty;

	// Create powerups
	yellow = PowerUp({
		name: "yellow",
		explanation: (hero, monster, monster2) => {
			return monster.name + " speed increased";
		},
		do: () => {
			game.monster_rules.speed *= 1.3;
		}
	});
	white = PowerUp({
		name: "white",
		explanation: (hero, monster, monster2) => {
			return "Indestructible";
		},
		do: () => {
			hero.killable = false;
		}
	});
	red = PowerUp({
		name: "red",
		explanation: (hero, monster, monster2) => {
			return `${monster2.name} appeared`;
		},
		do: () => {
			let random_monster = getMonster();
			random_monster.x = 0;
			random_monster.y = 0;
			random_monster.x_neg = false;
			random_monster.x_pos = false;
			random_monster.y_pos = false;
			random_monster.y_neg = false;
			monster2 = random_monster;
			return monster2;
		}
	});
	blue = PowerUp({
		name: "blue",
		explanation: (hero, monster, monster2) => {
			return "Hero speed increased";
		},
		do: () => {
			hero.speed *= 1.2;
		}
	});
	green = PowerUp({
		name: "green",
		explanation: (hero, monster, monster2) => {
			return `${monster.name} speed decreased`;
		},
		do: () => {
			game.monster_rules.speed *= 0.8;
		}
	});

	life = PowerUp({
		name: "life",
		explanation: (hero, monster, monster2) => {
			return "Life added";
		},
		do: () => {
			game.lifes++;
			drawLives();
		}
	});
	empty = PowerUp({
		name: "empty",
		explanation: (hero, monster, monster2) => {
			return "";
		},
	});



	game.menu_sound.play();

	//Get Elements
	container = document.getElementById('canvas_container');
	soul_count = document.getElementById('souls_count');
	life_count = document.getElementById('life_count');
	player_status = document.getElementById('player_status');
	power_active = document.getElementById('power_active');
	pause_game = document.getElementById('pause_game');
	reload_game = document.getElementById('reload_game');
	close_menu = document.getElementById('close_menu');
	pause_menu = document.getElementById('pause_menu');
	menu_overlay = document.querySelector('.menu_overlay');
	menu_container = document.querySelector('.menu_container');
	power_up_text = document.getElementById('power_up_text');
	main_menu = document.getElementById('main_menu');
	count_down = document.getElementById('count_down');
	easy_level = document.getElementById('easy_level');
	normal_level = document.getElementById('normal_level');
	hardcore_level = document.getElementById('hardcore_level');
	game_over = document.getElementById('game_over');
	restart_game = document.getElementById('restart_game');
	reload_window = document.getElementById('reload_window');
	game_container = document.getElementById('game_container');

	//HTMLCollections
	game_info = document.querySelectorAll('.game_info');


	//Create image
	life_img = document.createElement('img');

	//Basic state of elements
	life_img.src = './assets/images/life.png';
	pause_menu.style.visibility = 'hidden';
	count_down.style.visibility = 'hidden';
	game_over.style.visibility = 'hidden';

	//Generate canvas
	canvas = document.createElement('canvas');
	ctx = canvas.getContext('2d');

	//Set canvas size as window size
	canvas.width = container.clientWidth - 128;
	canvas.height = container.clientHeight - 128;
	container.appendChild(canvas);

	game.safe_area = 0.2 / game.modifier;

	// Hero image
	hero.image.src = "./assets/images/" + hero.name + ".png";
	catchable.image.src = "./assets/images/lost_soul.png";


	//Add data to each monster
	imp.speed = hero.speed * imp.s_modifier * game.modifier * game.monster_rules.speed;
	imp.image.src = "./assets/images/imp.png";

	revenant.speed = hero.speed * revenant.s_modifier * game.modifier * game.monster_rules.speed;
	revenant.image.src = "./assets/images/revenant.png";

	baron.speed = hero.speed * baron.s_modifier * game.modifier * game.monster_rules.speed;
	baron.image.src = "./assets/images/baron.png";

	knight.speed = hero.speed * knight.s_modifier * game.modifier * game.monster_rules.speed;
	knight.image.src = "./assets/images/knight.png";

	cyberdemon.speed = hero.speed * knight.s_modifier * game.modifier * game.monster_rules.speed;
	cyberdemon.image.src = "./assets/images/cyberdemon.png";

	cacodemon.speed = hero.speed * cacodemon.s_modifier * game.modifier * game.monster_rules.speed;
	cacodemon.image.src = "./assets/images/cacodemon.png";

	mancubus.speed = hero.speed * mancubus.s_modifier * game.modifier * game.monster_rules.speed;
	mancubus.image.src = "./assets/images/mancubus.png";

	spider.speed = hero.speed * spider.s_modifier * game.modifier * game.monster_rules.speed;
	spider.image.src = "./assets/images/spider.png";

	boss.speed = hero.speed * boss.s_modifier * game.modifier * game.monster_rules.speed;
	boss.image.src = "./assets/images/final_boss.png";

	m_empty.name = "empty";
	m_empty.health = 0;



	// Handle keyboard controls
	addEventListener("keydown", function (e) {
		keysDown[e.keyCode] = true;
	}, false);

	addEventListener("keyup", function (e) {
		delete keysDown[e.keyCode];

		if (Object.keys(keysDown).length <= 0) {
			hero.y_pos = false;
			hero.y_neg = false;
			hero.x_pos = false;
			hero.x_neg = false;
		}

		//Reset X-
		if (e.keycode === 65) {
			hero.x_neg = false;
		}

		//Reset X+
		if (e.keycode === 68) {
			hero.x_pos = false;
		}

		//Reset Y-
		if (e.keycode === 83) {
			hero.y_neg = false;
		}

		//Reset Y+
		if (e.keycode === 87) {
			hero.y_pos = false;
		}


	}, false);



	easy_level.addEventListener('click', function () {
		loadGame(0.7);
		game.difficulty = 'easy';
	});
	normal_level.addEventListener('click', function () {
		loadGame(1);
		game.difficulty = 'normal';
	});
	hardcore_level.addEventListener('click', function () {
		loadGame(1.3);
		game.difficulty = 'hard';
	});

	game.play_sound.on('play', function () {
		game.pause_sound.pause();
	});

	game.pause_sound.on('play', function () {
		game.play_sound.pause();
	});


	// Cross-browser support for requestAnimationFrame
	let w = window;
	requestAnimationFrame = w.requestAnimationFrame || w.webkitRequestAnimationFrame || w.msRequestAnimationFrame || w.mozRequestAnimationFrame;



	//Close menu
	menu_container.addEventListener('click', function (e) {
		e.stopPropagation();
	}, false);
	close_menu.addEventListener('click', closeMenu, false);
	menu_overlay.addEventListener('click', closeMenu, false);

	//Show Menu
	pause_game.addEventListener('click', openMenu, false);
	document.addEventListener('blur', openMenu, false);

	//Restart Game
	restart_game.addEventListener('click', function () {
		game.lifes = 3;
		game.catches = 0;
		renderGame({
			id: ''
		});
		startGame();
		reset();
	}, false);
	reload_game.addEventListener('click', function () {
		newGame();
	}, false);
	reload_window.addEventListener('click', function () {
		newGame();
	}, false);



	//Reload if need
	pause_game.addEventListener('click', openMenu, false);

	//Clear explanation text
	power_up_text.innerText = "";
	then = Date.now();

	devLog('game fully laoded');

};