/******/ (function(modules) { // webpackBootstrap
/******/ 	// The module cache
/******/ 	var installedModules = {};
/******/
/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {
/******/
/******/ 		// Check if module is in cache
/******/ 		if(installedModules[moduleId]) {
/******/ 			return installedModules[moduleId].exports;
/******/ 		}
/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = installedModules[moduleId] = {
/******/ 			i: moduleId,
/******/ 			l: false,
/******/ 			exports: {}
/******/ 		};
/******/
/******/ 		// Execute the module function
/******/ 		modules[moduleId].call(module.exports, module, module.exports, __webpack_require__);
/******/
/******/ 		// Flag the module as loaded
/******/ 		module.l = true;
/******/
/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}
/******/
/******/
/******/ 	// expose the modules object (__webpack_modules__)
/******/ 	__webpack_require__.m = modules;
/******/
/******/ 	// expose the module cache
/******/ 	__webpack_require__.c = installedModules;
/******/
/******/ 	// define getter function for harmony exports
/******/ 	__webpack_require__.d = function(exports, name, getter) {
/******/ 		if(!__webpack_require__.o(exports, name)) {
/******/ 			Object.defineProperty(exports, name, {
/******/ 				configurable: false,
/******/ 				enumerable: true,
/******/ 				get: getter
/******/ 			});
/******/ 		}
/******/ 	};
/******/
/******/ 	// getDefaultExport function for compatibility with non-harmony modules
/******/ 	__webpack_require__.n = function(module) {
/******/ 		var getter = module && module.__esModule ?
/******/ 			function getDefault() { return module['default']; } :
/******/ 			function getModuleExports() { return module; };
/******/ 		__webpack_require__.d(getter, 'a', getter);
/******/ 		return getter;
/******/ 	};
/******/
/******/ 	// Object.prototype.hasOwnProperty.call
/******/ 	__webpack_require__.o = function(object, property) { return Object.prototype.hasOwnProperty.call(object, property); };
/******/
/******/ 	// __webpack_public_path__
/******/ 	__webpack_require__.p = "";
/******/
/******/ 	// Load entry module and return exports
/******/ 	return __webpack_require__(__webpack_require__.s = 0);
/******/ })
/************************************************************************/
/******/ ([
/* 0 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
	value: true
});
exports.ajaxStartGame = ajaxStartGame;
exports.createCanvas = createCanvas;
exports.ajaxEndGame = ajaxEndGame;
exports.Monster = Monster;
exports.levelUp = levelUp;
exports.loadGame = loadGame;
exports.dataLoader = dataLoader;
exports.startGame = startGame;
exports.gameOver = gameOver;
exports.newGame = newGame;
exports.getRandom = getRandom;
exports.getMonster = getMonster;
exports.reset = reset;
exports.update = update;
exports.drawLives = drawLives;
exports.render = render;
exports.closeMenu = closeMenu;
exports.openMenu = openMenu;
function ajaxStartGame() {

	var difficulty_game = void 0;
	switch (game.modifier) {
		case 0.7:
			difficulty_game = 'easy';
			break;
		case 1:
			difficulty_game = 'normal';
			break;
		case 1.3:
			difficulty_game = 'hard';
			break;
		default:
			difficulty_game = 'normal';
	}

	var user_game = document.querySelector("[data-user-id]").getAttribute("data-user-id");

	jQuery.ajax({
		type: "POST",
		datatype: "json",
		url: "/users/" + user_game + "/games",
		data: {
			"game": {
				"difficulty": difficulty_game
			}
		}
	});
}

function createCanvas() {
	return html2canvas(document.body, {
		onrendered: function onrendered(canvas) {
			return canvas.toDataURL('image/png');
		}
	});
}

function ajaxEndGame() {
	var image_game = createCanvas();
	var score_game = Number(soul_count.innerText);
}
//Enemy prototype
function Monster(params) {
	return {
		name: params.name,
		x: params.x,
		y: params.x,
		width: params.width,
		height: params.height,
		s_modifier: params.s_modifier,
		h_modifier: params.h_modifier,
		x_pos: params.x_pos,
		x_neg: params.x_neg,
		y_pos: params.y_pos,
		y_neg: params.y_neg,
		image: new Image()

	};
}

function levelUp(n) {
	game.catches += n;
}

function loadGame(modifier) {
	menu_sound.stop();
	game.modifier = modifier;
	var _iteratorNormalCompletion = true;
	var _didIteratorError = false;
	var _iteratorError = undefined;

	try {
		for (var _iterator = drawables[Symbol.iterator](), _step; !(_iteratorNormalCompletion = (_step = _iterator.next()).done); _iteratorNormalCompletion = true) {
			var i = _step.value;

			images_url.push("./assets/images/" + i.name + ".png");
			for (var j = 1; j < 9; j++) {
				images_url.push("./assets/images/" + i.name + "_" + j + ".png");
			}
		}
	} catch (err) {
		_didIteratorError = true;
		_iteratorError = err;
	} finally {
		try {
			if (!_iteratorNormalCompletion && _iterator.return) {
				_iterator.return();
			}
		} finally {
			if (_didIteratorError) {
				throw _iteratorError;
			}
		}
	}

	dataLoader(startGame);
}

function dataLoader(callback) {
	for (var i in images_url) {
		var img = new Image();
		images.push(img);
		img.onload = function () {
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
	// Let's play this game!
	reset();
	main();
}

function gameOver(key) {
	if (key === 114) {
		newGame();
	};
	if (game.lifes > 0) {
		reset();
	} else {
		hero.sound.play();
		game_over.style.visibility = "visible";
		game.playable = false;
		game.pause_sound.play();
	}
}

function newGame() {
	console.log('new game has started');
	monster = m_empty;
	game.catches = 0;
	main_menu.style.visibility = 'visible';
	main_menu.style.top = 0;
	time_out = 3;
	game_over.style.visibility = 'hidden';
	//game.playable = false;
}

//Random for various purposes
function getRandom(min, max) {
	return Math.random() * (max - min) + min;
}

//Create the second monster as needed
function getMonster() {
	danger_level = getRandom(0, 30);
	if (danger_level < 7) {
		return monster !== imp ? imp : revenant;
	} else if (danger_level < 13) {
		return monster !== revenant ? revenant : baron;
	} else if (danger_level < 18) {
		return monster !== baron ? baron : knight;
	} else if (danger_level < 22) {
		return monster !== knight ? knight : cyberdemon;
	} else if (danger_level < 25) {
		return monster !== cyberdemon ? cyberdemon : cacodemon;
	} else if (danger_level < 27) {
		return monster !== cacodemon ? cacodemon : mancubus;
	} else if (danger_level < 30) {
		return monster !== mancubus ? mancubus : spider;
	} else {
		return monster !== spider ? spider : imp;
	}
}

// Reset the game when the player catches a monster
function reset() {

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
	drawLives();

	//Chose monster based on life count
	if (game.catches < 4) {
		monster = imp;
	} else if (game.catches < 8) {
		monster = revenant;
	} else if (game.catches < 12) {
		monster = baron;
	} else if (game.catches < 15) {
		monster = knight;
	} else if (game.catches < 17) {
		monster = cyberdemon;
	} else if (game.catches < 21) {
		monster = cacodemon;
	} else if (game.catches < 26) {
		monster = mancubus;
	} else if (game.catches < 29) {
		monster = spider;
	} else {
		monster = boss;
	}

	//Add explanation texts
	white.explanation = "Indestructible";
	red.explanation = monster2.name + " appeared";
	blue.explanation = "Hero speed increased";
	green.explanation = monster.name + " speed decreased";
	life.explanation = "Life added";
	yellow.explanation = monster.name + " speed increased";

	//Chances of getting a Power Up
	var fun_level = getRandom(0, 20);

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
	monster.x = monster.width / 2 + Math.random() * (canvas.width - monster.width);
	monster.y = monster.width / 2 + Math.random() * (canvas.height - monster.width);

	//If the monster is too close, move it away
	if (monster.x > canvas.width * 0.5 - canvas.width * game.safe_area && monster.x < canvas.width * 0.5 + canvas.width * game.safe_area) {
		monster.x -= canvas.width * game.safe_area;
	}

	if (monster.y > canvas.height * 0.5 - canvas.height * game.safe_area && monster.y < canvas.height * 0.5 + canvas.height * game.safe_area) {
		monster.y -= canvas.height * game.safe_area;
	}

	// Throw the catchable somewhere on the screen randomly
	catchable.x = 32 + Math.random() * (canvas.width - 64);
	catchable.y = 32 + Math.random() * (canvas.height - 64);

	// Throw the powerup somewhere on the screen randomly
	if (fun_level > 6) {
		power_up.x = power_up.width / 2 + Math.random() * (canvas.width - power_up.width);
		power_up.y = power_up.width / 2 + Math.random() * (canvas.height - power_up.width);
	}

	game.playable = false;
	game.pause_sound.play();
	count_down.style.visibility = 'visible';
	count_down.style.opacity = 1;

	var x = 3;
	var interval = 700;

	for (var i = 0; i < x; i++) {
		setTimeout(function () {
			count_down.innerHTML = '<span>' + time_out + '</span>';
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

function update(modifier) {
	if (game.playable) {

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

		var elems = [monster, monster2, catchable];
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
		if (38 in keysDown) {
			// Player holding up
			hero.y -= hero.speed * modifier;
			hero.y_pos = true;
			if (hero.y < 0) {
				hero.y = 0;
			}
		}
		if (40 in keysDown) {
			// Player holding down
			hero.y += hero.speed * modifier;
			hero.y_neg = true;
			if (hero.y > canvas.height - hero.height) {
				hero.y = canvas.height - hero.height;
			}
		}
		if (37 in keysDown) {
			// Player holding left
			hero.x -= hero.speed * modifier;
			hero.x_neg = true;
			if (hero.x < 0) {
				hero.x = 0;
			}
		}
		if (39 in keysDown) {
			// Player holding right
			hero.x += hero.speed * modifier;
			hero.x_pos = true;
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
		} else if (!hero.y_pos && !hero.y_neg && !hero.x_pos && !hero.x_neg) {
			hero.image.src = "./assets/images/" + hero.name + ".png";
		}

		// If the hero touches the catchable
		if (hero.x <= catchable.x + catchable.width && catchable.x <= hero.x + catchable.width && hero.y <= catchable.y + catchable.height && catchable.y <= hero.y + catchable.height) {
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
		if (hero.x <= monster.x + monster.width && monster.x <= hero.x + monster.width && hero.y <= monster.y + monster.height && monster.y <= hero.y + monster.height) {
			if (hero.killable) {
				monster.sound.play();
				game.lifes--;
				if (game.lifes >= 3) {
					player_status.src = './assets/images/3_lifes.gif';
				} else if (game.lifes > 0) {
					player_status.src = './assets/images/' + game.lifes + '_lifes.gif';
				}
				gameOver();
			} else {
				monster = m_empty;
			}
		}

		// If the hero touches the second monster
		if (hero.x <= monster2.x + monster2.width && monster2.x <= hero.x + monster2.width && hero.y <= monster2.y + monster2.height && monster2.y <= hero.y + monster2.height && hero.killable) {
			monster2.sound.play();
			game.lifes--;
			if (game.lifes < 1) {
				gameOver();
			} else {
				reset();
			}
			player_status.src = './assets/images/' + game.lifes + '_lifes.gif';
		}

		//Allow user to catch the PowerUp
		if (hero.x <= power_up.x + power_up.width && power_up.x <= hero.x + power_up.width && hero.y <= power_up.y + power_up.height && power_up.y <= hero.y + power_up.height) {
			if (power_active.name !== 'lifes' && power_active.name !== 'red' && power_active.name !== 'empty') {
				power_active.src = "./assets/images/" + power_up.name + ".png";
			}
			catchable.sound.play();
			power_up_text.className = power_up.name;
			power_up_text.innerText = power_up.explanation;
			power_up.do();
			ctx.clearRect(power_up.x, power_up.y, power_up.width, power_up.height);
			power_up = empty;
		}
	}
}

//Check how many lives 
function drawLives() {
	life_count.innerHTML = "";
	if (game.lifes > 5) game.lifes = 5;
	for (var i = 0; i < game.lifes; i++) {
		var clone_img = life_img.cloneNode();
		life_count.appendChild(clone_img);
	}
}

// Draw everything
function render() {

	//Clear the canvas
	ctx.clearRect(0, 0, canvas.width, canvas.height);

	//Place the souls count
	soul_count.innerText = game.score < 10 ? '0' + game.score : game.score;

	// TODO: Check boxes for items so they all make sense
	// Hero rectangle
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

		//Monster Rectangle
		ctx.beginPath();
		ctx.lineWidth = "3";
		ctx.strokeStyle = "red";
		ctx.rect(monster2.x, monster2.y, monster2.width, monster2.height);
		ctx.stroke();
	}
}

function main() {
	var now = Date.now();
	var delta = now - then;

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

// module.exports = {
// 	ajaxStartGame,
// 	closeMenu,
// 	main,
// 	render,
// 	drawLives,
// 	update,
// 	reset,
// 	ajaxStartGame,
// 	createCanvas,
// 	ajaxEndGame,
// 	Monster,
// 	levelUp,
// 	loadGame,
// 	dataLoader
// 	startGame,
// 	gameOver,
// 	newGame,
// 	getRandom,
// 	getMonster,

// }

// pues amor porque aplicaste en primer lugar.Dale por lo menos un tiempo al trabajo y piensa que quieres hacer

/***/ })
/******/ ]);