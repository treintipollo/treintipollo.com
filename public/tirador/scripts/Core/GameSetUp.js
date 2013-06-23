function GameSetUp(mainGameSetUp) {
	this.focus = true;
	this.blur = true;
	this.tweensTimeLine = null;
	this.initialized = false;
	this.lastUpdate = Date.now();
	this.mainGameSetUp = mainGameSetUp;

	this.createMainGame();
}

GameSetUp.prototype.createMainGame = function() {
	var frameRequest, mainLoop;

	var self = this;

	var mainGameCreation = FuntionUtils.bindScope(self, function() {
		this.initialized = true;
		this.mainGameSetUp();
	});


	//Setting up the onBlur and onFocus events.
	//If the game is not initialized because it has no focus, these will be created anyway.
	//Once the document gains fucos, it will create the game, if it hasn't so already.
	var onBlur = function(event) {
		if (self.blur) {
			self.blur = false;
			self.focus = true;

			TimeOutFactory.pauseAllTimeOuts();

			self.tweensTimeLine = TimelineLite.exportRoot();
			self.tweensTimeLine.pause();

			ArrowKeyHandler.pause();

			window.cancelAnimationFrame(frameRequest);
		}
	}

	var onFocus = function(event) {
		//In the case the game is not already created when the document gains focus for the first time, it is created here.
		if (!self.initialized) {
			mainGameCreation();

		} else {
			if (self.focus) {
				self.blur = true;
				self.focus = false;

				TimeOutFactory.resumeAllTimeOuts();

				if (self.tweensTimeLine) self.tweensTimeLine.resume();

				ArrowKeyHandler.resume();

				frameRequest = window.requestAnimationFrame(mainLoop);
			}
		}
	}

	$(window).on("blur", onBlur);
	$(window).on("focus", onFocus);

	if (document.hasFocus()) {
		mainGameCreation();

		mainLoop = function() {
			var now = Date.now();
			var dt = now - self.lastUpdate;
			self.lastUpdate = now;

			if (dt < 30) {
				TopLevel.container.update(dt / 1000);
				TopLevel.container.draw();
			}

			frameRequest = window.requestAnimationFrame(mainLoop);
		}

		var vendors = ['ms', 'moz', 'webkit', 'o'];

		for (var x = 0; x < vendors.length && !window.requestAnimationFrame; ++x) {
			window.requestAnimationFrame = window[vendors[x] + 'RequestAnimationFrame'];
			window.cancelAnimationFrame = window[vendors[x] + 'CancelAnimationFrame'] || window[vendors[x] + 'CancelRequestAnimationFrame'];
		}

		if (!window.requestAnimationFrame) {
			window.requestAnimationFrame = function(callback) {
				return window.setTimeout(callback, 1000 / 60);;
			};
		}

		if (!window.cancelAnimationFrame) {
			window.cancelAnimationFrame = function(id) {
				clearTimeout(id);
			};
		}

		frameRequest = window.requestAnimationFrame(mainLoop);
	}
}

GameSetUp.prototype.pause = function() {
	var evt = document.createEvent("UIEvents");
	evt.initUIEvent("blur", true, true, window, 0, 0, 0, 0, 0, false, false, false, false, 0, null);
	window.dispatchEvent(evt);
}

GameSetUp.prototype.resume = function() {
	var evt = document.createEvent("UIEvents");
	evt.initUIEvent("focus", true, true, window, 0, 0, 0, 0, 0, false, false, false, false, 0, null);
	window.dispatchEvent(evt);
}