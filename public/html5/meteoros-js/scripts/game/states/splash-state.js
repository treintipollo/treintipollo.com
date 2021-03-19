"use strict";

{
	const Event = GameEvent;

	class Splash extends GameSate
	{
		constructor(stage, owner)
		{
			super(stage, owner);
			
			this._challengeMode = false;
			this._enduranceMode = false;
			this._options = false;
			this._enduranceButtonActor = null;
			this._enduranceButtonDim = null;
			this._message = "";

			this._on_challenge = (data) => this.onChallenge(data);
			this._on_endurance = (data) => this.onEndurance(data);
			this._on_options = (data) => this.onOptions(data);
		}
		
		init(interStateConnection)
		{
			super.init(interStateConnection);
			
			this._challengeMode = false;
			this._enduranceMode = false;
			this._options	   = false;
			
			this._message = this._messageGetter.getGroup(MessageGetter.SPLASH);

			// Setting up Actors as a composition of four modules, Logic, Renderer, Input and Collider
			this._modulePackageGetter.registerPackage("SplashText_Actor", 4, GuiTextScaleLogic, GuiTextRenderer, null, null);
			this._modulePackageGetter.registerPackage("SplashTextButton_Actor", 3, GuiTextScaleLogic, GuiTextRenderer, GuiTextButtonInput, null);
			this._modulePackageGetter.registerPackage("EnduranceCompleteIcon_Actor", 1, GuiScaleFade, CrownIconRenderer, null, null);
			
			// Setting up Initialization Parameters for each actor.
			this._initParamsGetter.register("Score", "SplashText_Actor", [this.getEnduranceHighScoreString(), 0xff777777], ["Absender", 20, true, false, 0, false, 0, false], null, null);
			this._initParamsGetter.register("Title", "SplashText_Actor", ["METEOROS", 0xffff0000], ["Absender", 80, true, false, 0, false, 0, true], null, null);
			
			this._initParamsGetter.register("Mission_1", "SplashText_Actor", [this._message.split(";")[0], 0xffff0000], ["Absender", 30, true, false, 0, false, 0, false], null, null);
			this._initParamsGetter.register("Mission_2", "SplashText_Actor", [this._message.split(";")[1], 0xffff0000], ["Absender", 30, true, false, 0, false, 0, false], null, null);

			this._initParamsGetter.register("LevelSelectButton", "SplashTextButton_Actor", ["< CHALLENGE >", 0xffff0000], ["Absender", 30, true, true, 0xff777777, true, 0xffffffff, false], [0xff00ff00, 0xffff0000, this._on_challenge, false], null);
			this._initParamsGetter.register("EnduranceButton"  , "SplashTextButton_Actor", ["< ENDURANCE >", 0xffff0000], ["Absender", 30, true, true, 0xff777777, true, 0xffffffff, false], [0xff00ff00, 0xffff0000, this._on_endurance, false], null);
			this._initParamsGetter.register("OptionsButton"    , "SplashTextButton_Actor", ["< OPTIONS >"  , 0xffff0000], ["Absender", 30, true, true, 0xff777777, true, 0xffffffff, false], [0xff00ff00, 0xffff0000, this._on_options, false], null);
			
			this._initParamsGetter.register("EnduranceCompleteIcon", "EnduranceCompleteIcon_Actor", null, [ 30, 20, 20, 2, 5, 0xffE8E523], null, null);
			
			// Initializing Actor manager.
			this._actorManager.init();

			// Setting up initial actors for this state
			
			// Adding GUI Actors to the GUIActorManager.
			this._guiActorManager.SetAllgroupsDeadCallback(() => this.onGuiAnimationsComplete());
			
			this._guiActorManager.add("Main", "Score"			   , this._stage.stageWidth / 2, 20);
			this._guiActorManager.add("Main", "Title"			   , this._stage.stageWidth / 2, this._stage.stageHeight / 2 - 200);
			this._guiActorManager.add("Main", "Mission_1"	       , this._stage.stageWidth / 2, this._stage.stageHeight / 2 - 35);
			this._guiActorManager.add("Main", "Mission_2"	       , this._stage.stageWidth / 2, this._stage.stageHeight / 2 + 15);
			
			this._guiActorManager.add("Main", "LevelSelectButton", this._stage.stageWidth / 2, this._stage.stageHeight / 2 + 150);
			this._enduranceButtonActor = this._guiActorManager.add("Main", "EnduranceButton"  , this._stage.stageWidth / 2, this._stage.stageHeight / 2 + 200);
			this._guiActorManager.add("Main", "OptionsButton", this._stage.stageWidth / 2, this._stage.stageHeight / 2 + 250);
			
			this._enduranceButtonDim = this._enduranceButtonActor.Renderer.getTextDimentions();

			if (this._saveData.EnduranceModeComplete)
			{
				this._guiActorManager.add("Main", "EnduranceCompleteIcon", this._stage.stageWidth / 2 + this._enduranceButtonDim.x / 2, this._stage.stageHeight / 2 + 200 + this._enduranceButtonDim.y / 2);
			}
		}
		
		run(deltaTime)
		{
			super.run(deltaTime);
			
			if (this._readyToExit)
			{
				if (this._challengeMode)
				{
					this.dispatchEvent(new Event(Nukes.SPLASH_LEVEL_SELECT));
				}
				if (this._enduranceMode)
				{
					this.dispatchEvent(new Event(Nukes.SPLASH_ENDURANCE_GAME));
				}
				if (this._options)
				{
					this.dispatchEvent(new Event(Nukes.SPLASH_OPTIONS));
				}
			}
		}
		
		completed(dispatchCompletedEvent = true)
		{
			super.completed(dispatchCompletedEvent);
			
			this._actorManager.release();
			this._guiActorManager.destroy();
			
			this._enduranceButtonActor = null;
			this._enduranceButtonDim   = null;
		}
		
		onGuiAnimationsComplete()
		{
			this._readyToExit = true;
		}
		
		onChallenge(data)
		{
			this._challengeMode = true;
			this._guiActorManager.fadeOutAll();
		}
		
		onEndurance(data)
		{
			this._enduranceMode = true;
			this._guiActorManager.fadeOutAll();
		}
		
		onOptions(data)
		{
			this._options = true;
			this._guiActorManager.fadeOutAll();
		}

		getEnduranceHighScoreString()
		{
			const score = StringUtils.zeroPad(this._saveData.EnduranceHiScore, 8);
			const name = this._saveData.EnduranceHiScoreName;

			return `ENDURANCE HI-SCORE: ${score} - ${name}`;
		}
	}

	window.Splash = Splash;
}