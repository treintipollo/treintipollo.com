function Target() {};

Target.inheritsFrom( GameObject );

Target.prototype.init = function(parentShip) {
	this.p 		= parentShip;
	this.locked = false;
	this.lockX  = 0;
	this.lockY  = 0;
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
	context.arc(0, 0, 7, 0, Math.PI*2, true);
	context.closePath();

	context.stroke();
}

Target.prototype.update  = function(delta) {
	if(!this.locked){
		this.x = this.p.x + this.lockX;
		this.y = this.p.y + this.lockY;
	}

	this.rotation += 3;
}

Target.prototype.lock  = function() {
	this.locked = true;
}

Target.prototype.unlock  = function() {
	this.locked = false;

	this.lockX = this.x - this.p.x;
	this.lockY = this.y - this.p.y;
}

Target.prototype.reset  = function() {
	this.lockX = 0;
	this.lockY = -400;
}