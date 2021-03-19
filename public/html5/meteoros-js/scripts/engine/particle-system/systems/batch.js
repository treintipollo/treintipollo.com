"use strict";

{
	class Batch extends Base_System
	{
		constructor(particleClass, particleAmount)
		{
			super(particleClass, particleAmount);
			
			this._maxRadius = 0;
			this._calcNewPos = false;
			this._rand = 0;
			this._radius = 0;
			this._newX = 0;
			this._newY = 0;
		}
		
		InitSpecific(specificProps)
		{
			this._maxRadius  = specificProps[0];
			this._calcNewPos = true;
		}
		
		ProcessInitPos(x, y)
		{
			if (this._calcNewPos)
			{
				this._rand   = NumberUtils.randRange(0, Math.PI * 2);
				this._radius = NumberUtils.randRange(0, this._maxRadius, true);
				
				this._newX = x + Math.cos(this._rand) * this._radius;
				this._newY = y + Math.sin(this._rand) * this._radius;
				
				this._calcNewPos = false;
			}
			
			this._processedPos.x = this._newX;
			this._processedPos.y = this._newY;
		}
		
		OnBatchCreated()
		{
			this._calcNewPos = true;
		}
	}

	window.Batch = Batch;
}