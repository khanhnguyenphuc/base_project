var ET_NOT_CORRECT_ANSWER = 1;
var ET_TOO_LATE = 2;
var realResult = 0, fakeResult = 0;
var arrOperator = ['+', '-', 'x', '÷'];
var arrAchivement = ['CgkI-43u0ukaEAIQAQ','CgkI-43u0ukaEAIQAg', 'CgkI-43u0ukaEAIQBQ', 'CgkI-43u0ukaEAIQBg', 'CgkI-43u0ukaEAIQBw'];
var leaderboardId = 'CgkI-43u0ukaEAIQAw';
var arrBackgroundClr = ['lightblue', 'lightcoral', 'lightgray', 'lightgreen', 'lightgrey', 'lightsalmon', 'lightseagreen', 'lightskyblue', 'lightslategray', 'lightslategrey', 'lightsteelblue'];
var score = 0;
var timeout = null, timing = 1000, timingDefault = 1000;
var numberRand1 = 10, numberRand2 = 10, operatorLvl = 4;
var startTime, remainTime = 0;
var lstMedia = {};
var self;
var mymath = {
    // Application Constructor
    initialize: function() {
        self = this;
        var d = new Date();
        startTime = d.getTime();

        if (score != 0 && score % 20 == 0) {
            numberRand1 += 5;
            numberRand2 += 5;
        }
        //random number1
        var number1 = Math.floor((Math.random() * numberRand1));
        //random number2
        var number2 = Math.floor((Math.random() * numberRand2));
        //random operator1
        var operator = Math.floor((Math.random() * operatorLvl));
        //get result
        self.calculator(number1, number2, operator);
    },
    calculator: function(num1, num2, operator) {
        var result = 0;
        switch(operator) {
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
        $('.operator1').html(arrOperator[operator]);
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
        timing = timingDefault + remainTime;
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
        }, 500);
        
        $('#crazy-progress-bar').html('');
        
        if (type == ET_TOO_LATE) {
            $('.score-feedback').text('Too late!');
        } else if (type == ET_NOT_CORRECT_ANSWER) {
            $('.score-feedback').text('Answer is incorrect!');
        }
        //reset
        clearTimeout(timeout);
        score = 0;
        numberRand1 = numberRand2 = 10;
        timing = 1000;
        timingDefault = 1000;
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
        lstMedia[type].play();
    }
};

function getURL(s) {
    if(cordova.platformId.toLowerCase() === "android") return "/android_asset/www/" + s;
    return s;
}

var successfullyLoggedIn = function (cb) {
    //successfullyLoggedIn
    if (cb) cb();
};
var failedLoggedIn = function() {
    // if (AdMob) AdMob.removeBanner();
};

var doLoginGPlus = function(cb) {
    googleplaygame.auth(function() {
        successfullyLoggedIn(cb);
    }, failedLoggedIn);
};
var submitScore = function() {
    var doSubmit = function() {
        var highScore = localStorage.getItem("CrazyMath-HighScore") ? localStorage.getItem("CrazyMath-HighScore") : 0;
        var data = {
            score: highScore,
            leaderboardId: leaderboardId
        };
        googleplaygame.submitScore(data);
    };
    doLoginGPlus(doSubmit);
};
var submitAchivement = function() {
    var doSubmit = function() {
        var highScore = localStorage.getItem("CrazyMath-HighScore") ? localStorage.getItem("CrazyMath-HighScore") : 0;
        var num = Math.floor(highScore / 20);
        var data = {};
        if (highScore >=10) {
            data = {
                achievementId: arrAchivement[0],
                numSteps: highScore
            };
            googleplaygame.incrementAchievement(data);
        }
        if (num > 0) {
            for (var i = 0; i < num; i++) {
                data = {
                    achievementId: arrAchivement[i+1],
                    numSteps: highScore
                };
                googleplaygame.incrementAchievement(data);
            }
        }
    };
    doLoginGPlus(doSubmit); 
};

var loadBackground = function() {
    var index = Math.floor((Math.random() * arrBackgroundClr.length));
    $('body').css('background', arrBackgroundClr[index]);
};