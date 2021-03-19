"use strict";

{
	class GuiTextScaleLogic extends GuiScaleFade
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

	window.GuiTextScaleLogic = GuiTextScaleLogic;
}