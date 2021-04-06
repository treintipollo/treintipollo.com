$(function() {
	let soundPlayer = {
		playing: new Map(),
		options: new Map(),

		lastBGM: ""
	}

	soundPlayer.addPlaySingle = function(id, bufferId) {
		this.options.set(id, { buffer: window.SoundBuffers.get(bufferId),
			single: true,
			loop: false,
			bgm: false,
			stopLastBGM: false
		});
	};

	soundPlayer.addLoopSingle = function(id, bufferId) {
		this.options.set(id, { buffer: window.SoundBuffers.get(bufferId),
			single: true,
			loop: true,
			bgm: false,
			stopLastBGM: false
		});
	};
	
	soundPlayer.addPlayMulti = function(id, bufferId) {
		this.options.set(id, { buffer: window.SoundBuffers.get(bufferId),
			single: false,
			loop: false,
			bgm: false,
			stopLastBGM: false
		});
	};

	soundPlayer.addLoopMulti = function(id, bufferId) {
		this.options.set(id, { buffer: window.SoundBuffers.get(bufferId),
			single: false,
			loop: true,
			bgm: false,
			stopLastBGM: false
		});
	};

	soundPlayer.addLoopBGM = function(id, bufferId) {
		this.options.set(id, { buffer: window.SoundBuffers.get(bufferId),
			single: true,
			loop: true,
			bgm: true,
			stopLastBGM: true
		});
	};

	soundPlayer.isPlaying = function(id) {
		if (!this.playing.has(id))
			return false;

		return !!this.playing.get(id).length;
	}

	soundPlayer.play = function(id) {
		if (!this.options.has(id))
			return;

		if (!this.playing.has(id))
			this.playing.set(id, []);

		const playing = this.playing.get(id);
		const options = this.options.get(id);

		if (options.stopLastBGM && this.lastBGM)
			this.stop(this.lastBGM);

		if (options.bgm)
			this.lastBGM = id;

		if (options.single && playing.length)
			return;

		const source = window.AContextIntance.createBufferSource();
		
		source.buffer = options.buffer;
		source.loop = options.loop;
		source.connect(window.AContextIntance.destination);
		source.start(0);

		const index = playing.push(source) - 1;

		if (!source.loop)
			source.onended = () => playing.splice(index, 1);
	}

	soundPlayer.stop = function(id) {
		if (!this.playing.has(id))
			return;

		const playing = this.playing.get(id);

		for (const source of playing)
			source.stop();

		playing.length = 0;
	};

	soundPlayer.pauseAll = function() {
		window.AContextIntance.suspend();
	};

	soundPlayer.resumeAll = function() {
		window.AContextIntance.resume();
	};

	window.SoundPlayer = soundPlayer;
});