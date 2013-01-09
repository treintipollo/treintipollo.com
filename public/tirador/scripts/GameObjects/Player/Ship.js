function Ship() {
	this.speedX = 100;
	this.speedY = 100;
	
	var exhaustPoints = [];
	exhaustPoints.push({ x:0, y:0 });
	exhaustPoints.push({ x:0, y:0 });
	exhaustPoints.push({ x:0, y:0 });
	exhaustPoints.push({ x:0, y:0 });

	function getExhaustPoints30(side, type)  { return getExhaustPoints(exhaustPoints, this.x, this.y, 30,  20, side, type); };
	function getExhaustPoints60(side, type)  { return getExhaustPoints(exhaustPoints, this.x, this.y, 60,  20, side, type); };
	function getExhaustPoints90(side, type)  { return getExhaustPoints(exhaustPoints, this.x, this.y, 90,  20, side, type); };
	function getExhaustPoints120(side, type) { return getExhaustPoints(exhaustPoints, this.x, this.y, 120, 20, side, type); };
	function getExhaustPoints150(side, type) { return getExhaustPoints(exhaustPoints, this.x, this.y, 150, 20, side, type); };

	function getExhaustPoints(result, x, y, angle, r, side, type) {
		var sin = Math.sin(angle  * (Math.PI/180));
		var cos = Math.cos(angle  * (Math.PI/180));

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

	this.exhaust30  = new Exhaust(getExhaustPoints30, this);
	this.exhaust60  = new Exhaust(getExhaustPoints60, this);
	this.exhaust90  = new Exhaust(getExhaustPoints90, this);
	this.exhaust120 = new Exhaust(getExhaustPoints120, this);
	this.exhaust150 = new Exhaust(getExhaustPoints150, this);

	this.weapon = new ShotWeapon(0, this);
	this.collider = new SAT.Circle(new SAT.Vector(0, 0), 15);
}

Ship.inheritsFrom( GameObject );

Ship.prototype.init = function(x, y, container){
	this.x = x;
	this.y = y;
	this.container = container;

	this.exhaust30.init(this.container);
	this.exhaust60.init(this.container);
	this.exhaust90.init(this.container);
	this.exhaust120.init(this.container);
	this.exhaust150.init(this.container);

	this.weapon.init(this.container);
}

Ship.prototype.draw = function(context) { 
	context.strokeStyle = "#FFFFFF";

	//30 grados	
	context.beginPath();
	context.moveTo(0, 0);
	context.arc(0, 0, 20, 25*(Math.PI/180), 35*(Math.PI/180));
	context.closePath();

	//60 grados
	context.moveTo(0, 0);
	context.arc(0, 0, 20, 55*(Math.PI/180), 65*(Math.PI/180));
	context.closePath();

	//90 grados
	context.moveTo(0, 0);
	context.arc(0, 0, 20, 85*(Math.PI/180), 95*(Math.PI/180));
	context.closePath();

	//120 grados
	context.moveTo(0, 0);
	context.arc(0, 0, 20, 115*(Math.PI/180), 125*(Math.PI/180));
	context.closePath();

	//150 grados
	context.moveTo(0, 0);
	context.arc(0, 0, 20, 145*(Math.PI/180), 155*(Math.PI/180));
	context.closePath();

	context.strokeStyle = "#FFFFFF";
	context.stroke();

	context.beginPath();
	context.moveTo(0, 0);
	context.arc(0, 0, 15, 0, Math.PI*2, false);
	context.closePath();

	context.lineStyle = "#FFFFFF"; 
	context.lineWidth = 2;
	context.fillStyle = "#000000";
	context.stroke();
	context.fill();

	context.beginPath();	
	context.arc(40, -40, 40, Math.PI/2, Math.PI, false);
	context.arc(-40, -40, 40, 0, Math.PI/2, false);
	context.closePath();

	context.lineWidth = 1;
	context.strokeStyle = "#FFFFFF";
	context.stroke();
}

Ship.prototype.update = function(delta) { 	
	this.exhaust30.neutral();
	this.exhaust60.neutral();
	this.exhaust90.neutral();
	this.exhaust120.neutral(); 
	this.exhaust150.neutral();

	if(ArrowKeyHandler.isDown(ArrowKeyHandler.LEFT))  { 
		this.x -= this.speedX * delta; 
		
		this.exhaust30.speedUp();
		this.exhaust60.speedUp();	
	}
	if(ArrowKeyHandler.isDown(ArrowKeyHandler.RIGHT)) { 
		this.x += this.speedX * delta; 
		
		this.exhaust120.speedUp();
		this.exhaust150.speedUp();
	}
	if(ArrowKeyHandler.isDown(ArrowKeyHandler.UP))    { 
		this.y -= this.speedY * delta; 
		
		this.exhaust90.speedUp(); 
	}
	if(ArrowKeyHandler.isDown(ArrowKeyHandler.DOWN))  { 
		this.y += this.speedY * delta; 
		
		this.exhaust30.slowDown();
		this.exhaust60.slowDown();
		this.exhaust90.slowDown();
		this.exhaust120.slowDown(); 
		this.exhaust150.slowDown();
	}

	this.exhaust30.update();
	this.exhaust60.update();
	this.exhaust90.update();
	this.exhaust120.update(); 
	this.exhaust150.update();

	this.weapon.update();
}

Ship.prototype.getColliderType = function(){
	return GameObject.CIRCLE_COLLIDER;
}

Ship.prototype.getCollider = function(){
	this.collider.pos.x = this.x;
	this.collider.pos.y = this.y;

	return this.collider;
}

Ship.prototype.getCollisionId = function(){
	return "Ship";
}

Ship.prototype.onCollide = function(other){
	if(other.getCollisionId() == "WeaponPowerUp"){
		if(this.weapon.getId() == other.state){
			PowerUpText.UpArguments[0] = this.x;
			PowerUpText.UpArguments[1] = this.y;
			this.container.add("PowerUpText", PowerUpText.UpArguments);

			this.weapon.powerUp();	
		}else{
			var l = this.weapon.getLevel();
			this.weapon.destroy();

			if(other.state == WeaponPowerUp.SHOT){			
				PowerUpText.ShotArguments[0] = this.x;
				PowerUpText.ShotArguments[1] = this.y;
				this.container.add("PowerUpText", PowerUpText.ShotArguments);

				this.weapon = new ShotWeapon(l, this);
			}
			else if(other.state == WeaponPowerUp.ROCKET){
				PowerUpText.RocketsArguments[0] = this.x;
				PowerUpText.RocketsArguments[1] = this.y;
				this.container.add("PowerUpText", PowerUpText.RocketsArguments);

				this.weapon = new RocketWeapon(l, this);
			}

			this.weapon.init(this.container);
		} 
	}
	else{
		PowerUpText.DownArguments[0] = this.x;
		PowerUpText.DownArguments[1] = this.y;
		this.container.add("PowerUpText", PowerUpText.DownArguments);
		
		this.weapon.powerDown();
	}
}
