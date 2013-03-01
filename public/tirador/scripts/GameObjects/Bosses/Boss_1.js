function Boss_1() {}
Boss_1.inheritsFrom( GameObject );

Boss_1.ROUND_EYE  = 0;
Boss_1.SNAKE_EYE  = 1;
Boss_1.INSECT_EYE = 2;

Boss_1.Main_Body_Properties    = [50, 40, 8, 20, 20, 20, -40, 10, 20, 0.2];
Boss_1.Helper_Body_Properties    = [25, 20, 4, 10, 10, 20, -20, 3, 10, 0.4, 45, true];

Boss_1.Main_Ability_Properties = [Boss_1.ROUND_EYE, Boss_1.SNAKE_EYE, Boss_1.INSECT_EYE];
Boss_1.Helper_Ability_Properties = [Boss_1.ROUND_EYE];

//chargeRadius, burstColor1, burstColor2, burst1ParticlesInCycle, burst2ParticlesInCycle, beam1ParticlesInCycle, beam2ParticlesInCycle, beam1ParticlesLife, beam2ParticlesLife
Boss_1.Main_Beam_Properties    = [120, "#FF0000", "#FFFF00", 1, 2, 8, 8, 30, 15];
Boss_1.Helper_Beam_Properties  = [40, "#11D3ED", "#E045F5", 1, 2, 6, 6, 20, 10];

//TODO: Distintos tipos de cambio de ojo, dependiendo del daño. 
//TODO: Tercer Ojo. // Mini Bosses.
//TODO: Muerte y regeneracion de tentaculos.
//TODO: Regeneracion de daño principal. 
//TODO: agregarle al boss un punto hacia donde tiene que dirijirse despues de aparecer.
//TODO: Indicarle cuales ojos puede usar
//TODO: Destruir todas las cosas que hagan falta en el destroy.

Boss_1.prototype.init = function(x, y, target, bodyProperties, abilityProperties, beamProperties) {
	this.x = x;
	this.y = y;

	this.abilities = abilityProperties;
	this.tentacles = [];

	this.counter      = 0;
	this.shakeCounter = 0;
	this.blinkCount   = 0;
	this.eyeType      = this.abilities[0];

	this.size          = bodyProperties[0];
	this.eyeHeight     = bodyProperties[1];
	this.eyeheightMax  = bodyProperties[1];
	this.tentacleCount = bodyProperties[2];
	
	var tWidth       = bodyProperties[3];
	var tHeight      = bodyProperties[4];
	var tSegments    = bodyProperties[5];
	var tDistance    = bodyProperties[6];
	var tLenght      = bodyProperties[7];
	var tRange       = bodyProperties[8];
	var tFrequency   = bodyProperties[9];
	var tAngleOffste = bodyProperties[10] != null ? bodyProperties[10] : 0;
	var equalT       = bodyProperties[11] != null ? bodyProperties[11] : false;

	var tAngleStep = 360 / this.tentacleCount;

	for(var i=0; i<this.tentacleCount; i++){
		var t;

		if(i % 2 == 0){
			t = TopLevel.container.add("Tentacle", [{x:0, y:0}, tWidth, tHeight, tSegments, tAngleStep*i + tAngleOffste, true], 0, false, ObjectsContainer.UNSHIFT);

			setTentacleVariables(t, x, y, tDistance, tAngleStep*i + tAngleOffste, tLenght, tRange, tFrequency);
		}else{
			t = TopLevel.container.add("Tentacle", [{x:0, y:0}, tWidth, tHeight, tSegments, tAngleStep*i + tAngleOffste, false], 0, false, ObjectsContainer.UNSHIFT);

			setTentacleVariables(t, x, y, tDistance, tAngleStep*i + tAngleOffste, tLenght-2, tRange/2, tFrequency+0.1);
		}

		if(equalT){
			setTentacleVariables(t, x, y, tDistance, tAngleStep*i + tAngleOffste, tLenght, tRange, tFrequency);
		}

		this.tentacles.push(t);		
	}

	function setTentacleVariables(tentacle, x, y, distance, angle, length, range, frequency) {
		tentacle.x = x + Math.cos(angle * (Math.PI/180)) * distance;
		tentacle.y = y + Math.sin(angle * (Math.PI/180)) * distance;

		tentacle.setInitLenght(length); 
		tentacle.setInitRange(range);
		tentacle.setInitFrequency(frequency); 

		tentacle.setLengh(length);
		tentacle.setRange(range);
		tentacle.setFrequency(frequency);
	}
	
	var inst = this;

	this.blinkTimer = TimeOutFactory.getTimeOut(5000, -1, this, function(){ 
		TweenMax.fromTo(this, 0.2, {eyeHeight:this.eyeheightMax, yoyo:true, repeat:1}, 
			{eyeHeight:0, yoyo:true, repeat:1, 
			onRepeat:function(){
				inst.eyeType = inst.abilities[Random.getRandomInt(0, inst.abilities.length-1)];
				inst.weapon = weapons[inst.eyeType];
			}, 
			onComplete:function(){
				if(inst.blinkCount % 2 == 0){
					inst.weapon.fire();
				}else{
					inst.weapon.charge();
				}
			}, 
			onStart:function(){
				inst.blinkCount++;
				inst.weapon.disable();
			}
		});		
	});

	this.blinkTimer.start();

	var shrinkTentacles = FuntionUtils.bindScope(this, function(){
		for(var i=0; i<this.tentacleCount; i++){
			var t = this.tentacles[i];	

			t.lenghTo(t.getInitLenght()/2, 0.3);
			t.frequencyTo(t.getInitFrequency()*3, 0.1);			
		}
	});

	var growTentacles = FuntionUtils.bindScope(this, function(){
		for(var i=0; i<this.tentacleCount; i++){
			var t = this.tentacles[i];	

			t.lenghTo(t.getInitLenght(), 3);
			t.frequencyTo(t.getInitFrequency(), 1.0);			
		}
	});

	var weapons = [];
	weapons[0]  = new Boss_1_Weapon_Beam(this, target, shrinkTentacles, growTentacles, beamProperties);
	weapons[1]  = new Boss_1_Weapon_Twin_Beam(this, target, shrinkTentacles, growTentacles, beamProperties);
	weapons[2]  = new Boss_1_Backup(this, target, 3, 220, beamProperties);
	
	this.weapon = weapons[0];
}

