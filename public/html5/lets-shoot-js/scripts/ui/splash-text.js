"use strict";

{
	class Data
	{
		constructor(x, y, w, h)
		{
			this._frameDivision = null;
			this._speedMeter = 0;
			this._width = 0;

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

	class SplashText
	{
		constructor(x, y, text, font, size, color, stage, centralize)
		{
			this._container = new Container();
			this._containerCanvas = null;
			this._textBitmap = null;
			this._underlineShape = new Shape();
			this._particleShapeMarker = new Shape();
			
			this._width = 0;
			this._height = 0;

			this._particleMarker = null;
			this._particleMarkerPos = null;
			this._mainColor = "";
			this._markerColor = "";
			this._markerSpeed = 0;
			this._markerColorNumber = 0;
			
			this._chunks = 0;
			this._scrollLeft = false;
			this._moveMax = 0;
			this._framesBeforeMove = 0;
			this._frameCounter = 0;
			this._exitSpeed = 0;
			this._fadeInSpeed = 0;

			this._stage = stage;
			
			this._data = [];
			this._pos = new Point(x, y);
			this._text = new Text(this._pos, font, size, color, null, true);
			this._text.Update(text, color);
			this._cen = centralize;

			this._divide = true;
			this._isFadingIn = true;
			this._useParticles = false;
		}

		Init(bgColor, underlineThickness, chunks)
		{
			this._chunks = chunks;
			this._moveMax = 1;
			this._frameCounter = 0;

			const textX = this._text.GetX();
			const textY = this._text.GetY();
			const textWidth = this._text.GetWidth();
			const textHeight = this._text.GetHeight();
			
			this._width = textWidth;
			this._height = textHeight + underlineThickness;

			// Draw the text and background before creating the bitmap

			this._textBitmap = DynamicGraphics.GetBitmapFromDisplayObject(
				this._text.GetDisplayObject(),
				textWidth,
				textHeight,
				-textX,
				0,
				(canvas, context) =>
				{
					context.fillStyle = createjs.Graphics.getRGBA(bgColor);
					context.fillRect(0, 0, canvas.width, canvas.height);
				}
			);

			if (this._cen)
			{
				this._container.x = this._pos.x - textWidth / 2;
				this._container.y = this._pos.y - textHeight / 2;
			}
			else
			{
				this._container.x = this._pos.x;
				this._container.y = this._pos.y;
			}

			this._container.alpha = 0;
			
			this._particleMarker = new Rectangle(0, textHeight, underlineThickness, underlineThickness);
			this._particleMarkerPos = new SharedPoint();
			this._particleMarkerPos.x = this._particleMarker.x + this._container.x + (this._particleMarker.width / 2);
			this._particleMarkerPos.y = this._particleMarker.y + this._container.y + (this._particleMarker.height / 2);

			// The underline
			this._underlineShape.graphics
				.clear()
				.beginFill(this._mainColor)
				.rect(0, textHeight, textWidth, underlineThickness);

			this._underlineShape.cache(0, textHeight, textWidth - 1, underlineThickness);

			// The sqaure moving along the underline
			this._particleShapeMarker.graphics
				.clear()
				.beginFill(this._markerColor)
				.rect(0, textHeight, underlineThickness, underlineThickness);

			this._particleShapeMarker.cache(0, textHeight, underlineThickness, underlineThickness);

			// Build the whole structure
			this._container.addChild(this._textBitmap);
			this._container.addChild(this._underlineShape);
			this._container.addChild(this._particleShapeMarker);

			// Add to the stage
			this._stage.addChild(this._container);

			if (this._useParticles)
			{
				ParticleSystemMessages.Send("splash-text", {
					pointBuffer: this._particleMarkerPos.buffer,
					width: this._particleMarker.width,
					height: this._particleMarker.height,
					color: this._markerColorNumber
				});
			}
		}
		
		SetMoveParams(fadeInSpeed, scrollLeft, acceleration, framesBeforeMove)
		{
			this._fadeInSpeed = fadeInSpeed;
			this._scrollLeft = scrollLeft;
			this._exitSpeed = acceleration;
			this._framesBeforeMove = framesBeforeMove;
		}
		
		SetUnderline(mainColor, markerColor, markerSpeed, useParticles)
		{
			this._mainColor = createjs.Graphics.getRGBA(mainColor);
			this._markerColor = createjs.Graphics.getRGBA(markerColor);
			this._markerColorNumber = markerColor;
			this._markerSpeed = markerSpeed;
			this._useParticles = useParticles;
		}
		
		Update(exit)
		{
			if (this._isFadingIn)
			{
				if (this._container.alpha <= 1)
				{
					this._container.alpha += this._fadeInSpeed;
				}
				else
				{
					this._container.alpha = 1;
					this._isFadingIn = false;
				}
			}
			else
			{
				if (!exit)
				{
					if (this._particleMarker.x < this._textBitmap.image.width - this._particleMarker.width)
					{
						this._particleMarker.x += this._markerSpeed;
					}
					else
					{
						this._particleMarker.x = 0;
					}

					this._particleMarkerPos.x = this._particleMarker.x + this._container.x + this._particleMarker.width / 2;
					this._particleMarkerPos.y = this._particleMarker.y + this._container.y + this._particleMarker.height / 2;

					this._particleShapeMarker.x = this._particleMarker.x;
				}
				else
				{
					if (this._divide)
					{
						DynamicGraphics.GetBitmapFromDisplayObject(
							this._container,
							this._width,
							this._height,
							0,
							0,
							(canvas, context) => this._containerCanvas = canvas
						);

						this.Divide(this._width, this._height)
						
						for (let i = 0; i < this._data.length; i++)
							this._data[i]._frameDivision.visible = this._container.visible;

						this._divide = false;
						this.RemoveMainFrame();
					}
					else
					{
						return this.ScrollOut();
					}
				}
			}
			
			return false;
		}
		
		Clean()
		{
			this._text.Clean();
			this._text = null;

			for (let i = 0; i < this._data.length; i++)
			{
				this._stage.removeChild(this._data[i]._frameDivision);
				
				this._data[i].Clean();
				this._data[i] = null;
			}
			
			this._container.removeChild(this._textBitmap);
			this._container.removeChild(this._underlineShape);
			this._container.removeChild(this._particleShapeMarker);
			this._stage.removeChild(this._container);

			this._container = null;
			this._containerCanvas = null;
			this._textBitmap = null;
			this._underlineShape = null;
			this._particleShapeMarker = null;

			this._data.length = 0;
			this._data = null;
			
			this._pos = null;
			this._stage = null;
			this._particleMarker = null;

			if (this._particleMarkerPos)
			{
				this._particleMarkerPos.Clean();
				this._particleMarkerPos = null;
			}
		}
		
		Divide(width, height)
		{
			let c = this._chunks;
			let w = Math.floor(width / c);
			let h = Math.floor(height);

			const rect = new Rectangle(0, 0, w, h);
			const frames = [];
			
			const spriteSheetBuilder = new createjs.SpriteSheetBuilder();

			for (let i = 0; i < c; i++)
			{
				const cnvs = new OffscreenCanvas(rect.width, rect.height);
			 	const cntx = cnvs.getContext("2d");

			 	cntx.drawImage(
					this._containerCanvas,
					(rect.width) * i,
					0,
					rect.width,
					rect.height,
					0,
					0,
					rect.width,
					rect.height
				);

				frames.push(spriteSheetBuilder.addFrame(new Bitmap(cnvs)));
			}

			spriteSheetBuilder.addAnimation("anim", frames);

			const spriteSheet = spriteSheetBuilder.build();

			let frameIndex = 0;

			for (let i = 0; i < c; i++)
			{
				const x = (rect.width) * i;
				const y = 0;
				
				const data = new Data(x, y, w, h);

				data._frameDivision = new Sprite(spriteSheet, "anim", 1);
				data._frameDivision.gotoAndStop(frameIndex);

				data._frameDivision.x = x + this._container.x;
				data._frameDivision.y = y + this._container.y;
				
				data._frameDivision.visible = false;

				frameIndex++;

				data._speedMeter = 0;
				data._width = w;
				
				this._stage.addChild(data._frameDivision);

				if (this._scrollLeft)
				{
					this._data.push(data);
				}
				else
				{
					this._data.unshift(data);
				}
			}
		}
		
		ScrollOut()
		{
			for (let i = 0; i < this._moveMax; i++)
			{
				const data = this._data[i];

				data._speedMeter += this._exitSpeed;

				if (this._scrollLeft)
				{
					data._frameDivision.x -= this._markerSpeed * data._speedMeter;
				}
				else
				{
					data._frameDivision.x += this._markerSpeed * data._speedMeter;
				}
			}
			
			if (++this._frameCounter >= this._framesBeforeMove)
			{
				if (this._moveMax < this._chunks)
					this._moveMax++;

				this._frameCounter = 0;
			}
			
			if (this._scrollLeft)
			{
				const data = this._data[this._data.length - 1];

				if (data._frameDivision.x < -data._width)
					return true;
			}
			else
			{
				const data = this._data[this._data.length - 1];

				if (data._frameDivision.x > this._stage.stageWidth + data._width)
					return true;
			}
			
			return false;
		}
		
		RemoveMainFrame()
		{
			this._stage.removeChild(this._container);
			
			if (this._particleMarkerPos)
			{
				this._particleMarkerPos.Clean();
				this._particleMarkerPos = null;
			}
		}

		Show()
		{
			this._container.visible = true;
		}

		Hide()
		{
			this._container.visible = false;
		}
	}

	window.SplashText = SplashText;
}