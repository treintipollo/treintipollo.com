"use strict";

{
	const MALE_ICON_INDEX   = 0;
	const FEMALE_ICON_INDEX = 1;
	const MUTANT_ICON_INDEX = 2;
	const MALE_MUTANT_ICON_INDEX = 3;
	const FEMALE_MUTANT_ICON_INDEX = 4;

	class PopulationIconRenderer extends Renderer
	{
		constructor()
		{
			super();
			
			this.GENDER_SYMBOL_RADIUS = 0;
			this._type = 0;

			this._container   = new Shape();
			this._guyEndPoint = new Point();
		}

		static get MALE_ICON_INDEX()
		{
			return MALE_ICON_INDEX;
		}

		static get FEMALE_ICON_INDEX()
		{
			return FEMALE_ICON_INDEX;
		}

		static get MUTANT_ICON_INDEX()
		{
			return MUTANT_ICON_INDEX;
		}

		static get MALE_MUTANT_ICON_INDEX()
		{
			return MALE_MUTANT_ICON_INDEX;
		}

		static get FEMALE_MUTANT_ICON_INDEX()
		{
			return FEMALE_MUTANT_ICON_INDEX;
		}
		
		childInit(params)
		{
			this.GENDER_SYMBOL_RADIUS = params[0];
			this._type				  = params[1];
			
			this.draw();
		}
		
		concreteDestroy()
		{
			this._guyEndPoint = null;
		}
		
		concreteDraw()
		{
			if (this._type === MALE_ICON_INDEX)
			{
				this.drawGuy(this._container, 0, 0x81A8F0);
			}
			
			if (this._type === FEMALE_ICON_INDEX)
			{
				this.drawGal(this._container, 0, 0xF081D4);
			}
			
			if (this._type === MUTANT_ICON_INDEX)
			{
				this.drawGal(this._container, -this.GENDER_SYMBOL_RADIUS - 5, 0x06C406);
				this.drawGuy(this._container, this.GENDER_SYMBOL_RADIUS + 5, 0x06C406);
			}

			if (this._type === MALE_MUTANT_ICON_INDEX)
			{
				this.drawGuy(this._container, 0, 0x06C406);
			}

			if (this._type === FEMALE_MUTANT_ICON_INDEX)
			{
				this.drawGal(this._container, 0, 0x06C406);
			}
		}
		
		drawGuy(graphics, pos, color)
		{
			this._guyEndPoint = TrigUtils.posAroundPoint(pos, 0, -45 * NumberUtils.TO_RADIAN, this.GENDER_SYMBOL_RADIUS * 2.4, this._guyEndPoint);
			ShapeUtils.drawLine(graphics, new Point(pos, 0), this._guyEndPoint, this.GENDER_SYMBOL_RADIUS * 0.4, color, 1.0, true);
			
			ShapeUtils.drawLine(graphics, this._guyEndPoint, new Point(this._guyEndPoint.x + 0, this._guyEndPoint.y + this.GENDER_SYMBOL_RADIUS * 0.8), this.GENDER_SYMBOL_RADIUS * 0.4, color, 1.0, true);
			ShapeUtils.drawLine(graphics, this._guyEndPoint, new Point(this._guyEndPoint.x - this.GENDER_SYMBOL_RADIUS * 0.8, this._guyEndPoint.y + 0), this.GENDER_SYMBOL_RADIUS * 0.4, color, 1.0, true);
			
			ShapeUtils.drawCircle(graphics, this.GENDER_SYMBOL_RADIUS, pos, 0, this.GENDER_SYMBOL_RADIUS * 0.4, color);

			graphics.cache(-100, -100, 200, 200)
		}
		
		drawGal(graphics, pos, color)
		{
			ShapeUtils.drawCircle(graphics, this.GENDER_SYMBOL_RADIUS, pos, 0, this.GENDER_SYMBOL_RADIUS * 0.4, color);
			
			ShapeUtils.drawLine(graphics, new Point(pos, this.GENDER_SYMBOL_RADIUS), new Point(pos, this.GENDER_SYMBOL_RADIUS * 2.2), this.GENDER_SYMBOL_RADIUS * 0.4, color);
			ShapeUtils.drawLine(graphics, new Point(pos - this.GENDER_SYMBOL_RADIUS * 0.6, this.GENDER_SYMBOL_RADIUS * 1.8), new Point(pos + this.GENDER_SYMBOL_RADIUS * 0.6, this.GENDER_SYMBOL_RADIUS * 1.8), this.GENDER_SYMBOL_RADIUS * 0.4, color);

			graphics.cache(-100, -100, 200, 200)
		}
	}

	window.PopulationIconRenderer = PopulationIconRenderer;
}