Boss_1.prototype.draw = function(context) {
	context.fillStyle = "#000000";
	context.strokeStyle = "#FFFFFF";
	context.lineWidth = 2;

	context.beginPath();
	context.arc(0, 0, this.size, 0, Math.PI*2, false);	
	context.closePath();
	context.fill();
	context.stroke();

	context.beginPath();
	context.moveTo(-this.size, 0);	
	context.quadraticCurveTo(0, -this.eyeHeight, this.size, 0);
	context.moveTo(-this.size, 0);
	context.quadraticCurveTo(0, this.eyeHeight, this.size, 0);
	context.stroke();
	context.fill();

	context.clip();

	if(this.eyeType == Boss_1.ROUND_EYE){
		this.drawRoundEye(context);
	}

	if(this.eyeType == Boss_1.SNAKE_EYE){
		this.drawSnakeEye(context);	
	}

	if(this.eyeType == Boss_1.INSECT_EYE){
		this.drawBugEyeCluster(21, 0, 7, "#FFFFFF", context, true, true, true, true, false, false);
		this.drawBugEyeCluster(-21, 0, 7, "#FFFFFF", context, true, false, false, true, true, true);
		this.drawBugEyeCluster(0, 0, 7, "#FFFFFF", context, true, true, true, true, true, true);
	}		
}

Boss_1.prototype.drawRoundEye = function(context) {
	context.fillStyle = "#000000";
	context.beginPath();
	context.arc(0, 0, this.eyeheightMax/2, 0, Math.PI*2, false);
	context.moveTo(this.eyeheightMax/8, 0);
	context.arc(0, 0, this.eyeheightMax/8, 0, Math.PI*2, false);	
	context.closePath();
	context.stroke();
}

Boss_1.prototype.drawSnakeEye = function(context) {
	context.fillStyle = "#000000";
	context.beginPath();
	context.moveTo(0, -this.eyeheightMax/2);	
	context.quadraticCurveTo(-this.eyeheightMax/4,0,0,this.eyeheightMax/2);
	context.moveTo(0, -this.eyeheightMax/2);
	context.quadraticCurveTo(this.eyeheightMax/4,0,0,this.eyeheightMax/2);
	context.stroke();
}

