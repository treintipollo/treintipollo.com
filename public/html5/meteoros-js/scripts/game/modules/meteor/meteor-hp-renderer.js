"use strict";

{
	class MeteorHPRenderer extends Renderer
	{
		constructor()
		{
			super();

			this._particleSystemController = null;
			this._hitCityParticlesController = null;
			this._radius = 0;
			this._currentRadius = 0;
			this._vertexOffset = 0;
			this._vertexes = null;
			this._color = 0;
			this._particlesId = "";
			
			this._container 		  = new Sprite();
			this._particlesPos 	      = new SharedPoint();
			this._cityHitParticlesPos = new SharedPoint();

			this._change_size = (newSize) => this.changeSize(newSize);
			this._city_hit = () => this.cityHit();
			this._on_missile_hit = () => this.missileHit();
		}
		
		childInit(params)
		{
			this._radius        = params[0];
			this._vertexOffset  = params[1];
			this._vertexes 		= params[2];
			this._color		    = params[3];
			this._particlesId   = params[4];
			
			this._currentRadius = this._radius;
			
			this.draw(false);
		}
		
		concreteDraw()
		{
			const parent = this._container.parent;

			if (parent)
			{
				const index = parent.getChildIndex(this._container);

				const sprite = window.DynamicGraphics.GetMeteorSprite(
					"meteor-hp",
					this._currentRadius,
					this._vertexes.length,
					this._vertexOffset,
					this._color
				);

				parent.removeChild(this._container);
				parent.addChildAt(sprite, index);
				
				this._container = sprite;
			}
			else
			{
				this._container = window.DynamicGraphics.GetMeteorSprite(
					"meteor-hp",
					this._currentRadius,
					this._vertexes.length,
					this._vertexOffset,
					this._color
				);
			}
		}
		
		initComplete()
		{
			this._logic.ExternalParameters["redraw"] = this._change_size;
			this._logic.ExternalParameters["cityHit"] = this._city_hit;
			this._logic.ExternalParameters["missileHit"] = this._on_missile_hit;
		}
		
		concreteDestroy()
		{
			if (this._particlesPos)
			{
				this._particlesPos.Clean();
				this._particlesPos = null;
			}

			if (this._cityHitParticlesPos)
			{
				this._cityHitParticlesPos.Clean();
				this._cityHitParticlesPos = null;
			}

			this._vertexes 	 			= null;
			this._change_size 			= null;
			this._city_hit 				= null;
		}
		
		concreteUpdate(deltaTime)
		{
			this._particlesPos.x = this._container.x;
			this._particlesPos.y = this._container.y;
			
			if (this._particleSystemController)
			{
				this._particleSystemController._rotation = this._logic.InitRotation + 90;
			}
		}
		
		concreteRemoveFromStage()
		{
			if (this._particleSystemController)
			{
				this._particleSystemController._clear = true;
			}

			if (this._controller1)
			{
				this._controller1._clear = true;
			}
			
			if (this._controller2)
			{
				this._controller2._clear = true;
			}

			if (this._controller3)
			{
				this._controller3._clear = true;
			}
			
			this._particleSystemController = null;
			this._hitCityParticlesController = null;

			this._controller1 = null;
			this._controller2 = null;
			this._controller3 = null;
		}
		
		changeSize(newRadius)
		{
			if (!this._particleSystemController)
			{
				this._particleSystemController = ParticleSystemManager.GetSystem(this._particlesId, this._particlesPos, true);

			}
			
			this._currentRadius = newRadius;
			
			this._particleSystemController.system.SetRadius(this._currentRadius - 5);
			
			this.draw(false);
		}
		
		cityHit()
		{
			this._cityHitParticlesPos.x = this._container.x;
			this._cityHitParticlesPos.y = this._container.y;
			
			this._hitCityParticlesController = ParticleSystemManager.GetSystem("MeteorCityHit", this._cityHitParticlesPos, true);
			
			if (this._hitCityParticlesController)
			{
				this._hitCityParticlesController._rotation = this._logic.InitRotation + 90;
			}
		}

		missileHit()
		{
			this._controller1 = ParticleSystemManager.GetSystem("MeteorExplosion", new SharedPoint(this._logic._x + NumberUtils.randRange(-10, 10), this._logic._y + NumberUtils.randRange(-10, 10)), true);
			this._controller2 = ParticleSystemManager.GetSystem("MeteorExplosion", new SharedPoint(this._logic._x + NumberUtils.randRange(-10, 10), this._logic._y + NumberUtils.randRange(-10, 10)), true);
			this._controller3 = ParticleSystemManager.GetSystem("MeteorExplosion", new SharedPoint(this._logic._x + NumberUtils.randRange(-10, 10), this._logic._y + NumberUtils.randRange(-10, 10)), true);
		}
	}

	window.MeteorHPRenderer = MeteorHPRenderer;
}