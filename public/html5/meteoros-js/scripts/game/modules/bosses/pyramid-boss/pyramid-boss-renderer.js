"use strict";

{
	class PyramidBossRenderer extends UfoRenderer
	{
		constructor()
		{
			super();
			
			this._maxHeight = 0;
			this._eyeRadius = 0;
			this._eyeWidth = 0;
			this._leastDamageColor = 0;
			this._mostDamageColor = 0;

			this._container = new Shape();

			this._eyePath = new Array();
			this._pyramidPath = new Array();

			this._on_change_color = (hp, maxHp) => this.changeColor(hp, maxHp);
		}
		
		childInit(params)
		{
			super.childInit(params[0]._baseArguments);
			
			this._maxHeight 	   = params[0]._maxHeight;
			this._eyeRadius 	   = params[0]._eyeRadius;
			this._eyeWidth  	   = params[0]._eyeWidth;
			this._leastDamageColor = params[0]._leastDamageColor;
			this._mostDamageColor  = params[0]._mostDamageColor;
			
			this._eyePath.push(new Point(0, -this._maxHeight / 2 - this._eyeRadius));
			this._eyePath.push(new Point(-this._eyeWidth, -this._maxHeight / 2));
			this._eyePath.push(new Point(0, -this._maxHeight / 2 + this._eyeRadius));
			this._eyePath.push(new Point(this._eyeWidth, -this._maxHeight / 2));
			
			this._pyramidPath.push(new Point(0, -this._maxHeight));
			this._pyramidPath.push(new Point(this._length / 2, 0));
			this._pyramidPath.push(new Point(-this._length / 2, 0));
		}
		
		initComplete()
		{
			super.initComplete();
			
			this._logic.ExternalParameters["eyeHeight"]  = this._maxHeight / 2;
			this._logic.ExternalParameters["showDamage"] = this._on_change_color;
		}
		
		concreteDraw()
		{
			this._container.uncache();
			this._container.graphics.clear();
			
			for (let i = 0; i < this._pieces; i++)
			{
				ShapeUtils.drawCircle(this._container, this._pieceRadius, this._pieceSpacing * i - this._length / 2 + this._pieceRadius * 2, this._pieceRadius, 1, this._color);
			}
			
			ShapeUtils.drawPath(this._container, this._pyramidPath, 1, this._color, 1, 0, 1);
			
			ShapeUtils.drawPath(this._container, this._eyePath, 3, this._color, 1, 0, 1);
			
			ShapeUtils.drawCircle(this._container, this._eyeRadius, 0, -this._maxHeight / 2, 2, this._color, 0, 0);
			ShapeUtils.drawCircle(this._container, this._eyeRadius / 10, 0, -this._maxHeight / 2, 2, this._color, 0, 0);
			
			ShapeUtils.drawRectangle(this._container, -this._length / 2, -this._pieceRadius, this._length, this._pieceRadius * 2, 1, this._color);

			if (this._isShowingShield)
			{
				ShapeUtils.drawCircle(
					this._container,
					this._length / 2 + this._pieceRadius,
					0,
					-this._pieceRadius / 2,
					2,
					0x0000ff,
					0x000000,
					0,
					1.0
				);
			}

			this._container.cache(-100, -100, 200, 200);
		}
		
		changeColor(hp, maxHp)
		{
			this._color = ColorUtils.interpolateColors(this._leastDamageColor, this._mostDamageColor, NumberUtils.normalize(hp, 0, maxHp));
			
			this.draw(false);
		}
		
		concreteDestroy()
		{
			super.concreteDestroy();
			
			CollectionUtils.nullVector(this._eyePath);
			CollectionUtils.nullVector(this._pyramidPath);

			this._on_change_color = null;
		}
	}

	window.PyramidBossRenderer = PyramidBossRenderer;
}