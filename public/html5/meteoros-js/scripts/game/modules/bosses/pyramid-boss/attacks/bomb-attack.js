"use strict";

{
	class BombAttack extends AttackState
	{
		constructor(stage, owner)
		{
			super(stage, owner);
			
			this._bombActor = null;
			this._bombInitArguments = null;
			this._nextBombIndex = 0;
			this._nextBombTimer = 0;
			this._nextBombTime = 0;
			this._bombDirs = null;
			this._bombCount = 0;
			this._initAngle = 0;
			this._incrementAngle = 0;
			this._vortexComplete = false;
			this._launchPosition = new SharedPoint();

			this._on_vortex_done = (system) => this.onVortexDone(system);
		}
		
		init(interStateConnection)
		{
			super.init(interStateConnection);
			
			this._nextBombIndex    = 0;
			this._nextBombTimer    = 0;
			this._launchPosition.x = 0;
			this._launchPosition.y = 0;
			this._vortexComplete   = false;
			
			if (!this._bombDirs)
			{
				this._bombCount = this._owner._initialization._bombCount;
				
				this._nextBombTime   = 0.15;
				this._initAngle 	 = 45 * NumberUtils.TO_RADIAN;
				this._incrementAngle = (90 / (this._bombCount - 1)) * NumberUtils.TO_RADIAN;
				this._bombDirs	     = new Array(this._bombCount);
				
				for (let i = 0; i < this._bombCount; i++)
				{
					this._bombDirs[i]   = new Point();
					this._bombDirs[i].x = Math.cos(this._initAngle);
					this._bombDirs[i].y = Math.sin(this._initAngle);
					
					this._initAngle += this._incrementAngle;
				}
			}
			
			this._owner.ExternalParameters["shielding"] = true;
		}
		
		run(deltaTime)
		{
			if (this._owner._attackWaitTimer <= this._owner._attackWaitTime)
			{
				this._owner._attackWaitTimer += deltaTime;
			}
			else
			{
				this._owner.ExternalParameters["shielding"] = false;
				
				if (this._launchPosition.length === 0)
				{
					this._launchPosition.x = this._owner._x;
					this._launchPosition.y = this._owner._y + 30;
					
					this._particleSystemArgument = ParticleSystemInitializationManager.getArguments("BossChargeUp");
					
					this._particleSystemArgument._systemProps[0] = this._owner._initialization._initSyatemRadius_1;
					this._particleSystemArgument._systemProps[1] = this._owner._initialization._stopSyatemRadius_1;
					
					this._particleSystemArgument._particleProps[0].x = this._owner._initialization._particleSpeedRange_1.x;
					this._particleSystemArgument._particleProps[0].y = this._owner._initialization._particleSpeedRange_1.y;
					
					ParticleSystemManager.GetSystem("BossChargeUp", this._launchPosition, false, this._on_vortex_done);
				}
				
				if (this._vortexComplete)
				{
					if (this._nextBombTimer <= this._nextBombTime)
					{
						this._nextBombTimer += deltaTime;
					}
					else
					{
						if (this._nextBombIndex === 0)
						{
							this._launchPosition.x = this._owner._x;
							this._launchPosition.y = this._owner._y + 30;
						}
						
						if (this._nextBombIndex < this._bombCount)
						{
							this._bombInitArguments = this._owner._actorManager.getInitParams("Bomb");
							this._bombInitArguments._logicInitParams[1] = this._bombDirs[this._nextBombIndex].x;
							this._bombInitArguments._logicInitParams[2] = this._bombDirs[this._nextBombIndex].y;
							
							this._bombActor = this._owner._actorManager.setActor("Bomb", this._launchPosition.x, this._launchPosition.y, 0, 1);
							
							if (this._bombActor)
							{
								this._bombActor.Renderer.sendBack();
							}
							
							this._nextBombTimer = 0;
						}
						else
						{
							this.stop();
						}
						
						this._nextBombIndex++;
					}
				}
			}
		}
		
		completed(dispatchCompletedEvent = true)
		{
			super.completed(dispatchCompletedEvent);
			
			this._bombInitArguments = null;
			this._bombActor		  	= null;
		}
		
		clean()
		{
			CollectionUtils.nullVector(this._bombDirs);
			
			if (this._launchPosition = null)
			{
				this._launchPosition.Clean();
				this._launchPosition = null;
			}

			this._on_vortex_done = null;
		}
		
		onVortexDone(system)
		{
			ParticleSystemManager.GetSystem("BossAttack", this._launchPosition);
			
			this._vortexComplete = true;
		}
	}

	window.BombAttack = BombAttack;
}