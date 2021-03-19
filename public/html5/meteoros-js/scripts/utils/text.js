"use strict";

{
	const HORIZONTAL_PADDING = 7;
	const VERTICAL_TOP_PADDING = 4;
	const VERTICAL_BOTTOM_PADDING = 5;
	const LINE_THICKNESS = 1;

	class Text
	{
		constructor(pos, font, size, color, stage = null, useEmbedFonts = false, useBackground = false, backgroundColor = 0xff000000, useBorder = false, borderColor = 0xff000000)
		{
			this._pos = pos;
			this._stage = stage;
			this._dimentions = new Point();
			this._textFieldStub = null;

			this._container = new Container();
			this._text = new createjs.Text("", `${size}px ${font}`, createjs.Graphics.getRGB(color, 1));

			this._borderColor = useBorder && borderColor;
			this._backgroundColor = useBackground && backgroundColor;

			this._background = ShapeUtils.createRectangleEx(0, 0, 1, 1);

			this._container.x = pos.x;
			this._container.y = pos.y;

			this._container.addChild(this._background);
			this._container.addChild(this._text);

			this._container.snapToPixel = true;
			this._background.snapToPixel = true;
			this._text.snapToPixel = true;

            if (this._stage)
            	this._stage.addChild(this._container);

            this._drawBackground = true;
            this._text.addEventListener("cacheText", () =>
            {
            	this._drawBackground = true;
            });
		}

		SetTextAlign(align)
		{
			this._text.textAlign = align;
		}

		Update(string, color, centralize = false, alwaysOnTop = false, visible = true, alpha = 1)
		{
			this._text.text = string;
			this._text.color = createjs.Graphics.getRGB(color, 1);

			this._container.alpha = alpha;

			if (centralize)
			{
				this._container.x = this._pos.x - this._text.width / 2;
				this._container.y = this._pos.y - this._text.height / 2;
			}
			else
			{
				this._container.x = this._pos.x;
				this._container.y = this._pos.y;
			}

			this._container.x = Math.floor(this._container.x);
			this._container.y = Math.floor(this._container.y);

			this._dimentions.x = this._text.width + HORIZONTAL_PADDING * 2;
			this._dimentions.y = this._text.height + VERTICAL_BOTTOM_PADDING + 1;

			this.Drawbackground();

			if (alwaysOnTop)
				this._stage.setChildIndex(this._container, this._stage.numChildren - 1);

			this._container.visible = visible;
		}

		Drawbackground()
		{
			if (!this._drawBackground)
				return;
			
			this._drawBackground = false;

			this._background.uncache();
			
			ShapeUtils.drawRectangleEx(
				this._background,
				-HORIZONTAL_PADDING + LINE_THICKNESS + 0.5,
				-VERTICAL_TOP_PADDING + LINE_THICKNESS + 0.5,
				Math.floor(this._dimentions.x) - (LINE_THICKNESS * 2),
				Math.floor(this._dimentions.y) - (LINE_THICKNESS * 2),
				1,
				this._borderColor,
				this._backgroundColor,
				1,
				true
			);

			this._background.cache(
				-HORIZONTAL_PADDING,
				-VERTICAL_TOP_PADDING,
				Math.floor(this._dimentions.x),
				Math.floor(this._dimentions.y)
			);
		}

		Clean()
		{
			this._text.removeAllEventListeners();

			this._container.removeChild(this._background);
			this._container.removeChild(this._text);

			if (this._stage)
				this._stage.removeChild(this._container);

			this._container = null;
			this._text = null;
			this._background = null;
			this._textFieldStub = null;
			this._pos = null;
			this._dimentions = null;
			this._stage = null;
		}
		
		GetX()
		{
			return -HORIZONTAL_PADDING + LINE_THICKNESS;
		}

		GetY()
		{
			return -VERTICAL_TOP_PADDING + LINE_THICKNESS;
		}

		GetWidth()
		{
			return this._dimentions.x;
		}

		GetHeight()
		{
			return this._dimentions.y;
		}

		GetDisplayObject()
		{
			return this._container;
		}

		GetTextField()
		{
			if (!this._textFieldStub)
			{
				const owner = this;

				this._textFieldStub = {
					get x() { return owner._container.x; },
					get y() { return owner._container.y; },
					get width() { return owner.GetWidth(); },
					get height() { return owner.GetHeight(); }
				}
			}

			return this._textFieldStub;
		}

		GetText()
		{
			return this._text;
		}
	}

	window.Text = Text;
}