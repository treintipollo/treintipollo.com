"use strict";

{
	const CLOSED_LEVEL_NAME = "< ???? >";
	
	class LevelManager
	{
		constructor()
		{
			this._levels       		  = [];
			this._requirementsGetter  = new RequirementsGetter();
			this._fakeLevel			  = new Level();
			this._currentLevelIndex   = 0;
		}

		get CLOSED_LEVEL_NAME()
		{
			return CLOSED_LEVEL_NAME;
		}
		
		addLevel(level)
		{
			return this._levels.push(level) - 1;
		}
		
		addRequirement(requirement)
		{
			return this._requirementsGetter.addRequirement(requirement);
		}
		
		addRequirementGroup(id, levelIndex, levelName, victoryIndexes = null, failureIndexes = null, victoryArguments = null, failureArguments = null)
		{
			this._requirementsGetter.setGroup(id, levelIndex, levelName, victoryIndexes, failureIndexes, victoryArguments, failureArguments);
		}
		
		getLevelCount(id)
		{
			return this._requirementsGetter.getGroupCount(id);
		}
		
		getLevel(groupId, index)
		{
			this._requirementsGetter.initCurrentGroup(groupId, index);
		
			index = this._requirementsGetter.CurrentRequirementsLevelIndex;
			
			this._currentLevelIndex = index;
			
			if (index < this._levels.length)
			{
				this._levels[index].VictoryRequirements = this._requirementsGetter.CurrentVictoryRequirements;
				this._levels[index].DefeatRequirements  = this._requirementsGetter.CurrentFailureRequirements;
				this._levels[index].Name				= this._requirementsGetter.CurrentRequirementsName;
				
				return this._levels[index];
			}
			else
			{
				this._fakeLevel.Name = this._requirementsGetter.CurrentRequirementsName;
				
				return this._fakeLevel;
			}
			
			return null;
		}
		
		releaseSingleLevel()
		{
			this._requirementsGetter.release();
			this._levels[this._currentLevelIndex].release();
			
			return this._levels[this._currentLevelIndex].LevelResult;
		}
		
		releaseEndurance()
		{
			this._requirementsGetter.release();
			
			for(var i = 0; i < this._levels.length; i++)
			{
				this._levels[i].release();
			}
		
			return this._levels[0].LevelResult;
		}
		
		destroy()
		{
			for(var i = 0; i < this._levels.length; i++)
			{
				this._levels[i].destroy();
				this._levels[i] = null;
			}
			
			this._levels = null;
		}
	}

	window.LevelManager = LevelManager;
}