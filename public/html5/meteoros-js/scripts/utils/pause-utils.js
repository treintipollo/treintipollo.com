"use strict";

{
	const NO_PAUSE      = -1;
	const TOTAL_PAUSE   =  0;
	const PARTIAL_PAUSE =  1;
	
	class PauseUtils
	{
		constructor(mainContainer, mouseHandler, soundManager, stage)
		{
			this._focusPause 	   = true;
			this._requestedPause   = false;
			this._totalBlocker     = new Shape();
			this._partialBlocker   = new Shape();

			this._hidden = false;
			
			this._mouseObject  = mouseHandler;
			this._soundManager = soundManager;
			
			window.addEventListener("click", (e) => this.onClick());

			window.addEventListener("focus", () => this.gainFocus());
			window.addEventListener("blur", () => this.lostFocus());

			document.addEventListener("visibilitychange", () => document.visibilityState === "visible" ? this.gainFocus() : this.lostFocus());
		}
		
		static get NO_PAUSE()
		{
			return NO_PAUSE;
		}

		static get TOTAL_PAUSE()
		{
			return TOTAL_PAUSE;
		}

		static get PARTIAL_PAUSE()
		{
			return PARTIAL_PAUSE;
		}

		isPaused()
		{
			if (!this._focusPause)
			{
				return TOTAL_PAUSE;
			}
			
			if (this._requestedPause)
			{
				return PARTIAL_PAUSE;
			}
			
			return NO_PAUSE;
		}
		
		pause()
		{
			if (!this._requestedPause)
			{
				this._requestedPause = true;
				this._stage.addChild(this._partialBlocker);
			}
		}
		
		resume()
		{
			if (this._requestedPause)
			{
				this._requestedPause = false;
				this._stage.removeChild(this._partialBlocker);
			}
		}
		
		initFocusHandler(stage)
		{
			this._stage = stage;
			
			this._totalBlocker.graphics.clear();
			this._totalBlocker.graphics.beginFill("rgba(0, 0, 0, 0.6)");
			this._totalBlocker.graphics.rect(0, 0, this._stage.stageWidth, this._stage.stageHeight);
			this._totalBlocker.graphics.endFill();
			this._totalBlocker.cache(0, 0, this._stage.stageWidth, this._stage.stageHeight);

			this._partialBlocker.graphics.clear();
			this._partialBlocker.graphics.beginFill("rgba(0, 0, 0, 0.0)");
			this._partialBlocker.graphics.rect(0, 0, this._stage.stageWidth, this._stage.stageHeight);
			this._partialBlocker.graphics.endFill();
			this._partialBlocker.cache(0, 0, this._stage.stageWidth, this._stage.stageHeight);
		}
		
		lostFocus()
		{
			this._stage.addChild(this._totalBlocker);
			this._stage.setChildIndex(this._totalBlocker, this._stage.numChildren-1);
			
			this._focusPause = false;
			
			this._mouseObject.hide();
			
			this._hidden = true;
			SoundManager.Block();
			Sound.Context.suspend();
		}
		
		gainFocus()
		{
			if (this._stage.contains(this._totalBlocker))
				this._stage.removeChild(this._totalBlocker);
			
			this._focusPause = true;
			
			this._mouseObject.hide();
			this._mouseObject.show();

			SoundManager.UnBlock();
			Sound.Context.resume();
			this._hidden = false;
		}
		
		onClick()
		{
			this.gainFocus();

			SoundManager.UnBlock();
			Sound.Context.resume();
		}
	}

	window.PauseUtils = PauseUtils;
}
