"use strict";

{
	class MinRadius extends Base_System
	{
		constructor(minRadius, interpolateRadius = true)
		{
			super();
			
			this._minRadius = minRadius;
			this._interpolateRadius = interpolateRadius;
		}
		
		ProcessInitPos(x, y)
		{
			let rand = NumberUtils.randRange(0, Math.PI * 2);
			let radius;
			
			if (this._interpolateRadius)
			{
				radius = (NumberUtils.normalize(this._systemLife, 0, this._maxLife)) * this._minRadius;
			}
			else
			{
				radius = this._minRadius;
			}
			
			this._resultPos = new Point(x + Math.cos(rand) * radius, y + Math.sin(rand) * radius);
			
			return this._resultPos;
		}
		
		CleanSpecific()
		{

		}
	}

	self.MinRadius = MinRadius;
}