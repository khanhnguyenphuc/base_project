function showProgress(color, width, time) {
    $('#progress-bar').html('');
    var line = new ProgressBar.Line('#progress-bar', {
        color: color, // example : #FCB03C
        strokeWidth: width, //number : 3
        duration: time // milisecond : 1000
    });

    line.animate(1.0);
}