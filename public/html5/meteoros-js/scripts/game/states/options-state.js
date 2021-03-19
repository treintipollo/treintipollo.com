"use strict";

{
	const Event = GameEvent;

	class Options extends GameSate
	{
		constructor(stage, owner)
		{
			super(stage, owner);
			
			this._currentBGM = null;
			this._soundToggle = null;
			this._currentSoundIndex = 0;

			this._on_gui_animations_complete = (...args) => this.onGuiAnimationsComplete(...args);
			this._on_clear_data = (...args) => this.onClearData(...args);
			this._on_toggle_sound = (...args) => this.onToggleSound(...args);
			this._on_play = (...args) => this.onPlay(...args);
			this._on_stop = (...args) => this.onStop(...args);
			this._on_next = (...args) => this.onNext(...args);
			this._on_prev = (...args) => this.onPrev(...args);
			this._on_music_link = (...args) => this.onMusicLink(...args);
		}
		
		init(interStateConnection)
		{
			super.init(interStateConnection);
			
			this._currentSoundIndex = 0;
			
			this._modulePackageGetter.registerPackage("OptionsText_Actor", 3, GuiTextFadeLogic, GuiTextRenderer, null, null);
			this._modulePackageGetter.registerPackage("Button_Actor", 8, GuiTextFadeLogic, GuiTextRenderer, GuiTextButtonInput, null);
			
			this._initParamsGetter.register("Title", "OptionsText_Actor", ["OPTIONS", 0xffff0000], ["Absender", 80, true, false, 0, false, 0, true], null, null);
			this._initParamsGetter.register("SoundTitle", "OptionsText_Actor", ["SOUND TEST", 0xffff0000], ["Absender", 35, true, false, 0, false, 0, true], null, null);
			this._initParamsGetter.register("BackButton", "Button_Actor", ["< BACK >", 0xffff0000], ["Absender", 30, true, true, 0xff777777, true, 0xffffffff, false], [0xff00ff00, 0xffff0000, null, true], null);
			this._initParamsGetter.register("ClearData", "Button_Actor", ["< CLEAR SAVE DATA >", 0xff000000], ["Absender", 24, true, true, 0xff777777, true, 0xffffffff, false], [0xffffffff, 0xff000000, this._on_clear_data, false], null);
			this._initParamsGetter.register("ToggleSound", "Button_Actor", ["< SOUND ON >", 0xff000000], ["Absender", 24, true, true, 0xff777777, true, 0xffffffff, false], [0xffffffff, 0xff000000, this._on_toggle_sound, false], null);
			
			this._initParamsGetter.register("CurrentBGM", "OptionsText_Actor", ["BGM ------------------> 00", 0xff000000], ["Absender", 24, true, true, 0xff777777, true, 0xffffffff, false], null, null);
			this._initParamsGetter.register("Play"	, "Button_Actor", ["<PLAY>", 0xff000000], ["Absender", 24, true, true, 0xff777777, true, 0xffffffff, false], [0xff00ff00, 0xff000000, this._on_play, false], null);
			this._initParamsGetter.register("Stop"	, "Button_Actor", ["<STOP>", 0xff000000], ["Absender", 24, true, true, 0xff777777, true, 0xffffffff, false], [0xffff0000, 0xff000000, this._on_stop, false], null);
			this._initParamsGetter.register("Next"	, "Button_Actor", ["<NEXT>", 0xff000000], ["Absender", 24, true, true, 0xff777777, true, 0xffffffff, false], [0xffffffff, 0xff000000, this._on_next, false], null);
			this._initParamsGetter.register("Previous", "Button_Actor", ["<PREV>", 0xff000000], ["Absender", 24, true, true, 0xff777777, true, 0xffffffff, false], [0xffffffff, 0xff000000, this._on_prev, false], null);
			
			this._initParamsGetter.register("Link", "Button_Actor", ["WANT ALL THE MUSIC?", 0xff777777], ["Absender", 20, true, false, 0, false, 0, false], [0xffffffff, 0xff777777, this._on_music_link, false], null);
			
			this._actorManager.init();
			
			this._guiActorManager.SetAllgroupsDeadCallback(this._on_gui_animations_complete);
			
			this._guiActorManager.add("Main", "Title"		  , this._stage.stageWidth / 2, this._stage.stageHeight / 2 - 200);
			this._guiActorManager.add("Main", "ClearData"	  , this._stage.stageWidth / 2, this._stage.stageHeight / 2 - 75);
			this._soundToggle = this._guiActorManager.add("Main", "ToggleSound" , this._stage.stageWidth / 2, this._stage.stageHeight / 2 - 35);
			
			this._guiActorManager.add("Main", "SoundTitle" , this._stage.stageWidth / 2, this._stage.stageHeight / 2 + 60);
			
			this._currentBGM = this._guiActorManager.add("Main", "CurrentBGM" , this._stage.stageWidth / 2, this._stage.stageHeight / 2 + 120);
			this._guiActorManager.add("Main", "Play" 	   , this._stage.stageWidth / 2 + 70, this._stage.stageHeight / 2 + 160);
			this._guiActorManager.add("Main", "Stop" 	   , this._stage.stageWidth / 2 - 70, this._stage.stageHeight / 2 + 160);
			this._guiActorManager.add("Main", "Next" 	   , this._stage.stageWidth / 2 + 210, this._stage.stageHeight / 2 + 160);
			this._guiActorManager.add("Main", "Previous" , this._stage.stageWidth / 2 - 210, this._stage.stageHeight / 2 + 160);
			this._guiActorManager.add("Main", "Link" , this._stage.stageWidth / 2, this._stage.stageHeight / 2 + 200);
			
			this._guiActorManager.add("Main", "BackButton"  , this._stage.stageWidth / 2, this._stage.stageHeight / 2 + 250);
			
			if (this._soundManager.GetSoundTransform(true).volume === 0)
			{
				this._soundToggle.Logic.ExternalParameters["Text"] = "< SOUND OFF >";
			}
			else
			{
				this._soundToggle.Logic.ExternalParameters["Text"] = "< SOUND ON >";
			}
		}
		
		run(deltaTime)
		{
			super.run(deltaTime);
			
			if (this._readyToExit)
			{
				this.dispatchEvent(new Event(Nukes.OPTIONS_SPLASH));
			}
		}
		
		completed(dispatchCompletedEvent = true)
		{
			super.completed(dispatchCompletedEvent);
			
			this._actorManager.release();
			this._guiActorManager.destroy();
			this._soundManager.StopAll();
			
			this._currentBGM = null;
		}
		
		onGuiAnimationsComplete()
		{
			this._readyToExit = true;
		}
		
		onClearData(data)
		{
			this._saveData.clearAll(this._levelManager);
		}
		
		onToggleSound(data)
		{
			this._soundManager.BGMVolumeToggle();
			this._soundManager.SFXVolumeToggle();
			
			if (this._soundManager.GetSoundTransform(true).volume === 0)
			{
				this._soundToggle.Logic.ExternalParameters["Text"] = "< SOUND OFF >";
			}
			else
			{
				this._soundToggle.Logic.ExternalParameters["Text"] = "< SOUND ON >";
			}
		}
		
		onPlay(data)
		{
			this._soundManager.Play(Sounds.BGM_ORDER[this._currentSoundIndex]);
		}
		
		onStop(data)
		{
			this._soundManager.StopAll();
		}
		
		onNext(data)
		{
			if (this._currentSoundIndex < Sounds.BGM_ORDER.length - 1)
			{
				this._currentSoundIndex++;
			}
			else
			{
				this._currentSoundIndex = 0;
			}
			
			this._currentBGM.Logic.ExternalParameters["Text"] = "BGM ------------------> " +  StringUtils.zeroPad(this._currentSoundIndex, 2);
		}
		
		onPrev(data)
		{
			if (this._currentSoundIndex > 0)
			{
				this._currentSoundIndex--;
			}
			else
			{
				this._currentSoundIndex = SoundInitializer.BGM_ORDER.length - 1;
			}
			
			this._currentBGM.Logic.ExternalParameters["Text"] = "BGM ------------------> " +  StringUtils.zeroPad(this._currentSoundIndex, 2);
		}
		
		onMusicLink(data)
		{
			this._soundManager.StopAll();
			
			const win = window.open("http://www.metanetsoftware.com/technique/music.html", "_blank");
			
			win.focus();
		}
	}

	window.Options = Options;
}