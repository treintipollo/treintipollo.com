"use strict";

{
	class GameSoundChannel
	{
		constructor(sound, soundTransform)
		{
			this._channel = sound.play();
			this._channel.soundTransform = soundTransform;
			
			this._done = false;
			
			this._on_sound_complete = (e) => this.SoundComplete(e);
			this._channel.addEventListener("ended", this._on_sound_complete);
		}
		
		Clean()
		{
			if (this._channel)
			{
				this._channel.stop();
				this._channel.removeEventListener("ended", this._on_sound_complete);
				this._channel.soundTransform = null;
			}

			this._on_sound_complete = null;
			this._channel = null;
		}

		SoundComplete(e)
		{
			this._channel.removeEventListener("ended", this._on_sound_complete);
			this._channel = null;
			this._done = true;
		}
		
		IsDone()
		{
			return this._done;
		}
	}

	window.GameSoundChannel = GameSoundChannel;
}