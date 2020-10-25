"use strict";

{
	class InvinsibleGenerator extends GeneratorParameters
	{
		constructor()
		{
			super();
			
			this._coolDown = 50;
			this._sameTimeAmount = 2;
			this._maxMinions = 2;
			this._spawnRadiusRange = new Point(80, 200);
			this._autonomy = 2;
			this._canRegenerate = false;
			this._regenRate = 50;
		}

		static GetStrength(parametersName)
		{
			return "Invinsible";
		}
	}

	window.InvinsibleGenerator = InvinsibleGenerator;
}