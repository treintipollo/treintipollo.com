"use strict";

{
	class MissileLogic extends Logic
	{
		constructor()
		{
			super();

			this._dirX = 0;
			this._dirY = 0;
			this._accX = 0;
			this._accY = 0;
			this._dirXVariation = 0
			this._accVariation = 0;
			this._distance = 0;
			this._speed = 0;
			this._turningSpeed = 0;
			this._targetAngleDegrees = 0;
			this._targetAngleRadians = 0;
			this._deltaAngle = 0;
			this._angle = 0;
			this._deflected = false;
			this._deflectAngle = 0;
			this._deflectInitX = 0;
			this._deflectInitY = 0;
			this._deflectTime = 0;
			this._deflectTimer = 0;
			this._deflectRotation = 0;
			this._moveIntoTargetingPos = false;
			this._takeOff = false;
			this._firstOpponent = null;

			this._targetPos 	= new Point();
			this._originPos 	= new Point();
			this._targetingPos 	= new Point();
			this._dirInfo		= new Array(new Point(), 0);
			
			this._explotionCallbacks = new CallbackChain();
			this._launchCallbacks    = new CallbackChain();
		}
		
		initComplete()
		{
			this._externalParameters["explode"]     = this._explotionCallbacks;
			this._externalParameters["startEngine"] = null;
			this._externalParameters["deflected"]   = null;
			this._externalParameters["launched"]    = this._launchCallbacks;
		}
		
		update(deltaTime)
		{
			if (this._takeOff)
			{
				if (this._deflected)
				{
					if (this._deflectTimer < this._deflectTime)
					{
						this._deflectTimer 	+= deltaTime * 7;
						this._posX 			= this._deflectInitX + (this._dirX * this._deflectTimer);
						this._posY 			= this._deflectInitY - (this._dirY * this._deflectTimer) + (this._accY * 0.5 * this._deflectTimer * this._deflectTimer);
						this._rotation 		+= this._deflectRotation;
					}
					else
					{
						this._externalParameters["explode"].exec();
						this._parent.Active = false;
					}
				}
				else
				{
					if (this._moveIntoTargetingPos)
					{
						if (this._distance > 0)
						{
							this._accY 	 	-= this._accVariation * deltaTime;
							this._distance 	-= this._speed * 2 * deltaTime;
							this._dirX 	 	-= this._dirXVariation * deltaTime;
						}
						else
						{
							this._moveIntoTargetingPos = false;
							this._angle = NumberUtils.randRange(0, 360, true);
							
							this._externalParameters["startEngine"]();
							
							this._accX = 1;
							this._accY = 1;
						}
					}
					else
					{
						this._targetAngleRadians = TrigUtils.calcAngleAtan2(this._targetPos.x, this._targetPos.y, this._posX, this._posY);
						this._targetAngleDegrees = (this._targetAngleRadians * NumberUtils.TO_DEGREE) - this._angle + 90;
						
						this._deltaAngle = this._turningSpeed * deltaTime * 2;
						
						// shortest route
						if (this._targetAngleDegrees < -180)
						{
							this._targetAngleDegrees += 360;
						}

						if (this._targetAngleDegrees > 180)
						{
							this._targetAngleDegrees -= 360;
						}
						
						// cap turn this._speed
						if (this._targetAngleDegrees > this._deltaAngle)
						{
							this._targetAngleDegrees = this._deltaAngle;
						}
						else if (this._targetAngleDegrees < -this._deltaAngle)
						{
							this._targetAngleDegrees = -this._deltaAngle;
						}
						
						this._angle 		      	+= this._targetAngleDegrees;
						this._targetAngleRadians 	= this._angle * NumberUtils.TO_RADIAN;
						
						this._dirX = Math.cos(this._targetAngleRadians - (90 * NumberUtils.TO_RADIAN)) * this._speed * 2;
						this._dirY = Math.sin(this._targetAngleRadians - (90 * NumberUtils.TO_RADIAN)) * this._speed * 2;
						
						this._rotation = this._angle;
						
						if (VectorUtils.inRangeXY(this._posX, this._posY, this._targetPos.x, this._targetPos.y, 10))
						{
							this._externalParameters["explode"].exec();
							this._parent.Active = false;
						}
					}
					
					if (this._parent.Active)
					{
						this._posX += this._dirX * this._accX * deltaTime;
						this._posY += this._dirY * this._accY * deltaTime;
					}
				}
			}
		}
		
		concreteInit()
		{
			this._targetingPos.x 		= this._posX;
			this._targetingPos.y 		= this._posY - 100;
			this._moveIntoTargetingPos 	= true;
			this._takeOff 			 	= false;
			this._accX 				 	= 5;
			this._accY 				 	= 5;
			this._dirXVariation        	= NumberUtils.randRange(-100, 100, true);
			this._accVariation		 	= NumberUtils.randRange(10, 13, true);
			this._deflected			 	= false;
			this._deflectTime			= 4;
			
			this._externalParameters["Hit"] = false;
		}
		
		childInit(params)
		{
			this._takeOff = true;
			
			this._targetPos.x  	= params[0];
			this._targetPos.y  	= params[1];
			this._speed	     	= params[2];
			this._turningSpeed 	= params[3];
			
			this._originPos.x = this._posX;
			this._originPos.y = this._posY;
			
			this._dirInfo = VectorUtils.normalize(this._targetingPos, this._originPos, this._dirInfo, this._speed);
			
			this._distance = this._dirInfo[1];
			this._dirX     = this._dirInfo[0].x;
			this._dirY     = this._dirInfo[0].y;
			
			this._externalParameters["launched"].exec();
		}
		
		concreteRelease()
		{
			this._firstOpponent = null;
			this._explotionCallbacks.destroy();
			this._launchCallbacks.destroy();
		}
		
		concreteDestroy()
		{
			this._targetPos 	 	 = null;
			this._originPos 	 	 = null;
			this._targetingPos 	   	 = null;
			this._explotionCallbacks = null;
			this._launchCallbacks	 = null;
			
			CollectionUtils.nullVector(this._dirInfo);
		}
		
		onCollide(opponent, deltaTime)
		{
			if (opponent.ExternalParameters["shielding"])
			{
				if (!this._deflected)
				{
					this._externalParameters["deflected"]();
					
					this._deflected 	= true;
					this._deflectInitX  = this._posX;
					this._deflectInitY  = this._posY;
					this._deflectTimer  = 0;
					
					this._deflectAngle = TrigUtils.calcAngleAtan2(this._posX, this._posY, opponent._x, opponent._y) + (90 * NumberUtils.TO_RADIAN);
					
					if (this._deflectAngle * NumberUtils.TO_DEGREE < 180)
					{
						this._deflectRotation = 20;
					}
					else
					{
						this._deflectRotation = -20;
					}
					
					this._deflectAngle += NumberUtils.randRange(-20 * NumberUtils.TO_RADIAN, 20 * NumberUtils.TO_RADIAN, true);
					
					this._dirX = Math.sin(this._deflectAngle) * 30;
					this._dirY = Math.cos(this._deflectAngle) * 30;
					this._accY = 9.8;
					
					this._firstOpponent = opponent;
				}
				else
				{
					if (this._firstOpponent !== opponent)
					{
						this._externalParameters["Hit"] = true;
						this._externalParameters["explode"].exec();
						this._parent.Active = false;
					}
				}
			}
			else
			{
				this._externalParameters["Hit"] = true;
				this._externalParameters["explode"].exec();
				this._parent.Active = false;
			}
			
			if (!this._parent.Active)
			{
				opponent.ExternalParameters["MissileHit"] = true;
			}
		}
	}

	window.MissileLogic = MissileLogic;
}