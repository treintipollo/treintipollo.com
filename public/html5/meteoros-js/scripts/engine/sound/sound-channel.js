"use strict";

{
	class SoundChannel
	{
		constructor()
		{
			this._soundTransform = null;
			this._loops = 0;
			this._source = null;

			this._startPosition = 0;
			this._startGlobalTime = NaN;
			this._loopCount = 0;
		}
		
		stop()
		{
			if (this._source)
				this._source.stop();
		}

		dispose()
		{
			this._source = null;
			this._soundTransform = null;
		}

		_setSource(context, buffer)
		{
			this._source = context.createBufferSource();
			this._source.buffer = buffer;

			if (this._soundTransform)
			{
				// If there is a sound transform connect the source to it
				this._soundTransform.connect(this._source);
			}
			else
			{
				// If there is no sound transform connect the source to the output
				this._source.connect(context.destination);
			}
		}

		_start(position, loops)
		{
			this._startPosition = position;
			this._loops = loops;
			this._loopCount = loops;

			this._source.start(0, position);

			if (this._loopCount > 0)
				this._source.addEventListener("ended", () => this._ended());

			// Save the global starting time to calculate the local playback position
			this._startGlobalTime = this._source.context.currentTime;
		}

		_ended(e)
		{
			if (this._loopCount <= 0)
				return;

			this._loopCount--;

			this._source.stop();
			this._source.start(0, this._startPosition);

			// Save the global starting time to calculate the local playback position
			this._startGlobalTime = this._source.context.currentTime;
		}

		addEventListener(...args)
		{
			if (this._source)
				this._source.addEventListener(...args);
		}

		removeEventListener(...args)
		{
			if (this._source)
				this._source.removeEventListener(...args);
		}
	}

	Object.defineProperty(SoundChannel.prototype, "position",
	{
		get: function()
		{
			if (!this._source)
				return 0;

			return this._source.context.currentTime - this._startGlobalTime + this._startPosition;
		}
	});

	Object.defineProperty(SoundChannel.prototype, "soundTransform",
	{
		get: function()
		{
			return this._soundTransform;
		},

		set: function(v)
		{
			// No change
			if (v === this._soundTransform)
				return;

			// If the sound transform was not defined, diconnect the source from the output
			if (!this._soundTransform && this._source)
				this._source.disconnect(this._source.context.destination);

			// If the sound transform was defined, disconnect it from the source
			if (this._soundTransform && this._source)
				this._soundTransform.disconnect(this._source);

			// Set the new sound transform
			this._soundTransform = v;

			// If the sound transform is not defined, connect the source to the output
			if (!this._soundTransform && this._source)
				this._source.connect(this._source.context.destination);

			// If the sound transform is defined, connect it to the source
			if (this._soundTransform && this._source)
				this._soundTransform.connect(this._source);
		}
	});

	window.SoundChannel = SoundChannel;
}