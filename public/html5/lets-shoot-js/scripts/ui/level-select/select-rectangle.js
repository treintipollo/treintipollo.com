"use strict";

{
	const CURSOR_BLICK = 0.017 * 7;

	const READY = 0
	const LOCK = 1
	const COMPLETE = 2
	const SECRET = 3
	const SECRET_COMPLETE = 4
	const BOSS = 5
	const LOCKED_SECRET = 6;

	class SelectRectangle
	{
		constructor(x, y, width, height)
		{
			this._rect = null;
			this._color = 0;
			this._cursorOn = false;
			this._cursorColor = 0;
			this._cursorMarker = null;
			
			this._text = null;
			this._state = 0;
			this._cursorBlinck = 0;
			this._textString = "";
			this._textColor = 0;
			this._textPos = null;
			this._stage = null;
			this._parentPos = null;
			this._coordinates = null;
			this._playMouseOverFeebBack = false;

			this._rect = new Rectangle(x, y, width, height);
			this._cursorOn = false;
			this._playMouseOverFeebBack = true;
			this._cursorBlinck = 0;
			
			this.SetMarker(width / 20);
		}
		
		static get READY()
		{
			return 0;
		};

		static get LOCK()
		{
			return 1;
		};

		static get COMPLETE()
		{
			return 2;
		};

		static get SECRET()
		{
			return 3;
		};

		static get SECRET_COMPLETE()
		{
			return 4;
		};

		static get BOSS()
		{
			return 5;
		};

		static get LOCKED_SECRET()
		{
			return 6;
		};

		SetText(pos, font, size, color, stage)
		{
			this._textColor = color;
			this._textPos = pos;
			this._text = new Text(pos, font, size, this._textColor, stage, true, true);
			
			this._stage = stage;
		}
		
		SetMiscProps(parentPos, coordinates)
		{
			this._parentPos = parentPos;
			this._coordinates = coordinates;
			
			parentPos = null;
			coordinates = null;
		}
		
		Update(speed = 0)
		{
			switch (this._state)
			{
				case READY:
					this._color = this._textColor;
					this._textString = "READY !";
					break;
				case LOCK:
					this._color = 0xff777777;
					this._textColor = 0xff777777;
					this._textString = "LOCKED";
					break;
				case COMPLETE:
					this._color = this._textColor;
					this._textString = "CLEAR !";
					break;
				case SECRET:
					this._color = 0xff45A4DD;
					this._textColor = 0xff45A4DD;
					this._textString = "SHOP !";
					break;
				case SECRET_COMPLETE:
					this._color = 0xff45A4DD;
					this._textColor = 0xff45A4DD;
					this._textString = "CLOSED";
					break;
				case BOSS:
					this._color = 0xff000000;
					this._textColor = 0xffffffff;
					this._textString = "BOSS !";
					break;
				case LOCKED_SECRET:
					this._color = 0xff45A4DD;
					this._textColor = 0xff45A4DD;
					this._textString = "LOCKED";
					break;
				
			}
			
			if (speed === 0)
			{
				if ((this._stage.mouseX > (this._rect.x + this._parentPos.x)) && (this._stage.mouseX <= (this._rect.x + this._rect.width+this._parentPos.x)))
				{
					if ((this._stage.mouseY > (this._rect.y + this._parentPos.y)) && (this._stage.mouseY <= (this._rect.y + this._rect.height+this._parentPos.y)))
					{
						this._cursorOn = true;
					}
					else
					{
						this._cursorOn = false;
					}
				}
				else
				{
					this._cursorOn = false;
				}
			}
			
			if (!this._cursorOn)
			{
				this._playMouseOverFeebBack = true;
			}
			
			this._textPos.x += speed;
			this._text.Update(this._textString, this._textColor, true);
		}
		
		UpdateCursor()
		{
			if (this._playMouseOverFeebBack)
			{
				SoundManager.Play(Sounds.SPLASH_BUTTON_OVER);
				this._playMouseOverFeebBack = false;
			}
			
			this._cursorBlinck += CURSOR_BLICK;
			let r = Math.abs(Math.sin(this._cursorBlinck) * 0xff);
			
			this._cursorColor = 0xff << 24 | r << 16;
		}
		
		GetCoordinates()
		{
			return this._coordinates;
		}
		
		SetState(state)
		{
			this._state = state;
		}
		
		GetState()
		{
			return this._state;
		}
		
		Clean()
		{
			for(let i = 0; i < this._cursorMarker.length; i++)
			{
				this._cursorMarker[i] = null;
			}
			
			this._text.Clean();
			
			this._text = null;
			this._cursorMarker = null;
			this._rect = null;
			this._stage = null;
			this._parentPos = null;
		}
		
		GetText()
		{
			return this._text.GetTextField();
		}
		
		SetMarker(thickness)
		{
			this._cursorMarker = new Array();
			
			this._cursorMarker.push(new Rectangle(0, 0, this._rect.width, thickness));
			this._cursorMarker.push(new Rectangle(0, 0, thickness, this._rect.height));
			this._cursorMarker.push(new Rectangle(this._rect.width - thickness, 0, thickness, this._rect.height));
			this._cursorMarker.push(new Rectangle(0, this._rect.height - thickness, this._rect.width, thickness));
		}
	}

	window.SelectRectangle = SelectRectangle;
}