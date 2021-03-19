"use strict";

{
	class Callback
	{
		static create(handler, ...args)
		{
			return function(...innerArgs)
			{
				handler.apply(this, innerArgs.concat(args));
			}
		}
	}

	window.Callback = Callback;
}