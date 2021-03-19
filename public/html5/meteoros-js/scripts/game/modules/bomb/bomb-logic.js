"use strict";

{
	class BombLogic extends Logic
	{
		constructor()
		{
			super();
			
			this._accelerationRate = 0;
			this._accelerationRateScalar = 0;
			this._accelerationTime = 0;
			this._accelerationTimer = 0;
			
			this._minSpeed = 0;
			this._speed = 0;
			this._dirX = 0;
			this._dirY = 0;
			this._hp = 0;
		}
		
		concreteInit()
		{
			this._accelerationRate  = 0;
			this._accelerationTimer = 0;
		}
		
		childInit(params)
		{
			this._speed	 		 	   	 = params[0];
			this._dirX 				   	 = params[1];
			this._dirY 				   	 = params[2];
			this._accelerationRateScalar = params[3];
			this._minSpeed			   	 = params[4];
			this._accelerationTime	   	 = params[5];
			
			this._hp = params[6] ? this._hp = params[6] : 1;
		}
		
		update(deltaTime)
		{
			if (this._parent.Active)
			{
				if (this._accelerationTimer < this._accelerationTime)
				{
					this._accelerationTimer += deltaTime;
					this._speed 			-= this._accelerationRate * deltaTime;
					this._accelerationRate  += deltaTime * this._accelerationRateScalar;
					
					this._posX += this._dirX * (this._speed * this._accelerationRate) * deltaTime;
					this._posY += this._dirY * (this._speed * this._accelerationRate) * deltaTime;
				}
				else
				{
					this._posY += this._minSpeed * deltaTime;
				}
			}
		}
		
		onCollide(opponent, deltaTime)
		{
			if (opponent instanceof CityLogic)
			{
				this._parent.Active = false;
			}
			else
			{
				this._hp--;
				
				if (this._hp <= 0)
					this._parent.Active = false;
			}
		}
	}

	window.BombLogic = BombLogic;
}