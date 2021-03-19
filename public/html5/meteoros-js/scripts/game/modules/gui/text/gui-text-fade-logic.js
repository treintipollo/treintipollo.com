"use strict";

{
	class GuiTextFadeLogic extends GuiAlphaFade
	{
		constructor()
		{
			super();
		}
		
		childInit(params)
		{
			super.childInit(params);
			
			this._externalParameters["Text"]      = CollectionUtils.getItemOfType(params, String);
			this._externalParameters["TextColor"] = CollectionUtils.getItemOfType(params, Number);
		}
	}

	window.GuiTextFadeLogic = GuiTextFadeLogic;
}