Boss_1.prototype.drawBugEyeCluster = function(x, y, radius, color, context, top, topRight, bottomRight, bottom, bottomLeft, topLeft) {
	context.lineWidth = 1;

	this.drawBugEyePiece(x, y, radius, color, context);
	
	var xOffset = (radius * 2) - 4;
	var yOffset = (radius * 2) - 2;

	//top
	if(top) this.drawBugEyePiece(x, -yOffset, radius, color, context);
	//topRight
	if(topRight) this.drawBugEyePiece(x + xOffset, y + -yOffset/2, radius, color, context);
	//bottomRight
	if(bottomRight) this.drawBugEyePiece(x + xOffset, y + yOffset/2, radius, color, context);
	//bottom
	if(bottom) this.drawBugEyePiece(x, y + yOffset, radius, color, context);
	//bottomLeft
	if(bottomLeft) this.drawBugEyePiece(x + -xOffset, y + yOffset/2, radius, color, context);
	//topLeft
	if(topLeft) this.drawBugEyePiece(x + -xOffset, y + -yOffset/2, radius, color, context);
}

Boss_1.prototype.drawBugEyePiece = function(x, y, radius, color, context) {
	var angleStep = 360/6 * (Math.PI/180);
	var angle = 0;

	context.fillStyle = "#000000";
	context.strokeStyle = color;

	context.beginPath();
		
	context.moveTo(x + Math.cos(angle)*radius, y + Math.sin(angle)*radius);

	for(var i=0; i<6; i++){
		angle += angleStep;
		context.lineTo(x + Math.cos(angle)*radius, y + Math.sin(angle)*radius);
	}

	context.closePath();
	context.stroke();
}

Boss_1.prototype.update = function(delta) {
	var xVar; 
	var yVar; 

	if(this.weapon.isFiring()){		
		if(this.shakeCounter % 2 == 0){
			xVar = Random.getRandomArbitary(-5.0, 5.0);
			yVar = Random.getRandomArbitary(-5.0, 5.0);		
		}else{
			xVar = -this.lastVarX;
			yVar = -this.lastVarY;
		}
		this.shakeCounter++;
	}else if(this.weapon.isAiming()){
		xVar = 0;
		yVar = 0;
		this.shakeCounter = 0;
	}else{
		this.counter++;
		xVar = Math.cos((this.counter*2) / (this.eyeheightMax*2));
		yVar = Math.cos((this.counter*2) / this.eyeheightMax);
	}

	this.lastVarX = xVar;
	this.lastVarY = yVar;

	this.x += xVar;
	this.y += yVar;

	for(var i=0; i<this.tentacleCount; i++){
		var t = this.tentacles[i];

		t.x += xVar; 
		t.y += yVar; 
	}

	this.weapon.update();
}

function Boss_1_Weapon() {}

Boss_1_Weapon.prototype.update = function() {}
Boss_1_Weapon.prototype.fire = function() {}
Boss_1_Weapon.prototype.charge = function() {}
Boss_1_Weapon.prototype.disable = function() {}
Boss_1_Weapon.prototype.isFiring = function() {}
Boss_1_Weapon.prototype.isAiming = function() {}
Boss_1_Weapon.prototype.onStart = function() {}
Boss_1_Weapon.prototype.onComplete = function() {}

function Boss_1_Weapon_Beam(user, target, onStart, onComplete, beamProperties) {
	this.beam = new StraightBeam(beamProperties);
	this.beam.init(TopLevel.container, user, target, 15, 27, 1500);

	this.beam.onStart    = onStart;
	this.beam.onComplete = onComplete;
}

Boss_1_Weapon_Beam.inheritsFrom( Boss_1_Weapon );

Boss_1_Weapon_Beam.prototype.update = function() { this.beam.update(); }
Boss_1_Weapon_Beam.prototype.fire = function() { this.beam.fire(); }
Boss_1_Weapon_Beam.prototype.charge = function() { this.beam.charge(); }
Boss_1_Weapon_Beam.prototype.disable = function() { this.beam.disable(); }
Boss_1_Weapon_Beam.prototype.isFiring = function() { return this.beam.isFiring; }
Boss_1_Weapon_Beam.prototype.isAiming = function() { return this.beam.isAiming; }

function Boss_1_Weapon_Twin_Beam(user, target, onStart, onComplete, beamProperties) {
	this.beam1 = new StraightBeam(beamProperties);
	this.beam1.init(TopLevel.container, user, target, 15, 27, 2500, 15);

	this.beam2 = new StraightBeam(beamProperties);
	this.beam2.init(TopLevel.container, user, target, 15, 27, 2500, -15);

	this.beam1.onStart    = onStart;
	this.beam1.onComplete = onComplete;
}

