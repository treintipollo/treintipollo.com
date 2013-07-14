$(function() {
	var soundPlayer = {
		audioTags: {},

		audioAssetPaths: {},

		currentTime: new Date(),

		pooledChannels: [],
		activeChannels: []
	}

	soundPlayer.createChannels = function(amount) {
		for (var i = 0; i < amount; i++) {
			var channel = new Audio();

			channel.timer = TimeOutFactory.getTimeOut(-1, -1, this);

			this.pooledChannels.push(channel);
		}
	}

	soundPlayer.add = function(id, path) {
		this.audioAssetPaths[id] = path;
	};

	soundPlayer.loadAll = function(onComplete) {
		var soundAssetCount = Object.keys(this.audioAssetPaths).length;

		for (var id in this.audioAssetPaths) {
			var audio = document.createElement("audio");

			audio.setAttribute("src", this.audioAssetPaths[id]);
			audio.setAttribute("preload", "auto");

			audio.addEventListener("canplaythrough", function() {
				soundAssetCount--;
				if (soundAssetCount <= 0) {
					onComplete();
				}
			});

			this.audioTags[id] = audio;

			document.body.appendChild(audio);
		}
	}

	var setUpChannel = function (id, onMetadata) {
		if (this.pooledChannels.length == 0) { return; }

		var audio = this.audioTags[id];

		if(!audio) { return; }

		var channel = this.pooledChannels.pop();

		this.activeChannels.push(channel);

		channel.id = id;

		channel.src = audio.src;
		channel.time = audio.duration;

		channel.load();

		var onMD = function() {
			this.removeEventListener('loadedmetadata', onMD);			
			onMetadata(this);			
		}

		channel.addEventListener('loadedmetadata', onMD);
	}

	soundPlayer.playSingle = function(id) {
		setUpChannel.call(this, id, function(channel) {

			channel.timer.resetNewDelayAndRepeateCount(channel.time * 1000, 1);

			channel.timer.callback = function() {
				channel.currentTime = 0;	
				channel.pause();
				this.pooledChannels.push(channel);
				this.activeChannels.splice(this.activeChannels.indexOf(channel), 1);
			}

			channel.play();
		});
	}

	soundPlayer.playLoop = function(id) {
		var channel = setUpChannel.call(this, id, function() {
			channel.timer.callback = function() {
				channel.currentTime = 0;	
				channel.play();
			};

			channel.timer.resetNewDelayAndRepeateCount(channel.time * 1000, -1);
			channel.play();
		});
	}

	var pauseChannel = function(channel) {
		channel.timer.pause();
		channel.pause();
	}

	soundPlayer.pause = function(id) {
		for (var i = 0; i < this.activeChannels.length; i++) {
			var channel = this.activeChannels[i];

			if (channel.id == id) {
				pauseChannel(channel);
			}
		}
	};

	soundPlayer.pauseAll = function() {
		for (var i = 0; i < this.activeChannels.length; i++) {
			pauseChannel(this.activeChannels[i]);
		}
	};

	var stopChannel = function(channel, index) {
		channel.currentTime = 0;
		channel.pause();
		channel.timer.stop();
		channel.id = 'none';
		
		this.pooledChannels.push(channel);
		this.activeChannels.splice(index, 1);
	}

	soundPlayer.stop = function(id) {
		for (var i = this.activeChannels.length - 1; i >= 0; i--) {
			var channel = this.activeChannels[i];

			if (channel.id == id) {
				stopChannel.call(this, channel, i);
			}
		}
	};

	soundPlayer.stopAll = function() {
		for (var i = this.activeChannels.length - 1; i >= 0; i--) {
			stopChannel.call(this, this.activeChannels[i], i);
		}
	};

	var resumeChannel = function(channel) {
		channel.play();
		channel.timer.resume();
	}

	soundPlayer.resume = function(id) {
		for (var i = 0; i < this.activeChannels.length; i++) {
			var channel = this.activeChannels[i];

			if (channel.id == id) {
				resumeChannel(channel);
			}
		}
	};

	soundPlayer.resumeAll = function() {
		for (var i = 0; i < this.activeChannels.length; i++) {
			resumeChannel(this.activeChannels[i]);
		}
	};

	window.SoundPlayer = soundPlayer;
});