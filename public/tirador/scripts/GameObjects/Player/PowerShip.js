PowerShip.inheritsFrom( Ship );

function PowerShip() {
	Ship.call(this);

	this.exhaustOffsetX = 25;
	this.exhaustOffsetY = 15;
	this.curveSize      = 40;
	this.curveOffset    = 10;
	this.pieceSize      = 15;
	this.exhaustSize    = 20;
}

PowerShip.prototype.getExhausts = function() {
	var exhaustPoints = [];
	exhaustPoints.push({ x:0, y:0 });
	exhaustPoints.push({ x:0, y:0 });
	exhaustPoints.push({ x:0, y:0 });
	exhaustPoints.push({ x:0, y:0 });

	function getExhaustPoints0Right(side, type)   { return this.getExhaustPoints(exhaustPoints, this.x + this.exhaustOffsetX, this.y + this.exhaustOffsetY, this.rotation,  0,  20, side, type); };
	function getExhaustPoints45Right(side, type)  { return this.getExhaustPoints(exhaustPoints, this.x + this.exhaustOffsetX, this.y + this.exhaustOffsetY, this.rotation, 45,  20, side, type); };
	function getExhaustPoints90Right(side, type)  { return this.getExhaustPoints(exhaustPoints, this.x + this.exhaustOffsetX, this.y + this.exhaustOffsetY, this.rotation, 90,  20, side, type); };
	
	function getExhaustPoints90Left(side, type)   { return this.getExhaustPoints(exhaustPoints, this.x - this.exhaustOffsetX, this.y + this.exhaustOffsetY, this.rotation,  90,  20, side, type); };
	function getExhaustPoints135Leftt(side, type) { return this.getExhaustPoints(exhaustPoints, this.x - this.exhaustOffsetX, this.y + this.exhaustOffsetY, this.rotation, 135,  20, side, type); };
	function getExhaustPoints180Left(side, type)  { return this.getExhaustPoints(exhaustPoints, this.x - this.exhaustOffsetX, this.y + this.exhaustOffsetY, this.rotation, 180,  20, side, type); };

	return [
		new Exhaust(getExhaustPoints0Right  , this), 
		new Exhaust(getExhaustPoints45Right , this), 
		new Exhaust(getExhaustPoints90Right , this), 
		new Exhaust(getExhaustPoints90Left  , this), 
		new Exhaust(getExhaustPoints135Leftt, this),
		new Exhaust(getExhaustPoints180Left , this)
	];
}

PowerShip.prototype.exhaustIdleState = function(){
	this.setAllExhaustState(Exhaust.FAST);
}

PowerShip.prototype.setExhaustLeftState = function(state, args) {
	this.exhausts[0][state](args);
	if(ArrowKeyHandler.isDown(ArrowKeyHandler.UP)){
		this.exhausts[1][state](args);
	}
}

PowerShip.prototype.setExhaustRightState = function(state, args) {
	this.exhausts[5][state](args);
	if(ArrowKeyHandler.isDown(ArrowKeyHandler.UP)){
		this.exhausts[4][state](args);		
	}
}

PowerShip.prototype.setExhaustForwardState = function(state, args) {
	if(!ArrowKeyHandler.isDown(ArrowKeyHandler.LEFT)){
		this.exhausts[3][state](args);
	}
	if(!ArrowKeyHandler.isDown(ArrowKeyHandler.RIGHT)){
		this.exhausts[2][state](args);
	}
}

PowerShip.prototype.gotoInitialState = function() {
	if(ScreenUtils.isPastBottom(this.y, 0)){
		this.currentMotion.set(this.START_MOTION);
	}else{
		this.setAllExhaustState(Exhaust.REGULAR);
		this.currentMotion.set(this.IDLE_MOTION);
	}
}

PowerShip.prototype.init = function(x, y, container){
	Ship.prototype.init.call(this, x, y, container);
	
	this.collider.r = 40; 
}

PowerShip.prototype.draw = function(context) { 
	context.strokeStyle = this.color;
	context.lineWidth 	= 1;
	context.fillStyle   = "#000000";

	//0 grados	
	context.beginPath();

	context.moveTo(this.exhaustOffsetX, this.exhaustOffsetY);
	context.arc(this.exhaustOffsetX, this.exhaustOffsetY, this.exhaustSize, -5*(Math.PI/180), 5*(Math.PI/180));
	context.closePath();

	//45 grados
	context.moveTo(this.exhaustOffsetX, this.exhaustOffsetY);
	context.arc(this.exhaustOffsetX, this.exhaustOffsetY, this.exhaustSize, 40*(Math.PI/180), 50*(Math.PI/180));
	context.closePath();

	//90 grados
	context.moveTo(this.exhaustOffsetX, this.exhaustOffsetY);
	context.arc(this.exhaustOffsetX, this.exhaustOffsetY, this.exhaustSize, 85*(Math.PI/180), 95*(Math.PI/180));
	context.closePath();

	//90 grados
	context.moveTo(-this.exhaustOffsetX, this.exhaustOffsetY);
	context.arc(-this.exhaustOffsetX, this.exhaustOffsetY, this.exhaustSize, 85*(Math.PI/180), 95*(Math.PI/180));
	context.closePath();

	//135 grados
	context.moveTo(-this.exhaustOffsetX, this.exhaustOffsetY);
	context.arc(-this.exhaustOffsetX, this.exhaustOffsetY, this.exhaustSize, 130*(Math.PI/180), 140*(Math.PI/180));
	context.closePath();
	
	//180 grados
	context.moveTo(-this.exhaustOffsetX, this.exhaustOffsetY);
	context.arc(-this.exhaustOffsetX, this.exhaustOffsetY, this.exhaustSize, 175*(Math.PI/180), 185*(Math.PI/180));
	context.closePath();

	context.stroke();

	context.beginPath();
	context.arc(this.exhaustOffsetX, this.exhaustOffsetY, this.pieceSize, 0, Math.PI*2, false);
	context.closePath();
	context.stroke();
	context.fill();

	context.beginPath();
	context.arc(-this.exhaustOffsetX, this.exhaustOffsetY, this.pieceSize, 0, Math.PI*2, false);
	context.closePath();
	context.stroke();
	context.fill();

	context.beginPath();
	context.arc(0, 0, this.pieceSize, 0, Math.PI*2, false);
	context.closePath();
	context.stroke();
	context.fill();

	context.beginPath();	
	
	context.arc(-this.curveSize-this.curveOffset, -this.curveSize, 
				this.curveSize, 
				Math.PI/2, 0, true);
	
	context.arc(-this.curveSize-this.curveOffset, this.curveSize, 
				this.curveSize, 
				0, -Math.PI/2, true);
	
	context.closePath();
	context.stroke();

	context.beginPath();	
	
	context.arc(this.curveSize+this.curveOffset, -this.curveSize, 
				this.curveSize, 
				Math.PI/2, Math.PI);
	
	context.arc(this.curveSize+this.curveOffset, this.curveSize, 
				this.curveSize, 
				Math.PI, -Math.PI/2);
	
	context.closePath();
	context.stroke();
}