Boss_1_Weapon_Twin_Beam.inheritsFrom( Boss_1_Weapon );

Boss_1_Weapon_Twin_Beam.prototype.update = function() { this.beam1.update(); this.beam2.update(); }
Boss_1_Weapon_Twin_Beam.prototype.fire = function() { this.beam1.fire(); this.beam2.fire(); }
Boss_1_Weapon_Twin_Beam.prototype.charge = function() { this.beam1.charge(); }
Boss_1_Weapon_Twin_Beam.prototype.disable = function() { this.beam1.disable(); }
Boss_1_Weapon_Twin_Beam.prototype.isFiring = function() { return this.beam1.isFiring; }
Boss_1_Weapon_Twin_Beam.prototype.isAiming = function() { return this.beam1.isAiming; }

function Boss_1_Backup(user, target, amount, helperDistance, beamProperties) {
	this.target  		= target;
	this.user    		= user;
	this.helperDistance = helperDistance;
	this.amount  		= amount;
	
	this.helpers = [];
	this.nextHelper = 0;

	this.positions = [
		{angle:270 * (Math.PI/180), active:false},
		{angle:235 * (Math.PI/180), active:false},
		{angle:305 * (Math.PI/180), active:false}
	];

	this.beam = new StraightBeam(beamProperties);
	this.beam.init(TopLevel.container, user, target, 15, 22, 1500);
}

Boss_1_Backup.inheritsFrom( Boss_1_Weapon );

Boss_1_Backup.prototype.update = function() { this.beam.update(); }
Boss_1_Backup.prototype.fire = function() {  
	for(var i=this.nextHelper; i<this.positions.length; i++){
		if(!this.positions[i].active){
			this.positions[i].active = true;
			this.nextHelper = i;
			break;
		}
	}

	var x = this.user.x + Math.cos(this.positions[this.nextHelper].angle) * this.helperDistance;
	var y = this.user.y + Math.sin(this.positions[this.nextHelper].angle) * this.helperDistance;

	if(this.helpers.length < this.amount){
		var h = TopLevel.container.add("Boss_1", [x, y, this.target, Boss_1.Helper_Body_Properties, Boss_1.Helper_Ability_Properties, Boss_1.Helper_Beam_Properties], 0);

		this.helpers.push( {pos:this.positions[this.nextHelper], helper:h} );	

		h.addOnDestroyCallback(this, function(go){
			
			for(var j=0; j<this.helpers.length; j++){
				if(this.helpers[j].helper === go){
					this.helpers.splice(this.helpers.indexOf(this.helpers[j]), 1);
				}
			}
		});
	}

	if(this.nextHelper >= this.amount){
		this.nextHelper = 0;
	}
}
Boss_1_Backup.prototype.charge = function() { this.beam.charge(); }
Boss_1_Backup.prototype.disable = function() { this.beam.disable(); }
Boss_1_Backup.prototype.isFiring = function() { return false; }
Boss_1_Backup.prototype.isAiming = function() { return false; }

function Tentacle() {       
    this.girth = 15;
    this.muscleRange = 50;
    this.muscleFreq = 0.2 * 100/250; 
    this.theta = 0;

    this.initLenght = this.girth;
    this.initRange = this.muscleRange;
    this.initFrequency = this.muscleFreq;

    this.thethaMuscle = 0;
    this.count 	= 0;
    this.segments = [];

	this.doRotation = false;
	this.lastRotation = 0;

	this.sin;
	this.cos;
}
Tentacle.inheritsFrom( GameObject );

Tentacle.prototype.init = function(anchor, initWidth, initHeight, segmentCount, initAngle, swingSide) {
	this.segmentCount = segmentCount;
	this.anchor 	  = anchor;
	this.initWidth 	  = initWidth;
	this.initHeight   = initHeight;	
	this.rotation     = initAngle;
	this.lastRotation = initAngle;
	this.swingSide    = swingSide;

	this.sin = Math.sin((this.rotation)*(Math.PI/180));
	this.cos = Math.cos((this.rotation)*(Math.PI/180));

	var head   = TopLevel.container.add("TentacleSegment", [this, null, null, 0], 0, false, ObjectsContainer.UNSHIFT);
	var muscle = TopLevel.container.add("TentacleSegment", [this, null, null, 1], 0, true, ObjectsContainer.UNSHIFT);

	this.segments.push(head);
	this.segments.push(muscle);

	for(var i=2; i<this.segmentCount; i++){
		var segment = TopLevel.container.add("TentacleSegment", [this, this.segments[i-2], this.segments[i-1], i], 0, true, ObjectsContainer.UNSHIFT);

		this.segments.push(segment);	
	}
}

