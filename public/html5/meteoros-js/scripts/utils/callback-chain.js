"use strict";

{
	class CallbackChain
	{
		constructor()
		{
			this._callbacks = null;
		}
		
		add(f)
		{
			if (f)
			{
				if (this._callbacks === null)
				{
					this._callbacks = [];
				}
				
				this._callbacks.push(f);
			}
		}
		
		exec(...parameters)
		{
			if (this._callbacks !== null)
			{
				for(var i = 0; i < this._callbacks.length; i++)
				{
					this._callbacks[i].apply(null, parameters);
				}
			}
		}
		
		isEmpty()
		{
			return this._callbacks === null;
		}
		
		isDestroyable()
		{
			return true;
		}

		destroy()
		{
			CollectionUtils.nullVector(this._callbacks, true, true);
		}
	}

	window.CallbackChain = CallbackChain;
}