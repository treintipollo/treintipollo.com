"use strict";

{
	class StrongGenerator extends GeneratorParameters
	{
		constructor()
		{
			super();
			
			this._coolDown = 50;
			this._sameTimeAmount = 2;
			this._maxMinions = 10;
			this._spawnRadiusRange = new Point(80, 200);
			this._autonomy = 5;
			this._canRegenerate = true;
			this._regenRate = 50;
		}

		static GetStrength(parametersName)
		{
			return "Strong";
		}
	}

	window.StrongGenerator = StrongGenerator;
}