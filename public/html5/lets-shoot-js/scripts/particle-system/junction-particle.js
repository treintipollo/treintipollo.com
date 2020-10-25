"use strict";

{
	class Junction extends Base_Particle
	{
		
		constructor(x, y, rotation, width, height, color, life, visible)
		{
			//Init super class
			super(x, y, rotation, width, height, color, life, visible);
			
			this._radius = 0;
			this._oldposX = 0;
			this._oldposY = 0;
			this._speed = 0;
			this._dist = new Point();

			//Init base class properties
			this._rotation = NumberUtils.randRange(0, 360);
			this._rotation = this._rotation * (Math.PI / 180);
			this._dir = new Point(Math.cos(this._rotation), Math.sin(this._rotation));
		}

		InitSpecific(specificProps)
		{
			let tempradX = 0;
			let tempradY = 0;
			
			this._oldposX = this._pos.x;
			this._oldposY = this._pos.y;
			this._radius = specificProps[0];
			this._speed  = NumberUtils.randRange(specificProps[1].x, specificProps[1].y);
			
			tempradX = NumberUtils.randRange(0, this._radius);
			tempradY = NumberUtils.randRange(0, this._radius);
			
			this._pos.x += (Math.cos(this._rotation) * tempradX);
			this._pos.y += (Math.sin(this._rotation) * tempradY);
			this._dist.x = this._oldposX - this._pos.x;
			this._dist.y = this._oldposY - this._pos.y;
			this._rotation = Math.atan(this._dist.y / this._dist.x);
			
			if (this._dist.x < 0 )
			{
				this._dir = new Point(-Math.cos(this._rotation), -Math.sin(this._rotation));
			}
			else
			{
				this._dir = new Point(Math.cos(this._rotation), Math.sin(this._rotation));
			}
			
			if (this._dist.x < 0)
			{
				this._dist.x = -this._dist.x
			}

			if (this._dist.y < 0)
			{
				this._dist.y = -this._dist.y
			}
		}

		Movement()
		{
			this._pos.x += this._dir.x * this._speed;
			this._pos.y += this._dir.y * this._speed;
			this._dist.x -= this._speed;
			this._dist.y -= this._speed;

			if (this._dist.x <= 0 && this._dist.y <= 0)
			{
				this._life = 0;
			}
		}
	}

	self.Junction = Junction;
}