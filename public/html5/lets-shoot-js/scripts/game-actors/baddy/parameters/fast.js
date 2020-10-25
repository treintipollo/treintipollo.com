"use strict";

{
	class Fast extends BaddyParameters
	{
		constructor()
		{
			super();
			
			this._rotationSpeed = 2;
			this._radius = Fast.GetRadius();
			this._life = 600;
			this._maxSpeed = 7;
			
			this._lineWidth = Fast.GetLineWidth();
			this._lineColor = Fast.GetLineColor();
			this._fillColor = Fast.GetFillColor();
		
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
			return "Fast";
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
			return 0xffff6a03;
		}

		static GetFillColor()
		{
			return 0xff000000;
		}
	}

	window.Fast = Fast;
}