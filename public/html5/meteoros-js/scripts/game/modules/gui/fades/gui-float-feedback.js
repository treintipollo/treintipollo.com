"use strict";

{
	class GuiFloatFeedback extends GuiComponentLogic
	{
		constructor()
		{
			super();

			this._speed = NaN;
			this._accel = NaN;
			this._accelSpeed = NaN;
			this._move = NaN;
		}
		
		childInit(params)
		{
			super.childInit(params);
			
			let initYOffset = CollectionUtils.getItemOfType(params, Number, 1);

			this._speed = CollectionUtils.getItemOfType(params, Number, 2);
			this._accelSpeed = CollectionUtils.getItemOfType(params, Number, 3);
			this._accel = 1;
			this._move = 0;

			if (!NumberUtils.isNumber(this._speed))
				this._speed = 30;

			if (!NumberUtils.isNumber(this._accelSpeed))
				this._accelSpeed = 0;

			if (NumberUtils.isNumber(initYOffset) && initYOffset !== 0)
			{
				this._posY -= initYOffset;
			}
			else
			{
				this._posY -= 40;
			}
			
			this._alpha = 0;
		}
		
		fadeIn(deltaTime)
		{
			if (this._alpha < 1)
			{
				this._alpha += deltaTime;

				const move = deltaTime * (this._speed * (this._accel));
				this._accel += this._accelSpeed;

				this._move += move;

				if (this._move <= 30)
				{
					this._posY -= move;
				}
			}
			else
			{
				this._alpha = 1
				this.startFadeOut();
			}
			
			return false;
		}
		
		fadeOut(deltaTime)
		{
			if (this._alpha > 0)
			{
				this._alpha -= deltaTime;
			}
			else
			{
				this._alpha   = 0;
				this._doFadeOut = false;
				this._parent.Active = false;
			}
			
			return false;
		}
	}

	window.GuiFloatFeedback = GuiFloatFeedback;
}