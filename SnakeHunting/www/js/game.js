/******************** GAME ***********************/
var CELL_SIZE = 20;
var FPS = 1;
var WIDTH = $(window).width() - 20;
var HEIGHT = $(window).height() - 20;
var MAX_PLAYER_LENGTH = 7;
var MAX_COM_LENGTH = 12;

function Game(canvas_id){    
	var _level = 1;
	var _scores = 0; 
    var _pressedKey;
    var _cols = Math.floor(WIDTH/CELL_SIZE);
    var _rows = Math.floor(HEIGHT/CELL_SIZE);
    var _playerSnake = new Snake(_cols,_rows,"red",false);
	var _comSnake = new Snake(_cols,_rows,"blue",true);
    var _walls = [];
    var _canvas = document.getElementById(canvas_id);
    var _context = _canvas.getContext('2d');
    _context.fillStyle = "black";
	var _fps = FPS;
    
    var _food = {};
    var _running = false;    
    var _game_timer;
	var _bfs;
    function getMousePos(canvas, evt) {
        var rect = canvas.getBoundingClientRect();
        return {
          x: evt.clientX - rect.left,
          y: evt.clientY - rect.top
        };
    }
    
    this.init = function() {                
        _canvas.width = WIDTH;
        _canvas.height = HEIGHT;
                
        // _canvas.onkeydown = function(e) {
        //     e.preventDefault();
        //     if(e.keyCode == 13) // Enter key
        //     {                
        //         if(!_running)
        //             startGame();                        
        //     }
        //     else if(_running)
        //     {                    
        //         _pressedKey = e.keyCode;
        //     }
        // };
        _canvas.onmousedown = function(e) {
        	e.preventDefault();
        	if (!_running) {
        		startGame();
        	} else {
        		var p = getMousePos(_canvas, e);
	        	_playerSnake.handleTouch(p.x/CELL_SIZE,p.y/CELL_SIZE);
        	}
        };      
	
        // draw the welcome screen
        _context.textAlign = "center";
        _context.font = "36px Arial";
        _context.fillText("Canvas Snake",WIDTH/2,HEIGHT/3);
        _context.font = "16px Arial";
        _context.fillText("Please touch to Start",WIDTH/2,HEIGHT/2);
    }
	
    function createMap(){
		for(var i=0;i<_cols;i+=2)
		{
			
			_walls[i] = [];
			_walls[i+1] = [];
			for(var j=0;j<_rows;j+=2)
			{	
				var val = (j>4 && Math.floor(Math.random()*20)<2)?1:0;
				
				_walls[i][j] = val;
				_walls[i+1][j] = val;
				_walls[i][j+1] = val;
				_walls[i+1][j+1] = val;
			}
		}
	}
    function startGame() {
        _pressedKey = null;
        clearInterval(_game_timer);
		_fps = FPS+_level*2; 
        _playerSnake.init();
		_comSnake.init();
		createMap();
		
		// this object is used to find the path between two points
		 _bfs = new BreathFirstSearch(_walls,_cols,_rows);
        
		createFood();
        _running = true;
        console.log(_fps);
        _game_timer = setInterval(update,1000/_fps);
		
       
		
    }
    function endGame(){
		_running = false;    
		_context.save();
		_context.fillStyle = "rgba(0,0,0,0.2)";
		_context.fillRect(0,0,WIDTH,HEIGHT);
		_context.restore();
		_context.fillStyle = "red";
		_context.textAlign = "center";
		_context.fillText("You Lose! Please Touch to restart.",WIDTH/2,HEIGHT/2);   
	}
	function update() {                            
		if(!_running)
			return;
	  
		_playerSnake.handleKey(_pressedKey);
		// player has priority to eat
		var ret =_playerSnake.update(_walls,_food);
		if(ret==1) // player eated the food
		{
			_scores += _level*2;
			createFood();
		}
		else if(ret==2) // player collided with something
		{ 
			if(_scores>=0)
			{
				_scores -= _level*2;
				if(_scores<0)
					_scores = 0;
			}	
			endGame();                                 
			return;
		}else{		
			if(!_comSnake.path)
				_comSnake.setPath(_bfs.findPath(_comSnake.data,_comSnake.getHead(),_food),_food);
			
			ret = _comSnake.update(_walls,_food);
			if(ret==1) // com player eated the food
				createFood();
		}
		draw(); 
		// Player's snake reached the maximum length
		// so the game will start the next level
		if(_playerSnake.data.length==MAX_PLAYER_LENGTH) 
		{
			// go to next level
			_level++;
			_scores += _level*100;
			_running = false;    
			_context.save();
			_context.fillStyle = "rgba(0,0,0,0.2)";
			_context.fillRect(0,0,WIDTH,HEIGHT);
			_context.restore();
			_context.fillStyle = "red";
			_context.textAlign = "center";
			_context.fillText("Please Touch to start the next level",WIDTH/2,HEIGHT/2);                                 
		}else if(_comSnake.data.length==MAX_COM_LENGTH)
		{
			endGame();  
			return;
		}
		   
	}
    function draw(){
        _context.beginPath();
        _context.clearRect(0,0,WIDTH,HEIGHT);
        _context.fill();
        _context.lineWidth = CELL_SIZE;
		_context.lineCap = "round";
		_context.lineJoin = "round";
        _playerSnake.draw(_context);
		_comSnake.draw(_context);
        // draw food
		_context.fillStyle = "green";
        _context.beginPath();
        _context.arc((_food.x*CELL_SIZE)+CELL_SIZE/2, (_food.y*CELL_SIZE)+CELL_SIZE/2, CELL_SIZE/2, 0, Math.PI*2, false);
        _context.fill();     
		// draw walls
		_context.fillStyle = "black";
		for(var i=0;i<_cols;i++)
		{
			for(var j=0;j<_rows;j++)
				if(_walls[i][j])
					_context.fillRect(i*CELL_SIZE,j*CELL_SIZE,CELL_SIZE,CELL_SIZE);
		}		
		_context.textAlign = "left";
		_context.fillText("Level: "+_level,10,20);
		
		_context.fillText("Scores: "+_scores,10,40);
		
	}
    
	function createFood() {
		var x = Math.floor(Math.random()*_cols);
		var y;
		do {                
			y = Math.floor(Math.random()*_rows);
		} while(_walls[x][y] || _comSnake.contain(x, y) || _playerSnake.contain(x, y));
		
		_food = {x: x, y: y};
		// find new path for the com player
		_comSnake.setPath(_bfs.findPath(_comSnake.data,_comSnake.getHead(),_food));
	}

};