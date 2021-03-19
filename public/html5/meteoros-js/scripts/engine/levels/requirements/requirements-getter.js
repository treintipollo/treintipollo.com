"use strict";

{
	class RequirementsGetter
	{
		constructor()
		{
			this._requirements = [];
			this._groups       = new Map();
			this._victory	   = [];
			this._failure	   = [];
			
			this._group = null;
			this._requirementsName = "";
			this._requirementsLevelIndex = 0;
		}
		
		get CurrentVictoryRequirements()
		{
			return this._victory;
		}
		
		get CurrentFailureRequirements()
		{
			return this._failure;
		}
		
		get CurrentRequirementsName()
		{
			return this._requirementsName;
		}
		
		get CurrentRequirementsLevelIndex()
		{
			return this._requirementsLevelIndex;
		}
		
		addRequirement(r)
		{
			return this._requirements.push(r) - 1;
		}
		
		setGroup(id, levelIndex, levelName, victoryIndexes, failureIndexes, victoryArguments, failureArguments)
		{
			if (!this._groups.has(id))
			{
				this._groups.set(id, []);
			}
			
			this._groups.get(id).push(new RequirementsGroup(levelIndex, levelName, victoryIndexes, failureIndexes, victoryArguments, failureArguments));
		}
		
		initCurrentGroup(id, index)
		{
			this.release();
			
			this._group = this._groups.get(id)[index];

			if (this._group._victroyIndexes)
			{
				for (let i = 0; i < this._group._victroyIndexes.length; i++)
				{
					this._victory.push(this._requirements[this._group._victroyIndexes[i]]);
					this._victory[this._victory.length - 1].setInitArguments(this._group._victroyArguments[i]);
				}
			}
			
			if (this._group._failureIndexes)
			{
				for (let i = 0; i < this._group._failureIndexes.length; i++)
				{
					this._failure.push(this._requirements[this._group._failureIndexes[i]]);
					this._failure[this._failure.length - 1].setInitArguments(this._group._failureArguments[i]);
				}
			}
		
			this._requirementsName = this._group._levelName;
			this._requirementsLevelIndex = this._group._levelIndex;
			
			this._group = null;
		}
		
		getGroupCount(id)
		{
			return this._groups.get(id).length;
		}
		
		release()
		{
			CollectionUtils.nullVector(this._victory, false, true);
			CollectionUtils.nullVector(this._failure, false, true);
		}
	}

	window.RequirementsGetter = RequirementsGetter;
}