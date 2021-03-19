"use strict";

{
	class RequirementCollection
	{
		constructor(req, onAllFullfilled)
		{
			this._requirements = req;
			this._onAllRequirementsFullfilled = onAllFullfilled;
			
			for (let i = 0; i < this._requirements.length; i++)
			{
				this._requirements[i].FullFilledCallback = () => this.onSingleRequirementComplete();
			}
			
			this._fullfilledRequirements = 0;
		}
		
		onSingleRequirementComplete()
		{
			if (this._fullfilledRequirements < this._requirements.length)
			{
				this._fullfilledRequirements++;
				
				if (this._fullfilledRequirements === this._requirements.length)
				{
					this._onAllRequirementsFullfilled();
				}
			}
		}
		
		setupVisuals(modulePackageGetter, initParamsGetter)
		{
			for (let i = 0; i < this._requirements.length; i++)
			{
				this._requirements[i].setUpVisual(modulePackageGetter, initParamsGetter);
			}
		}
		
		addVisuals(actorManager)
		{
			for (let i = 0; i < this._requirements.length; i++)
			{
				this._requirements[i].addVisual(actorManager);
			}
		}
		
		destroy()
		{
			for (let i = 0; i < this._requirements.length; i++)
			{
				this._requirements[i].release();
				this._requirements[i] = null;
			}

			this._requirements = null;
			this._onAllRequirementsFullfilled = null;
		}
	}

	window.RequirementCollection = RequirementCollection;
}