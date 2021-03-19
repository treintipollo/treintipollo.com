"use strict";

{
	class UfoTeleportLogic extends UfoBaseLogic
	{
		
		constructor()
		{
			super();
			
			this._axes = null;
			this._abductionSystem = null;
			this._humanParticlesPos = new SharedPoint();
			this._on_humans_captured = (system) => this.onHumansCaptured(system);
		}
		
		concreteInit()
		{
			this._externalParameters["shielding"] = false;
			this._externalParameters["active"] 	= true;
		}
		
		childInit(params)
		{
			this._targetCity = params[0];
			this._axes = params[1];
			
			this.baseInit(params[2]);
			
			this._targetPos.x = this._targetCity._x;
			this._targetPos.y = this._targetCity._y - 140;
		}
		
		update(deltaTime)
		{
			if (!this._startDeathMotion)
			{
				if (!this._moving)
				{
					if (this._moves != -1)
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
								
								this._externalParameters["shielding"] = (this._moveWaitTimer <= (this._moveWaitTime / 2));
							}
							else
							{
								this._moving = true;
								this._moves--;
								
								this.stopTumbling();
								
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
							this._externalParameters["shielding"] = true;
							
							if (this._attackWaitTimer <= this._attackWaitTime)
							{
								this._attackWaitTimer += deltaTime;
							}
							else
							{
								if (!this._targetCity.ExternalParameters["domeAlreadyDestroyed"])
								{
									// Attack
									if (!this._startCapture)
									{
										this._actorManager.setActor("Bomb", this._posX, this._posY, 0, 1, true);
										this._startCapture = true;
										this._moving = true;
									}
								}
								else
								{
									// Human stealing
									if (!this._startCapture)
									{
										this._abductionSystem = ParticleSystemManager.GetSystem("HumanVacum", this._humanParticlesPos, true, this._on_humans_captured);
										this._startCapture = true;
									}
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
						
						this.resetTimers();
					}
				}
			}
			
			if (this._parent.Active)
			{
				this.baseUpdate(deltaTime);
				
				this._posY += deltaTime + Math.sin(this._oscillator);
				
				this._humanParticlesPos.x = this._posX;
				this._humanParticlesPos.y = this._posY;
			}
		}
		
		concreteRelease()
		{
			this.baseRelease();
			this._axes = null;
		}
		
		concreteDestroy()
		{
			this.baseDestroy();
			
			if (this._humanParticlesPos)
			{
				this._humanParticlesPos.Clean();
				this._humanParticlesPos = null;
			}

			this._on_humans_captured = null;
			
			if (this._abductionSystem)
			{
				this._abductionSystem._stop = true;
				this._abductionSystem   = null;
			}
		}
		
		resetTimers()
		{
			this._posX 			 = this._nextPos.x;
			this._posY 			 = this._nextPos.y;
			this._moving 		 = false;
			this._moveWaitTimer  = 0;
			this._moveWaitTime 	 = NumberUtils.randRange(10, 15);
		}
		
		onHumansCaptured(system)
		{
			if (this._targetCity instanceof CityLogic)
			{
				this._moving = true;
				this._targetCity.removePopulation();
			}
		}
	}

	window.UfoTeleportLogic = UfoTeleportLogic;
}