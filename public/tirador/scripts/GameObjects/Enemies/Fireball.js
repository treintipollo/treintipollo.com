Fireball.inheritsFrom( Attributes );

function Fireball() {
	this.hitEffect = new ShotCharge(this, 0, 0, 0, 360, 50, 30);
}

Fireball.prototype.afterCreate = function(){
	CircleCollider.prototype.create.call(this);
}

Fireball.prototype.init = function(origin, target, size, speed, angleOffset) {
	CircleCollider.prototype.init.call(this, size);

	this.parent.init.call(this);

	this.x     = origin.x;
	this.y     = origin.y;
	this.size  = size;
	this.speed = speed;
	this.dir   = VectorUtils.getFullVectorInfo(origin.x, origin.y, target.x, target.y);

	this.dir.angle += angleOffset * (Math.PI/180);  

	this.hitEffect.init(TopLevel.container, 1, "#FFFFFF", 3, "BurstParticle", 5);
	this.hitEffect.off();
}

Fireball.prototype.draw = function(context) { 	
	context.strokeStyle = "#FFFFFF";
	context.lineWidth   = 2;

	context.beginPath();
	
	context.arc(0, 0, this.size, 270*(Math.PI/180), 0, false);
	context.arc(0, 0, this.size, 0, Math.PI, false);
	context.arc(-this.size/2, 0, this.size/2, Math.PI, Math.PI*2, false);	
	context.arc(0, -this.size/2, this.size/2, 90*(Math.PI/180), -90*(Math.PI/180), true);

	context.stroke();
}

Fireball.prototype.update = function(delta) {
	this.x += -Math.cos(this.dir.angle) * this.speed * delta;
	this.y += -Math.sin(this.dir.angle) * this.speed * delta;

	this.rotation += 7;

	if(!ScreenUtils.isInScreenBoundsXY(this.x, this.y)){
		this.alive = false;
	}
}

Fireball.prototype.onHPDiminished = function(other) {}

Fireball.prototype.onDamageBlocked = function(other) {}

Fireball.prototype.onDamageReceived = function(other) {}

Fireball.prototype.onAllDamageReceived = function(other) {
	this.alive = false;
	this.hitEffect.on();
}