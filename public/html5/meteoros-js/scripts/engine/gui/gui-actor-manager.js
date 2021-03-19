"use strict";

{
	class GuiActorManager
	{
		constructor(actorManager)
		{
			this._componentGroups = new Map();
			this._actorManager = actorManager;
			
			this._groupCount = 0;
			this._highestPriority = 0;
			
			this._allGroupsDead  = null;
		}
		
		SetAllgroupsDeadCallback(value)
		{
			this._allGroupsDead = value;
		}
		
		add(groupId, initParamsId, x, y, r = 0, s = 1, groupDeadCallback = null, topPriority = false)
		{
			let priority = topPriority ? this._highestPriority + 1 : 0;
			
			let guiGroup = null;

			if (!this._componentGroups.has(groupId))
			{
				guiGroup = new GuiGroup(groupId, this._actorManager, (groupId) => this.onGroupDead(groupId), priority);
				guiGroup.AllComponentsDead = groupDeadCallback;
				
				this._componentGroups.set(groupId, guiGroup);
				this._groupCount++;
			}
			else
			{
				guiGroup = this._componentGroups.get(groupId);
			}
			
			if (priority > this._highestPriority)
			{
				this._highestPriority = priority;
			}
			
			return guiGroup.add(initParamsId, x, y, r, s);
		}
		
		update(pauseType, deltaTime)
		{
			for (const [groupId, guiGroup] of this._componentGroups.entries())
			{
				if (pauseType === PauseUtils.PARTIAL_PAUSE)
				{
					if (guiGroup._priority === this._highestPriority)
					{
						this._actorManager.updateSet(guiGroup._componentManagerIndexes, deltaTime);
					}
				}
				
				if (guiGroup.isAnyoneFadingOut())
				{
					guiGroup.startFadeOuts();
				}
			}
		}
		
		fadeOutAll()
		{
			for (const [groupId, guiGroup] of this._componentGroups.entries())
			{
				guiGroup.startFadeOuts();
			}
		}
		
		getInitParams(id)
		{
			return this._actorManager.getInitParams(id);
		}
		
		destroy()
		{
			CollectionUtils.nullDictionary(this._componentGroups, false);
			
			this._groupCount = 0;
		}
		
		onGroupDead(groupId)
		{
			if (this._componentGroups.has(groupId))
			{
				this._componentGroups.delete(groupId);
				
				this._groupCount--;
			}
			
			this._highestPriority = 0;
			
			for (const [groupId, guiGroup] of this._componentGroups.entries())
			{
				if (guiGroup._priority > this._highestPriority)
				{
					this._highestPriority = guiGroup._priority;
				}
			}
			
			if (this._groupCount === 0 && this._allGroupsDead)
			{
				this._allGroupsDead();
			}
		}
	}

	window.GuiActorManager = GuiActorManager;
}