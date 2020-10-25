"use strict";

{
	class FireWorks extends Base_Particle
	{
		constructor(x, y, rotation, width, height, color, life, visible)
		{
			super(x, y, rotation, width, height, color, life, visible);
			
			this._speed = 0;
			this._gravity = 0;
			this._offsetY = 0;
			this._deaccel = 0;
			this._deaccelAmount = 0;

			this._rotation = this.RandRange(0, 360);
			this._rotation = this._rotation*(Math.PI / 180);
			this._dir = new Point(Math.cos(this._rotation) * 2, Math.sin(this._rotation) * 2);
			
			this._deaccel = 0;
		}

		InitSpecific(specificProps)
		{
			this._speed = this.RandRange(specificProps[0].x, specificProps[0].y);
			this._gravity = specificProps[1];
			this._offsetY = this.RandRange(specificProps[2].x, specificProps[2].y);
			this._deaccelAmount = this.RandRange(specificProps[3].x, specificProps[3].y);
		}
		
		Movement()
		{
			this._deaccel += this._deaccelAmount;
			this._pos.x += (this._dir.x) * this._speed;
			this._pos.y += (this._dir.y + (this._gravity * this._deaccel) - this._offsetY) * this._speed;
		}
		
		CleanSpecific()
		{
			
		}
	}

	self.FireWorks = FireWorks;
}