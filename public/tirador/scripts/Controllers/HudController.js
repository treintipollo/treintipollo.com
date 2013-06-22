function HudController() {
	this.updateWeapon = function(playerData) {
		var name = playerData.ship.weapon.getName();
		var level = playerData.ship.weapon.getLevel() + 1;
		$("#weapon").text((name + " x " + level).toString());
	},

	this.updateLives = function(playerData) {
		var lives = playerData.lives;
		$("#lives").text("Lives x " + lives.toString());
	},

	this.updateSpeed = function(playerData) {
		var speed = playerData.speedPowerUps + 1;
		$("#speed").text("Speed x " + speed.toString());
	},

	this.updateStage = function(playerData) {
		var stage = playerData.gameStage + 1;
		$("#level").text((" - " + stage + " - ").toString());
	},

	this.updateHP = function(playerData) {
		var totalHp = playerData.ship.getTotalHp();
		var currentHp = playerData.ship.getCurrentHp();

		var domHp = $(".hp");
		var domMeter = $(".hp>span");

		var totalWidth = domHp.width();

		var hpPercentage = currentHp / totalHp;
		var meterPercentage = totalWidth * hpPercentage;

		domMeter.stop(true);
		domMeter.animate({
			width: meterPercentage
		}, 500);
	},

	this.hide = function(playerData) {
		if(this.hiding) return;

		this.showing = false;
		this.hiding = true;

		$("#weapon").stop(true).fadeTo(500, 0);
		$("#lives").stop(true).fadeTo(500, 0);
		$("#speed").stop(true).fadeTo(500, 0);
		$("#level").stop(true).fadeTo(500, 0);
		$(".hp").stop(true).fadeTo(500, 0);
	},

	this.show = function(playerData) {
		if(this.showing) return;

		this.showing = true;
		this.hiding = false;

		$("#weapon").stop(true).fadeTo(500, 1);
		$("#lives").stop(true).fadeTo(500, 1);
		$("#speed").stop(true).fadeTo(500, 1);
		$("#level").stop(true).fadeTo(500, 1);
		$(".hp").stop(true).fadeTo(500, 1);	
	},

	this.init = function(playerData) {
		this.showing = true;
		this.hiding = false;

		playerData.add(playerData.INIT, this, function(playerData) {
			this.updateWeapon(playerData);
			this.updateLives(playerData);
			this.updateSpeed(playerData);
			this.updateStage(playerData);
			this.updateHP(playerData);
		});
		playerData.add(playerData.WEAPON_INIT, this, function(playerData) {
			this.updateWeapon(playerData);
		});
		playerData.add(playerData.WEAPON_SET, this, function(playerData) {
			this.updateWeapon(playerData);
		});
		playerData.add(playerData.WEAPON_POWER_UP, this, function(playerData) {
			this.updateWeapon(playerData);
		});
		playerData.add(playerData.WEAPON_POWER_DOWN, this, function(playerData) {
			this.updateWeapon(playerData);
		});
		playerData.add(playerData.SPEED_UP, this, function(playerData) {
			this.updateSpeed(playerData);
		});
		playerData.add(playerData.LIVES_UP, this, function(playerData) {
			this.updateLives(playerData);
		});
		playerData.add(playerData.LIVES_DOWN, this, function(playerData) {
			this.updateHP(playerData);
		});
		playerData.add(playerData.HP_UP, this, function(playerData) {
			this.updateHP(playerData);
		});
		playerData.add(playerData.HP_DOWN, this, function(playerData) {
			this.updateHP(playerData);
		});
		playerData.add(playerData.STAGE_UP, this, function(playerData) {
			this.updateStage(playerData);
		});
	}
}