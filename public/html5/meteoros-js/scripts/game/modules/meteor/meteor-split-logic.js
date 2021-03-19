"use strict";

{
	class MeteorSplitLogic extends Logic
	{
		constructor()
		{
			super();

			this._dirX = 0;
			this._dirY = 0;
			this._speed = 0;
			this._fragments = 0;
			this._fragmentsTargetOffset = 0;
			this._fragmentsInitPosOffset = 0;
			this._actorManager = null;
			this._fragmentsInitArguments = null;
			this._fragment = null;
			this._fragmentId = "";
			this._fragmentsDeathCallbacks = null;

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
			if (this._parent.Active)
			{
				this._posX += this._dirX * deltaTime;
				this._posY += this._dirY * deltaTime;

				this._rotation += this._rotationSpeed;
			}
		}
		
		childInit(params)
		{
			this._targetPos    = params[0];
			this._speed	       = params[1];
			this._actorManager = params[2];
			
			if (params[3] > 5)
			{
				this._fragments = NumberUtils.randRange(5, params[3], true);
			}
			else
			{
				this._fragments = 5;
			}
			
			this._fragmentsTargetOffset   = params[4];
			this._fragmentsInitPosOffset  = params[5];
			this._fragmentId			  = params[6];
			this._fragmentsDeathCallbacks = params[7];
			
			this._originPos.x = this._posX;
			this._originPos.y = this._posY;
			
			this._dirInfo = VectorUtils.normalize(this._targetPos, this._originPos, this._dirInfo, this._speed);
			
			this._dirX = this._dirInfo[0].x;
			this._dirY = this._dirInfo[0].y;
			
			if (Math.random() > Math.random())
			{
				if (Math.random() > Math.random())
				{
					this._rotationSpeed = NumberUtils.randRange(-1, 1);
				}
				else
				{
					this._rotationSpeed = NumberUtils.randRange(-1, -2);
				}
			}
			else
			{
				if (Math.random() > Math.random())
				{
					this._rotationSpeed = NumberUtils.randRange(-2, 2);
				}
				else
				{
					this._rotationSpeed = NumberUtils.randRange(1, 2);
				}
			}

			this._rotation = TrigUtils.calcAngleAtan2(this._targetPos.x, this._targetPos.y, this._posX, this._posY) * NumberUtils.TO_DEGREE + 90;
			this._rotationInit = this._rotation;

			this._fragmentsInitArguments = this._actorManager.getInitParams(this._fragmentId);
		}
		
		concreteRelease()
		{
			this._actorManager 			  = null;
			this._fragmentsDeathCallbacks = null;
		}
		
		concreteDestroy()
		{
			this._targetPos  = null;
			this._originPos  = null;
			this._dirInfo[0] = null;
			this._dirInfo    = null;
		}
		
		onCollide(opponent, deltaTime)
		{
			if ((opponent instanceof CityLogic))
			{
				this._externalParameters["cityHit"]();
			}
			else if ((opponent instanceof MissileLogic))
			{
				for (let i = 0; i < this._fragments; i++)
				{
					this._fragmentsInitArguments._logicInitParams[0].x = this._targetPos.x + NumberUtils.randRange(-this._fragmentsTargetOffset, this._fragmentsTargetOffset);
					this._fragmentsInitArguments._logicInitParams[0].y = this._targetPos.y;
					
					this._fragment = this._actorManager.setActor(this._fragmentId, this._posX + NumberUtils.randRange(-this._fragmentsInitPosOffset, this._fragmentsInitPosOffset), this._posY + NumberUtils.randRange(-this._fragmentsInitPosOffset, this._fragmentsInitPosOffset));
					
					if (this._fragmentsDeathCallbacks && this._fragment)
					{
						for (let j = 0; j < this._fragmentsDeathCallbacks.length; j++)
						{
							this._fragment.RecycleCallbackChain.add(this._fragmentsDeathCallbacks[j]);
						}
					}
				}

				const hitFeedbackArguments = Nukes.actorManager.getInitParams("HitFeedback");
				hitFeedbackArguments._logicInitParams[0] = "HIT +1";
				Nukes.actorManager.setActor("HitFeedback", this._x, this._y);
				this._externalParameters["HitAmount"] = 1;

				this._externalParameters["missileHit"]();
			}
			
			this._fragment = null;
			this._parent.Active = false;
		}
	}

	window.MeteorSplitLogic = MeteorSplitLogic;
}