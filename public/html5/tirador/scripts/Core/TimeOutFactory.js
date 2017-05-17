$(function() {
	var TimeOutFactory = {

		scopeTimeOuts: {},

		getTimeOut: function(delay, repeatCount, scope, callback, removeOnComplete) {
			var self = this;

			var timeOutObject = {
				callback: callback,
				scope: scope,

				_delay: delay,
				repeateCount: repeatCount,

				removeOnComplete: removeOnComplete,
				onComplete: null,

				initDelay: delay,
				initRepeatCount: repeatCount,

				repeates: 0,
				id: -1,
				startTime: -1,
				pauseTime: -1,
				isRunning: false,
				isPaused: false,

				startNewDelayAndRepeateCount: function(delay, repeateCount) {
					this._delay = delay;
					this.initDelay = delay;
					this.repeateCount = repeateCount;
					this.initRepeatCount = repeateCount;

					this.start();
				},

				resetNewDelayAndRepeateCount: function(delay, repeateCount) {
					this.stop();
					this.startNewDelayAndRepeateCount(delay, repeateCount);
				},

				start: function(resumeTime) {
					if (this.isRunning || this.isPaused) {
						return;
					}

					this.startTime = Date.now();

					this.isRunning = true;
					this.isPaused = false;

					var actualDelay = resumeTime ? resumeTime : this.initDelay;

					var to = this;

					this.id = setTimeout(function() {
						if (to.isRunning && !to.isPaused) {
							if (to.callback) {
								to.callback.call(to.scope, to.repeates);
								to.repeates++;
							}
						} else {
							return;
						}

						if (to.repeateCount < 0) {
							to.isRunning = false;
							to._delay = to.initDelay;
							to.start();
						} else {
							to.repeateCount--;

							if (to.repeateCount > 0) {
								to.isRunning = false;
								to._delay = to.initDelay;
								to.start();
							} else {
								to.stop();

								if (to.onComplete != null) {
									to.onComplete.call(to.scope);
								}
								if (to.removeOnComplete) {
									to.remove();
								}
							}
						}

					}, actualDelay);

					return this;
				},

				stop: function() {
					clearTimeout(this.id);

					this.isRunning = false;
					this.isPaused = false;
					this.repeateCount = this.initRepeatCount;
					this._delay = this.initDelay;
					this.repeates = 0;
				},

				reset: function() {
					this.stop();
					this.start();
				},

				resetAndExecuteCallback: function() {
					this.callback.call(this.scope);
					this.stop();
					this.start();
				},

				pause: function() {
					if (!this.isRunning) {
						return;
					}

					clearTimeout(this.id);
					this.pauseTime = Date.now();
					this.isRunning = false;
					this.isPaused = true;
				},

				resume: function() {
					if (!this.isRunning && !this.isPaused) {
						return;
					}

					this.isPaused = false;
					this._delay -= (this.pauseTime - this.startTime);
					this.start(this._delay);
				},

				remove: function() {
					this.stop();
					self.scopeTimeOuts[this.scope].splice(self.scopeTimeOuts[this.scope].indexOf(this), 1);
				}
			};

			if (!this.scopeTimeOuts[scope]) {
				this.scopeTimeOuts[scope] = [];
			}

			this.scopeTimeOuts[scope].push(timeOutObject);

			Object.defineProperty(timeOutObject, "delay", {
				get: function() {
					return this.initDelay
				},
				set: function(v) {
					this._delay = v;
					this.initDelay = v;
				}
			});

			return timeOutObject;
		},

		stopAllTimeOuts: function() {
			for (var k in this.scopeTimeOuts) {
				for (var i = 0; i < this.scopeTimeOuts[k].length; i++) {
					this.scopeTimeOuts[k][i].stop();
				}
			}
		},

		pauseAllTimeOuts: function() {
			for (var k in this.scopeTimeOuts) {
				for (var i = 0; i < this.scopeTimeOuts[k].length; i++) {
					this.scopeTimeOuts[k][i].pause();
				}
			}
		},

		resumeAllTimeOuts: function() {
			for (var k in this.scopeTimeOuts) {
				for (var i = 0; i < this.scopeTimeOuts[k].length; i++) {
					this.scopeTimeOuts[k][i].resume();
				}
			}
		},

		removeAllTimeOuts: function() {
			for (var k in this.scopeTimeOuts) {
				for (var i = this.scopeTimeOuts[k].length - 1; i >= 0; i--) {
					this.scopeTimeOuts[k][i].remove();
				}
			}
		},

		stopAllTimeOutsWithScope: function(scope) {
			for (var i = 0; i < this.scopeTimeOuts[scope].length; i++) {
				if (this.scopeTimeOuts[scope][i].scope === scope) {
					this.scopeTimeOuts[scope][i].stop();
				}
			}
		},

		removeAllTimeOutsWithScope: function(scope) {
			for (var i = this.scopeTimeOuts[scope].length - 1; i >= 0; i--) {
				if (this.scopeTimeOuts[scope][i].scope === scope) {
					this.scopeTimeOuts[scope][i].remove();
				}
			}
		}
	}

	window.TimeOutFactory = TimeOutFactory;
});