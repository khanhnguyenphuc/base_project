function sharePhoto(cb) {
     var imageLink;
    navigator.screenshot.save(function(error,res){
        if(error){
            console.log(error);
        }else{
            //For android
            imageLink = res.filePath;
            window.plugins.socialsharing.share('Message, subject, image and link', 'The subject','file://'+imageLink, 'http://www.x-services.nl');
            
           //For iOS
           //window.plugins.socialsharing.share(null,   null,imageLink, null)
        }
        if (cb) cb();
     },'jpg',50,'CrazyMath-ScreenShot' + (new Date()).getTime());
}