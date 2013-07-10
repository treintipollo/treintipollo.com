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
			this.pooledChannels.push(new Audio());
		}
	}

	soundPlayer.add = function(id, path) {
		this.audioAssetPaths[id] = path;
	};

	soundPlayer.loadAll = function(onComplete) {
		var soundAssetCount = Object.keys(this.audioAssetPaths).length * 2;

		var onDataLoaded = function() {
			soundAssetCount--;
			if (soundAssetCount <= 0) {
				onComplete();
			}
		}

		for (var id in this.audioAssetPaths) {
			var audio = document.createElement("audio");

			audio.setAttribute("src", this.audioAssetPaths[id]);
			audio.setAttribute("preload", "auto");

			audio.addEventListener("canplaythrough", onDataLoaded);
			audio.addEventListener("loadedmetadata", onDataLoaded);

			this.audioTags[id] = audio;

			document.body.appendChild(audio);
		}
	}

	soundPlayer.onSoundComplete = function() {
		if (this.looping) {
			console.log("Loop");

			//this.currentTime = 0;
			this.play();
		} else {
			this.removeEventListener('ended', this.onSoundComplete);
			SoundPlayer.pooledChannels.push(this);
			SoundPlayer.activeChannels.splice(SoundPlayer.activeChannels.indexOf(this), 1);
		}
	}

	soundPlayer.play = function(id, loop) {
		if (this.pooledChannels.length == 0) return;

		var channel = this.pooledChannels.pop();

		this.activeChannels.push(channel);

		channel.id = id;
		channel.looping = loop;
		channel.src = this.audioTags[id].src;
		channel.duration = this.audioTags[id].duration;

		channel.load();

		//channel.addEventListener('ended', this.onSoundComplete);
		//channel.play();

		var p = function() {
			console.log(channel.currentTime);
			console.log(channel.duration);

			setTimeout(p, channel.duration * 1000)
//			channel.pause();
			channel.currentTime = 0;
			channel.play();
		}

		p();
	}

	soundPlayer.pause = function(id) {
		for (var i = 0; i < this.activeChannels.length; i++) {
			var channel = this.activeChannels[i];

			if (channel.id == id) {
				channel.pause();
			}
		}
	};

	soundPlayer.stop = function(id) {
		for (var i = this.activeChannels.length - 1; i >= 0; i--) {
			var channel = this.activeChannels[i];

			if (channel.id == id) {
				channel.pause();
				channel.currentTime = 0;
				this.pooledChannels.push(channel);
				this.activeChannels.splice(i, 1);

				if (channel.looping) {
					channel.removeEventListener('ended', this.onSoundComplete);
				}
			}
		}
	};

	soundPlayer.resume = function(id) {
		for (var i = 0; i < this.activeChannels.length; i++) {
			var channel = this.activeChannels[i];

			if (channel.id == id) {
				channel.play();
			}
		}
	};

	soundPlayer.pauseAll = function() {
		for (var i = 0; i < this.activeChannels.length; i++) {
			this.activeChannels[i].pause();
		}
	};

	soundPlayer.stopAll = function() {
		for (var i = this.activeChannels.length - 1; i >= 0; i--) {
			var channel = this.activeChannels[i];

			channel.pause();
			channel.currentTime = 0;
			this.pooledChannels.push(this.activeChannels[i]);
			this.activeChannels.splice(i, 1);
		}
	};

	soundPlayer.resumeAll = function() {
		for (var i = 0; i < this.activeChannels.length; i++) {
			this.activeChannels[i].play();
		}
	};

	window.SoundPlayer = soundPlayer;
});