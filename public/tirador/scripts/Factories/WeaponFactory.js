function WeaponFactory() {
	this.SHOT_WEAPON		  = 0;
	this.ROCKET_WEAPON	      = 1;
	this.CLONE_SHOT_WEAPON    = 2;
	this.HOMING_ROCKET_WEAPON = 3;

	this.weaponsTypes = [
		function(level, user){ return new ShotWeapon(this.SHOT_WEAPON, "Shot", level, user, true, true, "Small_Shot", "Big_Shot"); }, 
		function(level, user){ return new RocketWeapon(this.ROCKET_WEAPON, "Rocket", level, user, true); },
		function(level, user){ return new ShotWeapon(this.CLONE_SHOT_WEAPON, "Clone", level, user, false, false, "Clone_Small_Shot", "Clone_Big_Shot"); },
		function(level, user){ return new HomingRocketWeapon(this.HOMING_ROCKET_WEAPON, "Homing", level, user, true); }
	];
	
	this.getInitializedWeapon = function(id, level, user, lastWeapon) {
		if(lastWeapon) lastWeapon.destroy();
		lastWeapon = this.weaponsTypes[id].call(this, level, user);
		lastWeapon.init(TopLevel.container);			
		return lastWeapon;
	};

	this.getWeapon = function(id, level, user) {
		var weapon = this.weaponsTypes[id](level, user);
		return weapon;
	};
}