"use strict";

{
	class UfoScrollLogic extends UfoBaseLogic
	{
		constructor()
		{
			super();
			
			this._dirInfo   		= [new Point(), 0];
			this._humanParticlesPos = new SharedPoint();

			this._direction = 0;
			this._distance = 0;
			this._hightStep = 0;
			this._abductionSystem = null;

			this._on_humans_captured = (system) => this.onHumansCaptured(system);
		}
		
		initComplete()
		{
			this._externalParameters["shielding"] = false;
			this._externalParameters["active"] 	= true;
			
			this._direction = Math.random() < 0.5 ? 0 : 1;
			this.setNextPos();
		}
		
		childInit(params)
		{
			this._targetCity = params[0];
			
			this.baseInit(params[1]);
			
			this._hightStep   = this._hightLimit / this._moves;
			
			this._targetPos.x = this._targetCity._x;
			this._targetPos.y = this._targetCity._y - 140;
		}
		
		update(deltaTime)
		{
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
							this.setNextPos(this._hightStep, this._moves);
						}
					}
					else
					{
						this._moving = true;
						
						this._nextPos.x = this._posX;
						this._nextPos.y = -this._parent.Collider._shieldRadius * 2;
						
						this._dirInfo = VectorUtils.normalizeXY(this._nextPos.x, this._nextPos.y, this._posX, this._posY, this._dirInfo, this._speed);
						this._distance = this._dirInfo[1];
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
							if (this._attackWaitTimer <= this._attackWaitTime)
							{
								this._attackWaitTimer += deltaTime;
							}
							else
							{
								if (!this._targetCity.ExternalParameters["domeAlreadyDestroyed"])
								{
									// Attack
									this._externalParameters["shielding"] = false;
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
		}
		
		concreteDestroy()
		{
			this.baseDestroy();
			
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
			this._moveWaitTime = NumberUtils.randRange(1, 2);
		}
		
		setNextPos(step = 0, moves = -9001)
		{
			this._moving = true;
			
			if (moves === 0)
			{
				this._externalParameters["shielding"] = true;
				this._nextPos.x = this._targetPos.x;
				this._nextPos.y = this._targetPos.y;
				this._posY = this._targetPos.y
			}
			else
			{
				if (this._direction === 1)
				{
					this._nextPos.x = -this._parent.Collider._shieldRadius * 2;
				}
				else
				{
					this._nextPos.x = this._parent.Collider._shieldRadius * 2 + this._actorManager.Stage.stageWidth;
				}
				
				this._posY += step;
				this._nextPos.y = this._posY;
			}
			
			this._dirInfo = VectorUtils.normalizeXY(this._nextPos.x, this._nextPos.y, this._posX, this._posY, this._dirInfo, this._speed);
			this._distance = this._dirInfo[1];
			
			if (this._dirInfo[0].x <= 0)
			{
				this._direction = 0;
			}
			else
			{
				this._direction = 1;
			}
		}
		
		onHumansCaptured(system)
		{
			if (this._targetCity instanceof CityLogic)
			{
				this._externalParameters["shielding"] = false;
				this._moves = -1;
				
				this._targetCity.removePopulation();
				
				this.resetTimers();
			}
		}
	}

	window.UfoScrollLogic = UfoScrollLogic;
}