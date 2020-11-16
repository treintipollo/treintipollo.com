function PowerUpConfiguration() {}

PowerUpConfiguration.prototype.setUp = function() {
	TopLevel.powerUpFactory.addPowerUpTypes("ShotPowerUp", [ 
		{scope:TopLevel.playerData			 , callback:function(powerUp){ this.setWeapon(TopLevel.weaponFactory.SHOT_WEAPON); } },
		{scope:TopLevel.textFeedbackDisplayer, callback:function(powerUp){ this.showFeedBack("shot", TopLevel.playerData.ship.x, TopLevel.playerData.ship.y ); } }
	]);

	TopLevel.powerUpFactory.addPowerUpTypes("RocketPowerUp", [
		{scope:TopLevel.playerData			 , callback:function(powerUp) {
			this.setSecondaryWeapon(TopLevel.weaponFactory.ROCKET_WEAPON);
			this.secondaryWeaponAmmo("large");
		}},
		{scope:TopLevel.textFeedbackDisplayer, callback:function(powerUp){ this.showFeedBack("rockets", TopLevel.playerData.ship.x, TopLevel.playerData.ship.y ); } }
	]); 

	TopLevel.powerUpFactory.addPowerUpTypes("HomingRocketPowerUp", [
		{scope:TopLevel.playerData			 , callback:function(powerUp) {
			this.setSecondaryWeapon(TopLevel.weaponFactory.HOMING_ROCKET_WEAPON);
			this.secondaryWeaponAmmo("large");
		}},
		{scope:TopLevel.textFeedbackDisplayer, callback:function(powerUp){ this.showFeedBack("homing", TopLevel.playerData.ship.x, TopLevel.playerData.ship.y ); } }
	]);
	
	TopLevel.powerUpFactory.addPowerUpTypes("WeaponPowerUp", [
		{scope:TopLevel.playerData			 , callback:function(powerUp) {
			this.powerUpWeapon("small");
			this.secondaryWeaponAmmo("small");
		}},
		{scope:TopLevel.textFeedbackDisplayer, callback:function(powerUp){ this.showFeedBack("pUp", TopLevel.playerData.ship.x, TopLevel.playerData.ship.y ); } }
	]);

	TopLevel.powerUpFactory.addPowerUpTypes("HPPowerUp", [
		{scope:TopLevel.playerData			 , callback:function(powerUp){ this.increaseHP(); } },
		{scope:TopLevel.textFeedbackDisplayer, callback:function(powerUp){ this.showFeedBack("health", TopLevel.playerData.ship.x, TopLevel.playerData.ship.y ); } }
	]);

	TopLevel.powerUpFactory.addPowerUpTypes("SpeedPowerUp", [
		{scope:TopLevel.playerData			 , callback:function(powerUp){ this.increaseSpeed(); } },
		{scope:TopLevel.textFeedbackDisplayer, callback:function(powerUp){ this.showFeedBack("speed", TopLevel.playerData.ship.x, TopLevel.playerData.ship.y ); } }
	]);

	TopLevel.powerUpFactory.addPowerUpTypes("LivesPowerUp", [
		{scope:TopLevel.playerData			 , callback:function(powerUp){ this.increaseLives(); } },
		{scope:TopLevel.textFeedbackDisplayer, callback:function(powerUp){ this.showFeedBack("1up", TopLevel.playerData.ship.x, TopLevel.playerData.ship.y ); } }
	]);

	//This implementation of multi purpose powerups almost defeats of the purpose of the previous callback structure. Almost :P
	TopLevel.powerUpFactory.addMultiPowerUpType("MultiWeaponPowerUp", "MultiPowerUp",
		[{id:"ShotPowerUp"  , pro:ShotPowerUp.prototype},
		 {id:"RocketPowerUp", pro:RocketPowerUp.prototype},
		 {id:"HomingPowerUp", pro:HomingRocketPowerUp.prototype}],

		[{scope:TopLevel.playerData, callback:function(powerUp) {
			if(powerUp.id == "ShotPowerUp") {
				this.setWeapon(TopLevel.weaponFactory.SHOT_WEAPON);
			}
			if(powerUp.id == "RocketPowerUp") {
				this.setSecondaryWeapon(TopLevel.weaponFactory.ROCKET_WEAPON);
				this.secondaryWeaponAmmo("large");
			}
			if(powerUp.id == "HomingPowerUp") {
				this.setSecondaryWeapon(TopLevel.weaponFactory.HOMING_ROCKET_WEAPON);
				this.secondaryWeaponAmmo("large");
			}
		} },
		{scope:TopLevel.textFeedbackDisplayer, callback:function(powerUp){  
			if(powerUp.id == "ShotPowerUp"){ this.showFeedBack("shot", TopLevel.playerData.ship.x, TopLevel.playerData.ship.y ); }
			if(powerUp.id == "RocketPowerUp"){ this.showFeedBack("rockets", TopLevel.playerData.ship.x, TopLevel.playerData.ship.y ); }
			if(powerUp.id == "HomingPowerUp"){ this.showFeedBack("homing", TopLevel.playerData.ship.x, TopLevel.playerData.ship.y ); }
		} }]
	);
}