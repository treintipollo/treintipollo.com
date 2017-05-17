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
		TweenMax.to($(".hp"), time, { css: { autoAlpha: 0 }, delay:delay });
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
		TweenMax.to($(".hp"), time, { css: { autoAlpha: 1 }, delay:delay });
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
			$("#weapon").text("Shot x 1");
			$("#lives").text("Lives x 1");
			$("#speed").text("Speed x 1");
			$("#level").text((" - " + 1 + " - ").toString());
	
			TweenMax.to($(".hp>span"), 0.1, { css: { width: $(".hp").width() } });	
		});
	}
}