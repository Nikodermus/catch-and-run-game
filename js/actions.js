/*!
    Project: Catch & Run
    Date: 08/14/2017
    Author: Nicolas M. Pardo
*/


var game = {
    playable: false,
    lifes: 3,
    x0: 0,
    y0: 0,
    catches: 0,
    modifier: 1,
    power_up: "",
    pause_sound: new Howl({
        src: ['./sounds/pause.mp3'],
        volume: 0.3,
        loop: true
    }),
    play_sound: new Howl({
        src: ['./sounds/play.mp3'],
        volume: 0.3,
        loop: true
    })

};

var menu_sound = new Howl({
    src: ['./sounds/menu.mp3'],
    volume: 0.3,
    autoplay: true
});

menu_sound.play();



window.onload = function () {


    //Get Elements
    var container = document.getElementById('CanvasContainer');
    var soul_count = document.getElementById('SoulsCount');
    var life_count = document.getElementById('LifeCount');
    var player_status = document.getElementById('PlayerStatus');
    var power_active = document.getElementById('PowerActive');
    var pause_game = document.getElementById('PauseGame');
    var reload_game = document.getElementById('ReloadGame');
    var close_menu = document.getElementById('CloseMenu');
    var pause_menu = document.getElementById('PauseMenu');
    var menu_overlay = document.querySelector('.menu_overlay');
    var menu_container = document.querySelector('.menu_container');
    var power_up_text = document.getElementById('PowerUpText');
    var main_menu = document.getElementById('MainMenu');
    var count_down = document.getElementById('CountDown');
    var easy_level = document.getElementById('EasyLevel');
    var normal_level = document.getElementById('NormalLevel');
    var hardcore_level = document.getElementById('HardcoreLevel');
    var game_over = document.getElementById('GameOver');
    var restart_game = document.getElementById('RestartGame');
    var reload_window = document.getElementById('ReloadWindow');


    //Create image
    var life_img = document.createElement('img');

    //Basic state of elements
    life_img.src = './img/life.png';
    pause_menu.style.visibility = 'hidden';
    count_down.style.visibility = 'hidden';
    game_over.style.visibility = 'hidden';

    //Generate canvas
    var canvas = document.createElement('canvas');
    var ctx = canvas.getContext('2d');

    //Set canvas size as window size
    canvas.width = container.clientWidth - 128;
    canvas.height = container.clientHeight - 128;
    container.appendChild(canvas);

    //Resize canvas to fit window
    window.onresize = function () {
        canvas.width = container.clientWidth - 128;
        canvas.height = container.clientHeight - 128;
    };

    game.safe_area = 0.2 / game.modifier;

    var hero = {
        name: "marine",
        speed: 256,
        x: 0,
        y: 0,
        width: 38,
        height: 56,
        killable: true,
        weapon_size: 20,
        x_pos: false,
        x_neg: false,
        y_pos: false,
        y_neg: false,
        image: new Image(),
        sound: new Howl({
            src: ['./sounds/marine.wav']
        })
    };
    var time_out = 3;

    // Hero image
    hero.image.src = "./img/" + hero.name + ".png";

    //Catchable object
    var catchable = {
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
            src: ['./sounds/lost_soul.wav']
        })
    };

    // Catchable image
    catchable.image.src = "./img/lost_soul.png";

    //Enemy prototype
    var Monster = function (params) {
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
    };



    //Create monsters
    var imp = Monster({});
    var revenant = Monster({});
    var baron = Monster({});
    var knight = Monster({});
    var cyberdemon = Monster({});
    var cacodemon = Monster({});
    var mancubus = Monster({});
    var spider = Monster({});
    var boss = Monster({});
    var m_empty = Monster({});

    //Empty container for monsters
    var monster, monster2, danger_level;

    //Add data to each monster
    imp.name = "imp";
    imp.width = 41;
    imp.height = 57;
    imp.s_modifier = 0.3;
    imp.h_modifier = 0.6;
    imp.speed = hero.speed * imp.s_modifier * game.modifier;
    imp.image.src = "./img/imp.png";
    imp.sound = new Howl({
        src: ['./sounds/imp.wav']
    });

    revenant.name = "revenant";
    revenant.width = 49;
    revenant.height = 71;
    revenant.s_modifier = 0.35;
    revenant.h_modifier = 0.65;
    revenant.speed = hero.speed * revenant.s_modifier * game.modifier;
    revenant.image.src = "./img/revenant.png";
    revenant.sound = new Howl({
        src: ['./sounds/revenant.wav']
    });

    baron.name = "baron";
    baron.width = 49;
    baron.height = 74;
    baron.s_modifier = 0.4;
    baron.h_modifier = 0.8;
    baron.speed = hero.speed * baron.s_modifier * game.modifier;
    baron.image.src = "./img/baron.png";
    baron.sound = new Howl({
        src: ['./sounds/baron.wav']
    });

    knight.name = "knight";
    knight.width = 52;
    knight.height = 74;
    knight.s_modifier = 0.45;
    knight.h_modifier = 0.85;
    knight.speed = hero.speed * knight.s_modifier * game.modifier;
    knight.image.src = "./img/knight.png";
    knight.sound = new Howl({
        src: ['./sounds/knight.wav']
    });

    cyberdemon.name = "cyberdemon";
    cyberdemon.width = 85;
    cyberdemon.height = 109;
    cyberdemon.s_modifier = 0.55;
    cyberdemon.h_modifier = 0.9;
    cyberdemon.speed = hero.speed * knight.s_modifier * game.modifier;
    cyberdemon.image.src = "./img/cyberdemon.png";
    cyberdemon.sound = new Howl({
        src: ['./sounds/cyberdemon.wav']
    });

    cacodemon.name = "cacodemon";
    cacodemon.width = 63;
    cacodemon.height = 65;
    cacodemon.s_modifier = 0.65;
    cacodemon.h_modifier = 0.7;
    cacodemon.speed = hero.speed * cacodemon.s_modifier * game.modifier;
    cacodemon.image.src = "./img/cacodemon.png";
    cacodemon.sound = new Howl({
        src: ['./sounds/cacodemon.wav']
    });

    mancubus.name = "mancubus";
    mancubus.width = 164;
    mancubus.height = 140;
    mancubus.s_modifier = 0.6;
    mancubus.h_modifier = 1.4;
    mancubus.speed = hero.speed * mancubus.s_modifier * game.modifier;
    mancubus.image.src = "./img/mancubus.png";
    mancubus.sound = new Howl({
        src: ['./sounds/mancubus.wav']
    });

    spider.name = "spider";
    spider.width = 194;
    spider.height = 106;
    spider.s_modifier = 0.7;
    spider.h_modifier = 1.3;
    spider.speed = hero.speed * spider.s_modifier * game.modifier;
    spider.image.src = "./img/spider.png";
    spider.sound = new Howl({
        src: ['./sounds/spider.wav']
    });

    boss.name = "final_boss";
    boss.width = canvas.width * 0.7;
    boss.height = boss.width * 0.415549598;
    boss.s_modifier = 0.5;
    boss.h_modifier = 3;
    boss.speed = hero.speed * boss.s_modifier * game.modifier;
    boss.image.src = "./img/final_boss.png";
    boss.sound = new Howl({
        src: ['./sounds/final_boss.wav']
    });

    m_empty.name = "empty";

    //PowerUp protype
    var PowerUp = {
        name: "",
        x: 0,
        y: 0,
        width: 37,
        height: 33,
        explanation: "",
        do: function () {},
        image: new Image(),
        sound: new Howl({
            src: ['./sounds/power_up.wav']
        })

    };

    //Create powerups
    var yellow = Object.create(PowerUp);
    var red = Object.create(PowerUp);
    var green = Object.create(PowerUp);
    var blue = Object.create(PowerUp);
    var white = Object.create(PowerUp);
    var empty = Object.create(PowerUp);
    var life = Object.create(PowerUp);

    //PowerUp Names
    yellow.name = "yellow";
    white.name = "white";
    red.name = "red";
    blue.name = "blue";
    green.name = "green";
    life.name = "life";
    empty.name = "empty";

    //PowerUp Effects
    yellow.do = function () {
        monster.speed *= 1.3;
    };

    red.do = function () {
        var a = getMonster();
        a.x = 0;
        a.y = 0;
        a.x_neg = false;
        a.x_pos = false;
        a.y_pos = false;
        a.y_neg = false;
        monster2 = a;
        red.explanation = "New monster appeared";
        return monster2;
    };

    white.do = function () {
        hero.killable = false;
    };

    blue.do = function () {
        hero.speed *= 1.2;
    };

    green.do = function () {
        monster.speed *= 0.8;
    };

    life.do = function () {
        game.lifes++;
        drawLives();
    };


    // Handle keyboard controls
    var keysDown = {};

    addEventListener("keydown", function (e) {
        keysDown[e.keyCode] = true;
    }, false);

    addEventListener("keyup", function (e) {
        delete keysDown[e.keyCode];
        //Reset X-
        if (e.keyCode === 37) {
            hero.x_neg = false;
        }

        //Reset X+
        if (e.keyCode === 39) {
            hero.x_pos = false;
        }

        //Reset Y-
        if (e.keyCode === 40) {
            hero.y_neg = false;
        }

        //Reset Y+
        if (e.keyCode === 38) {
            hero.y_pos = false;
        }

    }, false);

    easy_level.addEventListener('click', function () {
        loadGame(0.7);
    });
    normal_level.addEventListener('click', function () {
        loadGame(1);
    });
    hardcore_level.addEventListener('click', function () {
        loadGame(1.3);
    });

    game.play_sound.on('play', function () {
        game.pause_sound.pause();
    });

    game.pause_sound.on('play', function () {
        game.play_sound.pause();
    });


    var drawables = [imp, revenant, baron, knight, cyberdemon, cacodemon, mancubus, spider, boss, hero, catchable];
    var images = [];
    var images_url = [];
    var images_ready = 0;


    function loadGame(modifier) {
        menu_sound.stop();
        game.modifier = modifier;
        for (i of drawables) {
            images_url.push("./img/" + i.name + ".png");
            for (var j = 1; j < 9; j++) {
                images_url.push("./img/" + i.name + "_" + j + ".png");
            }
        }
        dataLoader(startGame);
    }

    function dataLoader(callback) {
        for (i in images_url) {
            let img = new Image();
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

    //Show countdown


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
        timeOut = 3;
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

        //var power_up;
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


        var x = 3;
        var interval = 700;

        for (var i = 0; i < x; i++) {
            setTimeout(function () {
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
                    elem.image.src = "./img/" + elem.name + "_2.png";
                } else if (elem.x_pos && elem.y_neg) {
                    elem.image.src = "./img/" + elem.name + "_4.png";
                } else if (elem.x_neg && elem.y_neg) {
                    elem.image.src = "./img/" + elem.name + "_6.png";
                } else if (elem.x_neg && elem.y_pos) {
                    elem.image.src = "./img/" + elem.name + "_8.png";
                } else if (elem.y_pos && !elem.x_pos && !elem.x_neg) {
                    elem.image.src = "./img/" + elem.name + "_1.png";
                } else if (elem.x_pos && !elem.y_pos && !elem.y_neg && !elem.x_neg) {
                    elem.image.src = "./img/" + elem.name + "_3.png";
                } else if (elem.x_neg && !elem.y_pos && !elem.y_neg && !elem.x_pos) {
                    elem.image.src = "./img/" + elem.name + "_7.png";
                } else if (elem.y_neg && !elem.x_pos && !elem.x_neg && !elem.y_pos) {
                    elem.image.src = "./img/" + elem.name + "_5.png";
                } else if (!elem.y_pos && !elem.y_neg && !elem.x_pos && !elem.x_neg) {
                    elem.image.src = "./img/" + elem.name + ".png";
                }
            });


            //Move user
            if (38 in keysDown) { // Player holding up
                hero.y -= hero.speed * modifier;
                hero.y_pos = true;
                if (hero.y < 0) {
                    hero.y = 0;
                }
            }
            if (40 in keysDown) { // Player holding down
                hero.y += hero.speed * modifier;
                hero.y_neg = true;
                if (hero.y > canvas.height - hero.height) {
                    hero.y = canvas.height - hero.height;
                }
            }
            if (37 in keysDown) { // Player holding left
                hero.x -= hero.speed * modifier;
                hero.x_neg = true;
                if (hero.x < 0) {
                    hero.x = 0;
                }
            }
            if (39 in keysDown) { // Player holding right
                hero.x += hero.speed * modifier;
                hero.x_pos = true;
                if (hero.x > canvas.width - hero.width) {
                    hero.x = canvas.width - hero.width;
                }
            }

            //Bind sprite to hero movement
            if (hero.y_pos && hero.x_pos) {
                hero.image.src = "./img/" + hero.name + "_2.png";
            } else if (hero.x_pos && hero.y_neg) {
                hero.image.src = "./img/" + hero.name + "_4.png";
            } else if (hero.x_neg && hero.y_neg) {
                hero.image.src = "./img/" + hero.name + "_6.png";
            } else if (hero.x_neg && hero.y_pos) {
                hero.image.src = "./img/" + hero.name + "_8.png";
            } else if (hero.y_pos && !hero.x_pos && !hero.x_neg) {
                hero.image.src = "./img/" + hero.name + "_1.png";
            } else if (hero.x_pos && !hero.y_pos && !hero.y_neg && !hero.x_neg) {
                hero.image.src = "./img/" + hero.name + "_3.png";
            } else if (hero.x_neg && !hero.y_pos && !hero.y_neg && !hero.x_pos) {
                hero.image.src = "./img/" + hero.name + "_7.png";
            } else if (hero.y_neg && !hero.x_pos && !hero.x_neg && !hero.y_pos) {
                hero.image.src = "./img/" + hero.name + "_5.png";
            } else if (!hero.y_pos && !hero.y_neg && !hero.x_pos && !hero.x_neg) {
                hero.image.src = "./img/" + hero.name + ".png";
            }

            // If the hero touches the catchable
            if (
                hero.x <= (catchable.x + catchable.width) &&
                catchable.x <= (hero.x + catchable.width) &&
                hero.y <= (catchable.y + catchable.height) &&
                catchable.y <= (hero.y + catchable.height)
            ) {
                game.catches++;
                catchable.sound.play();
                hero.killable = true;
                reset();

            }

            // If the hero touches the monster            
            if (
                hero.x <= (monster.x + monster.width) &&
                monster.x <= (hero.x + monster.width) &&
                hero.y <= (monster.y + monster.height) &&
                monster.y <= (hero.y + monster.height)
            ) {
                if (hero.killable) {
                    monster.sound.play();
                    game.lifes--;
                    if (game.lifes >= 3) {
                        player_status.src = `./img/3_lifes.gif`;
                    } else if (game.lifes > 0) {
                        player_status.src = `./img/${game.lifes}_lifes.gif`;
                    }
                    gameOver();
                } else {
                    monster = m_empty;
                }
            }

            // If the hero touches the second monster
            if (
                hero.x <= (monster2.x + monster2.width) &&
                monster2.x <= (hero.x + monster2.width) &&
                hero.y <= (monster2.y + monster2.height) &&
                monster2.y <= (hero.y + monster2.height) && hero.killable
            ) {
                monster2.sound.play();
                game.lifes--;
                if (game.lifes < 1) {
                    gameOver();
                } else {
                    reset();
                }
                player_status.src = `./img/${game.lifes}_lifes.gif`;
            }


            //Allow user to catch the PowerUp
            if (
                hero.x <= (power_up.x + power_up.width) &&
                power_up.x <= (hero.x + power_up.width) &&
                hero.y <= (power_up.y + power_up.height) &&
                power_up.y <= (hero.y + power_up.height)
            ) {
                if (power_active.name !== 'lifes' && power_active.name !== 'red' && power_active.name !== 'empty') {
                    power_active.src = "./img/" + power_up.name + ".png";
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
        soul_count.innerText = game.catches < 10 ? '0' + game.catches : game.catches;

        //Draw hero and catchable
        ctx.drawImage(hero.image, hero.x, hero.y);
        ctx.drawImage(catchable.image, catchable.x, catchable.y);
        ctx.drawImage(monster.image, monster.x, monster.y);

        //Draw Power Up
        power_up.image.src = "./img/" + power_up.name + ".png";
        ctx.drawImage(power_up.image, power_up.x, power_up.y);

        //Draw second monster
        if (monster2 !== m_empty) {
            ctx.drawImage(monster2.image, monster2.x, monster2.y);
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

    // Cross-browser support for requestAnimationFrame
    var w = window;
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
        reset();
    }, false);
    reload_game.addEventListener('click', function () {
        newGame();
    }, false);
    reload_window.addEventListener('click', function () {
        newGame();
    }, false);

    //Shortcuts
    document.addEventListener('keypress', function (e) {
        var key = e.which || e.keyCode;
        if (key === 112) {
            if (pause_menu.style.visibility !== 'visible') {
                openMenu();
            } else {
                closeMenu();
            }
        } else if (key === 114) {
            gameOver(key);
        }
    }, false);

    //Reload if need
    pause_game.addEventListener('click', openMenu, false);

    //Clear explanation text
    power_up_text.innerText = "";
    var then = Date.now();


};

function levelUp(n) {
    game.catches += n;
}