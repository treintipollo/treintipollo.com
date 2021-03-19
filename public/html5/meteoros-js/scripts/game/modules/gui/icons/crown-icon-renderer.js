"use strict";
{
	class CrownIconRenderer extends Renderer
	{
		constructor()
		{
			super();

			this._container = window.DynamicGraphics.GetSprite("crown-icon");
		}
	}

	window.CrownIconRenderer = CrownIconRenderer;
}