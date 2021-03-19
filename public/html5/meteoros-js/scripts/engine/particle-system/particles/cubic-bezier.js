"use strict";

{
	class CubicBezier extends Base_Particle
	{
		constructor()
		{
			super();

			this._anchor1X = 0;
			this._anchor1Y = 0;
			this._anchor2X = 0;
			this._anchor2Y = 0;
			
			this._control1X = 0;
			this._control1Y = 0;
			this._control2X = 0;
			this._control2Y = 0;
			
			this._t = 0;
			this._randomCoefficient = 0;
			this._mirrorX = false;
			this._mirrorY = false;
		}
		
		InitSpecific(specificProps)
		{
			this._randomCoefficient = specificProps[4];
			this._mirrorX			= specificProps[5];
			this._mirrorY 		    = specificProps[6];
			
			if (this._mirrorX)
			{
				if (Math.random() < 0.5)
				{
					this._anchor1X  = this._pos.x + specificProps[0].x + NumberUtils.randRange(-this._randomCoefficient, this._randomCoefficient, true);
					this._anchor2X  = this._pos.x + specificProps[3].x + NumberUtils.randRange(-this._randomCoefficient, this._randomCoefficient, true);
					this._control1X = this._pos.x + specificProps[1].x + NumberUtils.randRange(-this._randomCoefficient, this._randomCoefficient, true);
					this._control2X = this._pos.x + specificProps[2].x + NumberUtils.randRange(-this._randomCoefficient, this._randomCoefficient, true);
				}
				else
				{
					this._anchor1X  = this._pos.x - specificProps[0].x + NumberUtils.randRange(-this._randomCoefficient, this._randomCoefficient, true);
					this._anchor2X  = this._pos.x - specificProps[3].x + NumberUtils.randRange(-this._randomCoefficient, this._randomCoefficient, true);
					this._control1X = this._pos.x - specificProps[1].x + NumberUtils.randRange(-this._randomCoefficient, this._randomCoefficient, true);
					this._control2X = this._pos.x - specificProps[2].x + NumberUtils.randRange(-this._randomCoefficient, this._randomCoefficient, true);
				}
			}
			else
			{
				this._anchor1X  = this._pos.x + specificProps[0].x + NumberUtils.randRange(-this._randomCoefficient, this._randomCoefficient, true);
				this._anchor2X  = this._pos.x + specificProps[3].x + NumberUtils.randRange(-this._randomCoefficient, this._randomCoefficient, true);
				this._control1X = this._pos.x + specificProps[1].x + NumberUtils.randRange(-this._randomCoefficient, this._randomCoefficient, true);
				this._control2X = this._pos.x + specificProps[2].x + NumberUtils.randRange(-this._randomCoefficient, this._randomCoefficient, true);
			}
			
			if (this._mirrorY)
			{
				if (Math.random() < 0.5)
				{
					this._anchor1Y  = this._pos.y + specificProps[0].y + NumberUtils.randRange(-this._randomCoefficient, this._randomCoefficient, true);
					this._anchor2Y  = this._pos.y + specificProps[3].y + NumberUtils.randRange(-this._randomCoefficient, this._randomCoefficient, true);
					this._control1Y = this._pos.y + specificProps[1].y + NumberUtils.randRange(-this._randomCoefficient, this._randomCoefficient, true);
					this._control2Y = this._pos.y + specificProps[2].y + NumberUtils.randRange(-this._randomCoefficient, this._randomCoefficient, true);
				}
				else
				{
					this._anchor1Y  = this._pos.y - specificProps[0].y + NumberUtils.randRange(-this._randomCoefficient, this._randomCoefficient, true);
					this._anchor2Y  = this._pos.y - specificProps[3].y + NumberUtils.randRange(-this._randomCoefficient, this._randomCoefficient, true);
					this._control1Y = this._pos.y - specificProps[1].y + NumberUtils.randRange(-this._randomCoefficient, this._randomCoefficient, true);
					this._control2Y = this._pos.y - specificProps[2].y + NumberUtils.randRange(-this._randomCoefficient, this._randomCoefficient, true);
				}
			}
			else
			{
				this._anchor1Y  = this._pos.y + specificProps[0].y + NumberUtils.randRange(-this._randomCoefficient, this._randomCoefficient, true);
				this._anchor2Y  = this._pos.y + specificProps[3].y + NumberUtils.randRange(-this._randomCoefficient, this._randomCoefficient, true);
				this._control1Y = this._pos.y + specificProps[1].y + NumberUtils.randRange(-this._randomCoefficient, this._randomCoefficient, true);
				this._control2Y = this._pos.y + specificProps[2].y + NumberUtils.randRange(-this._randomCoefficient, this._randomCoefficient, true);
			}
		}
		
		Movement(deltaTime)
		{
			this._t = this._interpolationThreshold - 1;
			this._t = -this._t;
			
			const t = this._t;

			this._pos.x = (t * t * t) * (this._anchor2X + 3 * (this._control1X - this._control2X) - this._anchor1X) +
					 3 * (t * t) * (this._anchor1X - 2 * this._control1X + this._control2X) +
					 3 * (t) * (this._control1X - this._anchor1X) + this._anchor1X;
			
			this._pos.y = (t * t * t) * (this._anchor2Y + 3 * (this._control1Y - this._control2Y) - this._anchor1Y) +
					 3 * (t * t) * (this._anchor1Y - 2 * this._control1Y + this._control2Y) +
					 3 * (t) * (this._control1Y - this._anchor1Y) + this._anchor1Y;
		}
	}

	window.CubicBezier = CubicBezier;
}