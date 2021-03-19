"use strict";

{
	class GuiTextRotateLogic extends GuiTextLogic
	{
		constructor()
		{
			super();
			
			this._waitTime = 0;
		}
		
		initComplete()
		{
			this._scaleX = 5;
			this._scaleY = 5;
			this._waitTime = 3;
		}
		
		fadeIn(deltaTime)
		{
			if (this._scaleX > 1)
			{
				this._scaleX -= deltaTime * 10;
				this._scaleY -= deltaTime * 10;
				this._rotation += 25;
			}
			else
			{
				this._scaleX = 1;
				this._scaleY = 1;
				this._rotation = 10;
				
				if (this._waitTime > 0)
				{
					this._waitTime -= deltaTime;
				}
				else
				{
					return true;
				}
			}
			
			return false;
		}
	}

	window.GuiTextRotateLogic = GuiTextRotateLogic;
}