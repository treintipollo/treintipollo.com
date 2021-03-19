"use strict";

{
	class ArrowPointer
	{
		constructor(headWidth, headHeight, bodyWidth, bodyHeight)
		{
			this._shape = window.DynamicGraphics.GetSprite("arrow-pointer");
			
			this._shape.rotation += 45;
			this._shape.regX = 20;
			this._shape.regY = 20;
			this._shape.mouseEnabled = false;
		}
	}

	window.ArrowPointer = ArrowPointer;
}