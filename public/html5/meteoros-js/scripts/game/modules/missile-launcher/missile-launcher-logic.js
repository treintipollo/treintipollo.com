"use strict";

{
	class MissileLauncherLogic extends FactoryLogic
	{
		constructor()
		{
			super();

			this._missileAmount = 0;
			this._missileWidth = 0;
			this._missileInitializationArguments = null;
			this._missiles = null;
			this._nextMissile = 0;
			this._targetPos = null;
			this._missileOffset = 0;
			this._invalidTargetActor = null;
			this._isInvalidTargetAvailable = null;
			
			this._missilePos = new Point();
			this._on_missile_destroyed = (actor) => this.onMissileDestroyed(actor);
		}
		
		concreteInit()
		{
			this._externalParameters["LaunchedMissiles"] = 0;
			this._externalParameters["MissileHits"] 	 = 0;
		}
		
		initComplete()
		{
			if (!this._missiles)
			{
				this._missiles = new Array(this._missileAmount);
			}
			
			for (let i = 0; i < this._missileAmount; i++)
			{
				this._missilePos.x = this._posX + this._missileWidth * (i + 1);
				this._missilePos.y = this._posY;

				this._missiles[i] = this._actorManager.setActor("Missile", this._missilePos.x - this._missileOffset, this._missilePos.y, 0, 1, true, this._on_missile_destroyed, false);
			}
			
			this._nextMissile = 0;
		}
		
		update(deltaTime)
		{
			if (this._input.LogicParameters["activateMissile"])
			{
				if (this._nextMissile < this._missileAmount)
				{
					if (this._missiles[this._nextMissile])
					{
						if (this._missiles[this._nextMissile].Active)
						{
							this._targetPos = this._input.LogicParameters["targetPos"];
						
							this._missileInitializationArguments._logicInitParams[0] = this._targetPos.x;
							this._missileInitializationArguments._logicInitParams[1] = this._targetPos.y;
							
							this._missiles[this._nextMissile].Logic.childInit(this._missileInitializationArguments._logicInitParams);
							
							this.setChildDestructionCallbacks(this._missiles[this._nextMissile]);
							
							this._externalParameters["LaunchedMissiles"]++;
							
							this._missiles[this._nextMissile] = null;
						}
						else
						{
							this._missiles[this._nextMissile] = null;
						}
					}
					
					this._nextMissile++;
					
					if (this._nextMissile >= this._missileAmount)
					{
						this.initComplete();
					}
				}
			}
			
			if (this._input.LogicParameters["invalidPos"])
			{
				this._targetPos = this._input.LogicParameters["targetPos"];
				this._isInvalidTargetAvailable = this._actorManager.setActor("InvalidTarget", this._targetPos.x, this._targetPos.y);
				
				if (this._isInvalidTargetAvailable)
				{
					this._invalidTargetActor = this._isInvalidTargetAvailable;
				}
				else
				{
					this._invalidTargetActor.Logic._x = this._targetPos.x;
					this._invalidTargetActor.Logic._y = this._targetPos.y;
					
					this._invalidTargetActor.Logic.childInit(this._actorManager.getInitParams("InvalidTarget")._logicInitParams);
				}
			}
		}
		
		childInit(params)
		{
			this._actorManager  = params[0];
			this._missileAmount = params[1];
			this._missileWidth  = params[2];
			
			this._missileOffset = (this._missileAmount * this._missileWidth + this._missileWidth) / 2;
			
			if (!this._missileInitializationArguments)
			{
				this._missileInitializationArguments = this._actorManager.getInitParams("Missile");
			}
		}
		
		concreteRelease()
		{
			super.concreteRelease();
			
			this._invalidTargetActor = null;
			this._isInvalidTargetAvailable = null;
			
			CollectionUtils.nullVector(this._missiles);
		}
		
		concreteDestroy()
		{
			this._missilePos = null;
			this._missileInitializationArguments = null;
			this._on_missile_destroyed = null;
		}
		
		onMissileDestroyed(missile)
		{
			if (missile.Logic.ExternalParameters["Hit"] == true)
			{
				this._externalParameters["MissileHits"]++;
			}
		}
	}

	window.MissileLauncherLogic = MissileLauncherLogic;
}