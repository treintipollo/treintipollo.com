function Splash() {}

Splash.inheritsFrom( GameObject );

Splash.prototype.init  = function(onStartComplete, onExitComplete) {

	var space     = TopLevel.textFeedbackDisplayer.showFeedBack("space", -100, -100);
	var shooting  = TopLevel.textFeedbackDisplayer.showFeedBack("shooting", -100, -100);
	var adventure = TopLevel.textFeedbackDisplayer.showFeedBack("adventure", -100, -100);

	this.introSplashTimeLine = new TimelineLite({onComplete:onStartComplete});

	this.introSplashTimeLine.fromTo(space    , 1.2, {x:TopLevel.canvas.width/2, y:-100}, {x:TopLevel.canvas.width/2, y:200, ease:Back.easeOut}, 0);
	this.introSplashTimeLine.fromTo(shooting , 1.2, {x:TopLevel.canvas.width/2, y:-100}, {x:TopLevel.canvas.width/2, y:270, ease:Back.easeOut}, -1);
	this.introSplashTimeLine.fromTo(adventure, 1.2, {x:TopLevel.canvas.width/2, y:-100}, {x:TopLevel.canvas.width/2, y:340, ease:Back.easeOut}, -1);

	this.outroSplashTimeLine = new TimelineLite({onCompleteScope:this, onComplete:function(){
		onExitComplete();

		this.alive      = false;
		space.alive     = false;
		shooting.alive  = false;
		adventure.alive = false;
	}});

	this.outroSplashTimeLine.to(space    , 1.2, {y:"-=500", ease:Back.easeIn},  0)
							.to(shooting , 1.2, {y:"-=500", ease:Back.easeIn}, -1)
							.to(adventure, 1.2, {y:"-=500", ease:Back.easeIn}, -1);	

	this.introSplashTimeLine.stop();
	this.outroSplashTimeLine.stop();
}

Splash.prototype.enter = function() {
	this.introSplashTimeLine.restart();
}

Splash.prototype.exit = function() {
	this.introSplashTimeLine.kill();
	this.outroSplashTimeLine.restart();
}

Splash.prototype.destroy = function() {
	this.introSplashTimeLine.kill();
	this.outroSplashTimeLine.kill();
	
	this.introSplashTimeLine = null;
	this.outroSplashTimeLine = null;
}