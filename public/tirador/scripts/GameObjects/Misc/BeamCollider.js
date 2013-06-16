BeamCollider.inheritsFrom( Attributes );

function BeamCollider() {
	this.timer = TimeOutFactory.getTimeOut(0, 1, this, function() { 
		this.alive = false;
	});
}

BeamCollider.prototype.afterCreate = function(){
	CircleCollider.prototype.create.call(this);
}

BeamCollider.prototype.init = function(x, y, radius, time, user) {
	CircleCollider.prototype.init.call(this, radius);

	this.parent.init.call(this);

	this.blockDamage = true;

	this.x = x;
	this.y = y;

	if(time != -1){
		this.timer.delay = time;
		this.timer.start();	
	}

	this.user = user;
	this.lastUserX = user.x;
	this.lastUserY = user.y;
}

BeamCollider.prototype.update = function(delta) {
	var difX = this.user.x - this.lastUserX;
	var difY = this.user.y - this.lastUserY;

	this.x += difX;
	this.y += difY;

	this.lastUserX = this.user.x;
	this.lastUserY = this.user.y;	
}

BeamCollider.prototype.destroy = function() {
	this.timer.stop();
}

BeamCollider.prototype.draw = function(context) {
	// context.strokeStyle = "#FF0000";

	// context.beginPath();
	// context.arc(0, 0, this.collider.r, 0, Math.PI*2);
	// context.closePath();

	// context.stroke();
}