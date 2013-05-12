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

// var bosses      = [{name:"Boss_1_A", createNext:false, intro:"warning", winMessage:"boom", args:bossArgs, targetPos:{x:w/2, y:h/2-100, time:3}, powerUp:null},
// 				   {name:"Boss_1_B", createNext:false, intro:"warning", winMessage:"boom", args:bossArgs, targetPos:{x:w/2, y:h/2-100, time:3}, powerUp:"HPPowerUp"},
// 				   {name:"Boss_1_C", createNext:false, intro:"warning", winMessage:"boom", args:bossArgs, targetPos:{x:w/2, y:h/2-100, time:3}, powerUp:"MultiWeaponPowerUp"},

// 				   {name:"SubBoss_1", createNext:true , intro:"none", winMessage:"nice", args:bossArgs, targetPos:{x:w/2-100, y:h/2-150, time:3}, powerUp:null},
// 				   {name:"SubBoss_1", createNext:false, intro:"none", winMessage:"nice", args:bossArgs, targetPos:{x:w/2+100, y:h/2-150, time:3}, powerUp:null},

// 				   {name:"Boss_1_D", createNext:false, intro:"warning", winMessage:"boom", args:bossArgs, targetPos:{x:w/2, y:h/2-100, time:3}, powerUp:"MultiWeaponPowerUp"},

// 				   {name:"SubBoss_2", createNext:true , intro:"none", winMessage:"nice", args:bossArgs, targetPos:{x:w/2-100, y:h/2-150, time:3}, powerUp:null},
// 				   {name:"SubBoss_2", createNext:false, intro:"none", winMessage:"nice", args:bossArgs, targetPos:{x:w/2+100, y:h/2-150, time:3}, powerUp:null},

// 				   {name:"Boss_1_E", createNext:false, intro:"warning", winMessage:"boom", args:bossArgs, targetPos:{x:w/2, y:h/2-100, time:3}, powerUp:"LivesPowerUp"},

// 				   {name:"SubBoss_1", createNext:true , intro:"none", winMessage:"nice", args:bossArgs, targetPos:{x:w/2-150, y:h/2-150, time:3}, powerUp:null},
// 				   {name:"SubBoss_1", createNext:true , intro:"none", winMessage:"nice", args:bossArgs, targetPos:{x:w/2+150, y:h/2-150, time:3}, powerUp:null},
// 				   {name:"SubBoss_3", createNext:false, intro:"none", winMessage:"nice", args:bossArgs, targetPos:{x:w/2,     y:h/2-200, time:3}, powerUp:null},

// 				   {name:"Boss_1_F", createNext:false , intro:"warning", winMessage:"complete", args:bossArgs, targetPos:{x:w/2, y:h/2-100, time:3}, powerUp:null}];

//First Set
// rocketFactory.addWave("Small_EnemyRocket_1,Small_EnemyRocket_1,Small_EnemyRocket_1,Small_EnemyRocket_2,Small_EnemyRocket_3", 40, -50, 200, 350, 800, 10, false, "SpeedPowerUp");	
// rocketFactory.addWave("CargoShip", 1, TopLevel.canvas.height+50, -50, -70, 600, 10, false, "MultiWeaponPowerUp");
// rocketFactory.addWave("Small_EnemyRocket_1,Small_EnemyRocket_1,Small_EnemyRocket_1,Small_EnemyRocket_2,Small_EnemyRocket_3", 30, -50, 200, 350, 800, 10, true , "WeaponPowerUp,MultiWeaponPowerUp,SpeedPowerUp");

//Second Set
// rocketFactory.addWave("Small_EnemyRocket_1,Small_EnemyRocket_3,Mid_EnemyRocket_1,Mid_EnemyRocket_2,Mid_EnemyRocket_3"	   , 30, -50, 100, 500, 600, 10, false, "MultiWeaponPowerUp,SpeedPowerUp");
// rocketFactory.addWave("CargoShip", 1, TopLevel.canvas.height+50, -90, -100, 600, 10, false, "MultiWeaponPowerUp");
// rocketFactory.addWave("Small_EnemyRocket_1,Small_EnemyRocket_3,Mid_EnemyRocket_1,Mid_EnemyRocket_2,Mid_EnemyRocket_3"	   , 30, -50, 100, 500, 600, 10, true,  "WeaponPowerUp,SpeedPowerUp");

//Third Set
// rocketFactory.addWave("Small_EnemyRocket_1,Small_EnemyRocket_2,Large_EnemyRocket_1,Large_EnemyRocket_2,Large_EnemyRocket_3", 30, -50, 20, 100, 500, 10, false, "MultiWeaponPowerUp,SpeedPowerUp");
// rocketFactory.addWave("CargoShip", 1, TopLevel.canvas.height+50, -200, -250, 600, 10, false, "MultiWeaponPowerUp");
// rocketFactory.addWave("Small_EnemyRocket_1,Small_EnemyRocket_2,Large_EnemyRocket_1,Large_EnemyRocket_2,Large_EnemyRocket_3", 30, -50, 100, 500, 500, 10, true,  "WeaponPowerUp,SpeedPowerUp");