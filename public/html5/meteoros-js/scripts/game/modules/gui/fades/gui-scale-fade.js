"use strict";

{
	class GuiScaleFade extends GuiComponentLogic
	{
		constructor()
		{
			super();
		}
		
		initComplete()
		{
			super.initComplete();
			
			this._scaleX = 0;
		}
		
		fadeIn(deltaTime)
		{
			if (this._scaleX < 1)
			{
				this._scaleX += deltaTime;
			}
			else
			{
				this._scaleX = 1
				this._doFadeIn = false;
			}
			
			return false;
		}
		
		fadeOut(deltaTime)
		{
			if (this._scaleX > 0)
			{
				this._scaleX -= deltaTime;
			}
			else
			{
				this._scaleX   = 0;
				this._doFadeOut = false;
				
				this._parent.Active = false;
			}
			
			return false;
		}
	}

	window.GuiScaleFade = GuiScaleFade;
}