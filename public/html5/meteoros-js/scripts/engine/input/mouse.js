"use strict";

{
	class MouseObject
	{
		constructor(stage)
		{
			this._customPointer = null;

			this._frameCount 			= 0;
			this._mousePressedFrame  	= -1;
			this._mouseReleasedFrame 	= -1;
			this._stage 				= stage;
			this._pressed				= false;
			
			this._on_mouse_down = (e) => this.onMouseDown(e);
			this._on_mouse_up = (e) => this.onMouseUp(e);
			this._on_mouse_move = (e) => this.onMouseMove(e);

			this._stage.addEventListener("stagemousedown", this._on_mouse_down);
			this._stage.addEventListener("stagemouseup", this._on_mouse_up);
		}
		
		setVisuals(customPointer)
		{
			if (this._customPointer)
			{
				this._stage.removeChild(this._customPointer);
			}
			
			this._stage.addChild(customPointer);
			this._customPointer = customPointer;
		}
		
		justClicked()
		{
			return this._mousePressedFrame === this._frameCount;
		}
		
		justReleased()
		{
			return this._mouseReleasedFrame === this._frameCount;
		}
		
		isPressed()
		{
			return this._pressed && this._mousePressedFrame !== this._frameCount;
		}
		
		show()
		{
			if (this._customPointer)
				this._customPointer.visible = true;
		}

		hide()
		{
			if (this._customPointer)
				this._customPointer.visible = false;
		}
		
		xPos()
		{
			return this._stage.mouseX;
		}
		
		yPos()
		{
			return this._stage.mouseY;
		}
		
		update()
		{
			if (this._customPointer)
			{
				this._stage.setChildIndex(this._customPointer, this._stage.numChildren - 1);
				
				this._customPointer.x = this._stage.mouseX;
				this._customPointer.y = this._stage.mouseY;
			}
			
			this._frameCount++;
		}
		
		destroy()
		{
			this._stage.removeEventListener("mousedown", this._on_mouse_down);
			this._stage.removeEventListener("pressup", this._on_mouse_up);
			
			this._stage = null;
		}
		
		onMouseDown()
		{
			this._mousePressedFrame = this._frameCount;
			this._pressed = true;
		}
		
		onMouseUp()
		{
			this._mouseReleasedFrame = this._frameCount;
			this._pressed = false;
		}
	}

	window.MouseObject = MouseObject;
}