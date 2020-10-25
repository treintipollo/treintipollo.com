"use strict";

{
	class Data
	{
		constructor()
		{
			this._frame = null;
		}

		Clean()
		{
			this._frame = null;
		}
	}

	class LevelEndSign
	{
		constructor(text, font, size, color, stage)
		{
			this._mainFrame = null;
			this._data = null;
		
			this._rect = null;
			this._text = null;
			this._stage = null;
			this._pos = null;
			
			this._textColor = 0;
			this._textPos = null;
			
			this._fadeInDone = false;
			this._fgColor = 0;
			
			this._isScrolling = false;
			this._scrollSpeed = 0;
			
			this._topLane = null;
			this._bottomLane = null;
			this._leftLane = null;
			this._rightLane = null;
			this._horizontalIncrease = 0;
			this._verticalIncrease = 0;
			this._laneCompletion = 0;

			this._stage = stage;
			this._textColor = color;
			this._textPos = new Point(-300, -300);
			
			this._text = new Text(this._textPos, font, size, this._textColor, null, true);
			this._text.Update(text, this._textColor);
			
			this._data = [];
			this._fadeInDone = false;
			this._isScrolling = false;
			this._fullRect = null;
			this._borderThickness = 0;
		}
		
		Init(x, y, fgColor, bgColor, borderThickness, scrollSpeed, chunksX, chunksY)
		{
			let textField = this._text.GetTextField();
			let width = Math.floor(textField.width + borderThickness * 2);
			let height = Math.floor(textField.height + borderThickness * 2);

			this._pos = new Point(x, y);
			this._fullRect = new Rectangle(0, 0, textField.width + borderThickness * 2, textField.height + borderThickness * 2);

			let _x = this._text.GetX();
			let _y = this._text.GetY();
			let _w = this._text.GetWidth();
			let _h = this._text.GetHeight();
			
			const canvas = new OffscreenCanvas(_w, _h);
			const context = canvas.getContext("2d");
			
			context.save();
			context.fillStyle = createjs.Graphics.getRGBA(bgColor);
			context.fillRect(0, 0, _w, _h);
			context.translate(-_x, 0);
			this._text.GetDisplayObject().draw(context, true);
			context.restore();

			this._text.Clean();
			this._text = null;

			this._lanesContainer = new Shape();
			this._mainFrame = new Bitmap(canvas);
			this._mainFrame.x = Math.floor(borderThickness + x - width / 2);
			this._mainFrame.y = Math.floor(borderThickness + y - height / 2);

			this._rect = new Rectangle(x, y, Math.floor(width / chunksX), Math.floor(height / chunksY));

			const spriteSheetBuilder = new createjs.SpriteSheetBuilder();
			
			const frames = [];

			for (let i = 0; i < chunksY; i++)
			{
				for (let j = 0; j < chunksX; j++)
				{
					const cnvs = new OffscreenCanvas(this._rect.width, this._rect.height);
					const cntx = cnvs.getContext("2d");

					cntx.drawImage(
						canvas,
						(this._rect.width) * j,
						(this._rect.height) * i,
						this._rect.width,
						this._rect.height,
						0,
						0,
						this._rect.width,
						this._rect.height
					);

					frames.push(spriteSheetBuilder.addFrame(new Bitmap(cnvs)));
				}
			}

			spriteSheetBuilder.addAnimation("anim", frames);

			const spriteSheet = spriteSheetBuilder.build();

			let frameIndex = 0;

			for (let i = 0; i < chunksY; i++)
			{
				for (let j = 0; j < chunksX; j++)
				{
					const data = new Data();
					
					data._frame = new Sprite(spriteSheet, "anim", 1);
					data._frame.gotoAndStop(frameIndex);

					frameIndex++;

					data._frame.x = ((this._rect.width) * j + (borderThickness + this._mainFrame.x));
					data._frame.y = ((this._rect.height) * i + (borderThickness + this._mainFrame.y));
					data._frame.alpha = 0;

					this._stage.addChild(data._frame);

					this._data.push(data);
				}
			}

			this._topLane    = new Rectangle(width, 0, 0, borderThickness);
			this._bottomLane = new Rectangle(0, height - borderThickness, 0, borderThickness);
			this._leftLane   = new Rectangle(0, 0, borderThickness, 0);
			this._rightLane  = new Rectangle(width - borderThickness, height, borderThickness, 0);
			
			this._rect = null;
			this._fgColor = fgColor;
			this._scrollSpeed = scrollSpeed;
			this._laneCompletion = 0;
			this._borderThickness = borderThickness;
		}
		
		Update()
		{
			if (!this._isScrolling)
			{
				if (!this._fadeInDone)
				{
					this.FadeIn();
				}
				else
				{
					this.Cover();
				}
			}
			else
			{
				return this.ScrollOut();
			}
			
			return false;
		}
		
		CleanParts()
		{
			for (let i = 0; i < this._data.length; i++)
				this._stage.removeChild(this._data[i]._frame);

			this._data.length = 0;
			this._data = null;
		}
		
		FadeIn()
		{
			for (let i = 0; i < this._data.length; i++)
			{
				const data = this._data[i];
				const prevData = this._data[i - 1];
				const lastData = this._data[this._data.length - 1];

				if (data._frame.alpha < 1)
				{
					if (i === 0)
					{
						data._frame.alpha += 0.2;
					}
					else
					{
						if (prevData._frame.alpha > 0.5)
						{
							data._frame.alpha += 0.2;
						}
					}
				}
				
				if (lastData._frame.alpha >= 1)
				{
					this._fadeInDone = true;
					
					this.AddMainFrame();
					this.CleanParts();
					
					break;
				}
			}
		}
		
		Cover()
		{
			this._laneCompletion += this._scrollSpeed / 1000;
			
			this._horizontalIncrease = NumberUtils.interpolate(this._laneCompletion, 0, this._fullRect.width);
			this._verticalIncrease = NumberUtils.interpolate(this._laneCompletion, 0, this._fullRect.height);
			
			if (this._topLane.width < this._fullRect.width)
			{
				this._topLane.x -= this._horizontalIncrease;
				this._topLane.width += this._horizontalIncrease;
			}
			
			if (this._bottomLane.width < this._fullRect.width)
			{
				this._bottomLane.width += this._horizontalIncrease;
			}
		
			if (this._leftLane.height < this._fullRect.height)
			{
				this._leftLane.height += this._verticalIncrease;
			}
			
			if (this._rightLane.height < this._fullRect.height)
			{
				this._rightLane.y -= this._verticalIncrease;
				this._rightLane.height += this._verticalIncrease;
			}

			this._lanesContainer.uncache();

			this._lanesContainer.graphics.clear();
			this._lanesContainer.graphics.beginFill(this._fgColor);
			this._lanesContainer.graphics.rect(this._topLane.x, this._topLane.y, this._topLane.width, this._topLane.height);
			this._lanesContainer.graphics.endFill();

			this._lanesContainer.graphics.beginFill(this._fgColor);
			this._lanesContainer.graphics.rect(this._bottomLane.x, this._bottomLane.y, this._bottomLane.width, this._bottomLane.height);
			this._lanesContainer.graphics.endFill();

			this._lanesContainer.graphics.beginFill(this._fgColor);
			this._lanesContainer.graphics.rect(this._leftLane.x, this._leftLane.y, this._leftLane.width, this._leftLane.height);
			this._lanesContainer.graphics.endFill();

			this._lanesContainer.graphics.beginFill(this._fgColor);
			this._lanesContainer.graphics.rect(this._rightLane.x, this._rightLane.y, this._rightLane.width, this._rightLane.height);
			this._lanesContainer.graphics.endFill();

			this._lanesContainer.cache(0, 0, this._fullRect.width - 1, this._fullRect.height);
			
			if (this._laneCompletion >= 1)
			{
				this._isScrolling = true;
			}
		}
		
		ScrollOut()
		{
			if (this._mainFrame.x < this._stage.stageWidth + this._fullRect.width)
			{
				this._mainFrame.x += this._scrollSpeed;
				this._lanesContainer.x += this._scrollSpeed;
			}
			else
			{
				return true;
			}
			
			return false;
		}
		
		AddMainFrame()
		{
			this._mainFrame.x = Math.floor(this._borderThickness + this._pos.x - this._fullRect.width / 2);
			this._mainFrame.y = Math.floor(this._borderThickness + this._pos.y - this._fullRect.height / 2);
			
			this._lanesContainer.x = this._mainFrame.x;
			this._lanesContainer.y = this._mainFrame.y;

			this._mainFrame.x += this._borderThickness;
			this._mainFrame.y += this._borderThickness;

			this._stage.addChild(this._lanesContainer);
			this._stage.addChild(this._mainFrame);
		}
		
		Clean()
		{
			this._stage.removeChild(this._mainFrame);
			this._mainFrame = null;
			
			this._stage.removeChild(this._lanesContainer);
			this._lanesContainer = null;

			if (this._text)
				this._text.Clean();
			
			this._rect = null;
			this._text = null;
			this._stage = null;
			this._pos = null;
			this._textPos = null;
			this._topLane = null;
			this._bottomLane = null;
			this._leftLane = null;
			this._rightLane = null;
			this._fullRect = null;
		}
	}

	window.LevelEndSign = LevelEndSign;
}