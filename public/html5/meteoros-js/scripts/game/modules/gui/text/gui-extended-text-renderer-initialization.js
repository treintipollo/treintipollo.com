"use strict";

{
	class GuiExtendedTextRendererInitialization
	{
		constructor()
		{
			this._align = "left";
		}
		
		setTextAlign(align)
		{
			this._align = align;
		}

		getTextAlign()
		{
			return this._align;
		}
		
		isDestroyable()
		{
			return true;
		}
		
		destroy()
		{

		}
	}

	window.GuiExtendedTextRendererInitialization = GuiExtendedTextRendererInitialization;
}