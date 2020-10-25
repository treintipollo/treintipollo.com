"use strict";

{
	class CircleArea extends Base_System
	{
		constructor(maxRadius)
		{
			super();
			
			this._maxRadius = maxRadius;
		}
		
		ProcessInitPos(x, y)
		{
			const rand = NumberUtils.randRange(0, Math.PI * 2);
			const radius = NumberUtils.randRange(0, this._maxRadius, true);
			
			this._resultPos = new Point(x + Math.cos(rand) * radius, y + Math.sin(rand) * radius);
			
			return this._resultPos;
		}
		
		CleanSpecific()
		{

		}
	}

	self.CircleArea = CircleArea;
}