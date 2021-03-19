"use strict";

{
	class MeteorAttack extends AttackState
	{
		constructor(stage, owner)
		{
			super(stage, owner);
			
			this._meteorArguments = null;
			
			this._nextMeteorTimer = 0;
			this._nextMeteorTime = 0;
			this._nextVortexIndex = 0;
			this._nextMeteorIndex = 0;
			this._meteorCount = 0;
			this._nextMeteorId = "";
			this._vortexPositions = null;
			this._meteorPositions = null;

			this._on_vortex_done = (system) => this.onVortexDone(system);
		}
		
		init(interStateConnection)
		{
			super.init(interStateConnection);
			
			this._nextVortexIndex = 0;
			this._nextMeteorIndex = 0;
			
			this._owner.ExternalParameters["shielding"] = true;
			
			if (!this._vortexPositions)
			{
				this._nextMeteorTime = this._owner._initialization._nextMeteorTime;
				this._meteorCount = this._owner._initialization._meteorCount;
				
				this._vortexPositions = new Array(this._meteorCount);
				this._meteorPositions = new Array(this._meteorCount);
				
				for (let i = 0; i < this._meteorCount; i++)
				{
					this._vortexPositions[i] = new SharedPoint();
				}
			}
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
			}
			
			if (this._nextMeteorTimer <= this._nextMeteorTime)
			{
				this._nextMeteorTimer += deltaTime;
			}
			else
			{
				if (this._nextVortexIndex < this._meteorCount)
				{
					this._vortexPositions[this._nextVortexIndex].x = NumberUtils.randRange(0, this._stage.stageWidth);
					this._vortexPositions[this._nextVortexIndex].y = this._owner._y + NumberUtils.randRange(-this._owner.getParent().Renderer.Container.height, this._owner.getParent().Renderer.Container.height);
					
					this._particleSystemArgument = ParticleSystemInitializationManager.getArguments("BossChargeUp");
					
					this._particleSystemArgument._systemProps[0] = this._owner._initialization._initSyatemRadius_1;
					this._particleSystemArgument._systemProps[1] = this._owner._initialization._stopSyatemRadius_1;
					
					this._particleSystemArgument._particleProps[0].x = this._owner._initialization._particleSpeedRange_1.x;
					this._particleSystemArgument._particleProps[0].y = this._owner._initialization._particleSpeedRange_1.y;
					
					ParticleSystemManager.GetSystem("BossChargeUp", this._vortexPositions[this._nextVortexIndex], false, this._on_vortex_done);
					
					this._nextMeteorTimer = 0;
				}
				else
				{
					this.stop();
				}
				
				this._nextVortexIndex++;
			}
		}
		
		completed(dispatchCompletedEvent = true)
		{
			super.completed(dispatchCompletedEvent);
			
			this._meteorArguments = null;
		}
		
		clean()
		{
			CollectionUtils.nullVector(this._vortexPositions);
			this._vortexPositions = null;

			CollectionUtils.nullVector(this._meteorPositions);
			this._meteorPositions = null;
		}
		
		onVortexDone(system)
		{
			this._meteorPositions[this._nextMeteorIndex] = system.GetController()._pos.clone();
			
			ParticleSystemManager.GetSystem("BossAttack", this._meteorPositions[this._nextMeteorIndex]);
			
			this._nextMeteorId = this._owner._initialization._meteorIds[ProbabilityUtils.discreteInverseSampling(this._owner._initialization._meteorProbabilities)];
			
			this._meteorArguments = this._owner._actorManager.getInitParams(this._nextMeteorId);
			
			let cityId = NumberUtils.randRange(0, this._owner._cities.length - 1, true);
			
			let x = this._owner._cities[cityId]._logic._x;
			let y = this._owner._cities[cityId]._logic._y;
			
			this._meteorArguments._logicInitParams[0] = new Point(x, y);
			
			this._owner._actorManager.setActor(this._nextMeteorId, this._meteorPositions[this._nextMeteorIndex].x, this._meteorPositions[this._nextMeteorIndex].y);
			
			this._nextMeteorIndex++;
		}
	}

	window.MeteorAttack = MeteorAttack;
}