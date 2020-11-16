function CacheCanvas(store, color, width, height) {
	var canvas = document.createElement("canvas");

	canvas.width = width * 2;
	canvas.height = height * 2;

	var ctx = canvas.getContext("2d");

	ctx.strokeStyle = color;

	ctx.beginPath();
	ctx.rect(0.5, 0.5, Math.floor(width), Math.floor(height));
	ctx.closePath();

	ctx.stroke();
	
	store.set(String(color) + String(width) + String(height), canvas);
}

function HasCacheCanvas(store, color, width, height)
{
	return store.has(String(color) + String(width) + String(height));
}

function GetCacheCanvas(store, color, width, height)
{
	return store.get(String(color) + String(width) + String(height));
}

function DrawParticle(context, store, color, width, height)
{
	if (!HasCacheCanvas(store, color, width, height))
		CacheCanvas(store, color, width, height);

	var cnvs = GetCacheCanvas(store, color, width, height);

	context.drawImage(cnvs, -width / 2, -height / 2);
}

function ExhaustParticle() {}

ExhaustParticle.inheritsFrom( GameObject );

ExhaustParticle.canvases = new Map();

ExhaustParticle.prototype.init = function(type, parentContext, bezierPoints, color, life, side) {
	this.parentContext = parentContext;
	this.bezierPoints  = bezierPoints;
	this.type 		   = type;
	this.color 		   = color;

	this.life = 0;
	this.step = 1.0/life;
	this.side = side;

	var pos = BezierCurve.getPoint(0, this.bezierPoints.call(this.parentContext, this.side, this.type));

	this.x = pos.x;
	this.y = pos.y;
}

ExhaustParticle.prototype.draw = function(context) {
	DrawParticle(context, ExhaustParticle.canvases, this.color, 2.5, 2.5);
}

ExhaustParticle.prototype.update = function(delta) {
	this.life += this.step * (delta * 50);

	this.alive = this.parentContext.alive;
	
	if(this.life >= 1.0){
		this.alive = false;
	}else{
		var pos = BezierCurve.getPoint(this.life, this.bezierPoints.call(this.parentContext, this.side, this.type));
		this.x = pos.x;
		this.y = pos.y;
	}
}

function TractorBeamParticle() {}

TractorBeamParticle.inheritsFrom( GameObject );

TractorBeamParticle.canvases = new Map();

TractorBeamParticle.prototype.init = function(parentContext, bezierPoints, color, life, side) {
	this.parentContext = parentContext;
	this.bezierPoints  = bezierPoints;
	this.color 		   = color;

	this.life = 0;
	this.step = 1.0/life;
	this.side = side;

	var pos = BezierCurve.getPoint(0, this.bezierPoints.call(this.parentContext, this.side));

	this.x = pos.x;
	this.y = pos.y;
}

TractorBeamParticle.prototype.draw = function(context) { 
	DrawParticle(context, TractorBeamParticle.canvases, this.color, 2.5, 2.5);
}

TractorBeamParticle.prototype.update = function(delta) { 	
	this.life += this.step * (delta * 50);

	this.alive = this.parentContext.alive;
	
	if(this.life >= 1.0){
		this.alive = false;
	}else{
		var pos = BezierCurve.getPoint(this.life, this.bezierPoints.call(this.parentContext, this.side));

		this.x = pos.x;
		this.y = pos.y;
	}
}

function ShotChargeParticle() {}

ShotChargeParticle.inheritsFrom( GameObject );

ShotChargeParticle.canvases = new Map();

ShotChargeParticle.prototype.init = function(parent, xOffset, yOffset, radius, startAngle, endAngle, color, size, minSpeed, maxSpeed) { 
    this.parent  = parent;
	this.radius  = Random.getRandomArbitary(radius/2, radius);
	this.xOffset = xOffset;
	this.yOffset = yOffset;
	this.color   = color;
	this.pSize   = size;

	minSpeed = minSpeed ? minSpeed : 150;
	maxSpeed = maxSpeed ? maxSpeed : 300;
	this.speed = Random.getRandomArbitary(minSpeed, maxSpeed);

	var a = Random.getRandomArbitary(startAngle, endAngle) * (Math.PI/180);
	
	this.dirX = Math.cos(a);
	this.dirY = Math.sin(a);

	this.x = this.xOffset + this.parent.x + this.dirX * this.radius;
	this.y = this.yOffset + this.parent.y + this.dirY * this.radius;
}

ShotChargeParticle.prototype.draw = function(context) {
	DrawParticle(context, ShotChargeParticle.canvases, this.color, this.pSize, this.pSize);
}

