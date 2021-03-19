"use strict";

{
	const Event = GameEvent;
	
	class GameOver extends GameSate
	{
		
		constructor(stage, owner)
		{
			super(stage, owner);
			
			this._retry = false;
			this._titleScreen = false;
			this._highScoreSet = false;

			this._firstLetter = { val: "A" };
			this._secondLetter = { val: "A" };
			this._thirdLetter = { val: "A" };

			this._endurance = false;
			this._levelIndex = NaN;

			this._on_gui_animations_complete = () => this.onGuiAnimationsComplete();
			this._on_retry_click = (data) => this.onRetryClick(data);
			this._on_title_screen_click = (data) => this.onTitleScreenClick(data);
		}
		
		init(interStateConnection)
		{
			super.init(interStateConnection);
			
			this._retry 	  = false;
			this._titleScreen = false;
			this._highScoreSet = false;
			
			this._interStateConnection["NextLevelIndex"] = interStateConnection["LevelIndex"];
			
			// Setting up Actors as a composition of four modules, Logic, Renderer, Input and Collider
			this._modulePackageGetter.registerPackage("SplashText_Actor", 3, GuiTextScaleLogic, GuiTextRenderer, null, null);
			this._modulePackageGetter.registerPackage("ContinueButton_Actor", 2, GuiTextScaleLogic, GuiTextRenderer, GuiTextButtonInput, null);
			
			// Highscore actors
			this._modulePackageGetter.registerPackage("NameEntryLetter_Actor", 3, GuiTextScaleLogic, GuiTextRenderer, null, null);
			this._modulePackageGetter.registerPackage("NameEntryButton_Actor", 6, GuiTextScaleLogic, GuiTextRenderer, GuiTextButtonInput, null);
			this._initParamsGetter.register("Letter", "NameEntryLetter_Actor", ["A", 0xffff0000], ["Absender", 50, true, true, 0xff777777, true, 0xffffffff, false], null, null);
			this._initParamsGetter.register("LetterPrev", "NameEntryButton_Actor", ["<", 0xff777777], ["Absender", 20, true, false, 0, false, 0, false], [0xffffffff, 0xff777777, null, false, null, null], null);
			this._initParamsGetter.register("LetterNext", "NameEntryButton_Actor", [">", 0xff777777], ["Absender", 20, true, false, 0, false, 0, false], [0xffffffff, 0xff777777, null, false, null, null], null);

			// Setting up Initialization Parameters for each actor.
			this._initParamsGetter.register("GameOver", "SplashText_Actor", ["GAME OVER", 0xffff0000], ["Absender", 80, true, false, 0, false, 0, true], null, null);
			this._initParamsGetter.register("Caption", "SplashText_Actor", ["( " + this._messageGetter.getGroup(MessageGetter.GAMEOVER) + " )", 0xffff0000], ["Absender", 30, true, false, 0, false, 0, false], null, null);
			
			this._initParamsGetter.register("Score", "SplashText_Actor", ["SCORE:" + StringUtils.zeroPad(Math.floor(interStateConnection["LevelScore"]), 8), 0xff777777], ["Absender", 20, true, false, 0, false, 0, false], null, null);
			this._initParamsGetter.register("Retry", "ContinueButton_Actor", ["RETRY?", 0xff777777], ["Absender", 20, true, false, 0, false, 0, false], [0xffffffff, 0xff777777, this._on_retry_click, false], null);
			this._initParamsGetter.register("TitleScreen", "ContinueButton_Actor", ["CLICK HERE TO CONTINUE", 0xff777777], ["Absender", 20, true, false, 0, false, 0, false], [0xffffffff, 0xff777777, this._on_title_screen_click, false], null);
			
			// Initializing Actor manager.
			this._actorManager.init();
			
			// Setting up initial actors for this state
			
			// Adding GUI Actors to the GUIActorManager.
			this._guiActorManager.SetAllgroupsDeadCallback(this._on_gui_animations_complete);
			this._guiActorManager.add("Main", "GameOver", this._stage.stageWidth / 2, this._stage.stageHeight / 2 - 175);
			this._guiActorManager.add("Main", "Caption", this._stage.stageWidth / 2, this._stage.stageHeight / 2 - 75);
			
			this._guiActorManager.add("Main", "Score", this._stage.stageWidth / 2, this._stage.stageHeight / 2 + 100 + 60);
			
			this._endurance = interStateConnection["Endurance"];
			this._levelIndex = interStateConnection["LevelIndex"];

			if (interStateConnection["Endurance"])
			{
				if (this._saveData.isEnduranceHighScore(interStateConnection["LevelScore"]))
					this._highScoreSet = true;

				this._guiActorManager.add("Main", "TitleScreen", this._stage.stageWidth / 2, this._stage.stageHeight / 2 + 150 + 60);
				this._saveData.EnduranceHiScore = interStateConnection["LevelScore"];
			}
			else
			{
				if (this._saveData.isSingleLevelHiScore(interStateConnection["LevelIndex"], interStateConnection["LevelScore"]))
					this._highScoreSet = true;

				this._guiActorManager.add("Main", "Retry", this._stage.stageWidth / 2, this._stage.stageHeight / 2 + 150 + 60);
				this._guiActorManager.add("Main", "TitleScreen", this._stage.stageWidth / 2, this._stage.stageHeight / 2 + 200 + 60);
				
				this._saveData.setSingleLevelHiScore(interStateConnection["LevelIndex"], interStateConnection["LevelScore"]);
			}

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
				if (this._titleScreen)
				{
					this._dispatchEvent(new Event(Nukes.GAME_OVER_SPLASH));
				}

				if (this._retry)
				{
					this._dispatchEvent(new Event(Nukes.GAME_OVER_RETRY));
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
		}
		
		onGuiAnimationsComplete()
		{
			this._readyToExit = true;
		}
		
		onRetryClick(data)
		{
			this._guiActorManager.fadeOutAll();
			this._retry = true;
		}

		onTitleScreenClick(data)
		{
			this._guiActorManager.fadeOutAll();
			this._titleScreen = true;
		}
	}

	window.GameOver = GameOver;
}