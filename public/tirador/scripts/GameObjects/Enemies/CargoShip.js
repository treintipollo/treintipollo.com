CargoShip.inheritsFrom( Attributes );

function CargoShip() {
	if (typeof Exhaust === "undefined") { return; }

	this.SHAKE_MOTION;
	this.IDLE_MOTION;
	
	var exhaustPoints = [];
	exhaustPoints.push({ x:0, y:0 });
	exhaustPoints.push({ x:0, y:0 });
	exhaustPoints.push({ x:0, y:0 });
	exhaustPoints.push({ x:0, y:0 });

	function getExhaustPoints60(side, type)  { return getExhaustPoints(exhaustPoints, this.x, this.y+this.exhaustOffset, this.rotation, 60,  this.exhaustRadius, side, type); };
	function getExhaustPoints90(side, type)  { return getExhaustPoints(exhaustPoints, this.x, this.y+this.exhaustOffset, this.rotation, 90,  this.exhaustRadius, side, type); };
	function getExhaustPoints120(side, type) { return getExhaustPoints(exhaustPoints, this.x, this.y+this.exhaustOffset, this.rotation, 120, this.exhaustRadius, side, type); };
	
	function getExhaustPoints(result, x, y, rotation, angle, r, side, type) {
		angle += rotation;

		var sin = Math.sin(angle * (Math.PI/180));
		var cos = Math.cos(angle * (Math.PI/180));

		var sinPerp = 0.0;
		var cosPerp = 0.0;
		var divide  = 2;

		if(type == Exhaust.NEUTRAL) { divide = 2; }
		if(type == Exhaust.UP)	    { divide = 1; }
		if(type == Exhaust.DOWN)    { divide = 2.5; }

		if(side){
			sinPerp = Math.sin((angle-30)  * (Math.PI/180));
			cosPerp = Math.cos((angle-30)  * (Math.PI/180));	
		}else{
			sinPerp = Math.sin((angle+30)  * (Math.PI/180));
			cosPerp = Math.cos((angle+30)  * (Math.PI/180));
		}

		result[0].x = x + cos * r;
		result[0].y = y + sin * r;

		result[1].x = x + cosPerp * r * 2/divide;
		result[1].y = y + sinPerp * r * 2/divide;

		result[2].x = x + cos  * r * 3/divide;
		result[2].y = y + sin  * r * 3/divide;

		result[3].x = x + cos  * r * 4/divide;
		result[3].y = y + sin  * r * 4/divide;

		return result;
	};

	this.exhaust60  = new Exhaust(getExhaustPoints60, this);
	this.exhaust90  = new Exhaust(getExhaustPoints90, this);
	this.exhaust120 = new Exhaust(getExhaustPoints120, this);
	
	this.trembleTimer = TimeOutFactory.getTimeOut(500, 1, this, function(){
		this.currentMotion.set(this.IDLE_MOTION);
	});

	this.explosionArea = new ExplosionsArea();
}

CargoShip.prototype.afterCreate = function(){
	this.size = 30;
	
	this.exhaustOffset    = this.size*0.3;
	this.exhaustRadius    = this.size*0.8;
	this.engineSize       = this.size*0.7
	this.innerWindow      = this.size*0.3;
	this.outerWindow      = this.size*0.5;
	this.middleWindow     = this.size*0.4;
	this.middleDetailSize = this.size*0.025;


	var x1 = Math.cos(270*(Math.PI/180)) * this.size;
	var y1 = Math.sin(270*(Math.PI/180)) * this.size;

	var x2 = Math.cos(30*(Math.PI/180)) * this.size;
	var y2 = Math.sin(30*(Math.PI/180)) * this.size;

	var x3 = Math.cos(150*(Math.PI/180)) * this.size;
	var y3 = Math.sin(150*(Math.PI/180)) * this.size;

	var ax1 = Math.cos(330*(Math.PI/180)) * this.size;
	var ay1 = Math.sin(330*(Math.PI/180)) * this.size;

	var ax2 = Math.cos(90*(Math.PI/180)) * this.size;
	var ay2 = Math.sin(90*(Math.PI/180)) * this.size;

	var ax3 = Math.cos(210*(Math.PI/180)) * this.size;
	var ay3 = Math.sin(210*(Math.PI/180)) * this.size;


	this.points = [new SAT.Vector(x1,y1),
				   new SAT.Vector(ax1,ay1),
				   new SAT.Vector(x2,y2),
				   new SAT.Vector(ax2,ay2),
				   new SAT.Vector(x3,y3),
				   new SAT.Vector(ax3,ay3)];

	PolyCollider.prototype.create.call(this, this.points);
}