ShotChargeParticle.prototype.update = function(delta) {
	this.radius -= this.speed * delta;

	if(this.radius <= 0){
		this.alive = false;	
	}else{
		this.x = this.xOffset + this.parent.x + this.dirX * this.radius;
		this.y = this.yOffset + this.parent.y + this.dirY * this.radius;
	}
}

function BurstParticle() {}

BurstParticle.inheritsFrom( GameObject );

BurstParticle.canvases = new Map();

BurstParticle.prototype.init = function(parent, xOffset, yOffset, radius, startAngle, endAngle, color, size, minSpeed, maxSpeed) { 
	this.radius  = Random.getRandomArbitary(radius/2, radius);
	this.xOffset = xOffset;
	this.yOffset = yOffset;
	this.color   = color;
	this.pSize   = size;

	minSpeed = minSpeed ? minSpeed : 100;
	maxSpeed = maxSpeed ? maxSpeed : 500;
	this.speed = Random.getRandomArbitary(minSpeed, maxSpeed);

	var a = Random.getRandomArbitary(startAngle, endAngle) * (Math.PI/180);
	
	this.dirX = Math.cos(a);
	this.dirY = Math.sin(a);

	this.x = this.xOffset + parent.x;
	this.y = this.yOffset + parent.y;
}

BurstParticle.prototype.draw = function(context) {
	DrawParticle(context, BurstParticle.canvases, this.color, this.pSize, this.pSize);
}

BurstParticle.prototype.update = function(delta) {
	this.radius -= this.speed * delta;

	if(this.radius <= 0) {
		this.alive = false;
	}else{
		this.x += this.dirX * this.speed * delta;
		this.y += this.dirY * this.speed * delta;
	}
}

function BurstParticleRadius() {}

BurstParticleRadius.inheritsFrom( BurstParticle );

BurstParticleRadius.prototype.init = function(parent, xOffset, yOffset, radius, angle, color, size, minSpeed, maxSpeed, spawnRadius) { 
	BurstParticle.prototype.init.call(this, parent, xOffset, yOffset, radius, 0, 0, color, size, minSpeed, maxSpeed);    

	var a = Random.getRandomArbitary(0, 360) * (Math.PI/180);
	angle *= (Math.PI/180);

	this.x = this.xOffset + parent.x + Math.cos(a)*spawnRadius;
	this.y = this.yOffset + parent.y + Math.sin(a)*spawnRadius;

	a = Math.atan2((this.yOffset + parent.y + Math.sin(angle)*radius) - this.y,
				   (this.xOffset + parent.x + Math.cos(angle)*radius) - this.x);

	this.dirX = Math.cos(a);
	this.dirY = Math.sin(a);
}

function RadialParticle() {}

RadialParticle.inheritsFrom( GameObject );

RadialParticle.canvases = new Map();

RadialParticle.prototype.init = function(user, color, radius, life, startAngle, endAngle) {
	this.user   = user;
	this.radius = radius;
	this.color  = color;
	this.life   = life;
	
	var a = Random.getRandomArbitary(startAngle, endAngle) * (Math.PI/180);
	
	this.dirX = Math.cos(a);
	this.dirY = Math.sin(a);

	this.x = this.user.x + this.dirX * this.radius;
	this.y = this.user.y + this.dirY * this.radius;
}

RadialParticle.prototype.draw = function(context) {
	DrawParticle(context, RadialParticle.canvases, this.color, 2.5, 2.5);
}

RadialParticle.prototype.update = function(delta) {
	this.life -= delta * 100;

	if(this.life < 0){
		this.alive = false;
	}
}

function StraightParticle() {}

StraightParticle.inheritsFrom( GameObject );

StraightParticle.canvases = new Map();

StraightParticle.prototype.init = function(x, y, angle, color, size, maxSpeed, life) { 
	this.x     = x;
	this.y     = y;
	this.color = color;
	this.size  = size;
	
	this.speed = Random.getRandomArbitary(0, maxSpeed);
	this.life  = life;
	this.side  = Random.getRandomBetweenToValues(1, -1);

	this.dirX = Math.cos(angle) * this.side;
	this.dirY = Math.sin(angle) * this.side;
}

StraightParticle.prototype.draw = function(context) {
	DrawParticle(context, StraightParticle.canvases, this.color, this.size, this.size);
}

StraightParticle.prototype.update = function(delta) {
	this.life -= delta * 100;

	if(this.life < 0){
		this.alive = false;
	}else{
		this.x += this.dirX * this.speed * delta;
		this.y += this.dirY * this.speed * delta;
	}
}