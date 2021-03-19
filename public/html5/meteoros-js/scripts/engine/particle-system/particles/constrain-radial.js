"use strict";

{
	class ConstrainRadial extends Base_Particle
	{
		constructor()
		{
			super();

			this._dir = new Point();
			this._speed = 0;
			this._acc = 0;
			this._accMod = 0;
		}
		
		InitSpecific(specificProps)
		{
			this._rotation += NumberUtils.randRange(specificProps[1].x, specificProps[1].y);
			this._speed = NumberUtils.randRange(specificProps[0].x, specificProps[0].y, true);
			this._dir = VectorUtils.calcMoveVector(this._rotation, this._dir);

			this._acc = typeof specificProps[2] === "number" ? specificProps[2] : 2;
			this._accMod = typeof specificProps[3] === "number" ? specificProps[3] : -0.05;
		}
		
		Movement(deltaTime)
		{
			this._pos.x += this._dir.x * (this._speed * this._acc) * deltaTime;
			this._pos.y += this._dir.y * (this._speed * this._acc) * deltaTime;

			this._acc += this._accMod;

			if (this._acc < 0)
				this._acc = 0;
		}
	}

	window.ConstrainRadial = ConstrainRadial;
}