"use strict"

{
	class SplashManager
	{
		constructor(stage)
		{
			this._image = null;
			this._currentImage = null;
			
			this._font = "";
			this._size = 0;
			this._color = 0;
			this._bgColor = 0;
			this._divideAmount = 0;
			
			this._mainUnderline = 0;
			this._markerColor = 0;
			this._markerSpeed = 0;
			this._underlineThickness = 0;
			
			this._textFadeInSpeed = 0;
			this._scrollLeft = false;
			this._framesBeforeMove = 0;
			this._acceleration = 0;
			
			this._imageFadeInSpeed = 0;
			this._scale = 0;
			this._dispersionRate = 0;
			this._chunksX = 0;
			this._chunksY = 0;
			
			this._click = false;

			this._stage = stage;
			this._text = [];
			this._image = [];
			this._click = false;
			this._offScreenAmount = 0;
		}

		SetTextProps(font, size, color, bgColor, chuncks)
		{
			this._font = font;
			this._size = size;
			this._color = color;
			this._bgColor = bgColor;
			this._divideAmount = chuncks;
		}

		SetUnderlineProps(mainUnderline, markerColor, markerSpeed, thickness)
		{
			this._mainUnderline = mainUnderline;
			this._markerColor = markerColor;
			this._markerSpeed = markerSpeed;
			this._underlineThickness = thickness;
		}

		SetTextMovement(fadeIndSpeed, scrollLeft, framesBeforeMove, acceleration)
		{
			this._textFadeInSpeed = fadeIndSpeed;
			this._scrollLeft = scrollLeft;
			this._framesBeforeMove = framesBeforeMove;
			this._acceleration = acceleration;
		}

		AddText(x, y, text, useParticles = false, centralize = false)
		{
			if (Array.isArray(text))
			{
				for (let i = 0; i < text.length; i++)
				{
					const st = new SplashText(x, y, text[i], this._font, this._size, this._color, this._stage, centralize);

					st.index = i;
					st.multi = true;

					this._text.push(st);

					const t = this._text[this._text.length - 1];
				
					t.SetUnderline(this._mainUnderline, this._markerColor, this._markerSpeed, useParticles);
					t.SetMoveParams(this._textFadeInSpeed, this._scrollLeft, this._acceleration, this._framesBeforeMove);
					t.Init(this._bgColor, this._underlineThickness, this._divideAmount);
				}
			}
			else
			{
				const st = new SplashText(x, y, text, this._font, this._size, this._color, this._stage, centralize);

				st.index = 0;
				st.multi = false;

				this._text.push(st);
				
				const t = this._text[this._text.length - 1];
				
				t.SetUnderline(this._mainUnderline, this._markerColor, this._markerSpeed, useParticles);
				t.SetMoveParams(this._textFadeInSpeed, this._scrollLeft, this._acceleration, this._framesBeforeMove);
				t.Init(this._bgColor, this._underlineThickness, this._divideAmount);
			}
		}

		SetImage(image)
		{
			this._currentImage = image;
		}

		SetImageProps(scale, dispersionRate, fadeInSpeed, chunksX, chunksY)
		{
			this._scale = scale;
			this._dispersionRate = dispersionRate;
			this._imageFadeInSpeed = fadeInSpeed;
			this._chunksX = chunksX;
			this._chunksY = chunksY;
		}
		
		AddImage(x, y)
		{
			this._image.push(
				new SplashImage(this._currentImage, this._stage)
			);

			const i = this._image.length - 1;
			const img = this._image[i];

			img.Init(x, y, this._scale, this._dispersionRate, this._imageFadeInSpeed, this._chunksX, this._chunksY);
		}
		
		Update(click, showTextIndex = 0)
		{
			if (click)
			{
				this._click = true;
			}
			
			for (let i = 0; i < this._text.length; i++)
			{
				const text = this._text[i];

				if (!text.multi)
				{
					text.Show();
				}
				else if (text.index === showTextIndex)
				{
					text.Show();
				}
				else
				{
					text.Hide();
				}

				if (text.Update(this._click))
				{
					this._offScreenAmount++;
				}
			}
			
			for (let i = 0; i < this._image.length; i++)
			{
				if (this._image[i].Update(this._click))
				{
					this._offScreenAmount++;
				}
			}
			
			if (this._offScreenAmount >= this._text.length + this._image.length)
			{
				return true;
			}
			else
			{
				this._offScreenAmount = 0
				
				return false;
			}
			
			return false;
		}
		
		Clean()
		{
			for (let i = 0; i < this._text.length; i++)
			{
				this._text[i].Clean();
			}
			
			for (let i = 0; i < this._image.length; i++)
			{
				this._image[i].Clean();
			}
			
			this._text = null;
			this._stage = null;
			this._image = null;
			this._currentImage = null;
		}
	}

	window.SplashManager = SplashManager;
}