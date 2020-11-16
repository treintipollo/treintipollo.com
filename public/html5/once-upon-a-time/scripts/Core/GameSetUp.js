function GameSetUp(mainGameSetUp) {
	this.focus = true;
	this.blur = true;
	this.tweensTimeLine = null;
	this.initialized = false;
	this.lastUpdate = Date.now();
	this.mainGameSetUp = mainGameSetUp;

	this.manualHardPause = false;

	this.manualSoftPause = false;
	this.wasInSoftPause = false;

	window.addEventListener("load", function() {
		var mainContainer = document.querySelector("#main");
		var canvas = document.querySelector("#game");

		window.addEventListener("resize", function() {
			resize(mainContainer, canvas);
		}, false);

		resize(mainContainer, canvas);

		function resize(container, canvas) {
			var scale = {
				x: 1,
				y: 1
			};

			scale.x = (window.innerWidth - 5) / canvas.width;
			scale.y = (window.innerHeight - 5) / canvas.height;

			if (scale.x < scale.y) {
				scale = scale.x + ", " + scale.x;
			} else {
				scale = scale.y + ", " + scale.y;
			}

			container.style.webkitTransform = "scale(" + scale + ")";
			container.style.mozTransform = "scale(" + scale + ")";
			container.style.msTransform = "scale(" + scale + ")";
			container.style.oTransform = "scale(" + scale + ")";
		}
	}, false);

	if (document.readyState === "complete") {
		var mainContainer = document.querySelector("#main");
		var canvas = document.querySelector("#game");

		window.addEventListener("resize", function() {
			resize(mainContainer, canvas);
		}, false);

		resize(mainContainer, canvas);

		function resize(container, canvas) {
			var scale = {
				x: 1,
				y: 1
			};

			scale.x = (window.innerWidth - 5) / canvas.width;
			scale.y = (window.innerHeight - 5) / canvas.height;

			if (scale.x < scale.y) {
				scale = scale.x + ", " + scale.x;
			} else {
				scale = scale.y + ", " + scale.y;
			}

			container.style.webkitTransform = "scale(" + scale + ")";
			container.style.mozTransform = "scale(" + scale + ")";
			container.style.msTransform = "scale(" + scale + ")";
			container.style.oTransform = "scale(" + scale + ")";
		}
	}
}

GameSetUp.prototype.setUp = function() {
	var frameRequest, mainLoop, mainLoopWrap;

	var self = this;

	var mainGameCreation = FuntionUtils.bindScope(self, function() {
		this.initialized = true;
		this.mainGameSetUp();
	});

	//Setting up the onBlur and onFocus events.
	//If the game is not initialized because it has no focus, these will be created anyway.
	//Once the document gains fucos, it will create the game, if it hasn"t so already.
	var onBlur = function(event) {
		if (self.blur) {
			self.blur = false;
			self.focus = true;

			TimeOutFactory.pauseAllTimeOuts();

			TweenLite.ticker.stopTick();

			ArrowKeyHandler.pause();

			SoundPlayer.pauseAll();

			if (!self.manualSoftPause) {
				window.cancelAnimationFrame(frameRequest);
			}
		}
	}

	var onFocus = function(event) {
		//A pause made manually can only be undone manually
		if (self.manualHardPause || self.manualSoftPause) {
			return;
		}

		//In the case the game is not already created when the document gains focus for the first time, it is created here.
		if (!self.initialized) {
			mainGameCreation();
		} else {
			if (self.focus) {
				self.blur = true;
				self.focus = false;

				TimeOutFactory.resumeAllTimeOuts();

				TweenLite.ticker.resumeTick();

				ArrowKeyHandler.resume();

				SoundPlayer.resumeAll();

				if (!self.wasInSoftPause) {
					lastTime = NaN;
					tickTimeTotal = 0;
					lastTickTime = NaN;

					frameRequest = window.requestAnimationFrame(mainLoop);
				} else {
					self.wasInSoftPause = true;
				}

			}
		}
	}
	
	$(window).on("blur", onBlur);
	$(window).on("focus", onFocus);

	if (document.hasFocus()) {
		mainGameCreation();

		var lastTime = NaN;
		var tickTime = 1000 / 60;
		var tickTimeTotal = 0;
		var lastTickTime = NaN;

		mainLoop = function(time)
		{
			frameRequest = window.requestAnimationFrame(mainLoop);

			if (!lastTime)
				lastTime = time;

			tickTimeTotal += time - lastTime;

			if (tickTimeTotal >= tickTime)
			{
				if (lastTickTime)
				{
					TopLevel.container.update((time - lastTickTime) / 1000, self.manualSoftPause);
				}
				else
				{
					TopLevel.container.update(tickTimeTotal / 1000, self.manualSoftPause);
				}

				lastTickTime = time;

				TopLevel.container.draw();

				tickTimeTotal -= tickTime;

				self.lastUpdate = time;
			}
			
			lastTime = time;
		}

		var vendors = ["ms", "moz", "webkit", "o"];

		for (var x = 0; x < vendors.length && !window.requestAnimationFrame; ++x) {
			window.requestAnimationFrame = window[vendors[x] + "RequestAnimationFrame"];
			window.cancelAnimationFrame = window[vendors[x] + "CancelAnimationFrame"] || window[vendors[x] + "CancelRequestAnimationFrame"];
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

GameSetUp.prototype.softPause = function() {
	this.manualSoftPause = true;
	this.wasInSoftPause = true;
	this.dispatchUIEvent("blur");
}

GameSetUp.prototype.softResume = function() {
	this.manualSoftPause = false;
	this.dispatchUIEvent("focus");
}

GameSetUp.prototype.hardPause = function() {
	this.manualHardPause = true;
	this.dispatchUIEvent("blur");
}

GameSetUp.prototype.hardResume = function() {
	this.manualHardPause = false;
	this.dispatchUIEvent("focus");
}

GameSetUp.prototype.dispatchUIEvent = function(event) {
	var evt = document.createEvent("UIEvents");
	evt.initUIEvent(event, true, true, window, 1);
	window.dispatchEvent(evt);
}