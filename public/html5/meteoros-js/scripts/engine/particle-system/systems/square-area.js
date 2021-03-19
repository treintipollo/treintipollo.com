"use strict";

{
	class SquareArea extends Base_System
	{
		constructor(particleClass, particleAmount)
		{
			super(particleClass, particleAmount);

			this._halfWidth = 0;
			this._halfHeight = 0;
			this._xOffset = 0;
			this._yOffset = 0;
		}
		
		InitSpecific(specificProps)
		{
			this._halfWidth  = specificProps[0];
			this._halfHeight = specificProps[1];
			this._xOffset    = specificProps[2];
			this._yOffset    = specificProps[3];
		}
		
		ProcessInitPos(x, y)
		{
			this._processedPos.x = NumberUtils.randRange(x - this._halfWidth , x + this._halfWidth , true) + this._xOffset;
			this._processedPos.y = NumberUtils.randRange(y - this._halfHeight, y + this._halfHeight, true) + this._yOffset;
		}
	}

	window.SquareArea = SquareArea;
}