function PowerUpFactory() {
	this.powerUpTypes = {};
	this.multiPowerUpPrototypes = {};
	this.args = [];
	this.createInBulk = [];

	this.addPowerUp = function(type, x, y, stayInPlace, angle, amount) {
		this.args[0] = x;
		this.args[1] = y;
		this.args[2] = stayInPlace;

		var trueType = type;
		if (this.multiPowerUpPrototypes[type]) {
			this.args[3] = this.multiPowerUpPrototypes[type].prototypes;
			type = this.multiPowerUpPrototypes[type].type;
		}

		var p = TopLevel.container.add(type, this.args);

		if (!p) return;

		p.addOnCollideCallback(this, function(other) {
			var callbacks = this.powerUpTypes[trueType];

			for (var i = 0; i < callbacks.length; i++) {
				callbacks[i].callback.call(callbacks[i].scope, p);
			}
		});

		if (amount > 1) {
			p.gotoPosition(p.x + Math.cos(angle) * 50, p.y + Math.sin(angle) * 50);
		}
	};

	this.addPowerUpTypes = function(type, pickUpCallback) {
		this.powerUpTypes[type] = pickUpCallback;
	};

	this.addMultiPowerUpType = function(multiPowerUpId, type, prototypes, pickUpCallback) {
		this.powerUpTypes[multiPowerUpId] = pickUpCallback;
		this.multiPowerUpPrototypes[multiPowerUpId] = {
			type: type,
			prototypes: prototypes
		};
	};

	this.create = function(x, y, type, amount, stayInPlace) {
		var anlgeStep = (360 / amount) * (Math.PI / 180);

		for (var i = 0; i < amount; i++) {
			if (type) this.addPowerUp(type, x, y, stayInPlace, anlgeStep * i, amount);
		}
	};

	this.addToBulkCreate = function(type, amount) {
		for (var i = 0; i < amount; i++) {
			this.createInBulk.push(type);
		}
	};

	this.createBulk = function(x, y, stayInPlace) {
		var anlgeStep = (360 / this.createInBulk.length) * (Math.PI / 180);

		for (var i = 0; i < this.createInBulk.length; i++) {
			this.addPowerUp(this.createInBulk[i], x, y, stayInPlace, anlgeStep * i, this.createInBulk.length);
		}

		this.createInBulk.length = 0;
	};
}