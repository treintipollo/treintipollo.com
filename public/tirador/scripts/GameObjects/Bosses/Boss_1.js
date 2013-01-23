function Boss_1() {}
Boss_1.inheritsFrom( GameObject );

Boss_1.prototype.init = function(x, y) {
	this.x = x;
	this.y = y;

	this.tentacle1 = TopLevel.container.add("Tentacle", [{x:0, y:0}, 20, 20, 20, 0, true], 0, false, ObjectsContainer.UNSHIFT);
	this.tentacle2 = TopLevel.container.add("Tentacle", [{x:0, y:0}, 20, 20, 20, 45, false], 0, false, ObjectsContainer.UNSHIFT);
	this.tentacle3 = TopLevel.container.add("Tentacle", [{x:0, y:0}, 20, 20, 20, 90, true], 0, false, ObjectsContainer.UNSHIFT);
	this.tentacle4 = TopLevel.container.add("Tentacle", [{x:0, y:0}, 20, 20, 20, 90+45, false], 0, false, ObjectsContainer.UNSHIFT);
	this.tentacle5 = TopLevel.container.add("Tentacle", [{x:0, y:0}, 20, 20, 20, 180, true], 0, false, ObjectsContainer.UNSHIFT);
	this.tentacle6 = TopLevel.container.add("Tentacle", [{x:0, y:0}, 20, 20, 20, 180+45, false], 0, false, ObjectsContainer.UNSHIFT);
	this.tentacle7 = TopLevel.container.add("Tentacle", [{x:0, y:0}, 20, 20, 20, 270, true], 0, false, ObjectsContainer.UNSHIFT);
	this.tentacle8 = TopLevel.container.add("Tentacle", [{x:0, y:0}, 20, 20, 20, 270+45, false], 0, false, ObjectsContainer.UNSHIFT);

	function setTentacleVariables(tentacle, x, y, distance, angle, length, range, frequency) {
		tentacle.x = x + Math.cos(angle * (Math.PI/180)) * distance;
		tentacle.y = y + Math.sin(angle * (Math.PI/180)) * distance;

		tentacle.setLengh(length);
		tentacle.setRange(range);
		tentacle.setFrequency(frequency);
	}

	setTentacleVariables(this.tentacle1, x, y, -40, 0     , 10, 20, 0.2);
	setTentacleVariables(this.tentacle2, x, y, -40, 45    , 8 , 10, 0.3);
	setTentacleVariables(this.tentacle3, x, y, -40, 90    , 10, 20, 0.2);
	setTentacleVariables(this.tentacle4, x, y, -40, 90+45 , 8 , 10, 0.3);
	setTentacleVariables(this.tentacle5, x, y, -40, 180   , 10, 20, 0.2);
	setTentacleVariables(this.tentacle6, x, y, -40, 180+45, 8 , 10, 0.3);
	setTentacleVariables(this.tentacle7, x, y, -40, 270   , 10, 20, 0.2);
	setTentacleVariables(this.tentacle8, x, y, -40, 270+45, 8 , 10, 0.3);
}

Boss_1.prototype.draw = function(context) {
	context.fillStyle = "#FFFFFF";

	context.beginPath();
	context.arc(0, 0, 50, 0, Math.PI*2, false);
	context.closePath();

	context.fill();
}
Boss_1.prototype.update = function(delta) {}

function Arm() {}
Arm.inheritsFrom( GameObject );

Arm.prototype.init = function(user, initSegmentWidth, initSegmentHeight, segments, rotation) {
	this.x = user.x;
	this.y = user.y;

	this.initWidth    = initSegmentWidth;
	this.initHeight   = initSegmentHeight;
	this.segmentCount = segments;
	this.user         = user;

	this.segments = [];
	this.rotation = rotation;

	var firstSegment = TopLevel.container.add("ArmSegment", [this, this.user, 0, this.initWidth, this.initHeight, true], 0, false, ObjectsContainer.UNSHIFT);

	this.segments.push(firstSegment);
	
	for(var i=1; i<this.segmentCount; i++){
		this.segments.push(TopLevel.container.add("ArmSegment", [this.segments[i-1], this.user, i, null, null, false], 0, false, ObjectsContainer.UNSHIFT));		
	}

	this.twistAmount = 0;	
}

Arm.prototype.update = function(delta) {}

Arm.prototype.addRootLenght = function(amount) { this.segments[0].lengthOffset += amount; }
Arm.prototype.setRootLenght = function(amount) { this.segments[0].lengthOffset = amount; }

Arm.prototype.addLocalLenght = function(startingSegment, amount) { this.segments[startingSegment].localLengthOffset += amount; }
Arm.prototype.setLocalLenght = function(startingSegment, amount) { this.segments[startingSegment].localLengthOffset += amount; }

Arm.prototype.addRootTwistToAnchor2 = function(amount) { this.segments[0].pointTwoOffset   += amount; }
Arm.prototype.addRootTwistToAnchor3 = function(amount) { this.segments[0].pointThreeOffset += amount; }
Arm.prototype.setRootTwistToAnchor2 = function(amount) { this.segments[0].pointTwoOffset    = amount; }
Arm.prototype.setRootTwistToAnchor3 = function(amount) { this.segments[0].pointThreeOffset  = amount; }

Arm.prototype.addLocalTwistToAnchor2 = function(startingSegment, amount) { this.segments[startingSegment].localPointTwoOffset   += amount; }
Arm.prototype.addLocalTwistToAnchor3 = function(startingSegment, amount) { this.segments[startingSegment].localPointThreeOffset += amount; }
Arm.prototype.setLocalTwistToAnchor2 = function(startingSegment, amount) { this.segments[startingSegment].localPointTwoOffset   = amount;  }
Arm.prototype.setLocalTwistToAnchor3 = function(startingSegment, amount) { this.segments[startingSegment].localPointThreeOffset = amount;  }

