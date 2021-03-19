"use strict";

{
	class GuiPopupRenderer extends Renderer
	{
		constructor()
		{
			super();
			
			this._borderColor = 0;
			
			this._container = new Shape();
		}
		
		get Width()
		{
			return this._logic.ExternalParameters["Width"];
		}

		get Height()
		{
			return this._logic.ExternalParameters["Height"];
		}

		childInit(params)
		{
			this._borderColor = params[0];
		}
		
		initComplete()
		{
			this.draw();
		}
		
		concreteDraw()
		{
			this._container.uncache();

			this._container.graphics.clear();
			ShapeUtils.drawRectangle(this._container, 0, 0, this._logic.ExternalParameters["Width"], this._logic.ExternalParameters["Height"], 10, this._borderColor);

			this._container.cache(0, 0, this._logic.ExternalParameters["Width"], this._logic.ExternalParameters["Height"]);
		}
		
		addToStage()
		{
			super.addToStage();
		}
		
		concreteAddAddToStage()
		{
			this.bringToFront();
		}
	}

	window.GuiPopupRenderer = GuiPopupRenderer;
}