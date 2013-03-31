function PowerUp() {}

PowerUp.inheritsFrom( GameObject );

PowerUp.prototype.afterCreate = function(){
	CircleCollider.prototype.create.call(this);
}

PowerUp.prototype.init = function(x, y, stayInPlace) {
	this.x     		 = x;
	this.y     		 = y; 
	this.stayInPlace = stayInPlace;
	this.speed  	 = 40;
	this.rotation    = 0;

	this.reset();

	TweenUtils.startValueOscilation.call(this, "x", 0.5, 20, -20, Sine.easeOut);
}

PowerUp.prototype.setColorAndSize = function() {}

PowerUp.prototype.reset = function(color, size) {
	this.setColorAndSize();

	CircleCollider.prototype.init.call(this, this.size);
	
	if(this.colorTween)
		this.colorTween.kill();

	this.colorTween = TweenMax.to(this, 0.7, {colorProps:{color:"#000000"}, yoyo:true, repeat:-1});
}

PowerUp.prototype.gotoPosition = function(x, y) {
	TweenMax.to(this, 0.4, {x:x, y:y, onCompleteScope:this, onComplete:function(){
		this.init(x, y, this.stayInPlace, this.color);
	}});
} 	

PowerUp.prototype.update = function(delta) {
	if(this.stayInPlace == true) return;

	this.y += this.speed*delta;

	if(this.y > 850){
		this.alive = false;
	}
}

PowerUp.prototype.destroy = function() {
	TweenMax.killTweensOf(this);
}

PowerUp.prototype.onCollide = function(other){
	this.alive = false;
}

function ShotPowerUp() {}

ShotPowerUp.inheritsFrom( PowerUp );

ShotPowerUp.prototype.setColorAndSize = function() {
	this.color = "#FF0000";
	this.size  = 15; 
}

ShotPowerUp.prototype.init = function(x, y, stayInPlace) {
	PowerUp.prototype.init.call(this, x, y, stayInPlace);
}

ShotPowerUp.prototype.draw = function(context){
	DrawUtils.circle(context, 0, 0, this.size, null, "#FFFFFF", 2);
	DrawUtils.circle(context, 0, 0, this.size/2, this.color, "#FFFFFF", 2);
}

function RocketPowerUp() {}

RocketPowerUp.inheritsFrom( PowerUp );

RocketPowerUp.prototype.setColorAndSize = function() {
	this.color = "#0000FF";
	this.size  = 15; 
}

RocketPowerUp.prototype.init = function(x, y, stayInPlace) {
	PowerUp.prototype.init.call(this, x, y, stayInPlace);
}

RocketPowerUp.prototype.draw = function(context){
	DrawUtils.rectangle(context, -this.size, -this.size, this.size*2, this.size*2, null, "#FFFFFF", 2);
	DrawUtils.rectangle(context, -this.size/2, -this.size/2, this.size, this.size, this.color, "#FFFFFF", 2);	
}

function HomingRocketPowerUp() {}

HomingRocketPowerUp.inheritsFrom( PowerUp );

HomingRocketPowerUp.prototype.setColorAndSize = function() {
	this.color = "#00FF00";
	this.size  = 15; 
}

HomingRocketPowerUp.prototype.init = function(x, y, stayInPlace) {
	PowerUp.prototype.init.call(this, x, y, stayInPlace);
}

HomingRocketPowerUp.prototype.draw = function(context){
	DrawUtils.triangle(context, 0, 0, 0, -this.size, this.size, this.size, -this.size, this.size, null, "#FFFFFF", 2, 1);
	DrawUtils.triangle(context, 0, 3, 0, -this.size, this.size, this.size, -this.size, this.size, this.color, "#FFFFFF", 2, 0.5);	
}

function WeaponPowerUp() {}

WeaponPowerUp.inheritsFrom( PowerUp );

WeaponPowerUp.prototype.setColorAndSize = function() {
	this.color = "#FFFF00";
	this.size  = 15; 
}

WeaponPowerUp.prototype.init = function(x, y, stayInPlace) {
	PowerUp.prototype.init.call(this, x, y, stayInPlace, "#FFFF00", 15);
}

WeaponPowerUp.prototype.draw = function(context){
	DrawUtils.triangle(context, 0, -this.size, 0, -this.size, this.size, this.size, -this.size, this.size, this.color, "#FFFFFF", 2, 0.4);
	DrawUtils.triangle(context, 0, 0, 0, -this.size, this.size, this.size, -this.size, this.size, this.color, "#FFFFFF", 2, 0.4);
	DrawUtils.triangle(context, 0, this.size, 0, -this.size, this.size, this.size, -this.size, this.size, this.color, "#FFFFFF", 2, 0.4);
}

function HPPowerUp() {
	this.points = [];
}

HPPowerUp.inheritsFrom( PowerUp );

HPPowerUp.prototype.setColorAndSize = function() {
	this.color = "#FF0000";
	this.size  = 10; 
}

