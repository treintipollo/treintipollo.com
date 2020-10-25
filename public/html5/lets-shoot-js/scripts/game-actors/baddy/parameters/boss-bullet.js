"use strict";

{
	class BossBullet extends BaddyParameters
	{
		constructor()
		{
			super();

			this._rotationSpeed = 20;
			this._radius = BossBullet.GetRadius();
			this._life = 500;
			this._maxSpeed = 10;
		
			this._lineWidth = BossBullet.GetLineWidth();
			this._lineColor = BossBullet.GetLineColor();
			this._fillColor = BossBullet.GetFillColor();
		
			this._segmentSpeedRange = new Point(1, 5);
			this._segmentRotSpeedRange = new Point(2, 5);
			this._segmentLife = 50;
		
			this._isHitable = false;
			this._isVisible = true;
			
			this._hasDeathSound = false;
			this._deathSoundIndex = -1;
		}

		static GetStrength(parametersName)
		{
			return "BossBullet";
		}

		static GetRadius()
		{
			return 8;
		}

		static GetLineWidth()
		{
			return 1;
		}

		static GetLineColor()
		{
			return 0xffffffff;
		}

		static GetFillColor()
		{
			return 0xffff6a02;
		}
	}

	window.BossBullet = BossBullet;
}