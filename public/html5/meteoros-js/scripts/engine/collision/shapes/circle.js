"use strict";

{
	class Circle
	{
		constructor()
		{
			this._radius = 0;
			this._deltaX = 0;
			this._deltaY = 0;
		}
		
		get Type()
		{
			return Collider.CIRCLE;
		}
		
		isPointInside(x, y, centerX, centerY)
		{
			this._deltaX = x - centerX;
			this._deltaY = y - centerY;
			
			return (this._deltaX * this._deltaX + this._deltaY * this._deltaY <= this._radius * this._radius);
		}
		
		init(params)
		{
			this._radius = params[0];
		}
	}

	window.Circle = Circle;
}