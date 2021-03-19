"use strict";

{
	class LaserAttack extends AttackState
	{
		constructor(stage, owner)
		{
			super(stage, owner);
			
			this._laserChargeUpController = null;
			this._laserSystemProperties = null;
			this._startChargeUp = false;
			this._laserCurrentCount = 0;
			this._vortexPosition = new SharedPoint();

			this._on_vortex_done = (system) => this.onVortexDone(system);
		}
		
		init(interStateConnection)
		{
			super.init(interStateConnection);
			
			this._startChargeUp     = false;
			this._laserCurrentCount = this._owner._initialization._laserAmounts[ProbabilityUtils.discreteInverseSampling(this._owner._initialization._laserAmountProbabilities)];
			
			this._owner.ExternalParameters["shielding"] = true;
		}
		
		run(deltaTime)
		{
			this._vortexPosition.x = this._owner._x;
			this._vortexPosition.y = this._owner._y - this._owner.ExternalParameters["eyeHeight"];
			
			if (this._owner._attackWaitTimer <= this._owner._attackWaitTime)
			{
				this._owner._attackWaitTimer += deltaTime;
			}
			else
			{
				this._owner.ExternalParameters["shielding"] = false;
				
				if (!this._startChargeUp)
				{
					this._startChargeUp = true;
					
					this._particleSystemArgument = ParticleSystemInitializationManager.getArguments("BossChargeUp");
					
					this._particleSystemArgument._systemProps[0] = this._owner._initialization._initSyatemRadius_2;
					this._particleSystemArgument._systemProps[1] = this._owner._initialization._stopSyatemRadius_2;
					
					this._particleSystemArgument._particleProps[0].x = this._owner._initialization._particleSpeedRange_2.x;
					this._particleSystemArgument._particleProps[0].y = this._owner._initialization._particleSpeedRange_2.y;
					
					this._laserChargeUpController = ParticleSystemManager.GetSystem("BossChargeUp_2", this._vortexPosition, true, this._on_vortex_done);
				}
			}
		}
		
		completed(dispatchCompletedEvent = true)
		{
			super.completed(dispatchCompletedEvent);
			
			if (this._laserChargeUpController)
			{
				this._laserChargeUpController._clear = true;
			}
			
			this._laserSystemProperties   = null;
			this._laserChargeUpController = null;
		}
		
		clean()
		{
			if (this._vortexPosition)
			{
				this._vortexPosition.Clean();
				this._vortexPosition = null;
			}

			this._on_vortex_done = null;
		}
		
		onVortexDone(system)
		{
			if (this._laserChargeUpController)
			{
				ParticleSystemManager.GetSystem("MissileExplosion", this._vortexPosition);
				ParticleSystemManager.GetSystem("MissileExplosion", this._vortexPosition);
				ParticleSystemManager.GetSystem("MissileExplosion", this._vortexPosition);
				
				let cityId = NumberUtils.randRange(0, this._owner._cities.length - 1, true);
				
				for (let i = 0; i < this._laserCurrentCount; i++)
				{
					let currentCityId = (cityId + i > this._owner._cities.length - 1) ? i : cityId + i;
					
					let x = this._owner._cities[currentCityId]._logic._x;
					let y = this._owner._cities[currentCityId]._logic._y;
					
					this._laserSystemProperties = ParticleSystemInitializationManager.getArguments("DeathRay")._systemProps;
					
					this._laserSystemProperties[0].x = this._vortexPosition.x;
					this._laserSystemProperties[0].y = this._vortexPosition.y;
					this._laserSystemProperties[1].x = x;
					this._laserSystemProperties[1].y = y;
					
					ParticleSystemManager.GetSystem("DeathRay", this._vortexPosition);
					
					this._owner._cities[currentCityId]._logic.takeDamage();
				}

				this.stop();
			}
		}
	}

	window.LaserAttack = LaserAttack;
}