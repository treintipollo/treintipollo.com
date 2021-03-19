"use strict";

{
	const Event = GameEvent;

	class VictoryScreen extends GameSate
	{
		constructor(stage, owner)
		{
			super(stage, owner);
			
			this._statsPopupInitParams = null;
			this._scorePopupInitParams = null;
			
			this._statsActor = null;
			this._scoreActor = null;
			
			this._baseScore = 0;
			this._hitScore = 0;
			
			this._populationScore = 0;
			this._maleBonus = 0;
			this._femaleBonus = 0;
			this._mutantBonus = 0;
			this._totalScore = 0;
			this._endurance = false;
			this._levelIndex = NaN;
			this._highScoreSet = false;
			
			this._firstLetter = { val: "A" };
			this._secondLetter = { val: "A" };
			this._thirdLetter = { val: "A" };

			this._interStateConnection = {};

			this._on_instructions_click = (data) => this.onInstructionsClick(data);
			this._on_stats_click = (data) => this.onStatsClick(data);
			this._on_score_click = (data) => this.onScoreClick(data);
			this._on_gui_animations_complete = (data) => this.onGuiAnimationsComplete(data);
			this._on_popup_closed = (data) => this.onPopupClosed(data);
		}
		
		init(interStateConnection)
		{
			super.init(interStateConnection);
			
			// Setting up Actors as a composition of four modules, Logic, Renderer, Input and Collider
			this._modulePackageGetter.registerPackage("SplashText_Actor", 3, GuiTextScaleLogic, GuiTextRenderer, null, null);
			this._modulePackageGetter.registerPackage("ContinueButton_Actor", 3, GuiTextScaleLogic, GuiTextRenderer, GuiTextButtonInput, null);
			
			// Setting up Initialization Parameters for each actor.
			this._initParamsGetter.register("Awesome", "SplashText_Actor", ["YOU ARE AWESOME!", 0xffff0000], ["Absender", 50, true, false, 0, false, 0, false], null, null);
			this._initParamsGetter.register("Cool", "SplashText_Actor", [this._messageGetter.getGroup(MessageGetter.VICTORY), 0xffff0000], ["Absender", 50, true, false, 0, false, 0, false], null, null);
			this._initParamsGetter.register("Great", "SplashText_Actor", ["AND THE GREATEST!", 0xffff0000], ["Absender", 50, true, false, 0, false, 0, false], null, null);
			this._initParamsGetter.register("Instructions", "ContinueButton_Actor", ["CLICK HERE TO CONTINUE", 0xff777777], ["Absender", 20, true, false, 0, false, 0, false], [0xffffffff, 0xff777777, this._on_instructions_click], null);
			this._initParamsGetter.register("Stats", "ContinueButton_Actor", ["CLICK HERE FOR STATS", 0xff777777], ["Absender", 20, true, false, 0, false, 0, false], [0xffffffff, 0xff777777, this._on_stats_click, false], null);

			// Highscore actors
			this._modulePackageGetter.registerPackage("NameEntryLetter_Actor", 3, GuiTextScaleLogic, GuiTextRenderer, null, null);
			this._modulePackageGetter.registerPackage("NameEntryButton_Actor", 6, GuiTextScaleLogic, GuiTextRenderer, GuiTextButtonInput, null);
			this._initParamsGetter.register("Letter", "NameEntryLetter_Actor", ["A", 0xffff0000], ["Absender", 50, true, true, 0xff777777, true, 0xffffffff, false], null, null);
			this._initParamsGetter.register("LetterPrev", "NameEntryButton_Actor", ["<", 0xff777777], ["Absender", 20, true, false, 0, false, 0, false], [0xffffffff, 0xff777777, null, false, null, null], null);
			this._initParamsGetter.register("LetterNext", "NameEntryButton_Actor", [">", 0xff777777], ["Absender", 20, true, false, 0, false, 0, false], [0xffffffff, 0xff777777, null, false, null, null], null);

			// Creating the object that defines what the statistics popup will be showing.
			this._statsPopupInitParams = new ListPopupInitialization("StatistisPopup", "TOTALLY USEFUL STATISTICS", ".", 0);
			this._scorePopupInitParams = new ListPopupInitialization("ScorePopup", "SCORE DETAILS");
			
			this._statsPopupInitParams.add("MISSILES LAUNCHED", interStateConnection["MissilesLaunched"]);
			this._statsPopupInitParams.add("MISSILE HIT COUNT", interStateConnection["MissileHits"]);
			this._statsPopupInitParams.add("MISSILE HIT %", Math.floor((interStateConnection["MissileHits"] * 100) / interStateConnection["MissilesLaunched"]), "%");
			this._statsPopupInitParams.add("LONGEST COMBO", interStateConnection["LongestCombo"]);
			
			// Calculate population percentages.
			let totalPopulationPercentage  		 = 0;
			let malePopulationPercentage   		 = 0;
			let femalePopulationPercentage 		 = 0;
			let mutantPopulationPercentage 		 = 0;
			let maleMutantPopulationPercentage   = 0;
			let femaleMutantPopulationPercentage = 0;
			
			const popSaved = interStateConnection["TotalPopulationSaved"];

			for (let i = 0; i < popSaved.length; i++)
			{
				if (popSaved[i] !== CityPopulationLogic.NONE)
				{
					totalPopulationPercentage++;
					
					if (popSaved[i] === CityPopulationLogic.MALE)
					{
						malePopulationPercentage++;
					}
					else if (popSaved[i] === CityPopulationLogic.FEMALE)
					{
						femalePopulationPercentage++;
					}
					else if (popSaved[i] === CityPopulationLogic.MALE_MUTANT)
					{
						maleMutantPopulationPercentage++;
						mutantPopulationPercentage++;
					}
					else if (popSaved[i] === CityPopulationLogic.FEMALE_MUTANT)
					{
						femaleMutantPopulationPercentage++;
						mutantPopulationPercentage++;
					}
				}
			}

			this._statsPopupInitParams.add("TOTAL SURVIVORS" , ((totalPopulationPercentage * 100) / interStateConnection["TotalPopulationSaved"].length).toFixed(2) , "%");
			this._statsPopupInitParams.add("MALE SURVIVORS"  , ((malePopulationPercentage * 100) / totalPopulationPercentage).toFixed(2)  , "%");
			this._statsPopupInitParams.add("FEMALE SURVIVORS", ((femalePopulationPercentage * 100) / totalPopulationPercentage).toFixed(2), "%");
			this._statsPopupInitParams.add("MUTANT SURVIVORS", ((mutantPopulationPercentage * 100) / totalPopulationPercentage).toFixed(2), "%");
			
			this._baseScore 	= Math.floor(interStateConnection["LevelScore"]);
			this._hitScore 		= Math.floor(this._baseScore * (interStateConnection["MissileHits"] / interStateConnection["MissilesLaunched"]));
			this._maleBonus		= Math.floor(this._baseScore * (malePopulationPercentage / interStateConnection["TotalPopulationSaved"].length));
			this._femaleBonus 	= Math.floor(this._baseScore * (femalePopulationPercentage / interStateConnection["TotalPopulationSaved"].length));
			this._mutantBonus 	= Math.floor(this._baseScore * (mutantPopulationPercentage / interStateConnection["TotalPopulationSaved"].length));
			
			this._populationScore 	= this._femaleBonus + this._maleBonus;
			this._totalScore		= this._baseScore + this._hitScore + this._populationScore + this._mutantBonus;
			
			this._initParamsGetter.register("Score", "ContinueButton_Actor", ["SCORE:" + StringUtils.zeroPad(this._totalScore, 8), 0xff777777], ["Absender", 20, true, false, 0, false, 0, false], [0xffffffff, 0xff777777, this._on_score_click, false], null);

			this._scorePopupInitParams.add("BASE", this._baseScore);
			this._scorePopupInitParams.add("HIT % BONUS", this._hitScore);
			this._scorePopupInitParams.add("POPULATION BONUS", this._populationScore);
			this._scorePopupInitParams.add("MUTANT BONUS", this._mutantBonus);
			this._scorePopupInitParams.add("TOTAL SCORE", this._totalScore);
		
			this._scorePopupInitParams.init(this._guiActorManager, this._modulePackageGetter, this._initParamsGetter);
			this._statsPopupInitParams.init(this._guiActorManager, this._modulePackageGetter, this._initParamsGetter);
			
			this._endurance = interStateConnection["Endurance"];
			this._levelIndex = interStateConnection["LevelIndex"];
			
			this._highScoreSet = false;

			if (this._endurance)
			{
				if (this._saveData.isEnduranceHighScore(this._totalScore))
					this._highScoreSet = true;

				this._saveData.EnduranceHiScore = this._totalScore;
				this._saveData.EnduranceModeComplete = true;
			}
			else
			{
				if (this._saveData.isSingleLevelHiScore(interStateConnection["LevelIndex"], this._totalScore))
					this._highScoreSet = true;

				this._saveData.setSingleLevelHiScore(interStateConnection["LevelIndex"], this._totalScore);
				this._saveData.setSingleLevelComplete(interStateConnection["LevelIndex"], true);
			}
			
			// Initializing Actor manager.
			this._actorManager.init();

			// Setting up initial actors for this state
			// Adding GUI Actors to the GUIActorManager.
			this._guiActorManager.SetAllgroupsDeadCallback(this._on_gui_animations_complete);
			
			this._guiActorManager.add("Main", "Awesome"	  	 , this._stage.stageWidth / 2, this._stage.stageHeight / 2  - 180);
			this._guiActorManager.add("Main", "Cool"		 , this._stage.stageWidth / 2, this._stage.stageHeight / 2  - 100);
			this._guiActorManager.add("Main", "Great"		 , this._stage.stageWidth / 2, this._stage.stageHeight / 2  -  20);
			
			this._guiActorManager.add("Main", "Score"		 , this._stage.stageWidth / 2, this._stage.stageHeight / 2  + 100 + 60);
			this._guiActorManager.add("Main", "Stats"		 , this._stage.stageWidth / 2, this._stage.stageHeight / 2  + 150 + 60);
			this._guiActorManager.add("Main", "Instructions" , this._stage.stageWidth / 2, this._stage.stageHeight / 2  + 200 + 60);

			const populationSaved = interStateConnection["TotalPopulationSaved"].length;
			
			const totalPopLost  = (100 - (totalPopulationPercentage * 100) / populationSaved).toFixed(2).padStart(5, "0");
			const totalPop 	    = ((totalPopulationPercentage * 100) / populationSaved).toFixed(2).padStart(5, "0");
			const maleSurv      = ((malePopulationPercentage * 100) / totalPopulationPercentage).toFixed(2).padStart(5, "0");
			const femaleSurv    = ((femalePopulationPercentage * 100) / totalPopulationPercentage).toFixed(2).padStart(5, "0");
			const mutSurv       = ((mutantPopulationPercentage * 100) / totalPopulationPercentage).toFixed(2).padStart(5, "0");
			const maleMutSurv   = ((maleMutantPopulationPercentage * 100) / totalPopulationPercentage).toFixed(2).padStart(5, "0");
			const femaleMutSurv = ((femaleMutantPopulationPercentage * 100) / totalPopulationPercentage).toFixed(2).padStart(5, "0");

			this._interStateConnection["TotalPopulationLost"]   = totalPopLost;
			this._interStateConnection["TotalPopulation"] 	    = totalPop;
			this._interStateConnection["MaleSurvivors"]         = maleSurv;
			this._interStateConnection["FemaleSurvivors"]       = femaleSurv;
			this._interStateConnection["MutantSurvivors"]       = mutSurv;
			this._interStateConnection["MaleMutantSurvivors"]   = maleMutSurv;
			this._interStateConnection["FemaleMutantSurvivors"] = femaleMutSurv;

			if (this._highScoreSet)
			{
				let index1 = { val: 0 };
				let index2 = { val: 0 };
				let index3 = { val: 0 };

				// First letter
				const firstLetter = this._guiActorManager.add("Main", "Letter", this._stage.stageWidth / 2 - 130, this._stage.stageHeight / 2 + 80);

				this._setPrevLetterCallback("LetterPrev", firstLetter, index1, this._firstLetter);
				this._setNextLetterCallback("LetterNext", firstLetter, index1, this._firstLetter);

				this._guiActorManager.add("Main", "LetterPrev", this._stage.stageWidth / 2 - 130 - 37, this._stage.stageHeight / 2 + 80);
				this._guiActorManager.add("Main", "LetterNext", this._stage.stageWidth / 2 - 130 + 40, this._stage.stageHeight / 2 + 80);

				// Second letter
				const secondLetter = this._guiActorManager.add("Main", "Letter", this._stage.stageWidth / 2 -   0, this._stage.stageHeight / 2 + 80);
				
				this._setPrevLetterCallback("LetterPrev", secondLetter, index2, this._secondLetter);
				this._setNextLetterCallback("LetterNext", secondLetter, index2, this._secondLetter);

				this._guiActorManager.add("Main", "LetterPrev", this._stage.stageWidth / 2 - 0 - 37, this._stage.stageHeight / 2 + 80);
				this._guiActorManager.add("Main", "LetterNext", this._stage.stageWidth / 2 - 0 + 40, this._stage.stageHeight / 2 + 80);

				// Third letter
				const thirdLetter = this._guiActorManager.add("Main", "Letter", this._stage.stageWidth / 2 + 130, this._stage.stageHeight / 2 + 80);
				
				this._setPrevLetterCallback("LetterPrev", thirdLetter, index3, this._thirdLetter);
				this._setNextLetterCallback("LetterNext", thirdLetter, index3, this._thirdLetter);

				this._guiActorManager.add("Main", "LetterPrev", this._stage.stageWidth / 2 + 130 - 37, this._stage.stageHeight / 2 + 80);
				this._guiActorManager.add("Main", "LetterNext", this._stage.stageWidth / 2 + 130 + 40, this._stage.stageHeight / 2 + 80);
			}
		}

		_setPrevLetterCallback(initParams, letterActor, indexObj, letterObj)
		{
			const CHARS = `ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789!%*()-=+:;<>,./?_`;

			const hitFeedbackArguments = Nukes.actorManager.getInitParams(initParams);
			
			hitFeedbackArguments._inputInitParams[2] = () =>
			{
				indexObj.val--;

				if (indexObj.val < 0)
					indexObj.val = CHARS.length - 1;

				letterActor._logic.ExternalParameters["Text"] = CHARS[indexObj.val];
				letterObj.val = CHARS[indexObj.val];
			};
		}

		_setNextLetterCallback(initParams, letterActor, indexObj, letterObj)
		{
			const CHARS = `ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789!%*()-=+:;<>,./?_`;

			const hitFeedbackArguments = Nukes.actorManager.getInitParams(initParams);

			hitFeedbackArguments._inputInitParams[2] = () =>
			{
				indexObj.val++;

				if (indexObj.val >= CHARS.length)
					indexObj.val = 0;

				letterActor._logic.ExternalParameters["Text"] = CHARS[indexObj.val];
				letterObj.val = CHARS[indexObj.val];
			};
		}
		
		run(deltaTime)
		{
			super.run(deltaTime);
			
			if (this._readyToExit)
			{
				if (this._endurance)
				{
					this.dispatchEvent(new Event(Nukes.VICTORY_EPILOGUE));
				}
				else
				{
					this.dispatchEvent(new Event(Nukes.VICTORY_SPLASH));
				}
			}
		}
		
		completed(dispatchCompletedEvent = true)
		{
			super.completed(dispatchCompletedEvent);
			
			if (this._highScoreSet)
			{
				if (this._endurance)
				{
					const f = this._firstLetter.val;
					const s = this._secondLetter.val;
					const t = this._thirdLetter.val;

					// Save endurance highscore name
					this._saveData.EnduranceHiScoreName = `${f}${s}${t}`;
				}
				else
				{
					const f = this._firstLetter.val;
					const s = this._secondLetter.val;
					const t = this._thirdLetter.val;

					// Save single level highscore
					this._saveData.setSingleLevelHiScoreName(this._levelIndex, `${f}${s}${t}`);
				}
			}

			this._actorManager.release();
			this._guiActorManager.destroy();
			
			this._scorePopupInitParams.destroy();
			this._statsPopupInitParams.destroy();
			
			this._scorePopupInitParams = null;
			this._statsPopupInitParams = null;
			this._statsActor		   = null;
			this._scoreActor		   = null;

		}
		
		onGuiAnimationsComplete()
		{
			this._readyToExit = true;
		}
		
		onInstructionsClick(data)
		{
			this._guiActorManager.fadeOutAll();
		}
		
		onStatsClick(data)
		{
			this._pauseHandler.pause();

			this._statsActor = this._guiActorManager.add(this._statsPopupInitParams.POPUP_GROUP_ID, this._statsPopupInitParams.POPUP_ACTOR_ID, this._stage.stageWidth / 2, this._stage.stageHeight / 2, 0, 1, this._on_popup_closed, true);

			this._statsActor.Logic._x -= this._statsActor.Renderer.Width / 2;
			this._statsActor.Logic._y -= this._statsActor.Renderer.Height / 2;
		}
		
		onScoreClick(data)
		{
			this._pauseHandler.pause();

			this._scoreActor = this._guiActorManager.add(this._scorePopupInitParams.POPUP_GROUP_ID, this._scorePopupInitParams.POPUP_ACTOR_ID, this._stage.stageWidth / 2, this._stage.stageHeight / 2, 0, 1, this._on_popup_closed, true);
			
			this._scoreActor.Logic._x -= this._scoreActor.Renderer.Width / 2;
			this._scoreActor.Logic._y -= this._scoreActor.Renderer.Height / 2;
		}
		
		onPopupClosed()
		{
			this._pauseHandler.resume();
		}
	}

	window.VictoryScreen = VictoryScreen;
}