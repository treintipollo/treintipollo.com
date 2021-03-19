"use strict";

{
	class StraightLine extends Base_System
	{
		constructor(particleClass, particleAmount)
		{
			super(particleClass, particleAmount);
			
			this._startX = 0;
			this._startY = 0;
			this._endX = 0;
			this._endY = 0;
			
			this._dispertion = 0;
			this._rand = 0;
		}
		
		InitSpecific(specificProps)
		{
			this._startX 	 = specificProps[0].x;
			this._startY 	 = specificProps[0].y;
			this._endX 	   	 = specificProps[1].x;
			this._endY 	   	 = specificProps[1].y;
			this._dispertion = NumberUtils.randRange(specificProps[2].x, specificProps[2].y);
		}
		
		ProcessInitPos(x, y)
		{
			this._rand = Math.random();
			
			this._processedPos.x = NumberUtils.interpolate(this._rand, this._startX, this._endX);
			this._processedPos.y = NumberUtils.interpolate(this._rand, this._startY, this._endY);
			
			this._processedPos.x += this._dispertion;
			this._processedPos.y += this._dispertion;
		}
	}

	window.StraightLine = StraightLine;
}