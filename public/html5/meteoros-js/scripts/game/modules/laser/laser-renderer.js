"use strict";

{
	class LaserRenderer extends Renderer
	{
		constructor()
		{
			super();

			this._parameters = null;
			this._chargeUpParticlesController = null;
			this._particleInitArgument = null;
			
			this._container  		   = new Shape();
			this._beginPoint 		   = new Point();
			this._endPoint   		   = new Point();
			this._chargeUpParticlesPos = new SharedPoint();

			this._charge_up_particles = () => this.ChargeUpParticles();
			this._kill_charge_up_particles = () => this.KillChargeUpParticles();
			this._blast_particles = (length) => this.BlastParticles(length);
		}
		
		initComplete()
		{
			this._parameters = this._logic.ExternalParameters;
			
			this._parameters["chargeUp"] 		= this._charge_up_particles;
			this._parameters["chargeComplete"] 	= this._kill_charge_up_particles;
			this._parameters["blast"] 		 	= this._blast_particles;
			
			this._stage.setChildIndex(this._container, 1);

			this._initX = this._logic._x;
		}
		
		childInit(params)
		{
			this._beginPoint.x = -1;				// X
			this._beginPoint.y = 0;					// Y
			this._endPoint.x   = 2;					// W
			this._endPoint.y   = params[0] + 10; 	// H
			
			this.draw();
		}
		
		concreteUpdate(deltaTime)
		{
			this._chargeUpParticlesPos.x = this._container.x;
			this._chargeUpParticlesPos.y = this._container.y;
		}
		
		concreteDraw()
		{
			this._container.uncache();
			this._container.graphics.clear();

			ShapeUtils.drawRectangle(
				this._container,
				this._beginPoint.x,
				this._beginPoint.y,
				this._endPoint.x,
				this._endPoint.y,
				1,
				0x000000,
				0xff0000,
				0.0,
				1.0,
				true
			);

			this._container.cache(
				this._beginPoint.x,
				this._beginPoint.y,
				this._endPoint.x,
				this._endPoint.y
			);
		}
		
		concreteRelease()
		{
			this._parameters = null;
			
			this.KillChargeUpParticles();
		}
		
		concreteDestroy()
		{
			this._beginPoint = null;
			this._endPoint = null;

			if (this._chargeUpParticlesPos)
			{
				this._chargeUpParticlesPos.Clean();
				this._chargeUpParticlesPos = null;
			}

			this._charge_up_particles = null;
			this._kill_charge_up_particles = null;
			this._blast_particles = null;
		}
		
		ChargeUpParticles()
		{
			this._chargeUpParticlesController = ParticleSystemManager.GetSystem("LaserChargeUp", this._chargeUpParticlesPos, true);
		}
		
		KillChargeUpParticles()
		{
			if (this._chargeUpParticlesController)
			{
				this._chargeUpParticlesController._clear = true;
			}
			
			this._chargeUpParticlesController = null;
		}
		
		BlastParticles(length)
		{
			this._particleInitArgument = ParticleSystemInitializationManager.getArguments("LaserBlast");
			this._particleInitArgument._systemProps[1] = length / 2;
			this._particleInitArgument._systemProps[2] = 0;
			this._particleInitArgument._systemProps[3] = this._particleInitArgument._systemProps[1];
			
			ParticleSystemManager.GetSystem("LaserBlast", this._chargeUpParticlesPos);
		}
	}

	window.LaserRenderer = LaserRenderer;
}