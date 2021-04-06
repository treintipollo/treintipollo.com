function Splash() {}

Splash.inheritsFrom( GameObject );

Splash.prototype.init  = function(onStartComplete, onExitComplete) {
	this.space      = TopLevel.textFeedbackDisplayer.showFeedBack("space"     , -100, -100);
	this.shooting   = TopLevel.textFeedbackDisplayer.showFeedBack("shooting"  , -100, -100);
	this.adventure  = TopLevel.textFeedbackDisplayer.showFeedBack("adventure" , -100, -100);
	this.controls_1 = TopLevel.textFeedbackDisplayer.showFeedBack("controls_1", -100, -100);
	this.controls_2 = TopLevel.textFeedbackDisplayer.showFeedBack("controls_2", -100, -100);

	this.introSplashTimeLine = new TimelineLite({onComplete:onStartComplete});

	this.introSplashTimeLine.fromTo(this.space    , 1.2, {x:TopLevel.canvas.width/2, y:-100}, {x:TopLevel.canvas.width/2, y:"+=200", ease:Back.easeOut},   0);
	this.introSplashTimeLine.fromTo(this.shooting , 1.2, {x:TopLevel.canvas.width/2, y:-100}, {x:TopLevel.canvas.width/2, y:"+=270", ease:Back.easeOut},  -1);
	this.introSplashTimeLine.fromTo(this.adventure, 1.2, {x:TopLevel.canvas.width/2, y:-100}, {x:TopLevel.canvas.width/2, y:"+=340", ease:Back.easeOut},  -1);
	this.introSplashTimeLine.fromTo(this.controls_1, 1.2, {x:TopLevel.canvas.width/2, y:-100}, {x:TopLevel.canvas.width/2, y:"+=400", ease:Back.easeOut}, -1);
	this.introSplashTimeLine.fromTo(this.controls_2, 1.2, {x:TopLevel.canvas.width/2, y:-100}, {x:TopLevel.canvas.width/2, y:"+=440", ease:Back.easeOut}, -1);

	this.outroSplashTimeLine = new TimelineLite({onCompleteScope:this, onComplete:function(){
		onExitComplete();
		this.alive = false;
	}});

	this.outroSplashTimeLine.to(this.space     , 1.2, {y:"-=500", ease:Back.easeIn},  0)
							.to(this.shooting  , 1.2, {y:"-=500", ease:Back.easeIn}, -1)
							.to(this.adventure , 1.2, {y:"-=500", ease:Back.easeIn}, -1)
							.to(this.controls_1, 1.2, {y:"-=500", ease:Back.easeIn}, -1)
							.to(this.controls_2, 1.2, {y:"-=500", ease:Back.easeIn}, -1);	

	this.introSplashTimeLine.stop();
	this.outroSplashTimeLine.stop();
}

Splash.prototype.destroy = function() {
	this.space.alive      = false;
	this.shooting.alive   = false;
	this.adventure.alive  = false;
	this.controls_1.alive = false;
	this.controls_2.alive = false;
	
	this.introSplashTimeLine.kill();
	this.outroSplashTimeLine.kill();
	
	this.introSplashTimeLine = null;
	this.outroSplashTimeLine = null;
}

Splash.prototype.enter = function() {
	this.introSplashTimeLine.restart();

	this.executeCallbacks("start-splash", this);
}

Splash.prototype.exit = function() {
	this.introSplashTimeLine.kill();
	this.outroSplashTimeLine.restart();
}