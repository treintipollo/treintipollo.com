"use strict";

{
	class CityRenderer extends Renderer
	{
		constructor()
		{
			super();

			this._container = new Container();

			this._currentCityIndexes = [];
			this._parameters = null;
			
			this._centerCity = [-1, 0, 1];
			this._leftCity = [0, 1, 2, 3];
			this._rightCity = [0, 1, 2, 3];
			this._cracksSet = 0;
			this._crackedDomeIndex = 0;

			this._shardParticlesPos = new SharedPoint();
			this._destructionParticlePos = new SharedPoint();
			this._smokeParticlesController = null;

			this._on_nuclear_blast_done = (system) => this.onNuclearBastDone(system);
		}
		
		initComplete()
		{
			this._parameters = this._logic.ExternalParameters;
		}
		
		childInit(params)
		{
			this.draw();
		}
		
		concreteDraw()
		{
			this.drawAll(true, true, false);
		}
		
		concreteRelease()
		{
			if (this._smokeParticlesController)
			{
				this._smokeParticlesController._clear = true;
			}
			
			this._smokeParticlesController = null;
		}
		
		concreteDestroy()
		{
			if (this._shardParticlesPos)
			{
				this._shardParticlesPos.Clean();
				this._shardParticlesPos = null;
			}

			if (this._destructionParticlePos)
			{
				this._destructionParticlePos.Clean();
				this._destructionParticlePos = null;
			}

			this._on_nuclear_blast_done = null;

			this._currentCityIndexes	= null;
			this._centerCity			= null;
			this._leftCity 				= null;
			this._rightCity 			= null;
			this._parameters            = null;
		}
		
		update(deltaTime)
		{
			if (this._parameters["damageTaken"])
			{
				// city, saveCityIndexes, cracks, destroyDome
				this.drawAll(true, false, true, false);

				this._shardParticlesPos.x = this._logic._x;
				this._shardParticlesPos.y = this._logic._y;
			
				ParticleSystemManager.GetSystem("DomeCrack", this._shardParticlesPos);

				this._parameters["damageTaken"] = false;
			}
			else if (this._parameters["domeDestroyed"])
			{
				// city, saveCityIndexes, cracks, destroyDome
				this.drawAll(true, false, false, true);

				this._shardParticlesPos.x = this._logic._x;
				this._shardParticlesPos.y = this._logic._y;
			
				ParticleSystemManager.GetSystem("DomeCrack", this._shardParticlesPos);
				
				this._parameters["domeDestroyed"] = false;
			}
			else if (this._parameters["cityDestroyed"])
			{
				// city, saveCityIndexes, cracks, destroyDome
				this.drawAll(false, false, false, true);

				this._destructionParticlePos.x = this._logic._x;
				this._destructionParticlePos.y = this._logic._y;
			
				ParticleSystemManager.GetSystem("CityDestruction", this._destructionParticlePos, false, this._on_nuclear_blast_done);

				this._parameters["cityDestroyed"] = false;
			}
			else if (this._parameters["rebuildCity"])
			{
				// city, saveCityIndexes, cracks, destroyDome
				this.drawAll(true, false, false, true);

				if (this._smokeParticlesController)
				{
					this._smokeParticlesController._clear = true;
					this._smokeParticlesController 	   	  = null;
				}

				this._parameters["rebuildCity"] = false;
			}
			else if (this._parameters["rebuildDome"])
			{
				// city, saveCityIndexes, cracks, destroyDome
				this.drawAll(true, false, false, false);
				
				this._parameters["rebuildDome"] = false;
			}
		}
		
		drawAll(city, saveCityIndexes, cracks, destroyDome)
		{
			this._container.removeAllChildren();
			
			this.drawCity(city, saveCityIndexes);
			this.drawBases();
			this.drawDome(destroyDome);
			this.drawCracks(cracks);
		}

		drawCracks(draw)
		{
			if (!draw)
				return;

			if (this._logic.Hp === this._logic.TotalHp)
				return;

			this._shardParticlesPos.x = this._logic._x;
			this._shardParticlesPos.y = this._logic._y;
			
			ParticleSystemManager.GetSystem("DomeCrack", this._shardParticlesPos);

			const damageIndex = Math.abs(this._logic.Hp - this._logic.TotalHp + 1);

			this.addCityPart(`cracks-${this._cracksSet}-${damageIndex}`);
		}
		
		onNuclearBastDone(system)
		{
			if (this._logic && !this._smokeParticlesController)
			{
				if (this._logic.ExternalParameters["cityAlreadyDestroyed"])
				{
					this._destructionParticlePos.x = this._logic._x;
					this._destructionParticlePos.y = this._logic._y;
					
					this._smokeParticlesController = ParticleSystemManager.GetSystem("CitySmoke", this._destructionParticlePos, true);
				}
			}
		}
		
		drawBases()
		{
			this.addCityPart("bases");
		}
		
		drawDome(destroyed)
		{
			if (destroyed)
			{
				this.addCityDestroyedDome();
			}
			else
			{
				this.addCityPart("dome");
			}
		}
		
		drawCity(draw, saveCityIndexes)
		{
			if (saveCityIndexes)
			{
				this._currentCityIndexes.length = 0;

				let randomCityPartIndex = NumberUtils.randRange(0, this._centerCity.length - 1, true);
				this._currentCityIndexes.push(randomCityPartIndex);
				
				randomCityPartIndex = NumberUtils.randRange(0, this._leftCity.length - 1, true);
				this._currentCityIndexes.push(randomCityPartIndex);
				
				randomCityPartIndex = NumberUtils.randRange(0, this._rightCity.length - 1, true);
				this._currentCityIndexes.push(randomCityPartIndex);

				this._cracksSet = NumberUtils.randRange(0, 4, true);

				this._crackedDomeIndex = NumberUtils.randRange(0, 7, true);
			}

			if (draw)
			{
				this.addCityPart(`city-center-${this._currentCityIndexes[0]}`);
				this.addCityPart(`city-left-${this._currentCityIndexes[1]}`);
				this.addCityPart(`city-right-${this._currentCityIndexes[2]}`);
			}
		}

		addCityPart(id)
		{
			const sprite = window.DynamicGraphics.GetSprite(id);

			this._container.addChild(sprite);
		}

		addCityDestroyedDome()
		{
			const sprite = window.DynamicGraphics.GetDestroyedDomeSprite(this._crackedDomeIndex);

			this._container.addChild(sprite);
		}
	}

	window.CityRenderer = CityRenderer;
}