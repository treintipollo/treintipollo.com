"use strict";

{
	class WarningSign
	{
		constructor(time, thickness, color, stage)
		{
			this._on = false;
			this._warningTime = 0;
			this._warningTimeInit = 0;
			this._body = null;
			this._thickness = 0;
			this._color = 0;
			this._stage = null;
			this._blinker = 0;
			this._blinkingSpeed = 0;

			this._warningTimeInit = time;
			this._warningTime = time;
			this._thickness = thickness;
			this._color = color;
			this._stage = stage;
			
			this._blinkingSpeed = time / 2;
			
			this._on = false;
		}
		
		Init(x, y, width, height)
		{
			this._body = DynamicGraphics.GetSprite(width > height ? "horizontal-warning" : "vertical-warning");
			
			this._stage.addChild(this._body);
			this._body.alpha = 0;
			this._blinker = 0;
		}
		
		Update()
		{
			if (this._warningTime > 0)
			{
				this._warningTime--;
				this._blinker += this._blinkingSpeed;
				this._body.alpha = Math.sin(this._blinker);
			}
			else
			{
				this.Reset();
			}
		}
		
		Reset()
		{
			this._blinker = 0;
			this._on = false;
			this._body.alpha = 0;
			this._warningTime = this._warningTimeInit;
		}
		
		Clean()
		{
			this._stage.removeChild(this._body);
			this._body = null;
			this._stage = null;
		}
	}

	window.WarningSign = WarningSign;
}