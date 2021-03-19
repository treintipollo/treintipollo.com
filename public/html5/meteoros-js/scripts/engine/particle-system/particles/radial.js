"use strict";

{
	class Radial extends Base_Particle
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
			this._rotation = NumberUtils.randRange(0, 360, true) * NumberUtils.TO_RADIAN;
			
			this._speed = NumberUtils.randRange(specificProps[0].x, specificProps[0].y, true);
			this._acc = typeof specificProps[1] === "number" ? specificProps[1] : 2;
			this._accMod = typeof specificProps[2] === "number" ? specificProps[2] : -0.05;

			this._dir.x = Math.cos(this._rotation) * this._speed;
			this._dir.y = Math.sin(this._rotation) * this._speed;
			
			this._angle = this._rotation;
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

	window.Radial = Radial;
}