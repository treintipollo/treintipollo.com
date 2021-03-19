"use strict";

{
	class FadeToBlackLogic extends GuiComponentLogic
	{
		constructor()
		{
			super();
			
			this._skipFadeIn = false;
			this._skipFadeOut = false;
		}
		
		childInit(params)
		{
			super.childInit(params);
			
			this._skipFadeIn  = CollectionUtils.getItemOfType(params, Boolean, 0);
			this._skipFadeOut = CollectionUtils.getItemOfType(params, Boolean, 1);
		}
		
		initComplete()
		{
			this._alpha = this._skipFadeIn ? 1 : 0;
		}
		
		fadeIn(deltaTime)
		{
			if (this._skipFadeIn)
			{
				this.startFadeOut();
			}
			else
			{
				if (this._alpha < 1)
				{
					this._alpha += deltaTime;
				}
				else
				{
					this._alpha = 1
					
					this.startFadeOut();
				}
			}
			
			return false;
		}
		
		fadeOut(deltaTime)
		{
			if (this._skipFadeOut)
			{
				this._parent.Active = false;
			}
			else
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
			}
			
			return false;
		}
	}

	window.FadeToBlackLogic = FadeToBlackLogic;
}