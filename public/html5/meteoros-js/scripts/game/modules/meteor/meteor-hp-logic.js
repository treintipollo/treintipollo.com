"use strict";

{
	class MeteorHPLogic extends Logic
	{
		constructor()
		{
			super();

			this._dirX = 0;
			this._dirY = 0;
			this._distance = 0;
			this._speed = 0;
			this._hp = 0;
			this._maxHp = 0;
			this._nextRadius = 0;

			this._targetPos = new Point();
			this._originPos = new Point();
			this._dirInfo   = new Array(new Point(), 0);

			this._rotationSpeed = NaN;
			this._rotationInit = NaN;
		}

		get InitRotation()
		{
			return this._rotationInit;
		}
		
		update(deltaTime)
		{
			if (this._distance > 0)
			{
				this._distance -= this._speed * deltaTime;
			}
			else
			{
				this._parent.Active = false;
			}
			
			if (this._parent.Active)
			{
				this._posX += this._dirX * deltaTime;
				this._posY += this._dirY * deltaTime;

				this._rotation += this._rotationSpeed;
			}
		}
		
		childInit(params)
		{
			this._targetPos = params[0];
			this._speed	  	= params[1];
			this._hp		= params[2];
			this._maxHp     = this._hp;
			
			this._originPos.x = this._posX;
			this._originPos.y = this._posY;
			
			this._dirInfo = VectorUtils.normalize(this._targetPos, this._originPos, this._dirInfo, this._speed);
			
			this._distance = this._dirInfo[1];
			this._dirX     = this._dirInfo[0].x;
			this._dirY     = this._dirInfo[0].y;
			
			this._rotationSpeed = NumberUtils.randRange(-1, 1);
			
			this._rotation = TrigUtils.calcAngleAtan2(this._targetPos.x, this._targetPos.y, this._posX, this._posY) * NumberUtils.TO_DEGREE + 90;
			this._rotationInit = this._rotation;
		}
		
		concreteDestroy()
		{
			this._targetPos  = null;
			this._originPos  = null;
			this._dirInfo[0] = null
			this._dirInfo    = null;
		}
		
		onCollide(opponent, deltaTime)
		{
			if (opponent instanceof MissileLogic)
			{
				this._hp--;
				
				if (this._hp > 0)
				{
					this._nextRadius = this._externalParameters["colliderHit"]();
					this._externalParameters["redraw"](this._nextRadius);
				}
				else
				{
					const hitFeedbackArguments = Nukes.actorManager.getInitParams("HitFeedback");
					hitFeedbackArguments._logicInitParams[0] = `HIT +${Math.floor(this._maxHp / 2)}`;
					Nukes.actorManager.setActor("HitFeedback", this._x, this._y);
					this._externalParameters["HitAmount"] = Math.floor(this._maxHp / 2);
					
					this._parent.Active = false;
					
					this._externalParameters["missileHit"]();
				}
			}
			else if (opponent instanceof CityLogic)
			{
				this._externalParameters["cityHit"]();
				this._parent.Active = false;
			}
		}
	}

	window.MeteorHPLogic = MeteorHPLogic;
}