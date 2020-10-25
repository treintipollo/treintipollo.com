"use strict";

{
	class BaddyParameters
	{
		constructor()
		{
			this._rotationSpeed = 0;
			this._radius = 0;
			this._life = 0;
			this._maxSpeed = 0;
			
			this._lineWidth = 0;
			this._lineColor = 0;
			this._fillColor = 0;
			
			this._segmentSpeedRange = null;
			this._segmentRotSpeedRange = null;
			this._segmentLife = 0;
			
			this._isHitable = false;
			this._isVisible = false;
			
			this._hasDeathSound = false;
			this._deathSoundIndex = 0;
		}

		static GetStrength(parametersName)
		{
			return parametersName;
		}
		
		SetUpdateParameters(maxSpeed, rotSpeed, radius, life)
		{
			this._rotationSpeed = rotSpeed;
			this._radius = radius;
			this._life = life;
			this._maxSpeed = maxSpeed;
		}
		
		SetDrawParameters(lineWidth, lineColor, fillColor)
		{
			this._lineWidth = lineWidth;
			this._lineColor = lineColor;
			this._fillColor = fillColor;
		}
		
		SetSegmentParameters(speedRange, rotSpeedRange, life)
		{
			this._segmentSpeedRange = speedRange;
			this._segmentRotSpeedRange = rotSpeedRange;
			this._segmentLife = life;
		}
		
		SetOptions(isHitable, isVisible)
		{
			this._isHitable = isHitable;
			this._isVisible = isVisible;
		}
		
		SetSound(hasDeathSound, deathSoundIndex = -1)
		{
			this._hasDeathSound = hasDeathSound;
			this._deathSoundIndex = deathSoundIndex;
		}
		
		Clean()
		{
			this._segmentSpeedRange = null;
			this._segmentRotSpeedRange = null;
		}
	}

	window.BaddyParameters = BaddyParameters;
}