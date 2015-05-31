var game;
var helpScreen, welcomeScreen, playScreen;
var drawScreen = function() {
    var width = window.innerWidth - 20;
    var height = window.innerHeight - 20;

    var canvas = document.getElementById("canvas");
    canvas.width = width;
    canvas.height = height;
    console.log(width);
    console.log(height);
    // new GameAI('canvas').init();
    // create the help screen
    
    helpScreen = new Screen(canvas);
    helpScreen.afterDraw = function(context){
        context.font = "40pt ";
        context.textAlign = "center";
        context.fillStyle = "Yellow";
        context.fillText('HELP!',canvas.width/2,canvas.height/4);
    };
    playScreen = new Screen(canvas);
    var titles = ["Single Mode","AI Mode"];
    for(var i=0;i<titles.length;i++){
        playScreen.addItem(new MenuItem({
            left: canvas.width/2 - 100,
            top: canvas.height/2+50*i,
            width: 200,
            height: 40,
            text: titles[i]
        }));
    }
    playScreen.items[0].onclick = function() {
        playScreen.stop();
        game = new GameSingle('canvas');
        game.init();
        gameOptions.state = 'playing';
    };
    playScreen.items[1].onclick = function() {
        playScreen.stop();
        game = new GameAI('canvas');
        game.init();
        gameOptions.state = 'playing';
    };
    helpScreen.addItem(new MenuItem({
            left: 100,
            top: 180,
            width: canvas.width/3 - 50,
            height: canvas.height/4,
            text: "Back",
            onclick: function(){
                // back to welcome screen
                helpScreen.stop();
                welcomeScreen.start();
            }
        }));

    // create the welcome screen
    welcomeScreen = new Screen(canvas);
    welcomeScreen.afterDraw = function(context) {

        context.font = "40pt snakeElec";
        context.textAlign = "center";
        context.fillStyle = "Yellow";
        context.fillText('SNAKE HUNTING!',canvas.width/2,canvas.height/4);
    };
    titles = ["Play","Help","Visit My Blogs"];

    for(var i=0;i<titles.length;i++){
        welcomeScreen.addItem(new MenuItem({
            left: canvas.width/2 - 100,
            top: canvas.height/2+50*i,
            width: 200,
            height: 40,
            text: titles[i]
        }));
    }
    welcomeScreen.items[0].onclick = function(){
        playScreen.start();
        welcomeScreen.stop();
        gameOptions.state = 'select-mode';
    };
    welcomeScreen.items[1].onclick = function(){
        helpScreen.start();
        welcomeScreen.stop();
        gameOptions.state = 'helping';
    };
    welcomeScreen.items[2].onclick = function(){
        window.open('https://yinyangit.wordpress.com', '_blank');
    };
    welcomeScreen.start();
}