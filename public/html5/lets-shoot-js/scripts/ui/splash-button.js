"use strict"

{
	class SplashButton
	{
		constructor(x, y, text, font, size, color, feedBackColor, stage)
		{
			this._pos = new Point(x, y);
			this._stage = stage;
			
			this._text = new Text(this._pos, font, size, color, stage, true, true, 0xff000000, true, 0xffffffff);
			this._text.Update(text, color);
			
			this._x = this._text.GetX();
			this._y = this._text.GetY();
			this._width = this._text.GetWidth();
			this._height = this._text.GetHeight();
			
			const canvas = new OffscreenCanvas(this._text.GetWidth(), this._text.GetHeight());
			const context = canvas.getContext("2d");
			
			context.save();
			context.translate(-this._x, 0);
			this._text.GetDisplayObject().draw(context, true);
			context.restore();

			this._image = new SplashImage(new Bitmap(canvas), this._stage);
			this._image.SetFeedBackColor(feedBackColor);
			
			this._text.Clean();
			this._text = null;
		}

		Init(scale, dispersionRate, fadeInSpeed, chunksX, chunksY, smallImage = false, center = false)
		{
			this._pos = this._image.Init(this._pos.x, this._pos.y, scale, dispersionRate, fadeInSpeed, chunksX, chunksY, smallImage, 0, true, center);
		}

		CheckCollision(click)
		{
			if ((this._stage.mouseX > this._pos.x) && (this._stage.mouseX <= this._width + this._pos.x))
			{
				if ((this._stage.mouseY > this._pos.y) && (this._stage.mouseY <= this._height + this._pos.y))
				{
					if(click)
					{
						SoundManager.Play(Sounds.SPLASH_BUTTON_PRESS);
						return true;
					}
				}
			}
			
			return false;
		}

		Update(click)
		{
			return this._image.Update(click);
		}
		
		Clean()
		{
			this._image.Clean();
			this._image = null;
			this._pos = null;
			this._stage = null;
		}
	}

	window.SplashButton = SplashButton;
}