"use strict";

{
	class SplashButtonManager
	{
		constructor(stage)
		{
			this._stage = stage;
			this._button = [];
			this._buttonPressed = -1;

			this._font = "";
			this._size = 0;
			this._color = 0;
			this._feedbackColor = 0;
			
			this._scale = 0;
			this._dispersionRate = 0;
			this._fadeInSpeed = 0;
			this._chunksX = 0;
			this._chunksY = 0;
			this._smallImage = false;
		}

		SetText(font, size, color, feedbackColor)
		{
			this._font = font;
			this._size = size;
			this._color = color;
			this._feedbackColor = feedbackColor;
		}
		
		SetAnim(scale, dispersionRate, fadeInSpeed, chunksX, chunksY, smallImage = false)
		{
			this._scale = scale;
			this._dispersionRate = dispersionRate;
			this._fadeInSpeed = fadeInSpeed;
			this._chunksX = chunksX;
			this._chunksY = chunksY;
			this._smallImage = smallImage;
		}
		
		Add(x, y, text, center = false)
		{
			this._button.push(
				new SplashButton(x, y, text, this._font, this._size, this._color, this._feedbackColor, this._stage)
			);

			this._button[this._button.length-1].Init(this._scale, this._dispersionRate, this._fadeInSpeed, this._chunksX, this._chunksY, this._smallImage, center);
		}
		
		Update(click)
		{
			var buttonsDone = 0;
			
			for(let i = 0; i < this._button.length; i++)
			{
				if (this._buttonPressed !== -1)
				{
					if (this._button[i].Update(true))
					{
						buttonsDone++;
					}
				}
				else
				{
					if (this._button[i].CheckCollision(click))
					{
						this._buttonPressed = i;
					}
					
					this._button[i].Update(false);
				}
			}
			
			if (buttonsDone >= this._button.length)
			{
				return true;
			}
			
			return false;
		}
		
		GetButtonPressedIndex()
		{
			return this._buttonPressed;
		}
		
		WasButtonPressed()
		{
			if(this._buttonPressed !== -1)
				return true;
			
			return false;
		}
		
		Clean()
		{
			for (let i = 0; i < this._button.length; i++)
				this._button[i].Clean();

			this._button = null;
			this._stage = null;
		}
	}

	window.SplashButtonManager = SplashButtonManager;
}