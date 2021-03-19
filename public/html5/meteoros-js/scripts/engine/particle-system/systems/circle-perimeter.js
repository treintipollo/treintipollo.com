"use strict";

{
	class CirclePerimeter extends Base_System
	{
		constructor(particleClass, particleAmount)
		{
			super(particleClass, particleAmount);
			
			this._maxRadius = 0;
			this._minRadius = 0;
			this._decreaseRadius = 0;
			this._rand = 0;
		}
		
		InitSpecific(specificProps)
		{
			this._maxRadius = specificProps[0];
			this._minRadius = specificProps[1];
			this._decreaseRadius = specificProps[2];
		}
		
		ProcessInitPos(x, y)
		{
			this._rand = NumberUtils.randRange(0, Math.PI * 2);

			this._processedPos.x = x + Math.cos(this._rand) * this._maxRadius;
			this._processedPos.y = y + Math.sin(this._rand) * this._maxRadius;
		}
		
		OnBatchCreated()
		{
			this._maxRadius -= this._decreaseRadius;
		}
		
		Update(deltaTime)
		{
			if (this._maxRadius <= this._minRadius)
			{
				this._controller._clear = true;
			}
			
			super.Update(deltaTime);
		}

		SetRadius(radius)
		{
			this._maxRadius = radius;
		}
	}

	window.CirclePerimeter = CirclePerimeter;
}