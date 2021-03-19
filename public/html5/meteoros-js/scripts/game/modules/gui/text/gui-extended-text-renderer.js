"use strict";

{
	class GuiExtendedTextRenderer extends GuiTextRenderer
	{
		constructor()
		{
			super();
			
			this._initialization = null;
		}
		
		childInit(params)
		{
			super.childInit(params);
			
			this._initialization = CollectionUtils.getItemOfType(params, GuiExtendedTextRendererInitialization);
			
			this._text.SetTextAlign(this._initialization.getTextAlign());
		}
		
		concreteDestroy()
		{
			super.concreteDestroy();
			
			this._initialization = null;
		}
	}

	window.GuiExtendedTextRenderer = GuiExtendedTextRenderer;
}