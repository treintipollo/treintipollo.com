"use strict";

{
	class CrossHair
	{
		constructor(spacing, pieceWidth, pieceHeight)
		{
			this._shape = window.DynamicGraphics.GetSprite("cross-hair");
			
			this._shape.rotation += 45;
			this._shape.regX = 50;
			this._shape.regY = 50;
			this._shape.mouseEnabled = false;
		}
	}

	window.CrossHair = CrossHair;
}