"use strict";

{
	class PyramidBossRendererInitialization
	{
		constructor(baseArguments, maxHeight, eyeRadius, eyeWidth, leastDamageColor, mostDamageColor)
		{
			this._baseArguments    = baseArguments;
			this._maxHeight 	   = maxHeight;
			this._eyeRadius 	   = eyeRadius;
			this._eyeWidth 	       = eyeWidth;
			this._leastDamageColor = leastDamageColor;
			this._mostDamageColor  = mostDamageColor;
		}
		
		isDestroyable()
		{
			return true;
		}
		
		destroy()
		{
			this._baseArguments = null;
		}
	}

	window.PyramidBossRendererInitialization = PyramidBossRendererInitialization;
}