Shot.inheritsFrom( Attributes );

function Shot() {
	this.speed     = 600;
	this.hitEffect = new ShotCharge(this, 0, 0, 120, 60, 80, 1);
}

Shot.prototype.afterCreate = function(){
	CircleCollider.prototype.create.call(this);
}

Shot.prototype.init = function(pos, container, offSetX, offSetY, speed) {
	CircleCollider.prototype.init.call(this, 7);

	this.parent.init.call(this);

	this.x     = pos.x + offSetX;
	this.y     = pos.y + offSetY; 
	this.speed = speed;
	
	this.hitEffect.init(container, 1, "#FFFFFF", 3, "BurstParticle", 10);
	this.hitEffect.off();
}	

Shot.prototype.draw = function(context) { 	
	context.strokeStyle = "#FFFFFF";

	context.beginPath();
	
	if(this.big){
		context.moveTo(-5, 10);	
		context.lineTo(0, 0);
		context.lineTo(5, 10);
		context.lineTo(0, -3);
	}else{
		context.moveTo(-5, 5);	
		context.lineTo(0, 0);
		context.lineTo(5, 5);
		context.lineTo(0, -3);	
	}
	
	context.closePath();	
	
	context.stroke();
}

Shot.prototype.update = function(delta) {
	this.y -= this.speed * delta;

	if(this.y < -20){
		this.alive = false;
	}
}

Shot.prototype.onHPDiminished = function(other) {}
Shot.prototype.onDamageBlocked = function(other) {}
Shot.prototype.onDamageReceived = function(other) {}
Shot.prototype.onAllDamageReceived = function(other) {
	this.alive = false;
	this.hitEffect.on();
}
