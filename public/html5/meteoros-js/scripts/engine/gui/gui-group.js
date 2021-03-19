"use strict";

{
	class GuiGroup
	{
		constructor(id, actorManager, groupDead, priority)
		{
			this._doingFadeOuts = false;
			this._onAllComponentsDead = null;
			
			this._logic = null;
			
			this._components = [];
			this._componentManagerIndexes = [];
			
			this._id			= id;
			this._actorManager 	= actorManager;
			this._groupDead 	= groupDead;
			this._priority     	= priority;
			
			this._activeActors = 0;
		}
		
		set AllComponentsDead(value)
		{
			this._onAllComponentsDead = value;
		}
		
		add(initParamsId, x, y, r = 0, s = 1)
		{
			const actor = this._actorManager.setActor(initParamsId, x, y, r, s, true, (actr) => this.onGuiActorRecycle(actr));
			
			if (actor)
			{
				this._components.push(actor);
				this._componentManagerIndexes.push(actor.ManagerIndex);
				this._activeActors++;
			}
			
			this._doingFadeOuts = false;
			
			return actor;
		}
		
		onGuiActorRecycle(actor)
		{
			this._activeActors--;
			
			if (this._activeActors === 0)
			{
				if (this._onAllComponentsDead)
				{
					this._onAllComponentsDead();
				}
				
				if (this._groupDead)
				{
					this._groupDead(this._id);
				}
				
				this.destroy();
			}
		}
		
		isAnyoneFadingOut()
		{
			for (let i = 0; i < this._components.length; i++)
			{
				if (this._components[i])
				{
					this._logic = this._components[i].Logic;
					
					if (this._logic)
					{
						if (this._logic._doFadeOut && !this._doingFadeOuts)
						{
							return true;
						}
					}
				}
			}
			
			return false;
		}
		
		startFadeOuts()
		{
			if (!this._doingFadeOuts)
			{
				for (let i = 0; i < this._components.length; i++)
				{
					this._logic = this._components[i].Logic;
					this._logic.startFadeOut();
				}
				
				this._doingFadeOuts = true;
			}
		}
		
		isDestroyable()
		{
			return true;
		}
		
		destroy()
		{
			CollectionUtils.nullVector(this._components);
			CollectionUtils.nullVector(this._componentManagerIndexes);
			
			this._onAllComponentsDead 	= null;
			this._logic 			  	= null;
			this._actorManager 			= null;
			this._groupDead 			= null;
		}
	}

	window.GuiGroup = GuiGroup;
}