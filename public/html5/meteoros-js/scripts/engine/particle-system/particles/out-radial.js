"use strict";

{
	class OutRadial extends Base_Particle
	{
		
		constructor()
		{
			super();

			this._dir = new Point();
			
			this._speedModifier = 0;
			this._speed = 0;
			this._accelerationRate = 0;
			this._accelerationRateScalar = 0;
		}
		
		InitSpecific(specificProps)
		{
			this._rotation = NumberUtils.randRange(specificProps[0].x, specificProps[0].y, true) * NumberUtils.TO_RADIAN;
			this._speed = NumberUtils.randRange(specificProps[1].x, specificProps[1].y, true);
			
			this._pos.x += Math.cos(this._rotation) * specificProps[2];
			this._pos.y += Math.sin(this._rotation) * specificProps[2];
			
			this._dir = VectorUtils.calcMoveVector(this._rotation, this._dir, 1, false);
				
			this._accelerationRate       = 0
			this._accelerationRateScalar = specificProps[3];
		}

		Movement(deltaTime)
		{
			if (this._speed > 1)
			{
				this._speed -= this._accelerationRate;
				this._accelerationRate += deltaTime * this._accelerationRateScalar;
			}
			else
			{
				this._life = 0;
			}
			
			this._pos.x += this._dir.x * this._speed;
			this._pos.y += this._dir.y * this._speed;
		}
	}

	window.OutRadial = OutRadial;
}