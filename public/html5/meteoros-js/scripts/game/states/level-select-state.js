"use strict";

{
	const Event = GameEvent;
	
	const GRID_WIDTH = 4;
	const GRID_HEIGHT = 3;
	
	class LevelSelect extends GameSate
	{
		constructor(stage, owner)
		{
			super(stage, owner);
		
			this._initArgument = null;
			this._levelButtonActor = null;
			this._lastTextSize = null;
			this._details = null;
			this._scoreActor = null;
			this._backPressed = false;

			this._on_over_level_button = (data) => this.onOverLevelButton(data);
			this._on_gui_animation_complete = () => this.onGuiAnimationsComplete();
			this._on_back = (data) => this.onBack(data);
		}
		
		init(interStateConnection)
		{
			super.init(interStateConnection);
			
			this._lastTextSize = new Point();
			this._backPressed  = false;
			
			// Setting up Actors as a composition of four modules, Logic, Renderer, Input and Collider
			this._modulePackageGetter.registerPackage("LevelSelectTitle_Actor", 7, GuiTextFadeLogic, GuiTextRenderer, null, null);
			this._modulePackageGetter.registerPackage("LevelSelectDetials_Actor", 1, GuiTextFadeLogic, GuiExtendedTextRenderer, null, null);
			this._modulePackageGetter.registerPackage("BackButton_Actor", 1, GuiTextFadeLogic, GuiTextRenderer, GuiTextButtonInput, null);
			this._modulePackageGetter.registerPackage("LevelButton_Actor", this._levelManager.getLevelCount("SingleLevel"), GuiTextFadeLogic, GuiTextRenderer, GuiTextButtonInput, null);
			this._modulePackageGetter.registerPackage("LevelCompleteIcon_Actor", this._levelManager.getLevelCount("SingleLevel"), GuiAlphaFade, CrownIconRenderer, null, null);

			// Setting up Initialization Parameters for each actor.
			this._initParamsGetter.register("Title", "LevelSelectTitle_Actor", ["CHALLENGE SELECT", 0xffff0000], ["Absender", 50, true, false, 0, false, 0, true], null, null);
			
			this._initParamsGetter.register("LevelButton", "LevelButton_Actor",
				["", 0xff000000],
				["Absender", 24, true, true, 0xff777777, true, 0xffffffff, false],
				[0xffffffff, 0xff000000, null, true, null, this._on_over_level_button],
				null
			);

			this._initParamsGetter.register("StageDetailsTitle", "LevelSelectTitle_Actor", ["CHALLENGE DETAILS", 0xffff0000], ["Absender", 30, true, false, 0, false, 0, true], null, null);
			
			let guiExtendedTextRendererInitialization = new GuiExtendedTextRendererInitialization();
			guiExtendedTextRendererInitialization.setTextAlign("center");
			
			this._initParamsGetter.register("StageDetails", "LevelSelectDetials_Actor", [" ", 0xff777777], ["Absender", 30, true, false, 0, false, 0, false, true, guiExtendedTextRendererInitialization], null, null);
			this._initParamsGetter.register("CurrentLevelHiScore", "LevelSelectTitle_Actor", [this.getLevelHighScoreString(0), 0xff777777], ["Absender", 20, true, false, 0, false, 0, false], null, null);
			this._initParamsGetter.register("BackButton", "BackButton_Actor", ["< BACK >", 0xffff0000], ["Absender", 30, true, true, 0xff777777, true, 0xffffffff, false], [0xff00ff00, 0xffff0000, this._on_back, true], null);
			this._initParamsGetter.register("LevelCompleteIcon", "LevelCompleteIcon_Actor", null, [ 30, 20, 20, 2, 5, 0xffE8E523], null, null);
			
			// Initializing Actor manager.
			this._actorManager.init();
			
			this._guiActorManager.SetAllgroupsDeadCallback(this._on_gui_animation_complete);
			this._scoreActor = this._guiActorManager.add("Main", "CurrentLevelHiScore", this._stage.stageWidth / 2, 20);
			this._guiActorManager.add("Main", "Title", this._stage.stageWidth / 2, 80);
			
			// Stage Button Initialization.
			let levelCount = this._levelManager.getLevelCount("SingleLevel");
			let levelIndex = 0;
			
			for(let i = 0; i < GRID_HEIGHT; i++)
			{
				this._initArgument = this._initParamsGetter.getInitParams("LevelButton");
			
				for(let j = 0; j < GRID_WIDTH; j++)
				{
					let r;
					let d = "";

					const level = this._levelManager.getLevel("SingleLevel", levelIndex);
					
					if (level.Name !== this._levelManager.CLOSED_LEVEL_NAME)
					{
						for (const vr of level.VictoryRequirements)
						{
							d += vr.getDescription() + "\n\n";
						}
						
						for (const dr of level.DefeatRequirements)
						{
							d += dr.getDescription() + "\n\n";
						}
					}
					
					this._initArgument._logicInitParams[0] = level.Name;
					this._initArgument._inputInitParams[4] = { description: d, levelIndex: levelIndex };
					this._initArgument._inputInitParams[3] = level.Name !== this._levelManager.CLOSED_LEVEL_NAME ? true : false;
					
					this._levelButtonActor = this._guiActorManager.add("Main", "LevelButton", ((this._lastTextSize.x + 27) * (j)) + 175, ((this._lastTextSize.y + 24) * (i)) + 155);
					
					this._lastTextSize = this._levelButtonActor.Renderer.getTextDimentions();
					
					if (this._saveData.isSingleLevelComplete(levelIndex))
					{
						this._guiActorManager.add("Main", "LevelCompleteIcon", this._levelButtonActor.Logic._x + this._lastTextSize.x / 2, this._levelButtonActor.Logic._y + this._lastTextSize.y / 2);
					}
					
					levelIndex++;
				}
				
				this._lastTextSize.x = 0;
			}
			
			this._guiActorManager.add("Main", "StageDetailsTitle", this._stage.stageWidth / 2, 328);
			this._guiActorManager.add("Main", "BackButton"  , this._stage.stageWidth / 2, this._stage.stageHeight / 2 + 250);
			
			this._details = this._guiActorManager.add("Main", "StageDetails", this._stage.stageWidth / 2, 465);
		}
		
		run(deltaTime)
		{
			super.run(deltaTime);
			
			if (this._readyToExit)
			{
				if (this._backPressed)
				{
					this.dispatchEvent(new Event(Nukes.LEVEL_SELECT_SPLASH));
				}
				else
				{
					this.dispatchEvent(new Event(Nukes.LEVEL_SELECT_SINGLE_LEVEL_GAME));
				}
			}
		}
		
		completed(dispatchCompletedEvent = true)
		{
			super.completed(dispatchCompletedEvent);
			
			this._actorManager.release();
			this._guiActorManager.destroy();
			
			this._initArgument 	 	= null;
			this._levelButtonActor 	= null;
			this._lastTextSize 	 	= null;
			this._details 		 	= null;
			this._scoreActor 		= null;
		}
		
		onGuiAnimationsComplete()
		{
			this._readyToExit = true;
		}
		
		onOverLevelButton(data)
		{
			this._interStateConnection["NextLevelIndex"] = data["CallbackData"].levelIndex;
			this._details.Logic.ExternalParameters["Text"] = data["CallbackData"].description;
			
			const level = data["CallbackData"].levelIndex;
			
			this._scoreActor.Logic.ExternalParameters["Text"] = this.getLevelHighScoreString(level);
		}
		
		onBack(data)
		{
			this._backPressed = true;
		}

		getLevelHighScoreString(levelIndex)
		{
			const score = StringUtils.zeroPad(this._saveData.getSingleLevelHiScore(levelIndex), 8);
			const name = this._saveData.getSingleLevelHiScoreName(levelIndex);

			return `STAGE ${levelIndex + 1} HI-SCORE: ${score} - ${name}`;
		}
	}

	window.LevelSelect = LevelSelect;
}