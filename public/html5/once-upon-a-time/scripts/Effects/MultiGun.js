MultiGun.ShotArguments = [];

function MultiGun(spots, origin, target, onComplete, properties) {
	this.chargeSpots = [];

	for(var i=0; i<spots.length; i++){
		this.chargeSpots.push(new ShotCharge(spots[i], 0, 0, 0, 360, properties.chargeRadii));
		this.chargeSpots[i].init(TopLevel.container, 30, properties.chargeColor, properties.chargeParticleSize);
	}

	this.onComplete = onComplete;
	
	this.shootTimer = TimeOutFactory.getTimeOut(properties.shotDelay, properties.shotCount, this, function(){
		MultiGun.ShotArguments[0] = origin;
		MultiGun.ShotArguments[1] = target;
		MultiGun.ShotArguments[2] = spots;
		MultiGun.ShotArguments[3] = properties.shotColor;
		MultiGun.ShotArguments[4] = properties.shotRadius;
		MultiGun.ShotArguments[5] = properties.formationTime;
		MultiGun.ShotArguments[6] = properties.shotSpeed;
		MultiGun.ShotArguments[7] = properties.rotationSpeed;

		TopLevel.container.add("MultiShot", MultiGun.ShotArguments);
	});

	this.shootTimer.onComplete = function(){
		this.forceDisable();	
	} 
}

MultiGun.prototype.fire = function() {
	this.shootTimer.start();	
}

MultiGun.prototype.charge = function() {
	for(var i=0; i<this.chargeSpots.length; i++){
		this.chargeSpots[i].on();
	}
}

MultiGun.prototype.disable = function() {
	for(var i=0; i<this.chargeSpots.length; i++){
		this.chargeSpots[i].off();
	}

	this.shootTimer.stop();	
}

MultiGun.prototype.forceDisable = function() {
	this.disable();

	if(this.onComplete != null) 
		this.onComplete();
}

MultiGun.prototype.destroy = function() {
	for(var i=0; i<this.chargeSpots.length; i++){
		this.chargeSpots[i].destroy();
	}

	this.chargeSpots.length = 0;
	this.chargeSpots = null;

	this.shootTimer.remove();		
}

MultiShot.inheritsFrom( Attributes );

MultiShot.LineArguments = [];

function MultiShot() {

	this.particles = new ShotCharge(this, 0, 0, 0, 360, 10);
	this.trailEffect = new ShotChargeRadius(this, 0, 0, 0, 50, -1);

	this.lines = [];
}

MultiShot.prototype.afterCreate = function(){
	CircleCollider.prototype.create.call(this);
}

MultiShot.prototype.init = function(user, target, spots, color, radius, formationTime, speed, rotationSpeed) {
	CircleCollider.prototype.init.call(this, radius);

	Attributes.prototype.init.call(this);

	this.spots  	   = spots;
	this.color  	   = color;
	this.radius 	   = radius;
	this.formationTime = formationTime;
	this.speed 		   = speed;
	this.rotationSpeed = rotationSpeed;

	this.particles.init(TopLevel.container, 10, this.color, 2, "BurstParticle", 1, 10, 70, 0);
	
	this.particles.on();

	this.createLine(0, 1); 

	this.user   = user;
	this.target = target;
	this.dir    = null;
	this.shoot  = false;
}

MultiShot.prototype.createLine = function(current, next) {
	
	MultiShot.LineArguments[0] = this.spots[current];
	MultiShot.LineArguments[2] = this.color;
	MultiShot.LineArguments[3] = 2;
	MultiShot.LineArguments[4] = this.formationTime;
	
	if(current == this.spots.length-1){
		MultiShot.LineArguments[1] = this.spots[0];
		MultiShot.LineArguments[5] = FuntionUtils.bindScope(this, function(){	
			this.particles.off();	
			this.shoot = true;	

			for(var i=0; i<this.lines.length; i++){
				this.lines[i].alive = false;		
			}

			this.dir = VectorUtils.getFullVectorInfo(this.user.x, this.user.y, this.target.x, this.target.y);
	
			this.trailEffect.angle = this.dir.angle * (180/Math.PI);
			this.trailEffect.init(TopLevel.container, 30, this.color, 3, "BurstParticleRadius", 5, 100, 300, this.radius);
			this.trailEffect.on();
		});
	}else{
		MultiShot.LineArguments[1] = this.spots[next];
		MultiShot.LineArguments[5] = FuntionUtils.bindScope(this, function(){	
			this.createLine(next, next+1);
		});
	}
	
	var line = TopLevel.container.add("PercentageLine", MultiShot.LineArguments);
	this.particles.parent = line.currentEnd;
	this.lines.push(line);
}

MultiShot.prototype.update = function(delta) {
	if(this.dir){
		this.x += this.dir.dir.x * this.speed * delta;
		this.y += this.dir.dir.y * this.speed * delta;

		this.rotation += this.rotationSpeed;

		if(this.x < -(this.radius*2) || this.x > TopLevel.canvas.width+(this.radius*2) || this.y < -(this.radius*2)  || this.y > TopLevel.canvas.height + (this.radius*2)){
			this.alive = false;
		}

	}else{
		this.x = this.user.x;
		this.y = this.user.y;
	}
}

MultiShot.prototype.destroy = function() {
	this.particles.off();
	this.trailEffect.off();
	this.lines.length = 0;
}

MultiShot.prototype.draw = function(context) {
	if(this.shoot){
		context.strokeStyle = this.color;
		context.lineWidth   = 2;

		context.beginPath();

		context.moveTo(this.spots[0].offsetX, this.spots[0].offsetY);
		for(var i=1; i<this.spots.length; i++){
			context.lineTo(this.spots[i].offsetX, this.spots[i].offsetY);
		}

		context.closePath();

		context.stroke();
	}
}

MultiShot.prototype.onAllDamageReceived = function(other) {
	this.alive = false;
}