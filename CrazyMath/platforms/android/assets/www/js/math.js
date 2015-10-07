const ET_NOT_CORRECT_ANSWER = 1;
const ET_TOO_LATE = 2;
const DF_SCORE = 0;
const DF_OPERATION_LVL = 2;
const MAX_OPERATION_LVL = 4;
const DF_NUMRAND = 10;
const DF_TIMING = 1000;
const DF_REMAIN_TIME = 0;
var realResult = 0, fakeResult = 0;
var arrOperation = ['+', '-', 'x', '÷'];
var arrBackgroundClr = ['lightblue', 'lightcoral', 'lightgray', 'lightgreen', 'lightgrey', 'lightsalmon', 'lightseagreen', 'lightskyblue', 'lightslategray', 'lightslategrey', 'lightsteelblue'];
var score = DF_SCORE;
var timeout = null, timing = DF_TIMING;
var numberRand1 = numberRand2 = DF_NUMRAND, operationLvl = DF_OPERATION_LVL;
var startTime, remainTime = DF_REMAIN_TIME;
var lstMedia = {};
var self;
var mymath = {
    // Application Constructor
    countPlaying: 0,
    isEndGame: true,
    gameState: 'home',
    initialize: function() {
        self = this;
        self.isEndGame = false;
        var d = new Date();
        startTime = d.getTime();
        if (score != 0 && score % 10 == 0) {
            numberRand1 += 5;
            numberRand2 += 5;
            if (operationLvl < MAX_OPERATION_LVL)
                    operationLvl += 1;
        }
        //random number1
        var number1 = Math.floor((Math.random() * numberRand1));
        //random number2
        var number2 = Math.floor((Math.random() * numberRand2));
        //random operator1
        var operation = Math.floor((Math.random() * operationLvl));
        //get result
        self.calculator(number1, number2, operation);
    },
    calculator: function(num1, num2, operation) {
        var result = 0;
        switch(operation) {
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
                num2 = Math.floor((Math.random() * numberRand2)) + 1;
                num1 = num1 * num2;
                break;
        }
        realResult = result;
        result = self.randomResult(result);
        fakeResult = result;

        $('.number1').text(num1);
        $('.number2').text(num2);
        $('.number3').text(result);
        $('.operator1').html(arrOperation[operation]);
    },
    randomResult: function(result) {
        var number = Math.floor((Math.random() * 2) + 1);

        switch(number) {
            case 1: 
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
    },
    confirmCalculator: function(answer) {

        if (answer == (realResult == fakeResult)) {
            self.nextGame();
        } else {
            self.endGame(ET_NOT_CORRECT_ANSWER);
        }
    },
    timingGame: function() {
        timing = DF_TIMING + remainTime;
        timeout = setTimeout(function() {
            self.endGame(ET_TOO_LATE);
        }, timing);
    },
    nextGame: function() {
        var d = new Date();
        var t = d.getTime();
        if (score > 0)
            remainTime = timing - (t - startTime);
        else
            remainTime = 0;
        score += 1;
        $('.my-math .score').text(score);
        self.playSound('notify','media/notify.mp3');
        self.initialize();
        self.showProgress();
        if (timeout != null) clearTimeout(timeout);
        self.timingGame();
    },
    endGame: function(type) {

        var highScore = localStorage.getItem("CrazyMath-HighScore") ? localStorage.getItem("CrazyMath-HighScore") : 0;
        if (highScore < score) {
            highScore = score;
            submitScore();
        }
        submitAchivement();
        if (typeof(Storage) != "undefined") {
            // Store
            localStorage.setItem("CrazyMath-HighScore", highScore);
        }
        if (score < 20)
            self.playSound('gameover','media/gameover.mp3');
        else if (score < 50)
            self.playSound('awesome','media/awesome.mp3');
        else
            self.playSound('genius','media/genius.mp3');
        
        $('.my-math .answer').hide();
        $('.new-score').text(score);
        $('.high-score').text(highScore);
        setTimeout(function() {
            $('.result-game').fadeIn('slow', 'swing');
            $('.score-title').circleType({radius: 400});
            self.isEndGame = true;
        }, 500);
        
        $('#crazy-progress-bar').html('');
        
        if (type == ET_TOO_LATE) {
            $('.score-feedback').text('Too late!');
        } else if (type == ET_NOT_CORRECT_ANSWER) {
            $('.score-feedback').text('Answer is incorrect!');
        }
        //reset to default value
        clearTimeout(timeout);
        score = DF_SCORE;
        operationLvl = DF_OPERATION_LVL;
        numberRand1 = numberRand2 = DF_NUMRAND;
        timing = DF_TIMING;
        remainTime = DF_REMAIN_TIME;
    },
    showProgress: function() {
        $('#crazy-progress-bar').html('');
        var line = new ProgressBar.Line('#crazy-progress-bar', {
            color: '#FCB03C',
            strokeWidth: 3,
            duration: timing
        });

        line.animate(1.0);
    },
    playSound: function(type, src) {
        // Media player
        var mp3URL = getURL(src);
        if (!lstMedia[type]) {
            lstMedia[type] = new Media(mp3URL);
        }
        lstMedia[type].play(lstMedia[type].stop());
    }
};

function getURL(s) {
    if(cordova.platformId.toLowerCase() === "android") return "/android_asset/www/" + s;
    return s;
}

var loadBackground = function() {
    var index = Math.floor((Math.random() * arrBackgroundClr.length));
    $('body').css('background', arrBackgroundClr[index]);
};