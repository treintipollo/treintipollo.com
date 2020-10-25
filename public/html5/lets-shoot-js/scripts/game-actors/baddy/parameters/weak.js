"use strict";
{
	class Weak extends BaddyParameters
	{
		constructor()
		{
			super();

			this._rotationSpeed = 2;
			this._radius = Weak.GetRadius();
			this._life = 120;
			this._maxSpeed = 3;
			
			this._lineWidth = Weak.GetLineWidth();
			this._lineColor = Weak.GetLineColor();
			this._fillColor = Weak.GetFillColor();
			
			this._segmentSpeedRange = new Point(1, 5);
			this._segmentRotSpeedRange = new Point(10, 15);
			this._segmentLife = 30;
			
			this._isHitable = true;
			this._isVisible = true;
			
			this._hasDeathSound = true;
			this._deathSoundIndex = -1;
		}

		static GetStrength(parametersName)
		{
			return "Weak";
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
			return 0xff00ff00;
		}

		static GetFillColor()
		{
			return 0xff000000;
		}
	}

	window.Weak = Weak;
}