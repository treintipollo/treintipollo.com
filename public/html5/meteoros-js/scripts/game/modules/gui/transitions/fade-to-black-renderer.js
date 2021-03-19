"use strict";

{
	class FadeToBlackRenderer extends Renderer
	{
		constructor()
		{
			super();

			this._container = new Shape();
		}
		
		initComplete()
		{
			this.draw();
		}
		
		concreteDraw()
		{
			this._container.uncache();
			
			this._container.graphics.clear();
			ShapeUtils.drawRectangle(this._container, 0, 0, this._stage.stageWidth, this._stage.stageHeight, 0, 0, 0);

			this._container.cache(0, 0, this._stage.stageWidth, this._stage.stageHeight);
		}
	}

	window.FadeToBlackRenderer = FadeToBlackRenderer;
}