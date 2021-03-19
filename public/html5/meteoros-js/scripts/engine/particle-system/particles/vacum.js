"use strict";

{
	class Vacum extends Base_Particle
	{
		constructor()
		{
			super();

			this._dir = new Point();
			
			this._speed = 0;
			this._moveAngle = 0;
			this._distance = 0;
			this._endXOffset = 0;
			this._endYOffset = 0;
		}
		
		InitSpecific(specificProps)
		{
			this._speed      = NumberUtils.randRange(specificProps[0].x, specificProps[0].y, true);
			this._endXOffset = specificProps[1];
			this._endYOffset = specificProps[2];
		}
		
		Movement(deltaTime)
		{
			this._moveAngle = TrigUtils.calcAngleAtan2(this._pos.x, this._pos.y, this._unprocessedPos.x + this._endXOffset, this._unprocessedPos.y + this._endYOffset);
			this._dir = VectorUtils.calcMoveVector(this._moveAngle, this._dir, this._speed, false);
			this._distance  = VectorUtils.calcDistanceXY(this._pos.x, this._pos.y, this._unprocessedPos.x + this._endXOffset, this._unprocessedPos.y + this._endYOffset);
			
			if (this._distance > 1)
			{
				this._pos.x += this._dir.x * deltaTime;
				this._pos.y += this._dir.y * deltaTime;
			}
			else
			{
				this._life = 0;
			}
		}
	}

	window.Vacum = Vacum;
}