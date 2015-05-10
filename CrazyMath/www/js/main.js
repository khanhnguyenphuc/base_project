function onLoad() {
    if(( /(ipad|iphone|ipod|android|windows phone)/i.test(navigator.userAgent) )) {
        document.addEventListener('deviceready', initApp, false);
    } else {
        initApp();
    }
    
}
    
function initApp() {
    initAd();
    doLoginGPlus();
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
    loadBackground();
    $('.title').circleType({radius: 400});
    createBanner();
}
$(function () {
    
    $('.start-game').click(function(e) {
        mymath.initialize();
        $('.home').hide();
        $('.my-math').show();
        $('.my-math .answer').show();
        $('.result-game').hide();
        $('.my-math .score').text(0);
        loadBackground();
        // if(AdMob) AdMob.prepareInterstitial( {adId:admobid.interstitial, autoShow:false} );
    });
    $('.back-menu').click(function(e) {
        $('.home').show();
        $('.result-game').hide();
        $('.my-math').hide();
        $('.title').circleType({radius: 400});
    })
    $('.accept').click(function(e) {
        mymath.confirmCalculator(true)
    });
    $('.deny').click(function(e) {
        mymath.confirmCalculator(false)
    });
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
});