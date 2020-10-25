 "use strict";

{
	class Data
	{
		constructor(x, y, w, h)
		{
			this._frameDivision = null;
			this._moveX = 0;
			this._moveY = 0;
			this._fadeOutSpeed = 0;
			this._distance = 0;

			this._x = x;
			this._y = y;
			this._w = w;
			this._h = h;
		}

		Clean()
		{
			this._frameDivision = null;
		}
	}

	class SplashImage
	{
		constructor(image, stage)
		{
			this._frame = image;
			this._stage = stage;
			
			this._frame.alpha = 0;
			this._stage.addChild(this._frame);

			this._pos = null;
			
			this._chunksX = 0;
			this._chunksY = 0;
			
			this._data = [];

			this._divide = true;
			this._dispersionRate = 0;
			
			this._isFadingIn = true;
			this._fadeInSpeed = 0;
			this._isSmallImage = false;
			this._fadeOutOffset = 0;
			
			this._isButton = false;
			
			this._redComponent = 0;
			this._greenComponent = 0;
			this._blueComponent = 0;
			this._alphaComponent = 0;

			this._sizePromise = null;

			this._width = 0;
			this._height = 0;
			this._hitArea = null;

			if (image.image.width === 0 || image.image.height === 0)
			{
				this._sizePromise = new Promise((resolve) =>
				{
					image.image.onload = resolve;
				});

				this._sizePromise.then(() =>
				{
					this._width = image.image.width;
					this._height = image.image.height;

					this._hitArea = new Shape();
					this._hitArea.graphics.clear().beginFill("black").drawRect(0, 0, this._width, this._height);
				});
			}
			else
			{
				this._sizePromise = Promise.resolve().then(() =>
				{
					this._width = image.image.width;
					this._height = image.image.height;

					this._hitArea = new Shape();
					this._hitArea.graphics.clear().beginFill("black").drawRect(0, 0, this._width, this._height);
				});
			}
		}

		SetFeedBackColor(color)
		{
			const a = color >> 24 & 0xFF;
			const r = color >> 16 & 0xFF;
			const g = color >> 8 & 0xFF;
			const b = color & 0xFF;
			
			this._redComponent = NumberUtils.normalize(r, 0 , 0xFF);
			this._greenComponent = NumberUtils.normalize(g, 0 , 0xFF);
			this._blueComponent = NumberUtils.normalize(b, 0 , 0xFF);
			this._alphaComponent = NumberUtils.normalize(a, 0 , 0xFF);
		}

		Init(x, y, scale, dispersionRate, fadeInSpeed, chunksX, chunksY, smallImage = false, fadeOutOffset = 0, isButton = false, center = false)
		{
			this._pos = new Point(x, y);
			
			if (center)
			{
				this._frame.x = this._pos.x - this._width / 2;
				this._frame.y = this._pos.y - this._height / 2;
			}
			else
			{
				this._frame.x = this._pos.x;
				this._frame.y = this._pos.y;
			}
			
			this._frame.scaleX = scale;
			this._frame.scaleY = scale;
			
			this._isButton = isButton;
			
			this._on_mouse_over = (e) => this.MouseOver(e);
			this._on_mouse_out = (e) => this.MouseOut(e);

			this._frame.addEventListener("mouseover", this._on_mouse_over);
			this._frame.addEventListener("mouseout", this._on_mouse_out);
			
			this._chunksX = chunksX;
			this._chunksY = chunksY;
			this._dispersionRate = dispersionRate;
			this._fadeInSpeed = fadeInSpeed;
			this._isSmallImage = smallImage
			this._fadeOutOffset = fadeOutOffset;

			this._sizePromise.then(() =>
			{
				if (!this._frame || !this._pos)
					return;

				if (center)
				{
					this._frame.x = this._pos.x - this._width / 2;
					this._frame.y = this._pos.y - this._height / 2;
				}
				else
				{
					this._frame.x = this._pos.x;
					this._frame.y = this._pos.y;
				}
				
				ret.x = this._frame.x;
				ret.y = this._frame.y;

				this._frame.hitArea = this._hitArea;
				this.Divide();
			});

			const ret = new Point(0, 0);

			return ret;
		}

		Update(fadeOut)
		{
			if (this._isFadingIn)
			{
				if (this._frame.alpha <= 1)
				{
					this._frame.alpha += this._fadeInSpeed;
				}
				else
				{
					this._frame.alpha = 1;
					this._isFadingIn = false;
				}
			}
			else
			{
				if (fadeOut)
				{
					if (this._divide)
					{
						for (let i = 0; i < this._data.length; i++)
							this._data[i]._frameDivision.visible = true;

						this._divide = false;
						this.RemoveMainFrame();
					}
					
					return this.FadeOut();
				}
			}
			
			return false;
		}

		Clean()
		{
			for (let i = 0; i < this._data.length; i++)
			{
				this._stage.removeChild(this._data[i]._frameDivision);

				this._data[i].Clean();
				this._data[i] = null;
			}

			this.RemoveMainFrame();

			this._data = null;
			this._pos = null;
			this._stage = null;
			this._hitArea = null;
		}

		RemoveMainFrame()
		{
			if (this._stage && this._frame)
				this._stage.removeChild(this._frame);

			if (this._frame)
			{
				this._frame.removeEventListener("mouseover", this._on_mouse_over);
				this._frame.removeEventListener("mouseout", this._on_mouse_out);
			}

			this._on_mouse_over = null;
			this._on_mouse_out = null;

			this._frame = null;
		}

		Divide()
		{
			const cx = this._frame.x + this._width / 2;
			const cy = this._frame.y + this._height / 2;

			const w = this._width / this._chunksX;
			const h = this._height / this._chunksY;

			const hw = w / 2;
			const hh = h / 2;

			const spriteSheetBuilder = new createjs.SpriteSheetBuilder();
			
			const frames = [];

			for (let i = 0; i < this._chunksY; i++)
			{
				for (let j = 0; j < this._chunksX; j++)
				{
					const index = spriteSheetBuilder.addFrame(this._frame, new Rectangle(w * j, h * i, w, h));

					frames.push(index);
				}
			}

			spriteSheetBuilder.addAnimation("anim", frames);

			const spriteSheet = spriteSheetBuilder.build();

			let frameIndex = 0;

			for (let i = 0; i < this._chunksY; i++)
			{
				for (let j = 0; j < this._chunksX; j++)
				{
					const data = new Data(w * j, h * i, w, h);
					
					data._frameDivision = new Sprite(spriteSheet, "anim", 1);
					data._frameDivision.gotoAndStop(frameIndex);

					frameIndex++;

					data._frameDivision.x = this._frame.x;
					data._frameDivision.y = this._frame.y;
					data._frameDivision.visible = false;

					const deltaX = cx - (data._x + this._frame.x + hw);
					const deltaY = cy - (data._y + this._frame.y + hh);
					const length = Math.sqrt((deltaX * deltaX) + (deltaY * deltaY));

					this._stage.addChild(data._frameDivision);

					data._moveX = deltaX / length;
					data._moveY = deltaY / length;
					data._fadeOutSpeed = this._isSmallImage ? (1 / length) / 10 : 1 / length;
					data._distance = length;

					this._data.push(data);
				}
			}
			
			return false;
		}
		
		FadeOut()
		{
			let chunckAmount = this._chunksX * this._chunksY;
			let fadeOutCount = 0;
			
			for (let i = 0; i < chunckAmount; i++)
			{
				const data = this._data[i];
				const sprite = data._frameDivision;

				if (sprite.alpha > 0)
				{
					sprite.alpha -= data._fadeOutSpeed + this._fadeOutOffset;
					
					const d = data._distance / this._dispersionRate;

					sprite.x -= data._moveX * d;
					sprite.y -= data._moveY * d;
				}
				else
				{
					this._stage.removeChild(sprite);

					fadeOutCount++;
				}
			}
			
			return fadeOutCount >= chunckAmount;
		}
		
		MouseOver(e)
		{
			if (this._isButton)
			{
				if (this._frame !== null)
				{
					SoundManager.Play(Sounds.SPLASH_BUTTON_OVER);

					let matrix = [];
					
					matrix = matrix.concat([this._redComponent, this._redComponent, this._redComponent, 0, 0]);
					matrix = matrix.concat([this._greenComponent, this._greenComponent, this._greenComponent, 0, 0]);
					matrix = matrix.concat([this._blueComponent, this._blueComponent, this._blueComponent, 0, 0]);
					matrix = matrix.concat([0, 0, 0, this._alphaComponent, 0]);

					this._frame.filters = [];
					this._frame.filters[0] = new ColorMatrixFilter(matrix);

					this._frame.uncache();
					this._frame.cache(0, 0, this._width, this._height);
				}
			}
		}
		
		MouseOut(e)
		{
			if (this._isButton)
			{
				this._frame.filters = [];

				this._frame.uncache();
				this._frame.cache(0, 0, this._width, this._height);
			}
		}
	}

	window.SplashImage = SplashImage;
}