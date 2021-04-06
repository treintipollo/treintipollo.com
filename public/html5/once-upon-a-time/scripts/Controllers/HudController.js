function HudController() {
	this.updateWeapon = function(playerData) {
		var name = playerData.ship.weapon.getName();
		var level = playerData.ship.weapon.getLevel() + 1;
		$("#weapon").text((name + " lv. " + level).toString());

		var amountToNextLevel = playerData.ship.weapon.getAmountToNextLevel();
		var domNext = $(".shot-xp");
		var domMeter = $(".shot-xp>span");
		var totalWidth = domNext.width();
		var meterPercentage = totalWidth * amountToNextLevel;
		
		TweenMax.to(domMeter, 0.5, { css: { width: meterPercentage } });
	},

	this.updateSecondaryWeapon = function(playerData) {
		if (playerData.ship.secondaryWeapon)
		{
			var name = playerData.ship.secondaryWeapon.getName();
			var level = playerData.ship.secondaryWeapon.getLevel() + 1;
			var ammo = playerData.ship.secondaryWeapon.getAmmo();

			$("#secondaryWeapon").text((name + " lv. " + level).toString());
			$("#rockets").text(("🚀" + " x " + ammo).toString());
		}
		else
		{
			$("#secondaryWeapon").text("");
			$("#rockets").text("");
		}
	},

	this.updateLives = function(playerData) {
		var lives = playerData.lives;
		$("#lives").text("Lives x " + lives.toString());
	},

	this.updateSpeed = function(playerData) {
		var speed = playerData.speedPowerUps + 1;
		$("#speed").text("Speed lv. " + speed.toString());
	},

	this.updateStage = function(playerData) {
		var stage = playerData.gameStage + 1;
		$("#level").text((" - " + stage + " - ").toString());
	},

	this.updateHPPlus = function(playerData, onComplete) {
		var totalHp = playerData.ship.getTotalHp();
		var currentHp = playerData.ship.getCurrentHp();

		var domHp = $(".hp");
		var domMeter = $(".hp>span");

		var totalWidth = domHp.width();

		var hpPercentage = currentHp / totalHp;
		var meterPercentage = totalWidth * hpPercentage;

		TweenMax.to(domMeter, 0.5, { css: { width: meterPercentage }, onComplete:onComplete });

		domMeter.get(0).style.background = "#2BC253"; 

		return domMeter.get(0);
	},

	this.updateHPMinus = function(playerData) {
		var hpBar = this.updateHPPlus(playerData, function(){
			hpBar.style.background = "#2BC253"; 
		});

		hpBar.style.background = "#ff3300";
	},

	this.hide = function(time, delay) {
		if(this.hiding) return;

		if(!time) time = 0.5;
		if(!delay) delay = 0;

		this.showing = false;
		this.hiding = true;

		TweenMax.to($("#weapon"), time, { css: { autoAlpha: 0 }, delay:delay });
		TweenMax.to($("#lives"), time, { css: { autoAlpha: 0 }, delay:delay });
		TweenMax.to($("#speed"), time, { css: { autoAlpha: 0 }, delay:delay });
		TweenMax.to($("#level"), time, { css: { autoAlpha: 0 }, delay:delay });
		TweenMax.to($("#next-shot-level"), time, { css: { autoAlpha: 0 }, delay:delay });
		TweenMax.to($("#secondaryWeapon"), time, { css: { autoAlpha: 0 }, delay:delay });
		TweenMax.to($("#rockets"), time, { css: { autoAlpha: 0 }, delay:delay });
		TweenMax.to($(".hp"), time, { css: { autoAlpha: 0 }, delay:delay });
		TweenMax.to($(".shot-xp"), time, { css: { autoAlpha: 0 }, delay:delay });
	},

	this.show = function(time, delay) {
		if(this.showing) return;

		if(!time) time = 0.5;
		if(!delay) delay = 0;

		this.showing = true;
		this.hiding = false;

		TweenMax.to($("#weapon"), time, { css: { autoAlpha: 1 }, delay:delay });
		TweenMax.to($("#lives"), time, { css: { autoAlpha: 1 }, delay:delay });
		TweenMax.to($("#speed"), time, { css: { autoAlpha: 1 }, delay:delay });
		TweenMax.to($("#level"), time, { css: { autoAlpha: 1 }, delay:delay });
		TweenMax.to($("#next-shot-level"), time, { css: { autoAlpha: 1 }, delay:delay });
		TweenMax.to($("#secondaryWeapon"), time, { css: { autoAlpha: 1 }, delay:delay });
		TweenMax.to($("#rockets"), time, { css: { autoAlpha: 1 }, delay:delay });
		TweenMax.to($(".hp"), time, { css: { autoAlpha: 1 }, delay:delay });
		TweenMax.to($(".shot-xp"), time, { css: { autoAlpha: 1 }, delay:delay });
	},

	this.init = function(playerData) {
		this.showing = true;
		this.hiding = false;

		playerData.add(playerData.INIT, this, function(playerData) {
			this.updateWeapon(playerData);
			this.updateLives(playerData);
			this.updateSpeed(playerData);
			this.updateStage(playerData);
			this.updateHPPlus(playerData);
		});
		playerData.add(playerData.WEAPON_INIT, this, function(playerData) {
			this.updateWeapon(playerData);
		});
		playerData.add(playerData.WEAPON_SET, this, function(playerData) {
			this.updateWeapon(playerData);
		});
		playerData.add(playerData.SECONDARY_WEAPON_INIT, this, function(playerData) {
			this.updateSecondaryWeapon(playerData);
		});
		playerData.add(playerData.SECONDARY_WEAPON_SET, this, function(playerData) {
			this.updateSecondaryWeapon(playerData);
		});
		playerData.add(playerData.SECONDARY_AMMO, this, function(playerData) {
			this.updateSecondaryWeapon(playerData);
		});
		playerData.add(playerData.WEAPON_POWER_UP, this, function(playerData) {
			this.updateWeapon(playerData);
			this.updateSecondaryWeapon(playerData);
		});
		playerData.add(playerData.WEAPON_POWER_DOWN, this, function(playerData) {
			this.updateWeapon(playerData);
			this.updateSecondaryWeapon(playerData);
		});
		playerData.add(playerData.SPEED_UP, this, function(playerData) {
			this.updateSpeed(playerData);
		});
		playerData.add(playerData.LIVES_UP, this, function(playerData) {
			this.updateLives(playerData);
		});
		playerData.add(playerData.LIVES_DOWN, this, function(playerData) {
			this.updateHPPlus(playerData);
		});
		playerData.add(playerData.HP_UP, this, function(playerData) {
			this.updateHPPlus(playerData);
		});
		playerData.add(playerData.HP_DOWN, this, function(playerData) {
			this.updateHPMinus(playerData);
		});
		playerData.add(playerData.STAGE_UP, this, function(playerData) {
			this.updateStage(playerData);
		});
		playerData.add(playerData.SOFT_RESET, this, function(playerData) {
			$("#weapon").text("Shot lv. 1");
			$("#lives").text("Lives x 1");
			$("#speed").text("Speed lv. 1");
			$("#level").text((" - " + 1 + " - ").toString());
			$("#secondaryWeapon").text("Rocket lv. 1");
			$("#rockets").text("🚀 x 20");
		
			TweenMax.to($(".hp>span"), 0.1, { css: { width: $(".hp").width() } });
			TweenMax.to($(".shot-xp>span"), 0.1, { css: { width: 0 } });
		});
		playerData.add("rocket", this, function(playerData) {
			this.updateSecondaryWeapon(playerData);
		});
	}
}