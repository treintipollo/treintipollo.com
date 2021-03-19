"use strict";

{
	class GuiTextRenderer extends Renderer
	{
		constructor()
		{
			super();

			this._text = null;
			this._textPos = new Point();
			this._container = new Container();
			this._drawContainer = new Shape();
			this._hitArea = new Shape();
			
			this._underline = false;
			this._centralized = false;
		}

		get Width()
		{
			return this._text.GetText().width;
		}

		get Height()
		{
			if (this._underline)
				return this._text.GetText().height + 3;

			return this._text.GetText().height;
		}
		
		childInit(params)
		{
			const font = params[0];
			const size = params[1];
			const useEmbedFonts = params[2];
			const useBackground = params[3];
			const backgroundColor = params[4];
			const useBorder = params[5];
			const borderColor = params[6];

			this._text = new Text(
				this._textPos,
				font,
				size,
				0x000000,
				null,
				false,
				useBackground,
				backgroundColor,
				useBorder,
				borderColor
			);

			this._container.addChild(this._text.GetDisplayObject());
			this._container.addChild(this._drawContainer);

			this._underline   = (params[7] === null) || (params[7] === undefined) ? true : params[7];
			this._centralized = (params[8] === null) || (params[8] === undefined) ? true : params[8];
		}
		
		initComplete()
		{
			this._text.Update(
				this._logic.ExternalParameters["Text"],
				this._logic.ExternalParameters["TextColor"],
				this._centralized,
				false,
				false
			);

			this._hitArea.graphics.clear().beginFill("black").drawRect(0, 0, this._text.GetWidth(), this._text.GetHeight());
			this._hitArea.setBounds(0, 0, this._text.GetWidth(), this._text.GetHeight());

			this._container.hitArea = this._hitArea;
			this._container.mouseChildren = false;
			
			if (this._centralized)
			{
				this._drawContainer.y = this._text.GetHeight() / 2;
			}
			else
			{
				this._drawContainer.y = this._text.GetHeight();
			}

			this.draw(false);
		}
		
		concreteDraw()
		{
			this._drawContainer.uncache();
			this._drawContainer.graphics.clear();

			if (this._underline)
			{
				// NOTE: HARDCODING
				const width = this._text.GetText().width - 5;
				const height = this._text.GetText().height;

				ShapeUtils.drawRectangle(
					this._drawContainer,
					0,
					0,
					Math.floor(width) + 0.5,
					3 + 0.5,
					1,
					this._logic.ExternalParameters["TextColor"],
					this._logic.ExternalParameters["TextColor"]
				);

				const textField = this._text.GetTextField();
				this._drawContainer.x = textField.x;

				this._drawContainer.cache(0, 0, width, this._text._dimentions.y);
			}
		}
		
		concreteUpdate(deltaTime)
		{
			this._text.Update(
				this._logic.ExternalParameters["Text"],
				this._logic.ExternalParameters["TextColor"],
				this._centralized
			);
			
			this._hitArea.x = this._text.GetDisplayObject().x + this._text.GetX();
			this._hitArea.y = this._text.GetDisplayObject().y + this._text.GetY();
		}
		
		concreteRelease()
		{
			if (this._container)
			{
				this._container.removeChild(this._text.GetDisplayObject());
				this._container.removeChild(this._drawContainer);
			}

			if (this._text)
				this._text.Clean();

			this._underline = false;
			this._centralized = false;
		}

		concreteDestroy()
		{
			this.concreteRelease();

			this._container = null;
			this._drawContainer = null;
			this._textPos = null;
			this._hitArea = null;
		}
		
		getTextDimentions()
		{
			return this._text._dimentions;
		}
	}

	window.GuiTextRenderer = GuiTextRenderer;
}