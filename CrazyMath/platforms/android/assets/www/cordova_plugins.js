cordova.define('cordova/plugin_list', function(require, exports, module) {
module.exports = [
    {
        "file": "plugins/com.a42.cordova.googleplaygame/www/google-play-game.js",
        "id": "com.a42.cordova.googleplaygame.GooglePlayGame",
        "clobbers": [
            "googleplaygame"
        ]
    },
    {
        "file": "plugins/nl.x-services.plugins.socialsharing/www/SocialSharing.js",
        "id": "nl.x-services.plugins.socialsharing.SocialSharing",
        "clobbers": [
            "window.plugins.socialsharing"
        ]
    },
    {
        "file": "plugins/com.darktalker.cordova.screenshot/www/Screenshot.js",
        "id": "com.darktalker.cordova.screenshot.screenshot",
        "merges": [
            "navigator.screenshot"
        ]
    },
    {
        "file": "plugins/com.google.cordova.admob/www/AdMob.js",
        "id": "com.google.cordova.admob.AdMob",
        "clobbers": [
            "window.AdMob"
        ]
    }
];
module.exports.metadata = 
// TOP OF METADATA
{
    "com.a42.cordova.googleplaygame": "2.0.4",
    "nl.x-services.plugins.socialsharing": "4.3.18",
    "com.darktalker.cordova.screenshot": "0.1.1",
    "com.google.cordova.admob": "2.7.5",
    "com.google.playservices": "21.0.0",
    "android.support.v4": "21.0.1",
    "com.rjfun.cordova.extension": "1.0.6"
}
// BOTTOM OF METADATA
});