Tentacle.prototype.lenghTo = function(value, time) { TweenMax.to(this, time, {girth:value}); }
Tentacle.prototype.RangeTo = function(value, time) { TweenMax.to(this, time, {muscleRange:value}); }
Tentacle.prototype.frequencyTo = function(value, time) { value *= 100/250; TweenMax.to(this, time, {muscleFreq:value}); }

Tentacle.prototype.setInitLenght    = function(value){ this.initLenght = value; }
Tentacle.prototype.setInitRange     = function(value){ this.initRange = value; }
Tentacle.prototype.setInitFrequency = function(value){ this.initFrequency = value; }

Tentacle.prototype.getInitLenght    = function(value){ return this.initLenght; }
Tentacle.prototype.getInitRange     = function(value){ return this.initRange; }
Tentacle.prototype.getInitFrequency = function(value){ return this.initFrequency; } 

Tentacle.prototype.addLengh     = function(value) { this.girth 		 += value; }
Tentacle.prototype.addRange     = function(value) { this.muscleRange += value; }
Tentacle.prototype.addFrequency = function(value) { this.muscleFreq  += value * 100/250; }
Tentacle.prototype.addAngle     = function(value) { this.theta 		 += value; }

Tentacle.prototype.setLengh     = function(value) { this.girth 		 = value; }
Tentacle.prototype.setRange     = function(value) { this.muscleRange = value; }
Tentacle.prototype.setFrequency = function(value) { this.muscleFreq  = value * 100/250; }
Tentacle.prototype.setAngle     = function(value) { this.theta 		 = value; }

Tentacle.prototype.draw = function(context) {
	this.drawTentacleLine(context, "1");
	this.drawTentacleLine(context, "2");
	this.drawTentacleLine(context, "3");
	this.drawTentacleLine(context, "4");	
}

Tentacle.prototype.drawTentacleLine = function(context, rotateIndex, offsetX, offsetY){
	context.strokeStyle = "#FFFFFF";
	context.lineWidth = 2;

	var normalizedStep = 1 / this.segments.length;
	var initStep = 1;

	context.beginPath();
	context.moveTo(this.segments[1]["rotated" + rotateIndex].x + initStep - this.centerX, this.segments[1]["rotated" + rotateIndex].y + initStep - this.centerY);
	for(var i=2; i<this.segments.length; i++){
		initStep -= normalizedStep;
		context.lineTo(this.segments[i]["rotated" + rotateIndex].x + (initStep) - this.centerX, this.segments[i]["rotated" + rotateIndex].y + (initStep) - this.centerY);
	}

	context.stroke();
	context.closePath();
}

Tentacle.prototype.update = function(delta) {
	if(this.swingSide){
		this.count += this.muscleFreq;
	}else{	
		this.count -= this.muscleFreq;
	}

	this.thetaMuscle = this.muscleRange*Math.sin(this.count);

	this.centerX = this.initWidth/2  + this.anchor.x;
	this.centerY = this.initHeight/2 + this.anchor.y;

	if(this.rotation != this.lastRotation){
		this.sin = Math.sin((this.rotation)*(Math.PI/180));
		this.cos = Math.cos((this.rotation)*(Math.PI/180));
	}

	this.lastRotation = this.rotation;
}

function TentacleSegment() {
	this.collider = new SAT.Polygon(new SAT.Vector(0,0), [new SAT.Vector(0,0), new SAT.Vector(0,0), new SAT.Vector(0,0), new SAT.Vector(0,0)]);
}

TentacleSegment.inheritsFrom( GameObject );

