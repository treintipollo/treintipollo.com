"use strict";

{
	class GuiAlphaFade extends GuiComponentLogic
	{
		constructor()
		{
			super();
		}
		
		initComplete()
		{
			super.initComplete();
			
			this._alpha = 0;
		}
		
		fadeIn(deltaTime)
		{
			if (this._alpha < 1)
			{
				this._alpha += deltaTime;
			}
			else
			{
				this._alpha = 1
				this._doFadeIn = false;
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

	window.GuiAlphaFade = GuiAlphaFade;
}