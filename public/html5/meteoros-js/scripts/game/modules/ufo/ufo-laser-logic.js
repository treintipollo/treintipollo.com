"use strict";

{
	class UfoLaserLogic extends UfoBaseLogic
	{
		constructor()
		{
			super();

			this._axes = null;
			this._laserInitArguments = null;
			this._laser = null;

			this._hitCount = 5;

			this._on_laser_dead = (actor) => this.onLaserDead(actor);
		}
		
		concreteInit()
		{
			this._externalParameters["shielding"] = true;
			this._externalParameters["active"] 	= true;
			
			this._laser = null;
		}
		
		childInit(params)
		{
			this._targetCity = params[0];
			this._axes		 = params[1];
			
			this.baseInit(params[2]);
			
			this._targetPos.x = this._targetCity._x;
			this._targetPos.y = this._targetCity._y - 350;
		}
		
		update(deltaTime)
		{
			if (!this._startDeathMotion)
			{
				if (!this._moving)
				{
					if (this._moves !== -1)
					{
						if (this._scaleX < 1)
						{
							this._scaleX += this._vanishingSpeed * deltaTime;
						}
						else
						{
							this._scaleX = 1;
							this._externalParameters["active"] = true;
							
							if (this._moveWaitTimer <= this._moveWaitTime)
							{
								this._moveWaitTimer += deltaTime;
							}
							else
							{
								this._moving = true;
								this._moves--;
								
								if (this._moves === 0)
								{
									this._nextPos.x = this._targetPos.x;
									this._nextPos.y = this._targetPos.y;
								}
								else
								{
									this._nextPos.x = this._axes[NumberUtils.randRange(0, this._axes.length - 1, true)].x;
									this._nextPos.y = NumberUtils.randRange(30, this._hightLimit);
								}
							}
						}
					}
					else
					{
						if (this._scaleX < 1)
						{
							this._scaleX += this._vanishingSpeed * deltaTime;
						}
						else
						{
							this._scaleX = 1;
							this._externalParameters["active"] = true;
							this._nextPos.x = -9001;
							this._nextPos.y = -9001;
							
							if (this._attackWaitTimer <= this._attackWaitTime)
							{
								this._attackWaitTimer += deltaTime;
								
								this._externalParameters["shielding"] = (this._attackWaitTimer <= (this._attackWaitTime / 2));
							}
							else
							{
								if (!this._laser)
								{
									this._laserInitArguments = this._actorManager.getInitParams("Lazor");
									this._laserInitArguments._logicInitParams[0] = this._targetCity;
									this._laserInitArguments._logicInitParams[1] = this;
									this._laserInitArguments._rendererInitParams[0] = this._targetCity._y - this._posY;
									
									this._laser = this._actorManager.setActor("Lazor", this._posX, this._posY, 0, 1, true, this._on_laser_dead);
								}
							}
						}
					}
				}
				else
				{
					if (this._scaleX > 0)
					{
						this._externalParameters["active"] = false;
						this._scaleX -= this._vanishingSpeed * deltaTime;
					}
					else
					{
						if (this._moves === -1)
						{
							this._parent.Active = false;
						}
						else if (this._moves === 0)
						{
							this._moves = -1;
						}
						
						this._posX 			= this._nextPos.x;
						this._posY 			= this._nextPos.y;
						this._moving 		= false;
						this._moveWaitTimer = 0;
						this._moveWaitTime 	= NumberUtils.randRange(1, 2);
					}
				}
			}
			else
			{
				if (this._laser)
				{
					this._laser.Active = false;
				}

				this._laser = null;
			}
			
			if (this._parent.Active)
			{
				this.baseUpdate(deltaTime);
				
				this._posY += deltaTime + Math.sin(this._oscillator);
			}
		}
		
		concreteRelease()
		{
			this.baseRelease();
		}

		concreteDestroy()
		{
			this.baseDestroy();

			this._on_laser_dead = null;
		}
		
		onLaserDead(laser)
		{
			this._moving = true;
		}
	}

	window.UfoLaserLogic = UfoLaserLogic;
}