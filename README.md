# catch-and-run-game
Pure JS game, with DOOM 1993 Sprites and a lot of incoming fun! Play it [here](http://game.dakio.co)! 

##MVP   
--- ✓ Hero can collect souls   
--- ✓ Souls count decreases if the hero touches the monster   
--- ✓ Make status panel   
--- ✓ Soul should move randomly against hero   
--- ✓ Monster should try to catch the hero   
--- ✓ Hero should have 3 lives before souls count go to 0   
--- ✓ Monster should change based on the souls count   
--- ✓ PowerUps should appear randomly based on the probability table   
--- ✓ PowerUps picked should change game experience   
--- x If souls count is bigger than 30, start boss level   
--- ✓ Game can be paused, and show menu to reset, share or see source code
--- ✓ Game will wait 3s once it has started a level
--- ✓ Main Title Screen will load all the images and allow user to chose dificulty

##Database
--- x Users will be able to play as guest if there's no logged in user    
--- x User can sign up with e-mail, nickname, password     
--- x User can log in with e-mail // password    

    ###For signed up users
    --- x A profile menu will appear with: latest 10 gamescore, best 10 gamescore    
    --- x Each gamescore can be shared through Facebook // Twitter // Instagram?    
    --- x Gamescore can be deleted with a confirmation
    --- x Account can be deleted with password and captcha

    ###On game
    --- x Anybody can share on Facebook // Twitter // Instagram? an screenshot of the status of their game    

    ###Once the game is over
    --- x Guest user can sign up and save the played match  
    --- x Game can be saved (Max: 10 per user. If the user already had 10 games, the system will erase the last not top score user's game) to be shared afterwards
    --- x For logged in users, the gamescore will be saved on personal records with a max of 10 per user and starting by the latest (Max: 10 per user. If the user already had 10 games, the system will erase the last not top score user's game)     

    ###Leaderboard
    --- x Will show 10 best scores sorted by difficulty and score with session time, score, nickname, difficulty and game date 


##Addons   
--- x Bind hero sprite to change based on the keys hold
--- x Bind hero sprite to change based on the keys hold   
--- x Bind monster sprite to change based on the keys hold   
--- ✓ Sounds should trigger on Catch, PowerUp, Death(Hero + Unique monster sound)   
--- ✓ Background Sounds (Play, Menu, Boss)   
--- x Proyectiles can be shot making the monster disappear based on the HP   
--- ✓ Random weapons will appear in the board based on the probability table   
--- ✓ Create menu before starting game, add Hero name and select difficulty   
--- x Loop game after boss battle and increase enemies abilities    
--- x Skins can be sellected (Own, Megaman or MortalKombat)   
--- ? Multiplayer 

##by Nicolas M. Pardo, [Nikodermus](http://nikodermus.media)
###Under the [Beerware](https://spdx.org/licenses/Beerware.html) Software License @2017
