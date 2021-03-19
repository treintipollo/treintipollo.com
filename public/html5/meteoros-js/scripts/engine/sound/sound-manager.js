"use strict";

{
	let _soundArray;
	let _tempGameSound;
	let _bgmSoundTransform;
	let _fxSoundTransform;
	let _loadPromises;
	let _blocked;

	class SoundManager
	{
		constructor()
		{
			
		}

		static Init()
		{
			_soundArray = [];
			_bgmSoundTransform = new SoundTransform();
			_fxSoundTransform = new SoundTransform();
			_loadPromises = [];
			_blocked = false;

			const bgmVolume = parseFloat(localStorage.getItem(`meteoros-bgm-volume`));

			if (!isNaN(bgmVolume))
				_bgmSoundTransform.volume = bgmVolume;
			
			const sfxVolume = parseFloat(localStorage.getItem(`meteoros-sfx-volume`));
			
			if (!isNaN(sfxVolume))
				_fxSoundTransform.volume = sfxVolume;
		}
		
		static IsReady()
		{
			return Promise.all(_loadPromises);
		}

		static Add(fileName, bgm = false, loop = false)
		{
			_tempGameSound = new GameSound();
			const p = _tempGameSound.Create(fileName, bgm, loop);
			_soundArray.push(_tempGameSound);
			
			_loadPromises.push(p);

			_tempGameSound = null;
			
			return _soundArray.length - 1;
		}
		
		static Play(soundName, overrideEnable = false)
		{
			if (_blocked)
				return;

			if (soundName !== -1)
			{
				// If the incoming sound is a BGM, stop all other BGMs playing
				if (_soundArray[soundName].IsBGM())
				{
					for (let i = 0; i < _soundArray.length; i++)
					{
						if (_soundArray[i].IsBGM() && soundName !== i)
							_soundArray[i].Stop();
					}
				}

				_soundArray[soundName].Play(overrideEnable);
			}
		}
		
		static Stop(soundName)
		{
			if (soundName !== -1)
				_soundArray[soundName].Stop();
		}
		
		static Pause(soundName)
		{
			if (soundName !== -1)
				_soundArray[soundName].Pause();
		}
		
		static StopAll(bgm = true, sfx = true)
		{
			for (let i = 0; i < _soundArray.length; i++)
			{
				if (bgm && _soundArray[i].IsBGM())
					_soundArray[i].Stop();
				
				if (sfx && _soundArray[i].IsSFX())
					_soundArray[i].Stop();
			}
		}
		
		static BGMSwitch(pause = false)
		{
			for (let i = 0; i < _soundArray.length; i++)
			{
				if (_soundArray[i].GetType())
				{
					if (!_soundArray[i].Enable())
					{
						if (pause)
						{
							_soundArray[i].Pause();
						}
						else
						{
							_soundArray[i].Stop();
						}
					}
				}
			}
		}
		
		static SFXSwitch(pause=false)
		{
			for (let i = 0; i < _soundArray.length; i++)
			{
				if (!_soundArray[i].GetType())
				{
					if (!_soundArray[i].Enable())
					{
						if (pause)
						{
							_soundArray[i].Pause();
						}
						else
						{
							_soundArray[i].Stop();
						}
					}
				}
			}
		}
		
		static IsSoundOn()
		{
			const v = parseFloat(localStorage.getItem(`meteoros-bgm-volume`));

			return typeof v === "number" ? !!v : true;
		}

		static BGMVolumeToggle()
		{
			if (_bgmSoundTransform.volume === 0)
			{
				_bgmSoundTransform.volume = 1;

				localStorage.setItem(`meteoros-bgm-volume`, 1);
			}
			else
			{
				_bgmSoundTransform.volume = 0;

				localStorage.setItem(`meteoros-bgm-volume`, 0);
			}
		}

		static SFXVolumeToggle()
		{
			if (_fxSoundTransform.volume === 0)
			{
				_fxSoundTransform.volume = 1;

				localStorage.setItem(`meteoros-sfx-volume`, 1);
			}
			else
			{
				_fxSoundTransform.volume = 0;

				localStorage.setItem(`meteoros-sfx-volume`, 0);
			}
		}
		
		static Update()
		{
			for (let i = 0; i < _soundArray.length; i++)
				_soundArray[i].Update();
		}
		
		static SoundPlaying(soundName)
		{
			let res = false;
			
			if (soundName !== -1)
				res = _soundArray[soundName].IsPlaying();
			
			return res;
		}

		static Block()
		{
			_blocked = true;
		}

		static UnBlock()
		{
			_blocked = false;
		}
		
		static GetSoundTransform(bgm)
		{
			return bgm ? _bgmSoundTransform : _fxSoundTransform;
		}
		
		static GetSoundArray()
		{
			return _soundArray;
		}
	}

	window.SoundManager = SoundManager;
}