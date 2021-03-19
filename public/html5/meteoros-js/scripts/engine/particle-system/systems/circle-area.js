"use strict";

{
	class CircleArea extends Base_System
	{
		
		constructor(particleClass, particleAmount)
		{
			super(particleClass, particleAmount);
			
			this._maxRadius = 0;
			this._rand = 0;
			this._radius = 0;
		}
		
		InitSpecific(specificProps)
		{
			this._maxRadius = specificProps[0];
		}
		
		ProcessInitPos(x, y)
		{
			this._rand   = NumberUtils.randRange(0, Math.PI * 2);
			this._radius = NumberUtils.randRange(0, this._maxRadius, true);
			
			this._processedPos.x = x + Math.cos(this._rand) * this._radius;
			this._processedPos.y = y + Math.sin(this._rand) * this._radius;
		}
	}

	window.CircleArea = CircleArea;
}