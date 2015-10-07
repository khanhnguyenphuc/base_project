
function onLoad() {
    if(( /(ipad|iphone|ipod|android|windows phone)/i.test(navigator.userAgent) )) {
        document.addEventListener('deviceready', initApp, false);
    } else {
        initApp();
    }
    
}
var initApp = function() {
    doLoginGPlus();
    initAd();
    loadBackground();
    //fix html for special device
    if (window.innerWidth < 250) {
        $('.start-game').html('<i class="fa fa-play fa-2x text-success"></i>');
        $('.leaderboard-game').html('<i class="fa fa-area-chart text-info"></i>');
        $('.achievement-game').html('<i class="fa fa-trophy text-info"></i>');
        $('.rate-game').html('<a href="https://play.google.com/store/apps/details?id=puka.crazymath"><i class="fa fa-star text-info"></i></a>');
        $('.back-menu').html('<i class="fa fa-home text-info"></i>');
        $('.share-game').html('<i class="fa fa-share-alt-square text-info"></i>');
        $('.accept').html('<i class="fa fa-check fa-3x text-success"></i>');
        $('.deny').html('<i class="fa fa-close fa-3x text-danger"></i>');
    }

    $('.title').circleType({radius: 400});
    createBanner();
    createInterstitial();
    showInterstitial();
};
var showInterstitial = function() {
    setInterval(function() {
        if (mymath.isEndGame && (mymath.countPlaying % 5 == 0)){
            AdMob.showInterstitial();
            mymath.countPlaying += 1;
        }

    }, 100);
}
$(function () {
    
    $('.start-game').click(function(e) {
        mymath.countPlaying += 1;
        mymath.initialize();

        $('.home').hide();
        $('.my-math').show();
        $('.my-math .answer').show();
        $('.result-game').hide();
        $('.my-math .score').text(0);
        loadBackground();

        createInterstitial();
        // if(AdMob) AdMob.prepareInterstitial( {adId:admobid.interstitial, autoShow:false} );
    });
    $('.back-menu').click(function(e) {
        $('.home').show();
        $('.result-game').hide();
        $('.my-math').hide();
        $('.title').circleType({radius: 400});
    })
    $('.accept')[0].addEventListener("touchstart", function(e) {
        mymath.confirmCalculator(true)
    }, false);
    $('.deny')[0].addEventListener("touchstart", function(e) {
        mymath.confirmCalculator(false)
    }, false);
    $('.leaderboard-game').click(function(e) {
        googleplaygame.showLeaderboard({
            leaderboardId: leaderboardId
        });
    });
    $('.achievement-game').click(function(e) {
        googleplaygame.showAchievements();
    });
    $('.share-game').click(function(e) {
        AdMob.removeBanner(function() {
            sharePhoto(function() {
                createBanner();
            });
        });
        
    });

    $('.rate-game').on('click', function(e) {
        // Find device platform using the plugin org.apache.cordova.device
        var devicePlatform = cordova.platformId;
        // Check which platform
        if (devicePlatform == "iOS") {
            // window.open('https://itunes.apple.com/us/app/YOUR-APP-SLUG-HERE/id000000000?mt=8&uo=4'); // or itms://
        } else if (devicePlatform == "android") {
            window.open('market://details?id=puka.crazymath', '_system');
        } else if (devicePlatform == "BlackBerry"){
            // window.open('http://appworld.blackberry.com/webstore/content/<applicationid>');
        }
    });
    
});