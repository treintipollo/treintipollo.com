"use strict";

{
	const RESUME 	   = "RESUME";
	const SOUND_SWITCH = "SOUND ON/OFF";
	const QUIT 		   = "QUIT";
	
	const Event = GameEvent;

	class Pause extends GameSate
	{
		constructor(stage, owner)
		{
			super(stage, owner);
			
			this._pausePopup = null;

			this._pausePopUpInitialization = new ButtonListPopupInitialization("INTERMISSION");
			this._pausePopUpInitialization.add(RESUME);
			this._pausePopUpInitialization.add(SOUND_SWITCH);
			this._pausePopUpInitialization.add(QUIT);

			this._on_menu_closed = () => this.onMenuClosed();
			this._on_menu_button_click = (data) => this.onMenuButtonClick(data);
			this._on_resume_game = () => this.resumeGame();
		}

		get RESUME()
		{
			return RESUME;
		}

		get SOUND_SWITCH()
		{
			return SOUND_SWITCH;
		}

		get QUIT()
		{
			return QUIT;
		}

		init(interStateConnection)
		{
			super.init(interStateConnection);
			
			Nukes.keyBoardHandler.addReleaseCallback(Keyboard.P, this._on_resume_game);
			Nukes.keyBoardHandler.addReleaseCallback(Keyboard.ESCAPE, this._on_resume_game);
			
			this._pausePopUpInitialization.init(this._guiActorManager, this._modulePackageGetter, this._initParamsGetter, this._on_menu_button_click);
			
			this._actorManager.init();
			
			this._guiActorManager.SetAllgroupsDeadCallback(null);
			this._pausePopup = this._guiActorManager.add(this._pausePopUpInitialization.POPUP_GROUP_ID, this._pausePopUpInitialization.POPUP_ACTOR_ID, this._stage.stageWidth / 2, this._stage.stageHeight / 2, 0, 1, this._on_menu_closed, true);
			
			this._pausePopup.Logic._x -= this._pausePopup.Renderer.Width / 2;
			this._pausePopup.Logic._y -= this._pausePopup.Renderer.Height / 2 + 60;
		}
		
		run(deltaTime)
		{
			super.run(deltaTime);
		}
		
		completed(dispatchCompletedEvent = true)
		{
			super.completed(dispatchCompletedEvent);

			this._pausePopup = null;
		}

		onMenuClosed()
		{
			this._owner.dispatchEvent(new Event(State.MAIN_STATE));
		}
		
		onMenuButtonClick(data)
		{
			switch (data["CallbackData"].buttonName)
			{
				case RESUME:
					this.resumeGame();
					break;
				case SOUND_SWITCH:
					this.toggleSound();
					break;
				case QUIT:
					this.quitGame();
					break;
			}
		}
		
		resumeGame()
		{
			Nukes.keyBoardHandler.removeReleaseCallbacks();
			this._owner.getInterStateData()["PreviousSubState"] = SubMainGame.PAUSE_STATE;
			this._guiActorManager.fadeOutAll();
		}
		
		toggleSound()
		{
			this._soundManager.BGMVolumeToggle();
			this._soundManager.SFXVolumeToggle();
		}
		
		quitGame()
		{
			Nukes.keyBoardHandler.removeReleaseCallbacks();
			this._owner.getInterStateData()["PreviousSubState"] = SubMainGame.QUIT_PRESSED;
			this._guiActorManager.fadeOutAll();
		}
	}

	window.Pause = Pause;
}