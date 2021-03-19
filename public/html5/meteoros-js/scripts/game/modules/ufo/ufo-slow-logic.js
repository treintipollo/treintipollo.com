"use strict";

{
	class UfoSlowLogic extends UfoBaseLogic
	{
		
		constructor()
		{
			super();
			
			this._axes = null;
			this._hightStep = 0;
			this._distance = 0;
			this._abductionSystem = null;
			
			this._dirInfo 	      = [new Point(), 0];
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
			this._axes		 = params[1];
			
			this.baseInit(params[2]);
			
			this._hightStep = this._hightLimit / this._moves;
			
			this._moving = true;
			this._nextPos.x = this._axes[NumberUtils.randRange(0, this._axes.length - 1, true)].x;
			this._nextPos.y = this._posY + this._hightStep;
			this._dirInfo   = VectorUtils.normalizeXY(this._nextPos.x, this._nextPos.y, this._posX, this._posY, this._dirInfo, this._speed);
			this._distance  = this._dirInfo[1];
			
			this._targetPos.x = this._targetCity._x;
			this._targetPos.y = this._targetCity._y - 140;
		}
		
		update(deltaTime)
		{
			this._externalParameters["shielding"] = !this._moving;
			
			if (!this._startDeathMotion)
			{
				if (!this._moving)
				{
					if (this._moves !== -1)
					{
						if (this._moveWaitTimer <= this._moveWaitTime)
						{
							this._moveWaitTimer += deltaTime;
						}
						else
						{
							this._moves--;
						
							this._moving = true;

							if (this._moves === 0)
							{
								this._nextPos.x = this._targetPos.x;
								this._nextPos.y = this._targetPos.y;
							}
							else
							{
								this._nextPos.x = this._axes[NumberUtils.randRange(0, this._axes.length - 1, true)].x;
								this._nextPos.y = this._posY + this._hightStep;
							}

							this._dirInfo = VectorUtils.normalizeXY(this._nextPos.x, this._nextPos.y, this._posX, this._posY, this._dirInfo, this._speed);
							this._distance = this._dirInfo[1];
						}
					}
					else
					{
						this._moving = true;
						
						this._nextPos.x = this._posX;
						this._nextPos.y = -50;
						this._dirInfo   = VectorUtils.normalizeXY(this._nextPos.x, this._nextPos.y, this._posX, this._posY, this._dirInfo, this._speed);
						this._distance  = this._dirInfo[1];
					}
				}
				else
				{
					if (this._distance > 0)
					{
						if (!this._hitTaken)
						{
							this._distance -= this._speed * deltaTime;
						}
					}
					else
					{
						if (this._moves === 0)
						{
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
									this._actorManager.setActor("Bomb", this._posX, this._posY, 0, 1, true);
									this._moves = -1;
									this.resetTimers();
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
						else if (this._moves === -1)
						{
							this._parent.Active = false;
						}
						else
						{
							this.resetTimers();
						}
						
						this._dirInfo[0].x = 0;
						this._dirInfo[0].y = 0;
					}
				}
			}
			
			if (this._parent.Active)
			{
				this.baseUpdate(deltaTime);
				
				this._posX += this._dirInfo[0].x * deltaTime;
				this._posY += this._dirInfo[0].y * deltaTime + Math.sin(this._oscillator);
				
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
			
			this._dirInfo		  	 = null;

			if (this._humanParticlesPos)
			{
				this._humanParticlesPos.Clean();
				this._humanParticlesPos = null;
			}
			
			if (this._abductionSystem)
			{
				this._abductionSystem._stop = true;
				this._abductionSystem = null;
			}
			
			this._on_humans_captured = null;
		}
		
		resetTimers()
		{
			this._moving = false;
			this._moveWaitTimer = 0;
		}
		
		onHumansCaptured(system)
		{
			if (this._targetCity instanceof CityLogic)
			{
				this._moves = -1;
				this._targetCity.removePopulation();
				
				this.resetTimers();
			}
		}
	}

	window.UfoSlowLogic = UfoSlowLogic;
}