HPPowerUp.prototype.init = function(x, y, stayInPlace) {
	PowerUp.prototype.init.call(this, x, y, stayInPlace, "#FF0000", 10);

	var halfSize = this.size * 0.5;
	
	this.points[0]  = { x:-halfSize, y:-halfSize 			 };
	this.points[1]  = { x:-halfSize, y:-(halfSize+this.size) };
	this.points[2]  = { x:halfSize , y:-(halfSize+this.size) };
	
	this.points[3]  = { x:halfSize			  , y:-halfSize };
	this.points[4]  = { x:(halfSize+this.size), y:-halfSize };
	this.points[5]  = { x:(halfSize+this.size), y:halfSize  };
	
	this.points[6]  = { x:halfSize , y:halfSize 			};
	this.points[7]  = { x:halfSize , y:(halfSize+this.size) };
	this.points[8]  = { x:-halfSize, y:(halfSize+this.size) };
	
	this.points[9]  = { x:-halfSize			   , y:halfSize  };
	this.points[10] = { x:-(halfSize+this.size), y:halfSize  };
	this.points[11] = { x:-(halfSize+this.size), y:-halfSize };
}

HPPowerUp.prototype.draw = function(context){
	DrawUtils.polygon(context, 0, 0, this.points, this.color, "#FFFFFF", 2, 1);
}

function SpeedPowerUp() {}

SpeedPowerUp.inheritsFrom( PowerUp );

SpeedPowerUp.prototype.setColorAndSize = function() {
	this.color = "#00FF00";
	this.size  = 15; 
}

SpeedPowerUp.prototype.init = function(x, y, stayInPlace) {
	PowerUp.prototype.init.call(this, x, y, stayInPlace, "#00FF00", 15);
	this.rotation = 90;
}

SpeedPowerUp.prototype.draw = function(context){
	DrawUtils.triangle(context, 0, -this.size, 0, -this.size, this.size, this.size, -this.size, this.size, this.color, "#FFFFFF", 2, 0.4);
	DrawUtils.triangle(context, 0, 0, 0, -this.size, this.size, this.size, -this.size, this.size, this.color, "#FFFFFF", 2, 0.4);
	DrawUtils.triangle(context, 0, this.size, 0, -this.size, this.size, this.size, -this.size, this.size, this.color, "#FFFFFF", 2, 0.4);
}

function LivesPowerUp() {}

LivesPowerUp.inheritsFrom( PowerUp );

LivesPowerUp.prototype.setColorAndSize = function() {
	this.color = "#FFFFFF";
	this.size  = 10; 
}

LivesPowerUp.prototype.init = function(x, y, stayInPlace) {
	PowerUp.prototype.init.call(this, x, y, stayInPlace, "#FFFFFF", 10);
}

LivesPowerUp.prototype.draw = function(context){
	context.strokeStyle = "#FFFFFF";

	context.beginPath();
	context.moveTo(0, 0);
	context.arc(0, 0, this.size, 25*(Math.PI/180), 35*(Math.PI/180));
	context.closePath();

	context.moveTo(0, 0);
	context.arc(0, 0, this.size, 55*(Math.PI/180), 65*(Math.PI/180));
	context.closePath();

	context.moveTo(0, 0);
	context.arc(0, 0, this.size, 85*(Math.PI/180), 95*(Math.PI/180));
	context.closePath();

	context.moveTo(0, 0);
	context.arc(0, 0, this.size, 115*(Math.PI/180), 125*(Math.PI/180));
	context.closePath();

	context.moveTo(0, 0);
	context.arc(0, 0, this.size, 145*(Math.PI/180), 155*(Math.PI/180));
	context.closePath();

	context.strokeStyle = "#FFFFFF";
	context.stroke();

	context.beginPath();
	context.moveTo(0, 0);
	context.arc(0, 0, this.size*0.75, 0, Math.PI*2, false);
	context.closePath();

	context.lineStyle = "#FFFFFF"; 
	context.lineWidth = 2;
	context.fillStyle = "#000000";
	context.stroke();
	context.fill();

	context.beginPath();	
	context.arc(this.size*2, -this.size*2, this.size*2, Math.PI/2, Math.PI, false);
	context.arc(-this.size*2, -this.size*2, this.size*2, 0, Math.PI/2, false);
	context.closePath();

	context.lineWidth = 1;
	context.strokeStyle = "#FFFFFF";
	context.stroke();
}

function MultiPowerUp() {
	this.idleTimer = TimeOutFactory.getTimeOut(3000, -1, this, function(){		
		this.changeState();
		this.reset();
	});
}

MultiPowerUp.inheritsFrom( PowerUp );

MultiPowerUp.prototype.init = function(x, y, stayInPlace, prototypes) {
	this.prototypes = prototypes;
	this.stateIndex = Random.getRandomInt(0, prototypes.length-1);
	this.id 		= this.prototypes[this.stateIndex].id;

	this.changeState();

	prototypes[this.stateIndex].pro.init.call(this, x, y, stayInPlace);

	this.idleTimer.start();
}

MultiPowerUp.prototype.changeState = function() {
	this.setColorAndSize = this.prototypes[this.stateIndex].pro.setColorAndSize;
	this.draw            = this.prototypes[this.stateIndex].pro.draw;
	this.id 			 = this.prototypes[this.stateIndex].id;

	this.stateIndex++;
	if(this.stateIndex >= this.prototypes.length){
		this.stateIndex = 0;	
	}	
}

MultiPowerUp.prototype.destroy = function() {
	PowerUp.prototype.destroy.call(this);
	this.idleTimer.stop();
}
