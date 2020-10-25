"use strict";

{
	const tempArrayView = new Uint8Array(new ArrayBuffer(Uint8Array.BYTES_PER_ELEMENT * 3));

	class Base_Particle
	{
		constructor(x, y, rotation, width, height, color, life, visible)
		{
			this._pos = null;
			this._width = 0;
			this._height = 0;
			this._rotation = 0;
			this._dir = null;
			this._color = "";
			this._enable = false;
			this._rect = null;
			this._visible = false;
			this._maxLife = 0;
			this._life = 0;
			
			this._privateRect = null;
			this._colorInterpolationThreshold = 0;
			this._sizeInterpolationThreshold = 0;
			this._privateColor = 0;
			this._interpolationColor = 0;
			this._interpolationSize = null;
			this._useColorInterpolation = false;
			this._useSizeInterpolation = false;

			this._width = width;
			this._height = height;
			this._privateColor = color;

			this._privateRect = new Rectangle(-width, -height, width, height);
			this._rect = this._privateRect;
			this._pos = new Point(x, y);

			this._life = this.RandRange(life.x, life.y);
			this._maxLife = this._life;
			this.INTERPOLATIONVARIATION = (1 / this._maxLife);
			
			this._visible = visible;
			this._enable = true;
			this._rotation = rotation;

			const a = NumberUtils.normalize((color >> 24) & 255, 0, 255);
			const r = (color >> 16) & 255;
			const g = (color >> 8) & 255;
			const b = color & 255;

			this._a1 = a;
			this._r1 = r;
			this._g1 = g;
			this._b1 = b;

			this._privateStringColor = `rgba(${r},${g},${b},${a})`;

			this._a2 = 0;
			this._r2 = 0;
			this._g2 = 0;
			this._b2 = 0;
		}
		
		InitSpecific(specificProps)
		{

		}
		
		Update()
		{
			if (this._useColorInterpolation)
			{
				if (this._colorInterpolationThreshold < 1)
				{
					this._colorInterpolationThreshold += this.INTERPOLATIONVARIATION;
				}
				
				this._color = this.InterpolateColor(this._colorInterpolationThreshold);
			}
			else
			{
				this._color = this._privateStringColor;
			}
			
			if (this._useSizeInterpolation)
			{
				this._sizeInterpolationThreshold = (1 / this._life);
				this._rect.width += this.InterpolateSize(this._privateRect.width, this._interpolationSize.x, this._sizeInterpolationThreshold);
				this._rect.height += this.InterpolateSize(this._privateRect.height, this._interpolationSize.y, this._sizeInterpolationThreshold);
			}
			else
			{
				this._rect = this._privateRect;
			}
			
			// Redifined for each particle
			this.Movement();
			
			// Move the registration point of the rectangle used to draw each particle
			this._privateRect.x = this._pos.x;
			this._privateRect.y = this._pos.y;
			this._life--;
			
			if (this._life <= 0)
				this.Die();
		}

		SetInterpolationColor(color)
		{
			this._interpolationColor = color;
			this._useColorInterpolation = true;
			this._colorInterpolationThreshold = 0;

			this._a2 = NumberUtils.normalize((color >> 24) & 255, 0, 255);
			this._r2 = (color >> 16) & 255;
			this._g2 = (color >> 8) & 255;
			this._b2 = color & 255;
		}

		SetInterpolationSize(size)
		{
			this._interpolationSize = size;
			this._useSizeInterpolation = true;
			this._sizeInterpolationThreshold = 0;
		}
		
		Die()
		{
			this._pos = null;
			this._dir = null;
			this._rect = null;
			this._privateRect = null;
			this._interpolationSize = null;
			this._enable = false;
			
			this.CleanSpecific();
		}
		
		CleanSpecific()
		{

		}
		
		Movement()
		{

		}
		
		RandRange(min, max)
		{
   			return Math.random() * (max - min + 1) + min;
		}
		
		InterpolateColor(t)
		{
			tempArrayView[0] = (this._r2 - this._r1) * t + this._r1;
			tempArrayView[1] = (this._g2 - this._g1) * t + this._g1;
			tempArrayView[2] = (this._b2 - this._b1) * t + this._b1;
			
			const ia = (this._a2 - this._a1) * t + this._a1;

			return `rgba(${tempArrayView[0]},${tempArrayView[1]},${tempArrayView[2]},${ia})`;
		}
		
		InterpolateSize(size1, size2, t)
		{
			return (size2 - size1) * t;
		}
	}

	self.Base_Particle = Base_Particle;
}