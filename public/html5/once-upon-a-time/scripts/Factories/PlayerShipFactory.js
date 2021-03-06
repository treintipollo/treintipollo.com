function PlayerShipFactory() {
	this.playerShipArguments = [];
	this.recreateTimer = null;
	this.playerActionsCallbacks = {};
	this.firstPosX = 0;
	this.firstPosY = 0;

	this.mainShipGender;
	this.currentShipType;

	this.init = function(onShipRecreated) {
		this.reset();

		this.recreateTimer = TimeOutFactory.getTimeOut(0, 1, this, function() {
			var allLivesLost = onShipRecreated();

			if (allLivesLost) {
				this.setStandardShip();
				this.createPlayerShip(this.firstPosX, this.firstPosY);
				TopLevel.animationActors.getIntroPartner();
			} else {
				this.createPlayerShipNoArgs();
			}
		});
	};

	this.firstShip = function(x, y) {
		this.firstPosX = x;
		this.firstPosY = y;

		this.setStandardShip();
		var ship = this.createPlayerShip(x, y);
		TopLevel.animationActors.getIntroPartner();

		if (!SoundPlayer.isPlaying("intro"))
			SoundPlayer.play("intro");

		return ship;
	};

	this.firstPowerShip = function(x, y) {
		this.firstPosX = x;
		this.firstPosY = y;

		this.setPowerShip(); 
		var ship = this.createPlayerShip(x, y);
		
		return ship;
	};

	this.createPlayerShipNoArgs = function() {
		this.setCallbacksToShip(TopLevel.container.add(this.currentShipType, this.playerShipArguments));
	};

	this.createPlayerShip = function(x, y) {
		this.playerShipArguments[0] = x;
		this.playerShipArguments[1] = y;
		this.playerShipArguments[2] = TopLevel.container;

		var ship = TopLevel.container.add(this.currentShipType, this.playerShipArguments);
		this.setCallbacksToShip(ship);

		return ship;
	};

	this.setMainShipGender = function(gender) {
		this.mainShipGender = gender;
	};

	this.setPowerShip = function() {
		this.currentShipType = "PowerShip";
	};

	this.setStandardShip = function() {
		this.currentShipType = "Ship";
	};

	this.reset = function() {
		this.mainShipGender = Ship.MALE;
		this.setStandardShip();
	}

	this.setCallbacksToShip = function(ship) {
		ship.gender = this.mainShipGender;

		ship.addOnDestroyCallback(this, function(obj) {
			this.playerShipArguments[0] = obj.x;
			this.playerShipArguments[1] = obj.y;

			this.recreateTimer.start();
		});

		for (var k in this.playerActionsCallbacks) {
			for (var i = 0; i < this.playerActionsCallbacks[k].length; i++) {
				var callbackObject = this.playerActionsCallbacks[k][i];
				
				if(!callbackObject)
					continue;

				ship[k](callbackObject.scope, callbackObject.callback, callbackObject.removeOnComplete);

				if(callbackObject.removeOnComplete){
					this.playerActionsCallbacks[k][i] = null;	
				}
			}
		}
	};

	this.addCallbacksToAction = function(actionName, callbacks) {
		if(!this.playerActionsCallbacks[actionName]){
			this.playerActionsCallbacks[actionName] = [];
		}
		
		this.playerActionsCallbacks[actionName] = this.playerActionsCallbacks[actionName].concat(callbacks);
	};
}