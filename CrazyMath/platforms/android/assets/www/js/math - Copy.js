var arrAchivement = ['CggI3OKY2h8QAhAB','CggI3OKY2h8QAhAD','CggI3OKY2h8QAhAE','CggI3OKY2h8QAhAF','CggI3OKY2h8QAhAG'];
var arrLeaderBoard = ['CggI3OKY2h8QAhAC'];
var MyMath = function() {
    var abc = 111;
    this.arrOperator = ['<i class="fa fa-plus fa-4x"></i>', '<i class="fa fa-minus fa-4x"></i>', '<i class="fa fa-times fa-4x"></i>', '/'];
    this.numberRand1 = this.numberRand2 = 10;
    this.score = this.realResult = this.fakeResult = this.remainTime = this.startTime = 0;
    this.timing = 1000;
    this.operatorLvl = 2;
};
MyMath.prototype = {
    // Application Constructor
    initialize: function() {
        var d = new Date();
        if (this.score != 0 && this.score % 20 == 0) {
            this.numberRand1 += 10;
            this.numberRand2 += 10;
            if (this.operatorLvl < 3) {
                this.operatorLvl += 1;
            }
            this.timing += 1000;
        }
        //random number1
        var number1 = Math.floor((Math.random() * this.numberRand1) + 1);
        //random number2
        var number2 = Math.floor((Math.random() * this.numberRand2) + 1);
        //random operator1
        var operator = Math.floor((Math.random() * this.operatorLvl) + 1) - 1;
        //get result
        var result = this.calculator(number1, number2, operator);

        this.startTime = d.getTime();
        //make another result
        $('.number1').text(number1);
        $('.number2').text(number2);
        $('.number3').text(result);
        $('.operator1').html(this.arrOperator[operator]);
    },
    calculator: function(num1, num2, operator1) {
        var result = 0;
        switch(operator1) {
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
        this.realResult = this.result;
        result = this.randomResult(result);
        this.fakeResult = this.result;
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
        // this.nextGame();
        if (answer == (this.realResult == this.fakeResult)) {
            this.nextGame();
        } else {
            this.endGame();
        }
    },
    timingGame: function() {
        this.timing = 1000 + this.remainTime;
        console.log('this.timing: ' + this.timing);
        this.timeout = setTimeout(function() {
            this.endGame();
        }, this.timing);
    },
    nextGame: function() {
        var d = new Date();
        var t = d.getTime();
        console.log('start time: ' + this.startTime);
        console.log('new time: ' + t);
        if (this.score > 0)
            this.remainTime = this.timing - (t - this.startTime);
        else
            this.remainTime = 0;
        console.log('this.remainTime: ' + this.remainTime);
        this.score += 1;
        this.playSound('media/notify.mp3');
        this.initialize();
        this.showProgress();
        clearTimeout(this.timeout);
        this.timingGame();
    },
    endGame: function() {
        submitAchivement();
        this.playSound('media/gameover.wav');
        if (this.score < 1) 
            this.playSound('media/idiot.wav');
        else if (this.score < 10)
            this.playSound('media/oops.mp3');
        else if (this.score < 20)
            this.playSound('media/amazing.wav');
        else if (this.score < 50)
            this.playSound('media/awesome.wav');
        else
            this.playSound('media/impossible.wav');
        var highScore = localStorage.getItem("CrazyMath-HighScore") ? localStorage.getItem("CrazyMath-HighScore") : 0;
        if (highScore < this.score) {
            highScore = this.score;
            submitScore();
        }
        $('.result-game').fadeIn(1000, 'swing');
        $('.my-math').hide();
        $('.score').text(this.score);
        $('.highScore').text(highScore);
        $('#my-progress-bar').html('');
        if (typeof(Storage) != "undefined") {
            // Store
            localStorage.setItem("CrazyMath-HighScore", highScore);
        }
        clearTimeout(this.timeout);
        this.score = 0;
    },
    showProgress: function() {
        $('#my-progress-bar').html('');
        var line = new ProgressBar.Line('#my-progress-bar', {
            color: '#FCB03C',
            strokeWidth: 3,
            duration: this.timing
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
            leaderboardId: arrLeaderBoard[0]
        };
        googleplaygame.submitScore(data);
    }, failedToLogin);
};
var submitAchivement = function() {
    var highScore = localStorage.getItem("CrazyMath-HighScore") ? localStorage.getItem("CrazyMath-HighScore") : 0;
    var num = Math.floor(highScore / 20);
    if (num > 0) {
        var data = {
            achievementId: arrAchivement[num - 1],
            numSteps: highScore
        };

        googleplaygame.incrementAchievement(data);
    }
};

$(function () {
    
    $('.start-game').click(function(e) {
        var math = new MyMath();
        math.initialize();
        // mymath.initialize();
        $('.home').hide();
        $('.my-math').show();
        $('.result-game').hide();
        $('.back-menu').click(function(e) {
            $('.home').show();
            $('.result-game').hide();
        })
        $('.accept').click(function(e) {
            math.confirmCalculator(true)
        });
        $('.deny').click(function(e) {
            math.confirmCalculator(false)
        });
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