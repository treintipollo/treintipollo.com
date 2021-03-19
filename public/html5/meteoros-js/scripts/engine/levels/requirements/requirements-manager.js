"use strict";

{
	class RequirementsManager
	{
		constructor()
		{
			this._collections = [];
		}
		
		add(requirements, onRequirementsFullfilled)
		{
			this._collections.push(new RequirementCollection(requirements, onRequirementsFullfilled));
		}
		
		setupVisuals(modulePackageGetter, initParamsGetter)
		{
			for (let i = 0; i < this._collections.length; i++)
			{
				this._collections[i].setupVisuals(modulePackageGetter, initParamsGetter);
			}
		}
		
		addVisuals(actorManager)
		{
			for (let i = 0; i < this._collections.length; i++)
			{
				this._collections[i].addVisuals(actorManager);
			}
		}
		
		destroy()
		{
			for (let i = 0; i < this._collections.length; i++)
			{
				this._collections[i].destroy();
				this._collections[i] = null;
			}
			
			this._collections.length = 0;
		}
	}

	window.RequirementsManager = RequirementsManager;
}