function onLoad() {
    if(( /(ipad|iphone|ipod|android|windows phone)/i.test(navigator.userAgent) )) {
        document.addEventListener('deviceready', initApp, false);
    } else {
        initApp();
    }
    loadBackground();
    $('.title').circleType({radius: 400});
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
        $('.title').circleType({radius: 400, fluid: true});
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