"use strict";

{
	class ActorManager
	{
		constructor(actorClass, stage, modulePackageGetter, collisionManager, initParamsGetter, soundManager)
		{
			this._actors = null;
			this._currentActor = null;
			this._actorVector = null;
			this._actorClass = null;
			
			this._collisionManager = null;
			this._modulePackageGetter = null;
			this._initParamsGetter = null;
			this._soundManager = null;
			this._stage = null;
			
			this._modulePackage = null;
			this._initArguments = null;
			
			this._collisionManager 	  = collisionManager;
			this._modulePackageGetter = modulePackageGetter;
			this._initParamsGetter    = initParamsGetter;
			this._soundManager		  = soundManager;
			
			this._stage				 = stage;
			this._actorClass		 = actorClass;
		}

		get Stage()
		{
			return this._stage;
		}
		
		init()
		{
			if (!this._actors)
			{
				this._actors = new ActorCollection(this._actorClass, this._modulePackageGetter.getTotalModuleCount());
				this._actorVector = this._actors.getVector();
			}
			else
			{
				const diff = this._modulePackageGetter.getTotalModuleCount() - this._actorVector.length;
				this._actors.addActors(Math.abs(diff));
				this._actorVector = this._actors.getVector();
			}
		}
		
		setActor(initParamsId, x, y, r = 0, s = 1, redraw = true, onRecycle = null, useLArgs = true, useRArgs = true)
		{
			if (this._actors.actorAvailable())
			{
				this._initArguments = this._initParamsGetter.getInitParams(initParamsId);
				this._modulePackage = this._modulePackageGetter.getPackage(this._initArguments._bindedActorId);

				if (this._modulePackage)
				{
					this._modulePackage._logic.init(x, y, r, s);
			
					if (useLArgs && this._initArguments._logicInitParams)
					{
						this._modulePackage._logic.childInit(this._initArguments._logicInitParams);
					}
					
					if (this._modulePackage._renderer)
					{
						this._modulePackage._renderer.init(x, y, redraw, this._stage, r, s);
						
						if (useRArgs && this._initArguments._rendererInitParams)
						{
							this._modulePackage._renderer.childInit(this._initArguments._rendererInitParams);
						}
					}
					
					if (this._modulePackage._input)
					{
						this._modulePackage._input.init(this._modulePackage._logic, this._initArguments._inputInitParams);
					}
					
					if (this._modulePackage._collider)
					{
						this._modulePackage._collider.init(this._modulePackage._logic, this._initArguments._colliderInitParams);
					}
					
					if (this._modulePackage._sound)
					{
						this._modulePackage._sound.init(this._soundManager, this._modulePackage._logic, this._initArguments._soundInitParams);
					}
					
					this._currentActor = this._actors.getActor();
					
					if (this._currentActor)
					{
						this._currentActor.init(this._modulePackage, onRecycle);
						
						if (this._currentActor.Collider)
						{
							this._collisionManager.addActor(this._currentActor);
						}
						
						this._currentActor.initComplete();
						
						this._initArguments = this._initParamsGetter.getInitParams(initParamsId);
						
						if (this._initArguments._bindedActorId !== this._currentActor.Modules._name)
						{
							this._currentActor = this._actors.getLastActorOfType(this._initArguments._bindedActorId);
						}
					}
					
					this._modulePackage = null;
					
					return this._currentActor;
				}
			}
			
			return null;
		}
		
		getActors(logic = null, renderer = null, input = null, collider = null)
		{
			let result = [];
			let lMatch = false;
			let rMatch = false;
			let iMatch = false;
			let cMatch = false;
			
			for (let i = this._actorVector.length - 1; i >= 0; i--)
			{
				this._currentActor = this._actorVector[i];
				
				if (this._currentActor.Active)
				{
					lMatch = logic 	  === null ? true : false;
					rMatch = renderer === null ? true : false;
					iMatch = input 	  === null ? true : false;
					cMatch = collider === null ? true : false;
					
					if (logic !== null && this._currentActor.Logic instanceof logic)
					{
						lMatch = true;
					}
					
					if (renderer !== null && this._currentActor.Renderer instanceof renderer)
					{
						rMatch = true
					}
					
					if (input !== null && this._currentActor.Input instanceof input)
					{
						iMatch = true;
					}
					
					if (collider !== null && this._currentActor.Collider instanceof collider)
					{
						cMatch = true;
					}
					
					if (lMatch && rMatch && iMatch && cMatch)
					{
						result.push(this._currentActor);
					}
				}
			}
			
			return result;
		}
		
		getModulesOfType(actorId)
		{
			return this._modulePackageGetter.getPackageCollection(actorId);
		}
		
		getInitParams(initParamsId)
		{
			return this._initParamsGetter.getInitParams(initParamsId);
		}
		
		update(deltaTime)
		{
			if (this._actorVector)
			{
				for (let i = this._actorVector.length - 1; i >= 0; i--)
				{
					const actor = this._actorVector[i];

					actor.update(this._modulePackageGetter, this._collisionManager, this._actors, deltaTime);
				}
			}
		}
		
		updateSet(set, deltaTime)
		{
			if (this._actorVector)
			{
				for (let i = set.length - 1; i >= 0; i--)
				{
					this._actorVector[set[i]].update(this._modulePackageGetter, this._collisionManager, this._actors, deltaTime);
				}
			}
		}
		
		release(actorsToSave = null)
		{
			this._actors.destroy(actorsToSave);
			this._initParamsGetter.destroy(actorsToSave);
			this._modulePackageGetter.destroy(actorsToSave);
			
			this._collisionManager.destroy();
			
			if (!actorsToSave)
			{
				CollectionUtils.nullVector(this._actorVector);
				this._actors = null;
			}
			
			this._currentActor  = null;
			this._modulePackage = null;
			this._initArguments	= null;
		}
	}

	window.ActorManager = ActorManager;
}