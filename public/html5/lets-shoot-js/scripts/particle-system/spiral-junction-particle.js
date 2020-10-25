"use strict"

{
	class SpiralJunction extends Base_Particle
	{
		constructor(x, y, rotation, width, height, color, life, visible)
		{
			super(x, y, rotation, width, height, color, life, visible);
			
			this._initRadius = 0;
			this._offset = null;
		}
		
		InitSpecific(specificProps)
		{
			this._rotation = NumberUtils.randRange(0, 360);
			this._rotation = this._rotation * (Math.PI / 180);
			
			this._initRadius = NumberUtils.randRange(0,specificProps[0]);
			this._offset = specificProps[1];
			
			this._pos.x += Math.cos(this._rotation) * this._initRadius;
			this._pos.y += Math.sin(this._rotation) * this._initRadius;
		}
		
		Movement()
		{
			let radiusModifier = NumberUtils.normalize(this._life, 0, this._maxLife);
			
			this._rotation += (0.017 * radiusModifier) * 10;
			
			this._pos.x = this._offset.x + Math.cos(this._rotation) * (this._initRadius * radiusModifier);
			this._pos.y = this._offset.y + Math.sin(this._rotation) * (this._initRadius * radiusModifier);
		}
		
		CleanSpecific()
		{
			this._offset = null;
		}
	}

	self.SpiralJunction = SpiralJunction;
}