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

	this.beam_red = new BezierParticleBeam();
	this.beam_blue = new BezierParticleBeam();

	this.beamBurstShort_red = new ShotCharge(null, 0, 0, 0, 0, 70);
	this.beamBurstShort_blue = new ShotCharge(null, 0, 0, 0, 0, 70);

	this.beamParticleSize = 3;
	this.particleType = "StraightParticle";
	this.beamParticlesInCycle = 20;
	this.maxParticleSpeed = 40;
	this.beamParticlesLife = 40;

	this.beam_red.init(
		TopLevel.container,
		1,
		"#F280A3",
		this.beamParticleSize,
		this.particleType,
		this.beamParticlesInCycle,
		this.maxParticleSpeed,
		this.beamParticlesLife);

	this.beam_blue.init(
		TopLevel.container,
		1,
		"#80D0F2",
		this.beamParticleSize,
		this.particleType,
		this.beamParticlesInCycle,
		this.maxParticleSpeed,
		this.beamParticlesLife);

	this.burstPos_red = {
		x: 0,
		y: 0
	};

	this.beamBurstShort_red.parent = this.burstPos_red;
	this.beamBurstShort_red.init(
		TopLevel.container,
		15,
		"#F280A3",
		this.beamParticleSize,
		"BurstParticle",
		this.beamParticlesInCycle);

	this.burstPos_blue = {
		x: 0,
		y: 0
	};

	this.beamBurstShort_blue.parent = this.burstPos_blue;
	this.beamBurstShort_blue.init(
		TopLevel.container,
		15,
		"#80D0F2",
		this.beamParticleSize,
		"BurstParticle",
		this.beamParticlesInCycle);

	this.beam_red.off();
	this.beam_blue.off();

	this.beamBurstShort_red.off();
	this.beamBurstShort_blue.off();

	this.beamColliders_red = [];
	this.beamColliders_blue = [];
}

PowerBeamWeapon.BEAM_POINTS = [{ x: 0, y: 0 }, { x: 0, y: 0 }, { x: 0, y: 0 }, { x: 0, y: 0 } ];
PowerBeamWeapon.COLLIDER_ARGUMENTS = [];
PowerBeamWeapon.MIDDLE_SHOT = [null, null,  0, -30, 1000];

PowerBeamWeapon.prototype.getBezierPoints_red = function() {

	PowerBeamWeapon.BEAM_POINTS[0].x = this.user.x - 30;
	PowerBeamWeapon.BEAM_POINTS[0].y = this.user.y - 30;

	PowerBeamWeapon.BEAM_POINTS[1].x = this.user.x - 200;
	PowerBeamWeapon.BEAM_POINTS[1].y = this.user.y - 700 * 0.3;

	PowerBeamWeapon.BEAM_POINTS[2].x = this.user.x + 100
	PowerBeamWeapon.BEAM_POINTS[2].y = this.user.y - 700 * 0.6;

	PowerBeamWeapon.BEAM_POINTS[3].x = this.user.x;
	PowerBeamWeapon.BEAM_POINTS[3].y = this.user.y - 700;

	return PowerBeamWeapon.BEAM_POINTS;
}

PowerBeamWeapon.prototype.getBezierPoints_blue = function() {

	PowerBeamWeapon.BEAM_POINTS[0].x = this.user.x + 30;
	PowerBeamWeapon.BEAM_POINTS[0].y = this.user.y - 30;

	PowerBeamWeapon.BEAM_POINTS[1].x = this.user.x + 200;
	PowerBeamWeapon.BEAM_POINTS[1].y = this.user.y - 700 * 0.3;

	PowerBeamWeapon.BEAM_POINTS[2].x = this.user.x - 100
	PowerBeamWeapon.BEAM_POINTS[2].y = this.user.y - 700 * 0.6;

	PowerBeamWeapon.BEAM_POINTS[3].x = this.user.x;
	PowerBeamWeapon.BEAM_POINTS[3].y = this.user.y - 700;

	return PowerBeamWeapon.BEAM_POINTS;
}

