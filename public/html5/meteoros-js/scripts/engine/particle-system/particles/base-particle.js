"use strict";

{
	const tempArrayView = new Int32Array(new ArrayBuffer(Int32Array.BYTES_PER_ELEMENT * 3));

	let tempA = 0;
	let tempR = 0;
	let tempG = 0;
	let tempB = 0;

	class Base_Particle
	{
		constructor()
		{
			this._rotation = 0;
			this._dir = null;
			
			this._maxLife = 0;
			this._width = 0;
			this._height = 0;
			this._interpolationThreshold = 0;
			this._unprocessedPos = null;
			
			// Variables for particles using custom graphics
			this._angle = 0;
			this._scale = null;
			
			this._pos = null;
			this._color = 0x000000;
			this._enable = false;
			this._life = 0;
			this._graphicsIndex = 0;
			this._lifeModifier = 0;
		
			this._interpolationColor = 0x000000;
			this._interpolationSize = null;
			this._useColorInterpolation = false;
			this._useSizeInterpolation = false;
			this._initWidth = 0;
			this._initHeight = 0;
			
			this._sizeInterpolationDecreasingX = false
			this._sizeInterpolationDecreasingY = false
			this._xSizeReached = false;
			this._ySizeReached = false;
			
			this._a = 0;
			this._r = 0;
			this._g = 0;
			this._b = 0;
			
			this._deltaA = 0;
			this._deltaR = 0;
			this._deltaG = 0;
			this._deltaB = 0;

			this._pos = new Point();
			this._scale = new Point(1, 1);
		}
		
		get Color()
		{
			if (this._useColorInterpolation)
			{
				tempArrayView[0] = tempR;
				tempArrayView[1] = tempG;
				tempArrayView[2] = tempB;

				return `rgba(${tempArrayView[0]},${tempArrayView[1]},${tempArrayView[2]},${tempA / 255})`;
			}
			else
			{
				tempArrayView[0] = this._r;
				tempArrayView[1] = this._g;
				tempArrayView[2] = this._b;

				return `rgba(${tempArrayView[0]},${tempArrayView[1]},${tempArrayView[2]},${this._a / 255})`;
			}
		}

		InitBase(x, y, rotation, width, height, color, life, graphicsIndex, interpolationColor, interpolationSize, lifeModifier, unprocessedPos)
		{
			this._graphicsIndex  = graphicsIndex;
			this._life 		     = NumberUtils.randRange(life.x, life.y, true);
			this._maxLife 	     = this._life;
			this._enable 	     = true;
			this._rotation 	     = rotation;
			this._pos.x 		 = x;
			this._pos.y 		 = y;
			this._angle          = 0;
			this._lifeModifier   = lifeModifier;
			this._unprocessedPos = unprocessedPos;
			
			this._useColorInterpolation  = false;
			this._useSizeInterpolation   = false;
			
			if (this._graphicsIndex === -1)
			{
				this._width        = width;
				this._height       = height;
				this._initWidth    = width;
				this._initHeight   = height;
				this._color 	   = color;
			}
			
			if (!isNaN(interpolationColor))
			{
				this._interpolationColor 	= interpolationColor;
				this._useColorInterpolation = true;
				
				this._a = this._color >> 24 & 0xFF;
				this._r = this._color >> 16 & 0xFF;
				this._g = this._color >> 8  & 0xFF;
				this._b = this._color 		& 0xFF;
				
				this._deltaA = (this._interpolationColor >> 24 & 0xFF);
				this._deltaR = (this._interpolationColor >> 16 & 0xFF);
				this._deltaG = (this._interpolationColor >> 8  & 0xFF);
				this._deltaB = (this._interpolationColor  	   & 0xFF);
			}
			
			if (interpolationSize)
			{
				this._interpolationSize 	  = interpolationSize;
				this._useSizeInterpolation = true;
				
				if (this._width < this._interpolationSize.x)
				{
					this._sizeInterpolationDecreasingX = false;
				}
				else
				{
					this._sizeInterpolationDecreasingX = true;
				}
				
				if (this._height < this._interpolationSize.y)
				{
					this._sizeInterpolationDecreasingY = false;
				}
				else
				{
					this._sizeInterpolationDecreasingY = true;
				}
				
				this._xSizeReached = false;
				this._ySizeReached = false;
			}
		}
		
		InitSpecific(specificProps)
		{

		}

		Movement(deltaTime)
		{

		}
		
		Update(deltaTime)
		{
			if (this._life <= 0)
			{
				this._enable = false;
			}
			else
			{
				this._life -= deltaTime * this._lifeModifier;
				
				if (this._life < 0)
				{
					this._life = 0;
				}
			}
			
			this._interpolationThreshold = (this._life / this._maxLife);

			this.Movement(deltaTime);
			
			if (this._life > 0)
			{
				if (this._graphicsIndex === -1)
				{
					if (this._useColorInterpolation)
					{
						tempA = this._deltaA + (this._a - this._deltaA) * this._interpolationThreshold;
						tempR = this._deltaR + (this._r - this._deltaR) * this._interpolationThreshold;
						tempG = this._deltaG + (this._g - this._deltaG) * this._interpolationThreshold;
						tempB = this._deltaB + (this._b - this._deltaB) * this._interpolationThreshold;
						
						this._color = (tempA << 24 | tempR << 16 | tempG << 8 | tempB);
					}
					
					if (this._useSizeInterpolation)
					{
						this._width  = this._interpolationSize.x + (this._initWidth  - this._interpolationSize.x)  * this._interpolationThreshold;
						this._height = this._interpolationSize.y + (this._initHeight - this._interpolationSize.y)  * this._interpolationThreshold;
						
						if (this._sizeInterpolationDecreasingX && this._sizeInterpolationDecreasingY)
						{
							if (this._width < 1 && this._height < 1)
							{
								this._life = 0;
							}
						}
						else if (!this._sizeInterpolationDecreasingX && !this._sizeInterpolationDecreasingY)
						{
							if (this._width >= this._interpolationSize.x && this._height >= this._interpolationSize.y)
							{
								this._life = 0;
							}
						}
						else
						{
							if (this._sizeInterpolationDecreasingX)
							{
								if (this._width < 1)
								{
									this._xSizeReached = true;
								}
							}
							else
							{
								if (this._width >= this._interpolationSize.x)
								{
									this._xSizeReached = true;
								}
							}
							
							if (this._sizeInterpolationDecreasingY)
							{
								if (this._height < 1)
								{
									this._ySizeReached = true;
								}
							}
							else
							{
								if (this._height >= this._interpolationSize.y)
								{
									this._ySizeReached = true;
								}
							}
							
							if (this._xSizeReached && this._ySizeReached)
							{
								this._life = 0;
							}
						}
					}

					Base_Particle._x = this._pos.x - (this._width / 2);
					Base_Particle._y = this._pos.y - (this._height / 2);
					Base_Particle._w = this._width;
					Base_Particle._h = this._height;
				}
			}
			else
			{
				Base_Particle._w = 0;
				Base_Particle._h = 0;
			}
		}
	}

	Base_Particle._x = 0;
	Base_Particle._y = 0;
	Base_Particle._w = 0;
	Base_Particle._h = 0;
	
	window.Base_Particle = Base_Particle;
}