"use strict";

{
	class GeneratorParameters
	{
		constructor()
		{
			this._coolDown = 0;
			this._sameTimeAmount = 0;
			this._maxMinions = 0;
			this._spawnRadiusRange = null;
			this._autonomy = 0;
			this._canRegenerate = false;
			this._regenRate = 0;
		}
		
		Init(coolDown, sameTimeAmount, maxMinions, spawnRadiusRange, autonomy, canRegenerate, regenRate)
		{
			this._coolDown = coolDown;
			this._sameTimeAmount = sameTimeAmount;
			this._maxMinions = maxMinions;
			this._spawnRadiusRange = spawnRadiusRange;
			this._autonomy = autonomy;
			this._canRegenerate = canRegenerate;
			this._regenRate = regenRate;
		}

		static GetStrength(parametersName)
		{
			return parametersName;
		}
	}

	window.GeneratorParameters = GeneratorParameters;
}