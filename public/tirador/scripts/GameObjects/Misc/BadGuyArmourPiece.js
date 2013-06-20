BadGuyArmourPieceRight.inheritsFrom( Attributes );

function BadGuyArmourPieceRight() {}

BadGuyArmourPieceRight.prototype.afterCreate = function(){
	this.points = [new SAT.Vector(-20,-20),
				   new SAT.Vector(40,30),
				   new SAT.Vector(-20,20)];

	PolyCollider.prototype.create.call(this, this.points);
}

BadGuyArmourPieceRight.prototype.init = function(startX, startY, endX, endY) {
	this.x = startX;
	this.y = startY;

	TweenMax.to(this, 2, {x:endX, y:endY, onCompleteScope:this, onComplete:function(){
		this.executeCallbacks("finishedIntro");
	}});
}

BadGuyArmourPieceRight.prototype.draw = function(context) { 	
	DrawUtils.quadraticTriangle(
		context,
		0, 0, 
		-20, -20, 20, 0,
		40, 30, 0, 10, 
		-20, 20, -20, -20,
		null, "#FFFFFF", 1
	);
}

BadGuyArmourPieceLeft.inheritsFrom( Attributes );

function BadGuyArmourPieceLeft() {}

BadGuyArmourPieceLeft.prototype.afterCreate = function(){
	this.points = [new SAT.Vector(20,-20),
				   new SAT.Vector(20,20),
				   new SAT.Vector(-40,30)];

	PolyCollider.prototype.create.call(this, this.points);
}

BadGuyArmourPieceLeft.prototype.init = function(startX, startY, endX, endY) {
	this.x = startX;
	this.y = startY;

	TweenMax.to(this, 2, {x:endX, y:endY, onCompleteScope:this, onComplete:function(){
		this.executeCallbacks("finishedIntro");
	}});
}

BadGuyArmourPieceLeft.prototype.draw = function(context) { 	
	DrawUtils.quadraticTriangle(
		context,
		0, 0, 
		20, -20, -20, 0,
		-40, 30, 0, 10, 
		20, 20, 20, 20,
		null, "#FFFFFF", 1
	);
}