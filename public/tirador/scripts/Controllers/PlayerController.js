PlayerController.inheritsFrom(Delegate);

function PlayerController() {
	this.INIT = "init";
	this.SOFT_RESET = "softReset";
	this.RESET = "reset";
	this.WEAPON_INIT = "weaponInitialized";
	this.WEAPON_SET = "weaponSet";
	this.WEAPON_POWER_UP = "weaponPowerUp";
	this.WEAPON_POWER_DOWN = "weaponPowerDown";
	this.SPEED_UP = "speedUp";
	this.LIVES_UP = "increaseLives";
	this.HP_UP = "increaseHp";
	this.HP_DOWN = "decreaseHp";
	this.LIVES_DOWN = "decreaseLives";
	this.STAGE_UP = "increaseStage";

	this.ship = null;

	this.lastWeaponType = 0;
	this.speedPowerUps = 0;
	this.speed = 0;
	this.lives = 1;
	this.gameStage = 0;

	this.livesReset         = 1;
	this.speedReset         = 125;
	this.speedPowerUpCap    = 8;
	this.speedPowerUpAmount = 5;
	this.weaponDivider      = 4;
	this.speedDivider       = 4;
}

PlayerController.prototype.init = function(ship) {
	this.ship = ship;

	this.reset();

	this.initWeapon();

	ship.addHpDeminishedCallback(this, function(other) {
		this.execute(this.HP_DOWN, this);
	});
	ship.addDamageReceivedCallback(this, function(other) {
		this.execute(this.HP_DOWN, this);
	});

	this.execute(this.INIT, this);
}

PlayerController.prototype.powerInit = function(ship) {
	this.ship = ship;

	this.speed = this.speedReset + (this.speedPowerUpCap * this.speedPowerUpAmount);
	this.speedPowerUps = this.speedPowerUpCap;

	if (this.ship.weapon) this.ship.weapon.destroy();

	this.execute(this.RESET, this);

	this.ship.weapon = TopLevel.weaponFactory.getInitializedWeapon(TopLevel.weaponFactory.POWER_BEAM_WEAPON, 0, this.ship, this.ship.weapon);
	this.lastWeaponType = this.ship.weapon.getId();

	this.execute(this.WEAPON_INIT, this);

	ship.addHpDeminishedCallback(this, function(other) {
		this.execute(this.HP_DOWN, this);
	});
	ship.addDamageReceivedCallback(this, function(other) {
		this.execute(this.HP_DOWN, this);
	});
	ship.onAllDamageReceived(this, function(other) {
		this.execute(this.HP_DOWN, this);
	});

	this.execute(this.INIT, this);
}

PlayerController.prototype.hasLives = function() {
	return this.lives >= 0;
}

PlayerController.prototype.increaseStage = function() {
	this.gameStage++;
	this.execute(this.STAGE_UP, this);
}

PlayerController.prototype.softReset = function() {
	this.speed = this.speedReset;
	this.speedPowerUps = 0;
	this.lives = this.livesReset;
	this.gameStage = 0;

	if (this.ship.weapon) this.ship.weapon.destroy();

	this.lastWeaponType = 0;

	this.execute(this.SOFT_RESET, this);
}

PlayerController.prototype.reset = function() {
	this.speed = this.speedReset;
	this.speedPowerUps = 0;

	if (this.ship.weapon) this.ship.weapon.destroy();

	this.execute(this.RESET, this);
}

PlayerController.prototype.initWeapon = function() {
	this.ship.weapon = TopLevel.weaponFactory.getInitializedWeapon(this.lastWeaponType, 0, this.ship, this.ship.weapon);
	this.lastWeaponType = this.ship.weapon.getId();

	this.execute(this.WEAPON_INIT, this);
}

PlayerController.prototype.setWeapon = function(weaponId) {
	if (this.lastWeaponType == weaponId) {
		this.powerUpWeapon();
	} else {
		this.ship.weapon = TopLevel.weaponFactory.getInitializedWeapon(weaponId, this.ship.weapon.getLevel(), this.ship, this.ship.weapon);
		this.lastWeaponType = this.ship.weapon.getId();

		this.execute(this.WEAPON_SET, this);
	}
}

PlayerController.prototype.powerUpWeapon = function() {
	this.ship.weapon.powerUp();
	this.execute(this.WEAPON_POWER_UP, this);
}

PlayerController.prototype.powerDownWeapon = function() {
	this.ship.weapon.powerDown();
	this.execute(this.WEAPON_POWER_DOWN, this);
}

PlayerController.prototype.increaseSpeed = function() {
	if (this.speedPowerUps < this.speedPowerUpCap) {
		this.speed += this.speedPowerUpAmount;
		this.speedPowerUps++;
		this.execute(this.SPEED_UP, this);
	}
}

PlayerController.prototype.increaseLives = function() {
	this.lives++;
	this.execute(this.LIVES_UP, this);
}

PlayerController.prototype.decreaseLives = function() {
	TopLevel.powerUpFactory.addToBulkCreate("WeaponPowerUp", Math.floor(this.ship.weapon.getLevel() / this.weaponDivider));
	TopLevel.powerUpFactory.addToBulkCreate("SpeedPowerUp", Math.floor(this.speedPowerUps / this.speedDivider));
	TopLevel.powerUpFactory.createBulk(this.ship.x, this.ship.y, true);

	this.reset();
	this.lives--;
	this.execute(this.LIVES_DOWN, this);
}

PlayerController.prototype.increaseHP = function() {
	this.ship.recoverHP(5);
	this.execute(this.HP_UP, this);
}