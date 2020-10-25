"use strict";

{
	class Radial extends Base_Particle
	{
		constructor(x, y, rotation, width, height, color, life, visible)
		{
			super(x, y, rotation, width, height, color, life, visible);
		}

		InitSpecific(specificProps)
		{
			this._rotation = this.RandRange(0, 360);
			this._rotation = this._rotation * (Math.PI / 180);
			
			let speed = NumberUtils.randRange(specificProps[0].x, specificProps[0].y, true);
			this._dir = new Point(Math.cos(this._rotation) * speed, Math.sin(this._rotation) * speed);
			
			if (specificProps[1])
			{
				this._pos.x += Math.cos(this._rotation) * specificProps[1];
				this._pos.y += Math.sin(this._rotation) * specificProps[1];
			}
		}
		
		Movement()
		{
			let speedModifier = NumberUtils.normalize(this._life, 0, this._maxLife);

			this._pos.x += this._dir.x * speedModifier;
			this._pos.y += this._dir.y * speedModifier;
		}
		
		CleanSpecific()
		{
			
		}
	}

	self.Radial = Radial;
}