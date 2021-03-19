"use strict";

{
	class DestroyBoss extends DestroyCount
	{
		constructor()
		{
			super();

			this._visualsString = "";
		}
		
		setUpVisual(modulePackageFactory, initParametersGetter)
		{
			modulePackageFactory.registerPackage("DestroyBossVisuals_Actor", 1, GuiTextScaleLogic, GuiTextRenderer, null, null);
			
			initParametersGetter.register("DestroyBossVisuals", "DestroyBossVisuals_Actor", [this._visualsString, 0x777777], ["Absender", 70, true, false, 0, false, 0, false], null, null);
		}
		
		addVisual(actorManager)
		{
			this._visual = actorManager.setActor("DestroyBossVisuals", actorManager.Stage.stageWidth / 2, actorManager.Stage.stageHeight / 2 - 55, 0, 1, true);
			this._visual.Logic.Alpha = 0.6;
			this._visual.Renderer.sendBack();
			
			this._destroyAmount = this._startAmount;
			
			this.addDestructionCallbacks(actorManager);
		}
		
		setInitArguments(args)
		{
			super.setInitArguments(args);
			
			this._visualsString = args[2];
		}
		
		getDescription()
		{
			return "DEFEAT THE BOSS";
		}
		
		onSomethingDestroyed(actor)
		{
			if (actor.Logic.ExternalParameters["MissileHit"] && this._destroyAmount > 0)
			{
				this._destroyAmount--;
				
				actor.Logic.ExternalParameters["MissileHit"] = false;
				
				if (this._destroyAmount === 0)
				{
					this._fullFilled();
					this.release();
				}
			}
		}
	}

	window.DestroyBoss = DestroyBoss;
}