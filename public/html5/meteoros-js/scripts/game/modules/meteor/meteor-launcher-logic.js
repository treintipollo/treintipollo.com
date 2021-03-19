"use strict";

{
	class MeteorLauncherLogic extends FactoryLogic
	{
		constructor()
		{
			super();

			this._maxWidth = 0;
			this._shootInterval = 0;
			this._deltaAccumulator = 0;
			
			this._targets = null;
			this._meteorIds = null;
			this._probabilities = null;
			
			this._meteorInitParams = null;
			this._nextMeteorId = "";
			
			this._meteorPos = new Point();
		}
		
		update(deltaTime)
		{
			if (this._deltaAccumulator < this._shootInterval)
			{
				this._deltaAccumulator += deltaTime;
			}
			else
			{
				this._deltaAccumulator = 0;
				
				this._nextMeteorId = this._meteorIds[ProbabilityUtils.discreteInverseSampling(this._probabilities)];
				
				this._meteorInitParams = this._actorManager.getInitParams(this._nextMeteorId);
				
				if (this._meteorInitParams)
				{
					this._meteorInitParams._logicInitParams[0] = this._targets[NumberUtils.randRange(0, this._targets.length - 1, true)];
					this._meteorInitParams._logicInitParams[this._meteorInitParams._logicInitParams.length - 1] = this._onChildDestroyed;
					
					this._meteorPos.x = NumberUtils.randRange(0, this._maxWidth);
					this._meteorPos.y = -this._meteorInitParams._colliderInitParams[0];
					
					const meteor = this._actorManager.setActor(this._nextMeteorId, this._meteorPos.x, this._meteorPos.y, 0, 1, true);
					
					if (meteor)
						this.setChildDestructionCallbacks(meteor);
				}
			}
		}
		
		concreteInit()
		{
			this._deltaAccumulator = 0;
		}
		
		childInit(params)
		{
			this._actorManager  = params[0];
			this._maxWidth      = params[1];
			this._targets 	  	= params[2];
			this._shootInterval = params[3];
			this._meteorIds     = params[4];
			this._probabilities = params[5];
		}
		
		concreteRelease()
		{
			super.concreteRelease();
			
			this._targets 	  	= null;
			this._meteorIds     = null;
			this._probabilities = null;
		}
		
		concreteDestroy()
		{
			this._meteorPos 		= null;
			this._meteorInitParams 	= null;
		}
	}

	window.MeteorLauncherLogic = MeteorLauncherLogic;
}