PowerBeamWeapon.prototype.init = function(container) {
	this.parent.init(container);
	this.shotCharge.init(container);

	var inst = this;
	this.idleTimer.start();

	this.shotAmount = 3;
	this.isShootingBeam = false;
	PowerBeamWeapon.MIDDLE_SHOT[0] = this.user;
	PowerBeamWeapon.MIDDLE_SHOT[1] = this.container;

	this.keyUpCallback = ArrowKeyHandler.addKeyUpCallback(ArrowKeyHandler.GAME_BUTTON_1, function() {
		if (!inst.chargeComplete && !inst.isShootingBeam) {
			if (inst.shotAmount > 0) {
				inst.shotAmount--;

				var shot = inst.container.add("Big_Shot", PowerBeamWeapon.MIDDLE_SHOT);

				shot.addOnDestroyCallback(inst, function(obj) {
					inst.shotAmount++;
				});

				inst.idleTimer.reset();
				inst.shotCharge.off();
				inst.chargeTimer.stop();

				return;
			}
		}

		if (inst.chargeComplete) {
			inst.beamColliders_red.length = 0;
			inst.beamColliders_blue.length = 0;
			inst.lastCollider_red = null;
			inst.lastCollider_blue = null;
			inst.isShootingBeam = true;

			inst.shotCharge.off();
			inst.chargeTimer.stop();
			inst.idleTimer.stop();

			inst.beam_red.onComplete = function() {
				inst.idleTimer.reset();
				inst.beam_red.off();
				inst.beam_blue.off();
				inst.beamBurstShort_red.off();
				inst.beamBurstShort_blue.off();

				inst.user.currentMotion.set(inst.user.IDLE_MOTION);
				inst.user.blockControls = false;

				inst.isShootingBeam = false;

				for(var i=0; i<inst.beamColliders_red.length; i++) {
					inst.beamColliders_red[i].alive = false;
				}

				for(i=0; i<inst.beamColliders_blue.length; i++) {
					inst.beamColliders_blue[i].alive = false;	
				}		
			}

			inst.beam_red.onStep = function(currentPos) {
				var x = currentPos.x;
				var y = currentPos.y;

				PowerBeamWeapon.COLLIDER_ARGUMENTS[0] = x;
				PowerBeamWeapon.COLLIDER_ARGUMENTS[1] = y;
				PowerBeamWeapon.COLLIDER_ARGUMENTS[2] = 15;
				PowerBeamWeapon.COLLIDER_ARGUMENTS[3] = -1;
				PowerBeamWeapon.COLLIDER_ARGUMENTS[4] = inst.user;

				var collider;

				if (inst.beamColliders_red.length == 0) {
					collider = this.container.add("BeamCollider_PowerBeam", PowerBeamWeapon.COLLIDER_ARGUMENTS);
				} else {
					if (!VectorUtils.inRange(x, y, inst.lastCollider_red.x, inst.lastCollider_red.y, 10)) {
					 	collider = this.container.add("BeamCollider_PowerBeam", PowerBeamWeapon.COLLIDER_ARGUMENTS);
					}
				}

				if (collider) {
					inst.beamColliders_red.push(collider);
					inst.lastCollider_red = collider;
				}
			}

			inst.beam_blue.onStep = function(currentPos) {
				var x = currentPos.x;
				var y = currentPos.y;

				PowerBeamWeapon.COLLIDER_ARGUMENTS[0] = x;
				PowerBeamWeapon.COLLIDER_ARGUMENTS[1] = y;
				PowerBeamWeapon.COLLIDER_ARGUMENTS[2] = 15;
				PowerBeamWeapon.COLLIDER_ARGUMENTS[3] = -1;
				PowerBeamWeapon.COLLIDER_ARGUMENTS[4] = inst.user;

				var collider;

				if (inst.beamColliders_blue.length == 0) {
					collider = this.container.add("BeamCollider_PowerBeam", PowerBeamWeapon.COLLIDER_ARGUMENTS);
				} else {
					if (!VectorUtils.inRange(x, y, inst.lastCollider_blue.x, inst.lastCollider_blue.y, 10)) {
					 	collider = this.container.add("BeamCollider_PowerBeam", PowerBeamWeapon.COLLIDER_ARGUMENTS);
					}
				}

				if (collider) {
					inst.beamColliders_blue.push(collider);
					inst.lastCollider_blue = collider;
				}
			}

			inst.user.currentMotion.set(inst.user.NONE_STOP_SHAKE_MOTION);
			inst.user.blockControls = true;

			inst.beamBurstShort_red.on((270 - 45) - 45, (270 - 45) + 45);
			inst.beamBurstShort_blue.on((270 + 45) - 45, (270 + 45) + 45);

			inst.beam_red.on(function() {
				return inst.getBezierPoints_red();
			});

			inst.beam_blue.on(function() {
				return inst.getBezierPoints_blue();
			});

			inst.chargeComplete = false;
		}

	});

	this.callbacks.push(this.keyUpCallback);
}

PowerBeamWeapon.prototype.update = function() {
	if (this.shotCharge) {
		this.shotCharge.update();

		this.beam_red.update();
		this.beam_blue.update();

		this.burstPos_red.x = this.user.x - 20;
		this.burstPos_red.y = this.user.y - 20;

		this.burstPos_blue.x = this.user.x + 20;
		this.burstPos_blue.y = this.user.y - 20;
	}
}

PowerBeamWeapon.prototype.destroy = function() {
	if (this.shotCharge) this.shotCharge.destroy();
	if (this.callbacks) ArrowKeyHandler.removeCallbacks(this.callbacks);

	if (this.idleTimer) this.idleTimer.stop();
	if (this.chargeTimer) this.chargeTimer.stop();
	
	if(this.beam_red) this.beam_red.destroy();
	if(this.beam_blue) this.beam_blue.destroy();

	if(this.beamBurstShort_red) this.beamBurstShort_red.destroy();
	if(this.beamBurstShort_blue) this.beamBurstShort_blue.destroy();

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