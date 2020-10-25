"use strict";

{
	class FastGenerator extends GeneratorParameters
	{
		constructor()
		{
			super();

			this._coolDown = 50;
			this._sameTimeAmount = 1;
			this._maxMinions = 8;
			this._spawnRadiusRange = new Point(80, 200);
			this._autonomy = 8;
			this._canRegenerate = true;
			this._regenRate = 50;
		}

		static GetStrength(parametersName)
		{
			return "Fast";
		}
	}

	window.FastGenerator = FastGenerator;
}