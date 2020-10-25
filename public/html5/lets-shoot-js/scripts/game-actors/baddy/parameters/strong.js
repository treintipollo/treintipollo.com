"use strict";
{
	class Strong extends BaddyParameters
	{
		constructor()
		{
			super();

			this._rotationSpeed = 2;
			this._radius = Strong.GetRadius();
			this._life = 400;
			this._maxSpeed = 5;
			
			this._lineWidth = Strong.GetLineWidth();
			this._lineColor = Strong.GetLineColor();
			this._fillColor = Strong.GetFillColor();
			
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
			return "Strong";
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
			return 0xffffff00;
		}

		static GetFillColor()
		{
			return 0xff000000;
		}
	}

	window.Strong = Strong;
}