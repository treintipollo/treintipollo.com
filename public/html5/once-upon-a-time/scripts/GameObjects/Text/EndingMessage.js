function EndingMessage() {}

EndingMessage.inheritsFrom( GameObject );

EndingMessage.prototype.init  = function(onStartComplete) {
	this.end     = TopLevel.textFeedbackDisplayer.showFeedBack("end"      , -100, -100);
	this.thanks  = TopLevel.textFeedbackDisplayer.showFeedBack("thanks"   , -100, -100);
	this.hope    = TopLevel.textFeedbackDisplayer.showFeedBack("hope"     , -100, -100);
	this.inSpace = TopLevel.textFeedbackDisplayer.showFeedBack("adventure", -100, -100);

	this.introEndingMessageTimeLine = new TimelineLite({onComplete:onStartComplete});

	this.introEndingMessageTimeLine.fromTo(this.end    , 1.2, {x:TopLevel.canvas.width/2, y:-100}, {x:TopLevel.canvas.width/2, y:"+=260", ease:Back.easeOut},   0);
	this.introEndingMessageTimeLine.fromTo(this.thanks , 1.2, {x:TopLevel.canvas.width/2, y:-100}, {x:TopLevel.canvas.width/2, y:"+=300", ease:Back.easeOut},  -1);
	this.introEndingMessageTimeLine.fromTo(this.hope   , 1.2, {x:TopLevel.canvas.width/2, y:-100}, {x:TopLevel.canvas.width/2, y:"+=450", ease:Back.easeOut},  -1);
	this.introEndingMessageTimeLine.fromTo(this.inSpace, 1.2, {x:TopLevel.canvas.width/2, y:-100}, {x:TopLevel.canvas.width/2, y:"+=490", ease:Back.easeOut},  -1);

	this.introEndingMessageTimeLine.stop();
}

EndingMessage.prototype.destroy = function() {
	this.end.alive     = false;
	this.thanks.alive  = false;
	this.hope.alive    = false;
	this.inSpace.alive = false;

	this.introEndingMessageTimeLine.kill();
	this.introEndingMessageTimeLine = null;
}

EndingMessage.prototype.enter = function() {
	this.introEndingMessageTimeLine.restart();

	this.executeCallbacks("start-ending", this);
}