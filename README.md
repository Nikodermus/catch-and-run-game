# Catch & Run UI
[![Commitizen friendly](https://img.shields.io/badge/commitizen-friendly-brightgreen.svg)](http://commitizen.github.io/cz-cli/) ![License MIT](https://img.shields.io/packagist/l/doctrine/orm.svg) ![NPM](https://img.shields.io/npm/v/npm.svg) [![game.dakio.co](https://img.shields.io/website-up-down-green-red/http/shields.io.svg?label=game.dakio.co)](http://game.dakio.co)  

2D Javascript-Based Game. Play it now in [game.dakio.co](http://game.dakio.co)!


## In-Game Features   
	--- ✓ Main Title Screen will load all the images necessary for the game to be playable and allow user to chose dificulty
	--- ✓ Player can collect the catchable object by touching it  
	--- ✓ Player will have 3 lives once the game is started   
	--- ✓ Lifes count decreases if the Player touches the monster   
	--- ✓ Playing screen will have a status panel with score, active power_up and lifes count   
	--- ✓ Catchable object will move against Player position   
	--- ✓ Monster will move towards the Player position   
	--- ✓ Monster will change based on the the catchable object count   
	--- ✓ PowerUps will appear randomly on each level   
	--- ✓ PowerUps available will be six:
		1. White = If the player touches the monster, monster will disappear and life count won't decrease
		2. Red = A second monster will appear, and the current catch has a 2x increase
		3. Blue = Player speed will increase permanently
		4. Green = Monster speed will decrese permanently    
		5. Yellow = Monster speed will increase permanently
		6. Life = Life count will increase and player can't have more than 5 lifes 
	--- ✓ Game can be paused, and show menu to reset or go to the main menu
	--- ✓ Game will wait 3s once it has started a level
	--- ✓ Sounds will trigger on Catch, PowerUp, Death(Player + Unique monster sound)   
	--- ✓ Background Sounds will be played automatically (Play, Menu, Boss)   



### New In-Game Features
	--- x Bind player sprite to change based on the keys hold to reflect where the player is heading to
	--- x Bind monster sprite to change based on the keys hold to reflect where the monster is heading to 
	--- ✓ Proyectiles will be from the player position towards the mouse-pointer location each second
	--- ✓ Monster HP will decrease when projectiles hit it  
	--- ✓ Monster will disappear when its HP arrives to 0 
	--- x Weapons will appear randomly each 5 levels, changing projectiles look and damage permanently  
	--- x Weapons available will be three:
		1. Firegun: Damage x2
		2. Fist: No projectiles will be shot until the player pick-up another weapon
		3. Laser-gun: Shoot twice as large projectiles   




### Games
    --- ✓ Once the game is finished will be taken an screenshot of the page that will be used as image    
    --- ✓ Game will be saved once finished with [Score, duration, difficulty and image]    
    --- ✓ Game will be added to the current user --- x (Even guest)    



### Users and Scores
	--- ✓ Users will be able to play as guest if there's no logged-in user    
	--- ✓ User can sign up with e-mail, password
	--- ✓ User can log in with e-mail, password    
    --- ✓ Users will be authenticated through session and device tokens
	--- ✓ User can log out, thus destroying tokens
    --- ✓ Users will have a "My Profile" page with their data and games
	--- x User can add and modify nickname, name and picture in "My Profile"
	--- ✓ "My Profile" will show only 10 latest games, and 10 best games for the user
	--- x Games can be deleted in the "My Profile" page with a confirmation
    --- x Account can be deleted with password confirmation in the "My Profile" page
    --- x Deleted accounts will destroy their games and scores if they appear in the leaderboards 



### Leaderboard
    --- ✓ Will show 10 best global scores 
    --- ✓ Leaderboard can be sorted by difficulty

##### Note: When I refer to two elements "touching" each other, it refers when the images of the images overlaps due to have a shared position

## by Nicolas M. Pardo, [Nikodermus](http://nikodermus.media)
### Under the [Beerware](https://spdx.org/licenses/Beerware.html) Software License @2017 