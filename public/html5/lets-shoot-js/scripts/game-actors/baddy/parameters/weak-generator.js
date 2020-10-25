"use strict";

{
	class WeakGenerator extends GeneratorParameters
	{
		constructor()
		{
			super();
			
			this._coolDown = 50;
			this._sameTimeAmount = 1;
			this._maxMinions = 10;
			this._spawnRadiusRange = new Point(80, 200);
			this._autonomy = 3;
			this._canRegenerate = false;
			this._regenRate = 50;
		}

		static GetStrength(parametersName)
		{
			return "Weak";
		}
	}

	window.WeakGenerator = WeakGenerator;
}