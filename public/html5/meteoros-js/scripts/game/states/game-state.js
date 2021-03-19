"use strict";

{
	class GameSate extends State
	{
		constructor(stage, owner)
		{
			super(stage, owner);
			
			this.CURRENT_MOUSE_POINTER_TYPE = 0;
			this.CURRENT_BGM_NAME = -1;
			this.LAST_BGM_PLAYED_NAME = -1;
			this.PREVIOUS_STATE_BGM = -1;
			this.PREVIOUS_STATE_POINTER_TYPE = 0;
			
			this._previousBGMStopped = false;
			this._initBGM = -1;
			this._noBGM = false;
			
			this._playPreviousBGM = false;
			this._usePreviousPointer = false;
			
			this._actorManager = null;
			this._collisionManager = null;
			this._modulePackageGetter = null;
			this._initParamsGetter = null;
			this._guiActorManager = null;
			this._levelManager = null;
			this._requirementsManager = null;
			this._pauseHandler = null;
			this._saveData = null;
			this._messageGetter = null;
			this._scoreCounter = null;
			this._inputVisualsManager = null;
			this._soundManager = null;
			
			this._actorManager 			= this._owner.actorManager || this._owner._actorManager;
			this._collisionManager 		= this._owner.collisionManager || this._owner._collisionManager;
			this._modulePackageGetter 	= this._owner.modulePackageGetter || this._owner._modulePackageGetter;
			this._initParamsGetter		= this._owner.initParamsGetter || this._owner._initParamsGetter;
			this._guiActorManager 		= this._owner.guiActorManager || this._owner._guiActorManager;
			this._levelManager 			= this._owner.levelManager || this._owner._levelManager;
			this._requirementsManager 	= this._owner.requirementsManager || this._owner._requirementsManager;
			this._pauseHandler 			= this._owner.pauseHandler || this._owner._pauseHandler;
			this._saveData				= this._owner.saveData || this._owner._saveData;
			this._messageGetter			= this._owner.messageGetter || this._owner._messageGetter;
			this._scoreCounter			= this._owner.scoreCounter || this._owner._scoreCounter;
			this._inputVisualsManager 	= this._owner.inputVisualsManager || this._owner._inputVisualsManager;
			this._soundManager			= this._owner.soundManager || this._owner._soundManager;
			
			if (!this._interStateConnection)
				this._interStateConnection = {};
		}
		
		set BGM(value)
		{
			this.LAST_BGM_PLAYED_NAME = this.CURRENT_BGM_NAME;
			this.CURRENT_BGM_NAME = value;
			this._initBGM  = this.CURRENT_BGM_NAME;
			
			this._noBGM = value === -1 ? true : false;
		}
		
		set MousePointer(value)
		{
			this.CURRENT_MOUSE_POINTER_TYPE = value;
		}
		
		init(interStateConnection)
		{
			super.init(interStateConnection);

			if (this.LAST_BGM_PLAYED_NAME !== this.CURRENT_BGM_NAME)
			{
				this._soundManager.Stop(this.LAST_BGM_PLAYED_NAME);
			}
			
			if (interStateConnection)
			{
				this.PREVIOUS_STATE_BGM 		 = interStateConnection["Previous_BGM"] ? interStateConnection["Previous_BGM"] : -1;
				this.PREVIOUS_STATE_POINTER_TYPE = interStateConnection["Previous_Pointer_Type"] ? interStateConnection["Previous_Pointer_Type"] : 0;
			}
			
			if (this.CURRENT_BGM_NAME === -1)
			{
				this.CURRENT_BGM_NAME = this.PREVIOUS_STATE_BGM;
			}
			else
			{
				this.CURRENT_BGM_NAME = this._initBGM;
			}
			
			this._previousBGMStopped = false;
			this._playPreviousBGM    = false;
			this._usePreviousPointer = false;

			Nukes.mouseHandler.setVisuals(this._inputVisualsManager.get(this.CURRENT_MOUSE_POINTER_TYPE));
		}
		
		run(deltaTime)
		{
			if (this._playPreviousBGM)
			{
				this.CURRENT_BGM_NAME = this.PREVIOUS_STATE_BGM;
			}
			
			if (!this._previousBGMStopped)
			{
				if (this.PREVIOUS_STATE_BGM !== this.CURRENT_BGM_NAME)
				{
					if (!this._noBGM)
					{
						this._soundManager.Stop(this.PREVIOUS_STATE_BGM);
					}

				}

				this._previousBGMStopped = true;
			}
			
			if (!this._noBGM)
				this._soundManager.Play(this.CURRENT_BGM_NAME);
		}
		
		toSubState()
		{
			this._previousBGMStopped = false;
			
			this._interStateConnection["Previous_BGM"] 		    = this.CURRENT_BGM_NAME;
			this._interStateConnection["Previous_Pointer_Type"] = this.CURRENT_MOUSE_POINTER_TYPE;
		}
		
		backFromSubState(interStateConnection)
		{
			if (this._usePreviousPointer)
			{
				Nukes.mouseHandler.setVisuals(this._inputVisualsManager.get(this.PREVIOUS_STATE_POINTER_TYPE));
			}
			else
			{
				Nukes.mouseHandler.setVisuals(this._inputVisualsManager.get(this.CURRENT_MOUSE_POINTER_TYPE));
			}
		}
		
		completed(dispatchCompletedEvent = true)
		{
			this._interStateConnection["Previous_BGM"] 		    = this.CURRENT_BGM_NAME;
			this._interStateConnection["Previous_Pointer_Type"] = this.CURRENT_MOUSE_POINTER_TYPE;
			
			this.PREVIOUS_STATE_BGM = -1;
			
			if (this._noBGM)
				this.CURRENT_BGM_NAME = -1;
			
			super.completed(dispatchCompletedEvent);
		}
		
		clean()
		{
			super.clean();
			
			this._actorManager 			= null;
			this._collisionManager 		= null;
			this._modulePackageGetter 	= null;
			this._initParamsGetter 		= null;
			this._guiActorManager 		= null;
			this._levelManager 			= null;
			this._requirementsManager 	= null;
			this._pauseHandler 			= null;
			this._saveData				= null;
			this._messageGetter			= null;
			this._scoreCounter			= null;
			this._inputVisualsManager 	= null;
			this._soundManager			= null;
		}
	}

	window.GameSate = GameSate;
}