function ArmSegment() {}

ArmSegment.inheritsFrom( GameObject );

ArmSegment.prototype.init = function(parent, user, index, width, height, isFirst) {
	this.parentSegment = parent;
	this.user          = user;
	this.index         = index;

	this.pointTwoOffset   = 0;
	this.pointThreeOffset = 0;
	this.localPointTwoOffset   = 0;
	this.localPointThreeOffset = 0;

	this.point1 = {x:0, y:0};
	this.point2 = {x:0, y:0};
	this.point3 = {x:0, y:0};
	this.point4 = {x:0, y:0};

	this.rotated1 = {x:0, y:0};
	this.rotated2 = {x:0, y:0};
	this.rotated3 = {x:0, y:0};
	this.rotated4 = {x:0, y:0};

	this.isFirst = isFirst;

	if(this.isFirst){
		this.width   = width;
		this.height  = height;
		this.centerX = this.width/2;
		this.centerY = this.height/2;
	}else{
		this.width = this.parentSegment.width * 0.8;
	}
}

ArmSegment.prototype.draw = function(context) {
	context.strokeStyle = "#FFFFFF";

	context.beginPath();
	
	context.moveTo(this.point1.x, this.point1.y);
	context.lineTo(this.point2.x, this.point2.y);
	context.lineTo(this.point3.x, this.point3.y);	
	context.lineTo(this.point4.x, this.point4.y);

	context.closePath();

	context.stroke();
}	

ArmSegment.prototype.update = function(delta) {

	if(this.isFirst){
		this.point1.x = 0; 
		this.point1.y = 0;

		this.point2.x = this.width + this.pointTwoOffset; 
		this.point2.y = 0;
		
		this.point3.x = this.width + this.pointThreeOffset; 
		this.point3.y = this.height;
		
		this.point4.x = 0; 
		this.point4.y = this.height;	

		this.rotation = this.parentSegment.rotation;

		var sin = Math.sin((this.rotation)*(Math.PI/180));
		var cos = Math.cos((this.rotation)*(Math.PI/180));

		this.getRotatedPoint(this.point1, this.rotated1, this.centerX, this.centerY, sin, cos);
		this.getRotatedPoint(this.point2, this.rotated2, this.centerX, this.centerY, sin, cos);
		this.getRotatedPoint(this.point3, this.rotated3, this.centerX, this.centerY, sin, cos);
		this.getRotatedPoint(this.point4, this.rotated4, this.centerX, this.centerY, sin, cos);

	}else{
		this.pointTwoOffset   = this.parentSegment.pointTwoOffset   + this.localPointTwoOffset   * 0.8;
		this.pointThreeOffset = this.parentSegment.pointThreeOffset + this.localPointThreeOffset * 0.8;

		if(this.index == 1){
			this.calcPoints(this.point1, this.point2, this.point3, this.point4, this.parentSegment.rotated1, this.parentSegment.rotated2, this.parentSegment.rotated3, this.parentSegment.rotated4);
		}else{
			this.calcPoints(this.point1, this.point2, this.point3, this.point4, this.parentSegment.point1, this.parentSegment.point2, this.parentSegment.point3, this.parentSegment.point4);
		}
	}

	this.x = this.parentSegment.x;
	this.y = this.parentSegment.y;
}

ArmSegment.prototype.calcPoints = function(point1, point2, point3, point4, parentPoint1, parentPoint2, parentPoint3, parentPoint4) {
	var info = VectorUtils.getFullVectorInfo(parentPoint2.x, parentPoint2.y, parentPoint3.x, parentPoint3.y);

	point1.x = NumberUtils.interpolate(0.1, parentPoint2.x, parentPoint3.x);
	point1.y = NumberUtils.interpolate(0.1, parentPoint2.y, parentPoint3.y);

	point4.x = NumberUtils.interpolate(0.9, parentPoint2.x, parentPoint3.x);
	point4.y = NumberUtils.interpolate(0.9, parentPoint2.y, parentPoint3.y);

	point2.x = point1.x + (info.perp.x * (-this.width - (this.pointTwoOffset) ) );
	point2.y = point1.y + (info.perp.y * (-this.width - (this.pointTwoOffset) ) );

	point3.x = point4.x + (info.perp.x * (-this.width - (this.pointThreeOffset) ) );
	point3.y = point4.y + (info.perp.y * (-this.width - (this.pointThreeOffset) ) );
}

ArmSegment.prototype.getRotatedPoint = function(point, result, centerX, centerY, angleSin, angleCos) {
	result.x = (angleCos * (point.x-centerX) - angleSin * (point.y-centerY)) + centerX;
	result.y = (angleSin * (point.x-centerX) + angleCos * (point.y-centerY)) + centerY;
}

function Tentacle() {       
    this.girth = 15;
    this.muscleRange = 50;
    this.muscleFreq = 0.2 * 100/250; 
    this.theta = 0;

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

TentacleSegment.prototype.draw = function(context) {
	/*if(this.index == 0){
		return;
	}

	context.strokeStyle = "#FFFFFF";

	context.beginPath();
	
	context.moveTo(this.rotated1.x, this.rotated1.y);
	context.lineTo(this.rotated2.x, this.rotated2.y);
	context.lineTo(this.rotated3.x, this.rotated3.y);	
	context.lineTo(this.rotated4.x, this.rotated4.y);

	context.closePath();

	context.stroke();*/
}

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

