"use strict"

{
	window.AudioContext = window.AudioContext || window.webkitAudioContext;
	
	const context = new AudioContext();

	class Sound
	{
		constructor()
		{
			this._soundBuffer = null;
		}

		async load(url)
		{
			if (this._soundBuffer)
				return;
			
			const arrayBuffer = await window.SoundBuffers.get(url);
			
			return new Promise((resolve, reject) =>
			{
				context.decodeAudioData(arrayBuffer,
				(buffer) =>
				{
					this._soundBuffer = buffer;

					resolve();
				},
				(error) =>
				{
					reject(error);
				});
			});
		}

		play(startTime = 0, loops = 0, soundTransform = null)
		{
			if (!this._soundBuffer)
				throw new Error("sound needs to load before playing");

			const channel = new SoundChannel();

			channel._setSource(context, this._soundBuffer);
			channel._start(startTime, loops);
			
			channel.soundTransform = soundTransform;

			return channel;
		}

		dispose()
		{
			this._soundBuffer = null;
		}
	}

	window.Sound = Sound;
	window.Sound.Context = context;
}