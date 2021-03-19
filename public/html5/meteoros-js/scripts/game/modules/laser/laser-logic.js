"use strict";

{
	class LaserLogic extends Logic
	{
		constructor()
		{
			super();

			this._target = null; // CityLogic
			this._ufo = null; // UfoLaserLogic
			
			this._chargeTimer = 0;
			this._chargeTime = 0;
			this._chargeComplete = false;
			
			this._blastTimer = 0;
			this._blastTime = 0;

			this._externalParameters["chargeUp"] 		= null;
			this._externalParameters["chargeComplete"]  = null;
			this._externalParameters["blast"] 		 	= null;
		}
		
		concreteInit()
		{
			this._chargeTimer    = 0;
			this._blastTimer 	 = 0;
			this._chargeComplete = false;
			
			this._scaleX = 1;
		}
		
		childInit(params)
		{
			this._target 	 = params[0];
			this._ufo    	 = params[1];
			this._chargeTime = params[2];
			this._blastTime  = params[3];
		}
		
		update(deltaTime)
		{
			if (this._chargeTimer < this._chargeTime)
			{
				this._chargeTimer += deltaTime;
				
				if (this._externalParameters["chargeUp"])
				{
					this._externalParameters["chargeUp"]();
					this._externalParameters["chargeUp"] = null;
				}
			}
			else
			{
				if (!this._chargeComplete)
				{
					this._externalParameters["chargeComplete"]();
					this._chargeComplete = true;
				}
				else
				{
					if (this._blastTimer < this._blastTime)
					{
						this._blastTimer += deltaTime;
						this._scaleX += deltaTime * 5;
					}
					else
					{
						if (this._parent.Active)
						{
							this._externalParameters["blast"]((this._target._y - 20) - this._ufo._y);
							this._target.takeDamage();
							this._parent.Active = false;
						}
					}
				}
			}
			
			if (this._parent.Active)
			{
				this._posX = this._ufo._x;
				this._posY = this._ufo._y;
			}
		}
		
		concreteRelease()
		{
			this._target = null;
			this._ufo = null;
		}
	}

	window.LaserLogic = LaserLogic;
}