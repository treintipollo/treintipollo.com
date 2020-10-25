"use strict";

{
	class Button
	{
		constructor(pos, text, font, size, color, stage)
		{
			this._color = color;
			this._initColor = color;
			this._string = text;
			this._pos = pos;
			this._toolTipPos = this._pos.clone()
			this._stage = stage;
			this._font = font;
			this._size = size;
			
			this._text = new Text(this._pos, font, size, color, stage, true, true, 0xff000000, true, 0xffffffff);
			this._text.Update(text, color, true, true);
			
			this._lastFrameClick = false;
			this._isToolTipVisible = false;
			this._playMouseOverFeedback = true;
			this._toolTipText = null;
			this._toolTipString = "";
			this._toolTipOffset = 0;
		}
		
		SetToolTip(text, offSet)
		{
			this._toolTipOffset = offSet;
			this._toolTipString = text;
			this._toolTipText = new Text(this._toolTipPos, this._font, this._size, this._initColor, this._stage, true, true, 0xff000000, true, 0xffffffff);
			this._toolTipText.Update(this._toolTipString, this._initColor, true, true, true);
		}
		
		GetText()
		{
			return this._text;
		}
		
		UpdatePos(deltaX, deltaY)
		{
			this._pos.x += deltaX;
			this._pos.y += deltaY;
		}
		
		CheckCollision(click)
		{
			const textField = this._text.GetTextField();

			if ((this._stage.mouseX > textField.x) && (this._stage.mouseX <= textField.width + textField.x))
			{
				if ((this._stage.mouseY > textField.y) && (this._stage.mouseY <= textField.height + textField.y))
				{
					if (!click && this._lastFrameClick)
					{
						this._lastFrameClick = click;
						return true;
					}
					else
					{
						this._color = 0xffffffff;
						
						if (this._toolTipText !== null)
						{
							this._toolTipPos.x = textField.x + this._text._dimentions.x + this._toolTipOffset;
							this._toolTipPos.y = textField.y;
							
							this._toolTipText.Update(this._toolTipString, this._initColor, false, true, true);
							this._isToolTipVisible = true;
						}
						
						if (this._playMouseOverFeedback)
						{
							SoundManager.Play(Sounds.MENU_BUTTON_OVER);
							this._playMouseOverFeedback = false;
						}
					}
				}
				else
				{
					this._color = this._initColor;
					
					if (this._toolTipText !== null)
					{
						this._toolTipText.Update(this._toolTipString, this._initColor, false, true, false);
						this._isToolTipVisible = false;
					}
					
					this._playMouseOverFeedback = true;
				}
			}
			else
			{
				this._color = this._initColor;
				
				if (this._toolTipText !== null)
				{
					this._toolTipText.Update(this._toolTipString, this._initColor, false, true, false);
					this._isToolTipVisible = false;
				}

				this._playMouseOverFeedback = true;
			}
			
			this._lastFrameClick = click;
			
			return false;
		}
		
		Update(alpha, centralize = true, alwaysOnTop = true, visible = true, newString = null)
		{
			if (newString === null)
			{
				this._text.Update(this._string, this._color, centralize, alwaysOnTop, visible, alpha);
			}
			else
			{
				this._text.Update(newString, this._color, centralize, alwaysOnTop, visible, alpha);
			}
			
			if (this._isToolTipVisible)
			{
				if (alpha !== 0 && alpha !== 1)
					this._toolTipText.Update(this._toolTipString, this._initColor, false, true, true, alpha);
			}
		}
		
		UpdateTooltipText(text)
		{
			if (this._toolTipText !== null)
				this._toolTipString = text;
		}
		
		Clean()
		{
			if (this._toolTipText !== null)
			{
				this._toolTipText.Clean();
				this._toolTipText = null;
			}
			
			this._text.Clean();
			this._text = null;
			this._pos = null;
			this._stage = null;
			this._toolTipPos = null;
		}
	}

	window.Button = Button;
}