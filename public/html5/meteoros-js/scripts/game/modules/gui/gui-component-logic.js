"use strict";

{
	class GuiComponentLogic extends Logic
	{
		
		constructor()
		{
			super();

			this._doFadeIn = false;
			this._doFadeOut = false;
			
			this._fadeInComplete = null;
			this._fadeOutComplete = null;
		}
		
		childInit(params)
		{
			this._fadeInComplete = CollectionUtils.getItemOfType(params, Function, 0);
			this._fadeOutComplete = CollectionUtils.getItemOfType(params, Function, 1);
			
			this._doFadeIn  = true;
			this._doFadeOut = false;
		}
		
		initComplete()
		{
			this._doFadeIn  = true;
			this._doFadeOut = false;
		}
		
		update(deltaTime)
		{
			if (this._doFadeIn)
			{
				if (this.fadeIn(deltaTime) && this._fadeInComplete)
				{
					this._fadeInComplete();
				}
			}
			
			if (this._doFadeOut)
			{
				if (this.fadeOut(deltaTime) && this._fadeOutComplete)
				{
					this._fadeOutComplete();
				}
			}
		}
		
		concreteRelease()
		{
			this._fadeInComplete  = null;
			this._fadeOutComplete = null;
		}
		
		startFadeIn()
		{
			this._doFadeIn  = true;
			this._doFadeOut = false;
		}
		
		startFadeOut()
		{
			this._doFadeIn  = false;
			this._doFadeOut = true;
		}
		
		fadeIn(deltaTime)
		{
			return false;
		}
		
		fadeOut(deltaTime)
		{
			return false;
		}
	}

	window.GuiComponentLogic = GuiComponentLogic;
}