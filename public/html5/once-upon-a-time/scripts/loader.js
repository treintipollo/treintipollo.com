(function()
{
	var loadData = {
		"scripts": [
			{ path: "libs/jquery-1.8.3.min.js" },
			{ path: "libs/TweenMax.js" },
			{ path: "libs/TimelineLite.min.js" },
			{ path: "libs/BezierPlugin.min.js" },
			{ path: "libs/ColorPropsPlugin.min.js" },
			{ path: "libs/ShortRotationPlugin.js" },
			{ path: "libs/SAT.js"},
			{ path: "scripts/Core/TimeOutFactory.js" },
			{ path: "scripts/Core/CoreUtils.js" },
			{ path: "scripts/Core/GameObject.js" },
			{ path: "scripts/Core/ObjectsContainer.js" },
			{ path: "scripts/Core/StateMachine.js" },
			{ path: "scripts/Core/GameSetUp.js" },
			{ path: "scripts/Core/ArrowKeyHandler.js" },
			{ path: "scripts/Core/SoundPlayer.js" },
			{ path: "scripts/Utilities/MiscMethodsUtils.js" },
			{ path: "scripts/Utilities/GameObjectsUtils.js" },
			{ path: "scripts/Weapons/Weapon.js" },
			{ path: "scripts/Weapons/ShotWeapon.js" },
			{ path: "scripts/Weapons/RocketWeapon.js" },
			{ path: "scripts/Weapons/HomingRocketWeapon.js" },
			{ path: "scripts/Weapons/PowerBeamWeapon.js" },
			{ path: "scripts/GameData/Attributes.js" },
			{ path: "scripts/GameData/AttributesGetter.js" },
			{ path: "scripts/GameObjects/Player/Ship.js" },
			{ path: "scripts/GameObjects/Player/PowerShip.js" },
			{ path: "scripts/GameObjects/Player/Rocket.js" },
			{ path: "scripts/GameObjects/Player/Shot.js" },
			{ path: "scripts/GameObjects/Player/PowerShot.js" },
			{ path: "scripts/GameObjects/Player/Target.js" },
			{ path: "scripts/GameObjects/PowerUps/PowerUps.js" },
			{ path: "scripts/GameObjects/Text/GameText.js" },
			{ path: "scripts/GameObjects/Text/Splash.js" },
			{ path: "scripts/GameObjects/Text/EndingMessage.js" },
			{ path: "scripts/GameObjects/Transitions/FadeToBlack.js" },
			{ path: "scripts/GameObjects/Scenario/Star.js" },
			{ path: "scripts/GameObjects/Misc/Debry.js" },
			{ path: "scripts/GameObjects/Misc/Explosion.js" },
			{ path: "scripts/GameObjects/Misc/BeamCollider.js" },
			{ path: "scripts/GameObjects/Misc/BadGuyArmourPiece.js" },
			{ path: "scripts/GameObjects/Enemies/BadGuyRockets.js" },
			{ path: "scripts/GameObjects/Enemies/EnemyRocket.js" },
			{ path: "scripts/GameObjects/Enemies/Fireball.js" },
			{ path: "scripts/GameObjects/Enemies/CloneShip.js" },
			{ path: "scripts/GameObjects/Enemies/CargoShip.js" },
			{ path: "scripts/GameObjects/Bosses/BadGuy.js" },
			{ path: "scripts/GameObjects/Bosses/Boss_1.js" },
			{ path: "scripts/Factories/EnemyRocketFactory.js" },
			{ path: "scripts/Factories/StarFactory.js" },
			{ path: "scripts/Factories/PlayerShipFactory.js" },
			{ path: "scripts/Factories/PowerUpFactory.js" },
			{ path: "scripts/Factories/WeaponFactory.js" },
			{ path: "scripts/Controllers/HudController.js" },
			{ path: "scripts/Controllers/PlayerController.js" },
			{ path: "scripts/Controllers/CutSceneController.js" },
			{ path: "scripts/Controllers/GameModeController.js" },
			{ path: "scripts/Creation/PoolCreator.js" },
			{ path: "scripts/Creation/ConfigurationCreator.js" },
			{ path: "scripts/Creation/TextConfigurationCreator.js" },
			{ path: "scripts/Creation/CollisionPairCreator.js" },
			{ path: "scripts/Creation/AttributeCreator.js" },
			{ path: "scripts/Configuration/PlayerShipFactoryConfiguration.js" },
			{ path: "scripts/Configuration/PowerUpConfiguration.js" },
			{ path: "scripts/GameData/Boss_1_ConfigurationGetter.js" },
			{ path: "scripts/Effects/Exhaust.js" },
			{ path: "scripts/Effects/ParticleBeam.js" },
			{ path: "scripts/Effects/ShotCharge.js" },
			{ path: "scripts/Effects/StraightBeam.js" },
			{ path: "scripts/Effects/Particles.js" },
			{ path: "scripts/Effects/ExplosionsArea.js" },
			{ path: "scripts/Effects/BloodStream.js" },
			{ path: "scripts/Effects/WhiteFlash.js" },
			{ path: "scripts/Effects/MultiGun.js" },
			{ path: "scripts/Effects/TractorBeam.js" },
			{ path: "scripts/Effects/BezierParticleBeam.js" },
			{ path: "scripts/main.js" }
		]
	}

	var updateLoadingStatus = function()
	{
		downloadAmount += chunck;

		var element = document.querySelector(".loader");
		element.textContent = `Loading... ${parseInt(downloadAmount)}%`;
	};

	var totalDownloads = 0;

	for (var key in loadData)
		totalDownloads += loadData[key].length;

	var chunck = 100 / totalDownloads;
	var downloadAmount = 0;
	
	var files = loadData["scripts"];
	var body = document.getElementsByTagName("body")[0];

	for (var i = 0; i < files.length; i++) {
		var file = files[i];
		
		var s = document.createElement("script");

		s.type = "text/javascript"
		s.src = file.path;
		s.async = false;

		s.onload = function()
		{
			updateLoadingStatus();

			totalDownloads--;

			if (totalDownloads == 0) {
				var element = document.querySelector(".loader");
				element.remove();
			}
		}

		body.appendChild(s);
	}
})();

