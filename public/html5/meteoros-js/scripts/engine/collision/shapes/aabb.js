"use strict";

{
	class AABB
	{
		constructor()
		{
			this._halfWidth = 0;
			this._halfHeight = 0;
			this._alpha = 0;
		}
		
		get Type()
		{
			return Collider.AABB_BOX;
		}
		
		set HalfWidth(value)
		{
			this._halfWidth = value;
			this._alpha = Math.atan2(this._halfHeight, this._halfWidth);
		}
		
		set HalfHeight(value)
		{
			this._halfHeight = value;
			this._alpha = Math.atan2(this._halfHeight, this._halfWidth);
		}
		
		getRadius(theta)
		{
			if (theta < this._alpha || theta >= (2.0 * Math.PI - this._alpha))
			{
				return this._halfWidth / Math.cos(theta);
			}
			
			if (theta < ( Math.PI - this._alpha))
			{
				return this._halfHeight / Math.cos(theta - Math.PI / 2.0);
			}
			
			if (theta < (Math.PI + this._alpha))
			{
				return this._halfWidth / Math.cos(theta - Math.PI);
			}
			
			return this._halfHeight / Math.cos(theta - 3.0 * Math.PI / 2.0);
		}
		
		isPointInside(centerX, centerY, pointX, pointY)
		{
			if (pointX > centerX - this._halfWidth && pointX < centerX + this._halfWidth)
			{
				if (pointY > centerY - this._halfHeight && pointY < centerY + this._halfHeight)
				{
					return true;
				}
			}
			
			return false;
		}
		
		init(params)
		{
			this._halfWidth = params[0];
			this._halfHeight = params[1];
			this._alpha = Math.atan2(this._halfHeight, this._halfWidth);
		}
	}

	window.AABB = AABB;
}