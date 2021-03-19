"use strict";

{
	class Triangle
	{
		constructor()
		{
			this._x1 = 0;
			this._y1 = 0;
			this._x2 = 0;
			this._y2 = 0;
			this._x3 = 0;
			this._y3 = 0;
		}
		
		get Type()
		{
			return Collider.TRIANGLE;
		}
		
		init(params)
		{
			this._x1 = params[0];
			this._y1 = params[1];
			this._x2 = params[2];
			this._y2 = params[3];
			this._x3 = params[4];
			this._y3 = params[5];
		}
	}

	window.Triangle = Triangle;
}