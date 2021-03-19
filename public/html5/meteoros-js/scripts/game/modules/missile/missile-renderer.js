"use strict";

{
	class MissileRenderer extends Renderer
	{
		constructor()
		{
			super();

			this.BODY_WIDTH = 0;
			this.BODY_HEIGHT = 0;
			
			this._particleSystemController = null;
			this._exhaustRotation = 0;
			
			this._parameters = null;

			this._container 	= window.DynamicGraphics.GetSprite("missile");
			this._explosionPos  = new SharedPoint();
			this._exhaustOffset = new SharedPoint();

			this._start_engine = () => this.startEngine();
			this._deflected = () => this.deflected();
			this._explode = () => this.explode();
		}
		
		childInit(params)
		{
			this.BODY_WIDTH  = params[0];
			this.BODY_HEIGHT = params[1];
		}
		
		initComplete()
		{
			this._parameters = this._logic.ExternalParameters;
			
			this._parameters["explode"].add(this._explode);
			
			this._parameters["startEngine"] = this._start_engine;
			this._parameters["deflected"]   = this._deflected;
			
			this.draw();
		}
		
		concreteDraw()
		{

		}
		
		concreteUpdate(deltaTime)
		{
			this._exhaustRotation = this._logic.Rotation + 90;
			this._exhaustOffset = TrigUtils.posAroundPoint(this._container.x, this._container.y, (this._exhaustRotation) * NumberUtils.TO_RADIAN, this.BODY_HEIGHT / 2 + 10, this._exhaustOffset);
			
			if (this._particleSystemController)
			{
				this._particleSystemController._rotation = this._exhaustRotation;
			}
		}
		
		concreteDestroy()
		{
			this._explosionPos.Clean();
			this._explosionPos  = null;

			this._exhaustOffset.Clean();
			this._exhaustOffset = null;
		}
		
		concreteRemoveFromStage()
		{
			if (this._particleSystemController)
			{
				this._particleSystemController._clear = true;
			}
			
			this._particleSystemController = null;
			this._parameters = null;
		}
		
		explode()
		{
			this._explosionPos.x = this._container.x;
			this._explosionPos.y = this._container.y;

			ParticleSystemManager.GetSystem("MissileExplosion", this._explosionPos);
		}
		
		startEngine()
		{
			this._particleSystemController = ParticleSystemManager.GetSystem("MissileExhaust", this._exhaustOffset, true);
		}
		
		deflected()
		{
			if (this._particleSystemController)
			{
				this._particleSystemController._clear = true;
			}
			
			this._stage.setChildIndex(this._container, this._stage.numChildren - 1);
		}
	}

	window.MissileRenderer = MissileRenderer;
}