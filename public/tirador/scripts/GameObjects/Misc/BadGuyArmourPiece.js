BadGuyArmourPiece.inheritsFrom( Attributes );

function BadGuyArmourPiece() {}

BadGuyArmourPiece.rightSideDrawing = function(context) {
	DrawUtils.quadraticTriangle(
		context,
		0, 0, 
		-20, -20, 20, 0,
		40, 30, 0, 10, 
		-20, 20, -20, -20,
		null, "#FFFFFF", 1
	);
}

BadGuyArmourPiece.leftSideDrawing = function(context) {
	DrawUtils.quadraticTriangle(
		context,
		0, 0, 
		20, -20, -20, 0,
		-40, 30, 0, 10, 
		20, 20, 20, 20,
		null, "#FFFFFF", 1
	);	
}

BadGuyArmourPiece.prototype.init = function(startX, startY, endX, endY) {
	this.x = startX;
	this.y = startY;

	TweenMax.to(this, 2, {x:endX, y:endY, onCompleteScope:this, onComplete:function(){
		this.executeCallbacks("finishedIntro");
	}});
}

BadGuyArmourPiece.prototype.draw = function(context) { 	
	this.drawing(context);
}

BadGuyArmourPiece.prototype.onAllDamageReceived = function(other) {

}