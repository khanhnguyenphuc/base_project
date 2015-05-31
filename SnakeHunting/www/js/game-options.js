var gameOptions = {
	state: 'home',
	fps: 2,
	WIDTH: $(window).width() - 20,
	HEIGHT: $(window).height() - 20,
	MAX_PLAYER_LENGTH: 7
};

//event backkey device
function onBackKeyDown(event) {
    // Handle the back button
    event.preventDefault();
    if (gameOptions.state == 'playing') {
        //pause game
        //show screen pause game
        game.endGame();
        playScreen.start();
        gameOptions.state = 'select-mode';
    // } else if (gameOptions.state == 'select-mode') {
    //     game.resumeGame();
    //     gameOptions.state = 'playing';
    //     playScreen.stop();
    } else if (gameOptions.state == 'select-mode' || gameOptions.state == 'helping') {
        //back to home screen
        helpScreen.stop();
        playScreen.stop();
        welcomeScreen.start();
        gameOptions.state = 'home';
    } else if (gameOptions.state == 'home'){ //home
        //show dialog confirm exit app
    	navigator.app.exitApp();
    }
}