TentacleSegment.prototype.init = function(tentacle, secondToPrevious, previous, index) {
	this.tentacle   	  = tentacle;
	this.secondToPrevious = secondToPrevious;
	this.previous 		  = previous;
	this.index 			  = index;

	var n = NumberUtils.normalize(this.index+1, this.tentacle.segmentCount, 0);

	this.segmentWidth   = this.tentacle.initWidth*n;
	this.segmentHeight  = this.tentacle.initHeight*n; 

	this.point1 = {x:0, y:0};
	this.point2 = {x:0, y:0};
	this.point3 = {x:0, y:0};
	this.point4 = {x:0, y:0};

	this.rotated1 = {x:0, y:0};
	this.rotated2 = {x:0, y:0};
	this.rotated3 = {x:0, y:0};
	this.rotated4 = {x:0, y:0};
}

TentacleSegment.prototype.draw = function(context) {}

TentacleSegment.prototype.update = function(delta) {
	if(this.index == 0) {
		this.point1.x = Math.cos((Math.PI / 180) * this.tentacle.theta) + this.tentacle.anchor.x;
		this.point1.y = Math.sin((Math.PI / 180) * this.tentacle.theta) + this.tentacle.anchor.y;
	}
	else if(this.index == 1) { 
		this.point1.x = Math.cos((Math.PI / 180) * (this.tentacle.theta + this.tentacle.thetaMuscle)) + this.tentacle.anchor.x;
		this.point1.y = Math.sin((Math.PI / 180) * (this.tentacle.theta + this.tentacle.thetaMuscle)) + this.tentacle.anchor.y;
	}
	else {
		var dx = this.point1.x - this.secondToPrevious.point1.x;
		var dy = this.point1.y - this.secondToPrevious.point1.y;
		var d  = Math.sqrt (dx * dx + dy * dy);
		
		this.point1.x = this.previous.point1.x + ((dx * this.tentacle.girth) / d);
		this.point1.y = this.previous.point1.y + ((dy * this.tentacle.girth) / d);
	}

	this.x = this.tentacle.x - this.tentacle.centerX;
	this.y = this.tentacle.y - this.tentacle.centerY;

	this.point2.x = this.point1.x + this.segmentWidth;
	this.point2.y = this.point1.y;
	this.point3.x = this.point1.x + this.segmentWidth;
	this.point3.y = this.point1.y + this.segmentHeight;
	this.point4.x = this.point1.x;
	this.point4.y = this.point1.y + this.segmentHeight;

	this.rotatePoints(this.point1, this.rotated1, this.tentacle.centerX, this.tentacle.centerY, this.tentacle.sin, this.tentacle.cos);
	this.rotatePoints(this.point2, this.rotated2, this.tentacle.centerX, this.tentacle.centerY, this.tentacle.sin, this.tentacle.cos);
	this.rotatePoints(this.point3, this.rotated3, this.tentacle.centerX, this.tentacle.centerY, this.tentacle.sin, this.tentacle.cos);
	this.rotatePoints(this.point4, this.rotated4, this.tentacle.centerX, this.tentacle.centerY, this.tentacle.sin, this.tentacle.cos);
}

TentacleSegment.prototype.rotatePoints = function(point, result, centerX, centerY, angleSin, angleCos) {
	result.x = (angleCos * (point.x-centerX) - angleSin * (point.y-centerY)) + centerX;
	result.y = (angleSin * (point.x-centerX) + angleCos * (point.y-centerY)) + centerY;
}

TentacleSegment.prototype.getColliderType = function(){
	return GameObject.POLYGON_COLLIDER;
}

TentacleSegment.prototype.getCollider = function(){
	if(this.segmentWidth == 0 || this.segmentHeight == 0){
		return null;
	}

	this.collider.pos.x = this.rotated1.x + this.x;
	this.collider.pos.y = this.rotated1.y + this.y;

	this.collider.points[0].x = 0;
	this.collider.points[0].y = 0;
	this.collider.points[1].x = (this.rotated2.x + this.x) - this.collider.pos.x;
	this.collider.points[1].y = (this.rotated2.y + this.y) - this.collider.pos.y;
	this.collider.points[2].x = (this.rotated3.x + this.x) - this.collider.pos.x;
	this.collider.points[2].y = (this.rotated3.y + this.y) - this.collider.pos.y;
	this.collider.points[3].x = (this.rotated4.x + this.x) - this.collider.pos.x;
	this.collider.points[3].y = (this.rotated4.y + this.y) - this.collider.pos.y;

	this.collider.recalc();

	return this.collider;
}

TentacleSegment.prototype.getCollisionId = function(){
	return "TentacleSegment";
}

TentacleSegment.prototype.onCollide = function(other){
	
}

