"use strict";

{
	class Vortex extends Base_Particle
	{
		constructor()
		{
			super();

			this._speed = 0;
			this._moveAngle = 0;
			this._distance = 0;
			this._endXOffset = 0;
			this._endYOffset = 0;
			this._dir = new Point();
		}
		
		InitSpecific(specificProps)
		{
			this._speed      = NumberUtils.randRange(specificProps[0].x, specificProps[0].y, true);
			this._endXOffset = specificProps[1];
			this._endYOffset = specificProps[2];
			
			this._rotation = NumberUtils.randRange(0, Math.PI * 2);
		}
		
		Movement(deltaTime)
		{
			this._moveAngle = TrigUtils.calcAngleAtan2(this._pos.x, this._pos.y, this._unprocessedPos.x + this._endXOffset, this._unprocessedPos.y + this._endYOffset);
			this._dir       = VectorUtils.calcMoveVector(this._moveAngle, this._dir, this._speed, false);
			this._distance  = VectorUtils.calcDistanceXY(this._pos.x, this._pos.y, this._unprocessedPos.x + this._endXOffset, this._unprocessedPos.y + this._endYOffset);
			
			this._rotation += 0.017 * 4;
			
			if (this._distance > 1)
			{
				this._pos.x = (this._unprocessedPos.x + this._endXOffset) + Math.cos(this._rotation) * this._distance;
				this._pos.y = (this._unprocessedPos.y + this._endYOffset) + Math.sin(this._rotation) * this._distance;
				
				this._pos.x += this._dir.x * deltaTime;
				this._pos.y += this._dir.y * deltaTime;
			}
			else
			{
				this._life = 0;
			}
		}
	}

	window.Vortex = Vortex;
}