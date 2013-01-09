$(function(){
	var TimeOutFactory = {

		timeOuts : [],

		getTimeOut: function(delay, repeatCount, scope, callback) {
			var self = this;

			var timeOutObject = {
				callback:callback, 
				scope:scope, 
				delay:delay,
				repeatCount:repeatCount,
				initRepeatCount:repeatCount,

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

					var timeOutObject = this;

					this.id = setTimeout(function(){
						timeOutObject.callback.call(timeOutObject.scope);

						if(!timeOutObject.isRunning){
							return;
						}

						if(timeOutObject.repeatCount < 0){
							timeOutObject.isRunning = false;
							timeOutObject.start();
						}else{
							timeOutObject.repeatCount--;

							if(timeOutObject.repeatCount > 0){
								timeOutObject.isRunning = false;
								timeOutObject.start();
							}else{
								timeOutObject.stop();
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