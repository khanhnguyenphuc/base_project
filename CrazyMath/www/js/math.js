var realResult = 0, fakeResult = 0;
var arrOperator = ['<i class="fa fa-plus fa-4x"></i>', '<i class="fa fa-minus fa-4x"></i>', '<i class="fa fa-times fa-4x"></i>', '/'];
var arrAchivement = ['CggI3OKY2h8QAhAB','CggI3OKY2h8QAhAD','CggI3OKY2h8QAhAE','CggI3OKY2h8QAhAF','CggI3OKY2h8QAhAG'];
var score = 0;
var timeout, timing = 1000;
var numberRand1 = 10, numberRand2 = 10, operatorLvl = 2;
var startTime, remainTime = 0;
var self;
var mymath = {
    // Application Constructor
    initialize: function() {
        self = this;
        var d = new Date();
        if (score != 0 && score % 20 == 0) {
            numberRand1 += 5;
            numberRand2 += 5;
            if (operatorLvl < 3) {
                operatorLvl += 1;
            }
            timing += 1000;
        }
        //random number1
        var number1 = Math.floor((Math.random() * numberRand1) + 1);
        //random number2
        var number2 = Math.floor((Math.random() * numberRand2) + 1);
        //random operator1
        var operator = Math.floor((Math.random() * operatorLvl) + 1) - 1;
        //get result
        var result = self.calculator(number1, number2, operator);

        startTime = d.getTime();
        //make another result
        $('.number1').text(number1);
        $('.number2').text(number2);
        $('.number3').text(result);
        $('.operator1').html(arrOperator[operator]);
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
                result = num1 / num2;
                break;
        }
        realResult = result;
        result = self.randomResult(result);
        fakeResult = result;
        return result;
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
            self.endGame();
        }
    },
    timingGame: function() {
        timing = 1000 + remainTime;
        timeout = setTimeout(function() {
            self.endGame();
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
        self.playSound('media/notify.mp3');
        self.initialize();
        self.showProgress();
        clearTimeout(timeout);
        self.timingGame();
    },
    endGame: function() {
        submitAchivement();
        if (score < 30)
            self.playSound('media/gameover.mp3');
        else if (score < 50)
            self.playSound('media/awesome.mp3');
        else
            self.playSound('media/genius.mp3');
        var highScore = localStorage.getItem("CrazyMath-HighScore") ? localStorage.getItem("CrazyMath-HighScore") : 0;
        if (highScore < score) {
            highScore = score;
            submitScore();
        }
        $('.my-math').hide();
        $('.score').text(score);
        $('.highScore').text(highScore);
        $('.result-game').fadeIn('slow', 'swing');
        $('#my-progress-bar').html('');
        if (typeof(Storage) != "undefined") {
            // Store
            localStorage.setItem("CrazyMath-HighScore", highScore);
        }
        //reset
        clearTimeout(timeout);
        score = 0;
        numberRand1 = numberRand2 = 10;
        timing = 1000;
        operatorLvl = 2
    },
    showProgress: function() {
        $('#my-progress-bar').html('');
        var line = new ProgressBar.Line('#my-progress-bar', {
            color: '#FCB03C',
            strokeWidth: 3,
            duration: timing
        });

        line.animate(1.0);
    },
    playSound: function(src) {
        var audio = new Audio(src);
        audio.play();
    }
};
var successfullyLoggedIn = function () {
    googleplaygame.showPlayer(function (_playerData) {
        document.querySelector("#image").src = _playerData.iconImageUrl;
        document.querySelector("#image").style.visibility = 'visible';
        document.querySelector("#feedback").innerHTML = "Hi, " + _playerData.displayName;
        playerData = _playerData;
    });
    $('.btnLogin').hide();
    $('.btnLogout').show();
};
var failedToLogin = function () {
    console.log('failedToLogin');
    // googleplaygame.signOut();
};

var doLoginGPlus = function() {
    googleplaygame.isSignedIn(function (result) {
        if (result.isSignedIn) {
            successfullyLoggedIn();
        } else {
            googleplaygame.auth(successfullyLoggedIn);
        }
    });
};
var submitScore = function() {
    googleplaygame.auth(function () {
        var highScore = localStorage.getItem("CrazyMath-HighScore") ? localStorage.getItem("CrazyMath-HighScore") : 0;
        var data = {
            score: highScore,
            leaderboardId: 'CggI3OKY2h8QAhAC'
        };
        googleplaygame.submitScore(data);
    }, failedToLogin);
};
var submitAchivement = function() {
    var highScore = localStorage.getItem("CrazyMath-HighScore") ? localStorage.getItem("CrazyMath-HighScore") : 0;
    var num = Math.floor(highScore / 20);
    var data = {};
    if (num > 0) {
        for (var i = 0; i < num; i++) {
            data = {
                achievementId: arrAchivement[i],
                numSteps: highScore
            };
            googleplaygame.incrementAchievement(data);
        }
    }
        
};

$(function () {
    
    $('.start-game').click(function(e) {
        mymath.initialize();
        $('.home').hide();
        $('.my-math').show();
        $('.result-game').hide();
    });
    $('.back-menu').click(function(e) {
        $('.home').show();
        $('.result-game').hide();
    })
    $('.accept').click(function(e) {
        mymath.confirmCalculator(true)
    });
    $('.deny').click(function(e) {
        mymath.confirmCalculator(false)
    });
    $('.leaderboard-game').click(function(e) {
        googleplaygame.showLeaderboard({
            leaderboardId: 'CggI3OKY2h8QAhAC'
        });
    });
    $('.achievement-game').click(function(e) {
        googleplaygame.showAchievements();
    });
});