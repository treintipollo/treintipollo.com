$(function(){
	var TimeOutFactory = {

		scopeTimeOuts: {},

		getTimeOut: function(delay, repeatCount, scope, callback, removeOnComplete) {
			var self = this;

			var timeOutObject = {
				callback:callback, 
				scope:scope, 
				delay:delay,
				removeOnComplete:removeOnComplete,
				repeateCount:repeatCount,
				initRepeatCount:repeatCount,
				onComplete:null,

				id:-1,
				startTime:-1,
				pauseTime:-1,
				resumeDelay:-1,
				isRunning:false,
				isPaused:false,

				startNewDelayAndRepeateCount: function(delay, repeateCount){
					this.delay = delay;
					this.repeateCount = repeateCount;
					this.initRepeatCount = repeateCount;

					this.start();					
				},

				resetNewDelayAndRepeateCount: function(delay, repeateCount){
					this.stop();
					this.startNewDelayAndRepeateCount(delay, repeateCount);
				},

				start: function(resumed){
					if(this.isRunning || this.isPaused){
						return;
					}

					this.startTime = Date.now();

					this.isRunning = true;
					this.isPaused  = false;

					var actualDelay;

					if(resumed){
						actualDelay = this.resumeDelay == -1 ? this.delay : this.resumeDelay;
					}else{
						actualDelay = this.delay;
					}

					var to = this;

					this.id = setTimeout(function(){
						if(to.isRunning && !to.isPaused){
							to.callback.call(to.scope);
						}else{
							return;
						}

						if(to.repeateCount < 0){
							to.isRunning = false;
							to.start();
						}else{
							to.repeateCount--;

							if(to.repeateCount > 0){
								to.isRunning = false;
								to.start();
							}else{
								to.stop();

								if(to.onComplete != null){
									to.onComplete.call(to.scope);
								}
								if(to.removeOnComplete){
									to.remove();
								}
							}
						}

					}, actualDelay);
				},

				stop: function(){
					clearTimeout(this.id);

					this.isRunning    = false;
					this.isPaused     = false;
					this.repeateCount = this.initRepeatCount;
					this.resumeDelay  = -1;
				},

				reset: function(){
					this.stop();
					this.start();
				},

				resetAndExecuteCallback: function(){
					this.callback.call(this.scope);
					this.stop();
					this.start();
				},

				pause: function(){
					if(!this.isRunning){
						return;
					}

					clearTimeout(this.id);
					this.pauseTime = Date.now();
					this.isRunning = false;
					this.isPaused = true;
				},

				resume: function(){
					if(!this.isRunning && !this.isPaused){
						return;
					}

					this.isPaused = false;
					this.resumeDelay = this.delay - (this.pauseTime - this.startTime);	
					this.start(true);
				},

				remove : function(){
					this.stop();
					self.scopeTimeOuts[this.scope].splice(self.scopeTimeOuts[this.scope].indexOf(this), 1);
				}
			};

			if(!this.scopeTimeOuts[scope]){
				this.scopeTimeOuts[scope] = [];
			}

			this.scopeTimeOuts[scope].push(timeOutObject);

			return timeOutObject;
		},

		stopAllTimeOuts: function(){
			for(var k in this.scopeTimeOuts){
				for(var i=0; i<this.scopeTimeOuts[k].length; i++){
					this.scopeTimeOuts[k][i].stop();
				}
			}
		},

		pauseAllTimeOuts: function(){
			for(var k in this.scopeTimeOuts){
				for(var i=0; i<this.scopeTimeOuts[k].length; i++){
					this.scopeTimeOuts[k][i].pause();
				}
			}
		},

		resumeAllTimeOuts: function(){
			for(var k in this.scopeTimeOuts){
				for(var i=0; i<this.scopeTimeOuts[k].length; i++){
					this.scopeTimeOuts[k][i].resume();
				}
			}
		},

		removeAllTimeOuts: function(){
			for(var k in this.scopeTimeOuts){
				for(var i=this.scopeTimeOuts[k].length-1; i>=0; i--){
					this.scopeTimeOuts[k][i].remove();
				}
			}
		},

		stopAllTimeOutsWithScope: function(scope){
			for(var i=0; i<this.scopeTimeOuts[scope].length; i++){
				if(this.scopeTimeOuts[scope][i].scope === scope){
					this.scopeTimeOuts[scope][i].stop();
				}
			}
		},

		removeAllTimeOutsWithScope: function(scope){
			for(var i=this.scopeTimeOuts[scope].length-1; i>=0; i--){
				if(this.scopeTimeOuts[scope][i].scope === scope){
					this.scopeTimeOuts[scope][i].remove();
				}
			}
		}
	}

	window.TimeOutFactory = TimeOutFactory;
});