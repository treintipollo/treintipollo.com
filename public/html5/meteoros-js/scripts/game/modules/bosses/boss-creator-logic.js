"use strict";

{
	class BossCreatorLogic extends FactoryLogic
	{
		constructor()
		{
			super();

			this._bossActor = null;
			this._bossId = "";
		}
		
		childInit(params)
		{
			this._actorManager = params[0];
			this._bossId = params[1];
		}
		
		update(deltaTime)
		{
			if (!this._bossActor)
			{
				this._bossActor = this._actorManager.setActor(this._bossId, this._actorManager.Stage.stageWidth / 2, -100);
				
				this.setChildDestructionCallbacks(this._bossActor);
			}
		}
		
		concreteRelease()
		{
			super.concreteRelease();
			
			this._bossActor = null;
		}
	}

	window.BossCreatorLogic = BossCreatorLogic;
}