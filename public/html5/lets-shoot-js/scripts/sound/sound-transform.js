"use strict";

{
	class SoundTransform
	{
		constructor(vol = 1)
		{
			this._vol = vol;
			this._source = null;
		}

		connect(source)
		{
			if (!this._gainNode)
			{
				this._gainNode = window.Sound.Context.createGain();
				this._gainNode.gain.value = this._vol;

				this._gainNode.connect(window.Sound.Context.destination);
			}

			source.connect(this._gainNode);
			
			this._source = source;
		}

		disconnect(source)
		{
			if (this._gainNode && this._source)
				source.disconnect(this._gainNode);

			this._source = null;
		}

		dispose()
		{
			if (this._gainNode && this._source)
			{
				this._source.disconnect(this._gainNode);
				this._gainNode.disconnect(window.Sound.Context.destination);
			}

			this._gainNode = null;
			this._source = null;
		}

		get volume()
		{
			return this._vol;
		}

		set volume(v)
		{
			if (this._gainNode)
				this._gainNode.gain.value = v;

			this._vol = v;
		}
	}

	window.SoundTransform = SoundTransform;
}