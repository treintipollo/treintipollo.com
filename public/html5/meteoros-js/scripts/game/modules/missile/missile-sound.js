"use strict";

{
	class MissileSoundPlayer
	{
		constructor()
		{
			this._soundManager = null;
			this._logic = null;
			this._explotionSoundName = "";
			this._launchSoundName = "";

			this._on_explotion = () => this.onExplotion();
			this._on_launched = () => this.onLaunch();
		}
		
		init(soundManager, logic, additionalParameters = null)
		{
			this._logic				 = logic;
			this._soundManager 		 = soundManager;
			this._explotionSoundName = additionalParameters[0];
			this._launchSoundName 	 = additionalParameters[1];
		}
		
		initComplete()
		{
			this._logic.ExternalParameters["explode"].add(this._on_explotion);
			this._logic.ExternalParameters["launched"].add(this._on_launched);
		}
		
		update(deltaTime)
		{

		}

		destroy()
		{

		}
		
		postRelease()
		{
			this._soundManager = null;
		}
		
		onExplotion()
		{
			this._soundManager.Play(this._explotionSoundName);
		}
		
		onLaunch()
		{
			this._soundManager.Play(this._launchSoundName);
		}
	}

	window.MissileSoundPlayer = MissileSoundPlayer;
}