function Target(parentShip) {
	this.p = parentShip;
};

Target.inheritsFrom( GameObject );

Target.prototype.setStyles = function(context) {
		
}

Target.prototype.draw = function(context) {
	context.strokeStyle = "#FF0000";

	for(var i=0; i<4; i++){
		var a = (45 * (i+1)) + (45*i);

		var x = Math.cos(a*(Math.PI/180)) * 20;
		var y = Math.sin(a*(Math.PI/180)) * 20;

		context.beginPath();
		
		context.moveTo(x, y);
		context.arc(0, 0, 30, (a-7.5)*(Math.PI/180), (a+7.5)*(Math.PI/180));
		context.closePath();	

		context.stroke();
	}

	context.strokeStyle = "#FF0000";

	context.beginPath();
	//context.moveTo(0, 0);
	context.arc(0, 0, 7, 0, Math.PI*2, true);
	context.closePath();

	context.stroke();
}

Target.prototype.setFills  = function(context) {}

Target.prototype.update  = function() {
	this.x = this.p.x;
	this.y = this.p.y - 600;
	this.rotation += 3;
}