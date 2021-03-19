"use strict";

{
	class DestroyCount
	{
		constructor()
		{
			this._fullFilled = null;
		
			this._startAmount = 0;
			this._destroyAmount = 0;
			this._visual = null;
			
			this._factories = null
			this._factoriesToOmit = null;

			this._on_something_destroyed = (actor) => this.onSomethingDestroyed(actor);
		}
		
		set FullFilledCallback(value)
		{
			this._fullFilled = value;
		}
		
		setUpVisual(modulePackageFactory, initParametersGetter)
		{
			modulePackageFactory.registerPackage("DestroyCountVisuals_Actor", 2, GuiTextScaleLogic, GuiTextRenderer, null, null);
			
			initParametersGetter.register("DestroyCountVisualsCounter", "DestroyCountVisuals_Actor", [" ", 0x777777], ["Absender", 70, true, false, 0, false, 0, false], null, null);
			initParametersGetter.register("DestroyCountVisualsText", "DestroyCountVisuals_Actor", ["HITS LEFT", 0x777777], ["Absender", 20, true, false, 0, false, 0, false], null, null);
		}
		
		addVisual(actorManager)
		{
			this._visual = actorManager.setActor("DestroyCountVisualsText", actorManager.Stage.stageWidth / 2, actorManager.Stage.stageHeight / 2 - 55, 0, 1, true);
			this._visual.Logic.Alpha = 0.6;
			this._visual.Renderer.sendBack();
			
			this._visual = actorManager.setActor("DestroyCountVisualsCounter", actorManager.Stage.stageWidth / 2, actorManager.Stage.stageHeight / 2, 0, 1, true);
			this._visual.Logic.Alpha = 0.6;
			this._visual.Renderer.sendBack();
			
			this._destroyAmount = this._startAmount;
			this._visual.Logic.ExternalParameters["Text"] = this._destroyAmount.toString();
			
			this.addDestructionCallbacks(actorManager);
		}
		
		setInitArguments(args)
		{
			this._startAmount = args[0];
			this._factoriesToOmit = args[1].split(",");
		}
		
		init(args)
		{

		}
		
		release()
		{
			this._visual 		  		 = null;
			this._fullFilled	  		 = null;
			this._factoriesToOmit 		 = null;
			this._factories	      		 = null;
		}
		
		getDescription()
		{
			return "GET " + this._startAmount + " HITS";
		}
		
		onSomethingDestroyed(actor)
		{
			if (actor.Logic.ExternalParameters["MissileHit"] && this._destroyAmount > 0)
			{
				if (actor.Logic.ExternalParameters["HitAmount"])
				{
					this._destroyAmount -= actor.Logic.ExternalParameters["HitAmount"];
					
					if (this._destroyAmount < 0)
						this._destroyAmount = 0;

					if (this._visual.Logic)
					{
						this._visual.Logic.ExternalParameters["Text"] = this._destroyAmount.toString();
					}
				}
				
				actor.Logic.ExternalParameters["MissileHit"] = false;
				actor.Logic.ExternalParameters["HitAmount"] = NaN;

				if (this._destroyAmount <= 0)
				{
					this._fullFilled();
					this.release();
				}
			}
		}
		
		addDestructionCallbacks(actorManager)
		{
			this._factories = actorManager.getActors(FactoryLogic);
			
			for (let i = 0; i < this._factories.length; i++)
			{
				let matchFound = false;
				
				for (let j = 0; j < this._factoriesToOmit.length; j++)
				{
					if (this._factories[i].Modules._name == this._factoriesToOmit[j])
					{
						matchFound = true;
					}
				}
				
				if (!matchFound)
				{
					this._factories[i].Logic.AddchildDestructionCallback(this._on_something_destroyed);
				}
			}
			
			this._factories = null;
		}
	}

	window.DestroyCount = DestroyCount;
}