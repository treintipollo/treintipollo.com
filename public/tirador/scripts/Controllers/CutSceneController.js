CutSceneController.showSplash = true;
CutSceneController.hideSplash = true;

function CutSceneController() {
	ship = null;
	partner = null;
	badguy = null;
	bossArgs = null;

	shipInitX = 0;
	shipInitY = 0;

	partnerInitX = 0;
	partnerInitY = 0;

	badguyInitX = 0;
	badguyInitY = 0;

	transformX = 0;
	transformY = 0;

	mainShipGender = null; 
	partnerGender  = null;
	badguyGender   = null;

	this.getIntroPartner = function() {
		this.ship = TopLevel.playerData.ship;

		if (this.partner) return this.partner;

		this.partner = TopLevel.container.add("PartnerShip", [this.ship.x + 90, this.ship.y, TopLevel.container]);
		this.partner.weapon = TopLevel.weaponFactory.getInitializedWeapon(TopLevel.weaponFactory.SHOT_WEAPON, 0, this.partner, this.partner.weapon);

		this.partner.addCallback("onInitialPositionDelegate", this, function() {

			this.disablePlayerMovement();

			this.shipInitX = this.ship.x;
			this.shipInitY = this.ship.y;

			this.partnerInitX = this.partner.x;
			this.partnerInitY = this.partner.y;

			this.transformX = this.ship.x + 45;
			this.transformY = this.ship.y;

		});

		this.partner.addOnRecicleCallback(this, function() {
			this.partner = null;
		}, true);

		return this.partner;
	};

	this.getIntroBadguy = function() {
		this.ship = TopLevel.playerData.ship;

		if (this.badguy) return this.badguy;

		this.badguy = TopLevel.container.add("IntroBadGuy", [TopLevel.canvas.width / 2, TopLevel.canvas.height + 80, TopLevel.container, this.partner]);

		this.badguyGender = Random.getRandomBetweenToValues(Ship.FEMALE, Ship.MALE);
		this.badguy.gender = this.badguyGender;

		this.badguy.addOnRecicleCallback(this, function() {
			this.badguy = null;
		}, true);

		return this.badguy;
	};

	this.getFightBadguy = function(fightBadguyType) {
		if (!fightBadguyType) return;

		this.ship = TopLevel.playerData.ship;

		if (this.badguy) return this.badguy;

		this.partner = TopLevel.container.add("PartnerShip", [-100, -100, TopLevel.container, Exhaust.OFF]);

		if(this.partnerGender) {
			this.partner.gender = this.partnerGender;	
		}

		this.partner.addCallback("onInitialPositionDelegate", this, function() {
			this.partner.blockControls = true;
			this.partner.checkingCollisions = false;
			this.partner.rotation = 10;
		}, true);

		this.badguy = TopLevel.container.add(fightBadguyType, [TopLevel.canvas.width / 2, -80, TopLevel.container, this.partner, this.ship]);

		this.badguy.gender = this.badguyGender;

		this.badguy.addCallback("onInitialPositionDelegate", this, function() {
			this.badguyInitX = this.badguy.x;
			this.badguyInitY = this.badguy.y;
		}, true);

		this.badguy.addOnRecicleCallback(this, function() {
			this.badguy = null;
		}, true);

		return this.badguy;
	};

	this.moveToPosition = function(actor, endX, endY, ease, speed, onComplete) {
		var s = VectorUtils.getFullVectorInfo(actor.x, actor.y, endX, endY).distance / speed;
		TweenMax.to(actor, s, {x:endX, y:endY, ease:ease, onCompleteScope:this, onComplete:onComplete} );
		TweenMax.to(actor, 0.3, {rotation:0} );
	};

	this.getEnd_1_BadGuy = function(fightBadGuyType) {
		this.badguy = this.getFightBadguy(fightBadGuyType);

		this.badguy.addCallback("releasePartner", this, function() {
			this.disablePlayerMovement();

			this.ship.blockDamage = true;
			this.ship.weapon.stop();

			TimeOutFactory.getTimeOut(500, 1, this, function() {
				this.ship.setAllExhaustState(Exhaust.REGULAR);
				this.partner.setAllExhaustState(Exhaust.REGULAR);

				var moveAmount = 3;

				var onPositionReached = function() {
					moveAmount--;

					if(moveAmount <= 0){
						this.startTransformation();
					}
				}

				this.moveToPosition(this.badguy, this.badguyInitX, this.badguyInitY, Linear.easeNone, 100, onPositionReached);
				this.moveToPosition(this.ship, this.shipInitX, this.shipInitY, Linear.easeNone, 100, onPositionReached);
				this.moveToPosition(this.partner, this.partnerInitX, this.partnerInitY, Linear.easeNone, 100, onPositionReached);

			}, true).start();
		});

		return this.badguy;
	};

	this.getEnd_2_BadGuy = function(fightBadGuyType) {
		if(this.badguy)
			return this.badguy;

		this.badguy = TopLevel.container.add(fightBadGuyType, [TopLevel.canvas.width / 2, -80, TopLevel.container, null, this.ship]);

		this.badguy.updateAttributesToLastLevel();	

		this.badguy.addCallback("onInitialPositionDelegate", this, function() {
			var x = this.badguy.x;
			var y = this.badguy.y - 350;
			
			var powerUps = [{
					id: "BuyGuyHealthPowerUp",
					callback: function(powerUp) {
						TopLevel.textFeedbackDisplayer.showFeedBack("health", this.badguy.x, this.badguy.y);
						this.badguy.updateAttributesToMaxLevel();
					}
				}, {
					id: "BuyGuySpeedPowerUp",
					callback: function(powerUp) {
						TopLevel.textFeedbackDisplayer.showFeedBack("speed", this.badguy.x, this.badguy.y);

						this.badguy.setAllExhaustState(Exhaust.POWER_UP);

						TimeOutFactory.getTimeOut(2000, 1, this, function() {
							this.badguy.setAllExhaustState(Exhaust.FAST);
						}, true).start();
					}
				}, {
					id: "BuyGuyWeaponPowerUp",
					callback: function(powerUp) {
						TopLevel.textFeedbackDisplayer.showFeedBack("pUp", this.badguy.x, this.badguy.y);

						var pieceRight = TopLevel.container.add("BadGuyArmourPiece_Right", [this.badguy.x + 600, this.badguy.y - 5, this.badguy.rightAnchor.x, this.badguy.rightAnchor.y]);
						var pieceLeft = TopLevel.container.add("BadGuyArmourPiece_Left", [this.badguy.x - 600, this.badguy.y - 5, this.badguy.leftAnchor.x, this.badguy.leftAnchor.y]);

						pieceRight.addCallback("finishedIntro", this, function() {

							this.badguy.setArmourPieces(pieceRight, pieceLeft);
							this.badguy.startAttack();

							this.enablePlayerMovement(this.ship);
							this.ship.weapon.start();

						}, true);
					}
				}
			];

			var currentPowerUp = 0;

			TimeOutFactory.getTimeOut(2000, 3, this, function() {
				var powerUp = TopLevel.container.add(powerUps[currentPowerUp].id, [x, y, false]);
				powerUp.addOnCollideCallback(this, powerUps[currentPowerUp].callback, true);

				currentPowerUp++;
			}, true).start();

		}, true);

		this.badguy.addOnRecicleCallback(this, function() {
			this.badguy = null;

			var whiteFlash = new WhiteFlashContainer();

			this.disablePlayerMovement();
			this.ship.weapon.stop();

			TopLevel.playerShipFactory.setStandardShip();

			TopLevel.starFactory.speedDown();

			this.ship.setAllExhaustState(Exhaust.REGULAR);

			TopLevel.hudController.hide();

			TweenMax.to(this.ship, 4, {
				x: this.transformX,
				y: this.transformY,
				ease: Linear.easeNone,
				onCompleteScope: this,
				onComplete: function() {
					TimeOutFactory.getTimeOut(3000, 1, this, function() {

						var onMid = FuntionUtils.bindScope(this, function() {
							this.ship.x = this.shipInitX;
							this.ship.y = this.shipInitY;
							this.ship.alive = false;

							TopLevel.playerShipFactory.setMainShipGender(Ship.MALE);
							this.partnerGender = null;

							TopLevel.playerShipFactory.addCallbacksToAction("addInitCallback", [{
									scope: this,
									callback: function(obj) {
										this.ship = obj;
										this.partner = this.getIntroPartner();

										this.ship.weapon.stop();
										this.partner.weapon.stop();

										this.disablePlayerMovement();

										this.endSequence();
									},
									removeOnComplete: true
								}
							]);
						});
						
						whiteFlash.on(onMid, null, this.ship, 90);
					}, true).start();
				}
			});
		});

		return this.badguy;
	};

	this.getBoss = function(bossId) {
		this.ship = TopLevel.playerData.ship;

		if (!this.bossArgs) {
			this.bossArgs = [];
		}

		this.bossArgs[0] = TopLevel.canvas.width / 2;
		this.bossArgs[1] = -200;
		this.bossArgs[2] = this.ship;

		this.ship = TopLevel.playerData.ship;

		return TopLevel.container.add(bossId, this.bossArgs);
	},

	this.getMainBoss = function(bossId) {
		var boss = TopLevel.animationActors.getBoss(bossId);
		boss.gotoPosition(TopLevel.canvas.width / 2, TopLevel.canvas.height / 2 - 100, 3, function() {
			this.startAttack();
		}, null, true);
		return boss;
	};

	this.getMiniBossCenter = function(bossId) {
		var boss = TopLevel.animationActors.getBoss(bossId);
		boss.gotoPosition(TopLevel.canvas.width / 2, TopLevel.canvas.height / 2 - 200, 3, function() {
			this.startAttack();
		}, null, true);
		return boss;
	};

	this.getMiniBossRight = function(bossId) {
		var boss = TopLevel.animationActors.getBoss(bossId);
		boss.gotoPosition(TopLevel.canvas.width / 2 + 150, TopLevel.canvas.height / 2 - 150, 3, function() {
			this.startAttack();
		}, null, true);
		return boss;
	};

	this.getMiniBossLeft = function(bossId) {
		var boss = TopLevel.animationActors.getBoss(bossId);
		boss.gotoPosition(TopLevel.canvas.width / 2 - 150, TopLevel.canvas.height / 2 - 150, 3, function() {
			this.startAttack();
		}, null, true);
		return boss;
	};

	this.startTransformation = function() {
		var whiteFlash = new WhiteFlashContainer();

		TimeOutFactory.getTimeOut(500, 1, this, function() {
			TweenMax.to(this.ship, 1, {
				x: this.transformX,
				y: this.transformY,
				ease: Back.easeIn.config(10)
			});
			TweenMax.to(this.partner, 1, {
				x: this.transformX,
				y: this.transformY,
				ease: Back.easeIn.config(10),
				onCompleteScope: this,
				onComplete: function() {
					var onMid = FuntionUtils.bindScope(this, function() {
						this.ship.alive    = false;
						this.partner.alive = false;

						TopLevel.playerShipFactory.setPowerShip();

						TopLevel.playerShipFactory.addCallbacksToAction("addInitCallback", [{
						 		scope: this,
						 		callback: function(obj) {
						 			this.ship = obj;
						 			this.ship.weapon.stop();
						 			this.badguyEscapeAndPersue(this.ship);
						 		},
						 		removeOnComplete: true
						 	}
						]);

						this.ship = null;
						this.partner = null;
					});

					whiteFlash.on(onMid, null, this.ship, 90);
				}
			});

		}, true).start();
	};

	this.badguyEscapeAndPersue = function() {
		this.disablePlayerMovement(this.ship);
		this.badguy.currentMotion.set(this.badguy.IDLE_MOTION);

		TimeOutFactory.getTimeOut(500, 1, this, function() {
			this.badguy.escape();	
		}, true).start();

		this.badguy.addCallback("escapeComplete", this, function(){
			this.ship.setAllExhaustState(Exhaust.SLOW);

			var lastPosY = this.ship.y;
			var speedUp = false;

			TweenMax.to(this.ship, 2, {
				y: "-=50",
				ease: Back.easeIn.config(7),
				onUpdateScope: this,
				onCompleteScope: this,				
				onUpdate: function() {
					if (lastPosY > this.ship.y) {

						if(!speedUp){
							TopLevel.starFactory.speedUp();
						}

						this.ship.setAllExhaustState(Exhaust.FAST);
					}

					lastPosY = this.ship.y;
				}
			});
		}, true);
	}

	this.badGuyEscape = function() {
		this.ship = TopLevel.playerData.ship;

		this.partner.setAllExhaustState(Exhaust.OFF);
		this.partner.checkingCollisions = false;
		this.partner.rotation = 10;
		this.partner.weapon.stop();

		this.ship.blockControls = false;
		this.ship.weapon.start();

		this.badguy.fireRockets();
		this.badguy.escape();
	};

	this.disablePlayerMovement = function(playerShip) {
		if(!playerShip)
			this.ship = TopLevel.playerData.ship;

		if(this.ship)
			this.ship.blockControls = true;
		if(this.partner)
			this.partner.blockControls = true;
	};

	this.enablePlayerMovement = function(playerShip) {
		if(!playerShip)
			this.ship = TopLevel.playerData.ship;

		if(this.ship)
			this.ship.blockControls = false;
		if(this.partner)
			this.partner.blockControls = false;
	};

	this.showSplash = function() {
		var ship = this.ship;
		var splash;

		var self = this;

		if (CutSceneController.showSplash) {
			CutSceneController.showSplash = false;

			splash = TopLevel.container.add("Splash", [

			//Splash enter complete
			function() {

				var playerMarker = TopLevel.textFeedbackDisplayer.showFeedBack("playerMarker", ship.x, ship.y + 50);

				var swapShip = function() {
					var shipX = ship.x;
					var shipY = ship.y;

					var partnerX = TopLevel.animationActors.partner.x;
					var partnerY = TopLevel.animationActors.partner.y;

					ship.x = partnerX;
					ship.y = partnerY;

					playerMarker.x = ship.x;

					TopLevel.animationActors.partner.x = shipX;
					TopLevel.animationActors.partner.y = shipY;

					ship.swapSymbol();
					TopLevel.animationActors.partner.swapSymbol();
				}

				var leftCallback = ArrowKeyHandler.addKeyUpCallback(ArrowKeyHandler.LEFT, FuntionUtils.bindScope(this, swapShip));
				var rightCallback = ArrowKeyHandler.addKeyUpCallback(ArrowKeyHandler.RIGHT, FuntionUtils.bindScope(this, swapShip));

				ship.addFirstShotCallback(TopLevel, function(ship) {
					if (CutSceneController.hideSplash) {
						TopLevel.animationActors.mainShipGender = ship.gender; 
						TopLevel.animationActors.partnerGender  = TopLevel.animationActors.partner.gender;

						TopLevel.playerShipFactory.setMainShipGender(TopLevel.animationActors.mainShipGender);

						playerMarker.alive = false;

						ArrowKeyHandler.removeKeyUpCallback(ArrowKeyHandler.LEFT, leftCallback);
						ArrowKeyHandler.removeKeyUpCallback(ArrowKeyHandler.RIGHT, rightCallback);

						CutSceneController.hideSplash = false;
						splash.exit();
						splash = null;
					}
				});
			},

			//Splash exit complete
			function() {
				ship.destroyCallbacks("firstShotDelegate");
				self.introSequence();
			}]);

			splash.enter();

			TopLevel.animationActors.disablePlayerMovement();
		}
	}

	this.introSequence = function() {
		TimeOutFactory.getTimeOut(2000, 1, this, function() {
			var badGuy = TopLevel.animationActors.getIntroBadguy();

			badGuy.addCallback("tractorBeamComplete", this, function() {
				TopLevel.animationActors.badGuyEscape();
			}, true);

			badGuy.addCallback("escapeComplete", this, function() {
				TopLevel.gameModeController.startGame();
			}, true);

			badGuy.addCallback("onInitialPositionDelegate", this, function() {
				badGuy.tractorBeam.on();
			}, true);
		}, true).start();
	}

	this.endSequence = function() {
		TimeOutFactory.getTimeOut(2000, 1, this, function() {
			var badGuy = TopLevel.animationActors.getIntroBadguy();

			badGuy.addCallback("onInitialPositionDelegate", this, function() {
				TopLevel.game.pause();
			}, true);

		}, true).start();
	}

	this.reset = function() {
		this.ship     = null;
		this.partner  = null;
		this.badguy   = null;
		this.bossArgs = null;

		this.mainShipGender = null; 
		this.partnerGender  = null;

		CutSceneController.showSplash = true;
		CutSceneController.hideSplash = true;
	};
}