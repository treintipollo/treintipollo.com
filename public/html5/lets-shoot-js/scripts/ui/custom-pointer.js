"use strict";

{
	let image = null;

	class CustomPointer
	{
		constructor(stage)
		{
			this._stage = stage;
			
			if (!image)
			{
				image = Images._pointer;
				this._stage.addChild(image);
			}
			
			image.x = this._stage.mouseX;
			image.y = this._stage.mouseY;
			image.visible = true;
		}

		Update()
		{
			image.visible = true;
			image.x = this._stage.mouseX;
			image.y = this._stage.mouseY;
			
			this._stage.setChildIndex(image, this._stage.numChildren - 1);
		}

		Clean()
		{
			image.visible = false;
			this._stage = null;
		}
	}

	window.CustomPointer = CustomPointer;
}