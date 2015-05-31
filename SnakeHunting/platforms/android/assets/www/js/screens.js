// var CELL_SIZE = 10;
var FPS_SCREEN = 10    ;
// var WIDTH = $(window).width() - 20;
// var HEIGHT = $(window).height() - 20;
 
function Screen(canvas){
    var screen_timer;
    var width = canvas.width;
    var height = canvas.height;
    var context = canvas.getContext("2d");
    this.items = [];
    // this method/event is actived in the end of draw() method
    this.afterDraw = null;
 
    this.update = function(){
        for(var i=0;i<this.items.length;i++){
            this.items[i].update();
        }
    };
    this.draw = function(){
 
        context.font = 'snakeElec';
        context.fillStyle = "green";
        context.fillRect(0,0,width,height);
        // var img = new Image();
        //     img.src="img/green.png";
        //     img.onload = function(){
        //         // create pattern
        //         var ptrn = context.createPattern(img, 'repeat'); // Create a pattern with this image, and set it to "repeat".
        //         context.fillStyle = ptrn;
        //         context.fillRect(0, 0, canvas.width, canvas.height); // context.fillRect(x, y, width, height);
        //     }
        for(var i=0;i<this.items.length;i++){
            this.items[i].draw(context);
        }
 
        if(this.afterDraw)
            this.afterDraw(context);
    };
    this.start = function(){
        this.stop();
        var self = this;
        // register events
        canvas.onclick = function(e){
            // raise the onclick event of each MenuItem when it is clicked
            var x = e.pageX - this.offsetLeft;
            var y = e.pageY - this.offsetTop;
            for(var i=0;i<self.items.length;i++){
                if(self.items[i].onclick && self.items[i].contain(x,y))
                    self.items[i].onclick(x,y);
            }
        };
        canvas.onmousemove = function(e){
            // change the isMouseOver property of each MenuItem
            var x = e.pageX - this.offsetLeft;
            var y = e.pageY - this.offsetTop;
            canvas.style.cursor = 'default';
            for(var i=0;i<self.items.length;i++){
                self.items[i].isMouseOver = self.items[i].contain(x,y);
                // change the cursor type to hand
                if(self.items[i].isMouseOver)
                    canvas.style.cursor = 'pointer';
            }
        };
        screen_timer = setInterval(function(){
            self.update();
            self.draw();
        },1000/FPS_SCREEN);
    };
    this.stop = function(){
        if(screen_timer)
            clearInterval(screen_timer);
        screen_timer = null;
    };
    this.addItem = function(item){
        this.items.push(item);
    };
}