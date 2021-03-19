"use strict";

{
	class NukesSaveData
	{
		constructor(levelManager)
		{
			this._levelManager = levelManager;

			const savedData = localStorage.getItem("nukes-save-data");

			if (savedData)
			{
				this._sharedObject = JSON.parse(savedData);
			}
			else
			{
				this.init(levelManager);
			}
		}

		set EnduranceHiScore(value)
		{
			if (value > this._sharedObject.data.enduranceHiScore)
			{
				this._sharedObject.data.enduranceHiScore = value;
				
				localStorage.setItem("nukes-save-data", JSON.stringify(this._sharedObject));
			}
		}
		
		get EnduranceHiScore()
		{
			return this._sharedObject.data.enduranceHiScore;
		}

		set EnduranceHiScoreName(value)
		{
			this._sharedObject.data.enduranceHiScoreName = value;

			localStorage.setItem("nukes-save-data", JSON.stringify(this._sharedObject));
		}

		get EnduranceHiScoreName()
		{
			return this._sharedObject.data.enduranceHiScoreName;
		}
		
		set EnduranceModeComplete(value)
		{
			this._sharedObject.data.enduranceModeComplete = value;

			localStorage.setItem("nukes-save-data", JSON.stringify(this._sharedObject));
		}
		
		get EnduranceModeComplete()
		{
			return this._sharedObject.data.enduranceModeComplete;
		}
		
		isEnduranceHighScore(value)
		{
			return value > this._sharedObject.data.enduranceHiScore;
		}

		isSingleLevelHiScore(levelIndex, value)
		{
			return value > this._sharedObject.data.singleLevelHighScores[levelIndex.toString()];
		}

		setSingleLevelHiScore(levelIndex, value)
		{
			if (value > this._sharedObject.data.singleLevelHighScores[levelIndex.toString()])
			{
				this._sharedObject.data.singleLevelHighScores[levelIndex.toString()] = value;
				
				localStorage.setItem("nukes-save-data", JSON.stringify(this._sharedObject));
			}
		}
		
		getSingleLevelHiScore(levelIndex)
		{
			return this._sharedObject.data.singleLevelHighScores[levelIndex.toString()];
		}
		
		setSingleLevelComplete(levelIndex, value)
		{
			this._sharedObject.data.singleLevelComplete[levelIndex.toString()] = value;
			
			localStorage.setItem("nukes-save-data", JSON.stringify(this._sharedObject));
		}
		
		getSingleLevelHiScoreName(levelIndex)
		{
			return this._sharedObject.data.singleLevelHighScoreNames[levelIndex.toString()];
		}

		setSingleLevelHiScoreName(levelIndex, value)
		{
			this._sharedObject.data.singleLevelHighScoreNames[levelIndex.toString()] = value;

			localStorage.setItem("nukes-save-data", JSON.stringify(this._sharedObject));
		}
		
		isSingleLevelComplete(levelIndex)
		{
			return this._sharedObject.data.singleLevelComplete[levelIndex.toString()];
		}
		
		clearAll()
		{
			this.init();
		}
		
		init()
		{
			const singleLevelHighScores = {};
			const singleLevelComplete = {};
			const singleLevelHighScoreNames = {};

			if (this._levelManager)
			{
				for (let i = 0; i < this._levelManager.getLevelCount("SingleLevel"); i++)
					singleLevelHighScores[i] = i;
				
				for (let j = 0; j < this._levelManager.getLevelCount("SingleLevel"); j++)
					singleLevelComplete[j] = false;

				for (let j = 0; j < this._levelManager.getLevelCount("SingleLevel"); j++)
					singleLevelHighScoreNames[j] = "---";
			}

			this._sharedObject = {
				data: {
					singleLevelHighScores: singleLevelHighScores,
					singleLevelComplete: singleLevelComplete,
					singleLevelHighScoreNames: singleLevelHighScoreNames,
					enduranceHiScore: 0,
					enduranceModeComplete: false,
					enduranceHiScoreName: "---"
				}
			};

			localStorage.setItem("nukes-save-data", JSON.stringify(this._sharedObject));
		}
	}

	window.NukesSaveData = NukesSaveData;
}