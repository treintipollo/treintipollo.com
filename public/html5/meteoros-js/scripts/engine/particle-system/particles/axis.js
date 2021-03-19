"use strict";

{
	class Axis extends Base_Particle
	{
		constructor()
		{
			super();

			this._speed = 0;
			this._vertical = false;
			this._initAcceleration = 0;
			this._accelerationStep = 0;
		}
		
		InitSpecific(specificProps)
		{
			this._speed = NumberUtils.randRange(specificProps[0].x, specificProps[0].y);
			this._vertical = specificProps[1];
			
			if (specificProps[2])
			{
				this._initAcceleration = specificProps[2];
			}
			else
			{
				this._initAcceleration = 1;
			}
			
			if (specificProps[3])
			{
				this._accelerationStep = specificProps[3];
			}
			else
			{
				this._accelerationStep = 0;
			}
		}
		
		Movement(deltaTime)
		{
			if (this._initAcceleration > 1)
			{
				this._initAcceleration -= deltaTime * this._accelerationStep;
			}
			else
			{
				this._initAcceleration = 1;
			}
			
			if (this._vertical)
			{
				this._pos.y += this._speed * this._initAcceleration * deltaTime;
			}
			else
			{
				this._pos.x += this._speed * this._initAcceleration * deltaTime;
			}
		}
	}

	window.Axis = Axis;
}