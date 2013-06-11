PowerBeamWeapon.inheritsFrom( Weapon );

function PowerBeamWeapon(id, name, level, user) {
	Weapon.apply(this, arguments);

	this.shotCharge = new ShotCharge(this.user, 0, -40, 210, 330, 60);
	this.shotCharge.off();
	
	this.idleTimer = TimeOutFactory.getTimeOut(500, 1, this, function(){
		this.shotCharge.on();
		this.chargeTimer.reset();
	});

	this.chargeTimer = TimeOutFactory.getTimeOut(2500, 1, this, function(){
		this.shotCharge.off();
	}); 
}

PowerBeamWeapon.prototype.init = function(container) {
	this.parent.init(container);
	this.shotCharge.init(container);

	var inst = this;
	this.idleTimer.start();
	
	this.keyUpCallback = ArrowKeyHandler.addKeyUpCallback(ArrowKeyHandler.GAME_BUTTON_1, function(){
		inst.shotCharge.off();
		inst.idleTimer.reset();
		inst.chargeTimer.stop();
	});

	this.callbacks.push(this.keyUpCallback);
}

PowerBeamWeapon.prototype.update = function() {
	if(this.shotCharge) this.shotCharge.update();
}

PowerBeamWeapon.prototype.destroy = function() {
	if(this.shotCharge) this.shotCharge.destroy();
	if(this.callbacks) ArrowKeyHandler.removeCallbacks(this.callbacks);
	
	if(this.idleTimer)this.idleTimer.stop();
	if(this.chargeTimer)this.chargeTimer.stop();

	DestroyUtils.destroyAllProperties(this);
}

PowerBeamWeapon.prototype.stop = function() {
	ArrowKeyHandler.removeKeyUpCallback(ArrowKeyHandler.GAME_BUTTON_1, this.keyUpCallback);
	this.callbacks.pop();

	this.shotCharge.off();

	if (this.idleTimer) {
		this.idleTimer.stop();
	}
	if (this.chargeTimer) {
		this.chargeTimer.stop();
	}
}