CargoShip.prototype.init = function(x, y, speed, container){
	Attributes.prototype.init.call(this);

	this.x 		   = x;
	this.y 		   = y;
	this.container = container;
	this.speed     = speed;

	this.color          = "#FFFFFF";
	this.rotation       = 0;
	
	this.shakeCounter   = 0;
	this.totalVariation = {x:0, y:0};
	this.lastVar        = {x:0, y:0};
	
	this.exhaust60.init(this.container);
	this.exhaust90.init(this.container);
	this.exhaust120.init(this.container);
	
	this.exhaust60.speedUp();
	this.exhaust90.speedUp();
	this.exhaust120.speedUp();

	this.createStateMachine();
}

CargoShip.prototype.createStateMachine = function() {
	this.currentMotion = new StateMachine(true, this);

	var shake = function(){
		if(this.shakeCounter % 2 == 0){
			var sX = Random.getRandomArbitary(-5.0, 5.0);
			var sY = Random.getRandomArbitary(-5.0, 5.0);

			this.totalVariation.x = sX;
			this.totalVariation.y = sY;

			this.lastVar.x = sX;
			this.lastVar.y = sY;
		}else{
			this.totalVariation.x = -this.lastVar.x;
			this.totalVariation.y = -this.lastVar.y;
		}
		this.shakeCounter++;
	}

	var startTrembleTimer = function(repeateCount){
		this.trembleTimer.start();	
	}	

	var idle = function(){
		this.totalVariation.x = 0;
		this.totalVariation.y = 0;
		this.lastVar.x = 0;
		this.lastVar.y = 0;
	}

	this.SHAKE_MOTION = this.currentMotion.add(startTrembleTimer, shake, null); 
	this.IDLE_MOTION  = this.currentMotion.add(null, idle, null);

	this.currentMotion.set(this.IDLE_MOTION);
}

CargoShip.prototype.draw = function(context) { 
	context.strokeStyle = this.color;

	context.beginPath();
	
	context.moveTo(0, this.exhaustOffset);
	context.arc(0, this.exhaustOffset, this.exhaustRadius, 55*(Math.PI/180), 65*(Math.PI/180));
	context.closePath();

	context.moveTo(0, this.exhaustOffset);
	context.arc(0, this.exhaustOffset, this.exhaustRadius, 85*(Math.PI/180), 95*(Math.PI/180));
	context.closePath();

	context.moveTo(0, this.exhaustOffset);
	context.arc(0, this.exhaustOffset, this.exhaustRadius, 115*(Math.PI/180), 125*(Math.PI/180));
	context.closePath();

	context.stroke();

	DrawUtils.circle(context, 0, this.exhaustOffset, this.engineSize, "#000000", this.color, 1);

	DrawUtils.quadraticPolygon(context, 0, 0, this.points, "#000000", this.color, 1);
	
	DrawUtils.circle(context, 0, 0, this.innerWindow, null, this.color, 1);
	DrawUtils.circle(context, 0, 0, this.outerWindow, null, this.color, 1);

	var angleStep = 360/8;
	for(var i=0; i<8; i++){
		DrawUtils.circle(context, Math.cos((angleStep*i)*(Math.PI/180)) * this.middleWindow, Math.sin((angleStep*i)*(Math.PI/180)) * this.middleWindow, this.middleDetailSize, this.color, null, 1);
	}
}

CargoShip.prototype.update = function(delta) { 	
	this.currentMotion.update();
	
	this.x += this.totalVariation.x;
	this.y += (this.speed*delta) + this.totalVariation.y;

	this.exhaust60.update();
	this.exhaust90.update();
	this.exhaust120.update(); 

	if(ScreenUtils.isPastTop(this.y, this.size+50)){
		this.setDestroyMode(GameObject.NO_CALLBACKS);
	}
}

CargoShip.prototype.destroy = function(){
	this.exhaust60.off();
	this.exhaust90.off();
	this.exhaust120.off(); 
	
	this.explosionArea.stop();
}

CargoShip.prototype.onHPDiminished = function(other) {
	this.currentMotion.set(this.SHAKE_MOTION);
}

CargoShip.prototype.onAllDamageReceived = function(other) {
	TopLevel.powerUpFactory.create(this.x, this.y, "HPPowerUp", 1, false);
	
	this.explosionArea.init(this, this.size, 35, 10, 30, function(){
		this.origin.alive = false;
	});
}