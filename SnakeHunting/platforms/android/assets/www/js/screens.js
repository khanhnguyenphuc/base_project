var CELL_SIZE = 10;
// var FPS = 10  ;
// var WIDTH = $(window).width();
// var HEIGHT = $(window).height();
function Screen(canvas, bgSrc, bgClr, title, color){
	var timer;
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
		if (bgSrc != '') {
			var img = new Image();
			img.src= bgSrc;
			// draw image at top-left corner
			context.drawImage(img,0,0);
			// draw original image right beside the previous image
			context.drawImage(img,img.width,0);
		} else if (bgClr != '') {
			context.fillStyle = bgClr;
			context.fillRect(0,0,width,height);
		} else {
			context.fillStyle = "black";
			context.fillRect(0,0,width,height);
		}
			
		// context.fillStyle = "black";
		// context.fillRect(0,0,width,height);
		context.font = "70px Arial";
		context.textAlign = "center";
		context.fillStyle = color;
		context.fillText(title,canvas.width/2,canvas.height/2-100);
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
				if(self.items[i].onclick  && 
					self.items[i].contain(x,y))
					self.items[i].onclick(x,y);
			}
		};
		canvas.onmousemove = function(e){
		// change the isMouseOver property of each MenuItem
		var x = e.pageX - this.offsetLeft;
		var y = e.pageY - this.offsetTop;
		canvas.style.cursor = 'default';
		for(var i=0;i<self.items.length;i++){
			self.items[i].isMouseOver  = 
			self.items[i].contain(x,y);
		// change the cursor type to hand
		if(self.items[i].isMouseOver)
			canvas.style.cursor = 'pointer';
		}
		};
		timer = setInterval(function(){
			self.update();
			self.draw();
		},1000/FPS);
	};
	this.stop = function(){
		if(timer)
			clearInterval(timer);
		timer = null;
	};
	this.addItem = function(item){
		this.items.push(item);
	};
	this.clear = function() {
		context.clearRect(0,0,width, height);
		this.items.forEach(function(v) {
			v.clear();
		});
	};
}