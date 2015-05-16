var arrAchivement = ['CgkI-43u0ukaEAIQAQ','CgkI-43u0ukaEAIQAg', 'CgkI-43u0ukaEAIQBQ', 'CgkI-43u0ukaEAIQBg', 'CgkI-43u0ukaEAIQBw'];
var leaderboardId = 'CgkI-43u0ukaEAIQAw';
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
