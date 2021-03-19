"use strict";

{
	const STAGE_WIDTH = document.getElementById("canvas").width;

	class MeteorParabolicLogic extends Logic
	{
		constructor()
		{
			super();
			
			this._initX = 0;
			this._initY = 0;
			this._dirX = 0;
			this._dirY = 0;
			this._acc = 0;
			this._minHeight = 0;
			
			this._speed = 0;
			this._shootAngle = 0;
			this._timeAccumulator = 0;
			this._timeTransfor = 0;
		}

		get InitRotation()
		{
			return this._rotation;
		}
		
		update(deltaTime)
		{
			if (this._posX < -50 || this._posX > STAGE_WIDTH + 50)
			{
				this._parent.Active = false;
			}
			
			if (this._posY >= this._minHeight)
			{
				this._parent.Active = false;
			}
			
			if (this._parent.Active)
			{
				this._timeAccumulator += deltaTime * this._timeTransfor;
				
				if (this._timeTransfor > 1)
				{
					this._timeTransfor -= deltaTime * 2;
				}
				
				this._posX = this._initX + (this._dirX * this._timeAccumulator);
				this._posY = this._initY - (this._dirY * this._timeAccumulator) + (this._acc * 0.5 * this._timeAccumulator * this._timeAccumulator);
				
				this._rotation = TrigUtils.calcAngleAtan2(this._posX, this._posY, this._initX, this._initY) * NumberUtils.TO_DEGREE + 90;
			}
		}
		
		concreteInit()
		{
			this._timeAccumulator = 0;
			this._timeTransfor	= 5;
		}
		
		childInit(params)
		{
			this._speed 	 = params[1];
			this._shootAngle = NumberUtils.randRange(135, 45, true) * NumberUtils.TO_RADIAN;
			this._acc 	   	 = params[2];
			this._minHeight  = params[3];
			
			this._initX = this._posX;
			this._initY = this._posY;
			
			this._dirX  = Math.cos(this._shootAngle) * this._speed;
			this._dirY  = Math.sin(this._shootAngle) * this._speed;
		}
		
		concreteDestroy()
		{

		}
		
		onCollide(opponent, deltaTime)
		{
			this._rotation = TrigUtils.calcAngleAtan2(opponent._x, opponent._y, this._posX, this._posY) * NumberUtils.TO_DEGREE + 90;
			
			if (opponent instanceof CityLogic)
			{
				this._externalParameters["cityHit"]();
			}
			else if (opponent instanceof MissileLogic)
			{
				const hitFeedbackArguments = Nukes.actorManager.getInitParams("HitFeedback");
				hitFeedbackArguments._logicInitParams[0] = "HIT +1";
				Nukes.actorManager.setActor("HitFeedback", this._x, this._y);
				this._externalParameters["HitAmount"] = 1;

				this._externalParameters["missileHit"]();
			}
			
			this._parent.Active = false;
		}
	}

	window.MeteorParabolicLogic = MeteorParabolicLogic;
}