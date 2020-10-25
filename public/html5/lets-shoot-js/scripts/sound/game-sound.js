"use strict";

{
	class GameSound
	{
		constructor(spliceMax = 10)
		{
			this._sound = new Sound();
			this._channel = new SoundChannel();
			this._dynamicSound = [];

			this._nullChannelCount = 0;
			this._bulkSpliceMax = spliceMax;
			this._enable = true;

			this._isPlaying = false;
			this._isBGM = false;
			this._loop = false;
			this._pausePosition = 0;
			this._nullChannelCount = 0;
			this._fileName = "";

			this._on_sound_complete = (e) => this.SoundComplete(e);
		}
		
		Create(fileName, bgm, loop)
		{
			this._fileName = fileName;
			this._isPlaying = false;
			this._loop = loop;
			this._isBGM = bgm;

			return this._sound.load(this._fileName);
		}
		
		Play(overrideEnable = false)
		{
			if (this._enable || overrideEnable)
			{
				if (this._isBGM)
				{
					this.Loop();
				}
				else
				{
					if (this._loop)
					{
						this.Loop();
					}
					else
					{
						if(!this._isPlaying)
						{
							this._isPlaying = true;
							this._channel = this._GetNewSoundChannel();
							this._channel.addEventListener("ended", this._on_sound_complete);
						}
						else
						{
							this._dynamicSound.push(new GameSoundChannel(this._sound, SoundManager.GetSoundTransform(this._isBGM)));
						}
					}
				}
			}
		}
		
		Stop()
		{
			this._isPlaying = false;
			this._pausePosition = 0;
			
			this._channel.removeEventListener("ended", this._on_sound_complete);
			this._channel.stop();
		}
		
		Pause()
		{
			this._isPlaying = false;
			this._pausePosition = this._channel.position;

			this._channel.removeEventListener("ended", this._on_sound_complete);
			this._channel.stop();
		}

		Enable()
		{
			this._enable = !this._enable;
			
			return this._enable;
		}
		
		IsPlaying()
		{
			return this._isPlaying;
		}
		
		GetType()
		{
			return this._isBGM;
		}

		IsBGM()
		{
			return this._isBGM;
		}

		IsSFX()
		{
			return !this._isBGM;
		}
		
		Update()
		{
			for (let i = 0; i < this._dynamicSound.length; i++)
			{
				if (this._dynamicSound[i])
				{
					if (this._dynamicSound[i].IsDone())
					{
						this._dynamicSound[i] = null;
						this._dynamicSound.splice(i, 1);
						this._nullChannelCount++;
					}
				}
			}
			
			if (this._channel)
				this._channel.soundTransform = SoundManager.GetSoundTransform(this._isBGM);
			
			if (this._nullChannelCount >= this._bulkSpliceMax)
				this.SortNSpliceNulls();
		}

		Loop()
		{
			if (!this._isPlaying)
			{
				this._isPlaying = true;

				this._channel = this._GetNewSoundChannel(this._pausePosition);
				this._channel.addEventListener("ended", this._on_sound_complete);
			}
		}
		
		SortNSpliceNulls()
		{
			let startIndex = this._dynamicSound.length - this._nullChannelCount;
			
			this._dynamicSound.sort();
			this._dynamicSound.splice(startIndex, this._nullChannelCount);
			this._nullChannelCount = 0;
		}
		
		SoundComplete(e)
		{
			this.Stop();
		}

		_GetNewSoundChannel(position = 0)
		{
			if (this._channel)
			{
				this._channel.removeEventListener("ended", this._on_sound_complete);
				this._channel.dispose();
			}

			return this._sound.play(position);
		}
	}

	window.GameSound = GameSound;
}