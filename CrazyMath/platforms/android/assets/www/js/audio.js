var lstMedia = {};
function playSound(type, src) {
    // Media player
    var mp3URL = getURL(src);
    if (!lstMedia[type]) {
        lstMedia[type] = new Media(mp3URL);
    }
    lstMedia[type].play(lstMedia[type].stop());
}
function getURL(s) {
    if(cordova.platformId.toLowerCase() === "android") return "/android_asset/www/" + s;
    return s;
}