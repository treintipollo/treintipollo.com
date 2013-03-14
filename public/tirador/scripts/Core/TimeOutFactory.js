$(function(){
	var TimeOutFactory = {

		timeOuts : [],

		getTimeOut: function(delay, repeatCount, scope, callback) {
			var self = this;

			var timeOutObject = {
				callback:callback, 
				scope:scope, 
				delay:delay,
				repeateCount:repeatCount,
				initRepeatCount:repeatCount,
				onComplete:null,

				id:-1,
				startTime:-1,
				pauseTime:-1,
				resumeDelay:-1,
				isRunning:false,
				isPaused:false,

				start: function(resumed){
					if(this.isRunning || this.isPaused){
						return;
					}

					this.startTime = Date.now();

					this.isRunning = true;

					var actualDelay;

					if(resumed){
						actualDelay = this.resumeDelay == -1 ? this.delay : this.resumeDelay;
					}else{
						actualDelay = this.delay;
					}

					var to = this;

					this.id = setTimeout(function(){
						if(to.isRunning && !to.isPaused)
							to.callback.call(to.scope);

						if(!to.isRunning){
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
							}
						}

					}, actualDelay);
				},

				stop: function(){
					this.isRunning    = false;
					this.isPaused     = false;
					this.repeateCount = this.initRepeatCount;
					this.resumeDelay  = -1;
					
					clearTimeout(this.id);
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
					self.timeOuts.splice(self.timeOuts.indexOf(this), 1);
				}
			};

			this.timeOuts.push(timeOutObject);

			return timeOutObject;
		},

		stopAllTimeOuts: function(){
			for(var i=0; i<this.timeOuts.length; i++){
				this.timeOuts[i].stop();
			}
		},

		pauseAllTimeOuts: function(){
			for(var i=0; i<this.timeOuts.length; i++){
				this.timeOuts[i].pause();
			}
		},

		resumeAllTimeOuts: function(){
			for(var i=0; i<this.timeOuts.length; i++){
				this.timeOuts[i].resume();
			}
		},

		removeAllTimeOuts: function(){
			this.stopAllTimeOuts();

			for(var i=this.timeOuts.length-1; i>=0; i--){
				this.timeOuts[i].remove();
			}
		}
	}

	window.TimeOutFactory = TimeOutFactory;
});