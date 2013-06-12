PowerBeamWeapon.inheritsFrom(Weapon);

function PowerBeamWeapon(id, name, level, user) {
	Weapon.apply(this, arguments);

	this.shotCharge = new ShotCharge(this.user, 0, -40, 210, 330, 60);
	this.shotCharge.off();

	this.chargeComplete = false;

	this.idleTimer = TimeOutFactory.getTimeOut(500, 1, this, function() {
		this.shotCharge.on();
		this.chargeTimer.reset();
	});

	this.chargeTimer = TimeOutFactory.getTimeOut(2500, 1, this, function() {
		this.shotCharge.off();
		this.chargeComplete = true;
	});

	this.beam = new BezierParticleBeam();

	this.burstColor1 = "#ff0000";
	this.beamParticleSize = 5;
	this.particleType = "StraightParticle";
	this.beam1ParticlesInCycle = 5;
	this.maxParticleSpeed = 90;
	this.beam1ParticlesLife = 30;

	this.beam.init(TopLevel.container,
		1,
		this.burstColor1,
		this.beamParticleSize,
		this.particleType,
		this.beam1ParticlesInCycle,
		this.maxParticleSpeed,
		this.beam1ParticlesLife);

	//this.beam.off();
	//this.beam.destroy();

}

PowerBeamWeapon.prototype.init = function(container) {
	this.parent.init(container);
	this.shotCharge.init(container);

	var inst = this;
	this.idleTimer.start();

	this.keyUpCallback = ArrowKeyHandler.addKeyUpCallback(ArrowKeyHandler.GAME_BUTTON_1, function() {
		if (inst.chargeComplete) {
			
			inst.shotCharge.off();
			inst.chargeTimer.stop();
			inst.idleTimer.stop();

			//TODO: Hacer algo para generar los puntos de la curva y pasarselos al on del rayo

			inst.beam.on(inst.user, {
				x: inst.user.x,
				y: inst.user.y - 400
			});

			inst.chargeComplete = false;

			TimeOutFactory.getTimeOut(500, 1, this, function() {
				inst.idleTimer.reset();
				inst.beam.off();
			}, true).start();
		}

	});

	this.callbacks.push(this.keyUpCallback);
}

PowerBeamWeapon.prototype.update = function() {
	if (this.shotCharge) this.shotCharge.update();
	this.beam.update();
}

PowerBeamWeapon.prototype.destroy = function() {
	if (this.shotCharge) this.shotCharge.destroy();
	if (this.callbacks) ArrowKeyHandler.removeCallbacks(this.callbacks);

	if (this.idleTimer) this.idleTimer.stop();
	if (this.chargeTimer) this.chargeTimer.stop();

	DestroyUtils.destroyAllProperties(this);
}

// PowerBeamWeapon.prototype.stop = function() {
// 	ArrowKeyHandler.removeKeyUpCallback(ArrowKeyHandler.GAME_BUTTON_1, this.keyUpCallback);
// 	this.callbacks.pop();

// 	this.shotCharge.off();

// 	if (this.idleTimer) {
// 		this.idleTimer.stop();
// 	}
// 	if (this.chargeTimer) {
// 		this.chargeTimer.stop();
// 	}
// }