"use strict";

{
	const Event = GameEvent;

	class EnduranceGame extends GameSate
	{
		constructor(stage, owner)
		{
			super(stage, owner);

			this._victory = false;
			this._level = null;
			this._levelFinished = false;
			this._clearScreen = false;
			this._standardBGMs = null;
			this._bossBGMs = null;

			this._currentLevel = 0;

			this._on_pause_sub_state = () => this.pauseSubState();
			this._on_fade_in_complete = () => this.onFadeInComplete();
			this._on_fade_out_complete = () => this.onFadeOutComplete();
			this._on_screen_cover_done = (actor) => this.onScreenCoverDone(actor);
			this._on_failure = () => this.onFailure();
			this._on_victory = () => this.onVictory();
		}
		
		set StandardBGMs(value)
		{
			this._standardBGMs = value;
		}

		set BossBGMs(value)
		{
			this._bossBGMs = value;
		}
		
		init(interStateConnection)
		{
			this._interStateConnection = new Object();
			this._victory 	  	  = false;
			this._levelFinished   = false;
			this._clearScreen     = false;
			
			this._level = this._levelManager.getLevel("EnduranceLevel", this._currentLevel);
			
			if (this._currentLevel === 0)
			{
				this._scoreCounter.init([ this._pauseHandler ]);
			}
			
			if (this._level.Type === Level.STANDARD_LEVEL)
			{
				this.BGM = this._standardBGMs[ NumberUtils.randRange(0, this._standardBGMs.length - 1, true) ];
			}

			if (this._level.Type === Level.BOSS_LEVEL)
			{
				this.BGM = this._bossBGMs[ NumberUtils.randRange(0, this._bossBGMs.length - 1, true) ];
			}
			
			super.init(interStateConnection);
			
			this._level.ScoreCounter = this._scoreCounter;
			
			this._level.OnLevelVictory = this._on_victory;
			this._level.OnLevelFailure = this._on_failure;
			
			// Setup Level
			this._level.setUp(this._actorManager, this._modulePackageGetter, this._initParamsGetter, this._collisionManager, this._requirementsManager);
			
			// Fade in and out actors
			this._modulePackageGetter.registerPackage("Fade_Actor", 1, FadeToBlackLogic, FadeToBlackRenderer, null, null);
			this._modulePackageGetter.registerPackage("ScreenCover_Actor", 1, ScreenCoverLogic, null, null, BoxCollider);
			this._modulePackageGetter.registerPackage("Block_Actor", 1, Logic, FadeToBlackRenderer, null, null);
			
			this._initParamsGetter.register("FadeIn", "Fade_Actor",  [true, false], null, null, null);
			this._initParamsGetter.register("FadeOut", "Fade_Actor", [false, true], null, null, null);
			this._initParamsGetter.register("Blocker", "Block_Actor", null, null, null, null);
			this._initParamsGetter.register("ScreenCover", "ScreenCover_Actor", [this._actorManager, this._level.DestroyableActors], null, null, [this._stage.stageWidth, this._stage.stageHeight]);
			
			for (let i = 0; i < this._level.DestroyableActors.length; i++)
			{
				this._collisionManager.addPair("ScreenCover_Actor", this._level.DestroyableActors[i]);
			}
			
			// Create Level
			this._level.creation(this._actorManager, this._modulePackageGetter, this._initParamsGetter, this._collisionManager, this._requirementsManager);
			
			if (this._currentLevel === 0)
			{
				this._pauseHandler.pause();
				this._guiActorManager.SetAllgroupsDeadCallback(this._on_fade_in_complete);
				this._guiActorManager.add("Fade", "FadeIn", 0, 0);
			}
		}
		
		run(deltaTime)
		{
			super.run(deltaTime);
			
			if (this._readyToExit)
			{
				Nukes.keyBoardHandler.removeReleaseCallbacks();
				this._interStateConnection["Endurance"] = true;
				
				if (this._victory)
				{
					this.dispatchEvent(new Event(Nukes.ENDURANCE_GAME_VICTORY));
				}
				else
				{
					this.dispatchEvent(new Event(Nukes.ENDURANCE_GAME_GAME_OVER));
				}
			}
			else
			{
				if (this._levelFinished && this._clearScreen)
				{
					this._levelFinished = false;
					this._clearScreen   = false;
					
					this._guiActorManager.destroy();
					this._requirementsManager.destroy();
					this._actorManager.release(["City_Actor", "Missile_Actor", "CityPopulation_Actor", "MissileLauncher_Actor", "ScoreCountVisuals_Actor"]);

					ParticleSystemManager.ClearSystems(["HumanVacum"]);

					this.init(this._interStateConnection);
				}
			}
		}
		
		backFromSubState(interStateConnection)
		{
			if (interStateConnection["PreviousSubState"] === SubMainGame.INTRO_STATE)
			{
				this._pauseHandler.resume();
				Nukes.keyBoardHandler.addReleaseCallback(Keyboard.P, this._on_pause_sub_state);
				Nukes.keyBoardHandler.addReleaseCallback(Keyboard.ESCAPE, this._on_pause_sub_state);
			}
			if (interStateConnection["PreviousSubState"] === SubMainGame.OUTRO_STATE)
			{
				this._guiActorManager.add("Fade", "FadeOut", 0, 0, 0, 1, this._on_fade_out_complete);
			}
			if (interStateConnection["PreviousSubState"] === SubMainGame.PAUSE_STATE)
			{
				this._pauseHandler.resume();
				Nukes.keyBoardHandler.addReleaseCallback(Keyboard.P, this._on_pause_sub_state);
				Nukes.keyBoardHandler.addReleaseCallback(Keyboard.ESCAPE, this._on_pause_sub_state);
			}
			if (interStateConnection["PreviousSubState"] === SubMainGame.QUIT_PRESSED)
			{
				this._playPreviousBGM = true;
				this._usePreviousPointer = true;
				this._guiActorManager.add("Fade", "FadeOut", 0, 0, 0, 1, this._on_fade_out_complete);
			}
			
			super.backFromSubState(interStateConnection);
		}
		
		pauseSubState()
		{
			this._pauseHandler.pause();
			Nukes.keyBoardHandler.removeReleaseCallbacks();
			this._interStateConnection["SubStateIndex"] = SubMainGame.PAUSE_STATE;
			this.dispatchEvent(new Event(State.SUB_STATE));
		}
		
		completed(dispatchCompletedEvent = true)
		{
			super.completed(dispatchCompletedEvent);
			
			this._guiActorManager.destroy();
			this._actorManager.release();
			this._requirementsManager.destroy();
			this._scoreCounter.release();
			
			this._interStateConnection = CollectionUtils.merge(this._interStateConnection, this._levelManager.releaseEndurance());
			
			this._interStateConnection["LevelScore"]   = this._scoreCounter._score;
			this._interStateConnection["LongestCombo"] = this._scoreCounter._longestCombo;
			
			ParticleSystemManager.Reset();
			
			this._currentLevel = 0;
			this._level 	   = null;
		}

		onFadeInComplete()
		{
			this._interStateConnection["SubStateIndex"] = SubMainGame.INTRO_STATE;
			this.dispatchEvent(new Event(State.SUB_STATE));
		}
		
		onFadeOutComplete()
		{
			if (!this._readyToExit)
			{
				this._readyToExit = true;
				this._actorManager.setActor("Blocker", 0, 0);
				this._pauseHandler.resume();
			}
		}
		
		onScreenCoverDone(screenCoverActor)
		{
			this._level.release();
			this._clearScreen = true;
		}
		
		onFailure()
		{
			if (!this._levelFinished)
			{
				Nukes.keyBoardHandler.removeReleaseCallbacks();
				
				this._levelFinished 					    = true;
				this._victory 							    = false;
				this._interStateConnection["Victory"] 	    = this._victory;
				this._interStateConnection["SubStateIndex"] = SubMainGame.OUTRO_STATE;
				
				this.dispatchEvent(new Event(State.SUB_STATE));
			}
		}
		
		onVictory()
		{
			if (!this._levelFinished)
			{
				this._currentLevel++;
				this._levelFinished = true;
				
				if (this._currentLevel >= this._levelManager.getLevelCount("EnduranceLevel"))
				{
					Nukes.keyBoardHandler.removeReleaseCallbacks();
					
					this._levelFinished = false;
					this._victory = true;
					
					this._interStateConnection["Victory"] 	    = this._victory;
					this._interStateConnection["SubStateIndex"] = SubMainGame.OUTRO_STATE;
					
					this.dispatchEvent(new Event(State.SUB_STATE));
				}
				else
				{
					this._actorManager.setActor("ScreenCover", this._stage.stageWidth / 2, this._stage.stageHeight / 2, 0, 1, true, this._on_screen_cover_done);
				}
			}
		}
	}

	window.EnduranceGame = EnduranceGame;
}