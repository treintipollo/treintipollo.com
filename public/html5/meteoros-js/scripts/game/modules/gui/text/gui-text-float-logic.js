"use strict";

{
	class GuiTextFloatLogic extends GuiFloatFeedback
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

	window.GuiTextFloatLogic = GuiTextFloatLogic;
}