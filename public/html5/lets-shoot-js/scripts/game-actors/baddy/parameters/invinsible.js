"use strict";

{
	class Invinsible extends BaddyParameters
	{
		constructor()
		{
			super();
			
			this._rotationSpeed = 2;
			this._radius = Invinsible.GetRadius();
			this._life = 400;
			this._maxSpeed = 7;
			
			this._lineWidth = Invinsible.GetLineWidth();
			this._lineColor = Invinsible.GetLineColor();
			this._fillColor = Invinsible.GetFillColor();
			
			this._segmentSpeedRange = new Point(1, 5);
			this._segmentRotSpeedRange = new Point(10, 15);
			this._segmentLife = 30;
			
			this._isHitable = false;
			this._isVisible = true;
			
			this._hasDeathSound = true;
			this._deathSoundIndex = -1;
		}

		static GetStrength(parametersName)
		{
			return "Invinsible";
		}

		static GetRadius()
		{
			return 20;
		}

		static GetLineWidth()
		{
			return 3;
		}

		static GetLineColor()
		{
			return 0xffff0000;
		}

		static GetFillColor()
		{
			return 0xff000000;
		}
	}

	window.Invinsible = Invinsible;
}