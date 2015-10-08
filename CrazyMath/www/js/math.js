
const ET_NOT_CORRECT_ANSWER = 1;
const ET_TOO_LATE = 2;
const DF_SCORE = 0;
const DF_OPERATION_LVL = 2;
const MAX_OPERATION_LVL = 4;
const DF_NUMRAND = 10;
const DF_GAMETIME = 1000;
const DF_REMAIN_TIME = 0;

var arrOperation = ['+', '-', 'x', '÷'];
var arrBackgroundClr = ['lightblue', 'lightcoral', 'lightgray', 'lightgreen', 'lightgrey', 'lightsalmon', 'lightseagreen', 'lightskyblue', 'lightslategray', 'lightslategrey', 'lightsteelblue'];

var self;
function getElements() {

	var elems = {};
	elems.$home = $('.home');
	elems.$mymath = $('.my-math');
	elems.$resultContent = $('.result-game');
	elems.$progressBar = $('#progress-bar');
	elems.$scoreFeedback = $('.score-feedback');
	elems.$number1 = $('.number1', elems.$mymath);
	elems.$number2 = $('.number2', elems.$mymath);
	elems.$number3 = $('.number3', elems.$mymath); // result math
	elems.$operation = $('.operation', elems.$mymath);
	elems.$score = $('.score', elems.$mymath);
	return elems;
};
function MyMath() {
	this.elems = getElements();
	self = this;
};
MyMath.prototype.initialize = function() {

	this.gameover = false; // check game over
	this.score = DF_SCORE; // score of game
	this.realResult = 0; // real math calculate
	this.fakeResult = 0; // fake math calculate
	this.timeout = null;
	this.gameTime = DF_GAMETIME;
	this.numRand = DF_NUMRAND;
	this.startTime = this.remainTime = DF_REMAIN_TIME;
	this.operationLvl = DF_OPERATION_LVL;
};
MyMath.prototype.playGame = function() {

	this.startTime = (new Date()).getTime();
	if (this.score != 0 && this.score % 10 == 0) {
		this.numRand += 3;
		if (this.operationLvl < MAX_OPERATION_LVL)
				this.operationLvl += 1;
	}
	//random number1
	var number1 = Math.floor((Math.random() * this.numRand));
	//random number2
	var number2 = Math.floor((Math.random() * this.numRand));
	//random operator1
	var operation = Math.floor((Math.random() * this.operationLvl));
	//get result
	this.calculate(number1, number2, operation);
};
MyMath.prototype.calculate = function(num1, num2, optn) {
	var result = 0;
	switch(optn) {
		case 0:
			result = num1 + num2;
			break;
		case 1:
			result = num1 - num2;
			break;
		case 2:
			result = num1 * num2;
			break;
		case 3:
			result = num1;
			num2 = Math.floor((Math.random() * this.numRand)) + 1;
			num1 = num1 * num2;
			break;
	}
	this.realResult = result;
	result = this.randomResult(result);
	this.fakeResult = result;
	this.elems.$number1.text(num1);
	this.elems.$number2.text(num2);
	this.elems.$number3.text(result);
	this.elems.$operation.html(arrOperation[optn]);
};
MyMath.prototype.randomResult = function(result) {

	var number = Math.floor((Math.random() * 2) + 1);

	if (number == 1) { // make fake math result
		var n = Math.floor((Math.random() * 2) + 1);
		switch(n) {
			case 1: 
				result += 3;
				break;
			case 2: 
				result -= 2;
				break;
		}
	}
	return result;
};
MyMath.prototype.confirmCalculator = function(answer) {
	
	if (answer == (this.realResult == this.fakeResult)) {
		this.nextGame();
	} else {
		this.endGame(ET_NOT_CORRECT_ANSWER);
	}
};
MyMath.prototype.gameTiming = function() {
	this.gameTime = DF_GAMETIME + this.remainTime;
	this.timeout = setTimeout(function() {
		self.endGame(ET_TOO_LATE);
	}, self.gameTime);
};
MyMath.prototype.nextGame = function() {

	var currTime = (new Date()).getTime(); // get current new time
	if (this.score > 0) // first math don't calculate time
		this.remainTime = this.gameTime - (currTime - this.startTime); // calculate remain time
	else
		this.remainTime = 0;
	this.score += 1;
	this.elems.$score.text(this.score);
	playSound('ding','media/ding.mp3'); // sound correct answer
	this.playGame();
	showProgress("#FCB03C", 3, self.gameTime);
	if (this.timeout != null) clearTimeout(this.timeout);
	this.gameTiming();
};
MyMath.prototype.endGame = function(type) {

	var highScore = localStorage.getItem("CrazyMath-HighScore") ? localStorage.getItem("CrazyMath-HighScore") : 0;
	if (highScore < this.score) {
		highScore = this.score;
		submitScore();
	}
	submitAchivement();
	if (typeof(Storage) != "undefined") {
		// Store
		localStorage.setItem("CrazyMath-HighScore", highScore);
	}
	if (this.score < 20)
		playSound('gameover','media/gameover.mp3');
	else if (this.score < 50)
		playSound('awesome','media/awesome.mp3');
	else
		playSound('genius','media/genius.mp3');
	
	$('.my-math .answer').hide();
	$('.new-score').text(this.score);
	$('.high-score').text(highScore);
	setTimeout(function() {
		$('.result-game').fadeIn('slow', 'swing');
		$('.score-title').circleType({radius: 400});
		self.gameover = true;
		clearTimeout(self.timeout);
	}, 500);
	
	this.elems.$progressBar.html('');
	
	if (type == ET_TOO_LATE) {
		this.elems.$scoreFeedback.text('Too late!');
	} else if (type == ET_NOT_CORRECT_ANSWER) {
		this.elems.$scoreFeedback.text('Answer is incorrect!');
	}
};

function loadBackground() {
	var index = Math.floor((Math.random() * arrBackgroundClr.length));
	$('body').css('background', arrBackgroundClr[index]);
};
function smartFont (number1, number2, number3) {
	
};