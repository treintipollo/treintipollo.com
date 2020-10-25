"use strict";

{
	class Bit
	{
		constructor(parentPos, isBomb, gameStage)
		{
			this._parentPos = parentPos;
			this._isBomb = isBomb;
			this._stage = gameStage;

			this._initPos = null;
			
			this._angle = 0;
			this._rotRadius = 0;
			this._rotVariation = 0;
			this._radius = 0;
			
			this._death = null;
			this._initDeath = false;
			this._bodyBitmap = null;
			this._appearSpeed = 0;
			
			this._body = null;
			this._placeOnTop = false;
		}

		Init(radius, graphicsId)
		{
			this._body = DynamicGraphics.GetSprite(graphicsId);
			
			this._radius = radius;
			this._appearSpeed = radius / 300;
			
			this._placeOnTop = true;
			
			this._stage.addChild(this._body);
		}

		SetParameters(angle, rotRadius)
		{
			this._angle = angle * (Math.PI/180);
			this._rotRadius = rotRadius;
      		
      		this._body.scaleX = 0;
			this._body.scaleY = 0;
		}

		Clean()
		{
			if (this._death !== null)
			{
				this._death.Clean();
				this._death = null;
			}
			
			this._bodyBitmap = null;
			
			this._stage.removeChild(this._body);
			this._body = null;
			this._parentPos = null;
			this._initPos = null;
			this._stage = null;
		}


		Update(center, rotRadius, speed, arrangeBitPos)
		{
			this._initDeath = true;
			
			this._rotVariation += 0.017 * speed;
			
			let radiusModifier = Math.sin(this._rotVariation);
			let radius = NumberUtils.interpolate(radiusModifier, 0, rotRadius);
			let realAngle = this._angle + this._rotVariation;
			
      		this._body.x = center.x + Math.cos(realAngle) * radius;
      		this._body.y = center.y + Math.sin(realAngle) * rotRadius;
      		
      		if (arrangeBitPos)
      		{
	      		if (this._placeOnTop)
	      		{
	      			this._stage.setChildIndex(this._body, this._stage.numChildren-1);
	      			this._placeOnTop = false;
	      		}
      		}
		}

		Die()
		{
			if (this._initDeath)
			{
				const radius = Math.ceil(this._radius);

				this._bodyBitmap = DynamicGraphics.GetBitmapFromDisplayObject(
					this._body,
					radius * 2,
					radius * 2
				);
				
				this._death = new SplashImage(this._bodyBitmap, this._stage);
				this._death.Init(this._body.x - radius, this._body.y - radius, 1, 15, 1, 4, 4, true, 0.01);
				
				this._body.alpha = 0;
				this._body.scaleX = 0;
				this._body.scaleY = 0;
				
				this._initDeath = false;
			}
			
			if (this._death !== null)
			{
				if (this._death.Update(true))
				{
					this._bodyBitmap = null;
					this._death.Clean();
					this._death = null;
					
					return true;
				}
			}
			else
			{
				return true;
			}
	
			return false;
		}
		
		
		Appear()
		{
			this._body.alpha = 1;
			
			if (this._body.scaleX < 1)
			{
				this._body.scaleX += this._appearSpeed;
				this._body.scaleY += this._appearSpeed;
			}
			else
			{
				this._body.scaleX = 1;
				this._body.scaleY = 1;
				
				return true;
			}
			
			return false;
		}
	}

	window.Bit = Bit;
}