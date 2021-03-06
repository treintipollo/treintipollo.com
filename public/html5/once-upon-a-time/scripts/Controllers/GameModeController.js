function GameModeController() {

	var getFightBadGuy = FuntionUtils.bindScope(TopLevel.animationActors, TopLevel.animationActors.getFightBadguy);

	var getEnd_1_BadGuy = FuntionUtils.bindScope(TopLevel.animationActors, TopLevel.animationActors.getEnd_1_BadGuy);
	var getEnd_2_BadGuy = FuntionUtils.bindScope(TopLevel.animationActors, TopLevel.animationActors.getEnd_2_BadGuy);

	var getMainBoss = FuntionUtils.bindScope(TopLevel.animationActors, TopLevel.animationActors.getMainBoss);
	var getMiniBossCenter = FuntionUtils.bindScope(TopLevel.animationActors, TopLevel.animationActors.getMiniBossCenter);
	var getMiniBossRight = FuntionUtils.bindScope(TopLevel.animationActors, TopLevel.animationActors.getMiniBossRight);
	var getMiniBossLeft = FuntionUtils.bindScope(TopLevel.animationActors, TopLevel.animationActors.getMiniBossLeft);

	var maleModeBossConfiguration = function() {
		return [
		{
			sub: getBoss("Middle_1_BadGuy", null, null, getFightBadGuy),
			main: getBoss("Boss_1_A", "warning", "boom", getMainBoss),
			next: false,
			last: false,
			drop: "MultiWeaponPowerUp"
		},

		{
			sub: getBoss("Middle_2_BadGuy", null, null, getFightBadGuy),
			main: getBoss("Boss_1_B", "warning", "boom", getMainBoss),
			next: false,
			last: false,
			drop: "MultiWeaponPowerUp"
		},

		{
			sub: getBoss("Middle_1_BadGuy", null, null, getFightBadGuy),
			main: getBoss("Boss_1_C", "warning", "boom", getMainBoss),
			next: false,
			last: false,
			drop: "MultiWeaponPowerUp"
		},

		{
			sub: getBoss("Middle_2_BadGuy", null, null, getFightBadGuy),
			main: getBoss("Boss_1_D", "warning", "boom", getMainBoss),
			next: false,
			last: false,
			drop: "LivesPowerUp"
		},

		{
			sub: getBoss("Middle_3_BadGuy", null, null, getFightBadGuy),
			main: getBoss("Boss_1_F", "warning", "boom", getMainBoss),
			next: false,
			last: false,
			drop: "HPPowerUp"
		},

		{
			sub: getBoss("End_1_BadGuy", null, null, getEnd_1_BadGuy),
			main: getBoss("End_2_BadGuy", "ready", "victory", getEnd_2_BadGuy),
			next: false,
			last: true,
			drop: null
		}];
	};

	var femaleModeBossConfiguration = function() {
		return [
		{
			sub: getBoss("Middle_1_BadGuy", null, null, getFightBadGuy),
			main: getBoss("Boss_1_A", "warning", "boom", getMainBoss),
			next: false,
			last: false,
			drop: "MultiWeaponPowerUp"
		},

		{
			sub: getBoss("Middle_3_BadGuy", null, null, getFightBadGuy),
			main: getBoss("Boss_1_B", "warning", "boom", getMainBoss),
			next: false,
			last: false,
			drop: "MultiWeaponPowerUp"
		},

		{
			sub: getBoss(null, null, null, null),
			main: getBoss("SubBoss_2", "warning", "nice", getMiniBossRight),
			next: true,
			last: false,
			drop: "MultiWeaponPowerUp"
		},

		{
			sub: getBoss("Middle_1_BadGuy", null, null, getFightBadGuy),
			main: getBoss("SubBoss_2", "warning", "nice", getMiniBossLeft),
			next: false,
			last: false,
			drop: "MultiWeaponPowerUp"
		},

		{
			sub: getBoss(null, null, null, null),
			main: getBoss("SubBoss_1", "warning", "nice", getMiniBossRight),
			next: true,
			last: false,
			drop: "HPPowerUp"
		},

		{
			sub: getBoss(null, null, null, null),
			main: getBoss("SubBoss_1", "warning", "nice", getMiniBossLeft),
			next: true,
			last: false,
			drop: "HPPowerUp"
		},

		{
			sub: getBoss("Middle_2_BadGuy", null, null, getFightBadGuy),
			main: getBoss("SubBoss_3", "warning", "nice", getMiniBossCenter),
			next: false,
			last: false,
			drop: "MultiWeaponPowerUp"
		},

		{
			sub: getBoss("Middle_3_BadGuy", null, null, getFightBadGuy),
			main: getBoss("Boss_1_E", "warning", "boom", getMainBoss),
			next: false,
			last: false,
			drop: "MultiWeaponPowerUp"
		},

		{
			sub: getBoss("End_1_BadGuy", null, null, getEnd_1_BadGuy),
			main: getBoss("End_2_BadGuy", "ready", "victory", getEnd_2_BadGuy),
			next: false,
			last: true,
			drop: null
		}];
	};

	var maleModeRocketConfiguration = function() {
		//First Set
		TopLevel.rocketFactory.addWave(
			"Small_EnemyRocket_1,Small_EnemyRocket_1,Small_EnemyRocket_1,Small_EnemyRocket_2,Small_EnemyRocket_3",
			25, // rockets in wave
			-50, 200, 350, 800,
			5, // rockets to power up
			false,
			"SpeedPowerUp,WeaponPowerUp,SpeedPowerUp,WeaponPowerUp"
		);
		
		TopLevel.rocketFactory.addWave(
			"CargoShip",
			1,
			TopLevel.canvas.height + 50, -50, -70, 600,
			10,
			false,
			"HPPowerUp"
		);

		TopLevel.rocketFactory.addWave(
			"Small_EnemyRocket_1,Small_EnemyRocket_1,Small_EnemyRocket_1,Small_EnemyRocket_2,Small_EnemyRocket_3",
			10, // rockets in wave
			-50, 200, 350, 800,
			3, // rockets to power up
			false,
			"WeaponPowerUp"
		);
		
		TopLevel.rocketFactory.addWave(
			"Small_EnemyRocket_1,Small_EnemyRocket_1,Small_EnemyRocket_1,Small_EnemyRocket_2,Small_EnemyRocket_3",
			25,
			-50, 200, 350, 800,
			5,
			true,
			"WeaponPowerUp,WeaponPowerUp,MultiWeaponPowerUp"
		);

		//Second Set
		
		TopLevel.rocketFactory.addWave(
			"Small_EnemyRocket_1,Small_EnemyRocket_3,Mid_EnemyRocket_1,Mid_EnemyRocket_2,Mid_EnemyRocket_3",
			30,
			-50, 100, 500, 600,
			7,
			false,
			"MultiWeaponPowerUp,SpeedPowerUp,WeaponPowerUp"
		);
		
		TopLevel.rocketFactory.addWave(
			"CargoShip",
			1,
			TopLevel.canvas.height + 50, -90, -100, 600,
			7,
			false,
			"HPPowerUp"
		);

		TopLevel.rocketFactory.addWave(
			"Small_EnemyRocket_1,Small_EnemyRocket_3,Mid_EnemyRocket_1,Mid_EnemyRocket_2,Mid_EnemyRocket_3",
			5,
			-50, 100, 500, 600,
			3,
			false,
			"WeaponPowerUp"
		);
		
		TopLevel.rocketFactory.addWave(
			"Small_EnemyRocket_1,Small_EnemyRocket_3,Mid_EnemyRocket_1,Mid_EnemyRocket_2,Mid_EnemyRocket_3",
			30,
			-50, 100, 500, 600,
			7,
			true,
			"WeaponPowerUp"
		);

		//Third Set
		TopLevel.rocketFactory.addWave(
			"Small_EnemyRocket_1,Small_EnemyRocket_2,Large_EnemyRocket_1,Large_EnemyRocket_2,Large_EnemyRocket_3",
			30,
			-50, 100, 200, 500,
			7,
			false,
			"MultiWeaponPowerUp"
		);
		
		TopLevel.rocketFactory.addWave(
			"CargoShip",
			1,
			TopLevel.canvas.height + 50, -200, -250, 600,
			10,
			false,
			"HPPowerUp"
		);

		TopLevel.rocketFactory.addWave(
			"Small_EnemyRocket_1,Small_EnemyRocket_2,Large_EnemyRocket_1,Large_EnemyRocket_2,Large_EnemyRocket_3",
			5,
			-50, 100, 200, 500,
			3,
			false,
			"WeaponPowerUp"
		);
		
		TopLevel.rocketFactory.addWave(
			"Small_EnemyRocket_1,Small_EnemyRocket_2,Large_EnemyRocket_1,Large_EnemyRocket_2,Large_EnemyRocket_3",
			30,
			-50, 100, 500, 500,
			7,
			true,
			"WeaponPowerUp,SpeedPowerUp"
		);
	};

	var getBoss = function(id, intro, win, getFunc) {
		return {
			id: id,
			intro: intro,
			win: win,
			get: getFunc
		};
	};

	//----------------------------------//
	//--------- MAIN GAME MODE ---------//
	//----------------------------------//
	this.mainGameMode = function(bossesGetter, rocketsSetter) {
		return {

			bossesGetter: bossesGetter,
			rocketsSetter: rocketsSetter,

			setUpGame: function() {
				var bossDrops = {};
				var currentBoss = -1;

				var bosses = this.bossesGetter();
				this.rocketsSetter();

				TopLevel.rocketFactory.onWaveComplete = FuntionUtils.bindScope(this, function() {
					var bossesCreated = 0;

					var createSubBossIntro = function(bossInit) {
						if (bossInit.next) return;

						if (!bossInit.sub) {
							createBossIntro(bossInit);
							return;
						}

						var intro = TopLevel.textFeedbackDisplayer.showFeedBack(bossInit.sub.intro, -200, TopLevel.canvas.height / 2);

						if (intro) {
							intro.addOnDestroyCallback(this, function() {
								createSubBoss(bossInit);
							});
						} else {
							createSubBoss(bossInit);
						}
					};

					var createSubBoss = function(bossInit) {
						bossInit.sub.get(bossInit.sub.id).addOnRecicleCallback(this, function() {

							var win = TopLevel.textFeedbackDisplayer.showFeedBack(bossInit.sub.win, -200, TopLevel.canvas.height / 2);

							if (win) {
								win.addOnDestroyCallback(this, function() {
									createBossIntro(bossInit);
								});
							} else {
								createBossIntro(bossInit);
							}

						}, true);
					};

					var createBossIntro = function(bossInit) {
						if (!bossInit.main) return;
						if (bossInit.next) return;

						var intro = TopLevel.textFeedbackDisplayer.showFeedBack(bossInit.main.intro, -200, TopLevel.canvas.height / 2);

						if (intro) {
							intro.addOnDestroyCallback(this, function() {
								createBoss(bossInit);
							});
						} else {
							createBoss(bossInit);
						}
					};

					var createBoss = function(bossInit) {
						if (bossInit.next) return;

						var onBossDestroy = function(obj) {
							TopLevel.powerUpFactory.create(obj.x, obj.y, bossDrops[obj.typeId].pop(), 1, false);

							bossesCreated--;
							if (bossesCreated <= 0) {
								var win = TopLevel.textFeedbackDisplayer.showFeedBack(bossInit.main.win, -200, TopLevel.canvas.height / 2);

								win.addOnDestroyCallback(this, function() {
									if (!bossInit.last) {
										TopLevel.playerData.increaseStage();
										TopLevel.rocketFactory.start();
									}
								});
							}
						}

						var currentBossIndex = currentBoss;

						do {
							if (!bosses[currentBossIndex].main) {
								bossesCreated--;
								currentBossIndex--;
								continue;
							}

							var boss = bosses[currentBossIndex].main.get(bosses[currentBossIndex].main.id);

							if (!bossDrops[boss.typeId]) {
								bossDrops[boss.typeId] = [];
							}

							bossDrops[boss.typeId].push(bosses[currentBossIndex].drop);

							boss.addOnDestroyCallback(this, onBossDestroy);

							currentBossIndex--;

						} while (currentBossIndex >= 0 && bosses[currentBossIndex].next)
					};

					do {
						currentBoss++;
						bossesCreated++;
						currentBoss = currentBoss >= bosses.length ? 0 : currentBoss;

						createSubBossIntro(bosses[currentBoss]);

					} while (bosses[currentBoss].next);
				});
			},

			start: function() {
				TopLevel.rocketFactory.start();
			}
		}
	};

	this.gameModes = [];

	this.gameModes.push(this.mainGameMode(femaleModeBossConfiguration, maleModeRocketConfiguration));
	this.gameModes.push(this.mainGameMode(maleModeBossConfiguration, maleModeRocketConfiguration));
}

GameModeController.prototype.startGame = function() {
	this.gameModes[TopLevel.animationActors.ship.gender].setUpGame();
	this.gameModes[TopLevel.animationActors.ship.gender].start();
}