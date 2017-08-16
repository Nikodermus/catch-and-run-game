window.onload = function () {

    //Get Elements
    var container = document.getElementById('CanvasContainer');
    var soul_count = document.getElementById('SoulsCount');
    var life_count = document.getElementById('LifeCount');
    var player_status = document.getElementById('PlayerStatus');
    var power_up = document.getElementById('PowerUp');

    //Generate canvas
    var canvas = document.createElement('canvas');
    var ctx = canvas.getContext('2d');

    //Set canvas size as window size
    canvas.width = container.clientWidth - 128;
    canvas.height = container.clientHeight - 128;
    container.appendChild(canvas);

    // Hero image
    var hero_ready = false;
    var hero_image = new Image();
    hero_image.onload = function () {
        hero_ready = true;
    };
    hero_image.src = "./img/marine.png";

    // Monster image
    var monster_ready = false;
    var monster_image = new Image();
    monster_image.onload = function () {
        monster_ready = true;
    };
    monster_image.src = "./img/cyberdemon.png";

    // Catchable image
    var catchable_ready = false;
    var catchable_image = new Image();
    catchable_image.onload = function () {
        catchable_ready = true;
    };
    catchable_image.src = "./img/lost_soul.png";

    var game = {
        playable: true,
        lifes: 3,
        killable: true,
        health: 100,
        damage: 40,
        weapon_size: 20
    }

    var hero = {
        speed: 256,
        x: 0,
        y: 0,
        width: 38,
        height: 56
    };
    var catchable = {
        x: 0,
        y: 0,
        width: 40,
        height: 40,
        speed: hero.speed * 0.3
    };

    //Enemy prototype
    var monster = {
        speed: 0,
        x: 0,
        y: 0,
        width: 0,
        height: 0,
        health: 100
    };

    //Create monsters
    var imp = Object.create(monster);
    var revenant = Object.create(monster);
    var baron = Object.create(monster);
    var knight = Object.create(monster);
    var cyberdemon = Object.create(monster);
    var cacodemon = Object.create(monster);
    var mancubus = Object.create(monster);
    var spider = Object.create(monster);
    var boss = Object.create(monster);

    var total_catches = 0;

    // Handle keyboard controls
    var keysDown = {};

    addEventListener("keydown", function (e) {
        keysDown[e.keyCode] = true;
    }, false);

    addEventListener("keyup", function (e) {
        delete keysDown[e.keyCode];
    }, false);

    // Reset the game when the player catches a monster
    function reset() {
        hero.x = canvas.width / 2;
        hero.y = canvas.height / 2;

        // Throw the monster somewhere on the screen randomly
        monster.x = (monster.width / 2) + (Math.random() * (canvas.width - monster.width));
        monster.y = (monster.width / 2) + (Math.random() * (canvas.height - monster.width));

        // Throw the monster somewhere on the screen randomly
        catchable.x = 32 + (Math.random() * (canvas.width - 64));
        catchable.y = 32 + (Math.random() * (canvas.height - 64));
    }

    function update(modifier) {
        if (38 in keysDown) { // Player holding up
            hero.y -= hero.speed * modifier;
            if (hero.y < 0) {
                hero.y = 0;
            }

            catchable.y += catchable.speed * modifier;

        }
        if (40 in keysDown) { // Player holding down
            hero.y += hero.speed * modifier;
            if (hero.y > canvas.height - hero.height) {
                hero.y = canvas.height - hero.height;
            }
            catchable.y -= catchable.speed * modifier;

        }
        if (37 in keysDown) { // Player holding left
            hero.x -= hero.speed * modifier;
            if (hero.x < 0) {
                hero.x = 0;
            }
            catchable.x += catchable.speed * modifier;

        }
        if (39 in keysDown) { // Player holding right
            hero.x += hero.speed * modifier;
            if (hero.x > canvas.width - hero.width) {
                hero.x = canvas.width - hero.width;
            }
            catchable.x -= catchable.speed * modifier;

        }

        // Are they touching?
        if (
            hero.x <= (catchable.x + 32) &&
            catchable.x <= (hero.x + 32) &&
            hero.y <= (catchable.y + 32) &&
            catchable.y <= (hero.y + 32)
        ) {
            ++total_catches;
            reset();
        } else if (
            hero.x <= (monster.x + 32) &&
            monster.x <= (hero.x + 32) &&
            hero.y <= (monster.y + 32) &&
            monster.y <= (hero.y + 32)
        ) {
            location.reload();
        }
    }

    // Draw everything
    function render() {


        ctx.clearRect(0, 0, canvas.width, canvas.height);

        soul_count.innerText = total_catches < 10 ? '0' + total_catches : total_catches;
        if (hero_ready) {
            ctx.drawImage(hero_image, hero.x, hero.y);
        }
        if (monster_ready) {
            ctx.drawImage(monster_image, monster.x, monster.y);
        }
        if (catchable_ready) {
            ctx.drawImage(catchable_image, catchable.x, catchable.y);
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

    // Cross-browser support for requestAnimationFrame
    var w = window;
    requestAnimationFrame = w.requestAnimationFrame || w.webkitRequestAnimationFrame || w.msRequestAnimationFrame || w.mozRequestAnimationFrame;

    // Let's play this game!
    var then = Date.now();
    reset();
    main();
    //render();
};