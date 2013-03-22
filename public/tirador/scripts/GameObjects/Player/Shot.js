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

	this.user = pos;

	var sin = Math.sin((pos.rotation)*(Math.PI/180));
	var cos = Math.cos((pos.rotation)*(Math.PI/180));

	this.x = cos * (offSetX) - sin * (offSetY) + pos.x;
	this.y = sin * (offSetX) + cos * (offSetY) + pos.y;

	this.moveSin = Math.sin((pos.rotation-90)*(Math.PI/180));
	this.moveCos = Math.cos((pos.rotation-90)*(Math.PI/180));
	
	this.speed = speed;
	this.rotation = pos.rotation;

	this.hitEffect.init(container, 1, this.user.color, 3, "BurstParticle", 10);
	this.hitEffect.off();
}	

Shot.prototype.draw = function(context) { 	
	context.strokeStyle = this.user.color;

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
	this.x += this.moveCos * (this.speed * delta);
	this.y += this.moveSin * (this.speed * delta);

	if(!ScreenUtils.isInScreenBoundsXY(this.x, this.y)){
		this.alive = false;
	}
}

Shot.prototype.onHPDiminished = function(other) {}
Shot.prototype.onDamageBlocked = function(other) {}
Shot.prototype.onDamageReceived = function(other) {}
Shot.prototype.onAllDamageReceived = function(other) {
	this.alive = false;
	this.hitEffect.on(this.rotation+120, this.rotation+60);
}
