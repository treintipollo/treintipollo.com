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

		this.partner.addCallback("onInitialPositionDelegate", this, function() {
			this.partner.blockControls = true;
			this.partner.checkingCollisions = false;
			this.partner.rotation = 10;
		}, true);

		this.badguy = TopLevel.container.add(fightBadguyType, [TopLevel.canvas.width / 2, -80, TopLevel.container, this.partner, this.ship]);

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

		this.badguy.addCallback("onInitialPositionDelegate", this, function() {
			this.ship.weapon.start();
		}, true);

		this.badguy.addOnRecicleCallback(this, function() {
			this.badguy = null;
		}, true);

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
				},
				onComplete: function() {
					this.enablePlayerMovement(this.ship);
				}
			});
		});
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

		if (CutSceneController.showSplash) {
			CutSceneController.showSplash = false;

			splash = TopLevel.container.add("Splash", [

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
				}

				var leftCallback = ArrowKeyHandler.addKeyUpCallback(ArrowKeyHandler.LEFT, FuntionUtils.bindScope(this, swapShip));
				var rightCallback = ArrowKeyHandler.addKeyUpCallback(ArrowKeyHandler.RIGHT, FuntionUtils.bindScope(this, swapShip));

				ship.addFirstShotCallback(TopLevel, function(ship) {
					if (CutSceneController.hideSplash) {

						playerMarker.alive = false;

						ArrowKeyHandler.removeKeyUpCallback(ArrowKeyHandler.LEFT, leftCallback);
						ArrowKeyHandler.removeKeyUpCallback(ArrowKeyHandler.RIGHT, rightCallback);

						CutSceneController.hideSplash = false;
						splash.exit();
						splash = null;
					}
				});
			},

			function() {
				ship.destroyCallbacks("firstShotDelegate");

				introSequence();
			}]);

			splash.enter();

			TopLevel.animationActors.disablePlayerMovement();
		}

		var introSequence = function() {
		TimeOutFactory.getTimeOut(2000, 1, this, function() {
			var badGuy = TopLevel.animationActors.getIntroBadguy();

			badGuy.addCallback("tractorBeamComplete", this, function(){
				TopLevel.animationActors.badGuyEscape();
			}, true);

			badGuy.addCallback("escapeComplete", this, function(){
				TopLevel.rocketFactory.start();
			}, true);

			badGuy.addCallback("onInitialPositionDelegate", this, function(){
				badGuy.tractorBeam.on();
			}, true);
		}, true).start();
	}
	}

	this.reset = function() {
		this.ship     = null;
		this.partner  = null;
		this.badguy   = null;
		this.bossArgs = null;

		CutSceneController.showSplash = true;
		CutSceneController.hideSplash = true;
	};
}