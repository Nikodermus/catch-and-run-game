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
    power_up: ""
};


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
    console.log(pause_game);
    var menu_overlay = document.querySelector('.menu_overlay');
    var menu_container = document.querySelector('.menu_container');
    var power_up_text = document.getElementById('PowerUpText');
    var life_img = document.createElement('img');


    life_img.src = './img/life.png';
    pause_menu.style.visibility = 'hidden';

    //Generate canvas
    var canvas = document.createElement('canvas');
    var ctx = canvas.getContext('2d');

    //Set canvas size as window size
    canvas.width = container.clientWidth - 128;
    canvas.height = container.clientHeight - 128;
    container.appendChild(canvas);

    window.onresize = function () {
        canvas.width = container.clientWidth - 128;
        canvas.height = container.clientHeight - 128;
    };

    // Hero image
    var hero_ready = false;
    var hero_image = new Image();
    hero_image.onload = function () {
        hero_ready = true;
    };
    hero_image.src = "./img/marine.png";


    // Catchable image
    var catchable_ready = false;
    var catchable_image = new Image();
    catchable_image.onload = function () {
        catchable_ready = true;
    };
    catchable_image.src = "./img/lost_soul.png";


    game.x0 = canvas.width / 2;
    game.y0 = canvas.height / 2;
    game.safe_area = 0.2 / game.modifier;

    var hero = {
        speed: 256,
        x: 0,
        y: 0,
        width: 38,
        height: 56,
        killable: true,
        weapon_size: 20
    };
    var catchable = {
        x: 0,
        y: 0,
        width: 40,
        height: 40,
        speed: hero.speed * 0.3 * game.modifier
    };

    //Enemy prototype
    var Monster = {
        name: "",
        x: 0,
        y: 0,
        width: 0,
        height: 0,
        s_modifier: 1,
        h_modifier: 1
    };


    //Create monsters
    var imp = Object.create(Monster);
    var revenant = Object.create(Monster);
    var baron = Object.create(Monster);
    var knight = Object.create(Monster);
    var cyberdemon = Object.create(Monster);
    var cacodemon = Object.create(Monster);
    var mancubus = Object.create(Monster);
    var spider = Object.create(Monster);
    var boss = Object.create(Monster);
    var m_empty = Object.create(Monster);

    //Empty container for monsters
    var monster, monster2, danger_level;

    //Add data to each monster
    imp.name = "imp";
    imp.width = 41;
    imp.height = 57;
    imp.s_modifier = 0.3;
    imp.h_modifier = 0.6;
    imp.speed = hero.speed * imp.s_modifier * game.modifier;

    revenant.name = "revenant";
    revenant.width = 49;
    revenant.height = 71;
    revenant.s_modifier = 0.35;
    revenant.h_modifier = 0.65;
    revenant.speed = hero.speed * revenant.s_modifier * game.modifier;

    baron.name = "baron";
    baron.width = 49;
    baron.height = 74;
    baron.s_modifier = 0.4;
    baron.h_modifier = 0.8;
    baron.speed = hero.speed * baron.s_modifier * game.modifier;

    knight.name = "knight";
    knight.width = 52;
    knight.height = 74;
    knight.s_modifier = 0.45;
    knight.h_modifier = 0.85;
    knight.speed = hero.speed * knight.s_modifier * game.modifier;

    cyberdemon.name = "cyberdemon";
    cyberdemon.width = 85;
    cyberdemon.height = 109;
    cyberdemon.s_modifier = 0.55;
    cyberdemon.h_modifier = 0.9;
    knight.speed = hero.speed * knight.s_modifier * game.modifier;

    cacodemon.name = "cacodemon";
    cacodemon.width = 63;
    cacodemon.height = 65;
    cacodemon.s_modifier = 0.65;
    cacodemon.h_modifier = 0.7;
    cacodemon.speed = hero.speed * cacodemon.s_modifier * game.modifier;

    mancubus.name = "mancubus";
    mancubus.width = 164;
    mancubus.height = 140;
    mancubus.s_modifier = 0.6;
    mancubus.h_modifier = 1.4;
    mancubus.speed = hero.speed * mancubus.s_modifier * game.modifier;

    spider.name = "spider";
    spider.width = 194;
    spider.height = 106;
    spider.s_modifier = 0.7;
    spider.h_modifier = 1.3;
    spider.speed = hero.speed * spider.s_modifier * game.modifier;

    boss.name = "final_boss";
    boss.width = canvas.width * 0.7;
    boss.height = boss.width * 0.415549598;
    boss.s_modifier = 0.5;
    boss.h_modifier = 3;
    boss.speed = hero.speed * boss.s_modifier * game.modifier;

    m_empty.name = "empty";

    //PowerUp protype
    var PowerUp = {
        name: "",
        x: 0,
        y: 0,
        width: 37,
        height: 33,
        explanation: "",
        do: function () {}
    };

    //Create powerups
    var yellow = Object.create(PowerUp);
    var red = Object.create(PowerUp);
    var green = Object.create(PowerUp);
    var blue = Object.create(PowerUp);
    var white = Object.create(PowerUp);
    var empty = Object.create(PowerUp);
    var life = Object.create(PowerUp);

    yellow.name = "yellow";
    white.name = "white";
    red.name = "red";
    blue.name = "blue";
    green.name = "green";
    life.name = "life";
    empty.name = "empty"

    //PowerUp Effects
    yellow.do = function () {
        yellow.explanation = "";
        monster.speed *= 1.3;
    };

    red.do = function () {
        red.explanation = "";
        monster2 = getMonster();
    };

    white.do = function () {
        white.explanation = "";
        hero.killable = false;
    };

    blue.do = function () {
        blue.explanation = "";
        hero.speed *= 1.2;
    };

    green.do = function () {
        green.explanation = "";
        monster.speed *= 0.8;
    };

    life.do = function () {
        life.explanation = "";
        game.lifes++;
        drawLives();
    };


    // Handle keyboard controls
    var keysDown = {};

    addEventListener("keydown", function (e) {
        keysDown[e.keyCode] = true;
        game.playable = true;
    }, false);

    addEventListener("keyup", function (e) {
        delete keysDown[e.keyCode];
    }, false);

    //Random for various purposes
    function getRandom(min, max) {
        return Math.random() * (max - min) + min;
    }

    function getMonster() {
        danger_level = getRandom(0, 30);
        if (danger_level < 7) {
            return imp;
        } else if (danger_level < 13) {
            return revenant;
        } else if (danger_level < 18) {
            return baron;
        } else if (danger_level < 22) {
            return knight;
        } else if (danger_level < 25) {
            return cyberdemon;
        } else if (danger_level < 27) {
            return cacodemon;
        } else if (danger_level < 30) {
            return mancubus;
        } else {
            return spider;
        }
    }





    // Reset the game when the player catches a monster
    function reset() {
        monster2 = m_empty;
        hero.killable = true;
        game.playable = false;
        power_active.src = "";
        drawLives();

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

    }

    function update(modifier) {
        if (game.playable) {


            //Move monster
            if (hero.x > monster.x) {
                monster.x += monster.speed * modifier;
                if (monster.x > canvas.width - monster.width) {
                    monster.x = canvas.width - monster.width;
                }
            }
            if (hero.x < monster.x) {
                monster.x -= monster.speed * modifier;
                if (monster.x < 0) {
                    monster.x = 0;
                }

            }
            if (hero.y > monster.y) {
                monster.y += monster.speed * modifier;
                if (monster.y > canvas.height - monster.height) {
                    monster.y = canvas.height - monster.height;
                }
            }
            if (hero.y < monster.y) {
                monster.y -= monster.speed * modifier;

                if (monster.y < 0) {
                    monster.y = 0;
                }
            }

            //Move second monster
            if (hero.x > monster2.x) {
                monster2.x += monster2.speed * modifier;
                if (monster2.x > canvas.width - monster2.width) {
                    monster2.x = canvas.width - monster2.width;
                }
            }
            if (hero.x < monster2.x) {
                monster2.x -= monster2.speed * modifier;
                if (monster2.x < 0) {
                    monster2.x = 0;
                }

            }

            if (hero.y > monster2.y) {
                monster2.y += monster2.speed * modifier;
                if (monster2.y > canvas.height - monster2.height) {
                    monster2.y = canvas.height - monster2.height;
                }
            }
            if (hero.y < monster2.y) {
                monster2.y -= monster2.speed * modifier;

                if (monster2.y < 0) {
                    monster2.y = 0;
                }
            }

            //Move catchable
            if (hero.x < catchable.x) {
                catchable.x += catchable.speed * modifier;
                if (catchable.x > canvas.width - catchable.width) {
                    catchable.x = canvas.width - catchable.width;
                }
            }
            if (hero.x > catchable.x) {
                catchable.x -= catchable.speed * modifier;
                if (catchable.x < 0) {
                    catchable.x = 0;
                }

            }
            if (hero.y < catchable.y) {
                catchable.y += catchable.speed * modifier;
                if (catchable.y > canvas.height - catchable.height) {
                    catchable.y = canvas.height - catchable.height;
                }
            }
            if (hero.y > catchable.y) {
                catchable.y -= catchable.speed * modifier;

                if (catchable.y < 0) {
                    catchable.y = 0;
                }
            }

            //Move user
            if (38 in keysDown) { // Player holding up
                hero.y -= hero.speed * modifier;
                if (hero.y < 0) {
                    hero.y = 0;
                }
            }
            if (40 in keysDown) { // Player holding down
                hero.y += hero.speed * modifier;
                if (hero.y > canvas.height - hero.height) {
                    hero.y = canvas.height - hero.height;
                }
            }
            if (37 in keysDown) { // Player holding left
                hero.x -= hero.speed * modifier;
                if (hero.x < 0) {
                    hero.x = 0;
                }
            }
            if (39 in keysDown) { // Player holding right
                hero.x += hero.speed * modifier;
                if (hero.x > canvas.width - hero.width) {
                    hero.x = canvas.width - hero.width;
                }
            }



            // If the hero touches the catchable
            if (
                hero.x <= (catchable.x + catchable.width) &&
                catchable.x <= (hero.x + catchable.width) &&
                hero.y <= (catchable.y + catchable.height) &&
                catchable.y <= (hero.y + catchable.height)
            ) {
                game.catches++;
                hero.killable = true;
                reset();
            }

            // If the hero touches the monster            
            if (
                hero.x <= (monster.x + monster.width) &&
                monster.x <= (hero.x + monster.width) &&
                hero.y <= (monster.y + monster.height) &&
                monster.y <= (hero.y + monster.height) && hero.killable
            ) {
                game.lifes--;
                if (game.lifes >= 3) {
                    player_status.src = `./img/3_lifes.gif`;
                } else if (game.lifes > 0) {
                    player_status.src = `./img/${game.lifes}_lifes.gif`;

                } else {
                    location.reload();
                }
                reset();


            }

            // If the hero touches the second monster
            if (
                hero.x <= (monster2.x + monster2.width) &&
                monster2.x <= (hero.x + monster2.width) &&
                hero.y <= (monster2.y + monster2.height) &&
                monster2.y <= (hero.y + monster2.height) && hero.killable
            ) {
                game.lifes--;
                if (game.lifes < 1) location.reload();
                reset();
                player_status.src = `./img/${game.lifes}_lifes.gif`;
            }


            //Allow user to catch the PowerUp
            if (
                hero.x <= (power_up.x + power_up.width) &&
                power_up.x <= (hero.x + power_up.width) &&
                hero.y <= (power_up.y + power_up.height) &&
                power_up.y <= (hero.y + power_up.height)
            ) {
                if (power_active.name === 'lifes') {} else {
                    power_active.src = "./img/" + power_up.name + ".png";

                }
                power_up.do();
                power_up_text.className = power_up.name;
                power_up_text.innerText = power_up.explanation;
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
        ctx.drawImage(hero_image, hero.x, hero.y);
        ctx.drawImage(catchable_image, catchable.x, catchable.y);

        //Draw Image
        var monster_image = new Image();
        monster_image.src = "./img/" + monster.name + ".png";
        ctx.drawImage(monster_image, monster.x, monster.y);

        //Draw Power Up
        var power_up_image = new Image();
        power_up_image.src = "./img/" + power_up.name + ".png";
        ctx.drawImage(power_up_image, power_up.x, power_up.y);

        //Draw second monster
        var monster2_image = new Image();
        monster2_image.src = "./img/" + monster2.name + ".png";
        ctx.drawImage(monster2_image, monster2.x, monster2.y);

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
        console.log('closed')
    }

    function openMenu() {
        pause_menu.style.visibility = 'visible';
        game.playable = false;
        console.log('opening')
    }

    // Cross-browser support for requestAnimationFrame
    var w = window;
    requestAnimationFrame = w.requestAnimationFrame || w.webkitRequestAnimationFrame || w.msRequestAnimationFrame || w.mozRequestAnimationFrame;

    // Let's play this game!
    var then = Date.now();
    reset();
    main();


    //Close menu
    menu_container.addEventListener('click', function (e) {
        e.preventDefault();
        e.stopPropagation();
    }, false);

    close_menu.addEventListener('click', closeMenu, false);

    menu_overlay.addEventListener('click', closeMenu, false);

    //Show Menu
    pause_game.addEventListener('click', openMenu, false);
    document.addEventListener('blur', openMenu, false);

    //Shortcuts
    document.addEventListener('keypress', function (e) {
        var key = e.which ||  e.keyCode;
        if (key === 112) {
            if (pause_menu.style.visibility !== 'visible') {
                openMenu();
            } else {
                closeMenu();
            }
        } else if (key === 114) {
            location.reload();
        }


    }, false);

    //Reload if need
    pause_game.addEventListener('click', openMenu, false);
};

function levelUp(n) {
    game.catches += n;
}