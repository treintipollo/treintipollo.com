"use strict";

{
	class RequirementsGroup
	{
		constructor(levelIndex, levelName, victoryIndexes = null, failureIndexes = null, victoryArguemtns = null, failureArguments = null)
		{
			this._levelIndex 	   = levelIndex;
			this._levelName		   = levelName;
			this._victroyIndexes   = victoryIndexes;
			this._failureIndexes   = failureIndexes;
			this._victroyArguments = victoryArguemtns;
			this._failureArguments = failureArguments;
		}
		
		isDestroyable()
		{
			return true;
		}
		
		destroy()
		{
			this._victroyIndexes = null;
			this._failureIndexes = null;
			
			CollectionUtils.nullVector(this._victroyArguments);
			this._victroyArguments = null;

			CollectionUtils.nullVector(this._failureArguments);
			this._failureArguments = null;
		}
	}

	window.RequirementsGroup = RequirementsGroup;
}